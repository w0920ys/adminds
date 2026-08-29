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
            {seriesKeys.map((key) => (
              <Radar key={key} dataKey={key} fill={`var(--color-${key})`} fillOpacity={0.6} />
            ))}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
