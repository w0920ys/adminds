import { Cell, Funnel, FunnelChart, LabelList } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatPercent } from '@/lib/format'

/*
 * shadcn 차트 갤러리에는 퍼널 유형이 없다 — 실제 서비스(momeokji-admin)가
 * 단계별 감소를 보여줄 자리가 필요해 직접 만들어 쓰던 것을 이식한다.
 * Mixpanel 류 제품 애널리틱스 퍼널과 같은 방식으로 읽는다. 핵심은 "전체
 * 대비 몇 %가 남았나"가 아니라 "바로 직전 단계에서 몇 %가 넘어왔나"다 —
 * 초반 단계는 원래 모수가 커서 %가 낮게 나오는 게 당연하고, 정작 봐야
 * 할 건 각 전환 지점에서 얼마나 새는가다. 그래서 도형 안 라벨은 직전
 * 단계 대비 전환율을 1차로 보여주고(첫 단계는 기준이라 값만), 위에
 * 처음→끝 전체 전환율을 한 줄로 따로 둔다 — Mixpanel 퍼널 패널 상단의
 * "X% 전체 전환"과 같은 자리다.
 *
 * 형제 컴포넌트(Chart Pie 등)와 같은 관례를 따른다 — 카테고리(단계)가
 * 데이터 값이라 고정된 --color-<key>를 미리 알 수 없으므로, 각 행이
 * fill(예: 'var(--color-step1)')을 직접 들고 온다. config는 그 값을
 * ChartStyle이 주입하는 데(그리고 툴팁 라벨을 찾는 데) 쓰인다.
 */
export interface ChartFunnelDatum {
  [key: string]: string | number
  fill: string
}

export function ChartFunnel({
  title,
  description,
  data,
  config,
  categoryKey,
  valueKey,
  valueFormatter = (v: number) => String(v),
}: {
  title: string
  description: string
  data: ChartFunnelDatum[]
  config: ChartConfig
  categoryKey: string
  valueKey: string
  valueFormatter?: (v: number) => string
}) {
  const first = (data[0]?.[valueKey] as number) || 1
  const last = (data[data.length - 1]?.[valueKey] as number) ?? 0
  const overallPct = first ? (last / first) * 100 : 0

  return (
    <Card className="w-full">
      <CardHeader className="gap-2">
        <CardTitle className="text-16">{title}</CardTitle>
        <CardDescription className="text-14">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-14">
          <span className="text-muted-foreground">전체 전환율 </span>
          <span className="text-foreground font-semibold tabular-nums">{formatPercent(overallPct)}</span>
          <span className="text-muted-foreground">
            {' '}
            ({data[0]?.[categoryKey]} → {data[data.length - 1]?.[categoryKey]})
          </span>
        </div>
        <ChartContainer config={config}>
          <FunnelChart>
            {/* 여기 툴팁은 보조 정보라 기본 숫자 포맷(item.value.toLocaleString())으로
                충분하다 — 실제 수치 포맷은 도형 위 라벨(아래 LabelList content)이
                valueFormatter로 담당한다 */}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Funnel dataKey={valueKey} data={data} nameKey={categoryKey} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={String(d[categoryKey])} fill={d.fill} />
              ))}
              <LabelList position="right" dataKey={categoryKey} className="fill-foreground text-12 font-medium" />
              {/*
               * dataKey 기반 formatter는 값만 받고 인덱스를 안 줘서 "직전 단계
               * 대비"를 계산할 수 없다 — content 렌더 함수로 바꿔 index를
               * 받아 data[index-1]과 직접 비교한다.
               */}
              <LabelList
                position="center"
                dataKey={valueKey}
                content={(raw: unknown) => {
                  // recharts의 LabelList content 타입은 value를 RenderableText(문자열도
                  // 허용하는 넓은 유니온)로 잡아 여기서 다시 좁혀야 한다.
                  const props = raw as {
                    x?: number | string
                    y?: number | string
                    width?: number | string
                    height?: number | string
                    value?: unknown
                    index?: number
                  }
                  const x = Number(props.x ?? 0)
                  const y = Number(props.y ?? 0)
                  const width = Number(props.width ?? 0)
                  const h = Number(props.height ?? 0)
                  const { value, index } = props
                  if (typeof value !== 'number' || index == null) return null
                  const prev = index === 0 ? null : (data[index - 1]?.[valueKey] as number | undefined)
                  const label =
                    prev == null
                      ? valueFormatter(value)
                      : `${valueFormatter(value)} · 이전 대비 ${formatPercent(prev ? (value / prev) * 100 : 0, 0)}`
                  return (
                    <text
                      x={x + width / 2}
                      y={y + h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-background text-12 font-semibold"
                    >
                      {label}
                    </text>
                  )
                }}
              />
            </Funnel>
          </FunnelChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
