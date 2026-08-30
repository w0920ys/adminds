import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-area-default·chart-area-gradient를 옮긴 계열 컴포넌트.
 * config 키가 하나면 chart-area-default, 둘 이상이면 chart-area-legend와
 * 같은 모양이 된다. stacked를 켜면 chart-area-stacked, gradient를 켜면
 * chart-area-gradient와 같다.
 *
 * showLegend를 명시하지 않으면 계열이 둘 이상일 때 자동으로 범례가
 * 붙는다(기존 관례). showLegend={false}로 계열이 여럿이어도 범례를
 * 끌 수 있고, showLegend={true}로 강제로 켤 수도 있다.
 */
export function ChartArea({
  title,
  description,
  data,
  config,
  categoryKey,
  stacked = false,
  gradient = false,
  showLegend,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  stacked?: boolean
  gradient?: boolean
  /** 안 정하면 계열이 둘 이상일 때 자동으로 켜진다 */
  showLegend?: boolean
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)
  const resolvedShowLegend = showLegend ?? seriesKeys.length > 1
  // 한 페이지에 ChartArea가 여러 번 렌더될 수 있어(Playground·Cases 등) id를
  // 인스턴스마다 다르게 둔다 — 안 그러면 gradient id가 겹쳐 그 자체로는
  // 무효한 SVG는 아니어도(둘 다 같은 정의라 우연히 눈에 티는 안 났다)
  // 문서상 잘못된 중복 id가 된다.
  const gradientId = React.useId()

  return (
    <Card className="w-full">
      <CardHeader className="gap-2">
        <CardTitle className="text-16">{title}</CardTitle>
        <CardDescription className="text-14">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <AreaChart
            /*
             * key를 stacked·showLegend에 묶어 리마운트를 강제한다 — Chart Bar의
             * layout·stackId와 같은 recharts 3.10.1 버그를 stacked 토글에서도 실제로
             * 재현했다(토글 전후 SVG area path의 d 속성이 완전히 같았다 — 계획서의
             * "Area는 문제없다"는 판단은 이 재확인 전까지의 것이었다). showLegend도
             * 이제 명시적으로 켜고 끌 수 있는 구조적 변화라 같은 취급을 한다(Chart
             * Pie의 variant+showLegend 조합 토글에서 이미 같은 버그를 겪었다). 단일
             * 조합 안에서는 렌더링 결과에 영향 없다 — 토글할 때만 새로 마운트되게 한다.
             */
            key={`${stacked}-${resolvedShowLegend}`}
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator={seriesKeys.length > 1 ? 'dot' : 'line'} />} />
            {resolvedShowLegend && <ChartLegend content={<ChartLegendContent />} />}
            {gradient && (
              <defs>
                {seriesKeys.map((key) => (
                  <linearGradient key={key} id={`chart-area-fill-${gradientId}-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
            )}
            {seriesKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={gradient ? `url(#chart-area-fill-${gradientId}-${key})` : `var(--color-${key})`}
                /*
                 * 계열이 하나뿐이면(겹칠 상대가 없으면) fillOpacity를 거의
                 * 불투명(0.9)으로 올린다 — 실측해보니 계열이 여럿이든
                 * 하나든 항상 0.4를 쓰던 예전 값은, 같은 --chart-N 색인데도
                 * 다른 차트 타입(Bar·Pie 등, 항상 불투명)보다 옅게 보이는
                 * 원인이었다. 계열이 둘 이상 겹칠 때(특히 stacked)는 뒤
                 * 레이어가 안 보이지 않도록 기존 0.4를 그대로 둔다.
                 */
                fillOpacity={seriesKeys.length > 1 ? 0.4 : 0.9}
                stroke={`var(--color-${key})`}
                stackId={stacked ? 'a' : undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
