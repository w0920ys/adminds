import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatFileSize } from '@/lib/file-size'
import { cn } from '@/lib/utils'

/*
 * 이 컴포넌트는 파일을 올리지 않는다. 여기서 하는 일은 파일을 고르고(클릭
 * 또는 드래그) 목록으로 보여주는 것까지다 — 실제 전송은 이 화면을 쓰는
 * 서비스의 몫이다. onFilesSelected로 고른 파일을 올려보내고, 진행률·성공·
 * 실패는 그 서비스가 FileUploadItem에 progress·error 값으로 내려준다.
 */

type FileUploadContextValue = {
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled: boolean
  invalid: boolean
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  openDialog: () => void
  selectFiles: (files: File[]) => void
}

const FileUploadContext = React.createContext<FileUploadContextValue>({
  inputRef: { current: null },
  disabled: false,
  invalid: false,
  isDragging: false,
  setIsDragging: () => {},
  openDialog: () => {},
  selectFiles: () => {},
})

function useFileUploadContext(): FileUploadContextValue {
  return React.useContext(FileUploadContext)
}

type FileUploadProps = React.ComponentProps<'div'> & {
  disabled?: boolean
  /** aria-invalid와 짝지어 테두리·문구 색을 함께 바꾼다 */
  invalid?: boolean
  /** 파일을 여러 개 고를 수 있는지. 네이티브 input의 multiple로 그대로 이어진다 */
  multiple?: boolean
  /** 네이티브 input의 accept. 허용 형식은 이것과 별개로 Constraint 문구에도 미리 적는다 */
  accept?: string
  /** 파일 창에서 고르거나 끌어다 놓아 정해진 파일들. 목록에 담아두는 일은 호출하는 쪽의 몫이다 */
  onFilesSelected?: (files: File[]) => void
}

/*
 * 루트는 눈에 보이는 것을 그리지 않는다 — 네이티브 input과 context를 마련해
 * 자식(FileUploadDropzone·FileUploadList·FileUploadItem)에게 넘길 뿐이다.
 * 파일 선택은 두 갈래로 들어온다: input의 onChange(클릭으로 고른 경우)와
 * FileUploadDropzone의 onDrop(끌어다 놓은 경우). 두 갈래 모두 selectFiles
 * 하나로 모아 onFilesSelected를 부르므로 multiple을 지키는 규칙이
 * 한 곳에만 있다.
 */
function FileUpload({
  disabled = false,
  invalid = false,
  multiple = false,
  accept,
  onFilesSelected,
  className,
  children,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const selectFiles = React.useCallback(
    (files: File[]) => {
      if (files.length === 0) return
      onFilesSelected?.(multiple ? files : files.slice(0, 1))
    },
    [multiple, onFilesSelected],
  )

  const openDialog = React.useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    selectFiles(Array.from(event.target.files ?? []))
    // 같은 파일을 다시 골라도 change가 다시 뜨도록 값을 비운다
    event.target.value = ''
  }

  const contextValue = React.useMemo<FileUploadContextValue>(
    () => ({ inputRef, disabled, invalid, isDragging, setIsDragging, openDialog, selectFiles }),
    [disabled, invalid, isDragging, openDialog, selectFiles],
  )

  return (
    <FileUploadContext.Provider value={contextValue}>
      <div data-slot="file-upload" className={cn('flex flex-col gap-3', className)} {...props}>
        {/*
         * display: none과 visibility: hidden은 접근성 트리는 물론 탭 순서에서도
         * 요소를 통째로 걷어낸다. 이 input 자체는 탭으로 닿지 않게 할 생각이라도
         * (아래 tabIndex=-1) 걷어내는 방식은 sr-only로 남긴다 — 스크린 리더가
         * 요소 자체를 아예 없는 것으로 읽지 않게 하기 위해서다. 실제로 탭이
         * 멈추는 자리는 FileUploadDropzone(진짜 button)이고, 이 input은 그
         * button이 .click()으로 여는 창구일 뿐이라 tabIndex=-1로 이중 탭 정지를
         * 막는다.
         */}
        <input
          ref={inputRef}
          type="file"
          data-slot="file-upload-input"
          className="sr-only"
          tabIndex={-1}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  )
}

type FileUploadDropzoneVariant = 'dropzone' | 'button'

/*
 * disabled·onClick·onDrag*는 이 컴포넌트가 context에서 읽어 스스로 정한다 —
 * 소비자가 넘겨도 조용히 덮이는 대신 애초에 타입에서 걷어내 그런 시도
 * 자체가 컴파일 단계에서 막히게 한다. Combobox·DatePicker의 Rest 타입과
 * 같은 이유다.
 */
type FileUploadDropzoneProps = Omit<
  React.ComponentProps<'button'>,
  | 'children'
  | 'disabled'
  | 'onClick'
  | 'onKeyDown'
  | 'onDragEnter'
  | 'onDragOver'
  | 'onDragLeave'
  | 'onDrop'
> & {
  variant?: FileUploadDropzoneVariant
  children: React.ReactNode
}

/*
 * variant가 이 컴포넌트의 모양을 통째로 바꾼다 — dropzone은 점선 테두리의
 * 넓은 영역, button은 진짜 Button 하나다(크기·색은 Button 자기 문서가 정한
 * 뜻을 그대로 따른다). 둘 다 진짜 <button>이라 Tab으로 닿고 Enter·Space로
 * 누를 수 있다 — 끌어다 놓기는 키보드로 할 수 없으므로 누르는 길이 항상
 * 함께 있어야 한다. 드래그 핸들러는 dropzone에만 건다 — 작은 버튼 위로
 * 파일을 끄는 동작은 이 시스템이 지지하는 사용법이 아니다.
 */
function FileUploadDropzone({
  variant = 'dropzone',
  className,
  children,
  ...props
}: FileUploadDropzoneProps) {
  const { disabled, invalid, isDragging, setIsDragging, openDialog, selectFiles } =
    useFileUploadContext()

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    selectFiles(Array.from(event.dataTransfer.files))
  }

  /*
   * 진짜 <button>이라 Enter·Space는 브라우저가 기본으로도 열어준다. 그래도
   * 여기서 한 번 더 직접 잡는다 — keydown에서 preventDefault로 막아 두면
   * 브라우저의 기본 클릭 합성과 겹쳐 openDialog가 두 번 불리는 일이 없다.
   * Combobox·DatePicker의 트리거가 이미 같은 방식으로 Enter·Space를 스스로
   * 잡는다.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDialog()
    }
  }

  if (variant === 'button') {
    return (
      <Button
        type="button"
        data-slot="file-upload-dropzone"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onClick={openDialog}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <button
      type="button"
      data-slot="file-upload-dropzone"
      data-dragging={isDragging || undefined}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onClick={openDialog}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex w-full flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-input bg-background px-6 py-8 text-center outline-none transition',
        'cursor-pointer hover:border-ring/60',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
        'dragging:border-primary dragging:bg-primary/5',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function FileUploadList({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul data-slot="file-upload-list" className={cn('flex flex-col gap-2', className)} {...props} />
  )
}

type FileUploadItemProps = Omit<React.ComponentProps<'li'>, 'children'> & {
  /** 파일 이름 */
  name: string
  /** 바이트 단위 크기. 있으면 formatFileSize로 사람이 읽는 단위로 보인다 */
  size?: number
  /** 0~100. 올리는 중일 때만 준다 — 없으면 진행률 자리 자체를 그리지 않는다 */
  progress?: number
  /**
   * 실패 이유. 실패한 파일을 목록에서 지우지 않고 이 문구와 함께 남겨
   * 다시 시도할 수 있게 한다 — 지우는 것은 onRemove를 누른 뒤에만 일어난다
   */
  error?: string
  /** 없으면 지우기 버튼 자체를 그리지 않는다 */
  onRemove?: () => void
  /** 지우기 버튼의 aria-label. 기본은 파일 이름을 포함해 스크린 리더가 어떤 파일인지 구분하게 한다 */
  removeLabel?: string
  /*
   * 지우기 버튼(내부 요소)은 소비자가 직접 닿을 수 없다. data-anatomy 같은
   * 임의 속성을 그대로 전달하는 통로만 열어 둔다 — Progress의 indicatorProps와
   * 같은 자리다.
   */
  removeButtonProps?: React.ComponentProps<'button'> & { [dataAttr: `data-${string}`]: string }
}

function FileUploadItem({
  name,
  size,
  progress,
  error,
  onRemove,
  removeLabel,
  removeButtonProps,
  className,
  ...props
}: FileUploadItemProps) {
  return (
    <li
      data-slot="file-upload-item"
      aria-invalid={error ? true : undefined}
      className={cn(
        'border-input bg-background flex flex-col gap-1.5 rounded-md border px-3 py-2.5',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          {size != null && <p className="text-muted-foreground text-xs">{formatFileSize(size)}</p>}
        </div>
        {onRemove && (
          <button
            type="button"
            {...removeButtonProps}
            data-slot="file-upload-item-remove"
            onClick={onRemove}
            aria-label={removeLabel ?? `${name} 지우기`}
            className={cn(
              'text-muted-foreground shrink-0 rounded-xs p-1 outline-none transition-colors hover:text-foreground',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
              removeButtonProps?.className,
            )}
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
      {progress != null && <Progress value={progress} size="sm" />}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </li>
  )
}

export { FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem }
export type { FileUploadProps, FileUploadDropzoneProps, FileUploadItemProps, FileUploadDropzoneVariant }
