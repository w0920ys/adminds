import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addDays,
  addMonthsToDate,
  buildMonthGrid,
  formatISODate,
  isBeforeDay,
  isSameDay,
  type MonthGridCell,
} from '@/lib/calendar'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export type CalendarSize = 'sm' | 'default' | 'lg'

/*
 * DatePicker의 트리거 높이(h-control-*)와는 다른 축이다 — 날짜 칸은 정사각형
 * 배지라 높이 대신 한 변의 길이(size-*)로 잰다. 트리거의 size와 이 값은
 * DatePicker가 그대로 이어 준다.
 */
const CELL_SIZE: Record<CalendarSize, string> = {
  sm: 'size-7 text-12',
  default: 'size-8 text-sm',
  lg: 'size-9 text-sm',
}

/*
 * 요일 머리 칸의 폭은 그 아래 날짜 칸의 한 변과 같아야 한다 — 머리 칸이 열 폭을
 * 정하므로, 여기만 고정 폭(w-9)으로 두면 sm·default에서 날짜 배지보다 넓은 열이
 * 되어 요일과 날짜의 세로줄이 어긋나고 격자 전체도 그만큼 넓어진다. CELL_SIZE의
 * size-*와 같은 눈금을 쓴다. 글자 크기는 따라가지 않는다 — 머리 글자는 날짜가
 * 아니라 요일 이름이라 세 크기 모두 text-11다.
 */
const HEADER_CELL_WIDTH: Record<CalendarSize, string> = {
  sm: 'w-7',
  default: 'w-8',
  lg: 'w-9',
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

function monthOf(date: Date): { year: number; month: number } {
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

  /*
   * focusedDate 하나가 두 가지 뜻을 겸한다 — 지금 화면에 보이는 달(view는 여기서
   * 파생만 된다)과, 격자 안에서 구르는 tabIndex(roving tabIndex)의 대상. 42칸을
   * 모두 tab 순서에 두면 늦은 주의 날짜에 닿기까지 최대 41번 Tab을 눌러야 한다 —
   * WAI-ARIA grid 패턴대로 격자 전체를 tab 정지점 하나로 줄이고, 화살표·Home·
   * End·PageUp·PageDown이 이 안에서 초점을 옮긴다. 두 값을 하나로 묶어 두면
   * '초점은 옮겼는데 보이는 달은 그대로'인 불일치가 애초에 생기지 않는다.
   */
  const [focusedDate, setFocusedDate] = React.useState<Date>(
    () => defaultMonth ?? rangeValue?.from ?? singleValue ?? today,
  )
  /* 키보드로 옮긴 경우에만 실제 DOM 포커스를 옮긴다 — 마우스 클릭은 브라우저가 이미 포커스를 준다 */
  const shouldFocusRef = React.useRef(false)
  /*
   * 'YYYY-MM-DD' 문자열로 칸을 키·비교한다 — cell.date는 buildMonthGrid가 만든
   * 로컬 정오 기준 Date지만, focusedDate의 초기값(today·defaultMonth·selected)은
   * 이 컴포넌트를 쓰는 페이지가 new Date(y, m, d)로 만든 로컬 자정 기준 Date일
   * 수 있다. 같은 날이어도 두 표기의 getTime()은 절대 같지 않아, getTime()으로
   * 비교하면 격자 어느 칸도 '지금 포커스가 가야 할 칸'과 맞아떨어지지 않고
   * roving tabIndex가 하나도 0이 되지 않는 채로 남는다(격자 전체가 tab에서
   * 사라진다). formatISODate는 로컬 연·월·일 게터만 보므로 두 표기가 같은
   * 날이면 항상 같은 문자열이 된다.
   */
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>())

  const view = React.useMemo(() => monthOf(focusedDate), [focusedDate])
  const grid = React.useMemo(() => buildMonthGrid(view.year, view.month), [view.year, view.month])

  React.useEffect(() => {
    if (!shouldFocusRef.current) return
    shouldFocusRef.current = false
    dayRefs.current.get(formatISODate(focusedDate))?.focus()
  }, [focusedDate])

  function goToMonth(delta: number) {
    setFocusedDate((current) => addMonthsToDate(current, delta))
  }

  function moveFocus(next: Date) {
    shouldFocusRef.current = true
    setFocusedDate(next)
  }

  function handleDayClick(cell: MonthGridCell) {
    setFocusedDate(cell.date)
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

  /*
   * 화살표는 하루·이레, Home·End는 그 주의 처음·끝, PageUp·PageDown은 한 달
   * 앞뒤로 옮긴다 — WAI-ARIA grid 패턴의 표준 키 배정이다. cell.date가
   * buildMonthGrid의 로컬 정오 기준이라 addDays·addMonthsToDate로 옮겨도
   * 서머타임에 흔들리지 않는다. 옮긴 날짜가 지금 보이는 달을 벗어나면
   * view가 focusedDate에서 파생되므로 자연히 이웃 달로 넘어간다.
   */
  function handleDayKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, cell: MonthGridCell) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        moveFocus(addDays(cell.date, 1))
        return
      case 'ArrowLeft':
        event.preventDefault()
        moveFocus(addDays(cell.date, -1))
        return
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(addDays(cell.date, 7))
        return
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(addDays(cell.date, -7))
        return
      case 'Home':
        event.preventDefault()
        moveFocus(addDays(cell.date, -cell.date.getDay()))
        return
      case 'End':
        event.preventDefault()
        moveFocus(addDays(cell.date, 6 - cell.date.getDay()))
        return
      case 'PageUp':
        event.preventDefault()
        moveFocus(addMonthsToDate(cell.date, -1))
        return
      case 'PageDown':
        event.preventDefault()
        moveFocus(addMonthsToDate(cell.date, 1))
        return
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleDayClick(cell)
        return
      default:
        return
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

      {/*
       * range는 칸을 여럿 한꺼번에 고르는 격자라 aria-multiselectable을 켠다.
       * single은 한 칸만 고르므로 켜지 않는다 — 이 속성이 아래 칸의
       * aria-selected를 어떻게 달지까지 가른다.
       */}
      <table
        className="w-full border-collapse"
        role="grid"
        aria-multiselectable={isRange || undefined}
      >
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  'text-muted-foreground pb-1 text-11 font-normal',
                  HEADER_CELL_WIDTH[size],
                )}
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
                  isBeforeDay(rangeValue.from, cell.date) &&
                  isBeforeDay(cell.date, rangeValue.to)
                const disabled = isDateDisabled?.(cell.date) ?? false
                const isoDate = formatISODate(cell.date)
                const isRoving = isoDate === formatISODate(focusedDate)
                const dayLabel = `${cell.date.getFullYear()}년 ${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일`

                /*
                 * aria-selected의 세 값은 서로 다른 말을 한다 — true는 '골랐다',
                 * false는 '고를 수 있는데 안 골랐다', 속성 없음(undefined)은
                 * '고를 수 있는 자리가 아니다'다(WAI-ARIA 1.2, aria-selected).
                 *
                 * single에서는 고른 칸에만 true를 달고 나머지에는 아예 달지
                 * 않는다. APG의 두 날짜 선택 예시(Date Picker Dialog·Combobox
                 * Date Picker)가 모두 "고른 칸 말고는 aria-selected를 두지
                 * 않는다"고 못 박고, 참조 구현도 고를 때마다 나머지 칸에서
                 * removeAttribute로 걷어낸다. 마흔두 칸 전부에 false를 뿌리는
                 * 흔한 방식은 그 예시들과 어긋난다.
                 *
                 * range는 다르다. 칸을 여럿 고르는 격자라 위 table에
                 * aria-multiselectable을 켰고, 스펙은 그 컨테이너 아래의 고를
                 * 수 있는 칸이라면 true든 false든 값을 명시하라고 한다. 그래서
                 * range에서만 false를 함께 단다 — 다만 고를 수 없는 칸
                 * (isDateDisabled)에는 달지 않는다. 거기서는 속성이 없는 것이
                 * 곧 '고를 수 없음'이라는 제 뜻을 낸다.
                 */
                const cellSelected = isBoundary || isInRange
                const ariaSelected = isRange
                  ? disabled
                    ? undefined
                    : cellSelected
                  : cellSelected || undefined

                return (
                  /*
                   * aria-selected는 칸(gridcell)에 단다. 안쪽 button에 달면
                   * 아무것도 알리지 못한다 — aria-selected는 role="button"이
                   * 지원하는 속성이 아니라 그 자리에서는 무시된다. 고른 날을
                   * 실제로 알리는 자리는 grid의 칸이다.
                   *
                   * range에서는 양 끝만이 아니라 사이의 날도 함께 표시한다 —
                   * 화면에서 bg-accent로 이어 그리는 그 구간이 곧 지금 고른
                   * 기간이라, 끝 두 날만 선택으로 알리면 사이의 날들이 고른
                   * 것에 들지 않는 것처럼 읽힌다.
                   */
                  <td
                    key={isoDate}
                    role="gridcell"
                    aria-selected={ariaSelected}
                    className={cn(
                      'p-0 text-center',
                      isInRange && 'bg-accent',
                      isRangeStart && !isRangeEnd && 'rounded-l-full',
                      isRangeEnd && !isRangeStart && 'rounded-r-full',
                    )}
                  >
                    {/*
                     * disabled는 네이티브 disabled 속성을 쓰지 않는다 — 네이티브
                     * disabled 버튼은 브라우저가 포커스·tab 순서에서 통째로
                     * 빼 버려, 화살표로 이 칸까지 옮겨도 focus()가 아무 일도
                     * 하지 못한다(격자 순회가 그 칸에서 조용히 끊긴다). 대신
                     * aria-disabled로 알리고 클릭·Enter·Space는 handleDayClick
                     * 내부에서 막는다 — 칸은 계속 순회할 수 있고 고를 수만 없다.
                     */}
                    <button
                      ref={(el) => {
                        if (el) dayRefs.current.set(isoDate, el)
                        else dayRefs.current.delete(isoDate)
                      }}
                      type="button"
                      tabIndex={isRoving ? 0 : -1}
                      aria-disabled={disabled || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      title={disabled ? disabledReason : undefined}
                      aria-label={disabled && disabledReason ? `${dayLabel}, ${disabledReason}` : dayLabel}
                      onClick={() => handleDayClick(cell)}
                      onKeyDown={(event) => handleDayKeyDown(event, cell)}
                      className={cn(
                        'grid place-items-center rounded-full font-medium outline-none transition',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
                        CELL_SIZE[size],
                        !cell.inMonth && 'text-muted-foreground',
                        cell.inMonth && !isBoundary && !disabled && 'text-foreground',
                        isToday && !isBoundary && !disabled && 'border-foreground/60 border font-semibold',
                        isBoundary && !disabled && 'bg-primary text-primary-foreground',
                        !disabled && !isBoundary && 'hover:bg-accent hover:text-accent-foreground',
                        /*
                         * text-foreground를 opacity-50으로 흐리던 이전 방식은
                         * 라이트 테마에서 4.5:1에 못 미쳤다(재측정: 3.7:1 부근) —
                         * 이미 4.5:1을 넉넉히 넘도록 조정된 muted-foreground를
                         * 그대로 재사용하고, 흐림 대신 취소선으로 '고를 수 없음'을
                         * 알린다. 색만으로 상태를 가르지 않는다는 원칙과도 맞는다.
                         */
                        disabled && 'text-muted-foreground line-through decoration-1 cursor-not-allowed',
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
