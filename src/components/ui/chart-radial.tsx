import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-radial-simple·chart-radial-label·chart-radial-stacked를
 * 옮긴 계열 컴포넌트. 두 데이터 모양을 받는다 — 계열이 하나면(config 키가
 * categoryKey 하나뿐) 항목별 색이 다른 단일 링(simple), 계열이 둘 이상이면
 * (config에 여러 시리즈 키) 그 시리즈들이 겹겹이 쌓인 링(stacked)이 된다.
 * 이 둘은 shadcn 원본에서도 서로 다른 데이터 모양을 쓴다 — 억지로 하나로
 * 합치지 않는다.
 */
export interface ChartTrend {
  value: number
  note: string
}

export function ChartRadial({
  title,
  description,
  data,
  config,
  categoryKey,
  valueKey,
  showLabel = false,
  totalLabel,
  trend,
  footerNote,
}: {
  title: string
  description: string
  /** 단일 계열: [{ [categoryKey]: string, [valueKey]: number, fill: string }]. 다계열: [{ [categoryKey]: string, ...시리즈 키: number }] 한 행 */
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  /** 단일 계열일 때만 쓴다 — 다계열이면 config의 시리즈 키들을 대신 읽는다 */
  valueKey?: string
  showLabel?: boolean
  totalLabel?: string
  trend?: ChartTrend
  footerNote?: string
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)
  const isMultiSeries = seriesKeys.length > 1
  const total = isMultiSeries
    ? seriesKeys.reduce((sum, key) => sum + Number(data[0]?.[key] ?? 0), 0)
    : Number(data[0]?.[valueKey ?? seriesKeys[0]] ?? 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square w-full max-h-64">
          <RadialBarChart
            data={data}
            innerRadius={isMultiSeries ? 80 : 30}
            outerRadius={110}
            endAngle={isMultiSeries ? 180 : undefined}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey={categoryKey} />} />
            {isMultiSeries && <PolarAngleAxis type="number" domain={[0, total]} tick={false} axisLine={false} />}
            {isMultiSeries ? (
              seriesKeys.map((key) => (
                <RadialBar key={key} dataKey={key} stackId="a" cornerRadius={5} fill={`var(--color-${key})`} className="stroke-transparent stroke-2" />
              ))
            ) : (
              <RadialBar dataKey={valueKey ?? seriesKeys[0]} background />
            )}
            {showLabel && (
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-24 font-bold">
                            {total.toLocaleString()}
                          </tspan>
                          {totalLabel && (
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                              {totalLabel}
                            </tspan>
                          )}
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </PolarRadiusAxis>
            )}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {(trend || footerNote) && (
        <CardFooter className="flex-col gap-2 text-14">
          {trend && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend.note} {trend.value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
          {footerNote && <div className="text-muted-foreground leading-none">{footerNote}</div>}
        </CardFooter>
      )}
    </Card>
  )
}
