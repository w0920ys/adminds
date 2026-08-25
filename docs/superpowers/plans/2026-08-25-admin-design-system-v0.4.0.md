# 어드민 디자인 시스템 워크벤치 v0.4.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 컴포넌트 문서의 지시선·표·예시를 실사용 가능한 수준으로 올리고, Foundations에 Design Token·Color Role·Palette를 더해 토큰 체계를 문서로 완성한다.

**Architecture:** 예시 화면은 JSX이므로 데이터(`registry.ts`)에는 식별자만 두고 렌더링은 페이지가 콜백으로 주입한다 — 전시 컴포넌트가 어떤 컴포넌트인지 몰라야 한다는 원칙을 유지한다. 색 값은 브라우저가 계산한 결과를 canvas로 읽어 hex로 변환한다. 문서 순서·최종 수정일은 `nav-config.ts` 한 곳에서 파생된다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui, react-router v8, lucide-react, Vitest, Pretendard

**Spec:** `docs/superpowers/specs/2026-08-25-admin-design-system-v0.4.0-design.md`

## Global Constraints

- 작업 브랜치는 `v0.4.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기(`[3px]`, `[#abc]`, `[calc(...)]`) 금지** — `[&_svg]:size-4` 같은 임의 **셀렉터** 변형은 값이 아니므로 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
  ```

  예외: 실측 결과로 계산된 런타임 위치값(`style={{ top: item.labelY }}`)과 SVG 좌표 속성값은 Tailwind 임의 값이 아니므로 허용된다.
- 비주얼은 shadcn 기본 톤(neutral). 브랜드 색을 임의로 넣지 않는다. **단 `--color-annotation` 계열은 문서 주석 전용으로 신설하며, 제품 UI에는 쓰지 않는다.**
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 네비게이션 순서와 최종 수정일은 `nav-config.ts`에서, 토큰 이름은 `parseTokenNames`에서, 값은 `readTokens` 실측에서 온다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않고 `render` 콜백으로 주입받는다. **예외: `ExampleFrame`은 틀만 제공하며 내용은 여전히 주입받는다.**
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- shadcn CLI는 이 환경에서 동작하지 않는다 (v4.19.0, 대화형 프롬프트 우회 불가). 컴포넌트가 필요하면 수동으로 작성한다.
- 문구는 Foundations의 Writing 규칙을 따른다 — `~합니다`체(요청만 `~하세요`), 날짜 `YYYY-MM-DD`, 느낌표·물음표 안 씀, 인용은 작은따옴표, 표 셀 끝에 마침표 없음.
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사.

---

## File Structure

### 생성

| 파일 | 책임 |
|---|---|
| `src/components/docs/ExampleFrame.tsx` | 예시 화면 틀. Do/Don't 라벨 옵션 |
| `src/components/docs/CopyValue.tsx` | 값 + hover 복사 아이콘 + 복사 후 체크 |
| `src/lib/color.ts` | 계산된 색 문자열 → hex 변환 |
| `src/routes/foundations/DesignTokenPage.tsx` | 토큰 층·네이밍 규칙·전체 테이블 |
| `src/routes/foundations/ColorRolePage.tsx` | 역할의 위계 |
| `src/routes/foundations/PalettePage.tsx` | 원시 스케일과 시맨틱 연결 |

### 교체·수정

| 파일 | 변경 |
|---|---|
| `src/components/layout/nav-config.ts` | `DocLink.updatedAt`, `findAdjacent` 섹션 한정, `findDoc`, Foundations 3개 항목 추가 |
| `src/components/layout/DocFooterNav.tsx` | 최종 수정일, secondary filled, Overview에서 숨김 |
| `src/components/docs/Anatomy.tsx` | 주석 색, 얇은 선, 선택 시 나머지 숨김, 좁은 화면 번호 배지 |
| `src/components/docs/Playground.tsx` | 초기값 리셋 버튼 |
| `src/components/docs/ComponentPage.tsx` | 예시 렌더 콜백 전달 |
| `src/components/docs/GuidelineBlock.tsx` | do/don't별 예시 슬롯 |
| `src/components/docs/ExampleList.tsx` | 항목별 예시 슬롯 |
| `src/data/registry.ts` | `variant`를 `row`로, `Guideline`·`Example`에 `id` |
| `src/routes/components/ButtonPage.tsx` | 예시 조합 주입 |
| `src/styles/tokens.css` | `--annotation` 계열, Pretendard 스택, `word-break` |
| `src/routes/foundations/*.tsx` | 개요 섹션 추가 (Overview 제외) |
| `src/routes/foundations/FoundationsOverview.tsx` | 카드 높이 균일 |
| `src/routes/routes.tsx` | 신규 3개 라우트 |

---

## Task 1: 문서 셸 — 최종 수정일 · 섹션 내 이동 · 버튼 스타일

**Files:**
- Modify: `src/components/layout/nav-config.ts`, `src/components/layout/DocFooterNav.tsx`
- Test: `src/components/layout/nav-config.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces:
  - `type DocLink = { to: string; label: string; updatedAt: string }`
  - `findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink }` — **같은 섹션 안에서만, Overview 제외**
  - `findDoc(pathname: string): DocLink | undefined`
  - `docOrder`, `sections`, `findSection`은 그대로

- [ ] **Step 1: 실패하는 테스트 작성**

`src/components/layout/nav-config.test.ts`의 `findAdjacent` describe 블록을 다음으로 교체하고, `findDoc` 블록을 추가한다. 나머지 describe(`sections`, `docOrder`, `findSection`, `라우트와 네비게이션의 일치`)는 그대로 둔다.

```ts
describe('findAdjacent', () => {
  it('Overview에는 이전도 다음도 없다', () => {
    for (const section of sections) {
      expect(findAdjacent(section.to), `${section.id} Overview`).toEqual({
        prev: undefined,
        next: undefined,
      })
    }
  })

  it('섹션의 첫 문서에는 이전이 없다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const first = foundations.items[1]
    expect(findAdjacent(first.to).prev).toBeUndefined()
    expect(findAdjacent(first.to).next).toBe(foundations.items[2])
  })

  it('섹션의 마지막 문서에는 다음이 없다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const last = foundations.items[foundations.items.length - 1]
    expect(findAdjacent(last.to).next).toBeUndefined()
    expect(findAdjacent(last.to).prev).toBe(foundations.items[foundations.items.length - 2])
  })

  it('섹션 경계를 넘지 않는다', () => {
    for (const section of sections) {
      for (const doc of section.items) {
        const { prev, next } = findAdjacent(doc.to)
        for (const link of [prev, next]) {
          if (!link) continue
          expect(findSection(link.to).id, `${doc.to} -> ${link.to}`).toBe(section.id)
        }
      }
    }
  })

  it('이동 대상에 Overview가 포함되지 않는다', () => {
    const overviewPaths = new Set(sections.map((s) => s.to))
    for (const doc of docOrder) {
      const { prev, next } = findAdjacent(doc.to)
      for (const link of [prev, next]) {
        if (!link) continue
        expect(overviewPaths.has(link.to), `${doc.to} -> ${link.to}`).toBe(false)
      }
    }
  })

  it('목록에 없는 경로는 양쪽 모두 없다', () => {
    expect(findAdjacent('/nope')).toEqual({ prev: undefined, next: undefined })
  })
})

describe('findDoc', () => {
  it('경로로 문서를 찾는다', () => {
    expect(findDoc('/foundations/color')?.label).toBe('Color')
  })

  it('없는 경로는 undefined다', () => {
    expect(findDoc('/nope')).toBeUndefined()
  })
})

describe('updatedAt', () => {
  it('모든 문서에 최종 수정일이 있다', () => {
    for (const doc of docOrder) {
      expect(doc.updatedAt, doc.to).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
```

import 줄에 `findDoc`을 추가한다.

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `findDoc`이 export되지 않고, `updatedAt`이 없으며, `findAdjacent`가 아직 섹션을 넘는다.

- [ ] **Step 3: nav-config 수정**

`DocLink` 타입에 `updatedAt`을 추가한다.

```ts
export type DocLink = {
  to: string
  label: string
  /** 문서 최종 수정일. YYYY-MM-DD */
  updatedAt: string
}
```

`sections`의 모든 항목에 `updatedAt`을 붙인다. 값은 다음을 쓴다 — v0.3.0에서 만든 문서는 `'2026-08-25'`, v0.4.0에서 새로 만들거나 크게 고치는 문서도 `'2026-08-25'`(같은 날 작업).

Foundations 섹션의 `items`를 다음으로 교체한다 (Design Token · Color Role · Palette 추가).

```ts
    items: [
      { to: '/foundations', label: 'Overview', updatedAt: '2026-08-25' },
      { to: '/foundations/design-token', label: 'Design Token', updatedAt: '2026-08-25' },
      { to: '/foundations/color', label: 'Color', updatedAt: '2026-08-25' },
      { to: '/foundations/color-role', label: 'Color Role', updatedAt: '2026-08-25' },
      { to: '/foundations/palette', label: 'Palette', updatedAt: '2026-08-25' },
      { to: '/foundations/typography', label: 'Typography', updatedAt: '2026-08-25' },
      { to: '/foundations/spacing', label: 'Spacing', updatedAt: '2026-08-25' },
      { to: '/foundations/iconography', label: 'Iconography', updatedAt: '2026-08-25' },
      { to: '/foundations/state', label: 'State', updatedAt: '2026-08-25' },
      { to: '/foundations/voice-and-tone', label: 'Voice and Tone', updatedAt: '2026-08-25' },
      { to: '/foundations/writing', label: 'Writing', updatedAt: '2026-08-25' },
    ],
```

`findAdjacent`를 교체하고 `findDoc`을 추가한다.

```ts
export function findDoc(pathname: string): DocLink | undefined {
  return docOrder.find((doc) => doc.to === pathname)
}

/**
 * 이전·다음 문서. 같은 섹션 안에서만 이동한다.
 * 섹션이 바뀌면 맥락도 바뀌므로 경계를 넘지 않는다.
 * 각 섹션의 Overview는 그 섹션의 입구이지 순서상의 한 문서가 아니므로 목록에서 뺀다.
 */
export function findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink } {
  const section = findSection(pathname)
  if (pathname === section.to) return { prev: undefined, next: undefined }

  const docs = section.items.filter((item) => item.to !== section.to)
  const index = docs.findIndex((doc) => doc.to === pathname)
  if (index === -1) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? docs[index - 1] : undefined,
    next: index < docs.length - 1 ? docs[index + 1] : undefined,
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS. 실제 개수를 보고하라 — `findAdjacent` 테스트가 6개, `findDoc` 2개, `updatedAt` 1개로 늘어난다.

`라우트와 네비게이션의 일치` 테스트가 실패하면 그것이 정상이다 — 새로 추가한 3개 경로에 라우트가 없기 때문이다. Step 5에서 해결한다.

- [ ] **Step 5: 신규 3개 경로를 준비 중으로 연결**

`src/routes/routes.tsx`에 세 줄을 추가한다. 실제 페이지는 Task 6~7이 만든다.

```tsx
      { path: 'foundations/design-token', element: <Placeholder title="Design Token" /> },
      { path: 'foundations/color-role', element: <Placeholder title="Color Role" /> },
      { path: 'foundations/palette', element: <Placeholder title="Palette" /> },
```

기존 `foundations/color` 라우트 뒤에 두어 LNB 순서와 읽는 순서를 맞춘다.

- [ ] **Step 6: 테스트 재확인**

Run: `npm test`
Expected: 전부 통과. `라우트와 네비게이션의 일치` 두 테스트가 다시 맞아야 한다.

- [ ] **Step 7: DocFooterNav 교체**

Rewrite `src/components/layout/DocFooterNav.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findAdjacent, findDoc, findSection } from '@/components/layout/nav-config'

export function DocFooterNav() {
  const { pathname } = useLocation()
  const section = findSection(pathname)
  const doc = findDoc(pathname)
  const { prev, next } = findAdjacent(pathname)

  /** Overview는 섹션의 입구이므로 순서상의 이동을 두지 않는다 */
  const isOverview = pathname === section.to
  if (isOverview) return null
  if (!doc && !prev && !next) return null

  return (
    <footer className="mt-16 flex flex-col gap-4 border-t pt-6">
      {doc && (
        <p className="text-muted-foreground text-2xs">최종 수정 {doc.updatedAt}</p>
      )}
      {(prev || next) && (
        <nav className="grid gap-3 sm:grid-cols-2" aria-label="문서 이동">
          {prev ? (
            <Link
              to={prev.to}
              className="bg-secondary/60 hover:bg-secondary flex flex-col gap-1 rounded-lg p-4"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-2xs">
                <ChevronLeft size={12} aria-hidden /> 이전 문서
              </span>
              <strong className="text-sm">{prev.label}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={next.to}
              className="bg-secondary/60 hover:bg-secondary flex flex-col items-end gap-1 rounded-lg p-4 sm:text-right"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-2xs">
                다음 문서 <ChevronRight size={12} aria-hidden />
              </span>
              <strong className="text-sm">{next.label}</strong>
            </Link>
          )}
        </nav>
      )}
    </footer>
  )
}
```

섹션 안에서만 이동하므로 v0.3.0의 `labelFor`(섹션명 병기)는 필요 없다. 제거한다.

- [ ] **Step 8: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 문서 하단에 최종 수정일 추가, 이동을 섹션 안으로 한정

섹션이 바뀌면 맥락도 바뀌므로 이전·다음이 경계를 넘지 않게 한다.
각 섹션의 Overview는 입구이지 순서상의 한 문서가 아니므로
이동 목록에서 빼고 Overview 페이지에는 네비게이션을 두지 않는다.

최종 수정일은 nav-config 한 곳에서 오며 페이지마다 적지 않는다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Anatomy — 주석 색 · 얇은 선 · 선택 시 단독 표시 · 좁은 화면 번호 배지

**Files:**
- Modify: `src/styles/tokens.css`, `src/components/docs/Anatomy.tsx`

**Interfaces:**
- Consumes: `ComponentMeta`, `AnatomyPart`, `cn`
- Produces: `Anatomy({ meta, preview })` — 시그니처 변화 없음

- [ ] **Step 1: 주석 색 토큰 추가**

`src/styles/tokens.css`의 `:root` 블록 끝에 추가한다.

```css
  /* 문서 주석 전용. 제품 UI에는 쓰지 않는다 — 컴포넌트 색과 절대 겹치지 않아야 한다 */
  --annotation: oklch(0.55 0.22 285);
  --annotation-muted: oklch(0.7 0.14 285);
```

`.dark` 블록 끝에 추가한다.

```css
  --annotation: oklch(0.75 0.16 285);
  --annotation-muted: oklch(0.62 0.12 285);
```

`@theme inline` 블록의 색 목록 끝에 추가한다.

```css
  --color-annotation: var(--annotation);
  --color-annotation-muted: var(--annotation-muted);
```

- [ ] **Step 2: Anatomy 교체**

Rewrite `src/components/docs/Anatomy.tsx`:

```tsx
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AnatomyPart, ComponentMeta } from '@/data/registry'
import { cn } from '@/lib/utils'

type Placed = {
  part: AnatomyPart
  index: number
  side: 'left' | 'right'
  /** 무대 기준 좌표계의 부위 사각형 */
  box: { x: number; y: number; width: number; height: number }
  /** 라벨의 세로 중심 */
  labelY: number
}

/** 라벨 하나가 차지하는 세로 공간 */
const LABEL_SLOT = 56
/** 무대 가장자리에서 라벨까지의 여백 */
const GUTTER = 12
/** 이 폭 미만에서는 라벨을 놓을 자리가 없어 번호 배지로 대신한다 */
const MIN_WIDTH_FOR_LINES = 640

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [narrow, setNarrow] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const stageBox = stage.getBoundingClientRect()

    const found = meta.anatomy
      .map((part, index) => {
        const el = stage.querySelector(`[data-anatomy="${part.part}"]`)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return {
          part,
          index,
          box: {
            x: rect.x - stageBox.x,
            y: rect.y - stageBox.y,
            width: rect.width,
            height: rect.height,
          },
        }
      })
      .filter((item): item is Omit<Placed, 'side' | 'labelY'> => item !== null)

    const isNarrow = stageBox.width < MIN_WIDTH_FOR_LINES
    setNarrow(isNarrow)
    setSize({ width: stageBox.width, height: stageBox.height })

    if (isNarrow) {
      /** 좁은 화면에서는 지시선 대신 부위 위에 번호 배지를 올린다 */
      setPlaced(found.map((item) => ({ ...item, side: 'left' as const, labelY: 0 })))
      return
    }

    const mid = stageBox.width / 2
    const sided = found.map((item) => ({
      ...item,
      side: (item.box.x + item.box.width / 2 < mid ? 'left' : 'right') as 'left' | 'right',
    }))

    const next: Placed[] = []
    for (const side of ['left', 'right'] as const) {
      const group = sided
        .filter((item) => item.side === side)
        .sort((a, b) => a.box.y + a.box.height / 2 - (b.box.y + b.box.height / 2))
      const start = Math.max(
        LABEL_SLOT / 2,
        stageBox.height / 2 - (group.length * LABEL_SLOT) / 2 + LABEL_SLOT / 2,
      )
      group.forEach((item, i) => next.push({ ...item, labelY: start + i * LABEL_SLOT }))
    }

    setPlaced(next.sort((a, b) => a.index - b.index))
  }, [meta])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(stage)
    return () => observer.disconnect()
  }, [measure])

  /** 선택된 부위가 있으면 그것만 그린다. 흐리게 두면 무엇을 가리키는지 흐려진다 */
  const shown = active === null ? placed : placed.filter((item) => item.part.part === active)

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={stageRef}
        className="bg-surface-raised relative min-h-56 overflow-hidden rounded-lg border"
      >
        <div className="grid min-h-56 place-items-center px-6 py-12 sm:px-44">{preview}</div>

        {shown.length > 0 && !narrow && (
          <>
            <svg
              className="pointer-events-none absolute inset-0 text-annotation"
              width={size.width}
              height={size.height}
              aria-hidden
            >
              {shown.map((item) => {
                const cy = item.box.y + item.box.height / 2
                const edgeX = item.side === 'left' ? item.box.x : item.box.x + item.box.width
                const anchorX = item.side === 'left' ? GUTTER + 140 : size.width - GUTTER - 140
                const bendX = (anchorX + edgeX) / 2
                const isActive = active === item.part.part
                return (
                  <g key={item.part.part}>
                    <polyline
                      points={`${anchorX},${item.labelY} ${bendX},${item.labelY} ${bendX},${cy} ${edgeX},${cy}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 1.25 : 0.75}
                    />
                    <circle cx={edgeX} cy={cy} r="2" fill="currentColor" />
                    {isActive && (
                      <rect
                        x={item.box.x - 4}
                        y={item.box.y - 4}
                        width={item.box.width + 8}
                        height={item.box.height + 8}
                        rx="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            <div aria-hidden className="contents">
              {shown.map((item) => (
                <div
                  key={item.part.part}
                  className={cn(
                    'text-annotation pointer-events-none absolute w-32 -translate-y-1/2',
                    item.side === 'left' ? 'text-right' : 'text-left',
                  )}
                  style={{ top: item.labelY, [item.side]: GUTTER }}
                >
                  <strong className="block text-xs font-medium">{item.part.label}</strong>
                  {item.part.optional && <span className="text-2xs">(Optional)</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {shown.length > 0 && narrow && (
          <div aria-hidden className="contents">
            {shown.map((item) => (
              <span
                key={item.part.part}
                className={cn(
                  'absolute grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-2xs font-bold',
                  active === item.part.part
                    ? 'bg-annotation text-background'
                    : 'bg-annotation-muted text-background',
                )}
                style={{ left: item.box.x + item.box.width / 2, top: item.box.y }}
              >
                {item.index + 1}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 번호 목록. 지시선이 없어도 문서가 성립하는 기본 층이다. */}
      <ol className="flex flex-col gap-2">
        {meta.anatomy.map((part, index) => {
          const isActive = active === part.part
          return (
            <li key={part.part}>
              <button
                type="button"
                onClick={() => setActive(isActive ? null : part.part)}
                aria-pressed={isActive}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-md p-2 text-left',
                  isActive ? 'bg-accent' : 'hover:bg-accent/50',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold',
                    isActive
                      ? 'bg-annotation text-background'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>
                <span>
                  <strong className="text-sm">
                    {part.label}
                    {part.optional && (
                      <span className="text-muted-foreground font-normal"> (Optional)</span>
                    )}
                  </strong>
                  <span className="text-muted-foreground block text-xs">{part.note}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
```

- [ ] **Step 3: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -c -- "--color-annotation" dist/assets/*.css
```
Expected: 첫 grep은 출력 없음, 둘째는 1 이상.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: Anatomy 지시선이 보이지 않던 문제 해결

지시선이 muted-foreground라 미리보기 배경과 구분되지 않았다.
문서 주석 전용 색 토큰을 신설해 컴포넌트 색과 겹치지 않게 한다.
이 토큰은 제품 UI에 쓰지 않는다.

선을 얇게 하고, 부위를 선택하면 나머지를 흐리는 대신 완전히 감춘다.
흐리게 두면 무엇을 가리키는지 흐려진다.

좁은 화면에서는 라벨을 놓을 자리가 없어 지시선이 아예 없었다.
부위 위에 번호 배지를 올려 아래 목록과 잇는다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Properties 표 분리 + Playground 리셋

**Files:**
- Modify: `src/data/registry.ts`, `src/components/docs/Playground.tsx`

**Interfaces:**
- Consumes: `ComponentMeta`, `RenderOptions`
- Produces: 시그니처 변화 없음

- [ ] **Step 1: variant 축을 독립 표로**

`src/data/registry.ts`의 Button `properties` 중 `variant` 축에서 `display`를 `'row'`로 바꾸고 `crossWith` 줄을 제거한다.

```ts
      {
        name: 'variant',
        title: 'Variant',
        description: '동작의 위계와 성격을 정한다. 한 화면의 주요 동작에만 default를 쓴다.',
        display: 'row',
        options: [
```

Task 5의 테스트 `matrix가 아닌 축은 crossWith를 갖지 않는다`가 이를 검증한다. 남겨두면 실패한다.

- [ ] **Step 2: Playground에 리셋 버튼**

`src/components/docs/Playground.tsx`를 수정한다. 파일 상단 import에 `RotateCcw`를 추가한다.

```tsx
import { RotateCcw } from 'lucide-react'
```

초기값 계산을 함수로 빼고 리셋을 추가한다. `useState` 선언 위에 둔다.

```tsx
function initialOptions(meta: ComponentMeta): RenderOptions {
  return Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value]))
}
```

`useState` 초기화를 `useState<RenderOptions>(() => initialOptions(meta))`로 바꾸고, 컨트롤 패널의 `<div className="flex flex-col gap-4 rounded-lg border p-4">` 안 맨 위에 다음을 넣는다.

```tsx
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-2xs font-bold tracking-widest">조합</p>
          <button
            type="button"
            onClick={() => setOptions(initialOptions(meta))}
            disabled={isInitial}
            className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-md px-2 py-1 text-2xs disabled:pointer-events-none disabled:opacity-50"
          >
            <RotateCcw size={12} aria-hidden /> 초기값으로
          </button>
        </div>
```

`isInitial`을 `options` 선언 뒤에 계산한다.

```tsx
  const base = initialOptions(meta)
  const isInitial = meta.properties.every((p) => options[p.name] === base[p.name])
```

`ComponentMeta` 타입 import가 없으면 추가한다.

- [ ] **Step 3: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공. `matrix가 아닌 축은 crossWith를 갖지 않는다` 테스트가 통과해야 한다.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: variant와 size를 각각 독립된 표로 분리, Playground에 리셋 추가

두 축을 교차한 24칸 표는 한 칸이 무엇을 보여주는지 읽기 어려웠다.
축마다 독립된 표로 두어 그 축만 비교하게 한다.

Playground에서 여러 축을 바꾼 뒤 처음으로 돌아갈 방법이 없었다.
초기값과 같은 상태에서는 버튼을 비활성으로 둔다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 4: 예시 화면 — 인프라와 Button 적용

**Files:**
- Create: `src/components/docs/ExampleFrame.tsx`
- Modify: `src/data/registry.ts`, `src/components/docs/GuidelineBlock.tsx`, `src/components/docs/ExampleList.tsx`, `src/components/docs/ComponentPage.tsx`, `src/routes/components/ButtonPage.tsx`
- Test: `src/data/registry.test.ts`

**Interfaces:**
- Produces:
  - `ExampleFrame({ kind, children }: { kind?: 'do' | 'dont' | 'plain'; children: ReactNode })`
  - `type Guideline = { id: string; title: string; body: string; do?: string[]; dont?: string[] }`
  - `type Example = { id: string; title: string; note: string }`
  - `ComponentPageProps`에 `renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode`와 `renderExample?: (exampleId: string) => ReactNode` 추가

**설계 이유:** 예시는 JSX이므로 데이터 파일에 담을 수 없다. 데이터에는 `id`만 두고 렌더링은 페이지가 주입한다 — 전시 컴포넌트가 어떤 컴포넌트인지 몰라야 한다는 원칙을 유지하기 위함이다.

- [ ] **Step 1: 실패하는 테스트 추가**

`src/data/registry.test.ts`에 다음 describe를 추가한다.

```ts
describe('예시 식별자', () => {
  it('guideline의 id가 중복되지 않는다', () => {
    for (const meta of components) {
      const ids = meta.guidelines.map((g) => g.id)
      expect(new Set(ids).size, meta.id).toBe(ids.length)
    }
  })

  it('usage와 cases의 id가 서로 겹치지 않는다', () => {
    for (const meta of components) {
      const ids = [...meta.usage, ...meta.cases].map((e) => e.id)
      expect(new Set(ids).size, meta.id).toBe(ids.length)
    }
  })

  it('모든 id가 kebab-case다', () => {
    for (const meta of components) {
      const ids = [
        ...meta.guidelines.map((g) => g.id),
        ...meta.usage.map((e) => e.id),
        ...meta.cases.map((e) => e.id),
      ]
      for (const id of ids) {
        expect(id, `${meta.id}: ${id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      }
    }
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `Guideline`과 `Example`에 `id`가 없어 `undefined`가 나온다.

- [ ] **Step 3: 타입과 데이터에 id 추가**

`src/data/registry.ts`의 `Guideline`과 `Example` 타입에 `id`를 추가한다.

```ts
export type Guideline = {
  /** 예시 렌더링을 페이지가 주입할 때 쓰는 식별자 */
  id: string
  title: string
  body: string
  do?: string[]
  dont?: string[]
}

export type Example = {
  /** 예시 렌더링을 페이지가 주입할 때 쓰는 식별자 */
  id: string
  title: string
  note: string
}
```

Button 메타의 각 항목에 `id`를 붙인다.

- guidelines: `'hierarchy'`, `'destructive-actions'`, `'buttons-vs-links'`
- usage: `'page-header'`, `'table-row'`, `'confirm-dialog'`, `'empty-state'`
- cases: `'long-label'`, `'icon-only'`, `'no-permission'`, `'in-progress'`, `'narrow-screen'`

- [ ] **Step 4: ExampleFrame 작성**

Create `src/components/docs/ExampleFrame.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const KIND_LABEL = {
  do: 'DO',
  dont: "DON'T",
} as const

export function ExampleFrame({
  kind = 'plain',
  children,
}: {
  kind?: 'do' | 'dont' | 'plain'
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {kind !== 'plain' && (
        <p
          className={cn(
            'flex items-center gap-1.5 border-b px-3 py-2 text-2xs font-bold tracking-widest',
            kind === 'do' ? 'text-success' : 'text-destructive',
          )}
        >
          {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
          {KIND_LABEL[kind]}
        </p>
      )}
      <div className="bg-surface-raised p-4">{children}</div>
    </div>
  )
}
```

- [ ] **Step 5: GuidelineBlock에 예시 슬롯**

Rewrite `src/components/docs/GuidelineBlock.tsx`:

```tsx
import type { ReactNode } from 'react'
import { DoDont } from '@/components/docs/DoDont'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Guideline } from '@/data/registry'

export function GuidelineBlock({
  guideline,
  renderExample,
}: {
  guideline: Guideline
  renderExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
}) {
  const doExample = renderExample?.(guideline.id, 'do')
  const dontExample = renderExample?.(guideline.id, 'dont')

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <div>
        <h3 className="text-sm font-semibold">{guideline.title}</h3>
        <p className="text-muted-foreground mt-1 text-xs">{guideline.body}</p>
      </div>

      {(doExample || dontExample) && (
        <div className="grid gap-3 md:grid-cols-2">
          {doExample && <ExampleFrame kind="do">{doExample}</ExampleFrame>}
          {dontExample && <ExampleFrame kind="dont">{dontExample}</ExampleFrame>}
        </div>
      )}

      {(guideline.do || guideline.dont) && (
        <DoDont do={guideline.do ?? []} dont={guideline.dont ?? []} />
      )}
    </section>
  )
}
```

- [ ] **Step 6: ExampleList에 예시 슬롯**

Rewrite `src/components/docs/ExampleList.tsx`:

```tsx
import type { ReactNode } from 'react'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Example } from '@/data/registry'

export function ExampleList({
  examples,
  renderExample,
}: {
  examples: Example[]
  renderExample?: (exampleId: string) => ReactNode
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {examples.map((example) => {
        const node = renderExample?.(example.id)
        return (
          <li key={example.id} className="flex flex-col gap-2">
            <div>
              <strong className="text-sm">{example.title}</strong>
              <p className="text-muted-foreground mt-1 text-xs">{example.note}</p>
            </div>
            {node && <ExampleFrame>{node}</ExampleFrame>}
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 7: ComponentPage에 콜백 전달**

`src/components/docs/ComponentPage.tsx`의 `ComponentPageProps`에 두 콜백을 추가하고, `GuidelineBlock`과 두 `ExampleList`에 넘긴다.

```tsx
  /** guideline의 do/don't 예시를 주입한다 */
  renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
  /** usage·cases 항목의 예시를 주입한다 */
  renderExample?: (exampleId: string) => ReactNode
```

```tsx
          {meta.guidelines.map((guideline) => (
            <GuidelineBlock
              key={guideline.id}
              guideline={guideline}
              renderExample={renderGuidelineExample}
            />
          ))}
```

```tsx
      <DocSection title="Usage">
        <ExampleList examples={meta.usage} renderExample={renderExample} />
      </DocSection>

      <DocSection title="Cases">
        <ExampleList examples={meta.cases} renderExample={renderExample} />
      </DocSection>
```

- [ ] **Step 8: ButtonPage에 예시 조합 주입**

`src/routes/components/ButtonPage.tsx`에 두 렌더 함수를 추가하고 `ComponentPage`에 넘긴다. **실제 `Button`과 시스템 유틸리티만 써서 어드민 화면의 한 조각처럼 만든다.** 목업 박스를 그리지 말고 실물을 조합한다.

각 예시가 담아야 할 내용:

| id | do | don't |
|---|---|---|
| `hierarchy` | 페이지 헤더 한 줄 — 제목 + `outline` 취소 + `default` 저장 하나 | 같은 자리에 `default` 버튼 셋 |
| `destructive-actions` | 다이얼로그 하단 — `ghost` 취소 + `destructive` '삭제' | 같은 자리에 `default` '확인' |
| `buttons-vs-links` | 문장 안에서 `link` variant로 이동, 실행은 `default` 버튼 | 이동을 `default` 버튼으로 |

| id | 내용 |
|---|---|
| `page-header` | 제목·설명 왼쪽, `default` '사용자 추가' 오른쪽 |
| `table-row` | 표 한 행 흉내 — 이름 + `sm ghost` 아이콘 버튼 두 개(`aria-label` 필수) |
| `confirm-dialog` | 제목 + 본문 + 오른쪽 정렬 `ghost` 취소 / `destructive` 삭제 |
| `empty-state` | 가운데 정렬 안내 문구 + `lg` '첫 사용자 초대' |
| `long-label` | 좁은 컨테이너 안에서 긴 라벨 버튼이 줄바꿈 없이 늘어남 |
| `icon-only` | `size="icon"` 버튼 + 그 옆에 `aria-label` 값을 보여주는 설명 |
| `no-permission` | `disabled` 버튼 + 아래 이유 문구 |
| `in-progress` | `disabled` + `Loader2` 스피너 + '저장 중' |
| `narrow-screen` | 좁은 컨테이너에서 `w-full` 버튼 하나 |

문구는 Writing 규칙을 따른다 — 버튼 라벨은 동사로 시작하고 결과를 말한다, 느낌표·물음표를 쓰지 않는다, 확인 다이얼로그 제목은 명사구.

```tsx
    <ComponentPage
      meta={meta}
      render={renderButton}
      preview={/* 기존 그대로 */}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
```

- [ ] **Step 9: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 새 registry 테스트 3개가 통과해야 한다.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 10: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Guidelines·Usage·Cases에 실제 컴포넌트로 만든 예시 추가

텍스트만으로는 "주요 동작은 하나"가 화면에서 어떤 모습인지 알 수 없었다.
목업 대신 실제 Button을 조합해 어드민 화면의 한 조각으로 보여준다.
실물이므로 토큰을 바꾸면 예시도 따라오고 설명과 어긋나지 않는다.

예시는 JSX라 데이터에 담을 수 없으므로 registry에는 식별자만 두고
렌더링은 페이지가 콜백으로 주입한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Foundations 공통 — 개요 섹션과 카드 높이

**Files:**
- Modify: `src/routes/foundations/ColorPage.tsx`, `TypographyPage.tsx`, `SpacingPage.tsx`, `IconographyPage.tsx`, `StatePage.tsx`, `VoiceAndTonePage.tsx`, `WritingPage.tsx`, `FoundationsOverview.tsx`

**Interfaces:** 변화 없음

- [ ] **Step 1: 각 페이지에 개요 섹션 추가**

Overview를 제외한 7개 Foundations 페이지의 **첫 섹션**으로 개요를 넣는다. `DocSection title="개요"`를 쓰고, 본문은 2~3문장으로 다음을 답한다.

1. 이 문서가 무엇을 정하는가
2. 무엇을 정하지 않는가 (다른 문서의 몫)
3. 언제 이 문서를 보는가

각 페이지가 이미 `DocPage`의 `description`을 갖고 있다. **개요는 그 요약을 되풀이하지 말고 범위와 경계를 말한다.** 예를 들어 Color의 개요는 "역할 이름으로 색을 쓰는 규칙을 정합니다. 개별 색상값의 원본은 Palette에서, 역할 사이의 위계는 Color Role에서 다룹니다. 새 색이 필요하다고 느낄 때 먼저 이 문서에서 맞는 역할이 있는지 봅니다." 정도.

7개 페이지 각각에 대해 그 페이지의 실제 범위에 맞게 쓴다. 다른 페이지 이름을 언급할 때는 실제로 존재하는 문서만 가리킨다 (Design Token · Color · Color Role · Palette · Typography · Spacing · Iconography · State · Voice and Tone · Writing).

- [ ] **Step 2: Overview 카드 높이 균일**

`src/routes/foundations/FoundationsOverview.tsx`의 카드가 같은 행에서 높이가 다르다. `<li>`에 `h-full`을, `<Link>`에도 `h-full`과 `flex flex-col`을 준다.

```tsx
        {pages.map((page) => (
          <li key={page.to} className="h-full">
            <Link
              to={page.to}
              className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
            >
              <strong className="text-sm">{page.label}</strong>
              <p className="text-muted-foreground mt-1 text-xs">{NOTES[page.to]}</p>
            </Link>
          </li>
        ))}
```

`NOTES` 상수에 새 세 페이지의 설명을 추가한다.

```ts
  '/foundations/design-token': '토큰의 층과 이름 규칙, 전체 목록',
  '/foundations/color-role': '역할 사이의 위계와 짝',
  '/foundations/palette': '원시 색 스케일과 시맨틱 연결',
```

- [ ] **Step 3: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Foundations 각 문서에 개요 추가, Overview 카드 높이 균일

문서에 들어와서 이것이 무엇을 정하고 무엇을 정하지 않는지 먼저 알 수 있어야
다른 문서를 헛되이 찾지 않는다. 개요는 설명을 되풀이하지 않고 범위와 경계를 말한다.

Overview 카드가 설명 길이에 따라 높이가 달라 행이 어긋나 보였다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Design Token 페이지

**Files:**
- Create: `src/components/docs/CopyValue.tsx`, `src/routes/foundations/DesignTokenPage.tsx`
- Modify: `src/routes/routes.tsx`, `src/components/docs/TokenTable.tsx`

**Interfaces:**
- Produces: `CopyValue({ value, className }: { value: string; className?: string })`

- [ ] **Step 1: CopyValue 작성**

Create `src/components/docs/CopyValue.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 값을 보여주고 마우스를 올리면 복사 아이콘을 띄운다.
 * 누르면 아이콘이 체크로 바뀌고 2초 뒤 되돌아온다.
 */
export function CopyValue({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      /* 클립보드를 쓸 수 없는 환경에서는 조용히 넘어간다 */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${value} 복사됨` : `${value} 복사`}
      className={cn(
        'group hover:bg-accent flex items-center gap-1.5 rounded px-1.5 py-0.5 text-left',
        className,
      )}
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <Check size={12} className="text-success shrink-0" aria-hidden />
      ) : (
        <Copy
          size={12}
          className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  )
}
```

- [ ] **Step 2: TokenTable의 값 칸을 CopyValue로**

`src/components/docs/TokenTable.tsx`에서 값 셀과 CSS 변수 셀을 `CopyValue`로 감싼다. 값이 비어 있으면 `(정의되지 않음)`을 그대로 텍스트로 둔다 — 복사할 것이 없기 때문이다.

- [ ] **Step 3: DesignTokenPage 작성**

Create `src/routes/foundations/DesignTokenPage.tsx`. `tokens.css`를 `?raw`로 읽어 접두사별로 파싱한다.

섹션 구성:

1. **개요** — 이 문서가 토큰의 층과 이름 규칙을 정하고, 개별 색의 선택은 Color·Palette가 다룬다는 것
2. **세 개의 층** — 원시 팔레트(Tailwind 스케일) → 시맨틱 역할(`--primary`, `--destructive`) → 컴포넌트 사용(`bg-primary`). 왜 컴포넌트가 원시 값을 직접 쓰면 안 되는지 한 문단
3. **이름 규칙** — 표로 정리한다

   | 형태 | 뜻 | 예 |
   |---|---|---|
   | `--color-<역할>` | 그 역할의 배경 또는 주색 | `--color-primary` |
   | `--color-<역할>-foreground` | 그 배경 위에 놓이는 글자색 | `--color-primary-foreground` |
   | `--spacing-<축>` | 밀도 축의 고정 높이 | `--spacing-control` |
   | `--radius-<크기>` | 모서리 단계 | `--radius-md` |
   | `--shadow-<용도>` | 그림자 단계 | `--shadow-card` |
   | `--z-index-<레이어>` | 쌓임 순서 | `--z-index-drawer` |
   | `--text-<크기>` | 글자 크기 | `--text-2xs` |

   `-foreground` 짝 규칙을 강조한다 — 배경 토큰을 쓰면 그 짝을 글자색으로 쓴다.
4. **전체 토큰** — 접두사별로 `TokenTable`을 하나씩. `--color-` / `--radius-` / `--spacing-` / `--shadow-` / `--z-index-` / `--text-` 여섯 개. 각 표 앞에 그 접두사가 무엇인지 한 줄
5. **사용 규칙** — `DoDont`

- [ ] **Step 4: 라우트 연결**

`src/routes/routes.tsx`에서 `foundations/design-token`의 `Placeholder`를 `DesignTokenPage`로 교체한다.

- [ ] **Step 5: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Design Token 문서와 값 복사 추가

토큰이 어떤 층으로 나뉘고 이름이 무엇을 뜻하는지 적어둔 곳이 없었다.
새 토큰을 만들 때마다 기존 이름을 뒤져 유추해야 했다.

전체 토큰 목록은 tokens.css를 파싱해 실측값과 함께 나열하므로
토큰을 더하면 문서가 따라온다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 7: Color 확장 — hex 변환 · Color Role · Palette

**Files:**
- Create: `src/lib/color.ts`, `src/routes/foundations/ColorRolePage.tsx`, `src/routes/foundations/PalettePage.tsx`
- Modify: `src/components/docs/Swatch.tsx`, `src/routes/foundations/ColorPage.tsx`, `src/routes/routes.tsx`
- Test: `src/lib/color.test.ts`

**Interfaces:**
- Produces:
  - `rgbToHex(r: number, g: number, b: number): string` — 채널 세 개를 `#rrggbb`로. 순수 함수이며 테스트 대상
  - `toHex(color: string): string` — 계산된 색 문자열을 `#rrggbb`로. 변환할 수 없으면 빈 문자열. `document`가 필요해 테스트하지 않는다

- [ ] **Step 1: 실패하는 테스트 작성**

`toHex`는 canvas가 필요해 `node` 환경에서 돌지 않는다. **순수한 부분만 분리해 테스트한다** — RGB 삼원색을 hex 문자열로 만드는 부분이다.

Create `src/lib/color.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { rgbToHex } from '@/lib/color'

describe('rgbToHex', () => {
  it('세 채널을 여섯 자리 hex로 만든다', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
  })

  it('한 자리 값을 0으로 채운다', () => {
    expect(rgbToHex(1, 2, 3)).toBe('#010203')
  })

  it('범위를 벗어난 값을 자른다', () => {
    expect(rgbToHex(-10, 300, 128)).toBe('#00ff80')
  })

  it('소수를 반올림한다', () => {
    expect(rgbToHex(127.6, 0, 0)).toBe('#800000')
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `@/lib/color`를 찾지 못한다.

- [ ] **Step 3: color 유틸 구현**

Create `src/lib/color.ts`:

```ts
/** 0~255 채널 세 개를 #rrggbb로 만든다. 범위를 벗어나면 자르고 소수는 반올림한다. */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)))
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`
}

/**
 * 계산된 색 문자열을 hex로 바꾼다.
 * oklch 같은 색 공간 변환을 직접 구현하지 않고, 브라우저가 이미 하는 계산을 빌린다 —
 * 1×1 canvas에 그 색을 칠하고 픽셀을 읽는다.
 * 변환할 수 없으면 빈 문자열을 돌려준다.
 */
export function toHex(color: string): string {
  if (!color) return ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return ''
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    /* 브라우저가 해석하지 못한 색은 칠해지지 않아 알파가 0으로 남는다 */
    if (a === 0) return ''
    return rgbToHex(r, g, b)
  } catch {
    return ''
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — `rgbToHex` 4개 추가.

- [ ] **Step 5: Swatch에 hex와 복사 추가**

`src/components/docs/Swatch.tsx`를 수정한다. 색 견본 아래에 토큰 이름, CSS 변수, 실측값, hex를 두고 각각을 `CopyValue`로 복사할 수 있게 한다.

hex는 `useEffect`에서 `toHex(row.value)`로 계산한다 — `toHex`가 `document`를 쓰므로 렌더 중에 부르지 않는다. 테마가 바뀌면 `row.value`가 바뀌므로 그것을 의존성에 둔다.

```tsx
  const [hex, setHex] = useState('')
  useEffect(() => {
    setHex(toHex(row.value))
  }, [row.value])
```

- [ ] **Step 6: ColorRolePage 작성**

Create `src/routes/foundations/ColorRolePage.tsx`.

섹션 구성:

1. **개요** — 역할 사이의 위계를 정한다. 개별 값은 Palette, 사용 규칙은 Color가 다룬다
2. **다섯 갈래** — 표면 / 전경 / 강조 / 상태 / 선. 각 갈래마다 어떤 토큰이 속하고, 언제 쓰는지, 짝(`-foreground`)이 있는지
3. **위계** — 표면이 층을 이루는 순서(`background` → `surface` → `surface-raised` → `popover`)와 그 위에 얹히는 전경. 실제 색 견본을 겹쳐 층을 눈으로 보여준다
4. **짝 규칙** — 배경 토큰을 쓰면 그 짝을 글자색으로 쓴다. `bg-primary` 위에는 `text-primary-foreground`. 짝을 어겼을 때 대비가 무너지는 예시를 `ExampleFrame`으로
5. **상태 색의 뜻** — `success` / `warning` / `info` / `destructive`가 각각 언제 쓰이는지. 장식으로 쓰지 않는다는 규칙
6. **사용 규칙** — `DoDont`

- [ ] **Step 7: PalettePage 작성**

Create `src/routes/foundations/PalettePage.tsx`.

Tailwind v4의 기본 팔레트를 계층으로 나열한다. 색상값을 손으로 적지 않고 **Tailwind 유틸리티 클래스로 칠한 뒤 실측한다** — `bg-neutral-500` 같은 클래스를 준 요소의 계산된 배경색을 읽어 hex로 바꾼다.

```ts
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const HUES = ['neutral', 'red', 'amber', 'emerald', 'blue']
```

Tailwind는 사용된 클래스만 생성하므로, `bg-${hue}-${step}` 형태의 동적 클래스는 만들어지지 않는다. **클래스 이름을 문자열로 조합하지 말고 전체 목록을 정적으로 나열한다.**

```tsx
/** Tailwind는 소스에 그대로 등장한 클래스만 생성한다. 동적 조합은 만들어지지 않는다 */
const PALETTE: { hue: string; steps: { step: string; className: string }[] }[] = [
  {
    hue: 'neutral',
    steps: [
      { step: '50', className: 'bg-neutral-50' },
      { step: '100', className: 'bg-neutral-100' },
      // … 950까지
    ],
  },
  // red · amber · emerald · blue 동일
]
```

섹션 구성:

1. **개요** — 원시 색의 원본. 컴포넌트가 여기를 직접 쓰지 않고 시맨틱 토큰을 거친다는 것
2. **스케일** — hue마다 한 줄. 각 칸에 단계 번호와 hex, `CopyValue`로 복사 가능
3. **시맨틱 연결** — 현재 시맨틱 토큰이 어느 원시 값에 가장 가까운지 표로. 실측 hex를 비교해 자동으로 찾는다. 가장 가까운 값을 찾는 계산은 `src/lib/color.ts`에 두지 말고 이 페이지 안에 둔다 (한 곳에서만 쓰므로)
4. **사용 규칙** — 원시 색을 컴포넌트에 직접 쓰지 않는다

- [ ] **Step 8: ColorPage에 개요와 다른 문서 연결**

`ColorPage`의 첫 섹션에 개요를 넣고(Task 5에서 이미 했다면 그대로), Color Role과 Palette로 가는 링크를 본문에 자연스럽게 둔다.

- [ ] **Step 9: 라우트 연결**

`src/routes/routes.tsx`에서 `foundations/color-role`과 `foundations/palette`의 `Placeholder`를 실제 페이지로 교체한다.

- [ ] **Step 10: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -c "bg-neutral-500" dist/assets/*.css
```
Expected: 첫 grep은 출력 없음, 둘째는 1 이상 (팔레트 클래스가 실제로 생성됐다는 증거).

- [ ] **Step 11: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Color Role과 Palette 문서 추가, 값 복사 지원

색이 어떤 위계로 정리되는지, 시맨틱 토큰이 어느 원시 값을 가리키는지
확인할 곳이 없었다. Palette에서 원시 스케일을, Color Role에서 역할 사이의
관계를 다루고 Color는 사용 규칙에 집중한다.

oklch 값을 hex로 보여주기 위해 색 공간 변환을 직접 구현하지 않고
브라우저가 이미 하는 계산을 canvas로 빌린다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Typography 확장 — Pretendard · 표 · 복사 · 줄바꿈

**Files:**
- Modify: `src/styles/tokens.css`, `src/routes/foundations/TypographyPage.tsx`, `index.html`

**Interfaces:** 변화 없음

- [ ] **Step 1: Pretendard 적용**

`index.html`의 `<head>`에 가변 폰트를 불러온다.

```html
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
    />
```

`src/styles/tokens.css`의 `@theme inline` 블록에 폰트 스택을 추가한다.

```css
  --font-sans:
    'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic',
    sans-serif;
```

`@layer base`의 `body`에 폰트와 줄바꿈 규칙을 추가한다.

```css
  body {
    font-family: var(--font-sans);
    /* 한글은 음절 단위로 줄바꿈한다. 어절 단위로 묶으면 좁은 화면에서 한 줄이 크게 빈다 */
    word-break: normal;
    overflow-wrap: anywhere;
  }
```

기존 `body` 선언에 이어 붙인다. 기존 속성을 지우지 않는다.

- [ ] **Step 2: TypographyPage 재작성**

`src/routes/foundations/TypographyPage.tsx`의 섹션 구성:

1. **개요** — 이 문서가 크기 스케일과 위계 규칙을 정한다는 것
2. **폰트** — Pretendard를 쓰는 이유(한글 자소 균형, 가변 폰트로 굵기 단계가 매끄러움)와 폴백 스택의 순서가 뜻하는 것. **폰트 스택 복사 영역** — `<textarea readOnly>`에 실제 `font-family` 선언을 담고, 위에 `CopyValue`나 복사 버튼을 둔다. 값은 `getComputedStyle(document.body).fontFamily`로 실측해 문서와 실제가 어긋나지 않게 한다
3. **크기 스케일** — 표로. **큰 것에서 작은 것 순**으로 위에서 아래. 열은 다음과 같다

   | 열 | 내용 |
   |---|---|
   | 스타일 | `text-2xl` 등 클래스 이름 |
   | 예시 | 그 클래스를 적용한 실제 텍스트 |
   | 크기 | 실측 `font-size` |
   | 행간 | 실측 `line-height` |
   | 자간 | 실측 `letter-spacing` |
   | 용도 | 어디에 쓰는지 |

   크기·행간·자간은 손으로 적지 않고 **숨긴 측정용 요소에 클래스를 주고 `getComputedStyle`로 읽는다.** 정렬은 실측한 `font-size` 내림차순으로 한다
4. **굵기** — 4단계와 각각의 용도
5. **줄바꿈** — 한글 음절 단위 줄바꿈 규칙과 그 이유. 좁은 컨테이너에 같은 문장을 두 규칙으로 나란히 렌더링해 차이를 보여준다
6. **사용 가이드라인** — 위계는 크기보다 굵기와 색으로, 한 화면의 크기 단계는 4개 이하, 숫자 데이터는 크기를 맞춘다 등. `DoDont`와 `ExampleFrame` 예시

- [ ] **Step 3: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -c "Pretendard" dist/assets/*.css
```
Expected: 첫 grep은 출력 없음, 둘째는 1 이상.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Pretendard 적용과 Typography 문서 확장

시스템 기본 폰트를 쓰고 있어 한글 자소 균형이 기기마다 달랐다.
Pretendard 가변 폰트를 기본으로 두고 시스템 스택을 폴백으로 남긴다.

크기·행간·자간은 손으로 적지 않고 실측한다. 정렬도 실측한 크기를 따르므로
스케일을 바꾸면 표의 순서까지 따라온다.

한글 줄바꿈을 음절 단위로 고정한다. 어절 단위로 묶으면 좁은 화면에서
한 줄이 크게 비는 구간이 생긴다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다. 컨트롤러가 다음을 확인한다.

1. Anatomy 지시선이 컴포넌트와 구분되는 색으로 보인다
2. 번호를 클릭하면 그 부위 하나만 남고 나머지 지시선·라벨이 사라진다
3. 375px에서 부위 위 번호 배지가 보이고 아래 목록과 대응한다
4. Variant와 Size가 각각 독립된 표다
5. Playground 리셋 버튼이 동작하고 초기 상태에서 비활성이다
6. Guidelines의 do/don't와 Usage·Cases의 각 항목에 실제 컴포넌트 예시가 붙는다
7. 모든 문서 하단에 최종 수정일이 있고, 이전/다음이 같은 섹션 안에서만 이동한다
8. Overview 페이지에는 이전/다음이 없다
9. Foundations의 Overview를 제외한 모든 페이지에 개요 섹션이 있고, Overview 카드 높이가 균일하다
10. Design Token · Color Role · Palette 페이지가 LNB에서 이동된다
11. 토큰 값에 마우스를 올리면 복사 아이콘이 나오고, 누르면 체크로 바뀌며 복사된다
12. Typography가 Pretendard로 렌더되고, 폰트 스택을 복사할 수 있으며, 표가 큰 것에서 작은 것 순이다
13. 다크 모드와 720px에서 모든 페이지가 읽힌다

## v0.4.0 완료 기준

- [ ] 위 13개 항목을 모두 통과한다
- [ ] `registry.ts`의 `variant` 축에 `crossWith`가 없다
- [ ] 화면에 나오는 목록·순서·값·날짜 중 손으로 적힌 것이 없다 (네비게이션은 `nav-config`, 토큰은 실측, hex는 canvas 변환)
- [ ] 임의 값 대괄호 표기가 없다
- [ ] `npm test`와 `npm run build`가 통과한다

## v0.4.0 범위 밖

- 나머지 Foundations 피드백 (사용자가 이후 전달 예정)
- 프리미티브 확장 (Badge · Input · Label · Card · Select · Checkbox · Switch · Dialog · Toast)
- 컴포넌트 페이지의 History 섹션
- 알림 벨 UI
- Updates 페이지의 실제 Changelog 렌더링
- Get started · Patterns의 상세 문서
- 어드민 패턴 (PageHeader · FilterBar · DataTable · EmptyState · ConfirmDialog)
- 빠른 검색(⌘K)
