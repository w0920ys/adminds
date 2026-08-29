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

const TEAM_DATA = [
  { skill: '소통', a: 186, b: 160 },
  { skill: '실행력', a: 305, b: 220 },
  { skill: '문제해결', a: 237, b: 250 },
  { skill: '협업', a: 273, b: 210 },
  { skill: '기획', a: 209, b: 190 },
]
const TEAM_CONFIG: ChartConfig = {
  a: { label: 'A팀', color: 'var(--chart-1)' },
  b: { label: 'B팀', color: 'var(--chart-2)' },
}

function render(options: { gridType?: string }) {
  return (
    <ChartRadar
      title="역량 비교"
      description="분기 평가"
      data={SKILL_DATA}
      config={SKILL_CONFIG}
      categoryKey="skill"
      gridType={options.gridType === 'circle' ? 'circle' : 'polygon'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'skill-profile':
      return <ChartRadar title="역량 비교" description="분기 평가" data={SKILL_DATA} config={SKILL_CONFIG} categoryKey="skill" />
    case 'team-comparison':
      return <ChartRadar title="팀별 역량 비교" description="분기 평가" data={TEAM_DATA} config={TEAM_CONFIG} categoryKey="skill" showLegend />
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
