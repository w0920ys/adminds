import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-radar-default·chart-radar-multiple·chart-radar-legend·
 * chart-radar-grid-circle-fill을 옮긴 계열 컴포넌트. config 키가 둘
 * 이상이면 축이 겹쳐 그려진다(multiple).
 */
export interface ChartTrend {
  value: number
  note: string
}

export function ChartRadar({
  title,
  description,
  data,
  config,
  categoryKey,
  gridType = 'polygon',
  showLegend = false,
  trend,
  footerNote,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  gridType?: 'polygon' | 'circle'
  showLegend?: boolean
  trend?: ChartTrend
  footerNote?: string
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
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
      {(trend || footerNote) && (
        <CardFooter className="flex-col gap-2 text-14">
          {trend && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend.note} {trend.value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
          {footerNote && <div className="text-muted-foreground flex items-center gap-2 leading-none">{footerNote}</div>}
        </CardFooter>
      )}
    </Card>
  )
}
