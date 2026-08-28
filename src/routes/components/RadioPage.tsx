import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

/**
 * state 축의 칸은 항목 하나로 충분하다 — 선택 여부는 채워진 점 하나로
 * 이미 드러나고, 옆에 항목을 더 두어도 그 자체가 더 뜻을 보태지 않는다
 * (Checkbox가 인스턴스 하나로 checked를 보이는 것과 같다). 오히려 둘을
 * 그리면 focus 칸에서 강제 포커스 링(.state-focus)이 두 항목 모두에
 * 걸려 '포커스는 한 번에 하나'라는 사실이 흐려진다.
 *
 * layout 축의 horizontal만 항목을 둘 그린다 — 가로로 늘어놓은 모습은
 * 견줄 항목이 있어야 보인다. vertical과 with-description은 항목
 * 하나로도 뜻이 선다.
 */
function renderRadio(options: RenderOptions) {
  const { state, layout } = options
  const selected = state === 'selected'
  const disabled = state === 'disabled'
  const horizontal = layout === 'horizontal'
  const withDescription = layout === 'with-description'

  const item = (value: string, label: string, description: string) => {
    const control = <RadioGroupItem value={value} />

    if (withDescription) {
      return (
        <label key={value} className="flex items-start gap-2">
          <span className="pt-0.5">{control}</span>
          <span className="flex flex-col">
            <span className="text-sm">{label}</span>
            <span className="text-muted-foreground text-12">{description}</span>
          </span>
        </label>
      )
    }

    return (
      <label key={value} className="flex items-center gap-2 text-sm">
        {control}
        {label}
      </label>
    )
  }

  return (
    <RadioGroup
      value={selected ? 'a' : undefined}
      disabled={disabled}
      orientation={horizontal ? 'horizontal' : 'vertical'}
      className={cn(horizontal ? 'flex-row gap-4' : 'flex-col gap-2')}
    >
      {item('a', '표준 배포', '모든 사용자에게 즉시 배포합니다')}
      {horizontal && item('b', '단계적 배포', '일부 사용자에게 먼저 배포합니다')}
    </RadioGroup>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Radio와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'option-count':
      return kind === 'do' ? (
        <RadioGroup defaultValue="recent" className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="recent" />
            최신순
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="popular" />
            인기순
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="name" />
            이름순
          </label>
        </RadioGroup>
      ) : (
        <RadioGroup defaultValue="kr" className="gap-1.5">
          {['대한민국', '일본', '중국', '미국', '캐나다', '영국', '프랑스'].map((label, i) => (
            <label key={label} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={i === 0 ? 'kr' : label} />
              {label}
            </label>
          ))}
        </RadioGroup>
      )

    case 'default-selection':
      return kind === 'do' ? (
        <RadioGroup defaultValue="viewer" className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="viewer" />
            뷰어
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="editor" />
            편집자
          </label>
        </RadioGroup>
      ) : (
        <RadioGroup className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="viewer" />
            뷰어
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="editor" />
            편집자
          </label>
        </RadioGroup>
      )

    case 'no-deselect':
      return kind === 'do' ? (
        <RadioGroup defaultValue="none" className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="none" />
            선택 안 함
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="male" />
            남성
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="female" />
            여성
          </label>
        </RadioGroup>
      ) : (
        <RadioGroup defaultValue="male" className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="male" />
            남성
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="female" />
            여성
          </label>
        </RadioGroup>
      )

    case 'no-size-axis':
      return kind === 'do' ? (
        <RadioGroup defaultValue="a" className="contents">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="a" />
            공지 즉시 발송
          </label>
        </RadioGroup>
      ) : (
        <RadioGroup defaultValue="a" className="contents">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="a" className="scale-125" />
            공지 즉시 발송
          </label>
        </RadioGroup>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'sort-order':
      return (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">정렬 기준</legend>
          <RadioGroup defaultValue="recent" className="gap-1.5">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="recent" />
              최신순
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="popular" />
              인기순
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="name" />
              이름순
            </label>
          </RadioGroup>
        </fieldset>
      )

    case 'deploy-scope':
      return (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">배포 범위</legend>
          <RadioGroup defaultValue="all" className="gap-1.5">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="all" />
              전체 배포
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="canary" />
              단계적 배포
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="group" />
              그룹별 배포
            </label>
          </RadioGroup>
        </fieldset>
      )

    case 'billing-cycle':
      return (
        <RadioGroup defaultValue="yearly" className="gap-3">
          <label className="flex items-start gap-2">
            <span className="pt-0.5">
              <RadioGroupItem value="monthly" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm">월간 결제</span>
              <span className="text-muted-foreground text-12">매달 1일에 결제합니다</span>
            </span>
          </label>
          <label className="flex items-start gap-2">
            <span className="pt-0.5">
              <RadioGroupItem value="yearly" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm">연간 결제</span>
              <span className="text-muted-foreground text-12">
                한 번에 결제하고 2개월치를 아낍니다
              </span>
            </span>
          </label>
        </RadioGroup>
      )

    case 'permission-level':
      return (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">권한 등급</legend>
          <RadioGroup defaultValue="editor" className="gap-1.5">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="viewer" />
              뷰어
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="editor" />
              편집자
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="admin" />
              관리자
            </label>
          </RadioGroup>
        </fieldset>
      )

    case 'two-line-item':
      return (
        <Bounds className="w-56">
          <RadioGroup defaultValue="a" className="gap-2">
            <label className="flex items-start gap-2 text-sm">
              <span className="pt-0.5">
                <RadioGroupItem value="a" />
              </span>
              워크스페이스의 모든 청구서와 결제 수단을 볼 수 있는 권한
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="b" />
              읽기 전용 권한
            </label>
          </RadioGroup>
        </Bounds>
      )

    case 'disabled-selected':
      return (
        <RadioGroup defaultValue="admin" disabled className="gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="viewer" />
            뷰어
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="admin" />
            관리자
          </label>
        </RadioGroup>
      )

    case 'two-options':
      return (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">공개 범위</legend>
          <RadioGroup defaultValue="public" className="gap-1.5">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="public" />
              공개
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="private" />
              비공개
            </label>
          </RadioGroup>
        </fieldset>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <RadioGroup defaultValue="a" className="gap-2">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="a" />
              마케팅 이메일 수신 동의
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="b" />
              수신 거부
            </label>
          </RadioGroup>
        </Bounds>
      )

    default:
      return null
  }
}

/**
 * 그룹 전체가 하나의 컨트롤이다. 항목 하나만 그리면 '여럿 중 하나를
 * 고른다'는 뜻이 사라지므로, 무대에는 그룹 인스턴스 하나에 항목 둘을
 * 둔다 — 두 번째 항목은 첫 항목의 뜻을 성립시키는 맥락일 뿐이라
 * data-anatomy를 붙이지 않고 지시선도 받지 않는다.
 */
function AnatomyPreview() {
  return (
    <RadioGroup data-anatomy="group" defaultValue="all" className="gap-2">
      <label className="flex items-start gap-2">
        <span className="pt-0.5">
          <RadioGroupItem data-anatomy="item" value="all" />
        </span>
        <span className="flex flex-col">
          <span data-anatomy="label" className="text-sm">
            전체 배포
          </span>
          <span data-anatomy="description" className="text-muted-foreground text-12">
            모든 사용자에게 한 번에 배포합니다
          </span>
        </span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="canary" />
        단계적 배포
      </label>
    </RadioGroup>
  )
}

export function RadioPage() {
  const meta = getComponent('radio')
  if (!meta) return <Placeholder title="Radio 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderRadio}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
