import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-bar-default·chart-bar-horizontal·chart-bar-stacked·
 * chart-bar-label을 옮긴 계열 컴포넌트. config 키가 하나면 default, 둘
 * 이상이면 legend가 자동으로 붙는다(multiple). 음수 값은 data에 그대로
 * 넣으면 recharts가 알아서 그린다 — 별도 prop 없음.
 */
export interface ChartTrend {
  value: number
  note: string
}

export function ChartBar({
  title,
  description,
  data,
  config,
  categoryKey,
  orientation = 'columns',
  stacked = false,
  showValueLabels = false,
  trend,
  footerNote,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  /** columns: 세로 막대(기본). bars: 가로 막대 — recharts의 layout="vertical"에 대응한다 */
  orientation?: 'columns' | 'bars'
  stacked?: boolean
  showValueLabels?: boolean
  trend?: ChartTrend
  footerNote?: string
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
              <Bar key={key} dataKey={key} stackId={stacked ? 'a' : undefined} fill={`var(--color-${key})`} radius={isBars ? 4 : 8}>
                {showValueLabels && (
                  <LabelList
                    dataKey={key}
                    position={isBars ? 'right' : 'top'}
                    className="fill-foreground"
                    fontSize={12}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
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
