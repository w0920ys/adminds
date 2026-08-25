# 어드민 디자인 시스템 워크벤치 v0.5.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 용어를 한국어로 통일하고 제목 위계를 세우며, PC에 sticky 목차를 두고 지침의 do/don't를 열 단위로 묶어 읽는 경험을 정리한다.

**Architecture:** 목차는 각 전시 컴포넌트가 데이터를 내보내는 대신 렌더된 DOM의 제목을 훑어 만든다 — 컴포넌트를 추가할 때 목차 배선을 빠뜨릴 일이 없다. LNB 중첩은 표시와 순서의 문제이므로 라우트는 건드리지 않고 `DocLink.children`과 평탄화로 푼다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui, react-router v8, lucide-react, Vitest, Pretendard

**Spec:** `docs/superpowers/specs/2026-08-25-admin-design-system-v0.5.0-design.md`

## Global Constraints

- 작업 브랜치는 `v0.5.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기(`[3px]`, `[#abc]`, `[calc(...)]`) 금지** — `[&_svg]:size-4` 같은 임의 **셀렉터** 변형은 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
  ```

- **언어 규칙** — 문서의 구조와 설명은 한국어. 다음 둘만 영어로 남긴다: **페이지 이름**(`Button`, `Color`, `Design Token`)과 **코드 식별자**(`variant`, `--color-primary`, `text-2xs`).
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 네비게이션과 목차는 파생이어야 한다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **문구는 Foundations의 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표(라벨·표 셀·제목에는 안 찍음), 번역투 회피.
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사.

---

## Task 1: 용어 한글화와 제목 위계

**Files:**
- Modify: `src/components/docs/DocPage.tsx`, `src/components/docs/ComponentPage.tsx`, `src/components/docs/PropertyBlock.tsx`, `src/components/docs/GuidelineBlock.tsx`, `src/routes/foundations/WritingPage.tsx`, 그리고 영어 섹션 제목이 남은 `src/routes/foundations/*.tsx`

**Interfaces:** 시그니처 변화 없음

- [ ] **Step 1: 제목 위계 조정**

`src/components/docs/DocPage.tsx`를 다음으로 교체한다.

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
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-base">{description}</p>}
      </header>
      {children}
    </article>
  )
}

/**
 * 섹션 제목은 본문보다 커야 한다.
 * 이전에는 text-2xs 대문자 라벨이라 본문보다 작아 위계가 뒤집혀 있었다.
 * 대문자 변환은 한글에 적용되지 않으므로 없앤다.
 */
export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}
```

- [ ] **Step 2: 컴포넌트 페이지의 섹션 제목 한글화**

`src/components/docs/ComponentPage.tsx`의 `DocSection title` 여섯 개를 바꾼다.

| 지금 | 바꿀 것 |
|---|---|
| `Anatomy` | `구조` |
| `Playground` | `조합해보기` |
| `Properties` | `속성` |
| `Guidelines` | `지침` |
| `Usage` | `사용 예` |
| `Cases` | `예외 상황` |

`extraSections`의 `title`은 페이지가 넘기는 값이므로 그대로 둔다.

- [ ] **Step 3: 하위 제목 크기**

`src/components/docs/PropertyBlock.tsx`의 축 제목 `h3`가 `text-sm font-semibold`다. `text-base font-semibold`로 키운다. 그 아래 설명은 `text-xs`에서 `text-sm`으로.

`src/components/docs/GuidelineBlock.tsx`의 지침 제목 `h3`도 같게 맞춘다. 설명 문단도 `text-xs`에서 `text-sm`으로.

- [ ] **Step 4: Foundations의 남은 영어 섹션 제목 정리**

다음으로 영어 제목이 남아 있는 곳을 찾는다.

```bash
grep -rn 'DocSection title="[A-Za-z]' src/routes/
```

찾은 것을 한국어로 바꾼다. **페이지 이름은 바꾸지 않는다** — `DocPage title`은 그대로다. `DocSection title`만 대상이다.

`--color-`처럼 코드 식별자가 제목에 들어가는 경우는 그대로 둔다.

- [ ] **Step 5: 언어 규칙을 Writing 문서에 명문화**

`src/routes/foundations/WritingPage.tsx`에 섹션을 하나 더한다. 위치는 표기 규칙 표 앞이 자연스럽다.

`DocSection title="한국어와 영어"`로 두고 다음을 담는다.

- 문서의 구조와 설명은 한국어로 쓴다
- 페이지 이름은 영어로 둔다 — LNB·GNB·URL과 한 벌로 움직이기 때문이다
- 코드 식별자는 영어로 둔다 — 코드와 1:1로 대응해야 찾을 수 있기 때문이다. `variant`, `--color-primary`, `text-2xs`
- 기술 고유명사는 원문 그대로 쓴다 — `API`, `Webhook`, `OAuth`. 이 규칙은 표기 규칙 표에도 이미 있으니 중복 서술하지 말고 가리킨다
- 판단이 갈리면 **화면에서 그 낱말을 클릭하거나 검색할 일이 있는가**로 정한다. 있으면 영어, 없으면 한국어

좋은 예 / 나쁜 예 한 쌍을 `CopyPair`로 붙인다 — 섹션 제목이 `ANATOMY`인 경우와 `구조`인 경우.

- [ ] **Step 5-1: 표기 규칙 표에 한 행 추가**

같은 페이지의 표기 규칙 표에 행을 더한다.

| 항목 | 이 시스템의 표기 | 쓰지 않는 표기 |
|---|---|---|
| 문서 구조 | 한국어 — 구조, 속성, 지침 | Anatomy, Properties, Guidelines |

- [ ] **Step 6: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공. 54 tests.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -rn 'DocSection title="[A-Za-z]' src/routes/ src/components/
```
Expected: 첫 grep은 출력 없음. 둘째는 코드 식별자가 제목인 경우만 남아야 하며, 남았다면 무엇이고 왜인지 보고한다.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 문서 용어를 한국어로 통일하고 제목 위계를 세움

한 페이지 안에서 '개요'와 'ANATOMY'가 나란히 나오고 있었다.
본문이 한국어이고 Foundations가 이미 한글 제목을 쓰므로 그쪽으로 맞춘다.
페이지 이름과 코드 식별자만 영어로 남긴다 — 화면에서 클릭하거나
검색할 일이 있는 낱말이기 때문이다.

섹션 제목이 text-2xs 대문자라 본문보다 작아 위계가 뒤집혀 있었다.
제목 층을 크기로 구분한다.

다음에 다시 고민하지 않도록 이 규칙을 Writing 문서에 적는다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: LNB 2단 중첩

**Files:**
- Modify: `src/components/layout/nav-config.ts`, `src/components/layout/Lnb.tsx`
- Test: `src/components/layout/nav-config.test.ts`

**Interfaces:**
- Produces:
  - `type DocLink = { to: string; label: string; updatedAt: string; children?: DocLink[] }`
  - `flattenDocs(items: DocLink[]): DocLink[]` — 부모 → 자식 순 평탄화
  - `docOrder`, `findSection`, `findAdjacent`, `findDoc`는 시그니처 그대로

- [ ] **Step 1: 실패하는 테스트 추가**

`src/components/layout/nav-config.test.ts`에 추가한다. import에 `flattenDocs`를 더한다.

```ts
describe('flattenDocs', () => {
  it('부모 다음에 자식이 온다', () => {
    const tree: DocLink[] = [
      { to: '/a', label: 'A', updatedAt: '2026-08-25', children: [
        { to: '/a/1', label: 'A1', updatedAt: '2026-08-25' },
        { to: '/a/2', label: 'A2', updatedAt: '2026-08-25' },
      ] },
      { to: '/b', label: 'B', updatedAt: '2026-08-25' },
    ]
    expect(flattenDocs(tree).map((d) => d.to)).toEqual(['/a', '/a/1', '/a/2', '/b'])
  })

  it('자식이 없으면 그대로다', () => {
    const tree: DocLink[] = [{ to: '/a', label: 'A', updatedAt: '2026-08-25' }]
    expect(flattenDocs(tree).map((d) => d.to)).toEqual(['/a'])
  })
})

describe('Color 하위 문서', () => {
  it('Color Role과 Palette가 Color의 자식이다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const color = foundations.items.find((d) => d.to === '/foundations/color')!
    expect(color.children?.map((c) => c.to)).toEqual([
      '/foundations/color-role',
      '/foundations/palette',
    ])
  })

  it('이전·다음 순서가 Color 다음에 하위 문서를 지나 Typography로 간다', () => {
    expect(findAdjacent('/foundations/color').next?.to).toBe('/foundations/color-role')
    expect(findAdjacent('/foundations/color-role').next?.to).toBe('/foundations/palette')
    expect(findAdjacent('/foundations/palette').next?.to).toBe('/foundations/typography')
    expect(findAdjacent('/foundations/typography').prev?.to).toBe('/foundations/palette')
  })
})
```

기존 `docOrder` describe의 `모든 섹션의 항목을 LNB 순서대로 이어붙인다` 테스트가 `section.items.length` 합을 쓴다면, 중첩 때문에 깨진다. 다음으로 바꾼다.

```ts
  it('모든 섹션의 문서를 LNB 순서대로 이어붙인다', () => {
    const expected = sections.reduce((n, s) => n + flattenDocs(s.items).length, 0)
    expect(docOrder.length).toBe(expected)
    expect(docOrder[0]).toBe(sections[0].items[0])
  })
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `flattenDocs`가 export되지 않고 `children`이 없다.

- [ ] **Step 3: nav-config 수정**

`DocLink`에 `children`을 더한다.

```ts
export type DocLink = {
  to: string
  label: string
  /** 문서 최종 수정일. YYYY-MM-DD */
  updatedAt: string
  /** LNB에서 이 항목 아래 들여쓰기로 놓이는 하위 문서. 순서에서는 부모 바로 뒤에 온다 */
  children?: DocLink[]
}
```

Foundations의 `items`에서 Color Role과 Palette를 Color의 `children`으로 옮긴다. 라우트 경로는 바꾸지 않는다.

```ts
      {
        to: '/foundations/color',
        label: 'Color',
        updatedAt: '2026-08-25',
        children: [
          { to: '/foundations/color-role', label: 'Color Role', updatedAt: '2026-08-25' },
          { to: '/foundations/palette', label: 'Palette', updatedAt: '2026-08-25' },
        ],
      },
```

평탄화 함수를 더하고 `docOrder`와 `findAdjacent`가 그것을 쓰게 한다.

```ts
/** 부모 다음에 자식이 오도록 평탄화한다. 순서가 필요한 곳은 모두 이것을 쓴다. */
export function flattenDocs(items: DocLink[]): DocLink[] {
  return items.flatMap((item) => [item, ...flattenDocs(item.children ?? [])])
}

export const docOrder: DocLink[] = sections.flatMap((section) => flattenDocs(section.items))
```

`findAdjacent`의 `docs` 계산을 평탄화 기준으로 바꾼다.

```ts
  const docs = flattenDocs(section.items).filter((item) => item.to !== section.to)
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS. 실제 개수를 보고한다 — `flattenDocs` 2개와 `Color 하위 문서` 2개가 늘어난다.

`라우트와 네비게이션의 일치` 두 테스트가 여전히 통과해야 한다. `docOrder`가 평탄화를 거치므로 경로 집합은 그대로다.

- [ ] **Step 5: Lnb 중첩 렌더링**

`src/components/layout/Lnb.tsx`의 문서 목록 부분을 재귀 렌더링으로 바꾼다. 파일 안에 작은 항목 컴포넌트를 둔다.

```tsx
function LnbItem({
  doc,
  depth,
  onClose,
}: {
  doc: DocLink
  depth: number
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
            'flex h-control items-center rounded-md text-sm',
            depth === 0 ? 'px-2' : 'ml-2 border-l pl-3',
            isActive
              ? 'bg-accent text-accent-foreground font-semibold'
              : 'text-muted-foreground hover:bg-accent/60',
          )
        }
      >
        {doc.label}
      </NavLink>
      {doc.children?.map((child) => (
        <LnbItem key={child.to} doc={child} depth={depth + 1} onClose={onClose} />
      ))}
    </>
  )
}
```

문서 목록 `<nav>` 안에서 `section.items.map((item) => <LnbItem key={item.to} doc={item} depth={0} onClose={onClose} />)`으로 부른다.

모바일 드로어의 섹션 전환 목록은 그대로 둔다.

`DocLink` 타입 import를 추가한다.

- [ ] **Step 6: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: LNB에서 Color Role과 Palette를 Color 아래로

두 문서는 Color의 하위 문서인데 같은 층에 놓여 있었다.
ColorPage의 개요가 이미 둘을 자기 하위로 설명하고 있어 문서와 목록이 어긋났다.

중첩은 표시와 순서의 문제이므로 라우트는 건드리지 않는다.
순서가 필요한 곳은 부모 다음에 자식이 오도록 평탄화해서 쓴다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: PC 목차

**Files:**
- Create: `src/components/layout/TableOfContents.tsx`
- Modify: `src/components/layout/AppShell.tsx`

**Interfaces:**
- Produces: `TableOfContents()` — props 없음. 현재 경로의 `main` 안 제목을 훑는다

**설계 이유:** 각 전시 컴포넌트가 목차용 데이터를 내보내게 하면 컴포넌트를 추가할 때마다 목차 배선을 함께 해야 한다. 이미 렌더된 제목을 읽으면 한 곳에 갇히고 빠뜨릴 일이 없다.

- [ ] **Step 1: TableOfContents 작성**

Create `src/components/layout/TableOfContents.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { cn } from '@/lib/utils'

type Heading = {
  id: string
  text: string
  /** 2 또는 3 */
  level: number
}

/** 제목 텍스트에서 id를 만든다. 한글을 그대로 두면 URL 조각이 길어지므로 순번을 섞는다 */
function makeId(text: string, index: number): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  return `section-${index}-${slug || 'x'}`
}

export function TableOfContents() {
  const { pathname } = useLocation()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    /* 렌더가 끝난 뒤 훑는다. 측정이 아니라 목록 수집이므로 한 프레임 뒤로 미뤄도 된다 */
    const collect = () => {
      const nodes = [...main.querySelectorAll('h2, h3')]
      const found = nodes.map((node, index) => {
        if (!node.id) node.id = makeId(node.textContent ?? '', index)
        return {
          id: node.id,
          text: node.textContent?.trim() ?? '',
          level: node.tagName === 'H2' ? 2 : 3,
        }
      })
      setHeadings(found)
      setActive(found[0]?.id ?? null)
      return nodes
    }

    const nodes = collect()
    if (nodes.length === 0) return

    /*
     * 화면 위쪽 1/3 안에 들어온 제목 중 가장 아래 것을 현재 위치로 본다.
     * 스크롤 방향과 무관하게 "지금 읽고 있는 절"이 잡힌다.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id)
        if (visible.length > 0) setActive(visible[visible.length - 1])
      },
      { root: document.querySelector('main'), rootMargin: '0px 0px -67% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [pathname])

  if (headings.length < 2) return null

  return (
    <nav
      aria-label="이 문서의 목차"
      className="hidden w-56 shrink-0 overflow-y-auto py-8 pr-6 xl:block"
    >
      <p className="text-muted-foreground mb-3 text-sm font-semibold">목차</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? 'location' : undefined}
              className={cn(
                'block border-l py-1.5 text-sm',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                active === heading.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: AppShell에 배치**

`src/components/layout/AppShell.tsx`의 콘텐츠 행에 목차를 더한다.

```tsx
      <div className="flex min-h-0 flex-1">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
            <DocFooterNav />
          </div>
        </main>
        <TableOfContents />
      </div>
```

목차가 `main` 밖에 있어야 `main`의 스크롤과 독립적으로 고정된다. `main`이 이미 `overflow-y-auto`이므로 목차는 형제로 두면 그 자리에 남는다.

import를 추가한다.

- [ ] **Step 3: 앵커 이동이 동작하는지 확인**

`main`이 스크롤 컨테이너이므로 `#id` 링크가 창이 아니라 `main`을 스크롤해야 한다. 브라우저 기본 동작으로 되지 않으면 `onClick`에서 `scrollIntoView`를 부른다.

이 확인은 컨트롤러가 브라우저에서 한다. 구현자는 코드까지만 둔다.

- [ ] **Step 4: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: PC에 문서 목차 추가

문서가 길어지면서 현재 위치를 알 수 없었다.
각 전시 컴포넌트가 목차용 데이터를 내보내게 하면 컴포넌트를 더할 때마다
배선을 함께 해야 하므로, 이미 렌더된 제목을 훑어 만든다.

자리가 없는 좁은 화면에서는 숨긴다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 지침의 do/don't 그룹화

**Files:**
- Modify: `src/components/docs/GuidelineBlock.tsx`, `src/components/docs/ExampleFrame.tsx`

**Interfaces:** `GuidelineBlock({ guideline, renderExample })` 시그니처 그대로

**문제:** 지금은 예시 프레임 두 개가 한 줄, 그 아래 `DoDont`가 또 두 카드로 나와 **네 덩어리**다. 하나의 지침이 네 조각으로 흩어져 별개 가이드처럼 읽힌다.

- [ ] **Step 1: ExampleFrame이 높이를 채우게**

`src/components/docs/ExampleFrame.tsx`의 바깥 `div`에 `flex h-full flex-col`을, 내용 `div`에 `flex-1`을 준다. 열 안에서 늘어날 수 있어야 같은 줄의 두 예시 높이가 맞는다.

`kind` 라벨 부분은 그대로 둔다.

- [ ] **Step 2: GuidelineBlock 재작성**

Rewrite `src/components/docs/GuidelineBlock.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Guideline } from '@/data/registry'
import { cn } from '@/lib/utils'

function Side({
  kind,
  example,
  rules,
}: {
  kind: 'do' | 'dont'
  example?: ReactNode
  rules: string[]
}) {
  if (!example && rules.length === 0) return null

  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border p-4">
      <p
        className={cn(
          'flex items-center gap-1.5 text-2xs font-bold tracking-widest',
          kind === 'do' ? 'text-success' : 'text-destructive',
        )}
      >
        {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
        {kind === 'do' ? 'DO' : "DON'T"}
      </p>

      {example && <ExampleFrame>{example}</ExampleFrame>}

      {rules.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rules.map((line) => (
            <li key={line} className="text-sm">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function GuidelineBlock({
  guideline,
  renderExample,
}: {
  guideline: Guideline
  renderExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold">{guideline.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{guideline.body}</p>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-2">
        <Side
          kind="do"
          example={renderExample?.(guideline.id, 'do')}
          rules={guideline.do ?? []}
        />
        <Side
          kind="dont"
          example={renderExample?.(guideline.id, 'dont')}
          rules={guideline.dont ?? []}
        />
      </div>
    </section>
  )
}
```

`ExampleFrame`을 `kind` 없이 부르는 이유는 라벨이 열 위쪽으로 올라갔기 때문이다. 프레임 안에 라벨을 또 두면 같은 말이 두 번 나온다.

바깥 테두리를 지웠다 — 열마다 테두리가 있으므로 지침 전체를 한 번 더 감싸면 상자가 겹쳐 보인다. 지침 사이 간격은 `ComponentPage`의 `flex flex-col gap-3`이 준다. 그 값이 좁아 보이면 `gap-8`로 키운다.

- [ ] **Step 3: 지침 사이 간격 확인**

`src/components/docs/ComponentPage.tsx`에서 지침 목록을 감싸는 `div`의 `gap`을 `gap-8`로 키운다. 바깥 테두리가 없어졌으므로 간격이 구분의 몫을 진다.

- [ ] **Step 4: 빌드·테스트와 대괄호 검사**

Run: `npm run build && npm test`
Expected: 둘 다 성공.

```bash
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```
Expected: 출력 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: 지침의 do와 don't를 하나의 열로 묶음

예시 프레임 두 개와 규칙 목록 두 개가 각각 따로 놓여, 하나의 지침이
네 조각으로 흩어져 별개 가이드처럼 읽혔다.
한 열이 하나의 입장이 되게 묶고 같은 줄의 두 열 높이를 맞춘다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다. 컨트롤러가 다음을 확인한다.

1. 섹션 제목이 전부 한국어이고 본문보다 크다
2. 제목 층이 크기로 구분된다 (페이지 제목 > 섹션 제목 > 하위 제목 > 본문)
3. PC에서 오른쪽에 목차가 보이고, 스크롤하면 현재 위치가 따라 강조된다
4. 목차의 `h3` 항목이 들여쓰기된다
5. 목차 항목을 누르면 그 절로 이동한다
6. 좁은 화면에서 목차가 숨는다
7. LNB에서 Color Role과 Palette가 Color 아래 들여쓰기로 보인다
8. 이전/다음 순서가 Color → Color Role → Palette → Typography다
9. 지침의 do와 don't가 각각 하나의 열이고, 같은 줄의 두 열 높이가 같다
10. 다크 모드와 720px에서 모든 페이지가 읽힌다

## v0.5.0 완료 기준

- [ ] 위 10개 항목을 모두 통과한다
- [ ] `grep -rn 'DocSection title="[A-Za-z]' src/`가 코드 식별자 외에는 비어 있다
- [ ] Writing 문서에 언어 규칙이 적혀 있다
- [ ] 임의 값 대괄호 표기가 없다
- [ ] `npm test`와 `npm run build`가 통과한다

## v0.5.0 범위 밖

- 나머지 Foundations 피드백 (사용자가 이후 전달 예정)
- `useMeasuredTokens` 5벌 중복 해소
- 프리미티브 확장 · History 섹션 · 알림 벨 · Updates 실제 Changelog · 어드민 패턴 · ⌘K 검색
