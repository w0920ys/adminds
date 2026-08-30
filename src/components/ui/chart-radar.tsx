import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-radar-default·chart-radar-multiple·chart-radar-legend·
 * chart-radar-grid-circle-fill을 옮긴 계열 컴포넌트. config 키가 둘
 * 이상이면 축이 겹쳐 그려진다(multiple).
 */
export function ChartRadar({
  title,
  description,
  data,
  config,
  categoryKey,
  gridType = 'polygon',
  showLegend = false,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  gridType?: 'polygon' | 'circle'
  showLegend?: boolean
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)

  return (
    <Card className="w-full">
      <CardHeader className="gap-2">
        <CardTitle className="text-16">{title}</CardTitle>
        <CardDescription className="text-14">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-64">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator={seriesKeys.length > 1 ? 'line' : 'dot'} />} />
            <PolarAngleAxis dataKey={categoryKey} />
            <PolarGrid gridType={gridType} />
            {/*
             * Chart Area와 같은 이유로 계열이 하나뿐일 때만 fillOpacity를
             * 거의 불투명(0.9)으로 올린다 — 여럿이 겹칠 때(multiple)는
             * 뒤 도형이 가려지지 않도록 기존 0.6을 그대로 둔다.
             */}
            {seriesKeys.map((key) => (
              <Radar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                fillOpacity={seriesKeys.length > 1 ? 0.6 : 0.9}
              />
            ))}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
