import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { StatCard } from '@/components/ui/stat-card'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function render(options: RenderOptions) {
  const showDelta = options.delta !== 'hidden'
  const showHint = options.hint === 'shown'
  return (
    <StatCard
      label="이번 달 매출"
      value="₩12,400,000"
      deltaPct={showDelta ? 8.2 : undefined}
      hint={showHint ? '이번 달 1일부터 오늘까지 누적된 결제 완료 금액이에요' : undefined}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'dashboard-grid':
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="이번 달 매출" value="₩12,400,000" deltaPct={8.2} />
          <StatCard label="신규 가입" value="1,204명" deltaPct={-3.1} />
          <StatCard label="전환율" value="3.8%" deltaPct={0.4} />
          <StatCard label="이탈률" value="2.1%" deltaPct={-0.6} higherIsBetter={false} />
        </div>
      )

    case 'with-hint':
      return (
        <StatCard
          label="활성 사용자"
          value="8,412명"
          deltaPct={5.6}
          hint="최근 7일 안에 한 번이라도 로그인한 사용자 수예요"
        />
      )

    case 'no-delta':
      return <StatCard label="누적 가입자" value="102,304명" />

    case 'negative-value':
      return <StatCard label="이번 달 순손실" value="-₩1,200,000" deltaPct={-18.4} higherIsBetter={false} />

    default:
      return null
  }
}

export function StatCardPage() {
  const meta = getComponent('stat-card')
  if (!meta) return <Placeholder title="Stat Card 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={render({ delta: 'shown', hint: 'hidden' })}
      renderExample={renderExample}
    />
  )
}
