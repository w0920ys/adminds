# 어드민 디자인 시스템 워크벤치 v0.2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tailwind v4 + shadcn/ui 기반으로 재작성해, 컴포넌트 메타데이터를 선언하면 전시 페이지가 자동으로 생성되는 디자인 시스템 워크벤치의 관통 배관을 완성한다.

**Architecture:** 관통 슬라이스(walking skeleton). 토큰 → 컴포넌트 → 전시 페이지 → 버전 기록의 전 구간을 Button 하나로 먼저 연결하고(Task 1~7), 검증된 뒤 나머지 프리미티브를 같은 틀에 복제한다(Task 8). 전시 화면은 손으로 그리지 않고 `data/registry.ts`의 메타데이터를 `components/docs/`가 읽어 렌더링한다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4 (`@theme` CSS-first), shadcn/ui (Radix 기반), react-router v7, lucide-react, Vitest

**Spec:** `docs/superpowers/specs/2026-08-25-admin-design-system-v2-design.md`

## Global Constraints

- 작업 브랜치는 `v0.2.0`. `main`에 직접 커밋하지 않는다. Task 8 완료 후 병합한다.
- 색·간격·radius·shadow 값을 컴포넌트에 하드코딩하지 않는다. 반드시 `src/styles/tokens.css`의 토큰을 경유한다.
- 비주얼은 shadcn 기본 톤(neutral)을 그대로 쓴다. 브랜드 색을 임의로 넣지 않는다.
- 전시 화면(Anatomy / VariantGrid / StateGrid)은 컴포넌트별로 손으로 작성하지 않는다. `ComponentMeta`를 읽어 렌더링한다.
- 컴포넌트를 추가·변경하면 같은 커밋에서 `registry.ts`의 `changedIn`·`status`·`verified`와 `releases.ts`의 해당 버전 항목을 갱신한다.
- 테스트 대상은 순수 로직(`data/`, `lib/`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다 — 이 프로젝트에서 UI 검증 수단은 전시 페이지 그 자체다.
- 각 Task는 `npm run build` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사를 쓴다.

---

## File Structure

### 생성

| 파일 | 책임 |
|---|---|
| `src/styles/tokens.css` | 색·타이포·간격·radius·shadow·z-index·density 토큰. 라이트/다크 두 벌 |
| `src/styles/globals.css` | Tailwind 진입점. tokens.css import, base 레이어 |
| `src/lib/utils.ts` | `cn()` — clsx + tailwind-merge (shadcn 필수) |
| `src/lib/theme.ts` | 다크모드 상태 읽기/쓰기 (localStorage + `.dark` 클래스) |
| `src/lib/notifications.ts` | 미확인 릴리스 판정 로직 (순수 함수) |
| `src/data/registry.ts` | `ComponentMeta` 타입 + 컴포넌트 목록 + 집계 헬퍼 |
| `src/data/releases.ts` | `Release` 타입 + 버전 히스토리 배열 + 헬퍼 (기존 파일 전면 교체) |
| `src/components/layout/AppShell.tsx` | 사이드바 + 톱바 + 콘텐츠 슬롯 |
| `src/components/layout/Sidebar.tsx` | IA 네비게이션. 모바일 드로어 |
| `src/components/layout/Topbar.tsx` | 브레드크럼, 테마 토글, 알림 벨 |
| `src/components/layout/nav-config.ts` | 사이드바 IA 정의 (경로 + 라벨 + 아이콘) |
| `src/components/docs/Anatomy.tsx` | `meta.anatomy`를 번호 붙은 해부도로 렌더링 |
| `src/components/docs/VariantGrid.tsx` | `meta.variants` × `meta.sizes` 조합 전개 |
| `src/components/docs/StateGrid.tsx` | `meta.states`를 강제 상태로 나란히 렌더링 |
| `src/components/docs/ComponentPage.tsx` | 위 3종 + 메타 헤더를 조립한 전시 페이지 틀 |
| `src/components/ui/button.tsx` | shadcn Button |
| `src/routes/router.tsx` | react-router 라우트 정의 |
| `src/routes/Placeholder.tsx` | 미구현 라우트용 "준비 중" 페이지 |
| `src/routes/components/ButtonPage.tsx` | Button 전시 페이지 |
| `vitest.config.ts` | Vitest 설정 |

### 수정

| 파일 | 변경 |
|---|---|
| `src/main.tsx` | RouterProvider 마운트, globals.css import |
| `vite.config.ts` | `@tailwindcss/vite` 플러그인, `@/*` 경로 별칭 |
| `tsconfig.app.json` | `baseUrl` + `paths` (`@/*` → `src/*`) |
| `package.json` | 이름 `adminds`, `test` 스크립트 추가 |
| `index.html` | `<title>` → 서비스 대시보드, `lang="ko"` |

### 삭제

`src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`

---

## Task 1: 재스캐폴드 — Tailwind v4 + shadcn + 경로 별칭

**Files:**
- Delete: `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`
- Create: `src/styles/globals.css`, `src/lib/utils.ts`, `components.json` (shadcn CLI 생성)
- Modify: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.json`, `src/main.tsx`, `index.html`, `package.json`

**Interfaces:**
- Consumes: 없음 (첫 Task)
- Produces: `cn(...inputs: ClassValue[]): string` — 이후 모든 컴포넌트가 클래스 병합에 사용. `@/` 별칭으로 `src/` 하위 import 가능.

- [ ] **Step 1: 브랜치 확인**

Run: `git branch --show-current`
Expected: `v0.2.0`

`main`이면 중단하고 `git checkout v0.2.0` 후 재시작한다.

- [ ] **Step 2: Tailwind v4 설치**

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: `vite.config.ts`에 Tailwind 플러그인과 경로 별칭 추가**

```ts
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
```

- [ ] **Step 4: `tsconfig.json`에 별칭 추가**

`compilerOptions`가 없으면 `references` 옆에 추가한다. 최종 형태:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- [ ] **Step 5: `tsconfig.app.json`의 `compilerOptions`에 동일 별칭 추가**

기존 `compilerOptions` 안에 두 줄을 넣는다.

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

- [ ] **Step 6: Tailwind 진입점 CSS 작성**

Create `src/styles/globals.css`:

```css
@import "tailwindcss";
```

토큰은 Task 2에서 이 파일에 붙인다. 지금은 Tailwind가 동작하는지만 본다.

- [ ] **Step 7: 옛 파일 삭제와 진입점 교체**

```bash
git rm -q src/App.tsx src/App.css src/index.css src/assets/react.svg src/assets/vite.svg src/assets/hero.png
```

Rewrite `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <p className="p-8 text-2xl font-semibold">서비스 대시보드</p>
  </StrictMode>,
)
```

- [ ] **Step 8: `index.html`과 `package.json` 정리**

`index.html`: `<html lang="en">` → `<html lang="ko">`, `<title>service-dashboard</title>` → `<title>서비스 대시보드</title>`

`package.json`: `"name": "service-dashboard"` → `"name": "adminds"`

- [ ] **Step 9: 빌드로 검증**

Run: `npm run build`
Expected: 성공. `dist/assets/*.css`가 생성되고, `p-8` 같은 유틸리티가 CSS에 포함되어 있어야 한다.

확인:

```bash
grep -c "padding:2rem" dist/assets/*.css
```

Expected: `1` 이상. `0`이면 Tailwind 플러그인이 동작하지 않은 것이므로 Step 3을 재확인한다.

- [ ] **Step 10: shadcn 초기화**

```bash
npx shadcn@latest init --base-color neutral --yes
```

CLI가 `components.json`을 만들고 `class-variance-authority` `clsx` `tailwind-merge` `tw-animate-css`를 설치하며, `src/lib/utils.ts`와 CSS 토큰 블록을 생성한다.

CLI가 CSS 파일을 찾지 못하면 `components.json`의 `tailwind.css`를 `src/styles/globals.css`로 지정하고 다시 실행한다.

CLI가 Vite 8 또는 TypeScript 6를 인식하지 못해 실패하면, 수동 대체 경로를 쓴다:

```bash
npm install class-variance-authority clsx tailwind-merge tw-animate-css
```

Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 11: 빌드 재검증**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 12: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: Tailwind v4 + shadcn 기반으로 재스캐폴드

v0.1.0의 App.tsx와 App.css를 제거한다. 토큰 없이 하드코딩된
스타일과 재사용 불가능한 일회성 클래스가 확장을 막고 있었다.

@/ 경로 별칭과 cn() 유틸리티를 도입해 이후 컴포넌트가
shadcn 관례를 그대로 따를 수 있게 한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 디자인 토큰

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/globals.css`, `src/main.tsx`

**Interfaces:**
- Consumes: Task 1의 `src/styles/globals.css`
- Produces: Tailwind 유틸리티로 노출되는 토큰 — `bg-background` `text-foreground` `bg-surface-raised` `text-success` `text-warning` `text-info` `border-border` `rounded-lg` `h-control` `h-row`. 다크 테마는 루트 요소의 `.dark` 클래스로 전환. `.state-hover` / `.state-focus` 컨테이너 클래스가 자손의 hover/focus 스타일을 강제.

- [ ] **Step 1: 토큰 파일 작성**

Create `src/styles/tokens.css`:

```css
/* 다크 테마 전환: 루트의 .dark 클래스 */
@custom-variant dark (&:is(.dark *));

/* 전시 페이지에서 hover/focus를 정적으로 보여주기 위한 강제 변형.
   .state-hover 안의 자손은 마우스가 없어도 hover 스타일을 받는다.
   StateGrid 외의 곳에서는 이 클래스를 쓰지 않는다. */
@custom-variant hover (&:hover, .state-hover &);
@custom-variant focus-visible (&:focus-visible, .state-focus &);

:root {
  --radius: 0.5rem;

  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --surface: oklch(1 0 0);
  --surface-raised: oklch(0.985 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --success: oklch(0.596 0.145 163.225);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.769 0.188 70.08);
  --warning-foreground: oklch(0.145 0 0);
  --info: oklch(0.6 0.118 264.376);
  --info-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --surface: oklch(0.205 0 0);
  --surface-raised: oklch(0.269 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --success: oklch(0.696 0.17 162.48);
  --success-foreground: oklch(0.145 0 0);
  --warning: oklch(0.828 0.189 84.429);
  --warning-foreground: oklch(0.145 0 0);
  --info: oklch(0.707 0.165 254.624);
  --info-foreground: oklch(0.145 0 0);
  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* 어드민 정보 밀도 축. 테이블 행과 컨트롤 높이를 한 곳에서 통제한다. */
  --spacing-control-sm: 2rem;
  --spacing-control: 2.25rem;
  --spacing-control-lg: 2.5rem;
  --spacing-row: 3rem;
  --spacing-row-compact: 2.5rem;

  --shadow-card: 0 1px 2px 0 oklch(0 0 0 / 0.04);
  --shadow-popover: 0 8px 24px -6px oklch(0 0 0 / 0.12);

  --text-2xs: 0.6875rem;

  /* z-index 레이어. 값이 컴포넌트마다 흩어지지 않게 한 곳에 모은다.
     Tailwind v4는 --z-index-* 네임스페이스를 z-* 유틸리티로 노출한다. */
  --z-index-sticky: 10;
  --z-index-drawer: 20;
  --z-index-overlay: 30;
  --z-index-popover: 40;
  --z-index-toast: 50;
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    -webkit-font-smoothing: antialiased;
    margin: 0;
  }
}
```

- [ ] **Step 2: 진입점에서 토큰 import**

Rewrite `src/styles/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./tokens.css";
```

`tw-animate-css`가 설치되지 않았다면 해당 줄을 뺀다.

- [ ] **Step 3: 토큰이 실제로 유틸리티가 되는지 임시 화면으로 확인**

Rewrite `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-surface-raised rounded-lg border p-4 shadow-card">
        <p className="text-success">success</p>
        <p className="text-warning">warning</p>
        <p className="text-info">info</p>
        <p className="text-destructive">destructive</p>
        <button className="bg-primary text-primary-foreground h-control rounded-md px-4">
          control 높이
        </button>
      </div>
    </div>
  </StrictMode>,
)
```

- [ ] **Step 4: 빌드로 검증**

Run: `npm run build`
Expected: 성공.

토큰이 CSS에 반영됐는지 확인:

```bash
grep -c -- "--color-surface-raised" dist/assets/*.css
```

Expected: `1` 이상. `0`이면 `@theme inline` 블록이 인식되지 않은 것이므로 import 순서를 확인한다.

- [ ] **Step 5: 다크 테마 확인**

Run: `npm run dev`

브라우저 콘솔에서 `document.documentElement.classList.add('dark')` 실행.
Expected: 배경이 어두워지고 텍스트가 밝아진다. 카드 배경이 본문 배경과 구분된다.

확인 후 dev 서버를 종료한다.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 디자인 토큰 체계 구축

색·radius·shadow·density·z-index를 tokens.css 한 곳에 모은다.
shadcn 기본 토큰에 어드민이 필요로 하는 success/warning/info와
surface-raised, 그리고 테이블 행·컨트롤 높이 축을 더했다.

전시 페이지에서 hover/focus를 정적으로 보여줘야 하므로
.state-hover / .state-focus 컨테이너로 강제하는 custom variant를 함께 정의한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: 라우팅 골격

**Files:**
- Create: `src/components/layout/nav-config.ts`, `src/routes/router.tsx`, `src/routes/Placeholder.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: Task 1의 `@/` 별칭, Task 2의 토큰 유틸리티
- Produces:
  - `navGroups: NavGroup[]` — `{ label: string; items: NavItem[] }`, `NavItem = { to: string; label: string; icon: LucideIcon; badge?: string }`
  - `router` — `createBrowserRouter` 결과. `main.tsx`가 `RouterProvider`에 전달
  - `Placeholder({ title }: { title: string })` — 미구현 라우트 화면

- [ ] **Step 1: react-router 설치**

```bash
npm install react-router
```

v7의 declarative 모드는 `react-router` 패키지 하나면 된다. `react-router-dom`은 설치하지 않는다.

- [ ] **Step 2: 네비게이션 IA 정의**

Create `src/components/layout/nav-config.ts`:

```ts
import {
  BookOpen, Box, Clock3, Component, FileText, LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'SYSTEM',
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard },
      { to: '/foundations', label: 'Foundations', icon: Box },
      { to: '/components', label: 'Components', icon: Component },
      { to: '/patterns', label: 'Patterns', icon: BookOpen },
      { to: '/templates', label: 'Templates', icon: FileText },
    ],
  },
  {
    label: 'WORKSPACE',
    items: [{ to: '/changelog', label: 'Changelog', icon: Clock3 }],
  },
]
```

- [ ] **Step 3: 준비 중 화면 작성**

Create `src/routes/Placeholder.tsx`:

```tsx
import { Construction } from 'lucide-react'

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
        <Construction size={22} />
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        이 영역은 아직 준비 중입니다. v0.2.0에서는 Components의 Button만 완성됩니다.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: 라우터 정의**

Create `src/routes/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Overview" /> },
      { path: 'foundations', element: <Placeholder title="Foundations" /> },
      { path: 'components', element: <Placeholder title="Components" /> },
      { path: 'patterns', element: <Placeholder title="Patterns" /> },
      { path: 'templates', element: <Placeholder title="Templates" /> },
      { path: 'changelog', element: <Placeholder title="Changelog" /> },
      { path: '*', element: <Placeholder title="페이지를 찾을 수 없습니다" /> },
    ],
  },
])
```

`AppShell`은 Task 4에서 만든다. 이 Task에서는 Step 5의 임시 구현으로 빌드를 통과시킨다.

- [ ] **Step 5: AppShell 임시 구현**

Create `src/components/layout/AppShell.tsx`:

```tsx
import { Outlet } from 'react-router'

export function AppShell() {
  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <Outlet />
    </main>
  )
}
```

Task 4에서 이 파일을 전면 교체한다.

- [ ] **Step 6: 진입점 교체**

Rewrite `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/routes/router'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 7: 빌드와 라우팅 확인**

Run: `npm run build`
Expected: 성공.

Run: `npm run dev`

`/`, `/foundations`, `/components`, `/patterns`, `/templates`, `/changelog`, `/없는경로` 를 주소창에 직접 입력해 확인한다.
Expected: 각각 해당 제목의 준비 중 화면. 마지막은 "페이지를 찾을 수 없습니다".

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: react-router 기반 라우팅 골격 추가

IA 전체를 라우트로 선언하고 미구현 영역은 준비 중 화면으로 연결한다.
v0.1.0에서는 사이드바 항목이 전부 동작하지 않는 버튼이었다.
"무엇이 있고 어디까지 됐는가"를 워크벤치가 스스로 보여줘야 한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 앱 셸 — Sidebar / Topbar / 다크모드

**Files:**
- Create: `src/lib/theme.ts`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`
- Modify: `src/components/layout/AppShell.tsx`
- Test: `src/lib/theme.test.ts`

**Interfaces:**
- Consumes: Task 3의 `navGroups`, `Outlet`
- Produces:
  - `resolveInitialTheme(stored: string | null, prefersDark: boolean): 'light' | 'dark'`
  - `applyTheme(theme: 'light' | 'dark'): void` — 루트에 `.dark` 토글 + localStorage 기록
  - `useTheme(): { theme, toggle }`
  - `Sidebar({ open, onClose }: { open: boolean; onClose: () => void })`
  - `Topbar({ onMenuClick }: { onMenuClick: () => void })`

- [ ] **Step 1: Vitest 설치와 설정**

```bash
npm install -D vitest
```

Create `vitest.config.ts`:

```ts
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

`package.json`의 `scripts`에 추가:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: 실패하는 테스트 작성**

Create `src/lib/theme.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { resolveInitialTheme } from '@/lib/theme'

describe('resolveInitialTheme', () => {
  it('저장된 값이 있으면 그것을 쓴다', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark')
    expect(resolveInitialTheme('light', true)).toBe('light')
  })

  it('저장된 값이 없으면 OS 설정을 따른다', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
    expect(resolveInitialTheme(null, false)).toBe('light')
  })

  it('저장된 값이 알 수 없는 문자열이면 OS 설정을 따른다', () => {
    expect(resolveInitialTheme('purple', true)).toBe('dark')
  })
})
```

- [ ] **Step 3: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/theme"`

- [ ] **Step 4: 최소 구현**

Create `src/lib/theme.ts`:

```ts
import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'adminds:theme'

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    resolveInitialTheme(
      localStorage.getItem(STORAGE_KEY),
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggle }
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 3 tests.

- [ ] **Step 6: Sidebar 작성**

Create `src/components/layout/Sidebar.tsx`:

```tsx
import { Command, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { navGroups } from '@/components/layout/nav-config'
import { currentRelease } from '@/data/releases'
import { cn } from '@/lib/utils'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          'bg-surface fixed inset-y-0 left-0 z-drawer flex w-60 flex-col border-r p-3 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-9 items-center gap-2 px-2">
          <div className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </div>
          <span className="text-sm font-bold tracking-tight">서비스 대시보드</span>
          <button
            className="text-muted-foreground ml-auto md:hidden"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-6" aria-label="서비스 대시보드 메뉴">
          {navGroups.map((group) => (
            <section key={group.label}>
              <p className="text-muted-foreground mb-1.5 px-2 text-2xs font-bold tracking-widest">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex h-control items-center gap-2.5 rounded-md px-2 text-sm',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-accent/60',
                    )
                  }
                >
                  <item.icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <em className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-2xs not-italic">
                      {item.badge}
                    </em>
                  )}
                </NavLink>
              ))}
            </section>
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

`z-drawer` 유틸리티는 Tailwind 기본에 없다. Step 8에서 처리한다.

- [ ] **Step 7: Topbar 작성**

Create `src/components/layout/Topbar.tsx`:

```tsx
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="bg-surface/90 sticky top-0 z-sticky flex h-14 items-center gap-3 border-b px-4 backdrop-blur md:px-8">
      <button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
        <Menu size={20} />
      </button>
      <div className="text-muted-foreground text-sm">Admin Design System</div>
      <button
        className="hover:bg-accent ml-auto grid size-8 place-items-center rounded-md"
        onClick={toggle}
        aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </header>
  )
}
```

- [ ] **Step 8: z-index 유틸리티가 생성됐는지 확인**

Task 2에서 `--z-index-sticky` / `--z-index-drawer`를 `@theme inline`에 선언했으므로
`z-sticky` / `z-drawer` 유틸리티가 이미 사용 가능해야 한다.

Run: `npm run build`

```bash
grep -c "z-index:20" dist/assets/*.css
```

Expected: `1` 이상. `0`이면 `src/styles/tokens.css`의 `@theme inline` 블록에
`--z-index-drawer: 20;` 이 있는지 확인한다.

- [ ] **Step 9: AppShell 완성**

Rewrite `src/components/layout/AppShell.tsx`:

```tsx
import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 10: 기존 releases.ts에서 필요한 필드 확인**

`Sidebar`가 `currentRelease.version`과 `currentRelease.title`을 쓴다. 현재 `src/data/releases.ts`에 두 필드가 모두 있으므로 이 Task에서는 수정하지 않는다. 전면 교체는 Task 5에서 한다.

- [ ] **Step 11: 빌드와 시각 확인**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

Run: `npm run dev`

확인 항목:
1. 사이드바의 6개 항목이 모두 이동하고, 현재 위치가 강조된다
2. 테마 토글이 동작하고, 새로고침해도 선택이 유지된다
3. 브라우저 창을 768px 미만으로 줄이면 사이드바가 숨고 햄버거가 나타난다
4. 햄버거로 연 드로어가 항목 클릭 또는 배경 클릭으로 닫힌다

- [ ] **Step 12: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 앱 셸과 다크모드 추가

Sidebar/Topbar/AppShell을 구성하고 테마를 localStorage에 보존한다.
OS 설정을 초기값으로 삼되 사용자의 명시적 선택이 우선한다.

z-index를 토큰 네임스페이스로 노출해 레이어 값이
컴포넌트마다 흩어지지 않게 한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: 데이터 레이어 — registry / releases / 알림

**Files:**
- Create: `src/lib/notifications.ts`
- Modify: `src/data/releases.ts` (전면 교체)
- Create: `src/data/registry.ts`
- Test: `src/data/registry.test.ts`, `src/data/releases.test.ts`, `src/lib/notifications.test.ts`

**Interfaces:**
- Consumes: Task 4의 Vitest 설정
- Produces:
  - `type ComponentMeta` — 아래 Step 4의 정의
  - `components: ComponentMeta[]`
  - `getComponent(id: string): ComponentMeta | undefined`
  - `getComponentsByCategory(category: ComponentCategory): ComponentMeta[]`
  - `componentStats(): { total: number; verified: number; stable: number }`
  - `type Release`, `releases: Release[]`, `currentRelease: Release`
  - `requestProgress(release: Release): { done: number; total: number }`
  - `hasUnseenRelease(lastSeen: string | null, latest: string): boolean`
  - `useUnseenRelease(): { unseen: boolean; markSeen: () => void }`

- [ ] **Step 1: registry 실패 테스트 작성**

Create `src/data/registry.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { components, componentStats, getComponent, getComponentsByCategory } from '@/data/registry'

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

  it('집계 숫자를 손으로 적지 않고 배열에서 센다', () => {
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
```

- [ ] **Step 2: releases 실패 테스트 작성**

Create `src/data/releases.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { currentRelease, releases, requestProgress } from '@/data/releases'

describe('releases', () => {
  it('최신 버전이 배열의 맨 앞이다', () => {
    expect(currentRelease).toBe(releases[0])
  })

  it('버전이 중복되지 않는다', () => {
    const versions = releases.map((r) => r.version)
    expect(new Set(versions).size).toBe(versions.length)
  })

  it('요청 반영 진행률을 센다', () => {
    const release = {
      ...currentRelease,
      requests: [
        { label: 'a', done: true },
        { label: 'b', done: false },
        { label: 'c', done: true },
      ],
    }
    expect(requestProgress(release)).toEqual({ done: 2, total: 3 })
  })

  it('요청이 없으면 0 / 0이다', () => {
    expect(requestProgress({ ...currentRelease, requests: [] })).toEqual({ done: 0, total: 0 })
  })
})
```

- [ ] **Step 3: 알림 실패 테스트 작성**

Create `src/lib/notifications.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasUnseenRelease } from '@/lib/notifications'

describe('hasUnseenRelease', () => {
  it('한 번도 본 적 없으면 미확인이다', () => {
    expect(hasUnseenRelease(null, 'v0.2.0')).toBe(true)
  })

  it('본 버전이 최신과 같으면 확인된 것이다', () => {
    expect(hasUnseenRelease('v0.2.0', 'v0.2.0')).toBe(false)
  })

  it('본 버전이 최신과 다르면 미확인이다', () => {
    expect(hasUnseenRelease('v0.1.0', 'v0.2.0')).toBe(true)
  })
})
```

- [ ] **Step 4: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `@/data/registry`와 `@/lib/notifications`를 찾지 못한다.

- [ ] **Step 5: registry 구현**

Create `src/data/registry.ts`:

```ts
export type ComponentCategory =
  | 'actions'
  | 'inputs'
  | 'navigation'
  | 'feedback'
  | 'data-display'

export type ComponentStatus = 'draft' | 'review' | 'stable' | 'deprecated'

export type AnatomyPart = {
  /** 해부도에 표시할 부위 이름 */
  part: string
  /** 치수·역할 설명 */
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
  guidelines: { do: string[]; dont: string[] }
  anatomy: AnatomyPart[]
  variants: string[]
  sizes: string[]
  states: string[]
  verified: boolean
}

export const components: ComponentMeta[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.2.0',
    changedIn: 'v0.2.0',
    purpose: '사용자가 즉시 실행할 수 있는 동작을 나타낸다. 페이지 이동은 링크를 쓴다.',
    guidelines: {
      do: [
        '한 화면의 주요 액션은 default 하나로 제한한다',
        '삭제·차단처럼 되돌리기 어려운 동작은 destructive를 쓴다',
        '처리에 시간이 걸리면 loading 상태로 중복 클릭을 막는다',
      ],
      dont: [
        '다른 페이지로 이동하는 데 버튼을 쓰지 않는다',
        '아이콘만 있는 버튼에 aria-label을 빠뜨리지 않는다',
        '나란히 놓인 버튼을 모두 default로 두지 않는다',
      ],
    },
    anatomy: [
      { part: 'Container', note: '높이는 size 토큰, 모서리는 radius-md' },
      { part: 'Leading icon', note: '16×16, 라벨과 8px 간격' },
      { part: 'Label', note: 'text-sm / font-medium' },
      { part: 'Focus ring', note: 'ring 토큰, 오프셋 2px' },
    ],
    variants: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    sizes: ['sm', 'default', 'lg', 'icon'],
    states: ['default', 'hover', 'focus', 'disabled', 'loading'],
    verified: false,
  },
]

export function getComponent(id: string): ComponentMeta | undefined {
  return components.find((c) => c.id === id)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return components.filter((c) => c.category === category)
}

export function componentStats() {
  return {
    total: components.length,
    verified: components.filter((c) => c.verified).length,
    stable: components.filter((c) => c.status === 'stable').length,
  }
}
```

- [ ] **Step 6: releases 전면 교체**

Rewrite `src/data/releases.ts`:

```ts
export type ReleaseChange = {
  target: string
  type: 'New' | 'Updated' | 'Fixed'
  note: string
}

export type ReleaseRequest = {
  label: string
  done: boolean
}

export type ReviewItem = {
  label: string
  category: string
  completed: boolean
}

export type Release = {
  version: string
  publishedAt: string
  title: string
  purpose: string
  changes: ReleaseChange[]
  requests: ReleaseRequest[]
  reviewItems: ReviewItem[]
  impact: string[]
}

/** 최신 버전이 배열의 맨 앞이다. */
export const releases: Release[] = [
  {
    version: 'v0.2.0',
    publishedAt: '2026-08-25',
    title: '토큰과 컴포넌트 배관을 연결했어요',
    purpose: 'Tailwind v4 + shadcn 기반으로 재작성하고, 메타데이터에서 전시 화면이 생성되는 구조를 세운다.',
    changes: [
      { target: 'Tokens', type: 'New', note: '색·radius·shadow·density·z-index를 한 곳에 모았어요.' },
      { target: 'AppShell', type: 'New', note: '사이드바 항목이 실제로 이동합니다.' },
      { target: 'Button', type: 'New', note: 'shadcn Button과 전시 페이지를 붙였어요.' },
      { target: 'Registry', type: 'New', note: '컴포넌트 메타에서 전시 화면이 자동 생성됩니다.' },
    ],
    requests: [
      { label: '컴포넌트 anatomy 표시', done: true },
      { label: '반응형 고려', done: true },
      { label: '새 버전 업데이트 알림', done: false },
    ],
    reviewItems: [
      { label: 'StateGrid의 hover 강제 표현이 실제 hover와 일치하는가', category: 'Components', completed: false },
      { label: '다크 모드에서 surface-raised 대비가 충분한가', category: 'Foundations', completed: false },
      { label: '720px에서 전시 그리드가 깨지지 않는가', category: 'Patterns', completed: false },
    ],
    impact: ['전체 화면', 'Button', 'Foundations'],
  },
  {
    version: 'v0.1.0',
    publishedAt: '2026-08-24',
    title: '첫 번째 기준선이 준비됐어요',
    purpose: '어드민 워크벤치의 첫 화면을 만들어 방향을 확인한다.',
    changes: [
      { target: 'Overview', type: 'New', note: '디자인 시스템 현황 화면을 만들었어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Overview'],
  },
]

export const currentRelease: Release = releases[0]

export function requestProgress(release: Release) {
  return {
    done: release.requests.filter((r) => r.done).length,
    total: release.requests.length,
  }
}
```

- [ ] **Step 7: 알림 로직 구현**

Create `src/lib/notifications.ts`:

```ts
import { useCallback, useState } from 'react'
import { currentRelease } from '@/data/releases'

const STORAGE_KEY = 'adminds:lastSeenVersion'

/** 마지막으로 확인한 버전이 최신과 다르면 미확인이다. */
export function hasUnseenRelease(lastSeen: string | null, latest: string): boolean {
  return lastSeen !== latest
}

export function useUnseenRelease() {
  const [lastSeen, setLastSeen] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )

  const markSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, currentRelease.version)
    setLastSeen(currentRelease.version)
  }, [])

  return {
    unseen: hasUnseenRelease(lastSeen, currentRelease.version),
    markSeen,
  }
}
```

- [ ] **Step 8: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 15 tests (theme 3 + registry 5 + releases 4 + notifications 3).

숫자가 맞지 않으면 실패한 테스트를 먼저 고친다.

- [ ] **Step 9: 빌드 확인**

Run: `npm run build`
Expected: 성공. `Sidebar`가 `currentRelease.title`을 쓰는데 새 스키마에도 `title`이 있으므로 깨지지 않는다.

- [ ] **Step 10: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: registry·releases 데이터 레이어와 알림 판정 추가

화면이 참조할 단일 진실 원천을 세운다. 컴포넌트 수와 검증 완료 수는
배열에서 세고, 손으로 적지 않는다 — v0.1.0에서는 숫자가 하드코딩되어
실제와 어긋날 수 있었다.

releases를 단일 객체에서 배열로 바꾸고 requests 필드를 더해
"내가 요청한 것이 반영됐는가"를 워크벤치가 직접 답하게 한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: 전시 컴포넌트 — Anatomy / VariantGrid / StateGrid

**Files:**
- Create: `src/components/docs/Anatomy.tsx`, `src/components/docs/VariantGrid.tsx`, `src/components/docs/StateGrid.tsx`, `src/components/docs/ComponentPage.tsx`

**Interfaces:**
- Consumes: Task 5의 `ComponentMeta`, Task 1의 `cn`
- Produces:
  - `Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode })`
  - `VariantGrid({ meta, render }: { meta: ComponentMeta; render: (o: { variant: string; size: string }) => ReactNode })`
  - `StateGrid({ meta, render }: { meta: ComponentMeta; render: (o: { state: string }) => ReactNode })`
  - `ComponentPage({ meta, preview, renderVariant, renderState }: ComponentPageProps)`

`render` 콜백이 이 설계의 핵심이다. 전시 컴포넌트는 어떤 컴포넌트인지 모른 채 조합만 전개하고, 실제 렌더링은 각 컴포넌트 페이지가 주입한다. 이 덕분에 컴포넌트가 늘어도 전시 코드는 늘지 않는다.

- [ ] **Step 1: Anatomy 작성**

Create `src/components/docs/Anatomy.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-8">
        {preview}
      </div>
      <ol className="flex flex-col gap-2.5">
        {meta.anatomy.map((part, index) => (
          <li key={part.part} className="flex gap-2.5">
            <span className="bg-primary text-primary-foreground mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold">
              {index + 1}
            </span>
            <div>
              <strong className="text-sm">{part.part}</strong>
              <p className="text-muted-foreground text-xs">{part.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 2: VariantGrid 작성**

Create `src/components/docs/VariantGrid.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'

export function VariantGrid({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (option: { variant: string; size: string }) => ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="text-muted-foreground sticky left-0 bg-surface px-3 py-2 text-2xs font-bold tracking-widest">
              VARIANT
            </th>
            {meta.sizes.map((size) => (
              <th
                key={size}
                className="text-muted-foreground px-3 py-2 text-2xs font-bold tracking-widest"
              >
                {size.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meta.variants.map((variant) => (
            <tr key={variant}>
              <td className="bg-surface sticky left-0 border-t px-3 py-3 text-sm font-medium">
                {variant}
              </td>
              {meta.sizes.map((size) => (
                <td key={size} className="border-t px-3 py-3">
                  {render({ variant, size })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: StateGrid 작성**

Create `src/components/docs/StateGrid.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'
import { cn } from '@/lib/utils'

/**
 * hover와 focus는 실제 입력 없이는 나타나지 않는다.
 * tokens.css에서 hover / focus-visible 변형을 .state-hover / .state-focus
 * 컨테이너 안에서도 적용되도록 확장했으므로, 여기서 그 클래스를 씌워
 * 정적으로 전시한다.
 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
}

export function StateGrid({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (option: { state: string }) => ReactNode
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {meta.states.map((state) => (
        <div key={state} className="rounded-lg border p-4">
          <p className="text-muted-foreground mb-3 text-2xs font-bold tracking-widest">
            {state.toUpperCase()}
          </p>
          <div className={cn('flex min-h-10 items-center', FORCE_CLASS[state])}>
            {render({ state })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: ComponentPage 틀 작성**

Create `src/components/docs/ComponentPage.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { Anatomy } from '@/components/docs/Anatomy'
import { StateGrid } from '@/components/docs/StateGrid'
import { VariantGrid } from '@/components/docs/VariantGrid'
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
  preview: ReactNode
  renderVariant: (option: { variant: string; size: string }) => ReactNode
  renderState: (option: { state: string }) => ReactNode
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-2xs font-bold tracking-widest">{title}</h2>
      {children}
    </section>
  )
}

export function ComponentPage({ meta, preview, renderVariant, renderState }: ComponentPageProps) {
  return (
    <div className="flex max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{meta.name}</h1>
          <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[meta.status])}>
            {meta.status}
          </span>
          {meta.verified && (
            <span className="text-muted-foreground text-2xs">검증 완료</span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{meta.purpose}</p>
        <p className="text-muted-foreground text-2xs">
          {meta.addedIn}에 추가 · {meta.changedIn}에서 마지막 변경
        </p>
      </header>

      <Section title="ANATOMY">
        <Anatomy meta={meta} preview={preview} />
      </Section>

      <Section title="GUIDELINES">
        <div className="grid gap-3 md:grid-cols-2">
          <ul className="flex flex-col gap-2 rounded-lg border p-4">
            {meta.guidelines.do.map((line) => (
              <li key={line} className="flex gap-2 text-sm">
                <Check size={15} className="text-success mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2 rounded-lg border p-4">
            {meta.guidelines.dont.map((line) => (
              <li key={line} className="flex gap-2 text-sm">
                <X size={15} className="text-destructive mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="ALL VARIATIONS">
        <div className="rounded-lg border">
          <VariantGrid meta={meta} render={renderVariant} />
        </div>
      </Section>

      <Section title="STATES">
        <StateGrid meta={meta} render={renderState} />
      </Section>
    </div>
  )
}
```

- [ ] **Step 5: 빌드 확인**

Run: `npm run build`
Expected: 성공. 아직 사용처가 없어 화면 변화는 없다.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 메타데이터 기반 전시 컴포넌트 추가

Anatomy/VariantGrid/StateGrid는 어떤 컴포넌트인지 모른 채
조합만 전개하고, 실제 렌더링은 render 콜백으로 주입받는다.
컴포넌트가 늘어도 전시 코드는 늘지 않게 하기 위함이다.

hover와 focus는 실제 입력 없이 나타나지 않으므로
tokens.css의 강제 변형 클래스로 정적 전시한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7 ★ 검증 지점: Button 관통

**Files:**
- Create: `src/components/ui/button.tsx`, `src/routes/components/ButtonPage.tsx`, `src/routes/components/ComponentsIndex.tsx`
- Modify: `src/routes/router.tsx`, `src/components/layout/nav-config.ts`, `src/data/registry.ts`

**Interfaces:**
- Consumes: Task 5의 `getComponent`, `components`, Task 6의 `ComponentPage`
- Produces:
  - `Button` — shadcn Button. props: `variant`, `size`, `asChild`, 그 외 `button` 속성
  - `buttonVariants` — cva 결과
  - `ComponentsIndex` — 카테고리별 컴포넌트 목록 화면
  - `/components/button` 라우트

- [ ] **Step 1: shadcn Button 추가**

```bash
npx shadcn@latest add button --yes
```

`src/components/ui/button.tsx`가 생성되고 `@radix-ui/react-slot`이 설치된다.

CLI가 실패하면 https://ui.shadcn.com/docs/components/button 의 소스를 `src/components/ui/button.tsx`에 직접 붙여넣고 `npm install @radix-ui/react-slot class-variance-authority`를 실행한다.

- [ ] **Step 2: Button이 토큰만 쓰는지 확인**

```bash
grep -nE '#[0-9a-fA-F]{3,6}|\[[0-9]+px\]' src/components/ui/button.tsx
```

Expected: 출력 없음. 하드코딩된 색이나 임의 px 값이 나오면 토큰 유틸리티로 교체한다.

- [ ] **Step 3: Components 목록 화면 작성**

Create `src/routes/components/ComponentsIndex.tsx`:

```tsx
import { Link } from 'react-router'
import { components } from '@/data/registry'

export function ComponentsIndex() {
  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-sm">
          등록된 컴포넌트 {components.length}개
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((meta) => (
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
    </div>
  )
}
```

- [ ] **Step 4: Button 전시 페이지 작성**

Create `src/routes/components/ButtonPage.tsx`:

```tsx
import { Loader2, Plus } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type ButtonSize = React.ComponentProps<typeof Button>['size']

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      preview={
        <Button>
          <Plus /> 새 사용자
        </Button>
      }
      renderVariant={({ variant, size }) => (
        <Button variant={variant as ButtonVariant} size={size as ButtonSize}>
          {size === 'icon' ? <Plus /> : '버튼'}
        </Button>
      )}
      renderState={({ state }) => {
        if (state === 'disabled') return <Button disabled>버튼</Button>
        if (state === 'loading') {
          return (
            <Button disabled>
              <Loader2 className="animate-spin" /> 저장 중
            </Button>
          )
        }
        return <Button>버튼</Button>
      }}
    />
  )
}
```

`size === 'icon'`일 때 라벨 없이 아이콘만 넣는 이유는 shadcn의 `icon` 사이즈가 정사각형이기 때문이다. 아이콘 전용 버튼은 실제 사용 시 `aria-label`이 필요하지만, 전시 격자에서는 표 헤더가 맥락을 준다.

- [ ] **Step 5: 라우트 연결**

`src/routes/router.tsx`의 `components` 라우트를 교체한다.

```tsx
{
  path: 'components',
  children: [
    { index: true, element: <ComponentsIndex /> },
    { path: 'button', element: <ButtonPage /> },
  ],
},
```

파일 상단에 import를 추가한다.

```tsx
import { ButtonPage } from '@/routes/components/ButtonPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'
```

- [ ] **Step 6: 사이드바에 컴포넌트 수 배지 연결**

`src/components/layout/nav-config.ts`에서 Components 항목에 배지를 붙인다. 숫자를 손으로 적지 않는다.

파일 상단에 import를 추가한다.

```ts
import { components } from '@/data/registry'
```

Components 항목을 교체한다.

```ts
{
  to: '/components',
  label: 'Components',
  icon: Component,
  badge: String(components.length).padStart(2, '0'),
},
```

- [ ] **Step 7: 빌드와 테스트**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

- [ ] **Step 8: 시각 검증 — 이 Task의 핵심**

Run: `npm run dev`

`/components/button`에서 확인한다.

1. Anatomy에 4개 부위가 번호와 함께 나오고, 미리보기에 실제 Button이 렌더링된다
2. All variations 표에 6 variant × 4 size = 24칸이 모두 채워진다
3. States에 5개 칸이 나오고, **hover 칸의 버튼이 마우스를 올리지 않아도 hover 색으로 보인다**
4. focus 칸에 포커스 링이 보인다
5. disabled 칸이 흐리게, loading 칸에 회전하는 스피너가 보인다
6. 다크 모드로 전환해도 위 전부가 읽힌다
7. 창을 720px로 줄여도 표가 가로 스크롤될 뿐 레이아웃이 깨지지 않는다
8. 사이드바 Components에 `01` 배지가 보인다

3번이 실패하면 `tokens.css`의 `@custom-variant hover` 정의를 확인한다. Tailwind가 `.state-hover &` 선택자를 생성했는지 빌드 CSS에서 확인할 수 있다:

```bash
npm run build && grep -c "state-hover" dist/assets/*.css
```

- [ ] **Step 9: 검증 결과를 registry에 기록**

Step 8의 8개 항목이 모두 통과하면 `src/data/registry.ts`의 Button 항목에서 `verified: false`를 `verified: true`로 바꾼다.

통과하지 못한 항목이 있으면 고친 뒤 Step 8을 다시 수행한다. 통과하지 않은 채로 `verified: true`를 적지 않는다.

- [ ] **Step 10: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Button 컴포넌트와 전시 페이지로 관통 슬라이스 완성

토큰 → 컴포넌트 → 메타데이터 → 전시 페이지 → 버전 기록까지
전 구간이 처음으로 연결됐다. 이 배관이 검증됐으므로
나머지 프리미티브는 같은 틀을 복제해 확장한다.

사이드바 배지도 registry 길이에서 계산한다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 11: 사용자 확인 요청**

여기서 멈춘다. 프리뷰 URL에서 Button 페이지를 사용자가 직접 보고, 전시 포맷을 확정한 뒤 Task 8로 넘어간다.

```bash
git push origin v0.2.0
```

Vercel 프리뷰 URL을 사용자에게 전달하고 승인을 기다린다.

---

## Task 8: 프리미티브 확장

**Files:**
- Create: `src/components/ui/badge.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `select.tsx`, `checkbox.tsx`, `switch.tsx`, `dialog.tsx`, `sonner.tsx`
- Create: `src/routes/components/BadgePage.tsx` 외 각 컴포넌트별 페이지
- Modify: `src/data/registry.ts`, `src/routes/router.tsx`

**Interfaces:**
- Consumes: Task 7에서 확정된 `ComponentPage` 사용 패턴
- Produces: 각 컴포넌트별 `/components/<id>` 라우트

**중요:** Task 7의 사용자 승인 없이 이 Task를 시작하지 않는다.

이 Task는 아래 5단계를 컴포넌트마다 반복한다. 순서는 Badge → Input → Label → Card → Select → Checkbox → Switch → Dialog → Toast.

- [ ] **Step 1: 컴포넌트 설치**

```bash
npx shadcn@latest add <name> --yes
```

- [ ] **Step 2: registry에 메타 추가**

`src/data/registry.ts`의 `components` 배열에 항목을 추가한다. Button 항목과 같은 형태로, 모든 필드를 채운다. `addedIn`과 `changedIn`은 `'v0.2.0'`, `verified`는 `false`로 시작한다.

Badge 예시:

```ts
{
  id: 'badge',
  name: 'Badge',
  category: 'data-display',
  status: 'stable',
  addedIn: 'v0.2.0',
  changedIn: 'v0.2.0',
  purpose: '항목의 상태나 분류를 짧은 라벨로 표시한다. 클릭 가능한 요소가 아니다.',
  guidelines: {
    do: [
      '상태 값은 색이 아니라 텍스트로도 구분되게 한다',
      '한 테이블에서 같은 의미에는 같은 variant를 쓴다',
    ],
    dont: [
      '배지를 버튼처럼 클릭 대상으로 쓰지 않는다',
      '한 행에 배지를 3개 이상 늘어놓지 않는다',
    ],
  },
  anatomy: [
    { part: 'Container', note: '높이 20px, radius-sm' },
    { part: 'Label', note: 'text-2xs / font-semibold' },
  ],
  variants: ['default', 'secondary', 'outline', 'destructive'],
  sizes: ['default'],
  states: ['default'],
  verified: false,
},
```

- [ ] **Step 3: 전시 페이지 작성**

`src/routes/components/<Name>Page.tsx`를 만든다. `ButtonPage.tsx`와 동일한 구조로, `getComponent('<id>')`를 호출하고 `ComponentPage`에 `preview` / `renderVariant` / `renderState`를 넘긴다.

Badge 예시:

```tsx
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Badge } from '@/components/ui/badge'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type BadgeVariant = React.ComponentProps<typeof Badge>['variant']

export function BadgePage() {
  const meta = getComponent('badge')
  if (!meta) return <Placeholder title="Badge 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      preview={<Badge>활성</Badge>}
      renderVariant={({ variant }) => <Badge variant={variant as BadgeVariant}>활성</Badge>}
      renderState={() => <Badge>활성</Badge>}
    />
  )
}
```

- [ ] **Step 4: 라우트 등록**

`src/routes/router.tsx`의 `components` children에 한 줄 추가한다.

```tsx
{ path: 'badge', element: <BadgePage /> },
```

- [ ] **Step 5: 검증하고 커밋**

Run: `npm run build && npm test`
Expected: 둘 다 성공. registry 테스트의 id 중복 검사가 자동으로 걸린다.

Run: `npm run dev` 후 `/components/<id>`에서 Task 7 Step 8의 8개 항목을 동일하게 확인한다.

통과하면 registry의 `verified`를 `true`로 바꾸고 커밋한다.

```bash
git add -A
git commit -m "feat: <Name> 컴포넌트와 전시 페이지 추가"
```

- [ ] **Step 6: 9개 컴포넌트를 모두 마친 뒤 releases 갱신**

`src/data/releases.ts`의 v0.2.0 항목 `changes` 배열에 추가한다.

```ts
{ target: 'Primitives', type: 'New', note: 'Badge·Input·Label·Card·Select·Checkbox·Switch·Dialog·Toast를 등록했어요.' },
```

- [ ] **Step 7: 최종 검증**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

`/components`에서 10개 카드가 모두 보이고 각 링크가 동작하는지 확인한다.
사이드바 Components 배지가 `10`인지 확인한다.

- [ ] **Step 8: main에 병합**

```bash
git add -A
git commit -m "feat: v0.2.0 프리미티브 확장 완료"
git push origin v0.2.0
git checkout main
git merge --no-ff v0.2.0 -m "release: v0.2.0 — 토큰·앱셸·전시 배관 구축"
git push origin main
```

---

## v0.2.0 완료 기준

아래를 모두 만족하면 v0.2.0이 끝난 것이다.

- [ ] 사이드바의 모든 항목이 실제로 이동한다. 동작하지 않는 버튼이 없다
- [ ] 컴포넌트 소스에 하드코딩된 색·간격 값이 없다
- [ ] `registry.ts`에 항목을 하나 추가하면 `/components` 목록과 사이드바 배지가 코드 수정 없이 따라온다
- [ ] `ComponentMeta`의 `variants` / `sizes` / `states`를 늘리면 전시 격자가 코드 수정 없이 따라온다
- [ ] 새 컴포넌트 추가가 "shadcn add → registry 항목 → 페이지 파일 복사 → 라우트 한 줄" 네 스텝으로 고정된다
- [ ] `npm test`가 통과한다
- [ ] 다크 모드와 720px에서 모든 전시 페이지가 읽힌다

## v0.2.0 범위 밖

아래는 v0.3.0 이후로 미룬다. 이 계획에서 구현하지 않는다.

- Overview 화면 재구축 (releases·registry를 읽는 현황판)
- Changelog 화면
- 알림 벨 UI — `useUnseenRelease`는 만들었으나 Topbar에 붙이지 않는다
- Foundations 화면 (Colors / Typography / Spacing / Icons)
- 어드민 패턴 (PageHeader / FilterBar / DataTable / EmptyState / ConfirmDialog)
- 컴포넌트 페이지의 Playground / Cases / Usage / History 섹션
- 빠른 검색(⌘K)
