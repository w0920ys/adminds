# Container Grid System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** momeokji-admin이 섹션마다 손으로 따로 짓던 grid-cols·gap·padding을 컨테이너 1개·그리드 행 1개·span recipe 6개(Full/Half/Third/Quarter/Sixth/Two-thirds+One-third)로 통일하고, adminds의 Foundations > Layout 문서에 이 시스템을 반영한다.

**Architecture:** 새 React 컴포넌트는 만들지 않는다 — Tailwind 클래스 문자열로 이뤄진 순수 문서 시스템이다. adminds 쪽은 `LayoutPage.tsx`의 "Content width"·"Grid" 두 섹션 문서를 교체하고, momeokji-admin 쪽은 실제 grid 사용처를 이 recipe로 맞춘다. **두 저장소를 완전히 독립적으로** 다룬다 — 서로의 git 커밋에 의존하지 않는다.

**Tech Stack:** React 19 + TypeScript, Tailwind v4, Vite. adminds는 Vitest(`npm test`)·oxlint를 쓰고, momeokji-admin은 Vitest(`npm test`, 테스트 파일 1개)·oxlint(`npm run lint`)를 쓴다. 두 저장소 다 `npm run build`가 `tsc -b && vite build`다.

## Global Constraints

- 새 `Container`/`Grid` React 컴포넌트를 만들지 않는다 — 순수 Tailwind 클래스 문자열 recipe다(스펙 "범위" 절).
- `tokens.css`에 breakpoint·grid 커스텀 프로퍼티를 추가하지 않는다.
- 새 breakpoint를 만들지 않는다 — Tailwind 기본 `sm`(640px)·`md`(768px)·`lg`(1024px)·`xl`(1280px)만 쓴다.
- md(768px) 전용 별도 grid 단계를 만들지 않는다 — LNB(224px)가 md부터 항상 고정으로 뜨는 걸 감안해 sm→lg로 건너뛴다.
- xl(1280px) 전용 별도 grid 단계를 만들지 않는다 — Sixth가 lg에서 이미 6-up을 제공한다.
- gap은 모든 recipe·모든 breakpoint에서 `gap-4`(16px)로 고정한다.
- 페이지 컨테이너는 `flex flex-col gap-10 px-6 py-8`이고 최대폭을 두지 않는다.
- 임의 값 대괄호 표기(`[3px]`, `[#abc]`)를 쓰지 않는다.

---

## 배경 조사 결과 (플랜 작성 중 실측 — 스펙 대비 갱신)

스펙 작성 시점에는 momeokji-admin의 grid 사용처를 App.tsx 위주로만 훑었다. 플랜을 쓰며 `src/App.tsx` 전체와 `src/pages/*.tsx`를 다시 열어 실제 grid 지점을 전부 실측한 결과, **스펙이 추정했던 것보다 기존 코드가 이미 recipe와 훨씬 많이 일치**한다는 걸 확인했다:

| 위치 | 실제 코드 | 판정 |
|---|---|---|
| `App.tsx:209` 유입 차트+도넛 | `grid-cols-1 gap-4 lg:grid-cols-3` + `lg:col-span-2` | ✅ Two-thirds/One-third와 이미 일치 |
| `App.tsx:284` 재방문 리텐션 곡선 | 〃 | ✅ 이미 일치 |
| `App.tsx:461` 바이럴 룸 추세 | 〃 | ✅ 이미 일치 |
| `App.tsx:340` 룰렛 퍼널 카드 2개 | `grid-cols-1 gap-4 lg:grid-cols-2` | ✅ Half와 이미 일치 |
| `App.tsx:391` 인게이지먼트 StatCard 3개 | `grid-cols-1 gap-4 sm:grid-cols-3` | ✅ Third와 이미 일치 |
| `App.tsx:657` 설정 로딩 스켈레톤 | `grid-cols-1 gap-4 lg:grid-cols-2` | ✅ Half와 이미 일치 |
| `SettingsSection.tsx` 카드 2개 | `grid-cols-1 gap-4 lg:grid-cols-2` | ✅ Half와 이미 일치 |
| `DesignSystemSection.tsx` 하이라이트 3장 | `grid-cols-1 gap-4 lg:grid-cols-3` | ✅ Third와 이미 일치 |
| 모든 페이지 컨테이너(analytics·design-system·settings 3개 모드) | `flex flex-col gap-10 px-6 py-8` | ✅ 이미 일치 |

**실제로 고쳐야 하는 지점은 세 곳뿐이다**:

1. `App.tsx:185-187` 홈 KPI 로딩 스켈레톤 — `grid-cols-2 gap-4 lg:grid-cols-4`로 8개를 그린다. 실제 `HomeSection.tsx` 콘텐츠는 6개고 `grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6`을 쓴다 — 로딩이 끝나는 순간 4칸→3→6칸으로 레이아웃이 튄다.
2. `src/pages/HomeSection.tsx` 홈 KPI 타일 그리드 — 위와 같은 이유로 xl 의존을 없애고 Sixth로 정리한다.
3. `App.tsx:371` 룰렛 섹션의 StatCard 2개 — `grid-cols-2 gap-4 sm:grid-cols-4`로, 아이템이 2개뿐인데 4칸 그리드를 써서 sm 이상에서 카드 2개가 왼쪽에 몰리고 오른쪽 절반이 빈다. Half로 정리한다.

`EventCatalogSection.tsx`(`grid-cols-[280px_1fr]` 사이드바형·`sm:grid-cols-2` 카드 내부 필드 2단)와 `UsersSection.tsx`(Dialog 안의 `grid-cols-3` StatCard 3개)의 grid는 **이 시스템의 대상이 아니다** — 전자는 스펙이 명시한 라벨+값 사이드바 예외, 후자는 페이지 레벨이 아니라 Dialog 내부의 좁은 컨텍스트라 LNB를 전제하는 이 recipe가 맞지 않는다. 손대지 않는다.

이 발견 덕분에 momeokji-admin 쪽 Task는 스펙이 그렸던 5개 화면 전체 교체가 아니라, **위 3개 실제 수정 + 나머지 8개 지점의 일치 여부를 코드에 주석으로 명시**하는 확인 작업으로 축소된다.

---

## Task 1: adminds — LayoutPage.tsx에 Grid System 문서화

**Files:**
- Modify: `src/routes/foundations/LayoutPage.tsx` (adminds 저장소, `/Users/yoon/Desktop/데스크탑/바이브코딩/어드민 디자인시스템`)

**Interfaces:**
- Consumes: 없음(이 Task가 adminds 쪽 유일한 Task).
- Produces: 없음 — 문서 페이지라 다른 Task가 이 파일의 export를 가져다 쓰지 않는다.

이 Task는 **adminds** 저장소에서 진행한다. 기존 관례대로 워크트리를 쓴다.

- [ ] **Step 1: 워크트리 준비**

```bash
cd "/Users/yoon/Desktop/데스크탑/바이브코딩/어드민 디자인시스템"
git worktree add .claude/worktrees/v0.26.0 -b v0.26.0 main
cd .claude/worktrees/v0.26.0
```

- [ ] **Step 2: 현재 "Content width"·"Grid" 섹션 확인**

`src/routes/foundations/LayoutPage.tsx`를 읽는다. 지금 "Content width" 섹션(82~104행 부근)은 `AppShell`이 콘텐츠 폭을 정한다고 말하지만 실제로는 정하지 않는다는 게 이번 스펙의 배경이었다 — 그 문구부터 없앤다. "Grid" 섹션(106~124행 부근)의 `GRID_PATTERNS` 상수와 "통일된 grid 토큰은 없습니다" 문구를 이번 시스템으로 완전히 교체한다.

- [ ] **Step 3: 상수 교체**

파일 상단의 `GRID_PATTERNS` 상수를 지우고 아래 두 상수로 바꾼다:

```tsx
/**
 * 컨테이너 12칸을 기준으로 카드가 차지하는 폭을 이름으로 고른다. lg
 * 기준 col-span 값이 이름의 근거다(Half=6/12, Third=4/12 …). gap은
 * 여섯 recipe 모두 gap-4(16px) 하나로 고정이라 표에 반복하지 않는다.
 */
const GRID_RECIPES = [
  {
    name: 'Full',
    classes: 'col-span-1 sm:col-span-2 lg:col-span-12',
    lgSpan: '12/12',
    usage: '표, 긴 카드 — 늘 한 줄 전체',
  },
  {
    name: 'Half',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-6',
    lgSpan: '6/12',
    usage: '설정 카드 2개처럼 sm부터 2-up',
  },
  {
    name: 'Third',
    classes: 'col-span-1 sm:col-span-2 lg:col-span-4',
    lgSpan: '4/12',
    usage: '3-up 카드 목록 — lg 전까지 풀와이드로 쌓임',
  },
  {
    name: 'Quarter',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-3',
    lgSpan: '3/12',
    usage: '차트·설명이 딸린 요약 카드 — 정보량이 있는 4-up',
  },
  {
    name: 'Sixth',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-2',
    lgSpan: '2/12',
    usage: '숫자만 있는 저정보량 카드 — KPI 타일처럼 6-up',
  },
  {
    name: 'Two-thirds + One-third',
    classes: 'lg:col-span-8 그리고 lg:col-span-4 (둘 다 col-span-1 sm:col-span-2)',
    lgSpan: '8+4/12',
    usage: '차트+도넛처럼 무게가 다른 카드 2개를 짝짓는다',
  },
] as const

/** 페이지 컨테이너와 그리드 행 — 모든 화면이 이 두 줄에서 시작한다. */
const GRID_BASE = {
  container: 'flex flex-col gap-10 px-6 py-8',
  row: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12',
}
```

- [ ] **Step 4: "Content width" 섹션 본문 교체**

`DocSection title="Content width"` 블록 안의 문단·code 블록을 아래로 바꾼다(기존 `AppShell.tsx`의 `max-w-6xl` 언급을 없애고, 실제로 padding·max-width를 정하지 않는다는 사실과 이 페이지 컨테이너 관례로 대체):

```tsx
<DocSection title="Content width">
  <p className="text-muted-foreground text-16">
    <code className="text-12">AppShell</code>의 <code className="text-12">main</code>은
    padding·max-width·grid를 스스로 정하지 않는 빈 상자입니다 — 콘텐츠 레이아웃은 화면을
    만드는 쪽의 몫입니다. 모든 페이지는 이 컨테이너 하나로 시작합니다.
  </p>
  <div className="rounded-lg border p-4">
    <code className="text-12">{`<div className="${GRID_BASE.container}">`}</code>
  </div>
  <p className="text-muted-foreground text-16">
    <code className="text-12">px-6</code>(24px)은 <code className="text-12">PageHeader</code>가
    이미 쓰는 값입니다. <code className="text-12">gap-10</code>(40px)은 섹션(카드 묶음) 사이
    세로 간격입니다. <b>최대폭을 두지 않습니다</b> — 표·차트가 중심인 화면은 폭을 넓게 쓸수록
    유리합니다. 줄글 읽기용 <code className="text-12">max-w-2xl</code>과는 성격이 다릅니다.
  </p>
</DocSection>
```

- [ ] **Step 5: "Grid" 섹션 본문 교체**

`DocSection title="Grid"` 블록 전체를 아래로 바꾼다:

```tsx
<DocSection title="Grid">
  <p className="text-muted-foreground text-16">
    카드가 들어가는 자리는 이 한 줄로 시작합니다. 모바일은 1칸, <code className="text-12">sm</code>(640px)은
    2칸, <code className="text-12">lg</code>(1024px)은 진짜 12칸입니다.
  </p>
  <div className="rounded-lg border p-4">
    <code className="text-12">{`<div className="${GRID_BASE.row}">`}</code>
  </div>
  <p className="text-muted-foreground text-16">
    <code className="text-12">md</code>(768px)에서 별도 단계를 두지 않습니다 — LNB가 있는
    화면(<code className="text-12">AppShell</code>)은 md부터 사이드바(224px)가 항상 고정으로
    떠서 콘텐츠 실폭이 뷰포트보다 좁습니다. <code className="text-12">lg</code>에 가서야 실폭이
    12칸을 나눌 만큼 넉넉해집니다.
  </p>
  <p className="text-muted-foreground text-16">
    카드마다 아래 여섯 recipe 중 하나를 고릅니다. 전부 모바일→sm→lg 세 단계를 이미 포함한
    완성형 클래스라 값을 계산할 필요가 없습니다.
  </p>
  <div className="divide-y rounded-lg border">
    {GRID_RECIPES.map((recipe) => (
      <div key={recipe.name} className="flex flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-16 font-semibold">{recipe.name}</span>
          <span className="text-muted-foreground text-12">{recipe.lgSpan}</span>
        </div>
        <code className="text-12">{recipe.classes}</code>
        <span className="text-muted-foreground text-14">{recipe.usage}</span>
      </div>
    ))}
  </div>
  <p className="text-muted-foreground text-16">
    간격은 여섯 recipe 모두 <code className="text-12">gap-4</code>(16px) 하나로 고정입니다 —
    recipe는 폭(span)만 정하고 간격은 건드리지 않습니다. 이 규칙에 안 맞는 특이 케이스(라벨+값
    2칸처럼 폭이 고정된 사이드 레이아웃)는 <code className="text-12">grid-cols-[auto_1fr]</code>을
    그대로 씁니다 — 한 줄짜리 배치는 grid 대신 flex로 충분합니다.
  </p>
</DocSection>
```

- [ ] **Step 6: Guidelines 섹션 갱신**

`DoDont`의 `do`/`dont` 배열에 아래 두 항목을 더한다(기존 항목은 유지):

```tsx
do={[
  '반응형은 sm과 md 위주로 설계한다',
  '페이지 콘텐츠 폭은 max-w-6xl을 벗어나지 않는다',
  '카드·예시가 반복되는 목록은 sm:grid-cols-2나 md:grid-cols-2 관례를 따른다',
  '카드가 들어가는 자리는 페이지 컨테이너 + 그리드 행 + 여섯 recipe 중 하나로 짓는다',
]}
dont={[
  '임의로 새 breakpoint 값을 만든다',
  '임의 값 대괄호 표기([3px] · [#abc])를 쓴다',
  '근거 없이 lg·xl 단계에 새 레이아웃을 얹는다',
  '카드 폭을 계산해서 col-span 숫자를 직접 고르지 않는다 — 여섯 recipe 중 하나를 그대로 쓴다',
]}
```

기존 "페이지 콘텐츠 폭은 max-w-6xl을 벗어나지 않는다"는 adminds 문서 사이트 자체(본문+TOC)를 가리키는 문구이므로 그대로 둔다 — 이 Task의 새 컨테이너는 어드민 대시보드용이라 서로 다른 규칙이다.

- [ ] **Step 7: 검증**

```bash
npx tsc -b
npm test
npm run build
npx oxlint
```

전부 통과해야 한다(기존 310개 테스트 그대로 — 이 페이지는 별도 테스트가 없다).

- [ ] **Step 8: 브라우저로 확인**

Browser pane으로 `/foundations/layout`을 열어 Grid 섹션이 여섯 recipe를 전부 보이는지, Content width 섹션 문구가 자연스러운지 눈으로 확인한다.

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "docs(foundations): Layout에 Container Grid System을 반영한다

컨테이너 1개·그리드 행 1개·span recipe 6개(Full/Half/Third/Quarter/
Sixth/Two-thirds+One-third)로 momeokji-admin의 카드 배치 관례를
formalize한다. 새 컴포넌트나 토큰은 만들지 않는다 — 그대로 복사해
쓰는 Tailwind 클래스 문자열이다.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 10: 버전 부기 + 릴리즈 노트**

`package.json`의 `version`을 `0.26.0`으로 올린다. `src/data/releases.ts` 배열 맨 앞에 새 릴리즈를 추가한다:

```tsx
{
  version: 'v0.26.0',
  publishedAt: '2026-08-31',
  title: 'Foundations에 Container Grid System을 더했어요',
  purpose:
    '카드가 들어가는 자리를 컨테이너 하나·그리드 행 하나·span recipe 6개로 정리했어요. momeokji-admin처럼 LNB가 있는 화면에서 카드 폭을 일관되게 맞출 때 씁니다.',
  changes: [
    {
      target: 'Foundations / Layout',
      type: 'New',
      note: 'Content width·Grid 섹션에 Container Grid System(컨테이너·그리드 행·recipe 6종)을 추가했어요.',
    },
  ],
  requests: [],
  reviewItems: [],
  impact: ['Foundations'],
},
```

- [ ] **Step 11: 최종 검증 + 커밋**

```bash
npx tsc -b && npm test && npm run build && npx oxlint
git add -A
git commit -m "chore: v0.26.0 릴리즈 노트를 적고 버전을 부기한다

Container Grid System 문서화를 v0.26.0 릴리즈로 기록한다.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

Task 1은 여기서 끝이다. 병합·배포는 사용자의 명시적 지시가 있을 때 진행한다(이 프로젝트의 기존 관례 — worktree는 그대로 남겨 둔다).

---

## Task 2: momeokji-admin — 홈 KPI 그리드를 Sixth로 정리

**Files:**
- Modify: `src/pages/HomeSection.tsx` (momeokji-admin 저장소, `/Users/yoon/Desktop/데스크탑/바이브코딩/momeokji-admin`)
- Modify: `src/App.tsx` (momeokji-admin 저장소, 185~187행)

**Interfaces:**
- Consumes: 없음(momeokji-admin 쪽 첫 Task, adminds Task 1과 독립적).
- Produces: 없음.

이 Task는 **momeokji-admin** 저장소에서 진행한다(완전히 별개 git 저장소). 이 저장소는 워크트리를 쓰지 않고 `main`에 직접 커밋하는 관례다(기존 커밋 로그 확인 완료) — 그대로 따른다.

- [ ] **Step 1: 시작 전 확인**

```bash
cd "/Users/yoon/Desktop/데스크탑/바이브코딩/momeokji-admin"
git status
```

`nothing to commit, working tree clean`이어야 한다. 아니라면 진행하지 않고 사용자에게 보고한다.

- [ ] **Step 2: HomeSection.tsx의 KPI 그리드 수정**

`src/pages/HomeSection.tsx`를 읽는다. 아래 줄을 찾는다:

```tsx
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
```

Sixth recipe(직접형 — 카드가 전부 같은 폭이라 col-span 없이 grid-cols 값만으로 충분하다)로 바꾼다:

```tsx
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
```

`xl:grid-cols-6`을 지우고 `lg:grid-cols-6`으로 올린다 — Sixth는 lg에서 곧바로 6-up이 된다(글로벌 제약 "xl 전용 별도 grid 단계를 만들지 않는다").

- [ ] **Step 3: App.tsx의 로딩 스켈레톤 수정**

`src/App.tsx`에서 아래 블록을 찾는다(185~188행 부근):

```tsx
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} shape="block" className="h-24" />
              ))}
            </div>
```

실제 콘텐츠(`data.overview`)가 6개 항목이므로 스켈레톤 개수와 grid를 콘텐츠와 맞춘다:

```tsx
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} shape="block" className="h-24" />
              ))}
            </div>
```

- [ ] **Step 4: 빌드로 확인**

```bash
npm run build
```

`tsc -b`와 `vite build`가 통과해야 한다.

- [ ] **Step 5: 브라우저로 로딩→표시 전환 확인**

개발 서버(`npm run dev`)를 띄우고 홈 화면을 새로고침해서, 로딩 스켈레톤 6개가 콘텐츠 6개와 같은 grid-cols-2→lg:6 배치로 나타나는지(레이아웃이 안 튀는지) 확인한다. 데스크톱 폭(1024px 이상)에서 6개가 한 줄에 나란히 서는지, 좁은 폭(<1024px)에서는 2열로 쌓이는지 확인한다.

- [ ] **Step 6: 테스트 + 린트**

```bash
npm test
npm run lint
```

- [ ] **Step 7: 커밋**

```bash
git add src/pages/HomeSection.tsx src/App.tsx
git commit -m "fix: 홈 KPI 타일 로딩 스켈레톤을 실제 콘텐츠와 맞춘다

스켈레톤은 grid-cols-2 lg:grid-cols-4로 8칸을 그렸는데 실제 콘텐츠는
6개(overview 항목 수)이고 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6을
써서, 로딩이 끝나는 순간 4칸에서 3→6칸으로 레이아웃이 튀었다.

adminds Container Grid System의 Sixth recipe로 둘 다 정리한다 —
xl 단계 없이 lg에서 곧장 6-up. 스켈레톤 개수도 6개로 맞춘다."
```

---

## Task 3: momeokji-admin — 룰렛 StatCard 2개를 Half로 정리 + 나머지 지점 확인 주석

**Files:**
- Modify: `src/App.tsx` (momeokji-admin 저장소, 371행)

**Interfaces:**
- Consumes: Task 2가 이미 커밋한 momeokji-admin의 `main` 최신 상태.
- Produces: 없음.

- [ ] **Step 1: 룰렛 StatCard 2개 그리드 수정**

`src/App.tsx`에서 아래 블록을 찾는다(371행 부근, `activeId === 'roulette'` 섹션 안):

```tsx
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                      label="Spin→Confirm 전환율"
```

아이템이 2개뿐인데 4칸 그리드라 sm 이상에서 카드 2개가 왼쪽에 몰리고 오른쪽 절반이 빈다. Half recipe(직접형)로 바꾼다:

```tsx
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                      label="Spin→Confirm 전환율"
```

- [ ] **Step 2: 빌드 + 브라우저 확인**

```bash
npm run build
```

개발 서버에서 룰렛 핵심 사용 탭을 열어, StatCard 2개가 sm 이상에서 나란히 폭을 채우는지(빈 공간 없이) 확인한다.

- [ ] **Step 3: 나머지 8개 지점에 확인 주석 남기기**

아래 파일들은 이미 recipe와 일치하지만, 다음에 이 코드를 보는 사람이 "이것도 우연이 아니라 의도"임을 알 수 있게 각 grid 줄 바로 위에 한 줄 주석을 더한다. 이미 있는 주석과 겹치지 않게 그 사이나 바로 위에 넣는다.

`src/App.tsx:209`(유입), `284`(재방문), `461`(바이럴) — 세 곳 모두 `lg:col-span-2` 카드 앞에:
```tsx
                  {/* Container Grid System: Two-thirds + One-third */}
```

`src/App.tsx:340`(룰렛 퍼널 2개), `657`(설정 스켈레톤) — 두 곳 모두 `lg:grid-cols-2` 앞에:
```tsx
                  {/* Container Grid System: Half */}
```

`src/App.tsx:391`(인게이지먼트 StatCard 3개) — `lg:grid-cols-3` 앞에:
```tsx
                  {/* Container Grid System: Third */}
```

`src/pages/SettingsSection.tsx`의 `grid-cols-1 gap-4 lg:grid-cols-2` 위에:
```tsx
      {/* Container Grid System: Half */}
```

`src/pages/DesignSystemSection.tsx`의 `grid-cols-1 gap-4 lg:grid-cols-3`(하이라이트 3장) 위에:
```tsx
          {/* Container Grid System: Third */}
```

- [ ] **Step 4: 테스트 + 린트 + 빌드**

```bash
npm test
npm run lint
npm run build
```

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "refactor: 룰렛 StatCard 2개를 Half로 정리하고 나머지 grid를 주석으로 확정한다

grid-cols-2 sm:grid-cols-4로 아이템 2개를 그려 sm 이상에서 오른쪽
절반이 비던 것을 grid-cols-1 sm:grid-cols-2(Half)로 고친다.

나머지 8개 지점(유입·재방문·바이럴의 Two-thirds+One-third, 룰렛
퍼널·설정 스켈레톤·SettingsSection의 Half, 인게이지먼트·
DesignSystemSection의 Third)은 adminds Container Grid System과 이미
일치했다 — 우연이 아니라 의도였음을 주석으로 남긴다."
```

---

## Self-Review Checklist (실행 전 최종 확인)

- [x] **스펙 커버리지**: 컨테이너(Task 1 Step 4)·그리드 행(Task 1 Step 5)·recipe 6개 표(Task 1 Step 3, 5)·momeokji-admin 매핑(Task 2, 3)·로딩 스켈레톤 불일치 수정(Task 2)·xl 미사용(Task 2 Step 2) 전부 Task로 커버됨.
- [x] **플레이스홀더 스캔**: "TBD"·"적절히 처리" 없음. 모든 Step에 실제 diff 코드 포함.
- [x] **타입/네이밍 일관성**: recipe 이름(Full/Half/Third/Quarter/Sixth/Two-thirds+One-third)이 스펙·Task 1·Task 2·Task 3 전체에서 동일.
- [x] **저장소 분리**: adminds(Task 1)와 momeokji-admin(Task 2, 3)이 서로의 커밋을 참조하지 않음 — 어느 순서로 실행해도, 하나만 실행해도 무방.
