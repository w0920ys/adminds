import type { ReactNode } from 'react'
import { ChartFunnel, type ChartFunnelDatum } from '@/components/ui/chart-funnel'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

/*
 * 단계 이름에 공백을 넣지 않는다 — LabelList가 categoryKey 값을 도형
 * 오른쪽에 그대로 찍고, 그 값이 config 키이자 --color-<키> CSS 변수의
 * 접미사로도 그대로 쓰인다. CSS 커스텀 프로퍼티 이름은 공백을 못
 * 담으므로(한글 자체는 유효한 식별자 문자라 문제없다), 띄어 쓰지 않는
 * 한 단어로 잡는다.
 */
const SPIN_CONFIG: ChartConfig = {
  세션: { label: '세션', color: 'var(--chart-1)' },
  진입: { label: '진입', color: 'var(--chart-2)' },
  스핀: { label: '스핀', color: 'var(--chart-3)' },
  확정: { label: '확정', color: 'var(--chart-4)' },
}
/*
 * 마지막 단계 값을 첫 단계 대비 너무 작게 잡지 않는다 — 도형이 좁아질수록
 * 가운데 라벨(값 + 이전 대비 %)이 옆 카테고리 라벨과 겹친다. 컨테이너 폭이
 * 리사이즈 타이밍에 따라 미세하게 흔들리는 것까지 감안해, 첫 단계 대비
 * 75% 이상을 안전선으로 둔다.
 */
const SPIN_DATA: ChartFunnelDatum[] = [
  { step: '세션', value: 1200, fill: 'var(--color-세션)' },
  { step: '진입', value: 1020, fill: 'var(--color-진입)' },
  { step: '스핀', value: 940, fill: 'var(--color-스핀)' },
  { step: '확정', value: 900, fill: 'var(--color-확정)' },
]

/** 알림을 늘려 되돌아온 재방문이 직전 단계보다 늘어난 경우 — 이전 대비 100%를 넘는다 */
const REBOUND_CONFIG: ChartConfig = {
  방문: { label: '방문', color: 'var(--chart-1)' },
  이탈: { label: '이탈', color: 'var(--chart-2)' },
  재방문: { label: '재방문', color: 'var(--chart-3)' },
}
const REBOUND_DATA: ChartFunnelDatum[] = [
  { step: '방문', value: 500, fill: 'var(--color-방문)' },
  { step: '이탈', value: 400, fill: 'var(--color-이탈)' },
  { step: '재방문', value: 450, fill: 'var(--color-재방문)' },
]

function renderFunnel() {
  return (
    <ChartFunnel
      title="룰렛 참여 퍼널"
      description="이번 주"
      data={SPIN_DATA}
      config={SPIN_CONFIG}
      categoryKey="step"
      valueKey="value"
      valueFormatter={(v) => `${v.toLocaleString()}명`}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'spin-funnel':
      return renderFunnel()
    case 'step-increase':
      return (
        <ChartFunnel
          title="알림 재방문 퍼널"
          description="푸시 발송 이후 24시간"
          data={REBOUND_DATA}
          config={REBOUND_CONFIG}
          categoryKey="step"
          valueKey="value"
          valueFormatter={(v) => `${v.toLocaleString()}명`}
        />
      )
    default:
      return null
  }
}

export function ChartFunnelPage() {
  const meta = getComponent('chart-funnel')
  if (!meta) return <Placeholder title="Chart Funnel 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage meta={meta} render={renderFunnel} preview={renderFunnel()} renderExample={renderExample} />
  )
}
