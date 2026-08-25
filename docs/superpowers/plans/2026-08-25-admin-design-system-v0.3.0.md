# 어드민 디자인 시스템 워크벤치 v0.3.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GNB+LNB 2단 네비게이션과 property 축 기반 컴포넌트 문서 포맷을 갖춘 문서 사이트로 만들고, Foundations 8개를 먼저 완성한다.

**Architecture:** 네비게이션 설정 한 파일이 GNB·LNB·하단 이전/다음 순서의 단일 출처가 된다. Foundations의 Color/Typography/Spacing은 `getComputedStyle`로 `tokens.css`를 런타임 실측해 그리므로 값을 두 곳에 적지 않는다. 컴포넌트 메타의 평면 배열(`variants`/`sizes`/`states`)을 property 축 목록으로 바꿔, 축이 하나인 컴포넌트에서 빈 표가 나오지 않게 한다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui, react-router v8.3.0, lucide-react, Vitest

**Spec:** `docs/superpowers/specs/2026-08-25-admin-design-system-v0.3.0-design.md`

## Global Constraints

- 작업 브랜치는 `v0.3.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. `src/styles/tokens.css`의 토큰 유틸리티만 쓴다. 임의 값 대괄호 표기(`[3px]`, `[#abc]`)도 금지. 단, `[&_svg]:size-4` 같은 임의 **셀렉터** 변형은 값이 아니므로 허용된다.
- 비주얼은 shadcn 기본 톤(neutral). 브랜드 색을 임의로 넣지 않는다.
- **화면에 나오는 목록·순서·숫자를 손으로 적지 않는다.** 네비게이션 순서는 `nav-config.ts`에서, 컴포넌트 수는 `registry.ts`에서, 토큰 값은 `tokens.css` 실측에서 온다.
- 전시 컴포넌트(`components/docs/*`)는 어떤 컴포넌트를 그리는지 몰라야 한다. 구체적 UI 컴포넌트를 import하지 않고 `render` 콜백으로 주입받는다.
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다 — 이 프로젝트의 UI 검증 수단은 전시 페이지 그 자체다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다. TypeScript 6에서 `TS5101` 하드에러다. `paths`만 쓴다.
- shadcn CLI는 이 환경에서 동작하지 않는다 (v4.19.0, 대화형 프롬프트 우회 불가). 컴포넌트가 필요하면 수동으로 작성한다.
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사.

---

## File Structure

### 생성

| 파일 | 책임 |
|---|---|
| `src/components/layout/Gnb.tsx` | 상단 전역 네비게이션 + 테마 토글 |
| `src/components/layout/Lnb.tsx` | 현재 섹션의 좌측 문서 목록 |
| `src/components/layout/DocFooterNav.tsx` | 이전/다음 문서 |
| `src/components/docs/DocPage.tsx` | 산문 문서용 틀 (제목·본문·하단 네비) |
| `src/components/docs/DoDont.tsx` | Do/Don't 두 열 블록 |
| `src/components/docs/TokenTable.tsx` | 실측 토큰 값 표 |
| `src/components/docs/Swatch.tsx` | 색 견본 + 실측값 |
| `src/components/docs/Playground.tsx` | property 축 조합 컨트롤 |
| `src/components/docs/PropertyBlock.tsx` | 축 하나를 전시 |
| `src/components/docs/GuidelineBlock.tsx` | 이름 붙은 지침 |
| `src/lib/tokens.ts` | `getComputedStyle` 기반 토큰 읽기 |
| `src/routes/get-started/*.tsx` | Overview, 설치, 원칙 |
| `src/routes/foundations/*.tsx` | 8개 |
| `src/routes/updates/UpdatesOverview.tsx` | Changelog |
| `src/routes/patterns/PatternsOverview.tsx` | 준비 중 |

### 교체

| 파일 | 변경 |
|---|---|
| `src/components/layout/nav-config.ts` | GNB/LNB 2단 + 선형 순서 파생 + 조회 함수 |
| `src/components/layout/AppShell.tsx` | GNB + LNB + 콘텐츠 + 하단 네비 |
| `src/components/docs/Anatomy.tsx` | 지시선 자동 생성 + 번호 클릭 하이라이트 |
| `src/components/docs/ComponentPage.tsx` | 새 섹션 구성 |
| `src/data/registry.ts` | `ComponentMeta` 재설계 |
| `src/routes/router.tsx` | 라우트 재배치 |
| `src/routes/components/ButtonPage.tsx` | 새 포맷으로 재조립 |
| `src/routes/components/ComponentsIndex.tsx` | Components Overview로 |

### 삭제

`src/components/layout/Sidebar.tsx` (→ `Lnb.tsx`), `src/components/docs/VariantGrid.tsx`, `src/components/docs/StateGrid.tsx` (→ `PropertyBlock.tsx`)

---

## Task 1: 네비게이션 개편 — GNB / LNB / 하단 네비

**Files:**
- Replace: `src/components/layout/nav-config.ts`
- Create: `src/components/layout/Gnb.tsx`, `Lnb.tsx`, `DocFooterNav.tsx`
- Modify: `src/components/layout/AppShell.tsx`, `src/routes/router.tsx`
- Delete: `src/components/layout/Sidebar.tsx`
- Test: `src/components/layout/nav-config.test.ts`

**Interfaces:**
- Consumes: `Placeholder({ title })`, `useTheme()`, `cn()`
- Produces:
  - `type DocLink = { to: string; label: string }`
  - `type NavSection = { id: string; label: string; to: string; items: DocLink[] }`
  - `sections: NavSection[]`
  - `docOrder: DocLink[]` — LNB 순서를 평탄화한 선형 목록
  - `findSection(pathname: string): NavSection`
  - `findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink }`
  - `Gnb({ onMenuClick }: { onMenuClick: () => void })`
  - `Lnb({ open, onClose }: { open: boolean; onClose: () => void })`
  - `DocFooterNav()`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/components/layout/nav-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { docOrder, findAdjacent, findSection, sections } from '@/components/layout/nav-config'

describe('sections', () => {
  it('모든 섹션의 첫 LNB 항목은 Overview다', () => {
    for (const section of sections) {
      expect(section.items[0].label).toBe('Overview')
    }
  })

  it('섹션의 진입 경로는 자기 Overview와 같다', () => {
    for (const section of sections) {
      expect(section.to).toBe(section.items[0].to)
    }
  })

  it('경로가 중복되지 않는다', () => {
    const paths = docOrder.map((d) => d.to)
    expect(new Set(paths).size).toBe(paths.length)
  })
})

describe('docOrder', () => {
  it('모든 섹션의 항목을 LNB 순서대로 이어붙인다', () => {
    expect(docOrder.length).toBe(sections.reduce((n, s) => n + s.items.length, 0))
    expect(docOrder[0]).toBe(sections[0].items[0])
  })
})

describe('findSection', () => {
  it('섹션 진입 경로를 그 섹션으로 해석한다', () => {
    expect(findSection('/foundations').id).toBe('foundations')
  })

  it('하위 문서 경로를 그 섹션으로 해석한다', () => {
    expect(findSection('/foundations/color').id).toBe('foundations')
    expect(findSection('/components/button').id).toBe('components')
  })

  it('루트는 첫 섹션이다', () => {
    expect(findSection('/').id).toBe(sections[0].id)
  })

  it('알 수 없는 경로는 첫 섹션으로 떨어진다', () => {
    expect(findSection('/nope/nope').id).toBe(sections[0].id)
  })
})

describe('findAdjacent', () => {
  it('첫 문서에는 이전이 없다', () => {
    expect(findAdjacent(docOrder[0].to).prev).toBeUndefined()
    expect(findAdjacent(docOrder[0].to).next).toBe(docOrder[1])
  })

  it('마지막 문서에는 다음이 없다', () => {
    const last = docOrder[docOrder.length - 1]
    expect(findAdjacent(last.to).next).toBeUndefined()
    expect(findAdjacent(last.to).prev).toBe(docOrder[docOrder.length - 2])
  })

  it('섹션 경계를 넘어 이어진다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const lastOfFoundations = foundations.items[foundations.items.length - 1]
    const next = findAdjacent(lastOfFoundations.to).next
    expect(next).toBeDefined()
    expect(findSection(next!.to).id).not.toBe('foundations')
  })

  it('목록에 없는 경로는 양쪽 모두 없다', () => {
    expect(findAdjacent('/nope')).toEqual({ prev: undefined, next: undefined })
  })
})

describe('라우트와 네비게이션의 일치', () => {
  it('LNB의 모든 경로가 라우터에 등록되어 있다', async () => {
    const { registeredPaths } = await import('@/routes/router')
    for (const doc of docOrder) {
      expect(registeredPaths, `${doc.to} 라우트 누락`).toContain(doc.to)
    }
  })

  it('라우터에 LNB에 없는 문서 경로가 있지 않다', async () => {
    const { registeredPaths } = await import('@/routes/router')
    const navPaths = new Set(docOrder.map((d) => d.to))
    for (const path of registeredPaths) {
      expect(navPaths, `${path}가 LNB에 없다`).toContain(path)
    }
  })
})
```

마지막 두 테스트가 이 계획의 안전장치다. 최종 리뷰가 v0.2.0에서 지적한 대로,
라우트 목록과 네비게이션 목록이 두 곳에 손으로 적히면 Foundations 8개가 들어오는 순간
반드시 어긋난다. 사람이 맞추는 대신 테스트가 어긋남을 잡는다.

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `docOrder`, `findSection`, `findAdjacent`가 export되지 않아 import 에러.

- [ ] **Step 3: nav-config 전면 교체**

Rewrite `src/components/layout/nav-config.ts`:

```ts
export type DocLink = {
  to: string
  label: string
}

export type NavSection = {
  id: string
  /** GNB에 표시되는 이름 */
  label: string
  /** 섹션 진입 경로. 자기 Overview와 같다 */
  to: string
  /** LNB 목록. 첫 항목은 항상 Overview */
  items: DocLink[]
}

export const sections: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get started',
    to: '/',
    items: [
      { to: '/', label: 'Overview' },
      { to: '/get-started/install', label: '설치' },
      { to: '/get-started/principles', label: '원칙' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    to: '/foundations',
    items: [
      { to: '/foundations', label: 'Overview' },
      { to: '/foundations/color', label: 'Color' },
      { to: '/foundations/typography', label: 'Typography' },
      { to: '/foundations/spacing', label: 'Spacing' },
      { to: '/foundations/iconography', label: 'Iconography' },
      { to: '/foundations/state', label: 'State' },
      { to: '/foundations/voice-and-tone', label: 'Voice and Tone' },
      { to: '/foundations/writing', label: 'Writing' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    to: '/components',
    items: [
      { to: '/components', label: 'Overview' },
      { to: '/components/button', label: 'Button' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    to: '/patterns',
    items: [{ to: '/patterns', label: 'Overview' }],
  },
  {
    id: 'updates',
    label: 'Updates',
    to: '/updates',
    items: [{ to: '/updates', label: 'Overview' }],
  },
]

/**
 * LNB 순서를 평탄화한 선형 문서 목록.
 * 페이지 하단의 이전/다음이 여기서 나오며, 섹션 경계를 넘어 이어진다.
 */
export const docOrder: DocLink[] = sections.flatMap((section) => section.items)

/**
 * 현재 경로가 속한 섹션.
 * 첫 섹션(Get started)은 루트를 쓰므로 다른 섹션을 먼저 확인하고, 없으면 첫 섹션으로 떨어진다.
 */
export function findSection(pathname: string): NavSection {
  const match = sections
    .slice(1)
    .find((section) => pathname === section.to || pathname.startsWith(`${section.to}/`))
  return match ?? sections[0]
}

export function findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink } {
  const index = docOrder.findIndex((doc) => doc.to === pathname)
  if (index === -1) return { prev: undefined, next: undefined }
  return {
    prev: index > 0 ? docOrder[index - 1] : undefined,
    next: index < docOrder.length - 1 ? docOrder[index + 1] : undefined,
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 15개(기존) + 13개(신규) = 28 tests.

- [ ] **Step 5: GNB 작성**

Create `src/components/layout/Gnb.tsx`:

```tsx
import { Command, Menu, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findSection, sections } from '@/components/layout/nav-config'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function Gnb({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const active = findSection(pathname)

  return (
    <header className="bg-surface/90 sticky top-0 z-sticky border-b backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6">
        <button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </span>
          <span className="text-sm font-bold tracking-tight">서비스 대시보드</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="전역 메뉴">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              aria-current={section.id === active.id ? 'page' : undefined}
              className={cn(
                'h-control flex items-center rounded-md px-3 text-sm',
                section.id === active.id
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent/60',
              )}
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <button
          className="hover:bg-accent ml-auto grid size-8 place-items-center rounded-md"
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: LNB 작성**

Create `src/components/layout/Lnb.tsx`:

```tsx
import { X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { findSection } from '@/components/layout/nav-config'
import { currentRelease } from '@/data/releases'
import { cn } from '@/lib/utils'

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const section = findSection(pathname)

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-drawer bg-foreground/20 md:hidden"
          onClick={onClose}
          aria-label="메뉴 닫기"
        />
      )}
      <aside
        className={cn(
          'bg-surface fixed inset-y-0 left-0 z-drawer flex w-60 flex-col border-r p-3 transition-transform',
          'md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-9 items-center px-2">
          <p className="text-muted-foreground text-2xs font-bold tracking-widest">
            {section.label.toUpperCase()}
          </p>
          <button
            className="text-muted-foreground ml-auto md:hidden"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-2 flex flex-col" aria-label={`${section.label} 문서 목록`}>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex h-control items-center rounded-md px-2 text-sm',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/60',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-md border p-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-success size-1.5 rounded-full" />
            <strong className="text-xs">{currentRelease.version}</strong>
          </div>
          <p className="text-muted-foreground mt-0.5 text-2xs">{currentRelease.title}</p>
        </div>
      </aside>
    </>
  )
}
```

`end` prop을 모든 항목에 붙이는 이유: LNB 항목은 전부 정확 일치로만 활성화되어야 한다.
`/foundations`가 `/foundations/color`에서도 활성화되면 Overview와 Color가 동시에 강조된다.

- [ ] **Step 7: 하단 이전/다음 네비게이션 작성**

Create `src/components/layout/DocFooterNav.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findAdjacent } from '@/components/layout/nav-config'

export function DocFooterNav() {
  const { pathname } = useLocation()
  const { prev, next } = findAdjacent(pathname)
  if (!prev && !next) return null

  return (
    <nav className="mt-16 grid gap-3 border-t pt-6 sm:grid-cols-2" aria-label="문서 이동">
      {prev ? (
        <Link
          to={prev.to}
          className="hover:bg-accent/50 flex flex-col gap-1 rounded-lg border p-4"
        >
          <span className="text-muted-foreground flex items-center gap-1 text-2xs">
            <ChevronLeft size={12} /> 이전 문서
          </span>
          <strong className="text-sm">{prev.label}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={next.to}
          className="hover:bg-accent/50 flex flex-col items-end gap-1 rounded-lg border p-4 sm:text-right"
        >
          <span className="text-muted-foreground flex items-center gap-1 text-2xs">
            다음 문서 <ChevronRight size={12} />
          </span>
          <strong className="text-sm">{next.label}</strong>
        </Link>
      )}
    </nav>
  )
}
```

- [ ] **Step 8: AppShell 교체**

Rewrite `src/components/layout/AppShell.tsx`:

```tsx
import { useState } from 'react'
import { Outlet } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Gnb onMenuClick={() => setLnbOpen(true)} />
      <div className="flex">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
            <DocFooterNav />
          </div>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Sidebar 삭제**

```bash
git rm -q src/components/layout/Sidebar.tsx
```

- [ ] **Step 10: 라우트 재배치**

Rewrite `src/routes/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'
import { ButtonPage } from '@/routes/components/ButtonPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Get started" /> },
      { path: 'get-started/install', element: <Placeholder title="설치" /> },
      { path: 'get-started/principles', element: <Placeholder title="원칙" /> },

      { path: 'foundations', element: <Placeholder title="Foundations" /> },
      { path: 'foundations/color', element: <Placeholder title="Color" /> },
      { path: 'foundations/typography', element: <Placeholder title="Typography" /> },
      { path: 'foundations/spacing', element: <Placeholder title="Spacing" /> },
      { path: 'foundations/iconography', element: <Placeholder title="Iconography" /> },
      { path: 'foundations/state', element: <Placeholder title="State" /> },
      { path: 'foundations/voice-and-tone', element: <Placeholder title="Voice and Tone" /> },
      { path: 'foundations/writing', element: <Placeholder title="Writing" /> },

      {
        path: 'components',
        children: [
          { index: true, element: <ComponentsIndex /> },
          { path: 'button', element: <ButtonPage /> },
        ],
      },

      { path: 'patterns', element: <Placeholder title="Patterns" /> },
      { path: 'updates', element: <Placeholder title="Updates" /> },

      { path: '*', element: <Placeholder title="페이지를 찾을 수 없습니다" /> },
    ],
  },
])

/**
 * 등록된 문서 경로 목록. 404 캐치올은 문서가 아니므로 제외한다.
 * nav-config의 docOrder와 일치하는지 테스트가 검사한다 —
 * 두 목록이 조용히 어긋나는 것을 막기 위한 장치다.
 */
export const registeredPaths: string[] = (() => {
  const children = router.routes[0].children ?? []
  return children
    .filter((route) => route.path !== '*')
    .flatMap((route) => {
      const base = route.index ? '/' : `/${route.path}`
      if (!route.children) return [base]
      return route.children.map((child) => (child.index ? base : `${base}/${child.path}`))
    })
})()
```

- [ ] **Step 11: Placeholder 문구 수정**

`src/routes/Placeholder.tsx`의 설명 문장이 v0.2.0 기준이다. 다음으로 교체한다.

```tsx
      <p className="text-muted-foreground max-w-sm text-sm">
        이 문서는 아직 준비 중입니다.
      </p>
```

- [ ] **Step 12: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 28 tests.

- [ ] **Step 13: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: GNB + LNB 2단 네비게이션으로 개편

상단에 섹션을 놓고 좌측에 그 섹션의 문서 목록을 두는 문서 사이트 구조로 바꾼다.
사이드바 1단 구조로는 Foundations가 8개로 늘어난 뒤 탐색이 무너진다.

페이지 하단의 이전/다음은 LNB 순서를 평탄화한 하나의 선형 목록에서 파생되며
섹션 경계를 넘어 이어진다. 순서를 페이지마다 손으로 적지 않기 위함이다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 토큰 실측 유틸 + 문서 틀

**Files:**
- Create: `src/lib/tokens.ts`, `src/components/docs/DocPage.tsx`, `src/components/docs/DoDont.tsx`, `src/components/docs/TokenTable.tsx`, `src/components/docs/Swatch.tsx`
- Test: `src/lib/tokens.test.ts`

**Interfaces:**
- Consumes: `cn()`
- Produces:
  - `type TokenRow = { name: string; cssVar: string; value: string }`
  - `parseTokenNames(cssText: string, prefix: string): string[]` — 순수 함수, 테스트 대상
  - `readTokens(names: string[]): TokenRow[]` — `getComputedStyle(document.documentElement)` 실측
  - `DocPage({ title, description, children }: { title: string; description?: string; children: ReactNode })`
  - `DoDont({ do: string[]; dont: string[] })`
  - `TokenTable({ rows }: { rows: TokenRow[] })`
  - `Swatch({ row }: { row: TokenRow })`

- [ ] **Step 1: 실패하는 테스트 작성**

`readTokens`는 `document`가 필요해 `node` 환경에서 돌지 않는다. 순수 파싱 부분만 테스트한다.

Create `src/lib/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseTokenNames } from '@/lib/tokens'

const SAMPLE = `
:root {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --text-2xs: 0.6875rem;
}
`

describe('parseTokenNames', () => {
  it('접두사로 시작하는 토큰 이름만 뽑는다', () => {
    expect(parseTokenNames(SAMPLE, '--color-')).toEqual([
      '--color-background',
      '--color-primary',
      '--color-primary-foreground',
    ])
  })

  it('다른 접두사도 동작한다', () => {
    expect(parseTokenNames(SAMPLE, '--radius-')).toEqual(['--radius-sm'])
  })

  it('일치하는 것이 없으면 빈 배열이다', () => {
    expect(parseTokenNames(SAMPLE, '--shadow-')).toEqual([])
  })

  it('중복을 제거한다', () => {
    expect(parseTokenNames('--color-a: 1; --color-a: 2;', '--color-')).toEqual(['--color-a'])
  })

  it('선언부만 잡고 var() 참조는 잡지 않는다', () => {
    expect(parseTokenNames('--x: var(--color-primary);', '--color-')).toEqual([])
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `@/lib/tokens`를 찾지 못한다.

- [ ] **Step 3: 토큰 유틸 구현**

Create `src/lib/tokens.ts`:

```ts
export type TokenRow = {
  /** 표시용 짧은 이름 — 'primary-foreground' */
  name: string
  /** CSS 변수 이름 — '--color-primary-foreground' */
  cssVar: string
  /** 실측된 계산값 — 'oklch(0.985 0 0)' */
  value: string
}

/**
 * CSS 텍스트에서 주어진 접두사로 시작하는 커스텀 프로퍼티 '선언'의 이름을 뽑는다.
 * var(--x) 참조는 선언이 아니므로 제외한다 — 선언은 이름 뒤에 콜론이 온다.
 */
export function parseTokenNames(cssText: string, prefix: string): string[] {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(?<![\\w-])(${escaped}[\\w-]+)\\s*:`, 'g')
  const found = new Set<string>()
  for (const match of cssText.matchAll(pattern)) {
    found.add(match[1])
  }
  return [...found]
}

/**
 * 현재 문서에서 토큰의 계산값을 실측한다.
 * 라이트/다크 어느 쪽이든 지금 적용된 값이 그대로 나온다.
 */
export function readTokens(names: string[]): TokenRow[] {
  const computed = getComputedStyle(document.documentElement)
  return names.map((cssVar) => ({
    cssVar,
    name: cssVar.replace(/^--[a-z]+-/, ''),
    value: computed.getPropertyValue(cssVar).trim(),
  }))
}
```

`readTokens`는 값이 비어 있어도 그대로 돌려준다. 빈 값은 토큰이 정의되지 않았다는 뜻이며,
문서에서 눈에 띄어야 한다 — 조용히 감추면 누락을 발견할 수 없다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 28 + 5 = 33 tests.

- [ ] **Step 5: 문서 틀 작성**

Create `src/components/docs/DocPage.tsx`:

```tsx
import type { ReactNode } from 'react'

export function DocPage({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </header>
      {children}
    </article>
  )
}

export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-2xs font-bold tracking-widest">
        {title.toUpperCase()}
      </h2>
      {children}
    </section>
  )
}
```

- [ ] **Step 6: Do/Don't 블록 작성**

Create `src/components/docs/DoDont.tsx`:

```tsx
import { Check, X } from 'lucide-react'

export function DoDont({ do: dos, dont: donts }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ul className="flex flex-col gap-2 rounded-lg border p-4">
        {dos.map((line) => (
          <li key={line} className="flex gap-2 text-sm">
            <Check size={15} className="text-success mt-0.5 shrink-0" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2 rounded-lg border p-4">
        {donts.map((line) => (
          <li key={line} className="flex gap-2 text-sm">
            <X size={15} className="text-destructive mt-0.5 shrink-0" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 7: TokenTable / Swatch 작성**

Create `src/components/docs/TokenTable.tsx`:

```tsx
import type { TokenRow } from '@/lib/tokens'

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-muted-foreground text-2xs tracking-widest">
            <th scope="col" className="px-3 py-2 font-bold">TOKEN</th>
            <th scope="col" className="px-3 py-2 font-bold">CSS VARIABLE</th>
            <th scope="col" className="px-3 py-2 font-bold">VALUE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cssVar}>
              <th scope="row" className="border-t px-3 py-2 font-medium">{row.name}</th>
              <td className="text-muted-foreground border-t px-3 py-2">{row.cssVar}</td>
              <td className="text-muted-foreground border-t px-3 py-2">
                {row.value || '(정의되지 않음)'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

Create `src/components/docs/Swatch.tsx`:

```tsx
import type { TokenRow } from '@/lib/tokens'

export function Swatch({ row }: { row: TokenRow }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 rounded-lg border"
        style={{ background: `var(${row.cssVar})` }}
        aria-hidden
      />
      <div>
        <strong className="text-sm">{row.name}</strong>
        <p className="text-muted-foreground text-2xs break-all">
          {row.value || '(정의되지 않음)'}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 33 tests. 아직 사용처가 없어 화면 변화는 없다.

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 토큰 실측 유틸과 문서 틀 추가

Foundations 문서가 tokens.css의 값을 손으로 옮겨 적지 않도록
getComputedStyle로 런타임에 실측한다. 토큰을 바꾸면 문서가 따라온다.

정의되지 않은 토큰은 감추지 않고 "(정의되지 않음)"으로 드러낸다.
조용히 빠지면 누락을 발견할 수 없다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 3: Foundations — 토큰에서 파생되는 4개

**Files:**
- Create: `src/routes/foundations/FoundationsOverview.tsx`, `ColorPage.tsx`, `TypographyPage.tsx`, `SpacingPage.tsx`
- Modify: `src/routes/router.tsx`, `tsconfig.app.json` (필요 시)

**Interfaces:**
- Consumes: Task 2의 `parseTokenNames`, `readTokens`, `TokenRow`, `DocPage`, `DocSection`, `TokenTable`, `Swatch`; Task 1의 `sections`
- Produces: `/foundations`, `/foundations/color`, `/foundations/typography`, `/foundations/spacing` 라우트

**핵심 원칙:** 토큰 이름 목록을 손으로 적지 않는다. `tokens.css`를 `?raw`로 읽어 파싱한다.

- [ ] **Step 1: `?raw` import 타입 확인**

Run: `grep -n '"types"' tsconfig.app.json`

`"types": ["vite/client"]`이 없으면 `compilerOptions`에 추가한다. Vite가 `*.css?raw` 모듈 선언을 제공한다.

빠졌을 때 추가할 내용:

```json
"types": ["vite/client"],
```

- [ ] **Step 2: Foundations Overview 작성**

Create `src/routes/foundations/FoundationsOverview.tsx`:

```tsx
import { Link } from 'react-router'
import { DocPage } from '@/components/docs/DocPage'
import { sections } from '@/components/layout/nav-config'

const NOTES: Record<string, string> = {
  '/foundations/color': '역할 기반 시맨틱 색 토큰과 라이트·다크 대응',
  '/foundations/typography': '크기 스케일과 굵기, 정보 위계',
  '/foundations/spacing': '4px 기반 간격과 어드민 밀도 축',
  '/foundations/iconography': '아이콘 크기·스트로크·사용 규칙',
  '/foundations/state': '상호작용 상태의 표현 규칙',
  '/foundations/voice-and-tone': '어드민이 사용자에게 말하는 방식',
  '/foundations/writing': '라벨·문구·에러 메시지 작성 규칙',
}

export function FoundationsOverview() {
  const section = sections.find((s) => s.id === 'foundations')!
  const pages = section.items.filter((item) => item.to !== section.to)

  return (
    <DocPage
      title="Foundations"
      description="컴포넌트보다 먼저 합의해야 하는 것들입니다. 색·타이포·간격 같은 토큰과, 말투·문구처럼 코드에 담기지 않는 원칙을 함께 다룹니다."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <li key={page.to}>
            <Link to={page.to} className="hover:bg-accent/50 block rounded-lg border p-4">
              <strong className="text-sm">{page.label}</strong>
              <p className="text-muted-foreground mt-1 text-xs">{NOTES[page.to]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </DocPage>
  )
}
```

목록은 `nav-config`에서 온다. 여기서 페이지를 추가·삭제하지 않는다.

- [ ] **Step 3: Color 페이지 작성**

Create `src/routes/foundations/ColorPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { Swatch } from '@/components/docs/Swatch'
import { TokenTable } from '@/components/docs/TokenTable'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'

const COLOR_NAMES = parseTokenNames(tokensCss, '--color-')

/** 테마가 바뀌면 실측값도 바뀌므로 .dark 클래스 변화를 지켜본다. */
function useMeasuredTokens(names: string[]): TokenRow[] {
  const [rows, setRows] = useState<TokenRow[]>([])

  useEffect(() => {
    const measure = () => setRows(readTokens(names))
    measure()
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [names])

  return rows
}

export function ColorPage() {
  const rows = useMeasuredTokens(COLOR_NAMES)
  const surfaces = rows.filter((r) => /background|surface|card|popover|muted|accent/.test(r.name))
  const roles = rows.filter((r) => /primary|secondary|destructive|success|warning|info/.test(r.name))
  const lines = rows.filter((r) => /border|input|ring/.test(r.name))

  return (
    <DocPage
      title="Color"
      description="색은 blue-500 같은 원시 이름이 아니라 primary·destructive 같은 역할 이름으로 씁니다. 역할로 쓰면 라이트·다크 전환과 브랜드 교체가 토큰 한 곳에서 끝납니다."
    >
      <DocSection title="표면">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {surfaces.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="역할">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {roles.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="선과 포커스">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {lines.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="전체 토큰">
        <p className="text-muted-foreground text-xs">
          아래 값은 지금 적용된 테마에서 실측한 것입니다. 테마를 바꾸면 값도 바뀝니다.
        </p>
        <TokenTable rows={rows} />
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '역할 토큰(primary, destructive)을 쓴다',
            '위험한 동작에는 destructive를 일관되게 쓴다',
            '상태를 색만으로 구분하지 않고 텍스트나 아이콘을 함께 둔다',
          ]}
          dont={[
            '컴포넌트에 hex 값을 직접 적지 않는다',
            '같은 의미에 화면마다 다른 색을 쓰지 않는다',
            'success와 destructive를 장식 목적으로 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

- [ ] **Step 4: Typography 페이지 작성**

Create `src/routes/foundations/TypographyPage.tsx`:

```tsx
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'

const SCALE = [
  { className: 'text-2xs', role: '보조 라벨 · 배지', sample: '컴포넌트 12개' },
  { className: 'text-xs', role: '설명 · 캡션', sample: '전체 사용자와 상태를 관리합니다' },
  { className: 'text-sm', role: '본문 · 컨트롤 라벨', sample: '사용자 관리' },
  { className: 'text-base', role: '강조 본문', sample: '사용자 관리' },
  { className: 'text-lg', role: '섹션 제목', sample: '사용자 관리' },
  { className: 'text-2xl', role: '페이지 제목', sample: '사용자 관리' },
]

const WEIGHTS = [
  { className: 'font-normal', role: '본문' },
  { className: 'font-medium', role: '컨트롤 라벨' },
  { className: 'font-semibold', role: '활성 항목 · 강조' },
  { className: 'font-bold', role: '제목' },
]

export function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      description="어드민은 한 화면에 많은 정보를 담습니다. 크기를 늘리기보다 굵기와 색으로 위계를 만드는 편이 밀도를 지키면서 읽히게 합니다."
    >
      <DocSection title="크기 스케일">
        <div className="divide-y rounded-lg border">
          {SCALE.map((item) => (
            <div key={item.className} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <code className="text-muted-foreground w-24 shrink-0 text-xs">{item.className}</code>
              <span className={item.className}>{item.sample}</span>
              <span className="text-muted-foreground ml-auto text-2xs">{item.role}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="굵기">
        <div className="divide-y rounded-lg border">
          {WEIGHTS.map((item) => (
            <div key={item.className} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <code className="text-muted-foreground w-28 shrink-0 text-xs">{item.className}</code>
              <span className={`text-sm ${item.className}`}>사용자 관리</span>
              <span className="text-muted-foreground ml-auto text-2xs">{item.role}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '위계는 크기보다 굵기와 색으로 만든다',
            '한 화면에서 크기 단계를 4개 이하로 유지한다',
            '숫자 데이터는 정렬을 위해 같은 크기로 맞춘다',
          ]}
          dont={[
            '강조를 위해 크기를 계속 키우지 않는다',
            '스케일에 없는 임의 크기를 만들지 않는다',
            '본문에 font-bold를 남발하지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

- [ ] **Step 5: Spacing 페이지 작성**

Create `src/routes/foundations/SpacingPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { TokenTable } from '@/components/docs/TokenTable'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'

const SPACING_NAMES = parseTokenNames(tokensCss, '--spacing-')
const RADIUS_NAMES = parseTokenNames(tokensCss, '--radius-')

const STEPS = [1, 2, 3, 4, 6, 8, 10, 12, 16]

export function SpacingPage() {
  const [density, setDensity] = useState<TokenRow[]>([])
  const [radius, setRadius] = useState<TokenRow[]>([])

  useEffect(() => {
    setDensity(readTokens(SPACING_NAMES))
    setRadius(readTokens(RADIUS_NAMES))
  }, [])

  return (
    <DocPage
      title="Spacing"
      description="간격은 4px 배수로만 씁니다. 어드민은 정보 밀도가 높아 임의 값이 하나 섞이면 정렬이 눈에 띄게 어긋납니다."
    >
      <DocSection title="기본 스케일">
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          {STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <code className="text-muted-foreground w-12 shrink-0 text-xs">{step}</code>
              <div className="bg-primary h-3 rounded-sm" style={{ width: `calc(var(--spacing) * ${step})` }} />
              <span className="text-muted-foreground text-2xs">{step * 4}px</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="밀도 축">
        <p className="text-muted-foreground text-xs">
          컨트롤과 테이블 행의 높이를 토큰으로 묶어 화면마다 흔들리지 않게 합니다.
        </p>
        <TokenTable rows={density} />
      </DocSection>

      <DocSection title="모서리">
        <TokenTable rows={radius} />
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '간격은 4px 배수로만 쓴다',
            '컨트롤 높이는 density 토큰을 쓴다',
            '관련된 요소는 가깝게, 다른 그룹은 멀게 배치한다',
          ]}
          dont={[
            '스케일에 없는 임의 px 값을 쓰지 않는다',
            '여백으로 위계를 만들 수 있는 곳에 구분선을 넣지 않는다',
            '같은 층위의 카드에 서로 다른 안쪽 여백을 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

- [ ] **Step 6: 라우트 연결**

`src/routes/router.tsx`에서 네 개의 `Placeholder`를 실제 페이지로 교체한다.

```tsx
import { ColorPage } from '@/routes/foundations/ColorPage'
import { FoundationsOverview } from '@/routes/foundations/FoundationsOverview'
import { SpacingPage } from '@/routes/foundations/SpacingPage'
import { TypographyPage } from '@/routes/foundations/TypographyPage'
```

```tsx
      { path: 'foundations', element: <FoundationsOverview /> },
      { path: 'foundations/color', element: <ColorPage /> },
      { path: 'foundations/typography', element: <TypographyPage /> },
      { path: 'foundations/spacing', element: <SpacingPage /> },
```

- [ ] **Step 7: 실측이 실제로 동작하는지 확인**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 33 tests.

빌드 산출물에 토큰 이름이 들어갔는지 확인한다 (`?raw` import가 동작했다는 증거):

```bash
grep -c -- "--color-surface-raised" dist/assets/*.js
```

Expected: `1` 이상. `0`이면 `?raw` import가 실패한 것이므로 Step 1을 재확인한다.

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Foundations의 토큰 파생 문서 4개 추가

Overview, Color, Typography, Spacing을 만든다.
Color와 Spacing은 tokens.css를 ?raw로 읽어 토큰 이름을 파싱하고
getComputedStyle로 값을 실측한다. 목록도 값도 손으로 적지 않는다.

Overview의 카드 목록은 nav-config에서 온다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Foundations — 산문 문서 4개

**Files:**
- Create: `src/routes/foundations/IconographyPage.tsx`, `StatePage.tsx`, `VoiceAndTonePage.tsx`, `WritingPage.tsx`
- Modify: `src/routes/router.tsx`

**Interfaces:**
- Consumes: Task 2의 `DocPage`, `DocSection`, `DoDont`
- Produces: 나머지 4개 Foundations 라우트

이 Task는 글쓰기가 주된 작업이다. 각 페이지는 **원칙 → 예시 → Do/Don't** 구조를 따른다.
추상적인 훈계가 아니라, 이 어드민에서 실제로 마주칠 상황을 예로 들어야 한다.

- [ ] **Step 1: Iconography 페이지**

Create `src/routes/foundations/IconographyPage.tsx`.

`DocPage`로 감싸고 다음 섹션을 둔다.

- **크기**: lucide-react 아이콘을 12/14/16/20/24 크기로 나란히 렌더링하고 각각의 용도를 적는다 (12=배지 내부, 14=보조 텍스트 옆, 16=버튼·컨트롤 기본, 20=툴바, 24=빈 상태·안내). 실제 아이콘 컴포넌트(예: `Plus`, `Search`, `Trash2`)를 써서 눈으로 크기 차이가 보이게 한다.
- **스트로크**: `strokeWidth` 1.5 / 2 / 2.4를 같은 아이콘으로 비교하고, 기본은 2, 강조는 2.4로 정한다.
- **의미의 일관성**: 같은 뜻에는 같은 아이콘을 쓴다는 규칙과, 이 시스템에서 고정한 매핑 표 (추가=Plus, 검색=Search, 삭제=Trash2, 설정=Settings2, 닫기=X, 더보기=MoreHorizontal, 성공=Check, 경고=TriangleAlert, 정보=Info).
- **접근성**: 아이콘 단독 버튼에는 `aria-label`, 장식용 아이콘에는 `aria-hidden`을 붙인다. 두 경우를 코드가 아니라 짧은 설명으로 보여준다.
- **Do/Don't**: `DoDont`로 마무리.

- [ ] **Step 2: State 페이지**

Create `src/routes/foundations/StatePage.tsx`.

섹션 구성:

- **상태 목록**: default / hover / focus / active / disabled / loading / error 각각이 무엇을 의미하는지 한 줄씩.
- **실물 비교**: 같은 요소를 상태별로 나란히 보여준다. hover와 focus는 마우스 없이 보여야 하므로 `tokens.css`의 `.state-hover` / `.state-focus` 강제 클래스를 쓴다. 이 클래스가 존재하는 이유도 한 줄 적는다.
- **규칙**: 포커스는 항상 보여야 한다(`focus-visible` 링을 제거하지 않는다), disabled는 이유를 함께 알린다, loading은 중복 실행을 막는다, error는 색만으로 표시하지 않는다.
- **Do/Don't**.

- [ ] **Step 3: Voice and Tone 페이지**

Create `src/routes/foundations/VoiceAndTonePage.tsx`.

이 어드민의 말투를 정한다. 개인용 워크벤치이자 운영 도구라는 맥락을 반영한다.

- **원칙 3가지**: ①사실을 먼저 말한다 ②사용자를 탓하지 않는다 ③다음 행동을 알려준다.
- **상황별 톤**: 성공(담백하게), 경고(무엇이 위험한지 구체적으로), 오류(원인과 복구 방법), 빈 상태(다음 행동 제안), 위험한 확인(되돌릴 수 없음을 명시).
- **좋은 예 / 나쁜 예**: 각 상황마다 실제 문장 쌍을 나란히 보여준다. 예를 들어 오류는 "알 수 없는 오류가 발생했습니다" 대신 "권한이 없어 저장하지 못했습니다. 관리자에게 권한을 요청하세요".
- **Do/Don't**.

- [ ] **Step 4: Writing 페이지**

Create `src/routes/foundations/WritingPage.tsx`.

구체적인 문구 작성 규칙을 다룬다.

- **버튼 라벨**: 동사로 시작하고 결과를 말한다. "확인" 대신 "삭제", "예/아니오" 대신 행동 이름.
- **폼 라벨과 도움말**: 라벨은 명사, 도움말은 입력 전에 필요한 정보만.
- **에러 메시지**: 무엇이 잘못됐는지 + 어떻게 고치는지. 코드나 예외 이름을 그대로 노출하지 않는다.
- **빈 상태**: 없다는 사실 + 다음 행동.
- **표기 규칙**: 숫자·날짜·단위 표기, 문장 부호, 존댓말 수준을 고정한다.
- **좋은 예 / 나쁜 예** 문장 쌍과 **Do/Don't**.

- [ ] **Step 5: 라우트 연결**

`src/routes/router.tsx`의 남은 네 개 `Placeholder`를 교체한다.

```tsx
      { path: 'foundations/iconography', element: <IconographyPage /> },
      { path: 'foundations/state', element: <StatePage /> },
      { path: 'foundations/voice-and-tone', element: <VoiceAndTonePage /> },
      { path: 'foundations/writing', element: <WritingPage /> },
```

- [ ] **Step 6: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 33 tests.

Foundations LNB의 8개 항목 중 `Placeholder`로 남은 것이 없는지 확인한다:

```bash
grep -n "foundations" src/routes/router.tsx | grep -c Placeholder
```

Expected: `0`

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Foundations의 산문 문서 4개 추가

Iconography, State, Voice and Tone, Writing을 만든다.
코드에 담기지 않지만 화면의 일관성을 좌우하는 규칙들이다.

추상적인 원칙 대신 이 어드민에서 실제로 마주칠 문장과 상황을 예로 든다.
State 페이지는 tokens.css의 강제 클래스로 hover·focus를 정적으로 전시한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 5: 컴포넌트 데이터 모델 교체

**Files:**
- Replace: `src/data/registry.ts`
- Modify: `src/data/registry.test.ts`, `src/routes/components/ComponentsIndex.tsx`
- Test: `src/data/registry.test.ts`

**Interfaces:**
- Consumes: 없음 (데이터 레이어)
- Produces:
  - `type PropertyOption = { value: string; label?: string; note?: string }`
  - `type ComponentProperty = { name: string; title: string; description: string; options: PropertyOption[]; display: 'grid' | 'row' | 'matrix'; crossWith?: string }`
  - `type AnatomyPart = { part: string; label: string; note: string; optional?: boolean }`
  - `type Guideline = { title: string; body: string; do?: string[]; dont?: string[] }`
  - `type Example = { title: string; note: string }`
  - `type ComponentMeta` (아래 Step 3)
  - `getProperty(meta: ComponentMeta, name: string): ComponentProperty | undefined`
  - 기존 `components`, `getComponent`, `getComponentsByCategory`, `componentStats`는 그대로 유지

**주의:** 이 Task는 `ButtonPage.tsx`와 `ComponentPage.tsx`를 깨뜨린다. Task 6~8에서 다시 세운다.
빌드를 통과시키기 위해 Step 6에서 두 파일을 **임시로 최소화**한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/data/registry.test.ts`를 다음으로 전면 교체한다.

```ts
import { describe, expect, it } from 'vitest'
import {
  components,
  componentStats,
  getComponent,
  getComponentsByCategory,
  getProperty,
} from '@/data/registry'

describe('registry', () => {
  it('id로 컴포넌트를 찾는다', () => {
    expect(getComponent('button')?.name).toBe('Button')
  })

  it('없는 id는 undefined를 돌려준다', () => {
    expect(getComponent('nope')).toBeUndefined()
  })

  it('카테고리로 거른다', () => {
    const actions = getComponentsByCategory('actions')
    expect(actions.length).toBeGreaterThan(0)
    expect(actions.every((c) => c.category === 'actions')).toBe(true)
  })

  it('집계 숫자를 배열에서 센다', () => {
    const stats = componentStats()
    expect(stats.total).toBe(components.length)
    expect(stats.verified).toBe(components.filter((c) => c.verified).length)
    expect(stats.stable).toBe(components.filter((c) => c.status === 'stable').length)
  })

  it('id가 중복되지 않는다', () => {
    const ids = components.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('properties', () => {
  it('이름으로 축을 찾는다', () => {
    const button = getComponent('button')!
    expect(getProperty(button, 'variant')?.title).toBe('Variant')
  })

  it('없는 축은 undefined다', () => {
    expect(getProperty(getComponent('button')!, 'nope')).toBeUndefined()
  })

  it('모든 컴포넌트에서 축 이름이 중복되지 않는다', () => {
    for (const meta of components) {
      const names = meta.properties.map((p) => p.name)
      expect(new Set(names).size, `${meta.id}의 축 이름 중복`).toBe(names.length)
    }
  })

  it('모든 축은 옵션을 하나 이상 갖는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        expect(property.options.length, `${meta.id}.${property.name}`).toBeGreaterThan(0)
      }
    }
  })

  it('축의 옵션 값이 중복되지 않는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        const values = property.options.map((o) => o.value)
        expect(new Set(values).size, `${meta.id}.${property.name}`).toBe(values.length)
      }
    }
  })

  it('matrix 축은 존재하는 축과 교차한다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        if (property.display !== 'matrix') continue
        expect(property.crossWith, `${meta.id}.${property.name}`).toBeDefined()
        expect(getProperty(meta, property.crossWith!), `${meta.id}.${property.name}`).toBeDefined()
      }
    }
  })

  it('matrix가 아닌 축은 crossWith를 갖지 않는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        if (property.display === 'matrix') continue
        expect(property.crossWith, `${meta.id}.${property.name}`).toBeUndefined()
      }
    }
  })
})

describe('anatomy', () => {
  it('part id가 중복되지 않는다', () => {
    for (const meta of components) {
      const parts = meta.anatomy.map((a) => a.part)
      expect(new Set(parts).size, meta.id).toBe(parts.length)
    }
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `getProperty`가 export되지 않았고 `meta.properties`가 없다.

- [ ] **Step 3: registry 전면 교체**

Rewrite `src/data/registry.ts`:

```ts
export type ComponentCategory =
  | 'actions'
  | 'inputs'
  | 'navigation'
  | 'feedback'
  | 'data-display'

export type ComponentStatus = 'draft' | 'review' | 'stable' | 'deprecated'

export type AnatomyPart = {
  /** 미리보기의 data-anatomy 속성과 맞물리는 id */
  part: string
  /** 해부도에 표시할 이름 */
  label: string
  /** 치수·역할 설명 */
  note: string
  /** 없어도 되는 부위인지 */
  optional?: boolean
}

export type PropertyOption = {
  value: string
  /** 표시용. 없으면 value를 쓴다 */
  label?: string
  /** 이 옵션을 언제 쓰는가 */
  note?: string
}

export type ComponentProperty = {
  /** 코드상의 prop 이름 */
  name: string
  /** 문서에 표시할 제목 */
  title: string
  /** 이 축이 무엇을 정하는가 */
  description: string
  options: PropertyOption[]
  /** grid = 옵션을 격자로, row = 한 줄로, matrix = 다른 축과 교차 */
  display: 'grid' | 'row' | 'matrix'
  /** display가 matrix일 때 교차할 축 이름 */
  crossWith?: string
}

export type Guideline = {
  title: string
  body: string
  do?: string[]
  dont?: string[]
}

export type Example = {
  title: string
  note: string
}

export type ComponentMeta = {
  id: string
  name: string
  category: ComponentCategory
  status: ComponentStatus
  addedIn: string
  changedIn: string
  purpose: string
  anatomy: AnatomyPart[]
  properties: ComponentProperty[]
  guidelines: Guideline[]
  usage: Example[]
  cases: Example[]
  verified: boolean
}

export const components: ComponentMeta[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.2.0',
    changedIn: 'v0.3.0',
    purpose: '사용자가 즉시 실행할 수 있는 동작을 나타낸다. 페이지 이동은 링크를 쓴다.',
    anatomy: [
      { part: 'container', label: 'Container', note: '높이는 size 토큰, 모서리는 radius-md' },
      { part: 'prefix-icon', label: 'Prefix Icon', note: '16×16, 라벨과 8px 간격', optional: true },
      { part: 'label', label: 'Label', note: 'text-sm / font-medium' },
      { part: 'suffix-icon', label: 'Suffix Icon', note: '16×16, 라벨과 8px 간격', optional: true },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '동작의 위계와 성격을 정한다. 한 화면의 주요 동작에만 default를 쓴다.',
        display: 'matrix',
        crossWith: 'size',
        options: [
          { value: 'default', note: '이 화면에서 가장 중요한 동작' },
          { value: 'secondary', note: '주요 동작 옆의 보조 동작' },
          { value: 'outline', note: '배경과 구분이 필요한 중립 동작' },
          { value: 'ghost', note: '표 행 내부처럼 밀도가 높은 자리' },
          { value: 'destructive', note: '삭제·차단처럼 되돌리기 어려운 동작' },
          { value: 'link', note: '문장 안에서 동작을 실행할 때' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '주변 컨트롤의 밀도에 맞춘다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 행, 필터 바' },
          { value: 'default', note: '기본' },
          { value: 'lg', note: '빈 상태나 온보딩의 단독 동작' },
          { value: 'icon', note: '아이콘만 있는 정사각 버튼' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '아이콘과 라벨의 배치를 정한다. 아이콘은 라벨의 뜻을 보강할 때만 쓴다.',
        display: 'row',
        options: [
          { value: 'label-only', label: '라벨만', note: '기본' },
          { value: 'icon-leading', label: '앞 아이콘', note: '동작의 종류를 아이콘으로 먼저 알릴 때' },
          { value: 'icon-trailing', label: '뒤 아이콘', note: '이동·펼침처럼 결과를 암시할 때' },
          { value: 'icon-only', label: '아이콘만', note: '자리가 좁을 때. aria-label이 반드시 필요' },
        ],
      },
      {
        name: 'width',
        title: 'Width',
        description: '버튼이 차지하는 가로 폭을 정한다.',
        display: 'row',
        options: [
          { value: 'hug', label: '내용에 맞춤', note: '기본' },
          { value: 'fill', label: '가득 채움', note: '모바일 하단 고정 동작, 좁은 폼' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용과 처리 상황을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 실행할 수 없음. 이유를 함께 알린다' },
          { value: 'loading', note: '처리 중. disabled와 스피너를 함께 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        title: 'Hierarchy',
        body: '한 화면에는 주요 동작이 하나만 있어야 합니다. default를 여러 개 두면 무엇을 먼저 해야 할지 알 수 없게 됩니다. 주요 동작 하나에 default, 그 옆의 대안에 secondary나 outline, 부수적인 동작에 ghost를 씁니다.',
        do: [
          '주요 동작은 화면당 하나로 제한한다',
          '나란히 놓인 버튼 중 하나만 default로 둔다',
          '취소는 ghost나 outline으로 둔다',
        ],
        dont: [
          '같은 줄의 버튼을 모두 default로 두지 않는다',
          '위계를 색만으로 표현하지 않는다',
        ],
      },
      {
        title: 'Destructive actions',
        body: '삭제·차단·해제처럼 되돌리기 어려운 동작에는 destructive를 씁니다. 색만으로는 부족하므로 라벨에도 동작을 그대로 적고, 영향 범위가 넓으면 확인 단계를 둡니다.',
        do: [
          '라벨에 동작을 그대로 적는다 — "확인"이 아니라 "삭제"',
          '되돌릴 수 없는 동작은 확인 단계를 둔다',
        ],
        dont: [
          'destructive를 단순한 강조 용도로 쓰지 않는다',
          '위험한 동작을 기본 포커스 위치에 두지 않는다',
        ],
      },
      {
        title: 'Buttons vs links',
        body: '버튼은 무언가를 실행하고, 링크는 어딘가로 이동합니다. 생김새가 아니라 하는 일로 고릅니다. 이동을 버튼으로 만들면 새 탭 열기나 주소 복사가 동작하지 않습니다.',
        do: ['이동에는 링크를 쓴다', '실행에는 버튼을 쓴다'],
        dont: ['링크처럼 보이게 하려고 이동을 버튼으로 만들지 않는다'],
      },
    ],
    usage: [
      { title: '페이지 헤더', note: '제목 오른쪽에 주요 동작 하나. 예: "사용자 추가"' },
      { title: '표 행 내부', note: 'sm + ghost로 밀도를 지킨다. 아이콘만 쓸 때는 aria-label을 붙인다' },
      { title: '확인 다이얼로그', note: '오른쪽에 실행, 왼쪽에 취소. 위험한 동작은 destructive' },
      { title: '빈 상태', note: 'lg 크기의 단독 동작으로 다음 행동을 제안한다' },
    ],
    cases: [
      { title: '긴 라벨', note: '줄바꿈하지 않고 컨테이너를 늘린다. 좁은 화면에서는 width를 fill로' },
      { title: '아이콘만', note: 'aria-label이 없으면 스크린리더에서 이름 없는 버튼이 된다' },
      { title: '권한 없음', note: 'disabled로 두되 왜 못 하는지 툴팁이나 보조 문구로 알린다' },
      { title: '처리 중', note: 'disabled + 스피너. 라벨을 진행형으로 바꿔 상태를 알린다' },
      { title: '좁은 화면', note: '라벨을 숨기고 아이콘만 남길 때는 aria-label을 유지한다' },
    ],
    verified: false,
  },
]

export function getComponent(id: string): ComponentMeta | undefined {
  return components.find((c) => c.id === id)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return components.filter((c) => c.category === category)
}

export function getProperty(meta: ComponentMeta, name: string): ComponentProperty | undefined {
  return meta.properties.find((p) => p.name === name)
}

export function componentStats(): { total: number; verified: number; stable: number } {
  return {
    total: components.length,
    verified: components.filter((c) => c.verified).length,
    stable: components.filter((c) => c.status === 'stable').length,
  }
}
```

`verified`를 `false`로 되돌리는 것은 의도된 것이다. 포맷이 전부 바뀌었으므로 Task 8에서 다시 눈으로 확인해야 한다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 33 - 5(옛 registry 테스트) + 11(새 registry 테스트) = 39 tests.

숫자가 다르면 실제 결과를 보고서에 적고 어떤 테스트가 늘거나 줄었는지 밝힌다.

- [ ] **Step 5: ComponentsIndex 갱신**

`src/routes/components/ComponentsIndex.tsx`를 Components Overview로 바꾼다. `DocPage`를 쓰고, 카테고리별로 묶어 보여준다.

```tsx
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { components, componentStats, type ComponentCategory } from '@/data/registry'

const CATEGORY_LABEL: Record<ComponentCategory, string> = {
  actions: 'Actions',
  inputs: 'Inputs',
  navigation: 'Navigation',
  feedback: 'Feedback',
  'data-display': 'Data Display',
}

export function ComponentsIndex() {
  const stats = componentStats()
  const categories = [...new Set(components.map((c) => c.category))]

  return (
    <DocPage
      title="Components"
      description={`등록된 컴포넌트 ${stats.total}개 중 ${stats.verified}개를 눈으로 확인했습니다.`}
    >
      {categories.map((category) => (
        <DocSection key={category} title={CATEGORY_LABEL[category]}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {components
              .filter((c) => c.category === category)
              .map((meta) => (
                <li key={meta.id}>
                  <Link
                    to={`/components/${meta.id}`}
                    className="hover:bg-accent/50 block rounded-lg border p-4"
                  >
                    <strong className="text-sm">{meta.name}</strong>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{meta.purpose}</p>
                    <span className="text-muted-foreground mt-2 block text-2xs">
                      {meta.status} · {meta.changedIn}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </DocSection>
      ))}
    </DocPage>
  )
}
```

- [ ] **Step 6: ButtonPage와 ComponentPage를 임시로 최소화**

두 파일은 옛 `variants`/`sizes`/`states`에 의존해 지금 컴파일되지 않는다. Task 6~8에서 다시 세울 때까지 빌드를 통과시킬 최소 형태로 줄인다.

`src/components/docs/ComponentPage.tsx`를 임시로 줄인다 — 헤더와 purpose만 렌더링하고, `VariantGrid`/`StateGrid`/`Anatomy` import를 제거한다. props는 `{ meta }` 하나만 받는다.

`src/routes/components/ButtonPage.tsx`도 `<ComponentPage meta={meta} />`만 호출하도록 줄인다.

`src/components/docs/VariantGrid.tsx`와 `StateGrid.tsx`를 삭제한다.

```bash
git rm -q src/components/docs/VariantGrid.tsx src/components/docs/StateGrid.tsx
```

**이 단계의 화면 퇴행은 의도된 것이다.** Task 8에서 완전히 복구된다.

- [ ] **Step 7: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: 컴포넌트 메타를 property 축 구조로 교체

variants/sizes/states 평면 배열은 모든 컴포넌트가 2차원 곱을 갖는다고
가정한다. 축이 하나뿐인 Badge 같은 컴포넌트에서는 빈 표가 나오고,
Button의 layout·width 같은 새 축은 아예 표현할 자리가 없었다.

축을 선언 목록으로 바꿔 선언한 축만 렌더링되게 한다.
guidelines도 이름 붙은 블록의 배열로 바꿔 Hierarchy 같은 지침에
설명과 예시를 함께 담을 수 있게 했다.

전시 컴포넌트는 Task 6~8에서 새 구조에 맞춰 다시 세운다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 6: Anatomy — 지시선 자동 생성 + 번호 클릭 하이라이트

**Files:**
- Replace: `src/components/docs/Anatomy.tsx`

**Interfaces:**
- Consumes: Task 5의 `ComponentMeta`, `AnatomyPart`; `cn()`
- Produces: `Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode })`

**설계 원칙:** 좌표를 메타데이터에 적지 않는다. 미리보기의 각 부위에 `data-anatomy="<part>"` 속성이 붙어 있고, 마운트 후 실측해 지시선을 그린다.

**필수 조건:** 지시선이 없어도 문서가 성립해야 한다. 번호 목록이 항상 렌더링되는 기본 층이고, 지시선은 측정에 성공했을 때 그 위에 얹히는 층이다. 좁은 화면에서는 지시선을 그리지 않는다 — 라벨을 놓을 여백이 없다.

- [ ] **Step 1: Anatomy 전면 교체**

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
/** 이 폭 미만에서는 라벨을 놓을 자리가 없어 지시선을 그리지 않는다 */
const MIN_WIDTH_FOR_LINES = 640

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [active, setActive] = useState<string | null>(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const stageBox = stage.getBoundingClientRect()

    if (stageBox.width < MIN_WIDTH_FOR_LINES) {
      setPlaced([])
      return
    }

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

    setSize({ width: stageBox.width, height: stageBox.height })
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

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={stageRef}
        className="bg-surface-raised relative min-h-56 overflow-hidden rounded-lg border"
      >
        <div className="grid min-h-56 place-items-center px-6 py-12 sm:px-44">{preview}</div>

        {placed.length > 0 && (
          <>
            <svg
              className="pointer-events-none absolute inset-0"
              width={size.width}
              height={size.height}
              aria-hidden
            >
              {placed.map((item) => {
                const cy = item.box.y + item.box.height / 2
                const edgeX = item.side === 'left' ? item.box.x : item.box.x + item.box.width
                const anchorX =
                  item.side === 'left' ? GUTTER + 140 : size.width - GUTTER - 140
                const bendX = (anchorX + edgeX) / 2
                const isActive = active === item.part.part
                const isDimmed = active !== null && !isActive
                return (
                  <g
                    key={item.part.part}
                    className={cn(
                      isActive ? 'text-primary' : 'text-muted-foreground',
                      isDimmed && 'opacity-20',
                    )}
                  >
                    <polyline
                      points={`${anchorX},${item.labelY} ${bendX},${item.labelY} ${bendX},${cy} ${edgeX},${cy}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 1.5 : 1}
                    />
                    <circle cx={edgeX} cy={cy} r="2.5" fill="currentColor" />
                    {isActive && (
                      <rect
                        x={item.box.x - 4}
                        y={item.box.y - 4}
                        width={item.box.width + 8}
                        height={item.box.height + 8}
                        rx="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {placed.map((item) => {
              const isActive = active === item.part.part
              const isDimmed = active !== null && !isActive
              return (
                <div
                  key={item.part.part}
                  className={cn(
                    'pointer-events-none absolute w-32 -translate-y-1/2',
                    item.side === 'left' ? 'text-right' : 'text-left',
                    isDimmed && 'opacity-20',
                  )}
                  style={{
                    top: item.labelY,
                    [item.side]: GUTTER,
                  }}
                >
                  <strong
                    className={cn('block text-xs', isActive ? 'text-primary' : undefined)}
                  >
                    {item.part.label}
                  </strong>
                  {item.part.optional && (
                    <span className="text-muted-foreground text-2xs">(Optional)</span>
                  )}
                </div>
              )
            })}
          </>
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
                      ? 'bg-primary text-primary-foreground'
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

- [ ] **Step 2: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 39 tests. `ComponentPage`가 아직 `Anatomy`를 쓰지 않으므로 화면 변화는 없다.

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Anatomy에 지시선 자동 생성과 클릭 하이라이트 추가

미리보기의 data-anatomy 속성을 실측해 SVG 지시선을 그린다.
메타데이터에 좌표를 적으면 버튼 높이가 바뀔 때마다 도해를 손으로 고쳐야 하므로
런타임 측정으로 대신한다. ResizeObserver로 크기 변화를 따라간다.

번호 목록이 항상 렌더링되는 기본 층이고 지시선은 그 위에 얹히는 층이다.
측정에 실패하거나 화면이 좁으면 지시선 없이 목록만 남되 문서로서 성립한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: PropertyBlock + Playground

**Files:**
- Create: `src/components/docs/PropertyBlock.tsx`, `src/components/docs/Playground.tsx`

**Interfaces:**
- Consumes: Task 5의 `ComponentMeta`, `ComponentProperty`, `PropertyOption`, `getProperty`; `cn()`
- Produces:
  - `type RenderOptions = Record<string, string>` — 축 이름 → 선택된 값
  - `PropertyBlock({ meta, property, render }: { meta: ComponentMeta; property: ComponentProperty; render: (options: RenderOptions) => ReactNode })`
  - `Playground({ meta, render }: { meta: ComponentMeta; render: (options: RenderOptions) => ReactNode })`

**설계 원칙:** 전시 컴포넌트는 어떤 컴포넌트를 그리는지 모른다. 축 이름과 값의 맵을 `render` 콜백에 넘기고, 실제 렌더링은 각 컴포넌트 페이지가 담당한다.

- [ ] **Step 1: PropertyBlock 작성**

Create `src/components/docs/PropertyBlock.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { ComponentMeta, ComponentProperty, PropertyOption } from '@/data/registry'
import { getProperty } from '@/data/registry'

export type RenderOptions = Record<string, string>

function optionLabel(option: PropertyOption) {
  return option.label ?? option.value
}

/** 축의 첫 옵션들로 기본 조합을 만든다. 격자의 각 칸은 여기서 한 축만 바꾼다. */
function baseOptions(meta: ComponentMeta): RenderOptions {
  return Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value]))
}

export function PropertyBlock({
  meta,
  property,
  render,
}: {
  meta: ComponentMeta
  property: ComponentProperty
  render: (options: RenderOptions) => ReactNode
}) {
  const base = baseOptions(meta)
  const cross = property.crossWith ? getProperty(meta, property.crossWith) : undefined

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold">{property.title}</h3>
        <p className="text-muted-foreground text-xs">{property.description}</p>
      </div>

      {property.display === 'matrix' && cross ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-2xs tracking-widest">
                <th scope="col" className="bg-surface sticky left-0 px-3 py-2 font-bold">
                  {property.title.toUpperCase()}
                </th>
                {cross.options.map((option) => (
                  <th key={option.value} scope="col" className="px-3 py-2 font-bold">
                    {optionLabel(option).toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {property.options.map((option) => (
                <tr key={option.value}>
                  <th
                    scope="row"
                    className="bg-surface sticky left-0 border-t px-3 py-3 text-sm font-medium"
                  >
                    {optionLabel(option)}
                    {option.note && (
                      <span className="text-muted-foreground block text-2xs font-normal">
                        {option.note}
                      </span>
                    )}
                  </th>
                  {cross.options.map((crossOption) => (
                    <td key={crossOption.value} className="border-t px-3 py-3">
                      {render({
                        ...base,
                        [property.name]: option.value,
                        [cross.name]: crossOption.value,
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            property.display === 'row'
              ? 'flex flex-wrap items-end gap-6 rounded-lg border p-4'
              : 'grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {property.options.map((option) => (
            <div key={option.value} className="flex flex-col gap-2">
              <p className="text-muted-foreground text-2xs font-bold tracking-widest">
                {optionLabel(option).toUpperCase()}
              </p>
              <div className="flex min-h-10 items-center">
                {render({ ...base, [property.name]: option.value })}
              </div>
              {option.note && (
                <p className="text-muted-foreground max-w-48 text-2xs">{option.note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
```

`display`가 `matrix`인데 `crossWith` 축을 찾지 못하면 격자 대신 단일 축으로 떨어진다. Task 5의 테스트가 그런 메타를 애초에 막지만, 렌더링이 빈 화면으로 무너지지는 않게 한다.

- [ ] **Step 2: Playground 작성**

Create `src/components/docs/Playground.tsx`:

```tsx
import { useState, type ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { cn } from '@/lib/utils'

export function Playground({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (options: RenderOptions) => ReactNode
}) {
  const [options, setOptions] = useState<RenderOptions>(() =>
    Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value])),
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-8">
        {render(options)}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        {meta.properties.map((property) => (
          <fieldset key={property.name} className="flex flex-col gap-1.5">
            <legend className="text-muted-foreground text-2xs font-bold tracking-widest">
              {property.title.toUpperCase()}
            </legend>
            <div className="flex flex-wrap gap-1">
              {property.options.map((option) => {
                const selected = options[property.name] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setOptions((prev) => ({ ...prev, [property.name]: option.value }))
                    }
                    className={cn(
                      'rounded-md border px-2 py-1 text-xs',
                      selected
                        ? 'bg-primary text-primary-foreground border-transparent font-medium'
                        : 'hover:bg-accent/60',
                    )}
                  >
                    {option.label ?? option.value}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
```

컨트롤은 `meta.properties`에서 자동 생성된다. 축을 하나 추가하면 컨트롤이 하나 늘고, 여기 코드는 바뀌지 않는다.

- [ ] **Step 3: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 39 tests. 아직 사용처가 없어 화면 변화는 없다.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: property 축 기반 전시와 Playground 추가

VariantGrid와 StateGrid를 PropertyBlock 하나로 합친다.
축의 display가 matrix면 다른 축과 교차한 표를, row나 grid면 한 축만 전개한다.
축이 하나뿐인 컴포넌트에서 빈 표가 나오지 않게 하기 위함이다.

Playground의 컨트롤은 축 목록에서 자동 생성되므로
컴포넌트마다 새로 만들지 않는다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---
## Task 8 ★ 검증 지점: ComponentPage 재설계 + Button 페이지 재조립

**Files:**
- Create: `src/components/docs/GuidelineBlock.tsx`, `src/components/docs/ExampleList.tsx`
- Replace: `src/components/docs/ComponentPage.tsx`, `src/routes/components/ButtonPage.tsx`

**Interfaces:**
- Consumes: Task 2의 `DocSection`, `DoDont`; Task 5의 `ComponentMeta`, `Guideline`, `Example`; Task 6의 `Anatomy`; Task 7의 `PropertyBlock`, `Playground`, `RenderOptions`
- Produces:
  - `GuidelineBlock({ guideline }: { guideline: Guideline })`
  - `ExampleList({ examples }: { examples: Example[] })`
  - `type ComponentPageProps = { meta: ComponentMeta; preview: ReactNode; render: (options: RenderOptions) => ReactNode; extraSections?: { title: string; node: ReactNode }[] }`
  - `ComponentPage(props: ComponentPageProps)`

**설계 변경:** v0.2.0의 `ComponentPage`는 섹션 집합을 JSX 본문에 고정하고 섹션마다 별도 render prop을 받았다. 섹션을 추가할 때마다 props가 늘고 모든 페이지가 전부를 넘겨야 한다. 이번에는 **`render` 콜백 하나**로 통일하고, 페이지별 추가 섹션은 `extraSections` 배열로 opt-in한다.

- [ ] **Step 1: GuidelineBlock 작성**

Create `src/components/docs/GuidelineBlock.tsx`:

```tsx
import { DoDont } from '@/components/docs/DoDont'
import type { Guideline } from '@/data/registry'

export function GuidelineBlock({ guideline }: { guideline: Guideline }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <div>
        <h3 className="text-sm font-semibold">{guideline.title}</h3>
        <p className="text-muted-foreground mt-1 text-xs">{guideline.body}</p>
      </div>
      {(guideline.do || guideline.dont) && (
        <DoDont do={guideline.do ?? []} dont={guideline.dont ?? []} />
      )}
    </section>
  )
}
```

- [ ] **Step 2: ExampleList 작성**

Create `src/components/docs/ExampleList.tsx`:

```tsx
import type { Example } from '@/data/registry'

export function ExampleList({ examples }: { examples: Example[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {examples.map((example) => (
        <li key={example.title} className="rounded-lg border p-4">
          <strong className="text-sm">{example.title}</strong>
          <p className="text-muted-foreground mt-1 text-xs">{example.note}</p>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 3: ComponentPage 전면 교체**

Rewrite `src/components/docs/ComponentPage.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Anatomy } from '@/components/docs/Anatomy'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { ExampleList } from '@/components/docs/ExampleList'
import { GuidelineBlock } from '@/components/docs/GuidelineBlock'
import { Playground } from '@/components/docs/Playground'
import { PropertyBlock, type RenderOptions } from '@/components/docs/PropertyBlock'
import type { ComponentMeta, ComponentStatus } from '@/data/registry'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<ComponentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-warning/15 text-warning',
  stable: 'bg-success/15 text-success',
  deprecated: 'bg-destructive/15 text-destructive',
}

export type ComponentPageProps = {
  meta: ComponentMeta
  /** Anatomy 무대에 놓일 미리보기. 각 부위에 data-anatomy 속성이 있어야 한다 */
  preview: ReactNode
  /** 축 이름 → 선택된 값을 받아 컴포넌트를 렌더링한다 */
  render: (options: RenderOptions) => ReactNode
  /** 이 컴포넌트에만 필요한 섹션 */
  extraSections?: { title: string; node: ReactNode }[]
}

export function ComponentPage({ meta, preview, render, extraSections = [] }: ComponentPageProps) {
  return (
    <DocPage title={meta.name} description={meta.purpose}>
      <div className="-mt-6 flex flex-wrap items-center gap-2">
        <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[meta.status])}>
          {meta.status}
        </span>
        <span className="text-muted-foreground text-2xs">
          {meta.addedIn}에 추가 · {meta.changedIn}에서 마지막 변경
          {meta.verified ? ' · 검증 완료' : ' · 검증 필요'}
        </span>
      </div>

      <DocSection title="Anatomy">
        <Anatomy meta={meta} preview={preview} />
      </DocSection>

      <DocSection title="Playground">
        <Playground meta={meta} render={render} />
      </DocSection>

      <DocSection title="Properties">
        <div className="flex flex-col gap-8">
          {meta.properties.map((property) => (
            <PropertyBlock
              key={property.name}
              meta={meta}
              property={property}
              render={render}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Guidelines">
        <div className="flex flex-col gap-3">
          {meta.guidelines.map((guideline) => (
            <GuidelineBlock key={guideline.title} guideline={guideline} />
          ))}
        </div>
      </DocSection>

      <DocSection title="Usage">
        <ExampleList examples={meta.usage} />
      </DocSection>

      <DocSection title="Cases">
        <ExampleList examples={meta.cases} />
      </DocSection>

      {extraSections.map((section) => (
        <DocSection key={section.title} title={section.title}>
          {section.node}
        </DocSection>
      ))}
    </DocPage>
  )
}
```

- [ ] **Step 4: ButtonPage 재조립**

Rewrite `src/routes/components/ButtonPage.tsx`:

```tsx
import { ChevronRight, Loader2, Plus } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type ButtonSize = React.ComponentProps<typeof Button>['size']

const LABEL = '버튼'

function renderButton(options: RenderOptions) {
  const { variant, size, layout, width, state } = options
  const isIconOnly = layout === 'icon-only' || size === 'icon'
  const isLoading = state === 'loading'
  const isDisabled = state === 'disabled' || isLoading

  return (
    <Button
      variant={variant as ButtonVariant}
      size={(isIconOnly ? 'icon' : size) as ButtonSize}
      disabled={isDisabled}
      aria-label={isIconOnly ? `${variant} ${LABEL}` : undefined}
      className={cn(width === 'fill' && !isIconOnly && 'w-full')}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && (layout === 'icon-leading' || isIconOnly) && <Plus />}
      {!isIconOnly && (isLoading ? '저장 중' : LABEL)}
      {!isLoading && !isIconOnly && layout === 'icon-trailing' && <ChevronRight />}
    </Button>
  )
}

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderButton}
      preview={
        <Button data-anatomy="container">
          <Plus data-anatomy="prefix-icon" />
          <span data-anatomy="label">새 사용자</span>
          <ChevronRight data-anatomy="suffix-icon" />
        </Button>
      }
    />
  )
}
```

`preview`의 `data-anatomy` 속성이 Task 6의 실측 대상이다. 네 부위가 모두 한 버튼 안에 있어야 지시선이 각각을 가리킨다.

`renderButton`은 `state`가 `hover`나 `focus`일 때 아무것도 하지 않는다 — 그 둘은 `PropertyBlock`이 아니라 CSS의 `.state-hover` / `.state-focus` 강제 클래스로 표현된다. Step 5에서 연결한다.

- [ ] **Step 5: 상태 축의 강제 클래스 연결**

`PropertyBlock`이 `state` 축을 그릴 때 `hover`/`focus` 옵션에 강제 클래스를 씌워야 한다. `src/components/docs/PropertyBlock.tsx`의 비-matrix 분기에서 옵션 칸을 감싸는 `div`에 클래스를 추가한다.

파일 상단에 추가:

```tsx
/** hover와 focus는 실제 입력 없이 나타나지 않으므로 tokens.css의 강제 변형으로 전시한다 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
}
```

그리고 옵션 칸의 `<div className="flex min-h-10 items-center">`를 다음으로 바꾼다:

```tsx
              <div
                className={cn(
                  'flex min-h-10 items-center',
                  property.name === 'state' ? FORCE_CLASS[option.value] : undefined,
                )}
              >
```

`cn`을 import한다: `import { cn } from '@/lib/utils'`

- [ ] **Step 6: 라우트 확인**

`/components/button`이 `ButtonPage`로 연결되어 있는지 확인한다. Task 1에서 이미 연결했으므로 변경이 없어야 한다.

- [ ] **Step 7: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 39 tests.

강제 클래스가 빌드 CSS에 남아 있는지 확인한다:

```bash
grep -c "state-hover" dist/assets/*.css
```

Expected: `1` 이상.

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 컴포넌트 문서 포맷을 새 구조로 재조립

ComponentPage가 섹션마다 별도 render prop을 받던 구조를 render 콜백 하나로
통일하고, 페이지별 추가 섹션은 extraSections로 opt-in하게 바꾼다.
섹션을 늘릴 때마다 모든 컴포넌트 페이지가 전부를 넘겨야 하는 문제를 없앤다.

Anatomy · Playground · Properties · Guidelines · Usage · Cases 순으로
Button 페이지를 다시 세운다. Properties는 축마다 블록이 하나씩 생기므로
축을 추가하면 문서가 저절로 따라온다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 9: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다.

컨트롤러가 다음을 확인한다.

1. GNB 5개 항목이 모두 이동하고, 현재 섹션이 강조된다
2. 섹션을 바꾸면 LNB 목록이 그 섹션의 것으로 바뀐다
3. Foundations의 8개 항목이 모두 실제 문서로 이동한다
4. Color·Spacing의 값이 실제 토큰값이고, 테마를 바꾸면 값이 바뀐다
5. 모든 문서 하단에 이전/다음이 있고, Foundations의 마지막에서 Components로 넘어간다
6. Button 페이지의 Anatomy에 지시선이 그려지고 부위를 정확히 가리킨다
7. 번호를 클릭하면 해당 부위에 강조 링이 들어가고 나머지가 흐려진다
8. Playground의 컨트롤을 바꾸면 미리보기가 즉시 바뀐다
9. Properties에 5개 축이 각각 블록으로 나오고, variant는 size와 교차한 표다
10. state 축의 hover/focus 칸이 마우스 없이 해당 상태로 보인다
11. 다크 모드에서 전 구간이 읽힌다
12. 720px에서 레이아웃이 깨지지 않고, 좁은 화면에서 지시선 없이 번호 목록만 남는다

- [ ] **Step 10: 검증 결과를 registry에 기록**

Step 9의 12개 항목이 모두 통과하면 `src/data/registry.ts`의 Button 항목에서 `verified: false`를 `verified: true`로 바꾸고 커밋한다.

통과하지 못한 항목이 있으면 고친 뒤 Step 9를 다시 수행한다. 통과하지 않은 채로 `verified: true`를 적지 않는다.

---

## v0.3.0 완료 기준

- [ ] GNB에서 섹션을 바꾸면 LNB가 따라 바뀌고, 모든 항목이 실제로 이동한다
- [ ] 라우트 목록과 네비게이션 목록이 어긋나면 테스트가 실패한다
- [ ] 모든 문서 페이지 하단에 이전/다음이 있고, 순서가 `nav-config.ts` 한 곳에서 파생된다
- [ ] `tokens.css`의 값을 바꾸면 Foundations의 Color/Spacing이 따라 바뀐다
- [ ] Anatomy의 번호를 클릭하면 해당 부위가 강조되고, 지시선이 실제 위치를 가리킨다
- [ ] 지시선을 그리지 못하는 상황에서도 번호 목록만으로 문서가 성립한다
- [ ] `ComponentMeta`에 축을 하나 추가하면 Properties에 블록이 하나 늘고 Playground에 컨트롤이 하나 늘어난다
- [ ] 축이 하나뿐인 컴포넌트에서 빈 표가 나오지 않는다
- [ ] 다크 모드와 720px에서 모든 페이지가 읽힌다
- [ ] `npm test`와 `npm run build`가 통과한다

## v0.3.0 범위 밖

- 프리미티브 확장 (Badge · Input · Label · Card · Select · Checkbox · Switch · Dialog · Toast)
- 컴포넌트 페이지의 History 섹션
- 알림 벨 UI — 훅(`useUnseenRelease`)은 v0.2.0에 있으나 Topbar 연결은 아직
- Updates 페이지의 실제 Changelog 렌더링 — 이번엔 Overview 자리만
- Get started의 설치·원칙 상세 문서 — 이번엔 자리만
- 어드민 패턴 (PageHeader · FilterBar · DataTable · EmptyState · ConfirmDialog)
- 빠른 검색(⌘K)
- 컴포넌트 페이지의 코드 스니펫 표시
