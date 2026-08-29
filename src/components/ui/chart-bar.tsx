import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-bar-default·chart-bar-horizontal·chart-bar-stacked를
 * 옮긴 계열 컴포넌트. config 키가 하나면 default, 둘 이상이면 legend가
 * 자동으로 붙는다(multiple). 음수 값은 data에 그대로 넣으면 recharts가
 * 알아서 그린다 — 별도 prop 없음.
 */
export function ChartBar({
  title,
  description,
  data,
  config,
  categoryKey,
  orientation = 'columns',
  stacked = false,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  /** columns: 세로 막대(기본). bars: 가로 막대 — recharts의 layout="vertical"에 대응한다 */
  orientation?: 'columns' | 'bars'
  stacked?: boolean
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)
  const isBars = orientation === 'bars'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            /*
             * key를 orientation·stacked에 묶어 리마운트를 강제한다 — recharts
             * 3.10.1은 이미 마운트된 BarChart의 layout·stackId만 바뀌면 축·막대
             * 스케일을 다시 계산하지 않는다(Playground 토글이 화면상 안 바뀌는 것으로
             * 드러났다. SVG의 실제 x/y/width/height 속성을 읽어 확인했다). 단일 조합
             * 안에서는 렌더링 결과에 영향 없다 — 토글할 때만 새로 마운트되게 한다.
             */
            key={`${orientation}-${stacked}`}
            accessibilityLayer
            data={data}
            layout={isBars ? 'vertical' : 'horizontal'}
            margin={isBars ? { left: 12, right: 44 } : { left: 12, right: 12 }}
          >
            <CartesianGrid vertical={isBars} horizontal={!isBars} />
            {isBars ? (
              <>
                <XAxis type="number" hide />
                <YAxis dataKey={categoryKey} type="category" tickLine={false} axisLine={false} tickMargin={8} />
              </>
            ) : (
              <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
            )}
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={seriesKeys.length === 1} />} />
            {seriesKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {seriesKeys.map((key) => (
              <Bar key={key} dataKey={key} stackId={stacked ? 'a' : undefined} fill={`var(--color-${key})`} radius={isBars ? 4 : 8} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
