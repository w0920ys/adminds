import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-line-default·chart-line-multiple·chart-line-step·
 * chart-line-dots를 옮긴 계열 컴포넌트. config 키가 둘 이상이면 범례가
 * 자동으로 붙는다(multiple).
 */
export interface ChartTrend {
  value: number
  note: string
}

export function ChartLine({
  title,
  description,
  data,
  config,
  categoryKey,
  curveType = 'monotone',
  showDots = false,
  trend,
  footerNote,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  curveType?: 'monotone' | 'step'
  showDots?: boolean
  trend?: ChartTrend
  footerNote?: string
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={seriesKeys.length === 1} />} />
            {seriesKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {seriesKeys.map((key) => (
              <Line
                key={key}
                dataKey={key}
                type={curveType}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={showDots ? { r: 3, fill: `var(--color-${key})` } : false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {(trend || footerNote) && (
        <CardFooter className="flex-col items-start gap-2 text-14">
          {trend && (
            <div className="flex gap-2 leading-none font-medium">
              {trend.note} {trend.value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
          {footerNote && <div className="text-muted-foreground leading-none">{footerNote}</div>}
        </CardFooter>
      )}
    </Card>
  )
}
