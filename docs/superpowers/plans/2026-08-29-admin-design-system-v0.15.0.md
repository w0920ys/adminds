# 어드민 디자인 시스템 v0.15.0 구현 계획 — 레이아웃/네비게이션 재구성

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GNB 모바일 헤더 순서, LNB 모바일 서랍의 위치·1depth/2depth 상태 기계, DocFooterNav 구분선, SiteFooter 좌우 2단 구성 — `src/components/layout/` 안의 레이아웃 껍데기 넷을 스펙대로 고친다.

**Architecture:** 네 파일이 서로 독립적이다 — 상태나 데이터를 공유하지 않는다. `Gnb.tsx`(마크업 순서만), `Lnb.tsx`(서랍 슬라이드 방향 + 새 뷰 상태 하나), `DocFooterNav.tsx`(클래스 하나 제거), `SiteFooter.tsx`(레이아웃 재구성). 데스크톱 LNB·TableOfContents·AppShell 골격은 건드리지 않는다.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v4, react-router v8, lucide-react. Vitest는 `node` 환경(jsdom 없음) — 컴포넌트 렌더링 테스트를 쓰지 않는다.

## Global Constraints

- 작업 브랜치는 `v0.15.0`이다. `main`에 직접 커밋하지 않는다
- **Vitest는 `node` 환경에서 돈다. jsdom이 없다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않는다. 이 계획의 모든 작업은 레이아웃 컴포넌트의 마크업·상태를 바꾸는 일이라 새 Vitest 테스트가 없다 — 검증은 `npm run build`(tsc+vite) 통과와 개발 서버(`http://localhost:5205`)에서 실제로 눌러 보고 `getComputedStyle`/스크린샷으로 확인하는 것으로 한다
- **코드에 대해 사실이 아닌 것을 주석에 쓰지 않는다.** 이 프로젝트가 매 회차 가장 많이 낸 결함이다
- LNB의 데스크톱 정적 사이드바 위치(왼쪽)·TableOfContents·AppShell의 3단 레이아웃 골격은 건드리지 않는다
- 새 `useEffect`로 "prop이 바뀌면 state를 리셋"하는 패턴을 쓰지 않는다 — 이 프로젝트의 oxlint가 effect 안 setState를 이미 경고로 잡고 있다(`ColorRolePage.tsx`·`TypographyPage.tsx`·`combobox.tsx`에 기존 경고 셋이 있다, 새 경고를 추가하지 않는다). 대신 렌더 중 조건부로 state를 맞추는 React 패턴(아래 Task 2 코드가 예시)을 쓴다
- 임의 값 대괄호 표기 금지
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않는다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다
- `releases.ts`에 새로 쓰는 항목은 간결한 한 줄 요약으로만 쓴다(사용자 지시, v0.13.0 이후 규칙)
- 사용 안 하게 된 import는 지운다(`Link`가 `Lnb.tsx`에서 그 예다 — Task 2 참고)

---

## Task 1: GNB — 모바일 헤더 순서

**Files:**
- Modify: `src/components/layout/Gnb.tsx:32-34,74-80`

**Interfaces:**
- Consumes: 없음
- Produces: 없음

- [ ] **Step 1: 햄버거 버튼을 테마 토글 뒤로 옮긴다**

지금 `Gnb.tsx:29-81`은 이렇다(요약):

```tsx
<div className="flex h-14 items-center gap-2 px-4 md:px-6">
  <button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
    <Menu size={20} />
  </button>

  <Link to="/" className="flex items-center gap-2">
    ...
  </Link>

  <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="전역 메뉴">
    ...
  </nav>

  <button
    className="text-muted-foreground hover:bg-accent hover:text-foreground ml-auto flex h-8 items-center gap-2 rounded-md border px-2.5"
    onClick={() => setSearchOpen(true)}
    aria-label="문서 검색"
  >
    ...
  </button>

  <button
    className="hover:bg-accent ml-1 grid size-8 place-items-center rounded-md"
    onClick={toggle}
    aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
  >
    {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
  </button>
</div>
```

`<button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기"><Menu size={20} /></button>` 블록(지금 32-34행)을 통째로 잘라내, 테마 토글 버튼(지금 74-80행) 바로 뒤로 옮긴다. 옮기면서 클래스를 `"md:hidden"`에서 `"ml-1 md:hidden"`으로 바꾼다 — 테마 토글이 검색 버튼 뒤에 `ml-1`로 바짝 붙어 있는 것과 같은 간격 규칙을 따른다(컨테이너의 `gap-2`만 믿으면 다른 버튼 쌍보다 간격이 벌어져 보인다).

바뀐 뒤 `<div className="flex h-14 items-center gap-2 px-4 md:px-6">` 안의 순서는: `Link(로고)` → `nav(전역 메뉴, 데스크톱만)` → `button(검색)` → `button(테마 토글)` → `button(햄버거, 모바일만)`.

- [ ] **Step 2: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 3: 브라우저로 확인**

개발 서버(5205)에서 뷰포트를 375px 폭(모바일)으로 좁혀 헤더를 본다. 로고가 맨 왼쪽, 검색·테마 토글·햄버거가 이 순서로 맨 오른쪽에 있는지 확인한다. 햄버거를 눌러 서랍이 여전히 열리는지(`onMenuClick` 연결이 안 끊겼는지) 확인한다. 768px 이상(데스크톱)에서는 햄버거 자체가 안 보이는지(`md:hidden`) 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/layout/Gnb.tsx
git commit -m "feat(layout): 모바일 헤더의 메뉴 버튼을 테마 토글 뒤로 옮긴다

LNB 서랍이 오른쪽에서 열리게 되므로(다음 Task), 여는 버튼도 같은
쪽에 두는 것이 자연스럽다."
```

---

## Task 2: LNB — 모바일 서랍 위치 + 1depth/2depth 상태 기계

**Files:**
- Modify: `src/components/layout/Lnb.tsx`(전체)

**Interfaces:**
- Consumes: `findSection`·`isGroup`·`sections`·`UPDATE_DOT_SECTION_IDS`(모두 `@/components/layout/nav-config`, 기존 함수·값 그대로)
- Produces: 없음(이 컴포넌트 밖에서 쓰는 새 export 없음)

이 Task는 파일 전체를 아래 내용으로 바꾼다. 기존 `LnbItem` 헬�퍼는 그대로 두고(문서 항목 하나를 그리는 재귀 컴포넌트, 변경 없음), `Lnb` 컴포넌트 본체만 새로 짠다.

- [ ] **Step 1: 지금 동작을 기록해 둔다(회귀 확인용)**

개발 서버(5205)에서 375px 폭으로 좁혀 햄버거를 눌러 서랍을 연다. 지금은: 서랍이 **왼쪽**에서 슬라이드해 들어오고, 맨 위에 "Sections"(전체 섹션 4개) 목록과 그 아래 현재 섹션의 문서 목록이 **한 화면에 같이** 보인다. 이 스크린샷을 남겨 두면 Step 6의 "달라진 점"을 눈으로 비교하기 쉽다.

- [ ] **Step 2: `Lnb.tsx`를 아래 내용으로 통째로 바꾼다**

```tsx
import { ChevronLeft, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import type { DocLink } from '@/components/layout/nav-config'
import { findSection, isGroup, sections, UPDATE_DOT_SECTION_IDS } from '@/components/layout/nav-config'
import { UpdateDot } from '@/components/layout/UpdateDot'
import { currentRelease } from '@/data/releases'
import { isUpdatedInRelease } from '@/lib/freshness'
import { cn } from '@/lib/utils'

function LnbItem({
  doc,
  depth,
  showDots,
  onClose,
}: {
  doc: DocLink
  depth: number
  showDots: boolean
  onClose: () => void
}) {
  return (
    <>
      <NavLink
        to={doc.to}
        end
        onClick={onClose}
        className={({ isActive }) =>
          cn(
            'flex h-control items-center gap-1.5 text-16',
            depth === 0 ? 'rounded-md px-2' : 'ml-2 border-l pl-3',
            isActive
              ? 'bg-accent text-accent-foreground font-semibold'
              : 'text-muted-foreground hover:bg-accent/60',
          )
        }
      >
        <span className="truncate">{doc.label}</span>
        {showDots && isUpdatedInRelease(doc.updatedAt, currentRelease.publishedAt) && (
          <UpdateDot className="ml-auto" />
        )}
      </NavLink>
      {doc.children?.map((child) => (
        <LnbItem key={child.to} doc={child} depth={depth + 1} showDots={showDots} onClose={onClose} />
      ))}
    </>
  )
}

/*
 * 모바일 서랍은 두 화면을 오간다 — 'sections'(1depth, 전역 섹션 목록)와
 * 'section'(2depth, 한 섹션의 문서 목록). 어느 섹션을 2depth에서 보여줄지는
 * 경로가 아니라 이 상태가 정한다 — 1depth에서 섹션을 탭해도 아직 이동한
 * 게 아니므로(문서를 탭하기 전까지는), 실제 경로가 속한 섹션과 다를 수
 * 있다. 데스크톱 정적 사이드바는 이 상태를 쓰지 않는다 — 항상 2depth만
 * 보여주고 뒤로가기가 없다.
 */
type LnbView = { kind: 'sections' } | { kind: 'section'; sectionId: string }

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const routeSection = findSection(pathname)

  const [view, setView] = useState<LnbView>({ kind: 'section', sectionId: routeSection.id })

  /*
   * 서랍을 새로 열 때마다 현재 경로의 섹션 2depth부터 다시 시작한다 —
   * 마지막으로 보던 화면(1depth였든 다른 섹션이었든)을 기억하지 않는다.
   * useEffect로 "prop이 바뀌면 state를 리셋"하지 않는다 — 렌더 중에
   * 이전 open 값과 비교해 바로 맞춘다(React가 권하는 패턴이고, 이
   * 프로젝트의 oxlint가 effect 안 setState를 이미 경고로 잡는다).
   */
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setView({ kind: 'section', sectionId: routeSection.id })
  }

  const browsedSection =
    view.kind === 'section'
      ? (sections.find((item) => item.id === view.sectionId) ?? routeSection)
      : routeSection

  /* 업데이트 점은 세 섹션(foundations·components·patterns)에서만 보인다 */
  const showDots = UPDATE_DOT_SECTION_IDS.has(browsedSection.id)

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-drawer bg-foreground/20 md:hidden"
          onClick={onClose}
          aria-label="메뉴 닫기"
        />
      )}
      {/*
       * overflow-y-auto는 md 밑에서도 켠다. 서랍은 fixed inset-y-0이라 높이가
       * 화면에 묶이는데 목록은 그보다 길다 — 모바일에서 목록이 1368px까지 자라
       * 아래쪽 항목에 손이 닿지 않았다. 게다가 잘리지 않은 만큼이 문서 높이로
       * 새어 나가 html의 scrollHeight가 화면의 여덟 배가 됐다.
       */}
      <aside
        className={cn(
          'bg-surface fixed inset-y-0 right-0 z-drawer flex w-60 flex-col overflow-y-auto border-l p-3 transition-transform',
          'md:static md:h-full md:shrink-0 md:translate-x-0',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/*
         * 헤더 행은 1depth와 2depth가 다르다 — 1depth는 "Sections" 라벨만,
         * 2depth는 뒤로가기+섹션 이름. 뒤로가기는 md:hidden이다(데스크톱
         * 정적 사이드바는 1depth 자체가 없다).
         */}
        {view.kind === 'sections' ? (
          <div className="flex h-9 items-center px-2">
            <p className="text-muted-foreground text-11 font-bold tracking-widest">Sections</p>
            <button
              className="text-muted-foreground ml-auto md:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex h-9 items-center gap-1 px-2">
            <button
              className="text-muted-foreground -ml-1 md:hidden"
              onClick={() => setView({ kind: 'sections' })}
              aria-label="섹션 목록으로 돌아가기"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-muted-foreground text-11 font-bold tracking-widest">
              {browsedSection.label.toUpperCase()}
            </p>
            <button
              className="text-muted-foreground ml-auto md:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/*
         * 1depth: 전역 섹션 목록. 탭해도 이동하지 않는다 — 2depth 미리보기로
         * 전환할 뿐이다(그래서 Link가 아니라 button이다). 데스크톱에는 없다.
         */}
        {view.kind === 'sections' && (
          <nav className="mt-2 flex flex-col md:hidden" aria-label="섹션 목록">
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView({ kind: 'section', sectionId: item.id })}
                aria-current={item.id === routeSection.id ? 'page' : undefined}
                className={cn(
                  'flex h-control items-center rounded-md px-2 text-left text-16',
                  item.id === routeSection.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/60',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/*
         * 2depth: 한 섹션의 문서 목록. 데스크톱에서는 항상 이것만 보인다 —
         * view.kind가 'sections'여도 md 이상에서는 md:flex가 hidden을 덮는다
         * (모바일 폭에서 뒤로가기를 누른 채로 창을 넓히는 드문 경우까지 desktop
         * 정적 사이드바가 항상 문서 목록을 보여주게 한다).
         */}
        <nav
          className={cn('mt-2 flex flex-col', view.kind === 'sections' && 'hidden md:flex')}
          aria-label={`${browsedSection.label} 문서 목록`}
        >
          {browsedSection.items.map((item) =>
            isGroup(item) ? (
              /* 묶음은 이동하지 않으므로 링크가 아니라 목록의 머리글이다 */
              <section key={item.label} className="mt-8 flex flex-col first:mt-0">
                <h2 className="text-muted-foreground mb-2 px-2 text-11 font-bold tracking-widest">
                  {item.label.toUpperCase()}
                </h2>
                {item.items.map((doc) => (
                  <LnbItem key={doc.to} doc={doc} depth={0} showDots={showDots} onClose={onClose} />
                ))}
              </section>
            ) : (
              <LnbItem key={item.to} doc={item} depth={0} showDots={showDots} onClose={onClose} />
            ),
          )}
        </nav>
      </aside>
    </>
  )
}
```

주의할 점 셋:
1. `Link` import를 뺐다 — 1depth 섹션 목록이 이제 `button`이라 더 안 쓴다. `NavLink`는 `LnbItem` 안에서 여전히 쓴다.
2. `useEffect`를 안 쓴다 — Global Constraints에 적은 대로, 렌더 중 `open`과 `wasOpen`을 비교해 상태를 맞춘다.
3. 데스크톱(`md:` 이상)에서는 `open` prop과 무관하게 `aside`가 항상 화면에 보인다(`md:translate-x-0`) — 그래서 2depth `nav`의 `hidden md:flex`가 중요하다. 이게 없으면 아주 드문 경우(모바일 폭에서 뒤로가기를 누른 채 창을 넓힘)에 데스크톱 사이드바가 빈 채로 보인다.

- [ ] **Step 3: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

Expected: 새 경고 없음(특히 `react(set-state-in-effect)`나 미사용 import 경고가 새로 생기면 안 된다).

- [ ] **Step 4: 브라우저로 서랍 위치를 확인한다**

개발 서버(5205)에서 375px 폭으로 좁혀 햄버거를 누른다. 서랍이 **오른쪽**에서 슬라이드해 들어오는지 확인한다(`getComputedStyle`로 `aside`의 `right`가 0이고 `left`가 `auto`인지, 또는 스크린샷으로 오른쪽에 붙어 있는지).

- [ ] **Step 5: 브라우저로 1depth/2depth 전환을 확인한다**

같은 375px 폭에서, 어떤 문서 페이지(예: `/components/button`)에 있는 상태로 서랍을 연다. 다음을 순서대로 확인한다:
1. 서랍을 열자마자 **Components 섹션의 문서 목록**(2depth)이 바로 보이는지 — "Sections" 목록이 먼저 보이면 안 된다
2. 맨 위에 뒤로가기(←) 아이콘 + "COMPONENTS" 라벨이 있는지
3. 뒤로가기를 누르면 1depth(Foundations/Get Started/Components/Patterns 네 항목)로 바뀌는지, 라벨이 "Sections"로 바뀌는지
4. 1depth에서 "Foundations"를 탭하면 **주소는 그대로**인 채(`window.location.pathname`이 안 바뀜) 2depth가 Foundations 문서 목록으로 바뀌는지
5. 그 2depth에서 아무 문서(예: "Color")를 탭하면 실제로 그 문서로 이동하고 서랍이 닫히는지
6. 서랍을 다시 열면(이동한 새 페이지 기준) 다시 그 섹션의 2depth부터 시작하는지 — 방금 봤던 1depth를 기억하지 않는지

- [ ] **Step 6: 데스크톱에서 회귀가 없는지 확인한다**

뷰포트를 768px 이상으로 넓힌다. 왼쪽에 LNB가 정적 사이드바로 그대로 있고, 현재 섹션의 문서 목록이 보이는지 확인한다(뒤로가기 버튼·"Sections" 헤더는 안 보여야 한다 — `md:hidden`). 다른 문서로 이동하면 사이드바 내용이 새 섹션 기준으로 바뀌는지 확인한다(기존 동작 그대로).

- [ ] **Step 7: 커밋**

```bash
git add src/components/layout/Lnb.tsx
git commit -m "feat(layout): 모바일 LNB 서랍을 오른쪽으로 옮기고 1depth/2depth로 나눈다

지금까지는 서랍을 열면 전체 섹션 목록과 현재 섹션의 문서 목록이
한 화면에 같이 보였다. 이제 서랍을 열면 현재 섹션의 문서 목록부터
보이고, 뒤로가기를 누르면 섹션 목록으로 전환된다."
```

---

## Task 3: DocFooterNav — 구분선 제거

**Files:**
- Modify: `src/components/layout/DocFooterNav.tsx:17`

**Interfaces:**
- Consumes: 없음
- Produces: 없음

- [ ] **Step 1: `border-t pt-6`을 뺀다**

`DocFooterNav.tsx:17`:

```tsx
<footer className="mt-16 flex flex-col gap-4 border-t pt-6">
```

를

```tsx
<footer className="mt-16 flex flex-col gap-4">
```

로 바꾼다. `border-t`(구분선)와 `pt-6`(그 선 위 패딩, 선이 없으면 의미가 없다)을 함께 뺀다. `mt-16`(본문과의 위 여백)은 그대로 둔다 — 이게 유일한 구분 여백이 된다.

- [ ] **Step 2: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 3: 브라우저로 확인**

개발 서버(5205)에서 이전/다음 문서 링크가 있는 페이지(예: `/foundations/color`)를 열어, 본문과 "Last updated" 사이에 더 이상 가로선이 없고 여백만 있는지 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/layout/DocFooterNav.tsx
git commit -m "fix(layout): 문서 하단 이동 영역 위 구분선을 없앤다"
```

---

## Task 4: SiteFooter — 좌우 2단 재구성

**Files:**
- Modify: `src/components/layout/SiteFooter.tsx`(전체)

**Interfaces:**
- Consumes: `sections`(`@/components/layout/nav-config`, 기존 값 그대로)
- Produces: 없음

- [ ] **Step 1: `SiteFooter.tsx`를 아래 내용으로 통째로 바꾼다**

```tsx
import { Command } from 'lucide-react'
import { Link } from 'react-router'
import { sections } from '@/components/layout/nav-config'

const LINKEDIN = 'https://www.linkedin.com/in/yoon-sunwoo-649956204/'
const EMAIL = 'w0920ys@gmail.com'

export function SiteFooter() {
  return (
    // main 안에 있어 암묵적 contentinfo 역할을 잃으므로 역할을 명시해 랜드마크로 남긴다
    <footer
      role="contentinfo"
      className="mt-20 flex flex-col gap-8 border-t pt-8 md:mt-24 md:flex-row md:justify-between"
    >
      <div className="flex flex-col gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </span>
          <span className="text-16 font-bold tracking-tight">서비스 대시보드</span>
        </Link>
        <p className="text-muted-foreground text-11">
          © {new Date().getFullYear()} sunwooyoon. All rights reserved.
        </p>
      </div>

      <div className="flex gap-12">
        <nav aria-label="섹션 이동" className="flex flex-col gap-2">
          <p className="text-muted-foreground text-11 font-bold tracking-widest">MENU</p>
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              className="text-muted-foreground hover:text-foreground text-12"
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="연락처" className="flex flex-col gap-2">
          <p className="text-muted-foreground text-11 font-bold tracking-widest">CONTACT</p>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground text-12"
          >
            LinkedIn
          </a>
          <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-foreground text-12">
            {EMAIL}
          </a>
        </nav>
      </div>
    </footer>
  )
}
```

바뀐 점: 로고(GNB와 같은 배지+문구)와 copyright를 왼쪽에 세로로 쌓았다. 오른쪽은 "MENU"/"CONTACT" 라벨(Lnb의 그룹 헤더와 같은 `text-11 font-bold tracking-widest` 스타일)을 붙인 두 세로 목록을 나란히 뒀다. 모바일(`flex-col`)에서는 왼쪽 블록 다음에 오른쪽 2컬럼 블록이 아래로 쌓이고, `md:flex-row md:justify-between`에서 좌우로 벌어진다. 바깥 `footer`의 `border-t pt-8`(본문과 이 푸터 전체를 가르는 선)은 그대로 둔다 — 이번 요청은 DocFooterNav의 선만 없애는 것이었지 이 선이 아니다.

- [ ] **Step 2: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 3: 브라우저로 확인**

개발 서버(5205)에서 아무 문서 페이지나 열어 맨 아래까지 스크롤한다.
- 768px 이상: 왼쪽에 로고+copyright, 오른쪽에 MENU/CONTACT 2컬럼이 가로로 나란한지 확인
- 375px: 로고+copyright가 위, MENU/CONTACT 2컬럼이 그 아래로 쌓이는지 확인
- 로고를 눌러 `/`로 이동하는지, MENU 링크들이 각 섹션으로 이동하는지, LinkedIn·이메일 링크가 살아있는지 확인

- [ ] **Step 4: 커밋**

```bash
git add src/components/layout/SiteFooter.tsx
git commit -m "feat(layout): 사이트 푸터를 로고+copyright와 메뉴 2컬럼으로 다시 짠다"
```

---

## 자체 검토 기록

**스펙 커버리지 확인:**
- 1절(GNB 순서) — Task 1
- 2절(LNB 위치 + 상태 기계) — Task 2
- 3절(DocFooterNav 구분선) — Task 3
- 4절(SiteFooter 재구성) — Task 4
- 범위 밖 항목(데스크톱 LNB 위치·TableOfContents·AppShell 골격) — 이 계획 어디서도 건드리지 않음, Global Constraints에 명시

**타입 일관성:** `LnbView`는 Task 2에서 처음 정의되고 같은 파일(`Lnb.tsx`) 안에서만 쓰인다. 다른 Task와 이름 충돌 없음. `browsedSection`(`NavSection` 타입, `nav-config.ts`가 이미 export)도 마찬가지.

**플레이스홀더 스캔:** 없음.

**설계 스펙과의 차이 하나(의도적 구체화):** 스펙의 `LnbView` 타입은 `{ kind: 'section' } | { kind: 'sections' }`로만 적었으나, "1depth에서 섹션을 탭하면 경로 이동 없이 2depth가 바뀐다"는 스펙 문장을 그대로 구현하려면 *어느 섹션*을 보여줄지 저장할 자리가 필요하다 — 그래서 이 계획은 `{ kind: 'section'; sectionId: string }`으로 넓혔다. 스펙의 의도(경로 이동 없는 미리보기)를 그대로 따르는 자연스러운 구체화이며, 새 사용자 결정이 필요한 지점이 아니다.
