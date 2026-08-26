import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Combobox } from '@/components/ui/combobox'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ComboboxSize = ComponentProps<typeof Combobox>['size']

/** 여러 예시가 공유하는 담당자 후보. 검색이 '앞글자'가 아니라 '포함'으로 맞는지 실제로 확인할 수 있게 이름 중간에 겹치는 글자를 섞어 둔다 */
const ASSIGNEE_OPTIONS = [
  { value: 'kim', label: '김하나' },
  { value: 'lee', label: '이두리' },
  { value: 'park', label: '박세미' },
  { value: 'choi', label: '최준서' },
  { value: 'jung', label: '정하늘' },
]

/** 항목이 열 개를 넘는 경우를 보이기 위한 부서 목록 */
const DEPARTMENT_OPTIONS = [
  { value: 'sales', label: '영업1팀' },
  { value: 'sales2', label: '영업2팀' },
  { value: 'marketing', label: '마케팅팀' },
  { value: 'design', label: '디자인팀' },
  { value: 'frontend', label: '프런트엔드팀' },
  { value: 'backend', label: '백엔드팀' },
  { value: 'infra', label: '인프라팀' },
  { value: 'qa', label: '품질관리팀' },
  { value: 'cs', label: '고객지원팀' },
  { value: 'hr', label: '인사팀' },
  { value: 'finance', label: '재무팀' },
  { value: 'legal', label: '법무팀' },
]

const FEW_OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'suspended', label: '정지' },
  { value: 'withdrawn', label: '탈퇴' },
]

/*
 * 실제 화면이라면 이 Combobox 옆에 라벨이 있다 — Field·FieldLabel로
 * 감싸 id를 손으로 잇지 않는다(Slider의 SliderField와 같은 얼개다).
 * Combobox의 트리거는 진짜 button이 아니라 role="button"을 단 div라
 * label을 눌러도 브라우저가 자동으로 포커스를 옮겨 주지 않는다 —
 * 그래서 Combobox 쪽에서 label 클릭 시 트리거에 직접 포커스를 주는
 * onClick을 FieldLabel에 얹는다. width는 Field가 정하고 Combobox
 * 자신은 트리거의 기본 w-full을 그대로 받는다.
 */
function ComboboxField({
  label,
  className,
  ...comboboxProps
}: { label: string; className?: string } & ComponentProps<typeof Combobox>) {
  return (
    <Field className={className ?? 'w-48'}>
      <FieldLabel
        onClick={(event) => {
          const controlId = event.currentTarget.htmlFor
          document.getElementById(controlId)?.focus()
        }}
      >
        {label}
      </FieldLabel>
      <FieldControl>
        <Combobox {...comboboxProps} />
      </FieldControl>
    </Field>
  )
}

function renderCombobox(options: RenderOptions) {
  const { size, state, layout } = options
  const disabled = state === 'disabled'
  const invalid = state === 'invalid' || undefined

  if (layout === 'multiple') {
    return (
      <Combobox
        multiple
        options={ASSIGNEE_OPTIONS}
        size={size as ComboboxSize}
        disabled={disabled}
        aria-invalid={invalid}
        defaultValue={['kim']}
        placeholder="담당자 선택"
        className="w-56"
      />
    )
  }

  return (
    <Combobox
      options={ASSIGNEE_OPTIONS}
      size={size as ComboboxSize}
      disabled={disabled}
      aria-invalid={invalid}
      defaultValue="kim"
      placeholder="담당자 선택"
      className="w-56"
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Combobox와 Field로
 * 만든 어드민 화면의 한 조각이다. Popover와 마찬가지로 강제로 열어 두지
 * 않는다 — 눌러서 검색해 보는 것 자체가 이 컴포넌트를 보이는 방법이다.
 *
 * Guidelines·Usage·Cases는 모두 실제 화면이라면 라벨이 있을 자리라
 * ComboboxField로 감싼다. Playground·Properties(renderCombobox)는
 * 축 자체를 보이는 자리라 Select의 자기 render 함수와 같은 이유로
 * 라벨을 달지 않는다 — 실제 화면의 한 조각이 아니라 축 그 자체다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'select-vs-combobox':
      return kind === 'do' ? (
        <ComboboxField
          label="부서"
          options={DEPARTMENT_OPTIONS}
          placeholder="부서 선택"
          className="w-44"
        />
      ) : (
        <ComboboxField label="상태" options={FEW_OPTIONS} placeholder="상태 선택" className="w-44" />
      )

    case 'substring-match':
      // 검색 칸에 '세미'나 '하나'처럼 이름 중간 글자를 넣어 보면 실제로 걸러진다 —
      // 앞글자만 맞추는 거르기로는 재현할 수 없어 dont 쪽에 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <ComboboxField
          label="담당자"
          options={ASSIGNEE_OPTIONS}
          placeholder="담당자 검색"
          className="w-44"
        />
      ) : null

    case 'empty-result-guidance':
      return kind === 'do' ? (
        <ComboboxField
          label="담당자"
          options={[]}
          placeholder="담당자 선택"
          emptyMessage="담당자가 아직 없습니다. 팀 설정에서 먼저 초대하세요."
          className="w-48"
        />
      ) : (
        <ComboboxField
          label="담당자"
          options={[]}
          placeholder="담당자 선택"
          emptyMessage="결과 없음"
          className="w-48"
        />
      )

    case 'reversible-selection':
      // multiple은 언제나 배지마다 지우는 버튼을 그린다 — 공개 API로 이를 끌 방법이
      // 없어 dont 쪽에 대응하는 예시를 두지 않는다
      return kind === 'do' ? (
        <ComboboxField
          label="담당자"
          multiple
          options={ASSIGNEE_OPTIONS}
          defaultValue={['kim', 'lee']}
          className="w-56"
        />
      ) : null

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'assignee':
      return (
        <ComboboxField
          label="담당자"
          options={ASSIGNEE_OPTIONS}
          defaultValue="kim"
          placeholder="담당자 선택"
          size="sm"
          className="w-48"
        />
      )

    case 'tag-select':
      return (
        <ComboboxField
          label="태그"
          multiple
          options={[
            { value: 'urgent', label: '긴급' },
            { value: 'bug', label: '버그' },
            { value: 'feature', label: '기능 요청' },
            { value: 'design', label: '디자인' },
          ]}
          defaultValue={['bug', 'urgent']}
          placeholder="태그 선택"
          className="w-56"
        />
      )

    case 'product-search':
      return (
        <ComboboxField
          label="상품"
          options={[
            { value: 'shirt', label: '반팔 티셔츠' },
            { value: 'pants', label: '슬랙스 팬츠' },
            { value: 'shoes', label: '러닝화' },
            { value: 'bag', label: '크로스백' },
          ]}
          placeholder="상품 검색"
          className="w-48"
        />
      )

    case 'org-select':
      return (
        <ComboboxField
          label="소속 조직"
          options={DEPARTMENT_OPTIONS}
          placeholder="소속 조직 선택"
          className="w-48"
        />
      )

    case 'no-results':
      return (
        <ComboboxField
          label="담당자"
          options={[]}
          placeholder="담당자 선택"
          emptyMessage="검색 결과가 없습니다. 다른 검색어로 다시 찾아보세요."
          className="w-48"
        />
      )

    case 'many-options':
      return (
        <ComboboxField
          label="부서"
          options={DEPARTMENT_OPTIONS}
          placeholder="부서 선택"
          className="w-48"
        />
      )

    case 'many-selected':
      return (
        <ComboboxField
          label="부서"
          multiple
          options={DEPARTMENT_OPTIONS}
          defaultValue={DEPARTMENT_OPTIONS.slice(0, 6).map((o) => o.value)}
          className="w-56"
        />
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <ComboboxField
            label="담당자"
            multiple
            options={ASSIGNEE_OPTIONS}
            defaultValue={['kim', 'lee', 'park']}
            className="w-full"
          />
        </Bounds>
      )

    default:
      return null
  }
}

/**
 * Anatomy 무대에는 trigger와 value만 남는다 — Search·List·Item·Empty
 * message는 PopoverContent가 document.body로 포털하는 안이라 무대 밖에
 * 있다. Popover·Select가 이미 같은 이유로 부위를 무대 안에 남는 것만으로
 * 좁혔다. 여기는 축 자체(부위 지시선)를 보이는 자리라 Field로 감싸지
 * 않는다 — registry의 anatomy에도 label 부위가 없다.
 */
function AnatomyPreview() {
  return (
    <div className="w-52">
      <Combobox
        data-anatomy="trigger"
        valueProps={{ 'data-anatomy': 'value' }}
        options={ASSIGNEE_OPTIONS}
        defaultValue="kim"
        className="w-full"
      />
    </div>
  )
}

export function ComboboxPage() {
  const meta = getComponent('combobox')
  if (!meta) return <Placeholder title="Combobox 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCombobox}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
