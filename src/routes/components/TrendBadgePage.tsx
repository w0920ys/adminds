import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { TrendBadge } from '@/components/ui/trend-badge'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function render(options: RenderOptions) {
  const deltaPct = options.direction === 'down' ? -12.4 : 12.4
  const higherIsBetter = options.meaning !== 'lower-better'
  return <TrendBadge deltaPct={deltaPct} higherIsBetter={higherIsBetter} />
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'stat-card-delta':
      return (
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-12">이번 달 매출</span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-semibold tabular-nums">₩12,400,000</span>
            <TrendBadge deltaPct={8.2} />
          </div>
        </div>
      )

    case 'table-cell-delta':
      return (
        <div className="bg-surface divide-y overflow-hidden rounded-md border">
          <div className="flex h-row-compact items-center gap-3 px-3">
            <span className="flex-1 truncate text-14">전환율</span>
            <TrendBadge deltaPct={3.4} />
          </div>
          <div className="flex h-row-compact items-center gap-3 px-3">
            <span className="flex-1 truncate text-14">이탈률</span>
            <TrendBadge deltaPct={-2.1} higherIsBetter={false} />
          </div>
        </div>
      )

    case 'zero':
      return <TrendBadge deltaPct={0} />

    case 'large-number':
      return <TrendBadge deltaPct={128.5} />

    default:
      return null
  }
}

export function TrendBadgePage() {
  const meta = getComponent('trend-badge')
  if (!meta) return <Placeholder title="Trend Badge 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={render({ direction: 'up', meaning: 'higher-better' })}
      renderExample={renderExample}
    />
  )
}
