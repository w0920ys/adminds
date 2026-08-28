import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Field, FieldControl, FieldError, FieldHelp, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio'
import { Slider, type SliderSize } from '@/components/ui/slider'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * Value는 Slider 밖에 놓인다 — 진행 막대의 Value를 Progress 밖에서
 * 그리는 것과 같은 생각이다. 실제 화면에서 슬라이더에 라벨을 달고 값을
 * 곁들이는 자리는 Field가 더 낫다 — 라벨·컨트롤의 id를 손으로 잇지
 * 않아도 되기 때문이다. 이 조각을 여러 예시가 함께 쓴다.
 *
 * valueLabel은 Slider 자신의 value(number[])와는 다른 값이다 — 눈에
 * 보이는 문구이므로 이름을 갈라 둔다.
 */
function SliderField({
  label,
  valueLabel,
  className,
  ...sliderProps
}: {
  label: string
  valueLabel?: ReactNode
  className?: string
} & ComponentProps<typeof Slider>) {
  return (
    <Field className={className ?? 'w-64'}>
      <FieldLabel className="flex items-center justify-between">
        <span>{label}</span>
        {valueLabel != null && (
          <span className="text-muted-foreground text-12 font-normal">{valueLabel}</span>
        )}
      </FieldLabel>
      <FieldControl>
        <Slider {...sliderProps} />
      </FieldControl>
    </Field>
  )
}

/*
 * Playground는 옵션 버튼을 누를 때마다 이 함수가 돌려주는 트리를 같은
 * 자리에서 갈아 끼운다(Playground.tsx의 {render(options)}) — Slider
 * 엘리먼트 자체는 리액트 입장에서 그대로 남고 defaultValue prop만
 * 바뀐다. Slider는 비제어라 Radix가 defaultValue를 마운트 시점에만
 * 읽으므로, layout을 single에서 range로 눌러도 내부 값 배열은 그대로
 * 남아 손잡이가 하나뿐인 채 두 번째 손잡이의 aria-valuenow가 null이
 * 되는 유령 손잡이가 생겼다. defaultValue의 모양(배열 길이)을 정하는
 * 축은 layout뿐이므로 key={layout}로 그 축이 바뀔 때만 강제로
 * 다시 마운트한다 — size·state는 defaultValue의 모양에 영향을 주지
 * 않아 key에 넣지 않는다.
 */
function renderSlider(options: RenderOptions) {
  const { size, state, layout } = options
  const disabled = state === 'disabled'
  const defaultValue = layout === 'range' ? [20, 70] : [40]

  return (
    <div className="w-64">
      <Slider key={layout} size={size as SliderSize} disabled={disabled} defaultValue={defaultValue} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Slider와 Field ·
 * Input · Radio만으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'show-value-as-number':
      return kind === 'do' ? (
        <SliderField label="이미지 품질" valueLabel="72%" defaultValue={[72]} />
      ) : (
        <Field className="w-64">
          <FieldLabel>이미지 품질</FieldLabel>
          <FieldControl>
            <Slider defaultValue={[72]} />
          </FieldControl>
        </Field>
      )

    case 'exact-value-needs-input':
      return kind === 'do' ? (
        <Field className="w-64">
          <FieldLabel>할인율</FieldLabel>
          <div className="flex items-center gap-3">
            <FieldControl>
              <Slider defaultValue={[37]} className="flex-1" />
            </FieldControl>
            <Input defaultValue="37" className="w-16 text-right" aria-label="할인율 직접 입력" />
          </div>
        </Field>
      ) : (
        <SliderField label="할인율" valueLabel="37% 부근" defaultValue={[37]} />
      )

    case 'step-matches-unit':
      return kind === 'do' ? (
        <SliderField label="초대할 인원" valueLabel="4명" defaultValue={[4]} min={1} max={20} step={1} />
      ) : (
        <SliderField
          label="할인율"
          valueLabel="37.42%"
          defaultValue={[37.42]}
          min={0}
          max={100}
          step={0.01}
        />
      )

    case 'five-or-fewer-use-radio':
      return kind === 'do' ? (
        <RadioGroup defaultValue="normal" className="gap-1.5">
          <label className="flex items-center gap-2 text-16">
            <RadioGroupItem value="low" />
            낮음
          </label>
          <label className="flex items-center gap-2 text-16">
            <RadioGroupItem value="normal" />
            보통
          </label>
          <label className="flex items-center gap-2 text-16">
            <RadioGroupItem value="high" />
            높음
          </label>
        </RadioGroup>
      ) : (
        <SliderField
          label="우선순위"
          valueLabel="보통"
          defaultValue={[2]}
          min={1}
          max={3}
          step={1}
          className="w-48"
        />
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'price-range-filter':
      return (
        <Field className="w-72">
          <FieldLabel className="flex items-center justify-between">
            <span>가격</span>
            <span className="text-muted-foreground text-12 font-normal">₩20,000 – ₩120,000</span>
          </FieldLabel>
          <FieldControl>
            <Slider defaultValue={[20000, 120000]} min={0} max={200000} step={1000} />
          </FieldControl>
        </Field>
      )

    case 'threshold-setting':
      return (
        <SliderField
          label="재고 부족 알림 기준"
          valueLabel="20개 이하"
          defaultValue={[20]}
          min={0}
          max={100}
          step={5}
        />
      )

    case 'image-quality':
      return <SliderField label="이미지 품질" valueLabel="80%" defaultValue={[80]} />

    case 'display-count':
      return (
        <SliderField
          label="한 화면에 표시"
          valueLabel="30개"
          defaultValue={[30]}
          min={10}
          max={100}
          step={10}
        />
      )

    case 'wide-range':
      return (
        <SliderField
          label="연 매출 목표"
          valueLabel="₩500,000,000"
          defaultValue={[500_000_000]}
          min={0}
          max={2_000_000_000}
          step={10_000_000}
        />
      )

    case 'thumbs-at-same-value':
      return (
        <SliderField
          label="가격"
          valueLabel="₩50,000 – ₩50,000"
          defaultValue={[50000, 50000]}
          min={0}
          max={200000}
          step={1000}
        />
      )

    case 'no-value':
      return <SliderField label="할인율" valueLabel="0%" min={0} max={100} />

    /*
     * Field의 네 부위(라벨·도움말·컨트롤·오류)를 Slider 하나에 모두 두는
     * 자리다. Slider는 라벨이 붙지 않는 컨트롤이라(Root가 역할 없는 span,
     * role="slider"는 그 안의 손잡이) Field가 내려준 id들이 손잡이까지
     * 실제로 닿는지 눈으로 확인할 데가 이 페이지에 없었다.
     */
    case 'error-with-help':
      return (
        <Field state="error" className="w-64">
          <FieldLabel className="flex items-center justify-between">
            <span>재고 부족 알림 기준</span>
            <span className="text-muted-foreground text-12 font-normal">120개 이하</span>
          </FieldLabel>
          <FieldHelp>재고가 이 값 이하로 떨어지면 담당자에게 알립니다</FieldHelp>
          <FieldControl>
            <Slider defaultValue={[120]} min={0} max={200} step={10} />
          </FieldControl>
          <FieldError>현재 재고(80개)보다 큰 값은 저장할 수 없습니다</FieldError>
        </Field>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <SliderField label="이미지 품질" valueLabel="80%" defaultValue={[80]} className="w-full" />
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Value는 Slider 밖에서 페이지가
 * 감싸므로 여기서 직접 data-anatomy를 단다 — Slider 자신은 문서
 * 시스템의 표시를 모른다. Track·Range·Thumb는 안에서 닿을 수 없어
 * trackProps·rangeProps·thumbProps로 전달한다.
 */
function AnatomyPreview() {
  return (
    <Field className="w-64">
      <FieldLabel className="flex items-center justify-between">
        <span>이미지 품질</span>
        <span data-anatomy="value" className="text-muted-foreground text-12 font-normal">
          72%
        </span>
      </FieldLabel>
      <FieldControl>
        <Slider
          defaultValue={[72]}
          trackProps={{ 'data-anatomy': 'track' }}
          rangeProps={{ 'data-anatomy': 'range' }}
          thumbProps={{ 'data-anatomy': 'thumb' }}
        />
      </FieldControl>
    </Field>
  )
}

export function SliderPage() {
  const meta = getComponent('slider')
  if (!meta) return <Placeholder title="Slider 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSlider}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
