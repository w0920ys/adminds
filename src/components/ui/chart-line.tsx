import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-line-default·chart-line-multiple·chart-line-step·
 * chart-line-dots를 옮긴 계열 컴포넌트. config 키가 둘 이상이면 범례가
 * 자동으로 붙는다(multiple).
 */
export function ChartLine({
  title,
  description,
  data,
  config,
  categoryKey,
  curveType = 'monotone',
  showDots = false,
}: {
  title: string
  description: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  curveType?: 'monotone' | 'step'
  showDots?: boolean
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
    </Card>
  )
}
