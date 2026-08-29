import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-area-default·chart-area-gradient를 옮긴 계열 컴포넌트.
 * config 키가 하나면 chart-area-default, 둘 이상이면 chart-area-legend(범례
 * 자동으로 붙음)와 같은 모양이 된다. stacked를 켜면 chart-area-stacked,
 * gradient를 켜면 chart-area-gradient와 같다.
 */
export interface ChartTrend {
  value: number
  note: string
}

export function ChartArea({
  title,
  description,
  data,
  config,
  categoryKey,
  stacked = false,
  gradient = false,
  trend,
  footerNote,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  stacked?: boolean
  gradient?: boolean
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
          <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator={seriesKeys.length > 1 ? 'dot' : 'line'} />} />
            {seriesKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {gradient && (
              <defs>
                {seriesKeys.map((key) => (
                  <linearGradient key={key} id={`chart-area-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
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
                fill={gradient ? `url(#chart-area-fill-${key})` : `var(--color-${key})`}
                fillOpacity={0.4}
                stroke={`var(--color-${key})`}
                stackId={stacked ? 'a' : undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {(trend || footerNote) && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-14">
            <div className="grid gap-2">
              {trend && (
                <div className="flex items-center gap-2 leading-none font-medium">
                  {trend.note} {trend.value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
              )}
              {footerNote && <div className="text-muted-foreground flex items-center gap-2 leading-none">{footerNote}</div>}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
