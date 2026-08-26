import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Progress, type ProgressSize, type ProgressVariant } from '@/components/ui/progress'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ProgressState = 'determinate' | 'indeterminate'

/*
 * Label과 Value는 Progress 밖에 놓인다 — 진행 막대 자체는 막대일 뿐이다.
 * 이 조각이 그 감싸개다. Playground·Properties 격자가 함께 쓰는 render
 * 하나가 이 조각을 그린다.
 */
function LabeledProgress({
  label,
  value,
  size,
  variant,
  className,
}: {
  label: string
  value?: number
  size?: ProgressSize
  variant?: ProgressVariant
  className?: string
}) {
  return (
    <div className={className ?? 'flex w-64 flex-col gap-1.5'}>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        {value != null && <span className="text-muted-foreground text-xs">{value}%</span>}
      </div>
      <Progress value={value} size={size} variant={variant} />
    </div>
  )
}

function renderProgress(options: RenderOptions) {
  const variant = (options.variant ?? 'default') as ProgressVariant
  const size = (options.size ?? 'sm') as ProgressSize
  const state = (options.state ?? 'determinate') as ProgressState
  const value = state === 'indeterminate' ? undefined : 66

  return <LabeledProgress label="파일 업로드" value={value} size={size} variant={variant} />
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Progress와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'give-value-when-known':
      return kind === 'do' ? (
        <LabeledProgress label="파일 업로드" value={72} size="sm" />
      ) : (
        <div className="flex w-64 flex-col gap-1.5">
          <span className="text-sm">파일 업로드</span>
          <Progress size="sm" />
        </div>
      )

    case 'show-number-with-bar':
      return kind === 'do' ? (
        <LabeledProgress label="업로드 중" value={58} size="sm" />
      ) : (
        <div className="flex w-64 flex-col gap-1.5">
          <span className="text-sm">업로드 중</span>
          <Progress value={58} size="sm" />
        </div>
      )

    case 'dont-signal-failure-by-color-alone':
      return kind === 'do' ? (
        <div className="flex w-64 flex-col gap-1.5">
          <LabeledProgress label="파일 업로드" value={42} size="sm" variant="destructive" />
          <p className="text-muted-foreground text-xs">네트워크 오류로 업로드에 실패했습니다</p>
        </div>
      ) : (
        <LabeledProgress label="파일 업로드" value={42} size="sm" variant="destructive" />
      )

    case 'no-regression':
      return kind === 'do' ? (
        <div className="flex w-64 flex-col gap-3">
          <LabeledProgress label="1분 전" value={40} size="sm" />
          <LabeledProgress label="지금" value={65} size="sm" />
        </div>
      ) : (
        <div className="flex w-64 flex-col gap-3">
          <LabeledProgress label="1분 전" value={65} size="sm" />
          <LabeledProgress label="지금" value={40} size="sm" />
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'file-upload':
      return (
        <div className="flex w-72 flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>보고서.xlsx</span>
            <span className="text-muted-foreground text-xs">72%</span>
          </div>
          <Progress value={72} size="sm" />
          <p className="text-muted-foreground text-xs">1.4MB / 2.0MB 업로드 중</p>
        </div>
      )

    case 'bulk-job-progress':
      return (
        <div className="flex w-72 flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>상품 일괄 등록</span>
            <span className="text-muted-foreground text-xs">340 / 500건</span>
          </div>
          <Progress value={68} />
        </div>
      )

    case 'usage-against-limit':
      return (
        <div className="flex w-72 flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>이번 달 API 호출</span>
            <span className="text-muted-foreground text-xs">8,200 / 10,000회</span>
          </div>
          <Progress value={82} variant="warning" />
        </div>
      )

    case 'multi-step-progress':
      return (
        <div className="flex w-72 flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>가입 절차</span>
            <span className="text-muted-foreground text-xs">3 / 4단계</span>
          </div>
          <Progress value={75} />
        </div>
      )

    case 'zero-and-hundred':
      return (
        <div className="flex w-64 flex-col gap-3">
          <LabeledProgress label="대기 중" value={0} size="sm" />
          <LabeledProgress label="완료" value={100} size="sm" variant="success" />
        </div>
      )

    case 'unknown-value':
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <span className="text-sm">데이터 불러오는 중</span>
          <Progress size="sm" />
        </div>
      )

    case 'failed':
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <LabeledProgress label="파일 업로드" value={42} size="sm" variant="destructive" />
          <p className="text-muted-foreground text-xs">네트워크 오류로 업로드에 실패했습니다</p>
        </div>
      )

    case 'narrow-width':
      return (
        <div className="w-24">
          <LabeledProgress
            label="진행"
            value={55}
            size="sm"
            className="flex w-full flex-col gap-1"
          />
        </div>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Label·Value는 Progress 밖에서
 * 페이지가 감싸므로 여기서 직접 data-anatomy를 단다 — Progress 자신은
 * 문서 시스템의 표시를 모른다. Indicator는 밖에서 닿을 수 없어
 * indicatorProps로 전달한다.
 */
function AnatomyPreview() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span data-anatomy="label">파일 업로드</span>
        <span data-anatomy="value" className="text-muted-foreground text-xs">
          64%
        </span>
      </div>
      <Progress
        data-anatomy="track"
        value={64}
        indicatorProps={{ 'data-anatomy': 'indicator' }}
      />
    </div>
  )
}

export function ProgressPage() {
  const meta = getComponent('progress')
  if (!meta) return <Placeholder title="Progress 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderProgress}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
