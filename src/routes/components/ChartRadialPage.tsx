import type { ReactNode } from 'react'
import { ChartRadial } from '@/components/ui/chart-radial'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const GOAL_CONFIG: ChartConfig = { progress: { label: '달성률' } }
const GOAL_DATA = [{ goal: '이번 분기', progress: 74, fill: 'var(--chart-1)' }]

const TOTAL_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}
const TOTAL_DATA = [{ month: '1월', desktop: 1260, mobile: 570 }]

function render(options: { showLabel?: string }) {
  return (
    <ChartRadial
      title="목표 달성률"
      description="이번 분기"
      data={GOAL_DATA}
      config={GOAL_CONFIG}
      categoryKey="goal"
      valueKey="progress"
      showLabel={options.showLabel === 'on'}
      totalLabel="퍼센트"
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'goal-progress':
      return (
        <ChartRadial
          title="목표 달성률"
          description="이번 분기"
          data={GOAL_DATA}
          config={GOAL_CONFIG}
          categoryKey="goal"
          valueKey="progress"
          showLabel
          totalLabel="퍼센트"
        />
      )
    case 'stacked-total':
      return (
        <ChartRadial
          title="플랫폼별 방문자"
          description="1월"
          data={TOTAL_DATA}
          config={TOTAL_CONFIG}
          categoryKey="month"
        />
      )
    default:
      return null
  }
}

export function ChartRadialPage() {
  const meta = getComponent('chart-radial')
  if (!meta) return <Placeholder title="Chart Radial 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={
        <ChartRadial title="목표 달성률" description="이번 분기" data={GOAL_DATA} config={GOAL_CONFIG} categoryKey="goal" valueKey="progress" showLabel totalLabel="퍼센트" />
      }
      renderExample={renderExample}
    />
  )
}
