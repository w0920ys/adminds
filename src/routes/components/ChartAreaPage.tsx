import type { ReactNode } from 'react'
import { ChartArea } from '@/components/ui/chart-area'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const VISITOR_DATA = [
  { date: '1월', visitors: 186 },
  { date: '2월', visitors: 305 },
  { date: '3월', visitors: 237 },
  { date: '4월', visitors: 273 },
  { date: '5월', visitors: 209 },
  { date: '6월', visitors: 314 },
]
const VISITOR_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

const PLATFORM_DATA = [
  { date: '1월', desktop: 186, mobile: 80 },
  { date: '2월', desktop: 305, mobile: 200 },
  { date: '3월', desktop: 237, mobile: 120 },
  { date: '4월', desktop: 273, mobile: 190 },
  { date: '5월', desktop: 209, mobile: 130 },
  { date: '6월', desktop: 314, mobile: 140 },
]
const PLATFORM_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}

function render(options: { stacked?: string; gradient?: string; showLegend?: string }) {
  return (
    <ChartArea
      title="플랫폼별 방문자"
      description="1월 - 6월"
      data={PLATFORM_DATA}
      config={PLATFORM_CONFIG}
      categoryKey="date"
      stacked={options.stacked === 'on'}
      gradient={options.gradient === 'on'}
      showLegend={options.showLegend === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'visitor-trend':
      return <ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" />
    case 'channel-stacked':
      return (
        <ChartArea title="플랫폼별 방문자" description="1월 - 6월" data={PLATFORM_DATA} config={PLATFORM_CONFIG} categoryKey="date" stacked />
      )
    case 'gradient-fill':
      return (
        <ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" gradient />
      )
    default:
      return null
  }
}

export function ChartAreaPage() {
  const meta = getComponent('chart-area')
  if (!meta) return <Placeholder title="Chart Area 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" />}
      renderExample={renderExample}
    />
  )
}
