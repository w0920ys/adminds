import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { docProse } from '@/components/docs/DocPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Calendar } from '@/components/ui/calendar'
import { DatePicker, type DatePickerSize } from '@/components/ui/date-picker'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { getComponent } from '@/data/registry'
import { cn } from '@/lib/utils'
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
 * 같은 얼개다. 트리거가 role="button"을 단 div라 라벨과 이어지지 않던 문제는
 * Field가 aria-labelledby와 라벨 클릭 포커스로 함께 푼다 — 페이지에서 손으로
 * 얹던 onClick은 없앴다.
 */
function DatePickerField({
  label,
  className,
  ...datePickerProps
}: { label: string; className?: string } & ComponentProps<typeof DatePicker>) {
  return (
    <Field className={className ?? 'w-56'}>
      <FieldLabel>{label}</FieldLabel>
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

/* ------------------------------------------------------------------ *
 * 키보드
 *
 * 달 격자는 WAI-ARIA grid 패턴을 따르지만, 이 표는 그 패턴이 보통 어떻게
 * 생겼는지가 아니라 calendar.tsx의 handleDayKeyDown과 date-picker.tsx의
 * handleTriggerKeyDown이 실제로 다루는 키만 적는다.
 * ------------------------------------------------------------------ */

const TRIGGER_KEYS: { keys: string; effect: string }[] = [
  { keys: 'Enter · Space', effect: '달력을 열고, 열려 있으면 닫는다' },
  { keys: 'Escape', effect: '열려 있는 달력을 닫는다' },
]

const GRID_KEYS: { keys: string; effect: string }[] = [
  { keys: '← →', effect: '하루 앞뒤로 옮긴다' },
  { keys: '↑ ↓', effect: '이레 앞뒤로 옮긴다(위아래 같은 요일)' },
  { keys: 'Home · End', effect: '그 주의 일요일 · 토요일로 옮긴다' },
  {
    keys: 'PageUp · PageDown',
    effect:
      '한 달 앞뒤로 옮긴다. 옮긴 달에 같은 날짜가 없으면(1월 31일에서 2월로) 그 달의 마지막 날로 당긴다. Shift를 함께 눌러도 한 달씩이다 — 한 해를 옮기는 키는 두지 않았다',
  },
  { keys: 'Enter · Space', effect: '짚은 날을 고른다. 고를 수 없는 날에서는 아무 일도 일어나지 않는다' },
  { keys: 'Escape', effect: '달력을 닫고 포커스를 트리거로 되돌린다' },
]

function KeyTable({ caption, rows }: { caption: string; rows: { keys: string; effect: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <caption className="text-muted-foreground px-3 py-2 text-left text-2xs font-bold tracking-widest">
          {caption}
        </caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys}>
              <th scope="row" className="w-44 border-t px-3 py-2.5 align-top font-medium">
                {row.keys}
              </th>
              <td className="text-muted-foreground border-t px-3 py-2.5">{row.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KeyboardSection() {
  return (
    <div className="flex flex-col gap-4">
      <p className={cn('text-muted-foreground text-sm', docProse)}>
        트리거는 button이 아니라 role=&quot;button&quot;을 단 div라 키를 스스로 다룬다. 열린 달력의
        날짜 격자는 마흔두 칸을 모두 탭 순서에 두지 않는다 — 지금 짚은 날 하나만 탭 정지점이고,
        나머지 칸으로는 아래 키로 옮긴다. 달력 안의 탭 정지점은 이전 달 · 다음 달 버튼과 그 한 칸,
        모두 셋이다. 달력을 열면 포커스는 그중 첫 요소인 이전 달 버튼에 놓인다.
      </p>
      <KeyTable caption="트리거" rows={TRIGGER_KEYS} />
      <KeyTable caption="열린 달력의 날짜 격자" rows={GRID_KEYS} />
      <p className={cn('text-muted-foreground text-sm', docProse)}>
        옮긴 날짜가 지금 보이는 달을 벗어나면 달이 함께 넘어간다 — 8월 1일에서 왼쪽 화살표를 누르면
        7월 31일로 옮겨 가면서 달력도 7월을 보인다. 고를 수 없는 날은 격자에서 건너뛰지 않는다.
        네이티브 disabled 대신 aria-disabled로 알리기 때문에 화살표로 지나갈 수 있고, 고르는 것만
        막힌다.
      </p>
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
      extraSections={[{ title: 'Keyboard', node: <KeyboardSection /> }]}
    />
  )
}
