import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { Calendar, type CalendarRange, type CalendarSize } from '@/components/ui/calendar'
import { controlShellVariants } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatISODate } from '@/lib/calendar'
import { cn } from '@/lib/utils'

export type { CalendarRange }
export type DatePickerSize = CalendarSize

/*
 * 트리거는 Combobox와 같은 얼개다 — Select와 같은 껍데기(controlShellVariants)를
 * 쓰고, 실제 태그는 button이 아니라 div다(role="button" + 직접 단 키보드
 * 핸들러). Popover 안에 놓일 Calendar가 이미 button을 여럿 쓰므로, 트리거까지
 * button이면 팝오버가 열렸을 때 button 안에 button이 있는 모양이 된다 —
 * Combobox가 multiple의 배지 지우기 버튼 때문에 겪은 것과 같은 이유다.
 */
/*
 * div의 HTMLAttributes는 defaultValue?: string | number | readonly string[]를
 * 이미 갖고 있다(contentEditable 등 범용 요소를 위한 타입) — 그 위에
 * DatePickerSingleProps·DatePickerRangeProps가 각자 defaultValue를 Date나
 * CalendarRange로 덧대면 둘이 교차해 아무 값도 못 넣는 타입이 된다. 여기서
 * 미리 걷어낸다.
 */
type DatePickerRestProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onClick' | 'onKeyDown' | 'className' | 'children' | 'tabIndex' | 'role' | 'defaultValue'
>

type DatePickerCommonProps = DatePickerRestProps & {
  size?: DatePickerSize
  disabled?: boolean
  /** 아무것도 고르지 않았을 때 트리거에 보이는 자리표시자. 형식을 미리 알린다 */
  placeholder?: string
  /** 이 날짜를 고를 수 없는지 정한다 */
  isDateDisabled?: (date: Date) => boolean
  /** 고를 수 없는 이유 */
  disabledReason?: string
  /** 오늘로 볼 날짜. 문서 페이지가 상수로 고정해 내려준다 */
  today?: Date
  className?: string
  /*
   * Anatomy가 트리거 안 값 영역에 data-anatomy를 주입할 때 쓴다 — DatePicker
   * 자신은 문서 시스템의 표시를 모른다. Combobox의 valueProps와 같은 이유다.
   */
  valueProps?: React.ComponentPropsWithoutRef<'span'> & { [key: `data-${string}`]: string }
}

type DatePickerSingleProps = DatePickerCommonProps & {
  layout?: 'single'
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined) => void
}

type DatePickerRangeProps = DatePickerCommonProps & {
  layout: 'range'
  value?: CalendarRange
  defaultValue?: CalendarRange
  onValueChange?: (value: CalendarRange) => void
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

type DatePickerInternalProps = DatePickerCommonProps & {
  layout?: 'single' | 'range'
  value?: Date | CalendarRange
  defaultValue?: Date | CalendarRange
  onValueChange?: (value: Date | undefined | CalendarRange) => void
}

function DatePicker(props: DatePickerProps) {
  const {
    layout = 'single',
    size = 'default',
    disabled = false,
    placeholder = 'YYYY-MM-DD',
    isDateDisabled,
    disabledReason,
    today,
    className,
    valueProps,
    value,
    defaultValue,
    onValueChange,
    id,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props as DatePickerInternalProps

  const isRange = layout === 'range'
  const fallbackTriggerId = React.useId()

  /*
   * Combobox의 트리거와 같은 이유로 라벨 id 뒤에 트리거 자신의 id를 잇는다 —
   * 라벨 문구만 가리키면 트리거 안의 내용(고른 날짜나 자리표시자)이 이름에서
   * 빠지므로, 자기 자신도 함께 가리켜 라벨과 현재 값을 둘 다 담는다.
   */
  const triggerId = id ?? fallbackTriggerId
  const triggerLabelledBy = ariaLabelledBy ? `${ariaLabelledBy} ${triggerId}` : undefined

  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] = React.useState<Date | CalendarRange | undefined>(
    () => defaultValue,
  )

  const selected = value !== undefined ? value : uncontrolled

  function commit(next: Date | undefined | CalendarRange) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function handleSelect(next: Date | CalendarRange) {
    commit(next)
    if (isRange) {
      const range = next as CalendarRange
      if (range.from && range.to) setOpen(false)
    } else {
      setOpen(false)
    }
  }

  function handleTriggerClick() {
    if (disabled) return
    setOpen((o) => !o)
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((o) => !o)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const displayText = React.useMemo(() => {
    if (isRange) {
      const range = selected as CalendarRange | undefined
      if (!range?.from) return undefined
      if (!range.to) return `${formatISODate(range.from)} – 종료일을 고르세요`
      return `${formatISODate(range.from)} – ${formatISODate(range.to)}`
    }
    const date = selected as Date | undefined
    return date ? formatISODate(date) : undefined
  }, [isRange, selected])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!disabled) setOpen(next)
      }}
    >
      <PopoverTrigger asChild>
        <div
          {...rest}
          id={triggerId}
          role="button"
          aria-labelledby={triggerLabelledBy}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          data-slot="date-picker-trigger"
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            controlShellVariants({ size }),
            'cursor-pointer items-center justify-between gap-2 text-left',
            disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            className,
          )}
        >
          <span
            {...valueProps}
            className={cn(
              'flex-1 truncate',
              !displayText && 'text-muted-foreground',
              valueProps?.className,
            )}
          >
            {displayText ?? placeholder}
          </span>
          <CalendarDays className="size-4 shrink-0 opacity-50" aria-hidden />
        </div>
      </PopoverTrigger>

      {/* PopoverContent는 role="dialog"라 이름이 없으면 "이름 없는 대화상자"로 읽힌다. 안에 든 것은 달 격자 하나다 */}
      <PopoverContent aria-label="날짜 선택" align="start" className="w-auto p-3">
        {isRange ? (
          <Calendar
            mode="range"
            selected={selected as CalendarRange}
            onSelect={(next) => handleSelect(next as CalendarRange)}
            today={today}
            size={size}
            isDateDisabled={isDateDisabled}
            disabledReason={disabledReason}
          />
        ) : (
          <Calendar
            mode="single"
            selected={selected as Date | undefined}
            onSelect={(next) => handleSelect(next as Date)}
            today={today}
            size={size}
            isDateDisabled={isDateDisabled}
            disabledReason={disabledReason}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
