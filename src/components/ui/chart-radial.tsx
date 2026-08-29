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
  showLegend = false,
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
  showLegend?: boolean
  totalLabel?: string
}) {
  const seriesKeys = Object.keys(config).filter((key) => key !== categoryKey)
  const isMultiSeries = seriesKeys.length > 1
  const total = isMultiSeries
    ? seriesKeys.reduce((sum, key) => sum + Number(data[0]?.[key] ?? 0), 0)
    : Number(data[0]?.[valueKey ?? seriesKeys[0]] ?? 0)
  /*
   * ChartLegend(recharts Legend)를 안 쓴다 — RadialBar의 legend payload는
   * recharts 내부에서 시리즈가 아니라 "행" 단위로 자동 생성되고
   * (selectRadialBarLegendPayload가 data를 한 행씩 돌며 각 행의 name 필드를
   * value로 쓴다 — node_modules에서 직접 확인함), 우리 데이터 행에는 name이
   * 없어 그 자동 payload가 항상 비어 있었다(범례에 색 점만 찍히고 글자가
   * 안 보임, 실제로 재현·확인함). Legend에 payload를 직접 넘겨도 소용없다 —
   * ChartLegendContent가 실제로 읽는 값은 Legend 내부가 Redux 상태에서
   * 만드는 contextPayload지 우리가 준 payload prop이 아니다(recharts
   * Legend.js를 직접 읽어 확인함). config에서 직접 라벨·색을 읽어 같은
   * 모양의 범례를 손으로 그린다.
   */
  const legendItems = (isMultiSeries ? seriesKeys : [valueKey ?? seriesKeys[0]]).map((key) => ({
    key,
    label: config[key]?.label ?? key,
    color: `var(--color-${key})`,
  }))

  return (
    <Card className="w-full">
      <CardHeader className="gap-2">
        <CardTitle className="text-16">{title}</CardTitle>
        <CardDescription className="text-14">{description}</CardDescription>
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
             * 얼마나 좁든 같은 비율로 맞게 했다.
             *
             * 단일 계열은 showLabel일 때 링을 더 얇게 한다(22%→60%) — 가운데
             * 숫자(text-24)+단위(퍼센트)가 차지하는 자리가 22% 반지름보다 커서
             * 링과 글자가 겹쳤다(실제로 재현해 확인함, "74"의 위쪽 절반이 이미
             * 링 안쪽까지 번져 있었다). showLabel이 꺼져 있을 때는 원본 비율
             * (30/110≈27%에 가까운 22%)을 그대로 쓴다 — 글자가 없으면 두꺼운
             * 링이 더 낫다.
             *
             * key를 showLabel에도 묶는다 — innerRadius가 이제 showLabel에 따라
             * 바뀌는 기하 값이라, Chart Bar·Area·Pie와 같은 recharts 3.10.1
             * 리마운트 버그를 그대로 물려받는다. showLegend는 이제 recharts
             * 트리 밖의 평범한 HTML로 그리므로(아래 legendItems 렌더링 참고)
             * 차트 구조에 영향이 없어 key에서 뺐다. isMultiSeries는 마운트
             * 이후 안 바뀌는 값(props 자체가 다른 데이터 모양을 요구)이라
             * 마찬가지로 key에서 뺐다.
             */
            key={String(showLabel)}
            innerRadius={isMultiSeries ? '58%' : showLabel ? '60%' : '22%'}
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
        {showLegend && (
          <div className="flex items-center justify-center gap-4 pt-3">
            {legendItems.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-12 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
                <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
