# 어드민 디자인 시스템 v0.9.0 구현 계획 — 화면의 구조와 상태

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 컴포넌트 여덟 개를 더해 낱개의 컨트롤 사이를 잇는 부품을 채운다. 구획을 나누는 것, 기다리는 중을 보이는 것, 아무것도 없을 때 보이는 것.

**Architecture:** v0.7.0이 세우고 v0.8.0이 열넷으로 넓힌 구조를 그대로 쓴다. `src/components/ui/*`에 컴포넌트, `src/data/registry.ts`에 메타, `src/routes/components/*Page.tsx`에 `render` 콜백. 전시 컴포넌트(`components/docs/*`)는 새로 만들지 않는다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, Radix UI, react-router 8, Vitest, lucide-react

**설계 문서:** `docs/superpowers/specs/2026-08-26-admin-design-system-v0.9.0-design.md` — 각 컴포넌트의 축·구조·지침·사용 예·예외 상황은 그 문서가 단일 출처다. 이 계획서는 코드의 모양과 순서를 정한다.

## Global Constraints

- 작업 브랜치는 `v0.9.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기 금지** — `data-[state=open]` 같은 임의 **셀렉터** 변형은 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
  ```

- **언어 규칙** — 구조를 가리키는 이름은 **영문**, 설명은 **한국어**. 방향·순서를 가리키는 낱말과 제품 이름은 한국어.
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 배열에서 파생한다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **제품 컴포넌트(`components/ui/*`)는 문서 시스템의 표시(`data-anatomy`)를 알지 않는다.** 페이지가 주입한다.
- **문구는 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표, 번역투 회피.
- **17px 이하 글자는 배경과 4.5:1을 넘어야 한다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. 옅게 탄 배경(`/10`·`/15`) 위에 글자를 얹을 때는 `*-on-tint` 토큰을 쓴다.
- **모달을 열린 채로 마운트하지 않는다.** 이번 회차에 포털을 쓰는 컴포넌트는 없지만 규칙은 유지한다.
- **테스트 대상은 순수 함수다.** 어느 디렉터리에 있는지가 아니라 부수 효과가 없고 반환값으로만 판정되는지로 정한다. 컴포넌트 렌더링은 단위 테스트하지 않는다(이 저장소에 jsdom이 없다).
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사. 끝에 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **`git add -A`를 쓰지 않는다.** 바꾼 파일만 지정해서 커밋한다.

## 앞선 회차가 만든 공통 계약 — 새 컴포넌트가 따른다

- 컨트롤 높이는 `h-control-sm` · `h-control` · `h-control-lg`. 원시 숫자를 쓰지 않는다
- 포커스 링은 `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2`. 한 글자도 다르게 적지 않는다
- 오류는 `aria-invalid`. 색과 문구를 함께 쓴다
- 테두리가 있는 입력은 `inputVariants`(`src/components/ui/input.tsx`)를 **재사용한다**. 클래스를 다시 적지 않는다
- 구조도의 미리보기는 **인스턴스 하나**다. 한 인스턴스에 함께 보일 수 없는 것은 부위가 아니라 상태다
- **없는 축이나 상태를 문서가 언급하지 않는다.** 공통 규칙이라도 해당하지 않으면 적지 않는다
- 예시는 실제 컴포넌트로 만든다. 목업 상자를 그리지 않는다
- `Bounds`는 `src/components/docs/Bounds.tsx`에 있다. 페이지마다 다시 만들지 않는다
- `hover`·`focus` 상태는 `forcedStateClass`(`src/components/docs/state-preview.ts`)로 전시한다. 이번 회차에서 그 상태를 축에 둔 컴포넌트는 `Accordion` 하나다

## 각 Task가 공통으로 하는 일

Task 1~8은 모두 같은 모양이다. 컴포넌트 하나마다:

1. 필요하면 Radix 의존성을 더한다 (`npm install <pkg>`)
2. `src/components/ui/<name>.tsx`를 만든다
3. `src/data/registry.ts`의 `components` 배열 **끝에** `ComponentMeta`를 더한다 — 내용은 **설계 문서의 해당 절**에서 가져온다. 배열 순서는 Task 9가 정리한다
4. `src/routes/components/<Name>Page.tsx`를 만든다 — `BadgePage.tsx`가 가장 작은 본보기, `TablePage.tsx`가 가장 큰 본보기
5. `nav-config.ts`와 `routes.tsx`에 등록한다
6. `npm run build && npm test`와 대괄호 grep
7. 커밋

**지켜야 할 연결 세 가지** (하나라도 어긋나면 조용히 아무것도 그려지지 않는다):

- `anatomy[].part` ↔ `preview`의 `data-anatomy`
- `guidelines[].id` ↔ `renderGuidelineExample`의 `case`
- `usage[].id`·`cases[].id` ↔ `renderExample`의 `case`

`verified`는 `false`로 둔다. 컨트롤러가 브라우저로 확인한 뒤 올린다.

`anatomy`를 빈 배열로 두면 `ComponentPage`가 Anatomy 절을 그리지 않는다. `Separator`와 `Skeleton`이 그렇다 — 이때 `ComponentPage`에 `preview`는 여전히 넘겨야 하는 필수 prop이므로 대표 인스턴스 하나를 넘긴다.

## 순서

의존성이 없는 것부터 만들어 Radix 설치가 앞쪽에 몰리지 않게 한다.

| Task | 컴포넌트 | 카테고리 | Radix |
|---|---|---|---|
| 1 | `Separator` | Data Display | 없음 |
| 2 | `Skeleton` | Feedback | 없음 |
| 3 | `Card` | Data Display | 없음 |
| 4 | `Description List` | Data Display | 없음 |
| 5 | `Empty State` | Feedback | 없음 |
| 6 | `Steps` | Navigation | 없음 |
| 7 | `Accordion` | Data Display | `@radix-ui/react-accordion` |
| 8 | `Progress` | Feedback | `@radix-ui/react-progress` |
| 9 | 전체 정합성 | — | — |

`Separator`를 맨 앞에 둔다. 가장 작아서 Task의 모양을 확인하기 좋고, `Card`와 `Description List`가 예시에서 쓴다.

---

## Task 1: Separator

**Files:**
- Create: `src/components/ui/separator.tsx`, `src/routes/components/SeparatorPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `cn` (`@/lib/utils`)
- Produces: `Separator`

- [ ] **Step 1: 컴포넌트를 만든다**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * Radix를 쓰지 않는다. 이 컴포넌트가 하는 일은 방향에 따라 선을 긋고
 * 장식이면 접근성 트리에서 빼는 것 — 두 줄이다. 의존성 하나를 두 줄과
 * 바꾸지 않는다.
 *
 * 두께를 border가 아니라 크기로 준다. border를 쓰면 방향이 바뀔 때마다
 * 어느 변을 그을지 골라야 하고, flex 안에서 두께가 눌린다.
 */
const separatorVariants = cva('bg-border shrink-0', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

type SeparatorProps = React.ComponentProps<'div'> &
  VariantProps<typeof separatorVariants> & {
    /** 눈으로만 나누는 선인지. 참이면 접근성 트리에서 뺀다 */
    decorative?: boolean
  }

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      data-slot="separator"
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : (orientation ?? 'horizontal')}
      className={cn(separatorVariants({ orientation, className }))}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
```

`aria-orientation`을 `role="none"`일 때 달지 않는 것이 중요하다. 역할이 없는 요소에 방향만 남으면 스크린 리더가 무엇의 방향인지 알 수 없다.

- [ ] **Step 2: 메타를 더한다**

설계 문서의 `2. Separator` 절을 옮긴다. 축은 `orientation` 하나(`display: 'row'`), `anatomy`는 **빈 배열**이다.

`id`는 `separator`, `category`는 `data-display`, `addedIn`·`changedIn`은 `v0.9.0`, `status`는 `stable`, `verified`는 `false`.

- [ ] **Step 3: 페이지를 만든다**

`render`는 `orientation`을 받아 `Separator`를 그린다. 세로 구분선은 높이를 주는 부모가 있어야 보이므로 무대에 높이를 가진 감싸개를 둔다.

`preview`는 `anatomy`가 비어 있어도 필수 prop이므로 가로 구분선 하나를 넘긴다.

`usage`·`cases`의 예시는 실제 컴포넌트로 만든다 — 카드 안 구획은 `Card`가 아직 없으므로 테두리 있는 상자와 `Separator`로 만들고, 메뉴 묶음은 목록과 `Separator`로 만든다. **`Card`를 기다리지 않는다.** Task 3이 끝난 뒤 되돌아와 고치지 않는다.

- [ ] **Step 4: 등록**

`nav-config.ts`의 Components 목록에서 `Avatar` 뒤에 `{ to: '/components/separator', label: 'Separator', updatedAt: '2026-08-26' }`.

`routes.tsx`에 `{ path: 'separator', element: <SeparatorPage /> }`를 같은 자리에 더한다. import는 알파벳 순서를 지킨다.

- [ ] **Step 5: 검증과 커밋**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

커밋: `feat: Separator를 더한다`

---

## Task 2~8

**Task 1과 같은 모양이다.** 각 Task는 설계 문서의 해당 절을 내용의 출처로 삼고, 「각 Task가 공통으로 하는 일」 1~7을 수행한다.

각 Task에서 특히 주의할 것만 아래에 적는다.

### Task 2: Skeleton

**Files:** Create `src/components/ui/skeleton.tsx`, `src/routes/components/SkeletonPage.tsx`

`anatomy`는 **빈 배열**이다 — 도형 하나에 지시선을 그리면 구조 설명이 아니라 화살표만 남는다.

`aria-hidden="true"`를 컴포넌트가 직접 단다. 뼈대는 눈으로만 보는 자리 표시이고, 불러오는 중이라는 사실은 문구가 따로 전한다.

`shape` 네 값의 모양:

| 값 | 클래스 |
|---|---|
| `text` | `h-4 w-full rounded` |
| `title` | `h-6 w-1/2 rounded` |
| `block` | `h-24 w-full rounded-md` |
| `circle` | `size-10 rounded-full` |

`animate-pulse`와 `bg-muted`는 네 값이 공유하는 기본 클래스다.

**예시가 이 문서의 핵심이다.** '표의 행'·'카드 목록'·'아바타와 이름'은 여러 개의 `Skeleton`을 실제 배치로 조립해 보인다. 반복은 배열에서 파생한다 — 손으로 여섯 줄을 적지 않는다.

`nav-config` 자리는 `Dialog` 뒤. `category`는 `feedback`.

### Task 3: Card

**Files:** Create `src/components/ui/card.tsx`, `src/routes/components/CardPage.tsx`

구성은 `Card` · `CardHeader` · `CardTitle` · `CardDescription` · `CardAction` · `CardContent` · `CardFooter`. shadcn 규약을 따른다.

`CardAction`은 머리 오른쪽 끝에 붙는다. `CardHeader`를 grid로 두고 `CardAction`이 두 번째 열을 차지하게 한다 — 제목이 길어져도 동작이 밀려나지 않는다.

`padding`이 `none`일 때 여백을 없애는 대상은 `CardContent`다. `CardHeader`와 `CardFooter`는 여백을 유지한다 — 표를 담아도 제목과 바닥 동작은 여백이 필요하다. 이 결정을 컴포넌트 안에 주석으로 남긴다.

`variant`:

| 값 | 클래스 |
|---|---|
| `outlined` | `border bg-card` |
| `elevated` | `bg-card shadow-sm` |

`shadow-sm`이 라이트와 다크 양쪽에서 보이는지 확인한다. 다크에서 그림자가 배경에 묻히면 `elevated`가 `outlined`와 구별되지 않는다 — 그렇다면 다크에서 테두리를 함께 두고 그 사실을 보고서에 적는다.

`nav-config` 자리는 `Separator` 앞(`Avatar` 뒤). `category`는 `data-display`.

### Task 4: Description List

**Files:** Create `src/components/ui/description-list.tsx`, `src/routes/components/DescriptionListPage.tsx`

`<dl>` · `<dt>` · `<dd>`를 쓴다. `DescriptionList` · `DescriptionItem` · `DescriptionTerm` · `DescriptionDetail`.

`<dl>` 안에서 `<dt>`와 `<dd>`를 `<div>`로 감싸는 것은 HTML이 허용한다(`DescriptionItem`이 그 `<div>`다). `columns`가 격자를 만들려면 항목이 하나의 요소로 묶여 있어야 한다.

`layout`과 `columns`는 서로 맞물린다 — `horizontal`에서 세 열이면 라벨 자리가 너무 좁다. 이것을 막지 말고 `cases`의 '좁은 화면' 항목이 다루게 한다. 컴포넌트가 조합을 막으면 축이 정직하게 전시되지 않는다.

값이 없을 때 `—`를 넣는 것은 **호출하는 쪽의 일**이다. 컴포넌트가 빈 자식을 보고 대신 채우면 값이 없는 것과 빈 문자열을 구별할 수 없다. 지침이 그 규칙을 말하고 `cases`가 예를 보인다.

`nav-config` 자리는 `Separator` 뒤. `category`는 `data-display`.

### Task 5: Empty State

**Files:** Create `src/components/ui/empty-state.tsx`, `src/routes/components/EmptyStatePage.tsx`

`EmptyState` · `EmptyStateIcon` · `EmptyStateTitle` · `EmptyStateDescription` · `EmptyStateAction`.

**아이콘은 컴포넌트가 고르지 않는다.** `EmptyStateIcon`은 감싸개일 뿐이고 어떤 아이콘을 넣을지는 호출하는 쪽이 정한다 — `Alert`가 `[&>svg]`로 색만 물려주는 것과 같은 방식이다. `variant`가 정하는 것은 아이콘의 색과 배경이지 아이콘의 모양이 아니다.

`variant` 네 값이 색을 어떻게 쓰는지:

| 값 | 아이콘 색 |
|---|---|
| `empty` | `text-muted-foreground` |
| `no-results` | `text-muted-foreground` |
| `error` | `text-destructive-on-tint` |
| `no-permission` | `text-warning-on-tint` |

`empty`와 `no-results`가 같은 색인 것은 의도다 — 둘 다 오류가 아니다. 구별은 문구가 한다. 이 결정을 주석과 지침 양쪽에 남긴다.

`size`의 `compact`는 아이콘이 작아지고(`size-8` → `size-6`) 위아래 여백이 준다. 표 안이나 카드 안에 놓이는 자리다.

`nav-config` 자리는 `Progress` 뒤(`Dialog` 뒤 세 번째). `category`는 `feedback`.

### Task 6: Steps

**Files:** Create `src/components/ui/steps.tsx`, `src/routes/components/StepsPage.tsx`

`<ol>`을 쓴다. `Steps` · `Step` · `StepIndicator` · `StepLabel` · `StepDescription`.

**`state`는 `Step` 하나의 상태다.** `Steps`가 현재 단계 번호를 받아 자식의 상태를 계산하지 않는다 — 계산하면 `error`를 표현할 자리가 없어진다. 각 `Step`이 자기 `state`를 받는다.

`StepIndicator`가 상태에 따라 다르게 그린다:

| 상태 | 표시 |
|---|---|
| `pending` | 테두리 원 + 숫자 (`border text-muted-foreground`) |
| `current` | 채운 원 + 숫자 (`bg-primary text-primary-foreground`) |
| `complete` | 채운 원 + `Check` 아이콘 (`bg-primary text-primary-foreground`) |
| `error` | 채운 원 + `X` 아이콘 (`bg-destructive text-destructive-foreground`) |

숫자는 `StepIndicator`의 자식으로 호출하는 쪽이 넣는다 — `complete`와 `error`는 그 자식을 아이콘으로 대신한다. `lucide-react`의 `Check`와 `X`를 쓴다.

`aria-current="step"`은 `state`가 `current`인 `Step`에 붙는다.

Connector는 `Step` 사이를 잇는 선이다. 마지막 단계 뒤에는 없다 — `Steps`가 자식 수를 세지 말고 CSS로 `last:` 변형을 써서 마지막의 선을 감춘다. 자식 수를 세면 `Steps`가 자식의 구조를 알게 된다.

`nav-config` 자리는 `Pagination` 뒤. `category`는 `navigation`.

### Task 7: Accordion

**Files:** Create `src/components/ui/accordion.tsx`, `src/routes/components/AccordionPage.tsx`
**Install:** `npm install @radix-ui/react-accordion`

Radix의 `Accordion`을 감싼다. `Accordion` · `AccordionItem` · `AccordionTrigger` · `AccordionContent`.

`AccordionTrigger`는 `AccordionHeader` 안에 있어야 한다 — Radix가 `<h3>`를 그리고 그 안에 버튼을 둔다. shadcn 구현을 따른다.

화살표(`ChevronDown`)는 `AccordionTrigger` 안쪽에서 그린다. `data-[state=open]:rotate-180`으로 돌린다 — 이것은 임의 **셀렉터** 변형이라 허용된다.

여닫는 움직임은 Radix가 주는 `--radix-accordion-content-height` CSS 변수와 `tw-animate-css`의 `animate-accordion-down`/`animate-accordion-up`을 쓴다. **이 두 유틸리티가 실제로 생성되는지 빌드 결과물로 확인한다.** 생성되지 않으면 움직임 없이 열고 닫히게 두고 그 사실을 보고서에 적는다 — 없는 것을 있는 것처럼 문서에 적지 않는다.

```bash
grep -o 'accordion-down\|accordion-up' dist/assets/*.css | sort -u
```

`state` 축의 `expanded`는 `defaultValue`로 보인다. `focus`는 `forcedStateClass`로 보인다. `disabled`는 `AccordionItem`의 `disabled` prop이다.

`type`은 축이 **아니다**. 설계 문서가 그 이유를 적었고 지침이 그것을 다룬다. 축에 넣지 않는다.

`nav-config` 자리는 `Description List` 뒤. `category`는 `data-display`.

### Task 8: Progress

**Files:** Create `src/components/ui/progress.tsx`, `src/routes/components/ProgressPage.tsx`
**Install:** `npm install @radix-ui/react-progress`

Radix의 `Progress`를 감싼다. `role="progressbar"`와 `aria-valuenow`를 Radix가 맡는다.

`Indicator`의 너비는 `transform: translateX(-(100 - value)%)`로 준다 — shadcn의 방식이고, `width`를 바꾸는 것보다 부드럽다. **이 값은 인라인 `style`로 준다.** Tailwind 클래스로 표현할 수 없는 동적 값이고, 대괄호 표기 금지 규칙은 클래스 이름에 대한 것이지 `style` 속성에 대한 것이 아니다.

`indeterminate`는 `value`를 주지 않은 상태다. Radix가 `data-state="indeterminate"`를 단다. 그 상태에서 `Indicator`를 좁게 만들고 좌우로 움직이는 애니메이션을 준다 — 애니메이션 정의가 필요하면 `tokens.css`에 `@keyframes`를 더한다. **`tokens.css`를 고치는 것은 이 Task의 범위 안이다.**

`variant` 네 값은 `Indicator`의 배경색만 바꾼다. Track은 늘 `bg-muted`다.

`Label`과 `Value`는 `Progress` 밖에 놓인다 — 진행 막대 자체는 막대일 뿐이다. 구조도가 그 배치를 보이고, 페이지가 감싸개로 조립한다.

`nav-config` 자리는 `Skeleton` 뒤. `category`는 `feedback`.

---

## Task 9: 전체 정합성

**Files:**
- Modify: `src/data/registry.ts`, `src/data/releases.ts`, `src/data/registry.test.ts`
- Create: `src/data/registry-order.test.ts`

여덟 개가 다 들어온 뒤 전체가 어긋나지 않았는지 확인한다.

- [ ] **Step 1: registry 배열 순서를 LNB 순서에 맞춘다**

지금 `components` 배열의 순서와 `nav-config`의 Components 목록 순서가 다르다. `ComponentsIndex`의 카드 순서는 배열에서 파생하고 LNB 순서는 `nav-config`에서 파생하므로, 두 곳에서 같은 컴포넌트가 다른 자리에 놓인다.

`components` 배열을 `nav-config`의 Components 항목 순서와 같게 다시 배열한다. **내용은 한 글자도 바꾸지 않는다** — 순서만 옮긴다.

- [ ] **Step 2: 순서가 어긋나면 실패하는 테스트를 쓴다**

`src/data/registry-order.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { sections, flattenDocs } from '@/components/layout/nav-config'
import { components } from '@/data/registry'

/** LNB의 Components 목록에서 Overview를 뺀 문서 경로들 */
function navComponentIds(): string[] {
  const section = sections.find((s) => s.id === 'components')!
  return flattenDocs(section.items)
    .filter((doc) => doc.to !== section.to)
    .map((doc) => doc.to.replace('/components/', ''))
}

describe('registry와 nav-config', () => {
  it('같은 컴포넌트를 같은 순서로 담는다', () => {
    expect(components.map((c) => c.id)).toEqual(navComponentIds())
  })
})
```

- [ ] **Step 3: 테스트를 돌려 실패를 확인한다**

Step 1을 하기 전이라면 실패해야 한다. 이미 했다면 순서를 일부러 하나 바꿔 실패를 확인하고 되돌린다.

```bash
npx vitest run src/data/registry-order.test.ts
```

- [ ] **Step 4: `releases.ts`에 v0.7.0 · v0.8.0 · v0.9.0을 더한다**

`releases` 배열이 v0.6.0에서 멈춰 있다. 세 항목을 배열 **맨 앞에** 더한다 — 최신이 앞이다.

각 항목의 `changes`는 그 회차가 실제로 한 일을 적는다. 지어내지 않는다 — 근거는 `git log --oneline` 과 각 회차의 설계 문서다.

| 버전 | publishedAt | 무엇을 한 회차인가 |
|---|---|---|
| `v0.7.0` | `2026-08-25` | 폼 입력 세 가지(`Input` · `Select` · `Checkbox`)를 더하고 컨트롤 높이·포커스 링·오류 표현의 공통 계약을 세웠다 |
| `v0.8.0` | `2026-08-26` | 열네 컴포넌트를 더해 다섯 카테고리를 채웠다. 옅게 탄 배경 위 글자의 대비를 토큰 층에서 고쳤다 |
| `v0.9.0` | `2026-08-26` | 여덟 컴포넌트를 더해 낱개의 컨트롤 사이를 잇는 부품을 채웠다 |

`requests`·`reviewItems`·`impact`의 모양은 v0.6.0 항목을 본보기로 삼는다.

- [ ] **Step 5: 문서 전체를 한 번 훑는다**

각 새 컴포넌트의 문서가 **자기에게 없는 것을 말하지 않는지** 확인한다. 특히:

- `Separator`와 `Skeleton`의 지침이 Anatomy를 언급하지 않는가
- `Accordion`의 문서 어디에도 `type` 축이 있는 것처럼 적히지 않았는가
- `Empty State`의 지침이 아이콘을 컴포넌트가 고르는 것처럼 적지 않았는가
- 모든 `guidelines[].id`가 페이지의 `renderGuidelineExample`에서 다뤄지는가
- 모든 `usage[].id`·`cases[].id`가 페이지의 `renderExample`에서 다뤄지는가

마지막 두 개는 눈으로 세지 말고 명령으로 센다:

```bash
node --input-type=module -e "
import { components } from './src/data/registry.ts'
" 2>/dev/null || echo "TS를 직접 실행할 수 없으므로 각 페이지 파일에서 case 라벨을 grep으로 세어 메타와 대조한다"
```

- [ ] **Step 6: 검증과 커밋**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

커밋: `chore: 스물여섯 컴포넌트의 순서와 릴리스 기록을 맞춘다`

---

## v0.9.0 완료 기준

- 컴포넌트가 스물여섯 개다
- 여덟 문서가 모두 열리고, 각자 자기에게 있는 절만 그린다
- `ComponentsIndex`의 카드 순서와 LNB 순서가 같고, 테스트가 그것을 지킨다
- `Updates`가 v0.9.0까지 잇는다
- `npm run build`와 `npm test`가 통과한다
- 대괄호 grep이 비어 있다
- 라이트와 다크 양쪽에서 17px 이하 글자가 4.5:1을 넘는다 (컨트롤러가 브라우저로 확인)

## v0.9.0 범위 밖

- `Popover` · `Field` · `Slider` · `Combobox` · `Date Picker` · `File Upload` — v0.10.0
- `Get started` · `Patterns` 채우기 — v0.11.0
- 접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림) — 별도 회차
- `useMeasuredTokens` 5벌 중복 해소
