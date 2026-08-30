import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Calendar, type CalendarSize } from '@/components/ui/calendar'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * Date.now()에 기대면 이 문서가 열어 보는 날마다 '오늘' 표시와 예시 값이
 * 달라진다. Date Picker 문서와 같은 기준일을 그대로 쓴다 — 두 문서가 같은
 * 날짜로 예시를 보이면 서로 비교하기도 쉽다.
 */
const REFERENCE_DATE = new Date(2026, 7, 26)

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

/*
 * mode가 selected의 모양(Date 하나 vs {from, to})을 정한다. Calendar는
 * 완전히 제어되는 컴포넌트라 defaultValue 없이 selected·onSelect만
 * 받는다 — Playground는 상태를 직접 들고 있지 않으므로 onSelect는
 * 넘기지 않는다(눌러도 값이 바뀌지 않는다, 다른 Playground 예시가 이미
 * 쓰는 '보여주기 전용' 방식과 같다). key={mode}로 그 축이 바뀔 때만
 * 다시 마운트해, single↔range를 오가도 focusedDate가 이전 모드의
 * selected를 붙들지 않게 한다.
 */
function renderCalendar(options: RenderOptions) {
  const { size, mode, state } = options
  const disabled = state === 'disabled'

  if (mode === 'range') {
    return (
      <Calendar
        key={mode}
        mode="range"
        size={size as CalendarSize}
        today={REFERENCE_DATE}
        defaultMonth={REFERENCE_DATE}
        selected={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 5) }}
        isDateDisabled={disabled ? (date) => date.getTime() < REFERENCE_DATE.getTime() : undefined}
        disabledReason={disabled ? '오늘 이전 날짜는 고를 수 없습니다' : undefined}
      />
    )
  }

  return (
    <Calendar
      key={mode}
      size={size as CalendarSize}
      today={REFERENCE_DATE}
      defaultMonth={REFERENCE_DATE}
      selected={addDays(REFERENCE_DATE, 3)}
      isDateDisabled={disabled ? (date) => date.getTime() < REFERENCE_DATE.getTime() : undefined}
      disabledReason={disabled ? '오늘 이전 날짜는 고를 수 없습니다' : undefined}
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Calendar로 만든
 * 어드민 화면의 한 조각이다. Date Picker와 달리 Popover 뒤에 숨지
 * 않고 늘 펼쳐 있는 화면(예약 가능일 위젯, 필터 사이드바)을 그대로
 * 보인다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'today-vs-selected':
      // Calendar 자신이 오늘과 고른 날을 항상 다른 모양(테두리 vs 채움)으로 그린다 —
      // 공개 API로 둘을 같은 모양으로 만들 방법이 없어 dont 쪽에 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <Calendar today={REFERENCE_DATE} defaultMonth={REFERENCE_DATE} selected={addDays(REFERENCE_DATE, 3)} />
      ) : null

    case 'disabled-reason':
      return kind === 'do' ? (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="오늘 이전 날짜는 고를 수 없습니다"
        />
      ) : (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
        />
      )

    case 'range-shows-both-ends':
      return kind === 'do' ? (
        <Calendar
          mode="range"
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          selected={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 5) }}
        />
      ) : null

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'availability-widget':
      return (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="지난 날짜는 예약할 수 없습니다"
        />
      )

    case 'filter-sidebar':
      return (
        <Calendar
          mode="range"
          size="sm"
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          selected={{ from: addDays(REFERENCE_DATE, -6), to: REFERENCE_DATE }}
        />
      )

    case 'reference-widget':
      return <Calendar size="sm" today={REFERENCE_DATE} defaultMonth={REFERENCE_DATE} selected={REFERENCE_DATE} />

    case 'block-before-today':
      return (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="오늘 이전 날짜는 고를 수 없습니다"
        />
      )

    case 'range-partial':
      return (
        <Calendar
          mode="range"
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          selected={{ from: REFERENCE_DATE, to: undefined }}
        />
      )

    case 'range-over-a-month':
      return (
        <Calendar
          mode="range"
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          selected={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 40) }}
        />
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-64">
          <Calendar size="sm" today={REFERENCE_DATE} defaultMonth={REFERENCE_DATE} selected={REFERENCE_DATE} />
        </Bounds>
      )

    default:
      return null
  }
}

/**
 * 두 부위 전부 무대 안에 그대로 있다 — Date Picker와 달리 Popover 포털이
 * 없다. headerProps·gridProps로 실제 달 이동 줄과 표에 data-anatomy를
 * 얹어, 지시선이 진짜 DOM 경계를 그대로 가리키게 한다(Tabs의
 * indicatorProps와 같은 통로).
 */
function AnatomyPreview() {
  return (
    <Calendar
      today={REFERENCE_DATE}
      defaultMonth={REFERENCE_DATE}
      selected={addDays(REFERENCE_DATE, 3)}
      headerProps={{ 'data-anatomy': 'header' }}
      gridProps={{ 'data-anatomy': 'grid' }}
    />
  )
}

export function CalendarPage() {
  const meta = getComponent('calendar')
  if (!meta) return <Placeholder title="Calendar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCalendar}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
