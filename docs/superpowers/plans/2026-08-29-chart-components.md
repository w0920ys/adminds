# Chart 컴포넌트 6종 이식 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `adminds-starter`(`momeokji-admin`에서 실전 검증된 소스)의 차트 스캐폴드 + 5종(Line·BarHorizontal·BarVertical·Funnel·Donut)을 adminds 레지스트리 관례에 맞춰 이식한다.

**Architecture:** 코드는 원본을 그대로 옮긴다(재설계 아님). `chart.tsx`는 `registry:lib`(문서 페이지 없음, `src/lib/utils.ts`와 같은 성격)로, 5개 차트는 각각 `registry:ui` + `registry.ts` 항목 + 독립 문서 페이지로 등록한다. `recharts`가 새 런타임 의존성이다.

**Tech Stack:** React 19 + TypeScript, `recharts` ^3.10, Tailwind v4(CSS 변수로 색 주입), Vitest(순수 함수만).

## Global Constraints

- 원본 소스: `/Users/yoon/Desktop/데스크탑/바이브코딩/adminds-starter/src/components/ui/chart*.tsx`, `/Users/yoon/Desktop/데스크탑/바이브코딩/adminds-starter/src/styles/chart-tokens.css`, `/Users/yoon/Desktop/데스크탑/바이브코딩/adminds-starter/src/lib/format.ts` — 이미 검증된 코드이므로 로직을 바꾸지 않는다. 세 가지 실패 모드(ChartLine의 `xKey` 기본값 `'date'`, ChartFunnel의 `content` 렌더 함수, ChartDonut의 범례 2줄 구조)를 그대로 보존한다.
- `chart.tsx`는 `registry:lib`, 5개 차트는 `registry:ui`. `registry:ui` 항목만 `registry.ts`의 `ComponentMeta`와 짝을 맞춰야 한다(`registry-parity.test.ts`).
- `registry.ts`에 항목을 추가하는 Task는 반드시 같은 Task 안에서 `registry.json` 항목 추가와 `npm run registry` 재굽기까지 마친다 — `registry-parity.test.ts`가 `adminds` 번들의 개수·설명·`registryDependencies`를 컴포넌트 하나가 늘 때마다 즉시 대조한다(이 프로젝트가 v0.16.0에서 이미 겪은 제약).
- `public/r/*.json`을 손으로 고치지 않는다. `npm run registry`를 돌린다.
- 컴포넌트 파일은 기존 관례를 따른다 — `data-slot` 속성(원본에 있는 것만 유지), `cn()` 유틸, `forwardRef` 안 씀, `React.ComponentProps<typeof X>`로 타입을 뽑는다(단, 이번 컴포넌트들은 Radix 원시가 아니라 `recharts`를 감싸므로 이 규칙이 100% 그대로 적용되지 않는 지점이 있다 — 원본 코드의 실제 타입 선언을 따른다).
- 임의 값 대괄호 표기 금지. 단, 원본이 `var(--chart-1)`처럼 CSS 변수를 `style`/`fill`/`stroke` prop에 문자열로 넘기는 것은 Tailwind 클래스가 아니므로 이 규칙 대상이 아니다.
- **원본의 `text-xs`/`text-sm`/`text-2xs`는 이 저장소의 숫자 스케일로 바꿔 썼다** — 이 저장소는 Tailwind 기본 이름 스케일을 어디서도 쓰지 않고 `text-11`~`text-48` 픽셀 이름 스케일만 쓴다(전 컴포넌트에서 검색해 확인함). 값으로 맞춰 옮겼다: `text-xs`(0.75rem)→`text-12`, `text-sm`(0.875rem)→`text-14`.
- **이번 회차는 `text-12`가 최소 크기다. `text-11`은 정말 피할 수 없는 예외에서만 쓴다(사용자 지시 — 11px은 너무 작아서 잘 안 보인다).** 원본의 `text-2xs`(어차피 adminds-starter에도 정의돼 있지 않은 클래스 — 검색해 확인함, 원본에서도 사실상 아무 크기도 안 먹었을 가능성이 있다)는 `text-11`이 아니라 `text-12`로 옮겼다 — 아래 각 Task의 코드에는 이미 이 변환이 반영돼 있다. 이번 6개 컴포넌트 어디에도 `text-11`을 쓰지 않는다.
- 언어 규칙 — 구조를 가리키는 이름은 영문, 설명은 한국어.
- 화면에 나오는 숫자를 손으로 적지 않는다 — `README.md`·`registry.json`의 `adminds` 번들 설명 속 개수는 `components.length` 실측과 맞아야 한다.
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사, **em-dash 쓰지 않는다**(v0.16.0 최종 리뷰가 실제로 잡아낸 위반 — 커밋 메시지 예시 문구를 쓸 때 특히 주의).
- Vitest는 `node` 환경, jsdom 없음 — 컴포넌트 렌더링 테스트는 쓰지 않는다(기존 42개 컴포넌트 전부 그렇다). `src/lib/format.ts`의 순수 함수만 일반 유닛 테스트로 검증한다. 시각적 검증은 `npm run build` 통과 + 개발 서버에서 실제 렌더링(라이트/다크, 좁은 화면)으로 한다.
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- `data-display` 카테고리 안, `Card`와 `Collapsible` 사이에 알파벳 순으로 삽입: **Chart Bar Horizontal → Chart Bar Vertical → Chart Donut → Chart Funnel → Chart Line**. Task 2~6이 이 순서로 하나씩 그 자리에 끼워 넣는다(뒤 Task가 앞 Task가 넣은 항목 다음에 이어 붙인다).
- `adminds` 번들 top-level `registryDependencies`에는 `chart.json`/`format.json`을 따로 나열하지 않는다 — 5개 차트가 각자 `chart.json`을(2개는 `format.json`도) 자기 `registryDependencies`에 걸어 두므로 `adminds.json`을 설치할 때 전이 의존성으로 자동으로 딸려 온다(`tokens.json`/`utils.json`이 지금도 top-level에 안 걸려 있는 것과 같은 이유 — 이미 확인함).

---

### Task 1: 토큰 · recharts 의존성 · chart.tsx 스캐폴드 · format.ts

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `package.json`(recharts 의존성 추가, `npm install`)
- Create: `src/components/ui/chart.tsx`
- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`
- Modify: `registry.json`(chart.json·format.json 두 `registry:lib` 항목 추가)

**Interfaces:**
- Consumes: 없음(첫 Task)
- Produces: `ChartConfig`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `useChart`(모두 `src/components/ui/chart.tsx`에서 export) — Task 2~6이 그대로 import한다. `formatNumber(n: number): string`, `formatPercent(n: number, digits?: number): string`(`src/lib/format.ts`에서 export) — Task 5(Funnel)가 `formatPercent`, Task 4(Donut)가 `formatNumber`를 쓴다.

- [ ] **Step 1: `recharts`를 설치한다**

Run: `npm install recharts@^3.10`

이 명령이 `package.json`의 `dependencies`에 `"recharts": "^3.10.x"`(실제 설치된 버전)를 추가한다 — 버전 번호를 손으로 적지 않는다.

- [ ] **Step 2: `src/styles/tokens.css`에 차트 토큰을 추가한다**

`:root` 블록의 `--annotation-muted` 줄(93번째 줄 근방, `}` 바로 앞) 앞에 아래를 끼워 넣는다:

```css
  /*
   * 범주형(categorical) 시리즈 색 6개. dataviz 스킬의 validate_palette.js로
   * 라이트/다크 각각 전 항목(명도대·채도하한·CVD 분리·정상시각 하한·대비)
   * 통과를 확인한 값이다(adminds-starter의 momeokji-admin 대시보드에서
   * 검증). 상태색(info/success/warning/destructive)은 상태 표현에 예약돼
   * 있어 시리즈 색으로 재사용하지 않는다 — 그래서 별도 6색을 둔다. 순서는
   * 고정이고 절대 순환하지 않는다(9번째 시리즈부터는 호출부가 "기타"로
   * 접는다). 1 indigo(주 계열) 2 teal 3 orange(브랜드계) 4 pink 5 lime
   * 6 violet.
   */
  --chart-1: #4f46e5;
  --chart-2: #0d9488;
  --chart-3: #ea580c;
  --chart-4: #db2777;
  --chart-5: #65a30d;
  --chart-6: #7c3aed;
  --chart-grid: var(--border);
  --chart-axis: var(--muted-foreground);
```

`.dark` 블록의 `--annotation-muted` 줄(144번째 줄 근방, `}` 바로 앞)에 끼워 넣는다:

```css
  --chart-1: #6366f1;
  --chart-2: #0d9488;
  --chart-3: #ea580c;
  --chart-4: #db2777;
  --chart-5: #65a30d;
  --chart-6: #8b5cf6;
```

(다크에서 `--chart-grid`/`--chart-axis`는 각각 `var(--border)`/`var(--muted-foreground)`를 그대로 참조하므로 `.dark`에서 값이 자동으로 바뀐다 — 따로 적지 않는다.)

기존 `@theme inline { ... }` 블록이 끝나는 `}`(275번째 줄 근방, `@layer base {` 바로 앞) 뒤에 **별도의** `@theme inline` 블록을 새로 추가한다:

```css

/*
 * 위 --chart-N을 별도의 @theme inline 블록에 둔다 — 기존 블록에 합치지
 * 않는다. Tailwind v4는 @theme inline 토큰을, 그 이름으로 된 유틸리티
 * 클래스(예: bg-chart-2)를 코드 어딘가에서 실제로 써야만 최종 CSS로
 * 방출한다. 아래 차트 컴포넌트들은 색을 recharts SVG에 var(--chart-N)로
 * 직접 물리고 bg-chart-N 같은 유틸리티 클래스로는 쓰지 않으므로, 합쳤을
 * 경우 안 쓰인 --color-chart-2~5가 트리셰이킹으로 통째로 빠지고 1·6만
 * 우연히 다른 경로로 살아남아 시리즈 절반이 무색으로 렌더되는 사고를
 * momeokji-admin에서 이미 겪었다(원본 chart-tokens.css 주석 참고). 이
 * 블록은 나중에 누군가 bg-chart-N 유틸리티를 직접 쓰고 싶을 때를 위한
 * 자리만 남겨 둔다 — 지금 코드 경로는 위 원시 --chart-N을 직접 참조한다.
 */
@theme inline {
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-chart-6: var(--chart-6);
}
```

- [ ] **Step 3: `src/components/ui/chart.tsx`를 만든다**

```tsx
import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

/*
 * 차트 5종(chart-line·chart-bar-*·chart-funnel·chart-donut)이 공유하는 기반.
 * shadcn/ui의 chart 레지스트리 컴포넌트와 같은 골격이다 — ChartContainer가
 * 정한 config(어떤 데이터 키가 어떤 라벨·색을 갖는지)를 ChartTooltipContent·
 * ChartLegendContent가 그대로 읽는다. 색은 여기서 문자열로 박지 않고 CSS
 * 변수로 주입한다 — 그래야 다크모드 전환이 각 차트가 아니라 이 컴포넌트
 * 하나에서 해결된다.
 *
 * 기본 색은 각 chart-*.tsx가 var(--chart-1)~var(--chart-6)(tokens.css,
 * dataviz 스킬로 검증된 범주형 6색)를 고정 순서로 채워 config를 만든다 —
 * 그래서 소비자는 보통 color를 직접 지정할 일이 없다.
 */

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<'light' | 'dark', string> })
}

type ChartContextProps = { config: ChartConfig }
const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('Chart 하위 컴포넌트는 ChartContainer 안에서만 쓸 수 있다')
  return ctx
}

/*
 * config의 색을 실제 CSS로 내보낸다. 인라인 style이 아니라 <style> 태그로
 * 넣는 이유: recharts 내부 SVG 요소(Line·Bar·Cell 등)가 style prop 없이도
 * var(--color-${key})를 그대로 참조할 수 있게 하기 위해서다 — 그래야
 * chart-*.tsx 쪽 코드가 "이 시리즈는 --color-pwa다" 정도만 알면 되고,
 * light/dark 갈라치기를 신경 쓰지 않는다.
 */
function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.color || cfg.theme)
  if (!colorConfig.length) return null

  const css = (mode: 'light' | 'dark') =>
    colorConfig
      .map(([key, cfg]) => {
        const color = cfg.theme?.[mode] ?? cfg.color
        return color ? `  --color-${key}: ${color};` : null
      })
      .filter(Boolean)
      .join('\n')

  return (
    <style>
      {`[data-chart="${id}"] {\n${css('light')}\n}\n.dark [data-chart="${id}"] {\n${css('dark')}\n}`}
    </style>
  )
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-auto justify-center text-12 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

/*
 * popover 토큰으로 그린 말풍선. indicator="dot"|"line"은 시리즈 색을 점으로
 * 보여줄지, 라인차트처럼 선분으로 보여줄지를 고른다 — Badge가 클릭 불가
 * 표시라 hover가 없듯, 이 말풍선도 순수 정보 표시라 상호작용을 갖지 않는다.
 */
function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'dot',
  hideLabel = false,
  className,
  valueFormatter = (v: number) => String(v),
}: {
  active?: boolean
  payload?: Array<{
    dataKey?: string
    name?: string
    value?: number | string
    color?: string
    payload?: Record<string, unknown>
  }>
  label?: React.ReactNode
  indicator?: 'dot' | 'line'
  hideLabel?: boolean
  className?: string
  valueFormatter?: (value: number) => string
}) {
  const { config } = useChart()
  if (!active || !payload?.length) return null

  return (
    <div
      className={cn(
        'bg-popover text-popover-foreground z-popover min-w-36 rounded-md border px-3 py-2 text-12 shadow-md',
        className,
      )}
    >
      {!hideLabel && label != null && <div className="text-muted-foreground mb-1 font-medium">{label}</div>}
      <ul className="flex flex-col gap-1">
        {payload.map((item, i) => {
          const key = item.dataKey ?? item.name ?? String(i)
          const itemConfig = config[key as string]
          const displayLabel = itemConfig?.label ?? item.name ?? key
          const color = item.color
          return (
            <li key={i} className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn('shrink-0 rounded-[2px]', indicator === 'dot' ? 'size-2.5 rounded-full' : 'h-0.5 w-3')}
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{displayLabel}</span>
              <span className="text-foreground ml-auto font-semibold tabular-nums">
                {typeof item.value === 'number' ? valueFormatter(item.value) : item.value}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

/*
 * dataviz 원칙: 2개 이상 시리즈에는 항상 범례를 붙이고, 색만으로 식별하게
 * 두지 않는다. recharts Legend의 payload를 그대로 받아 config의 라벨로
 * 바꿔 그린다.
 */
function ChartLegendContent({
  payload,
  className,
}: {
  payload?: Array<{ value?: string; color?: string; dataKey?: string }>
  className?: string
}) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <ul className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5', className)}>
      {payload.map((item, i) => {
        const key = item.dataKey ?? item.value ?? String(i)
        const itemConfig = config[key as string]
        return (
          <li key={i} className="text-muted-foreground flex items-center gap-1.5 text-12">
            <span aria-hidden className="size-2.5 rounded-[3px]" style={{ backgroundColor: item.color }} />
            {itemConfig?.label ?? item.value}
          </li>
        )
      })}
    </ul>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, useChart }
```

- [ ] **Step 4: `src/lib/format.ts`를 만든다**

이번 회차 차트가 쓰는 두 함수만 이식한다(`formatCompact`·`formatDelta`는 StatCard·TrendBadge 회차에서 같은 파일에 추가 — 지금은 안 씀):

```ts
const nf = new Intl.NumberFormat('ko-KR')

export function formatNumber(n: number): string {
  return nf.format(Math.round(n))
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}
```

- [ ] **Step 5: `src/lib/format.test.ts`를 만들고 통과를 확인한다**

```ts
import { describe, expect, it } from 'vitest'
import { formatNumber, formatPercent } from './format'

describe('formatNumber', () => {
  it('천 단위 구분 쉼표를 넣는다', () => {
    expect(formatNumber(12400)).toBe('12,400')
  })

  it('소수를 반올림한다', () => {
    expect(formatNumber(12.6)).toBe('13')
  })

  it('0을 그대로 보인다', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('기본 소수 첫째 자리까지 보인다', () => {
    expect(formatPercent(39.44)).toBe('39.4%')
  })

  it('digits로 자릿수를 정한다', () => {
    expect(formatPercent(39.44, 0)).toBe('39%')
    expect(formatPercent(39.4444, 2)).toBe('39.44%')
  })
})
```

Run: `npx vitest run src/lib/format.test.ts`
Expected: 5개 테스트 전부 PASS.

- [ ] **Step 6: `registry.json`에 `chart`·`format` 두 `registry:lib` 항목을 추가한다**

`items` 배열 안, `name: "utils"` 항목 근방(알파벳 순 — `items`가 대체로 이름순인 기존 배치를 따라 적절한 자리를 찾아 넣는다)에 두 항목을 추가한다:

```json
{
  "name": "chart",
  "type": "registry:lib",
  "title": "Chart",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/utils.json"
  ],
  "files": [{ "path": "src/components/ui/chart.tsx", "type": "registry:lib" }]
},
{
  "name": "format",
  "type": "registry:lib",
  "title": "Format",
  "files": [{ "path": "src/lib/format.ts", "type": "registry:lib" }]
}
```

- [ ] **Step 7: registry를 굽고 검사한다**

Run: `npm run registry && npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 전부 통과. (`chart`·`format`은 `registry:ui`가 아니므로 이 시점에 `registry-parity.test.ts`가 `adminds` 번들 개수를 요구하지 않는다 — Task 2부터 요구된다.)

- [ ] **Step 8: 커밋한다**

```bash
git add package.json package-lock.json src/styles/tokens.css src/components/ui/chart.tsx src/lib/format.ts src/lib/format.test.ts registry.json public/r/chart.json public/r/format.json
git commit -m "feat(chart): 차트 스캐폴드와 포맷 유틸을 들여온다

recharts를 새 의존성으로 추가하고, momeokji-admin에서 검증된
ChartContainer/ChartTooltipContent/ChartLegendContent 골격을 그대로
옮긴다. tokens.css에 범주형 6색(--chart-1..6)을 별도 @theme inline
블록으로 추가한다 - 기존 블록에 합치면 안 쓰인 유틸리티 클래스 토큰이
트리셰이킹되어 시리즈 절반이 무색으로 렌더되는 사고를 momeokji-admin이
이미 겪었다."
```

---

### Task 2: ChartBarHorizontal

**Files:**
- Create: `src/components/ui/chart-bar-horizontal.tsx`
- Create: `src/routes/components/ChartBarHorizontalPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `card` 바로 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 42→43)
- Modify: `src/routes/routes.tsx`(라우트 추가)
- Modify: `src/components/layout/nav-config.ts`(Data Display 묶음에 링크 추가)
- Modify: `README.md`("42개 전부" → "43개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartConfig`(`@/components/ui/chart`)
- Produces: `ChartBarHorizontal`, `HBarDatum`(둘 다 `src/components/ui/chart-bar-horizontal.tsx`에서 export) — 다른 Task가 소비하지 않는다(5개 차트는 서로 독립).

- [ ] **Step 1: `src/components/ui/chart-bar-horizontal.tsx`를 만든다**

```tsx
import * as RechartsPrimitive from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * 가로 막대. 항목 이름이 길거나(유입경로·기능명) 항목 수가 적어 순위
 * 비교가 목적일 때 세로 막대보다 읽기 쉽다. 기본은 단일 계열(chart-1)이고,
 * perItemColor로 항목마다 고정 팔레트 색을 순서대로 줄 수도 있다.
 */
export interface HBarDatum {
  label: string
  value: number
}

export function ChartBarHorizontal({
  data,
  height = 220,
  valueFormatter = (v: number) => String(v),
  perItemColor = false,
}: {
  data: HBarDatum[]
  height?: number
  valueFormatter?: (v: number) => string
  perItemColor?: boolean
}) {
  const config: ChartConfig = perItemColor
    ? Object.fromEntries(data.map((d, i) => [d.label, { label: d.label, color: `var(--chart-${(i % 6) + 1})` }]))
    : { value: { label: '값', color: 'var(--chart-1)' } }

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RechartsPrimitive.BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 8 }} barCategoryGap={10}>
        <RechartsPrimitive.XAxis type="number" hide />
        <RechartsPrimitive.YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={96} fontSize={12} />
        <ChartTooltip cursor={{ fill: 'var(--color-muted)', fillOpacity: 0.4 }} content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
        <RechartsPrimitive.Bar dataKey="value" radius={[4, 4, 4, 4]} isAnimationActive={false} maxBarSize={26} fill="var(--chart-1)">
          {perItemColor &&
            data.map((d, i) => <RechartsPrimitive.Cell key={d.label} fill={`var(--chart-${(i % 6) + 1})`} />)}
          <RechartsPrimitive.LabelList
            dataKey="value"
            position="right"
            formatter={(v: unknown) => (typeof v === 'number' ? valueFormatter(v) : '')}
            className="fill-muted-foreground text-12"
          />
        </RechartsPrimitive.Bar>
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'card'` 항목이 끝나는 지점(그 항목의 닫는 `},` 바로 다음, `id: 'collapsible'` 항목 앞)에 끼워 넣는다:

```ts
  {
    id: 'chart-bar-horizontal',
    name: 'Chart Bar Horizontal',
    aliases: ['가로 막대', '가로 막대 차트', '순위 차트', 'horizontal bar chart', 'ranking chart'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.17.0',
    changedIn: 'v0.17.0',
    purpose: '항목을 순위로 비교한다. 이름이 길거나 항목 수가 적을 때 세로 막대보다 읽기 쉽다.',
    anatomy: [],
    properties: [
      {
        name: 'colorMode',
        title: 'Color mode',
        description: '항목마다 다른 색을 쓸지, 단일 색으로 통일할지 정한다.',
        display: 'row',
        options: [
          { value: 'single', note: '기본. 계열이 하나뿐임을 색으로도 보인다' },
          { value: 'per-item', note: '항목 자체를 색으로도 구별해야 할 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'fixed-color-order',
        title: '색은 등장 순서대로 고정 배정하고 순환하지 않는다',
        body: 'chart-1부터 chart-6까지 고정 순서로만 쓴다. 시리즈나 항목이 7개를 넘으면 색을 순환시키지 말고 호출부가 나머지를 "기타"로 접는다.',
        do: ['등장 순서대로 chart-1..6을 고정 배정한다', '7개를 넘으면 나머지를 하나로 묶어 표시한다'],
        dont: ['6개를 넘겼다고 색을 처음부터 순환시키지 않는다'],
      },
    ],
    usage: [
      { id: 'traffic-source', title: '유입경로별 순위', note: '검색·다이렉트·소셜처럼 이름이 짧지 않은 항목을 순위로 비교한다' },
      { id: 'feature-adoption', title: '기능별 채택 수', note: '항목 수가 적어 세로 막대보다 가로 막대가 한눈에 들어온다' },
    ],
    cases: [
      { id: 'per-item-color', title: '항목마다 색을 다르게', note: 'perItemColor를 켜면 항목 자체가 색으로도 구별된다' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

`items` 배열의 `data-display` 카테고리 블록 안, `card` 다음 자리에:

```json
{
  "name": "chart-bar-horizontal",
  "type": "registry:ui",
  "title": "Chart Bar Horizontal",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-bar-horizontal.tsx", "type": "registry:ui" }]
}
```

`name: "adminds"` 항목을 찾아 `description`의 한글 숫자를 "마흔두 개"→"마흔세 개"로 고치고, `registryDependencies` 배열에 `https://adminds.vercel.app/r/chart-bar-horizontal.json`을 알파벳 순서 자리(`card.json`과 `checkbox.json` 사이 근방 — 실제 배열을 보고 정확한 자리를 찾는다)에 끼워 넣는다.

- [ ] **Step 4: `README.md`의 개수 문구를 고친다**

`# 토큰과 42개 전부`를 `# 토큰과 43개 전부`로 고친다.

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartBarHorizontalPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartBarHorizontal, type HBarDatum } from '@/components/ui/chart-bar-horizontal'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

const TRAFFIC_SOURCE: HBarDatum[] = [
  { label: '검색', value: 4820 },
  { label: '다이렉트', value: 3210 },
  { label: '소셜', value: 2150 },
  { label: '추천', value: 1340 },
  { label: '이메일', value: 860 },
]

const FEATURE_ADOPTION: HBarDatum[] = [
  { label: '대시보드', value: 980 },
  { label: '내보내기', value: 640 },
  { label: '알림 설정', value: 410 },
  { label: '팀 초대', value: 210 },
]

function render(options: { colorMode?: string }) {
  return <ChartBarHorizontal data={TRAFFIC_SOURCE} perItemColor={options.colorMode === 'per-item'} />
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'traffic-source':
      return <ChartBarHorizontal data={TRAFFIC_SOURCE} />
    case 'feature-adoption':
      return <ChartBarHorizontal data={FEATURE_ADOPTION} />
    case 'per-item-color':
      return <ChartBarHorizontal data={TRAFFIC_SOURCE} perItemColor />
    default:
      return null
  }
}

export function ChartBarHorizontalPage() {
  const meta = getComponent('chart-bar-horizontal')
  if (!meta) return <Placeholder title="Chart Bar Horizontal 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartBarHorizontal data={TRAFFIC_SOURCE} />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: `src/routes/routes.tsx`에 라우트를 추가한다**

import 목록에 알파벳 순서로 끼워 넣는다(`CardPage` 다음, `CheckboxPage` 근방 — 실제 파일의 import 정렬 관례를 따른다):

```tsx
import { ChartBarHorizontalPage } from '@/routes/components/ChartBarHorizontalPage'
```

`components`의 `children` 배열 끝(마지막 라우트 다음)에 추가한다(이 배열은 알파벳 순이 아니라 추가된 순서다 — 기존 관례):

```tsx
{ path: 'chart-bar-horizontal', element: <ChartBarHorizontalPage /> },
```

- [ ] **Step 8: `src/components/layout/nav-config.ts`에 nav 항목을 추가한다**

`components` 섹션의 `Data Display` 묶음(`items` 배열) 안, `Card` 다음 자리에 이름순으로 끼워 넣는다(`오늘 실제 날짜`를 `updatedAt`에 쓴다 — 이 계획을 실행하는 시점의 시스템 날짜를 확인해서 채운다, 손으로 못 박지 않는다):

```ts
{ to: '/components/chart-bar-horizontal', label: 'Chart Bar Horizontal', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 9: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 전부 통과. `registry-parity.test.ts`가 `components.length`(43)와 `adminds` 번들 설명·`registryDependencies`·README 문구를 대조한다.

- [ ] **Step 10: 개발 서버에서 확인한다**

`/components/chart-bar-horizontal`을 열어 막대가 값 내림차순이 아니라 데이터 순서대로 그려지는지(정렬은 호출부 책임), `colorMode`를 "per-item"으로 바꾸면 막대마다 색이 바뀌는지, 다크 모드에서도 축·격자선이 잘 보이는지 확인한다.

- [ ] **Step 11: 커밋한다**

```bash
git add src/components/ui/chart-bar-horizontal.tsx src/routes/components/ChartBarHorizontalPage.tsx src/data/registry.ts registry.json public/r/chart-bar-horizontal.json public/r/adminds.json public/r/registry.json src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-bar-horizontal): 가로 막대 차트를 들여온다

momeokji-admin에서 검증된 순위 비교용 가로 막대를 이식한다. 기본은
단일 색이고 perItemColor로 항목마다 색을 줄 수 있다."
```

---

### Task 3: ChartBarVertical

**Files:**
- Create: `src/components/ui/chart-bar-vertical.tsx`
- Create: `src/routes/components/ChartBarVerticalPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-bar-horizontal` 바로 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 43→44)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("43개 전부"→"44개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartConfig`
- Produces: `ChartBarVertical`, `VBarDatum` — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-bar-vertical.tsx`를 만든다**

```tsx
import * as RechartsPrimitive from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

/*
 * 세로 막대. 짧은 카테고리 라벨의 분포(히스토그램)에 쓴다 — "1회","2회",...
 * 처럼 순서가 있는 구간을 좌→우로 읽는 자연스러움이 가로 막대보다 낫다.
 * 단일 계열 고정(chart-1) — 여러 계열이 필요해지면 별도 variant로 확장한다.
 */
export interface VBarDatum {
  label: string
  value: number
}

const config: ChartConfig = { value: { label: '값', color: 'var(--chart-1)' } }

export function ChartBarVertical({
  data,
  height = 220,
  valueFormatter = (v: number) => String(v),
}: {
  data: VBarDatum[]
  height?: number
  valueFormatter?: (v: number) => string
}) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RechartsPrimitive.BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 4 }}>
        <RechartsPrimitive.CartesianGrid vertical={false} />
        <RechartsPrimitive.XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <RechartsPrimitive.YAxis tickLine={false} axisLine={false} width={40} fontSize={12} tickFormatter={valueFormatter} />
        <ChartTooltip cursor={{ fill: 'var(--color-muted)', fillOpacity: 0.4 }} content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
        <RechartsPrimitive.Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={48} fill="var(--chart-1)">
          <RechartsPrimitive.LabelList
            dataKey="value"
            position="top"
            formatter={(v: unknown) => (typeof v === 'number' ? valueFormatter(v) : '')}
            className="fill-muted-foreground text-12"
          />
        </RechartsPrimitive.Bar>
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-bar-horizontal'` 항목 다음에:

```ts
  {
    id: 'chart-bar-vertical',
    name: 'Chart Bar Vertical',
    aliases: ['세로 막대', '세로 막대 차트', '히스토그램', 'vertical bar chart', 'histogram'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.17.0',
    changedIn: 'v0.17.0',
    purpose: '짧은 카테고리의 분포를 보인다. 순서가 있는 구간을 좌에서 우로 읽을 때 쓴다.',
    anatomy: [],
    properties: [],
    guidelines: [
      {
        id: 'single-series-only',
        title: '단일 계열 전용이다',
        body: '색은 chart-1로 고정된다. 여러 계열을 겹쳐 비교해야 하면 이 컴포넌트가 아니라 Chart Line을 쓴다.',
        do: ['카테고리 하나의 분포를 보일 때 쓴다'],
        dont: ['여러 계열을 겹쳐 비교하려고 이 컴포넌트를 확장하지 않는다'],
      },
    ],
    usage: [
      { id: 'visit-frequency', title: '방문 횟수별 분포', note: '"1회","2회"처럼 순서가 있는 구간을 좌에서 우로 읽는다' },
      { id: 'plan-tier', title: '요금제 등급별 사용자 수', note: '카테고리 수가 적어 한 화면에 다 들어온다' },
    ],
    cases: [],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-bar-vertical",
  "type": "registry:ui",
  "title": "Chart Bar Vertical",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-bar-vertical.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔세 개"→"마흔네 개"로, `registryDependencies`에 `chart-bar-vertical.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "43개 전부"→"44개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartBarVerticalPage.tsx`를 만든다**

```tsx
import { ChartBarVertical, type VBarDatum } from '@/components/ui/chart-bar-vertical'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

const VISIT_FREQUENCY: VBarDatum[] = [
  { label: '1회', value: 3200 },
  { label: '2회', value: 1840 },
  { label: '3회', value: 960 },
  { label: '4회', value: 520 },
  { label: '5회+', value: 410 },
]

const PLAN_TIER: VBarDatum[] = [
  { label: '무료', value: 1840 },
  { label: '스타터', value: 920 },
  { label: '프로', value: 410 },
  { label: '엔터프라이즈', value: 85 },
]

function render() {
  return <ChartBarVertical data={VISIT_FREQUENCY} />
}

function renderExample(exampleId: string) {
  switch (exampleId) {
    case 'visit-frequency':
      return <ChartBarVertical data={VISIT_FREQUENCY} />
    case 'plan-tier':
      return <ChartBarVertical data={PLAN_TIER} />
    default:
      return null
  }
}

export function ChartBarVerticalPage() {
  const meta = getComponent('chart-bar-vertical')
  if (!meta) return <Placeholder title="Chart Bar Vertical 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartBarVertical data={VISIT_FREQUENCY} />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartBarVerticalPage } from '@/routes/components/ChartBarVerticalPage'` 추가, `children` 배열 끝에 `{ path: 'chart-bar-vertical', element: <ChartBarVerticalPage /> }` 추가.

`src/components/layout/nav-config.ts`의 Data Display 묶음, `Chart Bar Horizontal` 다음에:

```ts
{ to: '/components/chart-bar-vertical', label: 'Chart Bar Vertical', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-bar-vertical`에서 막대 위 값 라벨이 안 잘리는지, 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-bar-vertical.tsx src/routes/components/ChartBarVerticalPage.tsx src/data/registry.ts registry.json public/r/chart-bar-vertical.json public/r/adminds.json public/r/registry.json src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-bar-vertical): 세로 막대 차트를 들여온다

momeokji-admin에서 검증된 분포 표시용 세로 막대를 이식한다. 단일
계열 전용이고 chart-1 색으로 고정된다."
```

---

### Task 4: ChartDonut

**Files:**
- Create: `src/components/ui/chart-donut.tsx`
- Create: `src/routes/components/ChartDonutPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-bar-vertical` 바로 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 44→45)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("44개 전부"→"45개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartConfig`/`formatNumber`
- Produces: `ChartDonut`, `DonutDatum` — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-donut.tsx`를 만든다**

```tsx
import * as RechartsPrimitive from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatNumber } from '@/lib/format'

/*
 * 도넛 + 옆 범례. 조각 각도만으로 비율을 비교하게 두지 않고, 값과
 * 백분율을 범례 목록에 직접 적어 정확한 비교를 돕는다.
 */
export interface DonutDatum {
  label: string
  value: number
}

export function ChartDonut({ data, height = 200 }: { data: DonutDatum[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.label, { label: d.label, color: `var(--chart-${(i % 6) + 1})` }]),
  )

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ChartContainer config={config} className="shrink-0" style={{ height, width: height }}>
        <RechartsPrimitive.PieChart>
          <ChartTooltip content={<ChartTooltipContent valueFormatter={formatNumber} hideLabel />} />
          <RechartsPrimitive.Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="86%"
            paddingAngle={2}
            stroke="var(--color-background)"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <RechartsPrimitive.Cell key={d.label} fill={`var(--chart-${(i % 6) + 1})`} />
            ))}
          </RechartsPrimitive.Pie>
        </RechartsPrimitive.PieChart>
      </ChartContainer>
      {/*
       * 라벨과 수치(값·비율)를 같은 줄에 억지로 욱여넣지 않는다 — 도넛이
       * 좁은 3분할 그리드 카드 안에 놓이면 남는 폭이 값+비율 텍스트만으로도
       * 이미 부족해져(예: "1,840 39.4%" ≈ 86px인데 남는 폭이 74px), 같은
       * 줄에 있던 라벨이 flex-1로 밀려 0px까지 찌그러져 사라지는 실패를
       * 겪었다. 라벨을 한 줄 통째로 쓰고 수치는 그 아래 보조줄로 내리면,
       * 폭이 아무리 좁아도 라벨은 늘 자기 줄 전체를 쓸 수 있다.
       */}
      <ul className="flex min-w-0 flex-1 flex-col gap-3">
        {data.map((d, i) => {
          const pct = total ? (d.value / total) * 100 : 0
          return (
            <li key={d.label} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: `var(--chart-${(i % 6) + 1})` }} />
                <span className="text-foreground truncate text-14">{d.label}</span>
              </div>
              <div className="text-muted-foreground pl-4 text-12 tabular-nums">
                {formatNumber(d.value)} · {pct.toFixed(1)}%
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-bar-vertical'` 다음에:

```ts
  {
    id: 'chart-donut',
    name: 'Chart Donut',
    aliases: ['도넛 차트', '파이 차트', '원형 차트', 'pie chart', 'donut chart'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.17.0',
    changedIn: 'v0.17.0',
    purpose: '전체에서 각 항목이 차지하는 비율을 보인다. 조각 각도만으로 비교하게 두지 않고 값·비율을 범례에 함께 적는다.',
    anatomy: [],
    properties: [],
    guidelines: [
      {
        id: 'legend-two-lines',
        title: '범례는 라벨 줄과 수치 줄을 나눈다',
        body: '한 줄에 라벨과 값·비율을 다 넣으면 좁은 카드에서 라벨이 찌그러져 사라진다. 라벨을 한 줄 전체로, 값·비율은 그 아래 보조 줄로 내린다.',
        do: ['라벨은 한 줄 전체를 쓰고, 값·비율은 아래 보조 줄에 둔다'],
        dont: ['라벨과 수치를 한 줄에 욱여넣지 않는다'],
      },
    ],
    usage: [
      { id: 'plan-share', title: '요금제별 사용자 비율', note: '전체에서 각 요금제가 차지하는 몫을 값·비율과 함께 보인다' },
      { id: 'device-share', title: '기기별 접속 비율', note: '항목이 4~6개 안팎일 때 도넛이 막대보다 전체-부분 관계를 잘 보인다' },
    ],
    cases: [
      { id: 'narrow-card', title: '좁은 카드 안', note: '카드 폭이 좁아도 범례 라벨이 찌그러지지 않는다' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-donut",
  "type": "registry:ui",
  "title": "Chart Donut",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/format.json"
  ],
  "files": [{ "path": "src/components/ui/chart-donut.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔네 개"→"마흔다섯 개"로, `registryDependencies`에 `chart-donut.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "44개 전부"→"45개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartDonutPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { ChartDonut, type DonutDatum } from '@/components/ui/chart-donut'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Bounds } from '@/components/docs/Bounds'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

const PLAN_SHARE: DonutDatum[] = [
  { label: '무료', value: 1840 },
  { label: '스타터', value: 920 },
  { label: '프로', value: 410 },
  { label: '엔터프라이즈', value: 85 },
]

const DEVICE_SHARE: DonutDatum[] = [
  { label: '데스크톱', value: 2410 },
  { label: '모바일', value: 1980 },
  { label: '태블릿', value: 340 },
]

function render() {
  return <ChartDonut data={PLAN_SHARE} />
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'plan-share':
      return <ChartDonut data={PLAN_SHARE} />
    case 'device-share':
      return <ChartDonut data={DEVICE_SHARE} />
    case 'narrow-card':
      return (
        <Bounds className="w-52">
          <ChartDonut data={PLAN_SHARE} height={140} />
        </Bounds>
      )
    default:
      return null
  }
}

export function ChartDonutPage() {
  const meta = getComponent('chart-donut')
  if (!meta) return <Placeholder title="Chart Donut 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartDonut data={PLAN_SHARE} />}
      renderExample={renderExample}
    />
  )
}
```

`Bounds`(`src/components/docs/Bounds.tsx`)는 이미 이 저장소에 있는, 예시를 고정 폭 상자 안에 가두는 컴포넌트다(TooltipPage의 `screen-edge` 케이스가 같은 방식으로 쓴다) — 새로 만들지 않는다.

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartDonutPage } from '@/routes/components/ChartDonutPage'` 추가, `children` 배열 끝에 `{ path: 'chart-donut', element: <ChartDonutPage /> }` 추가.

`src/components/layout/nav-config.ts`의 Data Display 묶음, `Chart Bar Vertical` 다음에:

```ts
{ to: '/components/chart-donut', label: 'Chart Donut', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-donut`의 `narrow-card` 케이스에서 라벨이 실제로 안 찌그러지는지(이 컴포넌트가 겪은 실제 버그이므로 반드시 확인), 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-donut.tsx src/routes/components/ChartDonutPage.tsx src/data/registry.ts registry.json public/r/chart-donut.json public/r/adminds.json public/r/registry.json src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-donut): 도넛 차트를 들여온다

momeokji-admin에서 검증된 도넛+범례를 이식한다. 범례를 라벨 줄과
수치 줄로 나눠, 좁은 카드에서 라벨이 찌그러져 사라지던 버그를
방지하는 구조를 그대로 유지한다."
```

---

### Task 5: ChartFunnel

**Files:**
- Create: `src/components/ui/chart-funnel.tsx`
- Create: `src/routes/components/ChartFunnelPage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-donut` 바로 다음)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 45→46)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("45개 전부"→"46개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartConfig`/`formatPercent`
- Produces: `ChartFunnel`, `FunnelStepDatum` — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-funnel.tsx`를 만든다**

```tsx
import * as RechartsPrimitive from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatPercent } from '@/lib/format'

/*
 * 단계별 감소를 보여주는 퍼널 — Mixpanel류 제품 애널리틱스 퍼널과 같은
 * 방식으로 읽는다. 핵심은 "전체 대비 몇 %가 남았나"가 아니라 "바로 직전
 * 단계에서 몇 %가 넘어왔나"다: 초반 단계는 원래 모수가 커서 %가 낮게
 * 나오는 게 당연하고, 정작 봐야 할 건 각 전환 지점에서 얼마나 새는가다.
 * 그래서 도형 안 라벨은 직전 단계 대비 전환율을 1차로 보여주고(첫 단계는
 * 기준이라 값만), 위에 처음→끝 전체 전환율을 한 줄로 따로 둔다 —
 * Mixpanel 퍼널 패널 상단의 "X% 전체 전환"과 같은 자리다.
 */
export interface FunnelStepDatum {
  step: string
  value: number
}

export function ChartFunnel({
  data,
  height = 240,
  valueFormatter = (v: number) => String(v),
}: {
  data: FunnelStepDatum[]
  height?: number
  valueFormatter?: (v: number) => string
}) {
  const first = data[0]?.value || 1
  const last = data[data.length - 1]?.value ?? 0
  const overallPct = first ? (last / first) * 100 : 0
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.step, { label: d.step, color: `var(--chart-${(i % 6) + 1})` }]),
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="text-14">
        <span className="text-muted-foreground">전체 전환율 </span>
        <span className="text-foreground font-semibold tabular-nums">{formatPercent(overallPct, 1)}</span>
        <span className="text-muted-foreground"> ({data[0]?.step} → {data[data.length - 1]?.step})</span>
      </div>
      <ChartContainer config={config} className="w-full" style={{ height }}>
        <RechartsPrimitive.FunnelChart>
          <ChartTooltip content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
          <RechartsPrimitive.Funnel dataKey="value" data={data} nameKey="step" isAnimationActive={false}>
            {data.map((d, i) => (
              <RechartsPrimitive.Cell key={d.step} fill={`var(--chart-${(i % 6) + 1})`} />
            ))}
            <RechartsPrimitive.LabelList position="right" dataKey="step" className="fill-foreground text-12 font-medium" />
            {/*
             * dataKey 기반 formatter는 값만 받고 인덱스를 안 줘서 "직전 단계
             * 대비"를 계산할 수 없다 — content 렌더 함수로 바꿔 index를 받아
             * data[index-1]과 직접 비교한다. 리팩터링할 때 formatter로
             * 되돌리면 이 컴포넌트의 존재 이유(단계-대-단계 비교)가 무너진다.
             */}
            <RechartsPrimitive.LabelList
              position="center"
              dataKey="value"
              content={(raw: unknown) => {
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
                const prev = index === 0 ? null : data[index - 1]?.value
                const label =
                  prev == null
                    ? valueFormatter(value)
                    : `${valueFormatter(value)} · 이전 대비 ${formatPercent(prev ? (value / prev) * 100 : 0, 0)}`
                return (
                  <text x={x + width / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-background text-12 font-semibold">
                    {label}
                  </text>
                )
              }}
            />
          </RechartsPrimitive.Funnel>
        </RechartsPrimitive.FunnelChart>
      </ChartContainer>
    </div>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-donut'` 다음에:

```ts
  {
    id: 'chart-funnel',
    name: 'Chart Funnel',
    aliases: ['퍼널', '퍼널 차트', '전환 퍼널', 'funnel chart', 'conversion funnel'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.17.0',
    changedIn: 'v0.17.0',
    purpose: '여러 단계를 거치며 줄어드는 값을 보인다. 전체 대비가 아니라 바로 직전 단계 대비 전환율을 1차로 보인다.',
    anatomy: [],
    properties: [],
    guidelines: [
      {
        id: 'step-to-step-not-overall',
        title: '전체 대비가 아니라 직전 단계 대비를 1차로 보인다',
        body: '초반 단계는 모수가 커서 전체-대비 %가 낮게 나오는 게 당연하다. 정작 봐야 할 신호는 각 전환 지점에서 얼마나 새는가다 — 단계 안 라벨은 직전 단계 대비로, 전체 전환율은 위에 별도로 한 줄만 둔다.',
        do: ['단계 라벨은 직전 단계 대비 전환율을 보인다', '전체 전환율은 상단에 한 줄로 따로 둔다'],
        dont: ['모든 단계를 전체(첫 단계) 대비 %로만 보이지 않는다'],
      },
    ],
    usage: [
      { id: 'signup-funnel', title: '가입 퍼널', note: '방문→가입→첫 결제→활성 사용자까지 단계별 전환을 보인다' },
    ],
    cases: [
      { id: 'two-step', title: '두 단계뿐일 때', note: '단계가 둘이면 직전 단계 대비와 전체 전환율이 같은 값이 된다' },
    ],
    verified: true,
  },
```

- [ ] **Step 3: `registry.json`에 `registry:ui` 항목을 추가하고 `adminds` 번들을 갱신한다**

```json
{
  "name": "chart-funnel",
  "type": "registry:ui",
  "title": "Chart Funnel",
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/format.json"
  ],
  "files": [{ "path": "src/components/ui/chart-funnel.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔다섯 개"→"마흔여섯 개"로, `registryDependencies`에 `chart-funnel.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "45개 전부"→"46개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartFunnelPage.tsx`를 만든다**

```tsx
import { ChartFunnel, type FunnelStepDatum } from '@/components/ui/chart-funnel'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

const SIGNUP_FUNNEL: FunnelStepDatum[] = [
  { step: '방문', value: 12000 },
  { step: '가입', value: 3400 },
  { step: '첫 결제', value: 980 },
  { step: '활성 사용자', value: 640 },
]

const TWO_STEP: FunnelStepDatum[] = [
  { step: '가입', value: 3400 },
  { step: '첫 결제', value: 980 },
]

function render() {
  return <ChartFunnel data={SIGNUP_FUNNEL} />
}

function renderExample(exampleId: string) {
  switch (exampleId) {
    case 'signup-funnel':
      return <ChartFunnel data={SIGNUP_FUNNEL} />
    case 'two-step':
      return <ChartFunnel data={TWO_STEP} height={160} />
    default:
      return null
  }
}

export function ChartFunnelPage() {
  const meta = getComponent('chart-funnel')
  if (!meta) return <Placeholder title="Chart Funnel 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={<ChartFunnel data={SIGNUP_FUNNEL} />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartFunnelPage } from '@/routes/components/ChartFunnelPage'` 추가, `children` 배열 끝에 `{ path: 'chart-funnel', element: <ChartFunnelPage /> }` 추가.

`src/components/layout/nav-config.ts`의 Data Display 묶음, `Chart Donut` 다음에:

```ts
{ to: '/components/chart-funnel', label: 'Chart Funnel', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-funnel`에서 첫 단계 라벨엔 "이전 대비"가 안 붙고 값만 나오는지, 2·3·4단계엔 "값 · 이전 대비 N%"가 나오는지, 상단 전체 전환율이 첫 단계/마지막 단계 비율과 맞는지 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-funnel.tsx src/routes/components/ChartFunnelPage.tsx src/data/registry.ts registry.json public/r/chart-funnel.json public/r/adminds.json public/r/registry.json src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-funnel): 전환 퍼널 차트를 들여온다

momeokji-admin에서 검증된 Mixpanel류 퍼널을 이식한다. 단계 라벨은
직전 단계 대비 전환율을 1차로 보이고, 전체 전환율은 상단에 별도로
한 줄 둔다. LabelList의 content 렌더 함수를 그대로 유지한다 -
formatter로 되돌리면 단계-대-단계 비교 자체가 불가능해진다."
```

---

### Task 6: ChartLine

**Files:**
- Create: `src/components/ui/chart-line.tsx`
- Create: `src/routes/components/ChartLinePage.tsx`
- Modify: `src/data/registry.ts`(새 항목, `chart-funnel` 바로 다음, `collapsible` 앞)
- Modify: `registry.json`(새 `registry:ui` 항목, `adminds` 번들 46→47)
- Modify: `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`("46개 전부"→"47개 전부")

**Interfaces:**
- Consumes: Task 1의 `ChartContainer`/`ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`/`ChartConfig`
- Produces: `ChartLine`, `LineChartSeries` — 다른 Task가 소비하지 않는다.

- [ ] **Step 1: `src/components/ui/chart-line.tsx`를 만든다**

```tsx
import * as RechartsPrimitive from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

/*
 * 시간축 위 다계열 추세선. 유입 추세·리텐션 곡선·바이럴 추세처럼 "시간에
 * 따라 무엇이 늘고 주는가"를 보여줄 때 쓴다.
 *
 * 색은 소비자가 정하지 않는다 — series 배열의 등장 순서대로 chart-1..6
 * (검증된 범주형 6색)을 고정 배정한다. dataviz 원칙: 범주형 색은 고정
 * 순서로만 쓰고 절대 순환하지 않는다.
 *
 * xKey 기본값은 'date'다 — recharts는 XAxis의 dataKey가 실제 데이터에
 * 없는 필드를 가리키면 카테고리 축의 도메인 자체가 비어 Line이 점 하나도
 * 못 그리고 조용히 사라진다(축·범례는 그려지는데 곡선만 없는 형태로
 * 보인다 — 조합하는 쪽에서 오탐하기 쉬운 실패 모드다, momeokji-admin에서
 * 실제로 겪었다). 시간축 데이터는 거의 항상 'date' 필드를 쓰므로 그걸
 * 기본값으로 둔다 — 다른 이름을 쓰는 데이터는 xKey를 명시하면 된다.
 */
export interface LineChartSeries {
  key: string
  label: string
}

export function ChartLine({
  data,
  series,
  xKey = 'date',
  height = 240,
  valueFormatter = (v: number) => String(v),
  yDomain,
}: {
  data: Array<Record<string, string | number>>
  series: LineChartSeries[]
  xKey?: string
  height?: number
  valueFormatter?: (v: number) => string
  yDomain?: [number | 'auto', number | 'auto']
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, color: `var(--chart-${(i % 6) + 1})` }]),
  )

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RechartsPrimitive.LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
        <RechartsPrimitive.CartesianGrid vertical={false} />
        <RechartsPrimitive.XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <RechartsPrimitive.YAxis tickLine={false} axisLine={false} width={40} fontSize={12} domain={yDomain} tickFormatter={valueFormatter} />
        <ChartTooltip
          cursor={{ stroke: 'var(--color-muted-foreground)', strokeOpacity: 0.25 }}
          content={<ChartTooltipContent indicator="line" valueFormatter={valueFormatter} />}
        />
        {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {series.map((s) => (
          <RechartsPrimitive.Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            dot={{ r: 2.5, strokeWidth: 0, fill: `var(--color-${s.key})` }}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-background)' }}
            isAnimationActive={false}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  )
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 추가한다**

`id: 'chart-funnel'` 다음(`id: 'collapsible'` 항목 바로 앞)에:

```ts
  {
    id: 'chart-line',
    name: 'Chart Line',
    aliases: ['라인 차트', '추세선', '꺾은선 그래프', 'line chart', 'trend chart'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.17.0',
    changedIn: 'v0.17.0',
    purpose: '시간에 따라 값이 어떻게 늘고 주는지 보인다. 여러 계열을 겹쳐 비교할 때도 쓴다.',
    anatomy: [],
    properties: [],
    guidelines: [
      {
        id: 'xkey-must-match-data',
        title: 'xKey는 실제 데이터의 필드명과 일치해야 한다',
        body: 'xKey가 데이터에 없는 필드를 가리키면 X축 도메인 자체가 비어 선이 한 점도 안 그려진다 - 축·범례는 정상으로 보여 오탐하기 쉽다. 기본값 date를 쓰는 데이터가 아니면 xKey를 반드시 명시한다.',
        do: ['시간축 데이터가 date 필드를 쓰면 xKey를 생략한다', '다른 필드명을 쓰면 xKey를 명시한다'],
        dont: ['데이터에 없는 필드명을 xKey에 그대로 두지 않는다'],
      },
      {
        id: 'legend-for-multi-series',
        title: '계열이 둘 이상이면 범례가 자동으로 붙는다',
        body: '색만으로 계열을 구별하게 두지 않는다. series가 하나면 범례를 생략한다 - 구별할 게 없기 때문이다.',
        do: [],
        dont: [],
      },
    ],
    usage: [
      { id: 'signup-trend', title: '2주치 가입 추세', note: '유료·무료 두 계열을 겹쳐 시간에 따른 변화를 비교한다' },
      { id: 'single-series', title: '단일 계열 추세', note: '계열이 하나면 범례 없이 선 하나만 그린다' },
    ],
    cases: [
      { id: 'custom-xkey', title: '다른 필드명의 시간축', note: 'date가 아닌 필드명을 쓸 때는 xKey를 명시한다' },
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
  "dependencies": ["recharts"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/chart.json",
    "https://adminds.vercel.app/r/tokens.json"
  ],
  "files": [{ "path": "src/components/ui/chart-line.tsx", "type": "registry:ui" }]
}
```

`adminds` 번들 `description`을 "마흔여섯 개"→"마흔일곱 개"로, `registryDependencies`에 `chart-line.json`을 알파벳 순서 자리에 추가한다.

- [ ] **Step 4: `README.md`를 "46개 전부"→"47개 전부"로 고친다.**

- [ ] **Step 5: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 6: `src/routes/components/ChartLinePage.tsx`를 만든다**

```tsx
import { ChartLine, type LineChartSeries } from '@/components/ui/chart-line'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

const SIGNUP_SERIES: LineChartSeries[] = [
  { key: 'paid', label: '유료' },
  { key: 'free', label: '무료' },
]

const SIGNUP_DATA = [
  { date: '8/16', paid: 42, free: 210 },
  { date: '8/17', paid: 38, free: 198 },
  { date: '8/18', paid: 51, free: 225 },
  { date: '8/19', paid: 47, free: 240 },
  { date: '8/20', paid: 60, free: 262 },
  { date: '8/21', paid: 55, free: 251 },
  { date: '8/22', paid: 64, free: 270 },
  { date: '8/23', paid: 58, free: 264 },
  { date: '8/24', paid: 71, free: 288 },
  { date: '8/25', paid: 66, free: 279 },
  { date: '8/26', paid: 74, free: 301 },
  { date: '8/27', paid: 80, free: 312 },
  { date: '8/28', paid: 77, free: 305 },
  { date: '8/29', paid: 85, free: 320 },
]

const SINGLE_SERIES: LineChartSeries[] = [{ key: 'value', label: '값' }]
const SINGLE_DATA = SIGNUP_DATA.map((d) => ({ date: d.date, value: d.paid + d.free }))

const CUSTOM_XKEY_DATA = SIGNUP_DATA.map((d) => ({ week: d.date, value: d.paid }))

function render() {
  return <ChartLine data={SIGNUP_DATA} series={SIGNUP_SERIES} />
}

function renderExample(exampleId: string) {
  switch (exampleId) {
    case 'signup-trend':
      return <ChartLine data={SIGNUP_DATA} series={SIGNUP_SERIES} />
    case 'single-series':
      return <ChartLine data={SINGLE_DATA} series={SINGLE_SERIES} />
    case 'custom-xkey':
      return <ChartLine data={CUSTOM_XKEY_DATA} series={[{ key: 'value', label: '값' }]} xKey="week" />
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
      preview={<ChartLine data={SIGNUP_DATA} series={SIGNUP_SERIES} />}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: 라우트·nav 등록**

`src/routes/routes.tsx`에 `import { ChartLinePage } from '@/routes/components/ChartLinePage'` 추가, `children` 배열 끝에 `{ path: 'chart-line', element: <ChartLinePage /> }` 추가.

`src/components/layout/nav-config.ts`의 Data Display 묶음, `Chart Funnel` 다음(`Collapsible` 바로 앞)에:

```ts
{ to: '/components/chart-line', label: 'Chart Line', updatedAt: '<오늘 날짜>' },
```

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 개발 서버에서 확인한다**

`/components/chart-line`에서 두 계열이 겹쳐 그려지고 범례가 나오는지, `single-series` 케이스는 범례가 없는지, `custom-xkey` 케이스가 실제로 선을 그리는지(안 그려지면 이 컴포넌트가 막으려는 바로 그 실패 모드가 재현된 것이므로 반드시 확인), 다크 모드 확인.

- [ ] **Step 10: 커밋한다**

```bash
git add src/components/ui/chart-line.tsx src/routes/components/ChartLinePage.tsx src/data/registry.ts registry.json public/r/chart-line.json public/r/adminds.json public/r/registry.json src/routes/routes.tsx src/components/layout/nav-config.ts README.md
git commit -m "feat(chart-line): 다계열 추세선 차트를 들여온다

momeokji-admin에서 검증된 시간축 추세선을 이식한다. xKey 기본값을
date로 둔다 - 데이터에 없는 필드를 가리키면 축·범례는 정상으로
보이는데 선만 안 그려지는 실패 모드를 겪었기 때문이다."
```

**Step 11: 전체 확인**

5개 차트 문서 페이지가 `/components` 목록의 Data Display 묶음에서 Card와 Collapsible 사이에 알파벳 순서(Chart Bar Horizontal → Chart Bar Vertical → Chart Donut → Chart Funnel → Chart Line)로 나란히 보이는지 마지막으로 확인한다. `grep -c "^    id: '" src/data/registry.ts`가 47을 찍는지, `npm run build`가 클린한지 최종 확인한다.

---

## 자체 검토 기록

**스펙 커버리지 확인:**
- 소스·실패 모드 보존 — Task 2~6이 각자 컴포넌트에 원본 주석과 방어 로직을 그대로 옮김
- 범위(6개, StatCard 등 4개는 범위 밖) — Task 1~6 전부
- 토큰(`--chart-1..6` 등, 별도 `@theme inline`) — Task 1
- registry.ts 항목(카테고리·삽입 순서·purpose 등) — Task 2~6
- Anatomy 생략, Properties 최소화 — Task 2~6의 registry.ts 항목에 반영
- `adminds` 번들 갱신을 Task별로 즉시 처리 — Task 2~6 각자의 Step 3

**타입 일관성:** `ChartConfig`(Task 1이 export)를 Task 2~6이 전부 같은 이름·구조로 import. `HBarDatum`/`VBarDatum`/`DonutDatum`/`FunnelStepDatum`/`LineChartSeries` 각각 자기 컴포넌트 파일에서만 export되고 다른 Task가 소비하지 않아 이름 충돌이 없다. `formatNumber`/`formatPercent`(Task 1)를 Task 4·5가 각각 정확히 같은 이름으로 import.

**플레이스홀더 스캔:** `<오늘 날짜>` 표기가 Task 2~6의 nav-config Step에 있다 — 계획 작성 시점과 구현 시점의 날짜가 다를 수 있어 손으로 못 박을 수 없는 자리다. 조건부가 아니라 구현자가 반드시 시스템 날짜를 확인해 채워야 한다는 지시를 명시적으로 담았다(v0.16.0 계획의 같은 자리와 동일한 성격).

**모호성 점검:** `chart.tsx`/`format.ts`를 `registry:ui`가 아닌 `registry:lib`로 등록하는 근거(`registry-parity.test.ts`가 `registry:ui`만 양방향으로 강제한다는 것, `utils.ts` 전례)를 명시했다. `adminds` 번들 top-level에 `chart.json`/`format.json`을 안 넣는 근거(전이 의존성으로 자동 포함, `tokens.json`/`utils.json` 전례)도 명시했다. registry.ts/registry.json 안 정확한 삽입 위치는 알파벳 순서(카테고리 안에서)라는 기존 규칙을 그대로 따랐다.
