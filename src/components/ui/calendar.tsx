import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, buildMonthGrid, isSameDay, type MonthGridCell } from '@/lib/calendar'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export type CalendarSize = 'sm' | 'default' | 'lg'

/*
 * DatePicker의 트리거 높이(h-control-*)와는 다른 축이다 — 날짜 칸은 정사각형
 * 배지라 높이 대신 한 변의 길이(size-*)로 잰다. 트리거의 size와 이 값은
 * DatePicker가 그대로 이어 준다.
 */
const CELL_SIZE: Record<CalendarSize, string> = {
  sm: 'size-7 text-xs',
  default: 'size-8 text-sm',
  lg: 'size-9 text-sm',
}

export type CalendarRange = { from?: Date; to?: Date }

type CalendarCommonProps = {
  /** 오늘로 볼 날짜. 지정하지 않으면 실제 오늘이다 — 문서 페이지는 날마다 문서가 달라지지 않도록 상수를 내려준다 */
  today?: Date
  /** 처음 보여줄 달을 담은 날짜. 지정하지 않으면 선택값이 속한 달, 그마저 없으면 today가 속한 달을 보인다 */
  defaultMonth?: Date
  /** 이 날짜를 고를 수 없는지 정한다 */
  isDateDisabled?: (date: Date) => boolean
  /** 고를 수 없는 이유. 고를 수 없는 날의 title과 aria-label에 실려 이유를 알린다 */
  disabledReason?: string
  size?: CalendarSize
  className?: string
}

type CalendarSingleProps = CalendarCommonProps & {
  mode?: 'single'
  selected?: Date
  onSelect?: (date: Date) => void
}

type CalendarRangeProps = CalendarCommonProps & {
  mode: 'range'
  selected?: CalendarRange
  onSelect?: (range: CalendarRange) => void
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps

/*
 * single·range 두 갈래로 나뉜 공개 타입을 구현부 안에서까지 따지지 않는다 —
 * Combobox의 single·multiple과 같은 이유다. 실제 로직은 넓힌 모양 하나로
 * 다루고, 바깥에서 보는 타입 안전성은 CalendarProps가 그대로 지킨다.
 */
type CalendarInternalProps = CalendarCommonProps & {
  mode?: 'single' | 'range'
  selected?: Date | CalendarRange
  onSelect?: (value: Date | CalendarRange) => void
}

function monthOf(date: Date | undefined): { year: number; month: number } | undefined {
  if (!date) return undefined
  return { year: date.getFullYear(), month: date.getMonth() }
}

function Calendar(props: CalendarProps) {
  const {
    mode = 'single',
    today = new Date(),
    defaultMonth,
    isDateDisabled,
    disabledReason,
    size = 'default',
    className,
    selected,
    onSelect,
  } = props as CalendarInternalProps

  const isRange = mode === 'range'
  const rangeValue = isRange ? (selected as CalendarRange | undefined) : undefined
  const singleValue = !isRange ? (selected as Date | undefined) : undefined

  const [view, setView] = React.useState(
    () => monthOf(defaultMonth) ?? monthOf(rangeValue?.from) ?? monthOf(singleValue) ?? monthOf(today)!,
  )

  const grid = React.useMemo(() => buildMonthGrid(view.year, view.month), [view.year, view.month])

  function goToMonth(delta: number) {
    setView((current) => addMonths(current.year, current.month, delta))
  }

  function handleDayClick(cell: MonthGridCell) {
    if (isDateDisabled?.(cell.date)) return

    if (isRange) {
      const current = rangeValue
      let next: CalendarRange
      if (!current?.from || (current.from && current.to)) {
        next = { from: cell.date, to: undefined }
      } else if (cell.date.getTime() < current.from.getTime()) {
        next = { from: cell.date, to: current.from }
      } else {
        next = { from: current.from, to: cell.date }
      }
      onSelect?.(next)
    } else {
      onSelect?.(cell.date)
    }
  }

  return (
    <div data-slot="calendar" className={cn('w-fit', className)}>
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => goToMonth(-1)}
          className="hover:bg-accent rounded-md p-1 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="text-sm font-medium" aria-live="polite">
          {view.year}년 {view.month + 1}월
        </p>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => goToMonth(1)}
          className="hover:bg-accent rounded-md p-1 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label) => (
              <th
                key={label}
                scope="col"
                className="text-muted-foreground w-9 pb-1 text-2xs font-normal"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((cell) => {
                const isToday = isSameDay(cell.date, today)
                const isSelected = !isRange && isSameDay(cell.date, singleValue)
                const isRangeStart = isRange && isSameDay(cell.date, rangeValue?.from)
                const isRangeEnd = isRange && isSameDay(cell.date, rangeValue?.to)
                const isBoundary = isSelected || isRangeStart || isRangeEnd
                const isInRange =
                  isRange &&
                  !!rangeValue?.from &&
                  !!rangeValue?.to &&
                  cell.date.getTime() > rangeValue.from.getTime() &&
                  cell.date.getTime() < rangeValue.to.getTime()
                const disabled = isDateDisabled?.(cell.date) ?? false
                const dayLabel = `${cell.date.getFullYear()}년 ${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일`

                return (
                  <td
                    key={cell.date.getTime()}
                    className={cn(
                      'p-0 text-center',
                      isInRange && 'bg-accent',
                      isRangeStart && !isRangeEnd && 'rounded-l-full',
                      isRangeEnd && !isRangeStart && 'rounded-r-full',
                    )}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      aria-current={isToday ? 'date' : undefined}
                      aria-selected={isBoundary || undefined}
                      title={disabled ? disabledReason : undefined}
                      aria-label={disabled && disabledReason ? `${dayLabel}, ${disabledReason}` : dayLabel}
                      onClick={() => handleDayClick(cell)}
                      className={cn(
                        'grid place-items-center rounded-full font-medium outline-none transition',
                        CELL_SIZE[size],
                        !cell.inMonth && 'text-muted-foreground',
                        cell.inMonth && !isBoundary && 'text-foreground',
                        isToday && !isBoundary && 'border-foreground/60 border font-semibold',
                        isBoundary && 'bg-primary text-primary-foreground',
                        !disabled &&
                          !isBoundary &&
                          'hover:bg-accent hover:text-accent-foreground',
                        !disabled && 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
                        disabled && 'pointer-events-none opacity-50',
                      )}
                    >
                      {cell.date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { Calendar }
