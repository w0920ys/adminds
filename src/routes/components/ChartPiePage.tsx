import type { ReactNode } from 'react'
import { ChartPie, type ChartPieDatum } from '@/components/ui/chart-pie'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const BROWSER_CONFIG: ChartConfig = {
  visitors: { label: '방문자' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: '기타', color: 'var(--chart-5)' },
}
const BROWSER_DATA: ChartPieDatum[] = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
]

function render(options: { variant?: string; showLegend?: string }) {
  return (
    <ChartPie
      title="브라우저 점유율"
      description="1월 - 6월"
      data={BROWSER_DATA}
      config={BROWSER_CONFIG}
      categoryKey="browser"
      valueKey="visitors"
      variant={options.variant === 'donut' ? 'donut' : 'pie'}
      showLegend={options.showLegend === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'browser-share':
      return (
        <ChartPie
          title="브라우저 점유율"
          description="1월 - 6월"
          data={BROWSER_DATA}
          config={BROWSER_CONFIG}
          categoryKey="browser"
          valueKey="visitors"
          variant="donut"
          showLegend
        />
      )
    case 'plain-pie':
      return (
        <ChartPie title="브라우저 점유율" description="1월 - 6월" data={BROWSER_DATA} config={BROWSER_CONFIG} categoryKey="browser" valueKey="visitors" />
      )
    default:
      return null
  }
}

export function ChartPiePage() {
  const meta = getComponent('chart-pie')
  if (!meta) return <Placeholder title="Chart Pie 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={
        <ChartPie title="브라우저 점유율" description="1월 - 6월" data={BROWSER_DATA} config={BROWSER_CONFIG} categoryKey="browser" valueKey="visitors" variant="donut" />
      }
      renderExample={renderExample}
    />
  )
}
