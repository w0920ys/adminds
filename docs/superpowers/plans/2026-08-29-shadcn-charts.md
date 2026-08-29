# shadcn 차트 갤러리 기반 Chart 컴포넌트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** shadcn 공식 차트 갤러리(68개 예시)를 계열당 1개(6개: Area·Bar·Line·Pie·Radar·Radial) + Properties 축으로 재구성해 adminds에 새 `chart` 카테고리로 들인다.

**Architecture:** `chart.tsx` 스캐폴드를 shadcn 공식 버전으로 올리고(Task 1), 그 위에 `Card`로 감싼 완성형 블록 6개를 짓는다(Task 2~7). 각 블록은 `data`+`config`(shadcn과 같은 `ChartConfig` 모양)를 받는 제네릭 API로, 계열 수·boolean 옵션으로 shadcn 68개 예시 중 대표 변형을 재현한다.

**Tech Stack:** React 19 + TypeScript, `recharts`(Task 1의 v0.18.0 브랜치에 이미 설치됨), Tailwind v4, `@/components/ui/card`(기존).

## Global Constraints

- 스펙: `docs/superpowers/specs/2026-08-29-shadcn-charts-design.md`
- **구조는 shadcn, 값은 이 저장소 토큰.** shadcn 원본이 자기 스케일을 쓰는 자리는 전부 옮긴다:

  | shadcn 원본 | 이 저장소 |
  |---|---|
  | `text-xs` | `text-12` |
  | `text-sm` | `text-14` |
  | `rounded-[2px]` | `rounded-sm` |
  | `min-w-[8rem]` | `min-w-32` |
  | `max-h-[250px]` / `max-w-[250px]` | `max-h-64` / `max-w-64` |
  | `max-h-[300px]` | `max-h-80` |
  | `text-2xl`(Radial 중앙 라벨) | `text-24` |

- `Card`(`@/components/ui/card`)를 그대로 조합한다 — `CardTitle`(`text-18`)·`CardDescription`(`text-16`)·`CardHeader`/`CardFooter`(`px-6`)는 이미 토큰화돼 있어 새로 손댈 게 없다.
- `registry.ts`에 항목을 추가하는 Task는 반드시 같은 Task 안에서 `registry.json` 항목 추가와 `npm run registry` 재굽기까지 마친다 — `registry-parity.test.ts`가 `adminds` 번들의 개수·설명·`registryDependencies`를 즉시 대조한다.
- `public/r/*.json`·`public/llms.txt`를 손으로 고치지 않는다. `npm run registry`(둘 다 자동 재생성)를 돌린다.
- 새 카테고리 `chart`를 `registry.ts`의 `ComponentCategory`·`categoryOrder`(`'data-display'` 다음, `'feedback'` 앞)·`categoryLabel`(`'Chart'`)에 추가한다(Task 2). `registry-order.test.ts`가 `categoryOrder`와 `nav-config.ts`의 Components 묶음 순서 일치를 자동으로 검증하므로, 새 카테고리를 추가하면 `nav-config.ts`에 그 이름의 묶음을 만드는 게 곧바로 필수가 된다.
- `data-display` 카테고리 안, `chart` 카테고리 안 둘 다에서 항목은 이름순 — `chart` 안에서는 **Area → Bar → Line → Pie → Radar → Radial** 순으로 Task 2~7이 하나씩 그 자리에 끼워 넣는다.
- 컴포넌트는 `"use client"` 지시어를 쓰지 않는다 — 이 저장소는 Next.js가 아니라 Vite SPA라 이 지시어가 필요 없다(shadcn 원본에는 있지만 옮기지 않는다).
- 임의 값 대괄호 표기 금지(위 표로 전부 옮김). CSS 변수를 `fill`/`stroke`/`style` prop에 문자열로 넘기는 것(`var(--chart-1)`, `var(--color-desktop)`)은 Tailwind 클래스가 아니므로 해당 없음.
- 언어 규칙 — 구조를 가리키는 이름은 영문, 설명은 한국어.
- 화면에 나오는 숫자를 손으로 적지 않는다.
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사, em-dash 쓰지 않는다.
- Vitest는 `node` 환경, jsdom 없음 — 렌더링 테스트 없음. 시각 검증은 `npm run build` + 개발 서버.
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.

---

### Task 1: `chart.tsx`를 shadcn 공식 버전으로 올린다

**Files:**
- Modify: `src/components/ui/chart.tsx`(momeokji-admin 축약판 → shadcn 공식 전체 기능판)

**Interfaces:**
- Consumes: 없음
- Produces: `ChartConfig`, `ChartContainer`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent`(이제 `hideIndicator`·`indicator`(`'line'|'dot'|'dashed'`)·`labelFormatter`·`labelClassName`·`formatter`·`color`·`nameKey`·`labelKey` prop을 받는다), `ChartLegend`, `ChartLegendContent`(이제 `hideIcon`·`verticalAlign`·`nameKey`를 받는다) — 전부 Task 2~7이 그대로 import한다.

- [ ] **Step 1: `src/components/ui/chart.tsx`를 shadcn 공식 소스 기준으로 다시 쓴다**

```tsx
import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import type { TooltipValueType } from 'recharts'
import { cn } from '@/lib/utils'

/*
 * 차트 6종(chart-area·chart-bar·chart-line·chart-pie·chart-radar·chart-radial)이
 * 공유하는 기반. shadcn/ui 공식 chart 레지스트리 컴포넌트를 그대로 옮겼다
 * (raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/chart.tsx,
 * curl로 직접 받아 확인 — WebFetch는 요약 모델을 거쳐 타입 시그니처가
 * 깎여 나갈 수 있다는 걸 이 Task 자체에서 겪었다) — ChartContainer가 config
 * (어떤 데이터 키가 어떤 라벨·색을 갖는지)를 Context로 내려보내고,
 * ChartTooltipContent·ChartLegendContent가 그대로 읽는다. 색은 여기서
 * 문자열로 박지 않고 <style> 태그로 CSS 변수를 주입한다 — 다크모드 전환이
 * 각 차트가 아니라 이 컴포넌트 하나에서 해결된다.
 *
 * ChartTooltipContent·ChartLegendContent의 prop 타입이 recharts의
 * DefaultTooltipContentProps·DefaultLegendContentProps를 반드시 끼고
 * 있어야 한다 — recharts 3.x부터 Tooltip·Legend 자신의 공개 props
 * 타입에서 payload·label·verticalAlign 등을 뺐다(내부 컨텍스트에서
 * 읽는 값이 됐다). 그 타입들을 안 끼고 React.ComponentProps<'div'>만
 * 쓰면 타입이 안 맞는다 — 실제로 한 번 이렇게 줄였다가 tsc가
 * TS2339·TS7006 여섯 개를 뱉은 걸 겪었다.
 */

const THEMES = { light: '', dark: '.dark' } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
>

type ChartContextProps = { config: ChartConfig }
const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error('useChart는 ChartContainer 안에서만 쓸 수 있다')
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
  initialDimension?: { width: number; height: number }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-12 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme ?? cfg.color)
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  } & Omit<RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>, 'accessibilityLayer'>) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value = !labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
    }
    if (!value) return null
    return <div className={cn('font-medium', labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) return null

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div
      className={cn(
        'bg-popover text-popover-foreground border-border/50 grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-12 shadow-xl',
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color

            return (
              <div
                key={index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn('shrink-0 rounded-sm border-(--color-border) bg-(--color-bg)', {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          })}
                          style={{ '--color-bg': indicatorColor, '--color-border': indicatorColor } as React.CSSProperties}
                        />
                      )
                    )}
                    <div className={cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')}>
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
                      </div>
                      {item.value != null && (
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div className={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}>
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div key={index} className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

/** payload에서 config 항목을 찾는다. 페이로드 자체 값(문자열)이 config 키를 가리킬 수도 있어 한 겹 더 본다 */
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null ? payload.payload : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
```

`border-(--color-border) bg-(--color-bg)`는 Tailwind v4의 CSS 변수 참조 문법(괄호, 대괄호 아님)이라 이 저장소의 "임의 값 대괄호 금지" 규칙 대상이 아니다 — 리터럴 값이 아니라 `style`로 실제로 주입되는 변수를 가리킬 뿐이다. 원본 그대로 둔다.

- [ ] **Step 2: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 3: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 전부 통과. `chart.tsx`를 아직 아무 컴포넌트도 새로 안 썼으므로 동작 차이는 없고 타입·빌드만 확인한다.

- [ ] **Step 4: 커밋한다**

```bash
git add src/components/ui/chart.tsx public/r/chart.json public/r/registry.json
git commit -m "feat(chart): chart.tsx를 shadcn 공식 버전으로 올린다

momeokji-admin이 줄인 버전 대신 nameKey·labelKey·formatter·
labelFormatter·hideIndicator·아이콘 지원까지 갖춘 shadcn 공식 소스를
그대로 옮긴다. 앞으로 지을 6개 차트 계열 다수가 이 기능을 쓴다."
```

---

### Task 2: 새 카테고리 `chart` + Chart Area

**Files:**
- Create: `src/components/ui/chart-area.tsx`
- Create: `src/routes/components/ChartAreaPage.tsx`
- Modify: `src/data/registry.ts`(`ComponentCategory`·`categoryOrder`·`categoryLabel`에 `chart` 추가 + 첫 항목)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 42→43)
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/nav-config.ts`(새 `Chart` 묶음 신설)
- Modify: `README.md`("42개 전부" → "43개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartArea`(`src/components/ui/chart-area.tsx`에서 export) — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-area.tsx`를 만든다**

```tsx
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
```

- [ ] **Step 2: `src/data/registry.ts`에 새 카테고리 `chart`를 추가한다**

`ComponentCategory` 타입에 `'chart'`를 추가한다:

```ts
export type ComponentCategory = 'actions' | 'inputs' | 'navigation' | 'feedback' | 'data-display' | 'chart'
```

`categoryOrder`에서 `'data-display'` 다음, `'feedback'` 앞에 놓는다:

```ts
export const categoryOrder: ComponentCategory[] = ['actions', 'inputs', 'navigation', 'data-display', 'chart', 'feedback']
```

`categoryLabel`에 추가한다:

```ts
export const categoryLabel: Record<ComponentCategory, string> = {
  actions: 'Actions',
  inputs: 'Inputs',
  navigation: 'Navigation',
  'data-display': 'Data Display',
  chart: 'Chart',
  feedback: 'Feedback',
}
```

- [ ] **Step 3: `src/data/registry.ts`에 `chart-area` 항목을 추가한다**

`components` 배열의 마지막(또는 카테고리 순서상 `data-display` 블록 뒤, `feedback` 블록 앞)에:

```ts
  {
    id: 'chart-area',
    name: 'Chart Area',
    aliases: ['영역 차트', '에어리어 차트', 'area chart'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '시간에 따른 값의 흐름을 채워진 영역으로 보인다. 값 자체보다 크기·비중의 인상을 강조할 때 막대·선보다 낫다.',
    anatomy: [],
    properties: [
      {
        name: 'stacked',
        title: 'Stacked',
        description: '계열이 둘 이상일 때 겹쳐 쌓을지 정한다.',
        display: 'row',
        options: [
          { value: 'off', note: '기본. 계열이 겹쳐 보인다' },
          { value: 'on', note: '계열이 쌓여 합계를 보인다' },
        ],
      },
      {
        name: 'gradient',
        title: 'Gradient',
        description: '채움을 단색으로 할지 그라데이션으로 할지 정한다.',
        display: 'row',
        options: [
          { value: 'off', note: '기본. 단색 채움' },
          { value: 'on', note: '위에서 아래로 옅어지는 채움' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'stacked-needs-multiple-series',
        title: 'stacked는 계열이 둘 이상일 때만 뜻이 있다',
        body: '계열이 하나면 stacked를 켜도 화면이 달라지지 않는다. 여러 항목의 합과 구성비를 함께 보일 때만 켠다.',
        do: ['계열이 둘 이상일 때 stacked로 합계와 구성비를 함께 보인다'],
        dont: ['계열이 하나뿐인데 stacked를 켜지 않는다'],
      },
    ],
    usage: [
      { id: 'visitor-trend', title: '방문자 추이', note: '단일 계열로 시간에 따른 값의 흐름을 보인다' },
      { id: 'channel-stacked', title: '유입경로별 누적', note: '여러 계열을 stacked로 쌓아 합계와 구성비를 함께 보인다' },
    ],
    cases: [
      { id: 'gradient-fill', title: '그라데이션 채움', note: '단색보다 부드러운 인상이 필요할 때' },
    ],
    verified: true,
  },
```

- [ ] **Step 4: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-area",
  "type": "registry:ui",
  "title": "Chart Area",
  "dependencies": ["recharts", "lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-area.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔두 개"→"마흔세 개"로, `registryDependencies`에 `chart-area.json`을 추가한다(어느 자리든 무방 — 카테고리 안이 아니라 전체 번들의 평평한 목록이다. 알파벳 순서 자리를 찾아 넣는다).

- [ ] **Step 5: `README.md`를 "42개 전부"→"43개 전부"로 고친다.**

- [ ] **Step 6: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 7: `src/routes/components/ChartAreaPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartArea } from '@/components/ui/chart-area'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const VISITOR_DATA = [
  { date: '1월', visitors: 186 },
  { date: '2월', visitors: 305 },
  { date: '3월', visitors: 237 },
  { date: '4월', visitors: 273 },
  { date: '5월', visitors: 209 },
  { date: '6월', visitors: 314 },
]
const VISITOR_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

const CHANNEL_DATA = [
  { date: '1월', direct: 80, search: 186 },
  { date: '2월', direct: 200, search: 305 },
  { date: '3월', direct: 120, search: 237 },
  { date: '4월', direct: 190, search: 273 },
  { date: '5월', direct: 130, search: 209 },
  { date: '6월', direct: 140, search: 314 },
]
const CHANNEL_CONFIG: ChartConfig = {
  direct: { label: '다이렉트', color: 'var(--chart-2)' },
  search: { label: '검색', color: 'var(--chart-1)' },
}

function render(options: { stacked?: string; gradient?: string }) {
  return (
    <ChartArea
      title="방문자 추이"
      description="1월 - 6월"
      data={CHANNEL_DATA}
      config={CHANNEL_CONFIG}
      categoryKey="date"
      stacked={options.stacked === 'on'}
      gradient={options.gradient === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'visitor-trend':
      return <ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" />
    case 'channel-stacked':
      return (
        <ChartArea title="유입경로별 방문자" description="1월 - 6월" data={CHANNEL_DATA} config={CHANNEL_CONFIG} categoryKey="date" stacked />
      )
    case 'gradient-fill':
      return (
        <ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" gradient />
      )
    default:
      return null
  }
}

export function ChartAreaPage() {
  const meta = getComponent('chart-area')
  if (!meta) return <Placeholder title="Chart Area 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartArea title="방문자 추이" description="1월 - 6월" data={VISITOR_DATA} config={VISITOR_CONFIG} categoryKey="date" />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 8: `src/routes/routes.tsx`에 라우트를 추가한다**

import을 알파벳 순서 근처에 끼워 넣고(`CardPage` 다음 근방), `components`의 `children` 배열 끝에 추가한다:

```tsx
import { ChartAreaPage } from '@/routes/components/ChartAreaPage'
```
```tsx
{ path: 'chart-area', element: <ChartAreaPage /> },
```

- [ ] **Step 9: `src/components/layout/nav-config.ts`에 새 `Chart` 묶음을 만든다**

`Data Display` 묶음 다음, `Feedback` 묶음 앞에 새 묶음을 추가한다(오늘 실제 날짜를 `updatedAt`에 쓴다):

```ts
      {
        label: 'Chart',
        items: [
          { to: '/components/chart-area', label: 'Chart Area', updatedAt: '<오늘 날짜>' },
        ],
      },
```

- [ ] **Step 10: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 전부 통과. `registry-order.test.ts`가 `categoryOrder`(이제 6개)와 `nav-config.ts`의 묶음 이름·순서가 정확히 일치하는지 검증한다 — `chart` 카테고리를 빠뜨리면 여기서 잡힌다.

- [ ] **Step 11: 개발 서버에서 확인한다**

`/components/chart-area`에서 `stacked`/`gradient` 옵션이 실제로 화면을 바꾸는지, LNB에 Chart 묶음이 Data Display와 Feedback 사이에 보이는지, 다크 모드 확인.

- [ ] **Step 12: 커밋한다**

```bash
git add src/components/ui/chart-area.tsx src/routes/components/ChartAreaPage.tsx src/data/registry.ts registry.json public/r/chart-area.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-area): 영역 차트를 새 Chart 카테고리로 짓는다

shadcn 공식 chart-area-default·gradient·legend·stacked를 참고해
계열 하나로 통합한 Chart Area를 짓는다. 새 chart 카테고리를 처음
연다 - LNB에 Data Display와 Feedback 사이 여섯 번째 묶음이 생긴다."
```

---

### Task 3: Chart Bar

**Files:**
- Create: `src/components/ui/chart-bar.tsx`
- Create: `src/routes/components/ChartBarPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart` 카테고리 안 `chart-area` 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 43→44)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`(Chart 묶음에 추가), `README.md`("43개 전부"→"44개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartBar`, `ChartTrend`(재정의하지 않고 `chart-area.tsx`가 이미 export한 것과 같은 모양을 자기 파일에도 독립적으로 선언 — 두 파일이 서로 import하지 않는, 서로 독립된 컴포넌트라는 설계를 유지한다)

- [ ] **Step 1: `src/components/ui/chart-bar.tsx`를 만든다**

```tsx
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
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-area'` 다음에:

```ts
  {
    id: 'chart-bar',
    name: 'Chart Bar',
    aliases: ['막대 차트', '바 차트', 'bar chart'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '카테고리별 값을 막대로 비교한다. 순위·크기 비교의 기본 차트다.',
    anatomy: [],
    properties: [
      {
        name: 'orientation',
        title: 'Orientation',
        description: '막대를 세로로 세울지 가로로 눕힐지 정한다.',
        display: 'row',
        options: [
          { value: 'columns', note: '기본. 세로 막대' },
          { value: 'bars', note: '이름이 길거나 항목이 적어 순위 비교가 목적일 때' },
        ],
      },
      {
        name: 'stacked',
        title: 'Stacked',
        description: '계열이 둘 이상일 때 쌓아 보일지 정한다.',
        display: 'row',
        options: [
          { value: 'off', note: '기본. 계열이 나란히 놓인다' },
          { value: 'on', note: '계열이 쌓여 합계를 보인다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'bars-for-long-labels',
        title: '이름이 길면 가로 막대를 쓴다',
        body: '세로 막대는 카테고리 이름이 길면 서로 겹치거나 잘린다. 이름이 길거나 항목 수가 적어 순위 비교가 목적이면 orientation을 bars로 바꾼다.',
        do: ['이름이 긴 카테고리는 가로 막대로 바꾼다'],
        dont: ['긴 이름을 세로 막대에 억지로 구겨 넣지 않는다'],
      },
    ],
    usage: [
      { id: 'monthly-visitors', title: '월별 방문자', note: '단일 계열로 시간에 따른 값을 비교한다' },
      { id: 'platform-stacked', title: '플랫폼별 방문자', note: '두 계열을 stacked로 쌓아 합계와 구성비를 함께 보인다' },
    ],
    cases: [
      { id: 'ranking-bars', title: '순위 비교', note: '항목 이름이 길 때 가로 막대로 바꾼다' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-bar",
  "type": "registry:ui",
  "title": "Chart Bar",
  "dependencies": ["recharts", "lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-bar.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔세 개"→"마흔네 개"로, `registryDependencies`에 `chart-bar.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "43개 전부"→"44개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartBarPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartBar } from '@/components/ui/chart-bar'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const MONTHLY_DATA = [
  { month: '1월', visitors: 186 },
  { month: '2월', visitors: 305 },
  { month: '3월', visitors: 237 },
  { month: '4월', visitors: 73 },
  { month: '5월', visitors: 209 },
  { month: '6월', visitors: 214 },
]
const MONTHLY_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

const PLATFORM_DATA = [
  { month: '1월', desktop: 186, mobile: 80 },
  { month: '2월', desktop: 305, mobile: 200 },
  { month: '3월', desktop: 237, mobile: 120 },
  { month: '4월', desktop: 73, mobile: 190 },
  { month: '5월', desktop: 209, mobile: 130 },
  { month: '6월', desktop: 214, mobile: 140 },
]
const PLATFORM_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}

const RANKING_DATA = [
  { source: '검색', visitors: 4820 },
  { source: '다이렉트', visitors: 3210 },
  { source: '소셜 미디어', visitors: 2150 },
  { source: '추천 링크', visitors: 1340 },
]
const RANKING_CONFIG: ChartConfig = { visitors: { label: '방문자', color: 'var(--chart-1)' } }

function render(options: { orientation?: string; stacked?: string }) {
  return (
    <ChartBar
      title="플랫폼별 방문자"
      description="1월 - 6월"
      data={PLATFORM_DATA}
      config={PLATFORM_CONFIG}
      categoryKey="month"
      orientation={options.orientation === 'bars' ? 'bars' : 'columns'}
      stacked={options.stacked === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'monthly-visitors':
      return <ChartBar title="월별 방문자" description="1월 - 6월" data={MONTHLY_DATA} config={MONTHLY_CONFIG} categoryKey="month" />
    case 'platform-stacked':
      return (
        <ChartBar title="플랫폼별 방문자" description="1월 - 6월" data={PLATFORM_DATA} config={PLATFORM_CONFIG} categoryKey="month" stacked />
      )
    case 'ranking-bars':
      return (
        <ChartBar title="유입경로별 순위" description="이번 달" data={RANKING_DATA} config={RANKING_CONFIG} categoryKey="source" orientation="bars" />
      )
    default:
      return null
  }
}

export function ChartBarPage() {
  const meta = getComponent('chart-bar')
  if (!meta) return <Placeholder title="Chart Bar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartBar title="월별 방문자" description="1월 - 6월" data={MONTHLY_DATA} config={MONTHLY_CONFIG} categoryKey="month" />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartBarPage } from '@/routes/components/ChartBarPage'` 추가, `children` 배열 끝에 `{ path: 'chart-bar', element: <ChartBarPage /> }` 추가.

`src/components/layout/nav-config.ts`의 `Chart` 묶음, `Chart Area` 다음에:

```ts
{ to: '/components/chart-bar', label: 'Chart Bar', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-bar`에서 `orientation`을 "bars"로 바꾸면 실제로 가로 막대가 되는지, `stacked`가 켜지는지, 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-bar.tsx src/routes/components/ChartBarPage.tsx src/data/registry.ts registry.json public/r/chart-bar.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-bar): 막대 차트를 Chart 카테고리에 짓는다

shadcn 공식 chart-bar-default·horizontal·stacked·label을 참고해
계열 하나로 통합한 Chart Bar를 짓는다."
```

---

### Task 4: Chart Line

**Files:**
- Create: `src/components/ui/chart-line.tsx`
- Create: `src/routes/components/ChartLinePage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-bar` 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 44→45)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("44개 전부"→"45개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartLine`, `ChartTrend`(독립 선언)

- [ ] **Step 1: `src/components/ui/chart-line.tsx`를 만든다**

```tsx
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
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-bar'` 다음에:

```ts
  {
    id: 'chart-line',
    name: 'Chart Line',
    aliases: ['선 차트', '꺾은선 그래프', '추세선', 'line chart'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '시간에 따라 값이 어떻게 늘고 주는지 보인다. 여러 계열을 겹쳐 비교할 때도 쓴다.',
    anatomy: [],
    properties: [
      {
        name: 'curveType',
        title: 'Curve type',
        description: '점 사이를 부드러운 곡선으로 이을지, 계단식으로 이을지 정한다.',
        display: 'row',
        options: [
          { value: 'monotone', note: '기본. 부드러운 곡선' },
          { value: 'step', note: '값이 유지되다 갑자기 바뀌는 데이터(재고·상태 등)' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'legend-for-multi-series',
        title: '계열이 둘 이상이면 범례가 자동으로 붙는다',
        body: '색만으로 계열을 구별하게 두지 않는다. 계열이 하나면 범례를 생략한다 — 구별할 게 없기 때문이다.',
        do: ['config에 시리즈를 둘 이상 넣으면 범례가 저절로 붙는다'],
        dont: ['계열이 하나뿐인데 범례를 억지로 붙이지 않는다'],
      },
    ],
    usage: [
      { id: 'signup-trend', title: '가입 추세', note: '단일 계열로 시간에 따른 변화를 보인다' },
      { id: 'plan-comparison', title: '유료·무료 비교', note: '두 계열을 겹쳐 시간에 따른 변화를 비교한다' },
    ],
    cases: [
      { id: 'with-dots', title: '포인트 표시', note: '데이터 포인트가 적어 각 지점을 눈에 띄게 해야 할 때' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-line",
  "type": "registry:ui",
  "title": "Chart Line",
  "dependencies": ["recharts", "lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-line.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔네 개"→"마흔다섯 개"로, `registryDependencies`에 `chart-line.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "44개 전부"→"45개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartLinePage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartLine } from '@/components/ui/chart-line'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const SIGNUP_DATA = [
  { date: '1월', signups: 186 },
  { date: '2월', signups: 305 },
  { date: '3월', signups: 237 },
  { date: '4월', signups: 273 },
  { date: '5월', signups: 209 },
  { date: '6월', signups: 314 },
]
const SIGNUP_CONFIG: ChartConfig = { signups: { label: '가입', color: 'var(--chart-1)' } }

const PLAN_DATA = [
  { date: '1월', paid: 42, free: 210 },
  { date: '2월', paid: 51, free: 225 },
  { date: '3월', paid: 47, free: 240 },
  { date: '4월', paid: 60, free: 262 },
  { date: '5월', paid: 55, free: 251 },
  { date: '6월', paid: 74, free: 301 },
]
const PLAN_CONFIG: ChartConfig = {
  paid: { label: '유료', color: 'var(--chart-1)' },
  free: { label: '무료', color: 'var(--chart-2)' },
}

function render(options: { curveType?: string }) {
  return (
    <ChartLine
      title="유료·무료 가입 추세"
      description="1월 - 6월"
      data={PLAN_DATA}
      config={PLAN_CONFIG}
      categoryKey="date"
      curveType={options.curveType === 'step' ? 'step' : 'monotone'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'signup-trend':
      return <ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" />
    case 'plan-comparison':
      return <ChartLine title="유료·무료 가입 추세" description="1월 - 6월" data={PLAN_DATA} config={PLAN_CONFIG} categoryKey="date" />
    case 'with-dots':
      return <ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" showDots />
    default:
      return null
  }
}

export function ChartLinePage() {
  const meta = getComponent('chart-line')
  if (!meta) return <Placeholder title="Chart Line 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartLine title="가입 추세" description="1월 - 6월" data={SIGNUP_DATA} config={SIGNUP_CONFIG} categoryKey="date" />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartLinePage } from '@/routes/components/ChartLinePage'` 추가, `children` 배열 끝에 `{ path: 'chart-line', element: <ChartLinePage /> }` 추가.

`src/components/layout/nav-config.ts`의 `Chart` 묶음, `Chart Bar` 다음에:

```ts
{ to: '/components/chart-line', label: 'Chart Line', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-line`에서 `curveType`을 "step"으로 바꾸면 계단식으로 그려지는지, 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-line.tsx src/routes/components/ChartLinePage.tsx src/data/registry.ts registry.json public/r/chart-line.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-line): 선 차트를 Chart 카테고리에 짓는다

shadcn 공식 chart-line-default·multiple·step·dots를 참고해 계열
하나로 통합한 Chart Line을 짓는다."
```

---

### Task 5: Chart Pie

**Files:**
- Create: `src/components/ui/chart-pie.tsx`
- Create: `src/routes/components/ChartPiePage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-line` 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 45→46)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("45개 전부"→"46개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartPie`, `ChartPieDatum` — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-pie.tsx`를 만든다**

```tsx
import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * shadcn 공식 chart-pie-simple·chart-pie-donut·chart-pie-legend를 옮긴
 * 계열 컴포넌트. data의 각 행은 categoryKey(이름)·valueKey(값)와, 조각별
 * 색을 가리키는 fill(예: 'var(--color-chrome)')을 함께 가져야 한다 —
 * config의 각 키에 짝지어 둔 색을 그대로 쓰기 위해서다(shadcn 원본과
 * 같은 방식).
 */
export interface ChartPieDatum {
  [key: string]: string | number
  fill: string
}

export function ChartPie({
  title,
  description,
  data,
  config,
  categoryKey,
  valueKey,
  variant = 'pie',
  showLegend = false,
}: {
  title: string
  description: string
  data: ChartPieDatum[]
  config: ChartConfig
  categoryKey: string
  valueKey: string
  variant?: 'pie' | 'donut'
  showLegend?: boolean
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-64">
          <PieChart>
            {!showLegend && <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey={categoryKey} />} />}
            <Pie data={data} dataKey={valueKey} nameKey={categoryKey} innerRadius={variant === 'donut' ? 60 : 0} />
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent nameKey={categoryKey} />}
                className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-line'` 다음에:

```ts
  {
    id: 'chart-pie',
    name: 'Chart Pie',
    aliases: ['파이 차트', '원형 차트', '도넛 차트', 'pie chart', 'donut chart'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '전체에서 각 항목이 차지하는 비율을 보인다. 항목이 4~6개 안팎일 때 가장 잘 읽힌다.',
    anatomy: [],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '가운데를 비울지(도넛) 채울지(파이) 정한다.',
        display: 'row',
        options: [
          { value: 'pie', note: '기본' },
          { value: 'donut', note: '가운데가 비어 다른 정보를 겹쳐 보일 여지가 생긴다' },
        ],
      },
      {
        name: 'showLegend',
        title: 'Show legend',
        description: '조각 옆에 범례를 보일지 정한다. 범례를 켜면 툴팁은 대신 생략된다.',
        display: 'row',
        options: [
          { value: 'off', note: '기본. 조각에 마우스를 올리면 툴팁으로 이름·값을 본다' },
          { value: 'on', note: '정적인 화면(인쇄·캡처)에도 이름이 항상 보여야 할 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'angle-alone-not-enough',
        title: '조각 각도만으로 비교하게 두지 않는다',
        body: '사람 눈은 각도 차이를 정확히 못 읽는다. 항상 범례나 툴팁으로 실제 값·비율을 함께 보인다.',
        do: ['범례나 툴팁으로 값과 비율을 함께 보인다'],
        dont: ['조각만 그려 두고 값을 어디서도 안 보이지 않는다'],
      },
    ],
    usage: [
      { id: 'browser-share', title: '브라우저 점유율', note: '도넛 + 범례로 항목별 비율을 보인다' },
    ],
    cases: [
      { id: 'plain-pie', title: '가운데를 채운 파이', note: '도넛의 빈 가운데가 필요 없을 때' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-pie",
  "type": "registry:ui",
  "title": "Chart Pie",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-pie.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔다섯 개"→"마흔여섯 개"로, `registryDependencies`에 `chart-pie.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "45개 전부"→"46개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartPiePage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartPie, type ChartPieDatum } from '@/components/ui/chart-pie'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const BROWSER_CONFIG: ChartConfig = {
  visitors: { label: '방문자' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: '기타', color: 'var(--chart-5)' },
}
const BROWSER_DATA: ChartPieDatum[] = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
]

function render(options: { variant?: string; showLegend?: string }) {
  return (
    <ChartPie
      title="브라우저 점유율"
      description="1월 - 6월"
      data={BROWSER_DATA}
      config={BROWSER_CONFIG}
      categoryKey="browser"
      valueKey="visitors"
      variant={options.variant === 'donut' ? 'donut' : 'pie'}
      showLegend={options.showLegend === 'on'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'browser-share':
      return (
        <ChartPie
          title="브라우저 점유율"
          description="1월 - 6월"
          data={BROWSER_DATA}
          config={BROWSER_CONFIG}
          categoryKey="browser"
          valueKey="visitors"
          variant="donut"
          showLegend
        />
      )
    case 'plain-pie':
      return (
        <ChartPie title="브라우저 점유율" description="1월 - 6월" data={BROWSER_DATA} config={BROWSER_CONFIG} categoryKey="browser" valueKey="visitors" />
      )
    default:
      return null
  }
}

export function ChartPiePage() {
  const meta = getComponent('chart-pie')
  if (!meta) return <Placeholder title="Chart Pie 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={
        <ChartPie title="브라우저 점유율" description="1월 - 6월" data={BROWSER_DATA} config={BROWSER_CONFIG} categoryKey="browser" valueKey="visitors" variant="donut" />
      }
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartPiePage } from '@/routes/components/ChartPiePage'` 추가, `children` 배열 끝에 `{ path: 'chart-pie', element: <ChartPiePage /> }` 추가.

`src/components/layout/nav-config.ts`의 `Chart` 묶음, `Chart Line` 다음에:

```ts
{ to: '/components/chart-pie', label: 'Chart Pie', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-pie`에서 `variant`를 "donut"으로 바꾸면 가운데가 비는지, `showLegend`를 켜면 툴팁 대신 범례가 보이는지, 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-pie.tsx src/routes/components/ChartPiePage.tsx src/data/registry.ts registry.json public/r/chart-pie.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-pie): 파이·도넛 차트를 Chart 카테고리에 짓는다

shadcn 공식 chart-pie-simple·donut·legend를 참고해 계열 하나로
통합한 Chart Pie를 짓는다."
```

---

### Task 6: Chart Radar

**Files:**
- Create: `src/components/ui/chart-radar.tsx`
- Create: `src/routes/components/ChartRadarPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-pie` 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 46→47)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("46개 전부"→"47개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartRadar`, `ChartTrend`(독립 선언)

- [ ] **Step 1: `src/components/ui/chart-radar.tsx`를 만든다**

```tsx
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
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-pie'` 다음에:

```ts
  {
    id: 'chart-radar',
    name: 'Chart Radar',
    aliases: ['레이더 차트', '방사형 차트', 'radar chart'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '여러 축에 걸친 값을 한 도형으로 보인다. 역량·평가 항목처럼 서로 다른 기준을 한눈에 비교할 때 쓴다.',
    anatomy: [],
    properties: [
      {
        name: 'gridType',
        title: 'Grid type',
        description: '배경 격자를 다각형으로 그릴지 원으로 그릴지 정한다.',
        display: 'row',
        options: [
          { value: 'polygon', note: '기본. 축 개수만큼 각진 격자' },
          { value: 'circle', note: '동심원 격자 — 값의 크기 비교가 더 직관적일 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'axis-count',
        title: '축은 3~8개 사이가 읽기 좋다',
        body: '축이 너무 적으면 도형의 뜻이 안 살고, 너무 많으면 라벨이 겹친다.',
        do: ['비교할 기준을 3~8개로 추린다'],
        dont: ['축을 열 개 넘게 욱여넣지 않는다'],
      },
    ],
    usage: [
      { id: 'skill-profile', title: '역량 비교', note: '단일 계열로 여러 항목의 점수를 한 도형으로 보인다' },
      { id: 'team-comparison', title: '두 팀 비교', note: '두 계열을 겹쳐 같은 기준으로 비교한다' },
    ],
    cases: [],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-radar",
  "type": "registry:ui",
  "title": "Chart Radar",
  "dependencies": ["recharts", "lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-radar.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔여섯 개"→"마흔일곱 개"로, `registryDependencies`에 `chart-radar.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "46개 전부"→"47개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartRadarPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartRadar } from '@/components/ui/chart-radar'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const SKILL_DATA = [
  { skill: '소통', score: 186 },
  { skill: '실행력', score: 305 },
  { skill: '문제해결', score: 237 },
  { skill: '협업', score: 273 },
  { skill: '기획', score: 209 },
]
const SKILL_CONFIG: ChartConfig = { score: { label: '점수', color: 'var(--chart-1)' } }

const TEAM_DATA = [
  { skill: '소통', a: 186, b: 160 },
  { skill: '실행력', a: 305, b: 220 },
  { skill: '문제해결', a: 237, b: 250 },
  { skill: '협업', a: 273, b: 210 },
  { skill: '기획', a: 209, b: 190 },
]
const TEAM_CONFIG: ChartConfig = {
  a: { label: 'A팀', color: 'var(--chart-1)' },
  b: { label: 'B팀', color: 'var(--chart-2)' },
}

function render(options: { gridType?: string }) {
  return (
    <ChartRadar
      title="역량 비교"
      description="분기 평가"
      data={SKILL_DATA}
      config={SKILL_CONFIG}
      categoryKey="skill"
      gridType={options.gridType === 'circle' ? 'circle' : 'polygon'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'skill-profile':
      return <ChartRadar title="역량 비교" description="분기 평가" data={SKILL_DATA} config={SKILL_CONFIG} categoryKey="skill" />
    case 'team-comparison':
      return <ChartRadar title="팀별 역량 비교" description="분기 평가" data={TEAM_DATA} config={TEAM_CONFIG} categoryKey="skill" showLegend />
    default:
      return null
  }
}

export function ChartRadarPage() {
  const meta = getComponent('chart-radar')
  if (!meta) return <Placeholder title="Chart Radar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartRadar title="역량 비교" description="분기 평가" data={SKILL_DATA} config={SKILL_CONFIG} categoryKey="skill" />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartRadarPage } from '@/routes/components/ChartRadarPage'` 추가, `children` 배열 끝에 `{ path: 'chart-radar', element: <ChartRadarPage /> }` 추가.

`src/components/layout/nav-config.ts`의 `Chart` 묶음, `Chart Pie` 다음에:

```ts
{ to: '/components/chart-radar', label: 'Chart Radar', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-radar`에서 `gridType`을 "circle"로 바꾸면 배경 격자가 동심원으로 바뀌는지, 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-radar.tsx src/routes/components/ChartRadarPage.tsx src/data/registry.ts registry.json public/r/chart-radar.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-radar): 레이더 차트를 Chart 카테고리에 짓는다

shadcn 공식 chart-radar-default·multiple·legend·grid-circle-fill을
참고해 계열 하나로 통합한 Chart Radar를 짓는다."
```

---

### Task 7: Chart Radial

**Files:**
- Create: `src/components/ui/chart-radial.tsx`
- Create: `src/routes/components/ChartRadialPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-radar` 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 47→48)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("47개 전부"→"48개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartConfig`
- Produces: `ChartRadial`, `ChartTrend`(독립 선언) — 마지막 Task, 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-radial.tsx`를 만든다**

```tsx
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
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
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-radar'` 다음에:

```ts
  {
    id: 'chart-radial',
    name: 'Chart Radial',
    aliases: ['방사형 막대', '원형 진행률', 'radial chart', 'radial bar'],
    category: 'chart',
    status: 'stable',
    addedIn: 'v0.18.0',
    changedIn: 'v0.18.0',
    purpose: '목표 대비 달성률이나 여러 항목의 합을 둥근 막대로 보인다.',
    anatomy: [],
    properties: [
      {
        name: 'showLabel',
        title: 'Show label',
        description: '가운데에 합계 숫자를 보일지 정한다.',
        display: 'row',
        options: [
          { value: 'off', note: '기본' },
          { value: 'on', note: '단일 계열일 때 가운데에 총합을 숫자로 보인다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'two-data-shapes',
        title: '단일 계열과 다계열은 데이터 모양이 다르다',
        body: '계열이 하나면 항목마다 다른 색(fill)을 데이터에 직접 적어 하나의 링에 나눠 그린다. 계열이 둘 이상이면 config의 각 시리즈가 겹겹이 쌓인 링이 된다 — 서로 다른 데이터 모양이니 섞어 쓰지 않는다.',
        do: [],
        dont: ['단일 계열용 데이터에 시리즈를 여러 개 얹어 다계열처럼 쓰지 않는다'],
      },
    ],
    usage: [
      { id: 'goal-progress', title: '목표 달성률', note: '단일 계열 + 가운데 라벨로 진행률을 보인다' },
    ],
    cases: [
      { id: 'stacked-total', title: '항목별 합계', note: '여러 항목이 쌓여 전체 합을 보인다' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-radial",
  "type": "registry:ui",
  "title": "Chart Radial",
  "dependencies": ["recharts", "lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/card.json",
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-radial.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔일곱 개"→"마흔여덟 개"로, `registryDependencies`에 `chart-radial.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "47개 전부"→"48개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartRadialPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartRadial } from '@/components/ui/chart-radial'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import type { ChartConfig } from '@/components/ui/chart'

const GOAL_CONFIG: ChartConfig = { progress: { label: '달성률' } }
const GOAL_DATA = [{ goal: '이번 분기', progress: 74, fill: 'var(--chart-1)' }]

const TOTAL_CONFIG: ChartConfig = {
  desktop: { label: '데스크톱', color: 'var(--chart-1)' },
  mobile: { label: '모바일', color: 'var(--chart-2)' },
}
const TOTAL_DATA = [{ month: '1월', desktop: 1260, mobile: 570 }]

function render(options: { showLabel?: string }) {
  return (
    <ChartRadial
      title="목표 달성률"
      description="이번 분기"
      data={GOAL_DATA}
      config={GOAL_CONFIG}
      categoryKey="goal"
      valueKey="progress"
      showLabel={options.showLabel === 'on'}
      totalLabel="퍼센트"
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'goal-progress':
      return (
        <ChartRadial
          title="목표 달성률"
          description="이번 분기"
          data={GOAL_DATA}
          config={GOAL_CONFIG}
          categoryKey="goal"
          valueKey="progress"
          showLabel
          totalLabel="퍼센트"
        />
      )
    case 'stacked-total':
      return (
        <ChartRadial
          title="플랫폼별 방문자"
          description="1월"
          data={TOTAL_DATA}
          config={TOTAL_CONFIG}
          categoryKey="month"
        />
      )
    default:
      return null
  }
}

export function ChartRadialPage() {
  const meta = getComponent('chart-radial')
  if (!meta) return <Placeholder title="Chart Radial 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={
        <ChartRadial title="목표 달성률" description="이번 분기" data={GOAL_DATA} config={GOAL_CONFIG} categoryKey="goal" valueKey="progress" showLabel totalLabel="퍼센트" />
      }
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartRadialPage } from '@/routes/components/ChartRadialPage'` 추가, `children` 배열 끝에 `{ path: 'chart-radial', element: <ChartRadialPage /> }` 추가.

`src/components/layout/nav-config.ts`의 `Chart` 묶음, `Chart Radar` 다음(묶음의 마지막)에:

```ts
{ to: '/components/chart-radial', label: 'Chart Radial', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-radial`에서 `showLabel`을 켜면 가운데 숫자가 보이는지, `stacked-total` 케이스가 두 링으로 겹쳐 그려지는지, 다크 모드 확인. LNB의 Chart 묶음이 Area·Bar·Line·Pie·Radar·Radial 여섯 개로 이름순인지 최종 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-radial.tsx src/routes/components/ChartRadialPage.tsx src/data/registry.ts registry.json public/r/chart-radial.json public/r/adminds.json public/r/registry.json public/llms.txt src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-radial): 방사형 차트를 Chart 카테고리에 짓는다

shadcn 공식 chart-radial-simple·label·stacked를 참고해 짓는다.
단일 계열과 다계열이 서로 다른 데이터 모양을 쓴다는 점을 그대로
유지한다."
```

**Step 11: 전체 확인**

`grep -c "^    id: '" src/data/registry.ts`가 48을 찍는지, LNB의 Components 섹션에 Actions·Inputs·Navigation·Data Display·Chart·Feedback 여섯 묶음이 순서대로 보이는지, `npm run build`가 클린한지 최종 확인한다.

---

## 자체 검토 기록

**스펙 커버리지 확인:**
- shadcn 68개 실측표 — 배경 절에 인용
- 원칙(구조는 shadcn, 값은 토큰) — Global Constraints의 변환표 + 각 Task의 코드에 이미 반영
- 계열당 1개 + Properties 축 — Task 2~7 각각의 `properties` 배열
- 새 카테고리 `chart` — Task 2 Step 2
- Card로 감싼 완성형 블록 — 6개 컴포넌트 전부 동일 구조
- Tooltip 9종 흡수 — 각 컴포넌트가 `ChartTooltipContent`의 `indicator`/`hideLabel`을 상황에 맞게 이미 씀(별도 컴포넌트 없음)

**타입 일관성:** `ChartConfig`(Task 1이 export)를 Task 2~7 전부 같은 이름으로 import. 각 컴포넌트의 `ChartTrend`는 의도적으로 파일마다 독립 선언(서로 import하지 않는 독립 컴포넌트 설계, Chart Area가 먼저 export해도 다른 파일이 거기서 가져다 쓰지 않는다 — 이 저장소의 "컴포넌트는 알맹이 하나, 서로 강하게 얽지 않는다" 관례와 같다). `categoryKey`/`valueKey` 파라미터 이름을 6개 컴포넌트 전부 동일하게 사용.

**플레이스홀더 스캔:** `<오늘 날짜>`는 v0.16.0 계획과 같은 성격의 의도적 미확정(구현 시점 시스템 날짜 확인 필수).

**모호성 점검:** Chart Radial의 "단일 계열 vs 다계열이 서로 다른 데이터 모양"은 shadcn 원본 자체가 그렇게 짜여 있어(chart-radial-simple은 data 한 행에 여러 카테고리, chart-radial-stacked는 data 한 행에 여러 시리즈 키) 억지로 통일하지 않고 그대로 반영했다 — Guidelines에 명시. `orientation`(Bar)과 recharts 자체의 `layout` prop 이름이 반대로 헷갈리는 문제(`layout="vertical"`이 실은 가로 막대)는 컴포넌트 내부에서만 recharts 이름을 쓰고 바깥에 노출하는 prop 이름은 `columns`/`bars`로 새로 지어 피했다.
