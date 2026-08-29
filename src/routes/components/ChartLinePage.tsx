import type { ReactNode } from 'react'
import { ChartLine } from '@/components/ui/chart-line'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const SIGNUP_DATA = [
  { date: '1월', signups: 186 },
  { date: '2월', signups: 305 },
  { date: '3월', signups: 237 },
  { date: '4월', signups: 273 },
  { date: '5월', signups: 209 },
  { date: '6월', signups: 314 },
]
const SIGNUP_CONFIG: ChartConfig = { signups: { label: '가입', color: 'var(--chart-1)' } }

const PLAN_DATA = [
  { date: '1월', paid: 42, free: 210 },
  { date: '2월', paid: 51, free: 225 },
  { date: '3월', paid: 47, free: 240 },
  { date: '4월', paid: 60, free: 262 },
  { date: '5월', paid: 55, free: 251 },
  { date: '6월', paid: 74, free: 301 },
]
const PLAN_CONFIG: ChartConfig = {
  paid: { label: '유료', color: 'var(--chart-1)' },
  free: { label: '무료', color: 'var(--chart-2)' },
}

function render(options: { curveType?: string }) {
  return (
    <ChartLine
      title="유료·무료 가입 추세"
      description="1월 - 6월"
      data={PLAN_DATA}
      config={PLAN_CONFIG}
      categoryKey="date"
      curveType={options.curveType === 'step' ? 'step' : 'monotone'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'signup-trend':
      return <ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" />
    case 'plan-comparison':
      return <ChartLine title="유료·무료 가입 추세" description="1월 - 6월" data={PLAN_DATA} config={PLAN_CONFIG} categoryKey="date" />
    case 'with-dots':
      return <ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" showDots />
    default:
      return null
  }
}

export function ChartLinePage() {
  const meta = getComponent('chart-line')
  if (!meta) return <Placeholder title="Chart Line 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" />}
      renderExample={renderExample}
    />
  )
}
