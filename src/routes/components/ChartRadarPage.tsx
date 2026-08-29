import type { ReactNode } from 'react'
import { ChartRadar } from '@/components/ui/chart-radar'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const SKILL_DATA = [
  { skill: '소통', score: 186 },
  { skill: '실행력', score: 305 },
  { skill: '문제해결', score: 237 },
  { skill: '협업', score: 273 },
  { skill: '기획', score: 209 },
]
const SKILL_CONFIG: ChartConfig = { score: { label: '점수', color: 'var(--chart-1)' } }

const PLATFORM_DATA = [
  { skill: '소통', desktop: 186, mobile: 160 },
  { skill: '실행력', desktop: 305, mobile: 220 },
  { skill: '문제해결', desktop: 237, mobile: 250 },
  { skill: '협업', desktop: 273, mobile: 210 },
  { skill: '기획', desktop: 209, mobile: 190 },
]
const PLATFORM_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}

function render(options: { gridType?: string; showLegend?: string }) {
  return (
    <ChartRadar
      title="역량 비교"
      description="분기 평가"
      data={SKILL_DATA}
      config={SKILL_CONFIG}
      categoryKey="skill"
      gridType={options.gridType === 'circle' ? 'circle' : 'polygon'}
      showLegend={options.showLegend === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'skill-profile':
      return <ChartRadar title="역량 비교" description="분기 평가" data={SKILL_DATA} config={SKILL_CONFIG} categoryKey="skill" />
    case 'team-comparison':
      return (
        <ChartRadar title="플랫폼별 역량 비교" description="분기 평가" data={PLATFORM_DATA} config={PLATFORM_CONFIG} categoryKey="skill" showLegend />
      )
    default:
      return null
  }
}

export function ChartRadarPage() {
  const meta = getComponent('chart-radar')
  if (!meta) return <Placeholder title="Chart Radar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartRadar title="역량 비교" description="분기 평가" data={SKILL_DATA} config={SKILL_CONFIG} categoryKey="skill" />}
      renderExample={renderExample}
    />
  )
}
