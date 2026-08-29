import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-radial-simple·chart-radial-label·chart-radial-stacked를
 * 옮긴 계열 컴포넌트. 두 데이터 모양을 받는다 — 계열이 하나면(config 키가
 * categoryKey 하나뿐) 항목별 색이 다른 단일 링(simple), 계열이 둘 이상이면
 * (config에 여러 시리즈 키) 그 시리즈들이 겹겹이 쌓인 링(stacked)이 된다.
 * 이 둘은 shadcn 원본에서도 서로 다른 데이터 모양을 쓴다 — 억지로 하나로
 * 합치지 않는다.
 *
 * 단일 계열은 percentMax(기본 100)를 만점으로 삼는 백분율 값을 가정한다
 * ("목표 대비 달성률"). 명시적 PolarAngleAxis 없이는 recharts가 데이터의
 * 최댓값을 축으로 써서(값 74 → 축 0~74) 링이 실제 비율과 무관하게 항상
 * 거의 꽉 차 보인다(SVG sector path가 거의 360도를 그리는 것으로 확인함) —
 * 다계열 쪽(축을 total로 명시)과 같은 이유로 단일 계열에도 축을 명시한다.
 */
export function ChartRadial({
  title,
  description,
  data,
  config,
  categoryKey,
  valueKey,
  percentMax = 100,
  showLabel = false,
  totalLabel,
}: {
  title: string
  description: string
  /** 단일 계열: [{ [categoryKey]: string, [valueKey]: number, fill: string }]. 다계열: [{ [categoryKey]: string, ...시리즈 키: number }] 한 행 */
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categoryKey: string
  /** 단일 계열일 때만 쓴다 — 다계열이면 config의 시리즈 키들을 대신 읽는다 */
  valueKey?: string
  /** 단일 계열일 때 링이 100%로 보는 값. 값이 이미 백분율(0~100)이면 기본값 그대로 둔다 */
  percentMax?: number
  showLabel?: boolean
  totalLabel?: string
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)
  const isMultiSeries = seriesKeys.length > 1
  const total = isMultiSeries
    ? seriesKeys.reduce((sum, key) => sum + Number(data[0]?.[key] ?? 0), 0)
    : Number(data[0]?.[valueKey ?? seriesKeys[0]] ?? 0)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square w-full max-h-64">
          <RadialBarChart
            data={data}
            /*
             * shadcn 원본은 innerRadius·outerRadius를 고정 px로 준다(80/30, 110).
             * 이 값은 원본이 가정한 넓은 캔버스에서만 맞다 — 컨테이너 너비가 원의
             * 지름보다 좁아지면 고정 px 반지름이 절반 너비를 넘어서 링이 꽉 찬
             * 사각형처럼 잘려 보인다(실제로 재현해 확인함). 퍼센트로 바꿔 컨테이너가
             * 얼마나 좁든 같은 비율로 맞게 했다 — 원본 비율(80/110·30/110)을 그대로
             * 유지한 값이다.
             */
            innerRadius={isMultiSeries ? '58%' : '22%'}
            outerRadius="80%"
            endAngle={isMultiSeries ? 180 : undefined}
          >
            {/*
             * nameKey={categoryKey}를 넣지 않는다 — Chart Pie는 config 키가 곧
             * categoryKey 값이라(data.browser === 'chrome' === config의 chrome 키)
             * nameKey가 필요하지만, Radial은 config 키가 시리즈 키(progress·desktop 등)라
             * categoryKey 값(예: '이번 분기')이 config에 없어 라벨이 못 찾아지고 원시
             * dataKey('progress' 등)가 그대로 보였다(실제로 재현·확인함). nameKey 없이
             * item.name(=dataKey, config 키와 일치)에 맡긴다 — Area·Bar·Line·Radar와
             * 같은 방식이다.
             */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarAngleAxis type="number" domain={isMultiSeries ? [0, total] : [0, percentMax]} tick={false} axisLine={false} />
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
    </Card>
  )
}
