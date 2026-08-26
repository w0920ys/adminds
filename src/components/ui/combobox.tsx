import * as React from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { controlShellVariants, inputVariants } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { filterOptions, type ComboboxOption } from '@/lib/filter-options'
import { cn } from '@/lib/utils'

export type { ComboboxOption }

type ComboboxSize = 'sm' | 'default' | 'lg'

/**
 * 트리거는 Select의 트리거와 같은 껍데기(controlShellVariants)를 쓴다 —
 * 나란히 놓여도 높이·테두리·포커스 링이 어긋나지 않는다. 다만 실제 태그는
 * button이 아니라 div다. multiple에서 각 배지 안에 지우는 버튼이 들어가는데,
 * button 안에 button을 두면 브라우저가 DOM을 잘못 파싱한다 — 그래서 트리거
 * 전체를 button 대신 tabIndex와 키보드 핸들러를 직접 단 div로 만든다.
 */
const MIN_HEIGHT_MULTIPLE: Record<ComboboxSize, string> = {
  sm: 'min-h-control-sm',
  default: 'min-h-control',
  lg: 'min-h-control-lg',
}

type ComboboxRestProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onClick' | 'onKeyDown' | 'className' | 'children' | 'tabIndex' | 'role'
>

type ComboboxCommonProps = ComboboxRestProps & {
  options: ComboboxOption[]
  size?: ComboboxSize
  disabled?: boolean
  /** 아무것도 고르지 않았을 때 트리거에 보이는 문구 */
  placeholder?: string
  /** 열린 표면 안의 검색 칸 자리표시자 */
  searchPlaceholder?: string
  /** 걸러진 결과가 없을 때 목록 자리에 보이는 문구 */
  emptyMessage?: string
  className?: string
  /*
   * Anatomy가 트리거 안 값 영역에 data-anatomy를 주입할 때 쓴다 —
   * Combobox 자신은 문서 시스템의 표시를 모른다. JSX 속성 자리의
   * data-*는 TypeScript가 따로 허용하지만 객체 리터럴로 넘기는
   * 이 자리는 그 예외를 받지 않아 data-* 인덱스 시그니처를 더한다.
   */
  valueProps?: React.ComponentPropsWithoutRef<'span'> & { [key: `data-${string}`]: string }
}

type ComboboxSingleProps = ComboboxCommonProps & {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ComboboxMultipleProps = ComboboxCommonProps & {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps

/**
 * single·multiple 두 갈래로 나뉜 공개 타입을 구현부 안에서까지 그대로
 * 따지면 매 분기마다 타입을 좁혀야 한다. 실제 값 처리는 두 갈래가 같은
 * 모양(문자열이거나 문자열 배열)이라 내부에서는 넓힌 모양 하나로 다룬다 —
 * 바깥에서 보는 타입 안전성은 ComboboxProps가 그대로 지킨다.
 */
type ComboboxInternalProps = ComboboxCommonProps & {
  multiple?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

/*
 * 키보드는 이 컴포넌트가 직접 다룬다 — Radix가 대신해 주지 않는다.
 * 짚은 항목은 상태(activeIndex) 하나로 관리하고, 검색 입력의
 * aria-activedescendant가 그 인덱스가 가리키는 항목의 id를 알린다.
 * 마우스 hover도 같은 activeIndex를 옮겨서 키보드로 짚은 것과 마우스로
 * 짚은 것이 항상 같은 항목을 가리키게 한다 — 두 상태가 따로 놀면 화면에
 * 보이는 강조와 스크린리더가 읽는 항목이 어긋난다.
 */
function Combobox(props: ComboboxProps) {
  const {
    options,
    size = 'default',
    disabled = false,
    placeholder = '선택하세요',
    searchPlaceholder = '검색어를 입력하세요',
    emptyMessage = '일치하는 항목이 없습니다',
    className,
    valueProps,
    multiple,
    value,
    defaultValue,
    onValueChange,
    ...rest
  } = props as ComboboxInternalProps

  const isMultiple = multiple === true

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [uncontrolled, setUncontrolled] = React.useState<string | string[]>(
    () => defaultValue ?? (isMultiple ? [] : ''),
  )

  const selected = value !== undefined ? value : uncontrolled
  const selectedValues = React.useMemo<string[]>(() => {
    if (isMultiple) return (selected as string[]) ?? []
    return selected ? [selected as string] : []
  }, [isMultiple, selected])

  const listId = React.useId()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => filterOptions(options, query), [options, query])
  const activeOption = filtered[activeIndex]
  const activeId = activeOption ? `${listId}-option-${activeOption.value}` : undefined

  /*
   * 열릴 때 검색 입력으로 포커스를 옮기는 일은 DOM(바깥 시스템)과
   * 동기화하는 일이라 effect가 맞다. 짚은 항목을 되돌리는 setActiveIndex는
   * 열림 자체가 원인일 때만 여기 둔다 — 검색어가 바뀔 때의 초기화는
   * onChange 핸들러가 그 이벤트에서 바로 처리한다(아래 참고).
   */
  React.useEffect(() => {
    if (open) {
      setActiveIndex(0)
      const frame = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
    setQuery('')
  }, [open])

  function commit(next: string | string[]) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function toggleOption(option: ComboboxOption) {
    if (isMultiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value]
      commit(next)
      inputRef.current?.focus()
    } else {
      commit(option.value)
      setOpen(false)
    }
  }

  function removeValue(target: string) {
    commit(selectedValues.filter((v) => v !== target))
  }

  function handleTriggerClick() {
    if (disabled) return
    setOpen((o) => !o)
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        event.preventDefault()
        if (activeOption) toggleOption(activeOption)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  const selectedOptions = options.filter((o) => selectedValues.includes(o.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          {...rest}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          data-slot="combobox-trigger"
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            controlShellVariants({ size }),
            'cursor-pointer items-center justify-between gap-2 text-left',
            isMultiple && cn('h-auto flex-wrap gap-1.5 py-1.5', MIN_HEIGHT_MULTIPLE[size]),
            disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            className,
          )}
        >
          <span
            {...valueProps}
            className={cn(
              'flex flex-1 flex-wrap items-center gap-1',
              !isMultiple && 'truncate',
              valueProps?.className,
            )}
          >
            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
            {!isMultiple &&
              selectedOptions.length > 0 && <span className="truncate">{selectedOptions[0].label}</span>}
            {isMultiple &&
              selectedOptions.map((option) => (
                <Badge key={option.value} className="gap-1 py-0.5 pr-1">
                  <span className="max-w-32 truncate">{option.label}</span>
                  <button
                    type="button"
                    aria-label={`'${option.label}' 선택 해제`}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (!disabled) removeValue(option.value)
                    }}
                    className="hover:bg-foreground/10 rounded-xs"
                  >
                    <X size={10} aria-hidden />
                  </button>
                </Badge>
              ))}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <div className="relative border-b p-1.5">
          <Search
            aria-hidden
            size={14}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label={searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className={inputVariants({ size: 'sm', className: 'pl-7' })}
          />
        </div>

        <div
          role="listbox"
          id={listId}
          aria-multiselectable={isMultiple || undefined}
          className="max-h-64 overflow-y-auto p-1"
        >
          {filtered.length === 0 ? (
            <p className="text-muted-foreground px-2 py-3 text-center text-sm">{emptyMessage}</p>
          ) : (
            filtered.map((option, index) => {
              const isSelected = selectedValues.includes(option.value)
              const isActive = index === activeIndex
              return (
                <div
                  key={option.value}
                  id={`${listId}-option-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none',
                    isActive && 'bg-accent text-accent-foreground',
                  )}
                >
                  {option.label}
                  {isSelected && (
                    <span className="absolute right-2 grid place-items-center">
                      <Check className="size-4" aria-hidden />
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
