# Foundations Layout 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Foundations에 breakpoint·콘텐츠 폭·grid 관례를 다루는 새 문서 페이지("Layout")를 하나 추가한다.

**Architecture:** 새 토큰이나 코드 변경 없이, 지금 이 저장소가 실제로 쓰는 값(Tailwind v4 기본 breakpoint, `AppShell.tsx`의 `max-w-6xl`, 반복되는 `grid-cols` 패턴)을 있는 그대로 문서화하는 정적 페이지 하나. `Spacing`/`Typography` 페이지와 같은 `DocPage`/`DocSection`/`DoDont` 뼈대를 따르되, 뒷받침하는 CSS 토큰이 없으므로 `TokenTable`(CSS 변수 전용)은 쓰지 않고 페이지 안 지역 상수로 데이터를 둔다.

**Tech Stack:** React 19 + TypeScript, react-router, Tailwind v4(정적 클래스, 임의 값 대괄호 금지).

## Global Constraints

- 스펙: `docs/superpowers/specs/2026-08-29-foundations-layout-design.md`
- 범위는 문서화만이다. `tokens.css`에 새 CSS 커스텀 프로퍼티를 추가하지 않는다. `AppShell.tsx`의 `max-w-6xl`을 포함해 기존 코드를 바꾸지 않는다 — 인용만 한다.
- nav 순서: Foundations 안에서 **Spacing 바로 뒤, Iconography 바로 앞**에 넣는다.
- 화면에 나오는 숫자를 손으로 적지 않는다는 이 저장소의 규칙(README·registry.json 관례)은 이 페이지에도 적용된다 — 다만 이 페이지가 다루는 "이 저장소가 breakpoint를 얼마나 자주 쓰는가" 같은 값은 뒷받침하는 실측 스크립트나 테스트가 없으므로, **정확한 개수를 문장에 박지 않는다.** 대신 정성적으로 쓴다("대부분", "드물게", "아직 쓰지 않는다") — 코드가 바뀌어도 조용히 거짓말이 되지 않게 하기 위해서다.
- 임의 값 대괄호 표기(`[3px]`, `[#abc]`) 금지. 단, 기존 관례상 폭이 다른 두 칸을 가리키는 `grid-cols-[auto_1fr]` 같은 표현은 **인용문**(코드 예시)으로 보여주는 것이지 이 페이지 자신의 클래스가 아니므로 해당하지 않는다.
- 언어 규칙 — 구조를 가리키는 이름(변수·파일·클래스명)은 영문, 설명은 한국어.
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사, em-dash 쓰지 않는다.
- Vitest는 `node` 환경에서 돈다. jsdom이 없다 — 이 페이지를 렌더링하는 테스트는 쓰지 않는다(기존 Foundations 페이지 전부가 그렇다). 검증은 `npm run build`(tsc+vite)와 `npm test` 통과, 그리고 개발 서버에서 실제로 렌더링·nav·이전/다음 링크를 확인하는 것으로 한다.
- `npm run build`와 `npm test` 통과가 완료 조건이다.

---

### Task 1: Foundations Layout 페이지

**Files:**
- Create: `src/routes/foundations/LayoutPage.tsx`
- Modify: `src/routes/routes.tsx` (import 1줄 + route 1줄)
- Modify: `src/components/layout/nav-config.ts` (Foundations 묶음에 항목 1개 추가)
- Modify: `src/routes/get-started/section-roles.ts` (Foundations 한 줄 설명에 "레이아웃" 추가)

**Interfaces:**
- Consumes: `DocPage`/`DocSection`(`@/components/docs/DocPage`), `DoDont`(`@/components/docs/DoDont`) — 기존 컴포넌트, 시그니처 변경 없음
- Produces: `LayoutPage`(`src/routes/foundations/LayoutPage.tsx`에서 named export) — 다른 Task가 없으므로 이 Task 밖에서 소비하는 곳 없음

- [ ] **Step 1: `src/routes/foundations/LayoutPage.tsx`를 만든다**

`SpacingPage.tsx`/`TypographyPage.tsx`와 같은 뼈대(`DocPage` → 여러 `DocSection` → `DoDont`로 마무리)를 따르되, 뒷받침하는 CSS 토큰이 없으므로 지역 상수로 데이터를 둔다:

```tsx
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'

/**
 * Tailwind v4 기본값 그대로다 — 이 저장소는 breakpoint를 커스텀하지
 * 않는다(tokens.css에 --breakpoint-* 없음, tailwind.config 파일 자체가
 * 없음). 표의 순서는 작은 것부터다.
 */
const BREAKPOINTS = [
  { prefix: 'sm', minWidth: '40rem (640px)' },
  { prefix: 'md', minWidth: '48rem (768px)' },
  { prefix: 'lg', minWidth: '64rem (1024px)' },
  { prefix: 'xl', minWidth: '80rem (1280px)' },
  { prefix: '2xl', minWidth: '96rem (1536px)' },
]

const GRID_PATTERNS = [
  {
    pattern: 'sm:grid-cols-2 · md:grid-cols-2',
    usage: '카드·예시가 반복되는 목록',
    example: 'DoDont · ExampleList · PatternsOverview',
  },
  {
    pattern: 'grid-cols-[auto_1fr]',
    usage: '라벨과 값처럼 폭이 다른 두 칸',
    example: 'Steps · Field',
  },
  {
    pattern: 'grid-cols-3',
    usage: '좁게 묶이는 세 칸',
    example: 'Voice and Tone · Iconography',
  },
]

export function LayoutPage() {
  return (
    <DocPage
      title="Layout"
      description="화면이 큰 틀에서 어떻게 나뉘는지 — 반응형 기준점, 콘텐츠 폭, 반복되는 격자 패턴입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          색·타이포·간격처럼 값 하나가 토큰으로 떨어지는 대신, 이 문서는 지금 이 저장소가
          실제로 쓰는 반응형 기준점과 폭, 격자 패턴을 있는 그대로 보입니다. 통일된 grid
          시스템이나 breakpoint 토큰은 아직 없습니다 — 새로 만들지 않고, 지금 화면들이
          실제로 어떻게 나뉘는지부터 정확히 적습니다.
        </p>
      </DocSection>

      <DocSection title="Breakpoints">
        <p className="text-muted-foreground text-16">
          Tailwind v4 기본 다섯 단계를 그대로 씁니다. 이 저장소는 반응형 분기 대부분을{' '}
          <code className="text-12">sm</code>과 <code className="text-12">md</code>에서
          만듭니다 — 예를 들어 GNB의 데스크톱 메뉴와 모바일 메뉴 버튼, LNB 서랍의 2뎁스
          전환이 모두 <code className="text-12">md</code> 기준입니다.{' '}
          <code className="text-12">lg</code>는 드물게 쓰고,{' '}
          <code className="text-12">xl</code>과 <code className="text-12">2xl</code>은
          아직 쓰지 않습니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-11 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">PREFIX</th>
                <th scope="col" className="px-3 py-2 font-bold">MIN-WIDTH</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp) => (
                <tr key={bp.prefix}>
                  <th scope="row" className="border-t px-3 py-3 font-medium">
                    <code className="text-12">{bp.prefix}</code>
                  </th>
                  <td className="text-muted-foreground border-t px-3 py-3">{bp.minWidth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Content width">
        <p className="text-muted-foreground text-16">
          페이지 콘텐츠 영역의 폭과 본문 줄 길이는 서로 다른 값을 씁니다. 화면 전체를 쓰는
          콘텐츠 영역은 <code className="text-12">AppShell</code>이 정합니다.
        </p>
        <div className="rounded-lg border p-4">
          <code className="text-12">
            {'<div className="mx-auto flex max-w-6xl gap-10">'}
          </code>
        </div>
        <p className="text-muted-foreground text-16">
          본문+TOC 두 컬럼을 합쳐 <code className="text-12">max-w-6xl</code>(1152px)입니다.
          같은 자리에서 안쪽 여백도 화면 폭에 따라{' '}
          <code className="text-12">px-5 py-8</code> → <code className="text-12">sm:px-8 py-10</code> →{' '}
          <code className="text-12">md:px-10 py-12</code>로 늘어납니다.
        </p>
        <p className="text-muted-foreground text-16">
          반면 문단처럼 줄글을 읽는 자리는 화면 폭과 무관하게 줄 길이 자체가
          가독성을 정합니다. 문서 본문은{' '}
          <code className="text-12">max-w-2xl</code>(672px)로 고정합니다 — 화면이 넓다고
          한 줄이 한없이 길어지면 오히려 읽기 어려워집니다.
        </p>
      </DocSection>

      <DocSection title="Grid">
        <p className="text-muted-foreground text-16">
          통일된 grid 토큰은 없습니다. 대신 이 저장소 곳곳에서 반복되는 패턴 세 가지가
          있습니다.
        </p>
        <div className="divide-y rounded-lg border">
          {GRID_PATTERNS.map((row) => (
            <div key={row.pattern} className="flex flex-col gap-1 p-4">
              <code className="text-12">{row.pattern}</code>
              <span className="text-muted-foreground text-14">{row.usage}</span>
              <span className="text-muted-foreground text-11">{row.example}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-16">
          한 줄짜리 배치는 grid 대신 flex로 충분합니다 — grid는 칸이 둘 이상으로 갈릴 때만
          씁니다.
        </p>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '반응형은 sm과 md 위주로 설계한다',
            '페이지 콘텐츠 폭은 max-w-6xl을 벗어나지 않는다',
            '카드·예시가 반복되는 목록은 sm:grid-cols-2나 md:grid-cols-2 관례를 따른다',
          ]}
          dont={[
            '임의로 새 breakpoint 값을 만든다',
            '임의 값 대괄호 표기([3px] · [#abc])를 쓴다',
            '근거 없이 lg·xl 단계에 새 레이아웃을 얹는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

- [ ] **Step 2: `src/routes/routes.tsx`에 라우트를 추가한다**

`import { IconographyPage } from '@/routes/foundations/IconographyPage'`(51번째 줄) 다음, `import { PalettePage } from '@/routes/foundations/PalettePage'`(52번째 줄) 앞에 알파벳 순서대로 끼워 넣는다:

```tsx
import { IconographyPage } from '@/routes/foundations/IconographyPage'
import { LayoutPage } from '@/routes/foundations/LayoutPage'
import { PalettePage } from '@/routes/foundations/PalettePage'
```

route 배열은 nav-config와 같은 논리 순서를 따르는 기존 관례가 있다(알파벳 순이 아니다) — `{ path: 'foundations/spacing', element: <SpacingPage /> }` 다음, `{ path: 'foundations/iconography', element: <IconographyPage /> }` 앞에 끼워 넣는다:

```tsx
      { path: 'foundations/spacing', element: <SpacingPage /> },
      { path: 'foundations/layout', element: <LayoutPage /> },
      { path: 'foundations/iconography', element: <IconographyPage /> },
```

- [ ] **Step 3: `src/components/layout/nav-config.ts`에 nav 항목을 추가한다**

`{ to: '/foundations/spacing', ... }` 다음, `{ to: '/foundations/iconography', ... }` 앞에 끼워 넣는다(오늘 날짜를 `updatedAt`으로 쓴다 — 이 저장소의 다른 최근 항목들과 같은 값):

```tsx
      { to: '/foundations/spacing', label: 'Spacing', summary: '4px 기반 간격과 어드민 밀도 축', updatedAt: '2026-08-29' },
      { to: '/foundations/layout', label: 'Layout', summary: '반응형 기준점, 콘텐츠 폭, 격자 패턴', updatedAt: '2026-08-29' },
      { to: '/foundations/iconography', label: 'Iconography', summary: '아이콘 크기·스트로크·사용 규칙', updatedAt: '2026-08-29' },
```

- [ ] **Step 4: `src/routes/get-started/section-roles.ts`의 Foundations 설명을 갱신한다**

지금:
```ts
  foundations: '색·타이포·간격 같은 토큰과, 말투와 문구처럼 코드에 담기지 않는 원칙을 다룹니다.',
```

이렇게 바꾼다 — "레이아웃"이 다루는 값은 CSS 토큰이 아니므로(이 페이지 자체가 그 사실을 명시한다) "토큰과" 뒤에 "관례"를 더해 정확하게 만든다:

```ts
  foundations: '색·타이포·간격·레이아웃 같은 토큰과 관례, 말투와 문구처럼 코드에 담기지 않는 원칙을 다룹니다.',
```

- [ ] **Step 5: 테스트를 돌려 기존 nav/route 정합성 테스트를 통과하는지 확인한다**

Run: `npm test`
Expected: 모두 통과. 특히 다음 세 그룹이 이번 변경을 검증한다 — 실패하면 원인을 이 Step에서 바로 고친다:
- `src/components/layout/nav-config.test.ts`의 "라우트와 네비게이션의 일치"(`docOrder`와 `registeredPaths`가 서로 완전히 일치해야 한다 — routes.tsx와 nav-config.ts 양쪽에 다 넣지 않으면 여기서 잡힌다)
- `src/components/layout/nav-config.test.ts`의 "updatedAt"(모든 문서에 `YYYY-MM-DD` 형식의 `updatedAt`이 있어야 한다)
- `src/routes/get-started/section-roles.test.ts`(Step 4는 무관해 보여도 이 테스트는 손대지 않는 한 계속 통과한다 — 그래도 확인한다)

- [ ] **Step 6: 빌드로 타입과 번들을 확인한다**

Run: `npm run build`
Expected: `tsc -b`와 `vite build` 모두 통과. 새 파일에 타입 에러가 없어야 한다.

- [ ] **Step 7: 개발 서버에서 실제로 확인한다**

`npm run dev`로 띄운 뒤(이미 떠 있다면 그대로) `/foundations/layout`에 접속해:
- Breakpoints 표, Content width 인용, Grid 목록, Guidelines가 순서대로 보이는지
- LNB에서 Spacing과 Iconography 사이에 Layout이 있는지
- Layout 문서 하단의 이전/다음 링크가 각각 Spacing·Iconography로 가는지
- 다크 모드에서도 표·인용 블록의 대비가 깨지지 않는지

눈으로 확인한다. `npm run lint`도 돌려 새 파일에 경고가 없는지 확인한다.

- [ ] **Step 8: 커밋한다**

```bash
git add src/routes/foundations/LayoutPage.tsx src/routes/routes.tsx src/components/layout/nav-config.ts src/routes/get-started/section-roles.ts
git commit -m "feat(foundations): 반응형 기준점과 격자 관례를 담은 Layout 문서를 새로 짓는다"
```

---

## 실행 방식 메모

새 파일 1개 + 기존 파일 3개(각각 한두 줄)뿐인 작은 자기완결적 작업이다. 이번 세션의 Install/llms.txt 작업과 같은 성격이라 워크트리·SDD 없이 지금 세션에서 바로 진행하는 것을 권장한다.
