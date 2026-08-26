import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Calendar } from '@/components/ui/calendar'
import { DatePicker, type DatePickerSize } from '@/components/ui/date-picker'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * Date.now()에 기대면 이 문서가 열어 보는 날마다 '오늘' 표시와 예시 값이
 * 달라진다. 대신 기준일 하나를 상수로 고정하고 모든 예시 값을 여기서
 * 파생한다 — 2026-08-26. addDays도 이 기준일 위에서만 쓰는 순박한 파생
 * 도우미라 calendar.ts로 옮기지 않고 여기 둔다(다른 페이지가 쓸 일이 없다).
 */
const REFERENCE_DATE = new Date(2026, 7, 26)

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

/*
 * 실제 화면이라면 이 DatePicker 옆에 라벨이 있다 — Combobox의 ComboboxField와
 * 같은 얼개다. DatePicker의 트리거도 진짜 button이 아니라 role="button"을
 * 단 div라 label을 눌러도 브라우저가 자동으로 포커스를 옮겨 주지 않는다 —
 * 그래서 FieldLabel의 onClick에서 트리거에 직접 포커스를 준다.
 */
function DatePickerField({
  label,
  className,
  ...datePickerProps
}: { label: string; className?: string } & ComponentProps<typeof DatePicker>) {
  return (
    <Field className={className ?? 'w-56'}>
      <FieldLabel
        onClick={(event) => {
          const controlId = event.currentTarget.htmlFor
          document.getElementById(controlId)?.focus()
        }}
      >
        {label}
      </FieldLabel>
      <FieldControl>
        <DatePicker {...datePickerProps} />
      </FieldControl>
    </Field>
  )
}

/*
 * layout이 defaultValue의 모양(Date 하나 vs {from, to})을 결정한다. DatePicker는
 * 비제어라 defaultValue를 마운트 시점에만 읽으므로, Playground에서 layout을
 * single↔range로 눌러도 key 없이는 같은 인스턴스가 그대로 남아 옛 모양의 값을
 * 붙든다 — Slider가 defaultValue([40] vs [20, 70])에서 겪은 것과 같은 함정이다.
 * key={layout}로 그 축이 바뀔 때만 강제로 다시 마운트한다.
 */
function renderDatePicker(options: RenderOptions) {
  const { size, state, layout } = options
  const disabled = state === 'disabled'
  const invalid = state === 'invalid' || undefined

  if (layout === 'range') {
    return (
      <DatePicker
        key={layout}
        layout="range"
        size={size as DatePickerSize}
        disabled={disabled}
        aria-invalid={invalid}
        defaultValue={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 5) }}
        today={REFERENCE_DATE}
        className="w-56"
      />
    )
  }

  return (
    <DatePicker
      key={layout}
      size={size as DatePickerSize}
      disabled={disabled}
      aria-invalid={invalid}
      defaultValue={REFERENCE_DATE}
      today={REFERENCE_DATE}
      className="w-56"
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 DatePicker·Calendar·
 * Field로 만든 어드민 화면의 한 조각이다. 트리거만 보이면 되는 예시는
 * Combobox와 같은 이유로 열어 두지 않는다 — 눌러서 열어 보는 것 자체가
 * 이 컴포넌트를 보이는 방법이다. 다만 '오늘과 고른 날의 모양 차이'처럼
 * 달력 안쪽을 봐야만 뜻이 서는 지침은 Calendar를 직접 그려 그 자리를
 * 채운다 — Popover를 강제로 열어 두는 대신, 포털에 갇히지 않는 진짜
 * 컴포넌트를 그대로 쓰는 길이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'format-as-placeholder':
      return kind === 'do' ? (
        <DatePickerField label="만료일" className="w-48" />
      ) : (
        <DatePickerField label="만료일" placeholder="날짜 선택" className="w-48" />
      )

    case 'today-vs-selected':
      // Calendar 자신이 오늘과 고른 날을 항상 다른 모양(테두리 vs 채움)으로 그린다 —
      // 공개 API로 둘을 같은 모양으로 만들 방법이 없어 dont 쪽에 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          selected={addDays(REFERENCE_DATE, 3)}
          className="w-64"
        />
      ) : null

    case 'disabled-reason':
      return kind === 'do' ? (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="오늘 이전 날짜는 고를 수 없습니다"
          className="w-64"
        />
      ) : (
        <Calendar
          today={REFERENCE_DATE}
          defaultMonth={REFERENCE_DATE}
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          className="w-64"
        />
      )

    case 'range-shows-both-ends':
      // 시작만 고르면 컴포넌트가 항상 '종료일을 고르세요'를 이어 붙인다 —
      // 공개 API로 이 안내를 끌 방법이 없어 dont 쪽에 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <DatePickerField
          label="예약 기간"
          layout="range"
          defaultValue={{ from: REFERENCE_DATE }}
          today={REFERENCE_DATE}
          className="w-64"
        />
      ) : null

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'period-filter':
      return (
        <DatePickerField
          label="조회 기간"
          layout="range"
          defaultValue={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 6) }}
          today={REFERENCE_DATE}
          className="w-64"
        />
      )

    case 'expiry-date':
      return (
        <DatePickerField
          label="쿠폰 만료일"
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="오늘 이전 날짜는 고를 수 없습니다"
          today={REFERENCE_DATE}
          className="w-52"
        />
      )

    case 'reservation-date':
      return (
        <DatePickerField
          label="예약일"
          defaultValue={addDays(REFERENCE_DATE, 2)}
          today={REFERENCE_DATE}
          className="w-52"
        />
      )

    case 'reference-date':
      return (
        <DatePickerField
          label="조회 기준일"
          defaultValue={REFERENCE_DATE}
          today={REFERENCE_DATE}
          className="w-52"
        />
      )

    case 'block-before-today':
      return (
        <DatePickerField
          label="만료일"
          isDateDisabled={(date) => date.getTime() < REFERENCE_DATE.getTime()}
          disabledReason="오늘 이전 날짜는 고를 수 없습니다"
          today={REFERENCE_DATE}
          className="w-52"
        />
      )

    case 'range-over-a-month':
      return (
        <DatePickerField
          label="정산 기간"
          layout="range"
          defaultValue={{ from: REFERENCE_DATE, to: addDays(REFERENCE_DATE, 40) }}
          today={REFERENCE_DATE}
          className="w-64"
        />
      )

    case 'no-value':
      return <DatePickerField label="조회 기준일" today={REFERENCE_DATE} className="w-52" />

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <DatePickerField
            label="예약일"
            defaultValue={REFERENCE_DATE}
            today={REFERENCE_DATE}
            className="w-full"
          />
        </Bounds>
      )

    default:
      return null
  }
}

/**
 * Anatomy 무대에는 trigger와 value만 남는다 — Month header·Weekday row·Day
 * grid·Day는 PopoverContent가 document.body로 포털하는 안이라 무대 밖에
 * 있다. Combobox·Select가 이미 같은 이유로 부위를 무대 안에 남는 것만으로
 * 좁혔다. Field로 감싸지 않는다 — 축 자체(부위 지시선)를 보이는 자리라
 * registry의 anatomy에도 label 부위가 없다.
 */
function AnatomyPreview() {
  return (
    <div className="w-56">
      <DatePicker
        data-anatomy="trigger"
        valueProps={{ 'data-anatomy': 'value' }}
        defaultValue={REFERENCE_DATE}
        today={REFERENCE_DATE}
        className="w-full"
      />
    </div>
  )
}

export function DatePickerPage() {
  const meta = getComponent('date-picker')
  if (!meta) return <Placeholder title="Date Picker 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderDatePicker}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
