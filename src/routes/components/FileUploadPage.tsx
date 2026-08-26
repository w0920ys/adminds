import * as React from 'react'
import type { ReactNode } from 'react'
import { UploadCloud } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
} from '@/components/ui/file-upload'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type DemoVariant = 'dropzone' | 'button'
type DemoLayout = 'single' | 'multiple'

/** 목록에 쌓는 데모 파일. 실제 File 객체가 아니라 이름·크기만 흉내 낸 값이다 */
type DemoFile = { id: string; name: string; size: number }

let demoFileSeq = 0
function toDemoFile(file: File): DemoFile {
  demoFileSeq += 1
  return { id: `${file.name}-${demoFileSeq}`, name: file.name, size: file.size }
}

/*
 * 파일 목록은 FileUpload가 아니라 호출하는 쪽이 상태로 들고 있는다 —
 * 컴포넌트 자신은 파일을 올리지 않으므로 무엇을 골랐는지 기억하는 일도
 * 이 데모 화면(실제로는 그 자리에 서비스 화면)의 몫이다. layout이 single이면
 * 새로 고른 파일이 이전 파일을 대신하고, multiple이면 목록에 더한다 —
 * 그 규칙조차 FileUpload 안에 있지 않고 여기 handleFilesSelected에 있다.
 *
 * label을 주면 Field·FieldLabel·FieldControl로 트리거를 감싼다 — Input·
 * Combobox·Date Picker가 Usage 예시에서 실제 화면처럼 라벨을 다는 것과
 * 같은 이유다(Playground·Properties·Guidelines처럼 축 자체를 보이는
 * 자리는 label을 주지 않아 예전처럼 라벨 없이 그린다). Dropzone·button
 * 두 변형 모두 FileUploadDropzone이 진짜 <button>을 그리고 button은
 * label의 대상이 될 수 있는(labelable) 요소라 Combobox·DatePicker의
 * 트리거(<div role="button">)처럼 FieldLabel의 onClick으로 포커스를
 * 대신 옮겨줄 필요가 없다 — label을 눌러도 브라우저가 알아서 그 id를
 * 가진 button에 포커스를 주고 클릭까지 전달한다.
 */
function DemoFileUpload({
  variant,
  layout,
  disabled,
  invalid,
  errorText,
  label,
  initialFiles = [],
  instruction = '파일을 끌어다 놓거나 눌러서 올리세요',
  constraint = 'PNG, JPG · 최대 5MB',
  buttonLabel = '파일 선택',
  className,
}: {
  variant: DemoVariant
  layout: DemoLayout
  disabled?: boolean
  invalid?: boolean
  /** Field로 감싼 데모에서 오류 문구로 쓸 글. invalid와 label이 함께 있을 때만 그린다 */
  errorText?: string
  label?: string
  initialFiles?: DemoFile[]
  instruction?: string
  constraint?: string
  buttonLabel?: string
  className?: string
}) {
  const [files, setFiles] = React.useState<DemoFile[]>(initialFiles)
  const multiple = layout === 'multiple'

  function handleFilesSelected(selected: File[]) {
    const next = selected.map(toDemoFile)
    setFiles((prev) => (multiple ? [...prev, ...next] : next))
  }

  /*
   * 오류는 컨트롤 자신에게 붙은 aria-invalid로 나타낸다 — Input·Select 문서가
   * 같은 축을 같은 방식으로 그린다. 다만 그 속성이 어디서 오는지는 이 데모가
   * Field로 감싸였는지에 따라 갈린다.
   *
   * Field로 감싸지 않은 자리(Playground·Properties)에서는 여기서 dropzone에
   * 직접 단다. Field로 감싼 자리에서는 Field state="error"에 맡긴다 —
   * FieldControl이 Slot으로 aria-invalid를 자식에게 내려 주는 그 길이다.
   * 감싼 쪽에서 invalidProps를 아예 비워 두는 것이 이 길의 조건이다:
   * Slot의 mergeProps는 자식이 그 이름의 프로퍼티를 undefined로라도 들고
   * 있으면 자식 쪽을 남기므로, aria-invalid={undefined}를 함께 넘기면
   * Field가 내려준 값이 지워진다. 아래 Cases의 '오류를 알리는 경우'가
   * 실제로 이 길을 지난다.
   */
  const fieldWrapped = Boolean(label)
  const invalidProps = invalid && !fieldWrapped ? ({ 'aria-invalid': true } as const) : {}

  const dropzone = (
    <FileUploadDropzone variant={variant} {...invalidProps}>
      {variant === 'dropzone' ? (
        <>
          <UploadCloud className="text-muted-foreground size-6" aria-hidden />
          <p className="text-sm font-medium">{instruction}</p>
          <p className="text-muted-foreground text-xs">{constraint}</p>
        </>
      ) : (
        buttonLabel
      )}
    </FileUploadDropzone>
  )

  return (
    <FileUpload
      disabled={disabled}
      multiple={multiple}
      onFilesSelected={handleFilesSelected}
      className={className}
    >
      {label ? (
        <Field state={invalid ? 'error' : 'default'}>
          <FieldLabel>{label}</FieldLabel>
          <FieldControl>{dropzone}</FieldControl>
          {invalid && errorText && <FieldError>{errorText}</FieldError>}
        </Field>
      ) : (
        dropzone
      )}
      {files.length > 0 && (
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem
              key={file.id}
              name={file.name}
              size={file.size}
              onRemove={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
            />
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  )
}

/*
 * variant가 모양을 통째로 바꾼다(점선 영역 ↔ 버튼) — FileUploadDropzone이
 * 그 변형에 따라 실제로 다른 태그를 그리므로 같은 자리에서 axis만 눌러도
 * 유령 상태 없이 다시 마운트된다. layout·disabled·invalid는 이미 마운트된
 * DemoFileUpload에 프로퍼티로만 흘러 들어가고 파일 목록 자체의 모양을
 * 바꾸지 않으므로 Slider가 defaultValue에서 겪은 함정과는 다르다 — 그래도
 * Properties·Playground 두 자리 모두에서 세 축을 번갈아 눌러 실제로
 * 확인했다.
 */
function renderFileUpload(options: RenderOptions) {
  const { variant, state, layout } = options
  return (
    <DemoFileUpload
      variant={variant as DemoVariant}
      layout={layout as DemoLayout}
      disabled={state === 'disabled'}
      invalid={state === 'invalid'}
      className="w-72"
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 FileUpload·
 * FileUploadDropzone·FileUploadList·FileUploadItem으로 만든 어드민 화면의
 * 한 조각이다. 진행률·오류가 있는 FileUploadItem은 실제로 파일을 고르게
 * 해서 재현할 수 없으므로(그 순간을 사용자가 만들 수 없다) 이름·크기·
 * progress·error 값을 직접 쥐여준다 — DatePicker가 REFERENCE_DATE를
 * 고정해 쓰는 것과 같은 이유다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'clickable-button':
      // 이 컴포넌트의 dropzone은 항상 클릭도 받는다 — 끌어다 놓기만 되고
      // 클릭은 안 받는 영역은 공개 API로 만들 수 없어 dont 쪽에 대응하는
      // 예시를 두지 않는다
      return kind === 'do' ? (
        <DemoFileUpload variant="dropzone" layout="single" className="w-64" />
      ) : null

    case 'announce-format-and-size':
      return kind === 'do' ? (
        <DemoFileUpload
          variant="dropzone"
          layout="single"
          constraint="PNG, JPG · 최대 5MB"
          className="w-64"
        />
      ) : (
        // Constraint 문구 자체를 아예 두지 않은 dropzone — DemoFileUpload는
        // 기본 constraint를 늘 붙이므로 여기서는 직접 조립해 그 자리를 비운다
        <FileUpload multiple={false} onFilesSelected={() => {}} className="w-64">
          <FileUploadDropzone variant="dropzone">
            <UploadCloud className="text-muted-foreground size-6" aria-hidden />
            <p className="text-sm font-medium">파일을 끌어다 놓거나 눌러서 올리세요</p>
          </FileUploadDropzone>
        </FileUpload>
      )

    case 'show-progress':
      return kind === 'do' ? (
        <FileUploadList className="w-64">
          <FileUploadItem name="브랜드_가이드.pdf" size={18_400_000} progress={62} />
        </FileUploadList>
      ) : (
        <FileUploadList className="w-64">
          <FileUploadItem name="브랜드_가이드.pdf" size={18_400_000} />
        </FileUploadList>
      )

    case 'keep-failed-files':
      // '지운 경우'는 화면에 아무것도 남지 않아 보일 것이 없다 — dont 쪽에
      // 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <FileUploadList className="w-64">
          <FileUploadItem
            name="계약서_스캔.png"
            size={9_800_000}
            error="5MB를 넘어 올릴 수 없습니다"
            onRemove={() => {}}
          />
        </FileUploadList>
      ) : null

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'profile-image':
      return (
        <DemoFileUpload
          variant="button"
          layout="single"
          label="프로필 이미지"
          buttonLabel="프로필 이미지 선택"
          className="w-56"
        />
      )

    case 'bulk-import':
      return (
        <DemoFileUpload
          variant="dropzone"
          layout="single"
          label="회원 목록 파일"
          instruction="회원 목록 파일을 끌어다 놓거나 눌러서 올리세요"
          constraint="CSV · 최대 20MB"
          className="w-72"
        />
      )

    case 'attachment':
      return (
        <DemoFileUpload
          variant="dropzone"
          layout="multiple"
          label="첨부 파일"
          instruction="첨부 파일을 끌어다 놓거나 눌러서 올리세요"
          constraint="문서·이미지 · 파일당 최대 10MB"
          initialFiles={[
            { id: 'a1', name: '견적서.pdf', size: 1_240_000 },
            { id: 'a2', name: '제품사진.jpg', size: 3_800_000 },
          ]}
          className="w-72"
        />
      )

    case 'logo-replace':
      return (
        <DemoFileUpload
          variant="dropzone"
          layout="single"
          label="로고 파일"
          instruction="새 로고 파일을 끌어다 놓거나 눌러서 올리세요"
          constraint="PNG, SVG · 최대 2MB"
          initialFiles={[{ id: 'l1', name: 'logo.svg', size: 84_000 }]}
          className="w-72"
        />
      )

    case 'wrong-format':
      return (
        <FileUploadList className="w-72">
          <FileUploadItem
            name="발표자료.pptx"
            size={4_200_000}
            error="PNG, JPG만 올릴 수 있습니다"
            onRemove={() => {}}
          />
        </FileUploadList>
      )

    case 'over-size-limit':
      return (
        <FileUploadList className="w-72">
          <FileUploadItem
            name="시연영상.mp4"
            size={182_000_000}
            error="5MB를 넘어 올릴 수 없습니다"
          />
        </FileUploadList>
      )

    case 'uploading':
      return (
        <FileUploadList className="w-72">
          <FileUploadItem name="분기보고서.xlsx" size={6_100_000} progress={38} />
        </FileUploadList>
      )

    case 'multiple-files':
      return (
        <FileUploadList className="w-72">
          <FileUploadItem name="견적서.pdf" size={1_240_000} onRemove={() => {}} />
          <FileUploadItem name="제품사진.jpg" size={3_800_000} progress={80} />
          <FileUploadItem
            name="계약서_스캔.png"
            size={9_800_000}
            error="5MB를 넘어 올릴 수 없습니다"
            onRemove={() => {}}
          />
        </FileUploadList>
      )

    /*
     * Field가 오류를 dropzone까지 내려보내는 길을 실제로 지나는 자리다.
     * 여기 dropzone button의 aria-invalid는 이 화면이 직접 단 것이 아니라
     * Field state="error"가 FieldControl의 Slot을 거쳐 내려준 값이고,
     * 이유는 FieldError가 aria-describedby로 같은 button에 이어 준다.
     */
    case 'field-error':
      return (
        <DemoFileUpload
          variant="dropzone"
          layout="single"
          label="사업자등록증"
          invalid
          errorText="PDF만 올릴 수 있습니다"
          instruction="사업자등록증을 끌어다 놓거나 눌러서 올리세요"
          constraint="PDF · 최대 5MB"
          className="w-72"
        />
      )

    default:
      return null
  }
}

/**
 * 무대에는 dropzone 변형 하나에 파일 하나가 이미 담긴 상태를 그린다 —
 * File list·File item·Remove까지 한 인스턴스 안에서 함께 보여야 하기
 * 때문이다. 지우기 버튼은 FileUploadItem 내부 요소라 data-anatomy를
 * removeButtonProps로 내려준다 — Progress의 indicatorProps와 같은 통로다.
 */
function AnatomyPreview() {
  return (
    <div className="w-80">
      <FileUpload multiple onFilesSelected={() => {}}>
        <FileUploadDropzone data-anatomy="dropzone">
          <UploadCloud data-anatomy="icon" className="text-muted-foreground size-6" aria-hidden />
          <p data-anatomy="instruction" className="text-sm font-medium">
            파일을 끌어다 놓거나 눌러서 올리세요
          </p>
          <p data-anatomy="constraint" className="text-muted-foreground text-xs">
            PNG, JPG · 최대 5MB
          </p>
        </FileUploadDropzone>
        <FileUploadList data-anatomy="file-list">
          <FileUploadItem
            data-anatomy="file-item"
            name="brand-guideline.pdf"
            size={2_400_000}
            onRemove={() => {}}
            removeButtonProps={{ 'data-anatomy': 'remove' }}
          />
        </FileUploadList>
      </FileUpload>
    </div>
  )
}

export function FileUploadPage() {
  const meta = getComponent('file-upload')
  if (!meta) return <Placeholder title="File Upload 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderFileUpload}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
