import type { ReactNode } from 'react'
import { ChartBar } from '@/components/ui/chart-bar'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const MONTHLY_DATA = [
  { month: '1월', visitors: 186 },
  { month: '2월', visitors: 305 },
  { month: '3월', visitors: 237 },
  { month: '4월', visitors: 73 },
  { month: '5월', visitors: 209 },
  { month: '6월', visitors: 214 },
]
const MONTHLY_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

const PLATFORM_DATA = [
  { month: '1월', desktop: 186, mobile: 80 },
  { month: '2월', desktop: 305, mobile: 200 },
  { month: '3월', desktop: 237, mobile: 120 },
  { month: '4월', desktop: 73, mobile: 190 },
  { month: '5월', desktop: 209, mobile: 130 },
  { month: '6월', desktop: 214, mobile: 140 },
]
const PLATFORM_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}

const RANKING_DATA = [
  { source: '검색', visitors: 4820 },
  { source: '다이렉트', visitors: 3210 },
  { source: '소셜 미디어', visitors: 2150 },
  { source: '추천 링크', visitors: 1340 },
]
const RANKING_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

function render(options: { orientation?: string; stacked?: string }) {
  return (
    <ChartBar
      title="플랫폼별 방문자"
      description="1월 - 6월"
      data={PLATFORM_DATA}
      config={PLATFORM_CONFIG}
      categoryKey="month"
      orientation={options.orientation === 'bars' ? 'bars' : 'columns'}
      stacked={options.stacked === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'monthly-visitors':
      return <ChartBar title="월별 방문자" description="1월 - 6월" data={MONTHLY_DATA} config={MONTHLY_CONFIG} categoryKey="month" />
    case 'platform-stacked':
      return (
        <ChartBar title="플랫폼별 방문자" description="1월 - 6월" data={PLATFORM_DATA} config={PLATFORM_CONFIG} categoryKey="month" stacked />
      )
    case 'ranking-bars':
      return (
        <ChartBar title="유입경로별 순위" description="이번 달" data={RANKING_DATA} config={RANKING_CONFIG} categoryKey="source" orientation="bars" />
      )
    default:
      return null
  }
}

export function ChartBarPage() {
  const meta = getComponent('chart-bar')
  if (!meta) return <Placeholder title="Chart Bar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartBar title="월별 방문자" description="1월 - 6월" data={MONTHLY_DATA} config={MONTHLY_CONFIG} categoryKey="month" />}
      renderExample={renderExample}
    />
  )
}
