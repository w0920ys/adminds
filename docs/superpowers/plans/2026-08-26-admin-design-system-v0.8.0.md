# 어드민 디자인 시스템 v0.8.0 구현 계획 — 컴포넌트 전체

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 14개 컴포넌트를 더해 다섯 카테고리를 모두 채운다. 부품이 열여덟이 되었을 때도 높이·포커스 링·오류 표현·문구가 하나로 유지되는지 확인한다.

**Architecture:** v0.7.0의 구조를 그대로 쓴다. `src/components/ui/*`에 컴포넌트, `src/data/registry.ts`에 메타, `src/routes/components/*Page.tsx`에 `render` 콜백. 전시 컴포넌트는 새로 만들지 않는다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, Radix UI, react-router 8, Vitest, lucide-react

**설계 문서:** `docs/superpowers/specs/2026-08-26-admin-design-system-v0.8.0-design.md` — 각 컴포넌트의 축·구조·지침·사용 예·예외 상황은 그 문서가 단일 출처다. 이 계획서는 코드의 모양과 순서를 정한다.

## Global Constraints

- 작업 브랜치는 `v0.8.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기 금지** — `data-[state=open]` 같은 임의 **셀렉터** 변형은 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
  ```

- **언어 규칙** — 구조를 가리키는 이름은 **영문**, 설명은 **한국어**. 방향·순서를 가리키는 낱말과 제품 이름은 한국어.
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.**
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **제품 컴포넌트(`components/ui/*`)는 문서 시스템의 표시(`data-anatomy`)를 알지 않는다.** 페이지가 주입한다.
- **문구는 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표, 번역투 회피.
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. 컴포넌트 렌더링은 단위 테스트하지 않는다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사. 끝에 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **`git add -A`를 쓰지 않는다.** 바꾼 파일만 지정해서 커밋한다.

## v0.7.0이 만든 공통 계약 — 새 컴포넌트가 따른다

- 컨트롤 높이는 `h-control-sm` · `h-control` · `h-control-lg`. 원시 숫자를 쓰지 않는다
- 포커스 링은 `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2`
- 오류는 `aria-invalid`. 색과 문구를 함께 쓴다
- 테두리가 있는 입력은 `inputVariants`(`src/components/ui/input.tsx`)를 **재사용한다**. 클래스를 다시 적지 않는다
- 구조도의 미리보기는 **인스턴스 하나**다. 한 인스턴스에 함께 보일 수 없는 것은 부위가 아니라 상태다
- **공통 규칙은 해당하는 문서에만 적는다.** 없는 축이나 상태를 언급하지 않는다
- 예시는 실제 컴포넌트로 만든다. 목업 상자를 그리지 않는다
- `Bounds`는 `src/components/docs/Bounds.tsx`에 있다. 페이지마다 다시 만들지 않는다

## 각 Task가 공통으로 하는 일

Task 1~14는 모두 같은 모양이다. 컴포넌트 하나마다:

1. 필요하면 Radix 의존성을 더한다 (`npm install <pkg>`)
2. `src/components/ui/<name>.tsx`를 만든다
3. `src/data/registry.ts`에 `ComponentMeta`를 더한다 — 내용은 **설계 문서의 해당 절**에서 가져온다
4. `src/routes/components/<Name>Page.tsx`를 만든다 — `InputPage.tsx`가 본보기
5. `nav-config.ts`와 `routes.tsx`에 등록한다
6. `npm run build && npm test`와 대괄호 grep
7. 커밋

**지켜야 할 연결 세 가지** (하나라도 어긋나면 조용히 아무것도 그려지지 않는다):

- `anatomy[].part` ↔ `preview`의 `data-anatomy`
- `guidelines[].id` ↔ `renderGuidelineExample`의 `case`
- `usage[].id`·`cases[].id` ↔ `renderExample`의 `case`

`verified`는 `false`로 둔다. 컨트롤러가 브라우저로 확인한 뒤 올린다.

## 순서

카테고리 순으로 놓되, **의존성이 없는 것부터** 만들어 Radix 설치가 앞쪽에 몰리지 않게 한다.

| Wave | Task | 컴포넌트 | Radix |
|---|---|---|---|
| 1 | 1 | `Textarea` | 없음 |
| 1 | 2 | `Badge` | 없음 |
| 1 | 3 | `Alert` | 없음 |
| 1 | 4 | `Breadcrumb` | 없음 |
| 1 | 5 | `Pagination` | 없음 |
| 2 | 6 | `Radio` | `@radix-ui/react-radio-group` |
| 2 | 7 | `Switch` | `@radix-ui/react-switch` |
| 2 | 8 | `Tabs` | `@radix-ui/react-tabs` |
| 3 | 9 | `Tooltip` | `@radix-ui/react-tooltip` |
| 3 | 10 | `Dialog` | `@radix-ui/react-dialog` |
| 3 | 11 | `Dropdown Menu` | `@radix-ui/react-dropdown-menu` |
| 3 | 12 | `Avatar` | `@radix-ui/react-avatar` |
| 4 | 13 | `Toast` | `@radix-ui/react-toast` |
| 4 | 14 | `Table` | 없음 |

`Table`을 마지막에 둔다. 가장 크고, 앞선 것들(`Badge`·`Checkbox`·`Avatar`·`Pagination`)을 예시에서 쓰기 때문이다.

---

## Task 1: Textarea

**Files:**
- Create: `src/components/ui/textarea.tsx`, `src/routes/components/TextareaPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `inputVariants` (`src/components/ui/input.tsx`)
- Produces: `Textarea`

- [ ] **Step 1: 컴포넌트를 만든다**

`inputVariants`를 재사용하되 높이 관련 클래스는 덮어쓴다 — 여러 줄이므로 고정 높이가 아니다.

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { inputVariants } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/*
 * 가로 크기 조절은 막는다. 폭이 바뀌면 옆 요소가 밀려 폼의 정렬이 무너진다.
 * 세로는 사용자가 늘릴 수 있게 두고, auto는 내용에 따라 자란다.
 */
const resizeVariants = cva('min-h-20 py-2', {
  variants: {
    resize: {
      none: 'resize-none',
      vertical: 'resize-y',
      auto: 'resize-none field-sizing-content',
    },
  },
  defaultVariants: { resize: 'vertical' },
})

type TextareaProps = Omit<React.ComponentProps<'textarea'>, 'size'> &
  VariantProps<typeof resizeVariants>

function Textarea({ className, resize, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputVariants(), 'h-auto', resizeVariants({ resize }), className)}
      {...props}
    />
  )
}

export { Textarea }
```

`field-sizing-content`가 Tailwind에서 생성되는지 빌드 결과물로 확인한다. 생성되지 않으면 `auto`를 `resize-y`와 같게 두고 그 사실을 보고서에 적는다.

`inputVariants()`가 붙이는 `h-control`을 `h-auto`가 덮는지 확인한다. 덮지 않으면 순서를 바꾸거나 `inputVariants`에서 높이를 뺄 자리를 찾는다 — **`inputVariants`를 고쳐야 한다면 고치지 말고 보고하라.** `Input`과 `Select`가 함께 쓰는 것이므로 컨트롤러가 판단한다.

- [ ] **Step 2: 메타·페이지·등록**

설계 문서의 `3. Textarea` 절을 옮긴다. 공통으로 하는 일의 3~5를 수행한다.

`nav-config`에서 자리는 `Checkbox` 뒤다.

- [ ] **Step 3: 검증과 커밋**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
grep -o '\.field-sizing-content{[^}]*}' dist/assets/*.css
```

커밋: `feat: Textarea를 더한다`

---

## Task 2~14

**Task 1과 같은 모양이다.** 각 Task는 설계 문서의 해당 절을 내용의 출처로 삼고, 공통으로 하는 일 1~7을 수행한다.

각 Task에서 특히 주의할 것만 아래에 적는다.

### Task 2: Badge

`variant` 다섯 개가 상태 색과 짝을 이룬다. **Foundations의 `Color Role`이 정한 상태 색의 뜻을 그대로 따른다** — `red`는 위험, `amber`는 경고, `emerald`는 성공, `blue`는 안내. 새 뜻을 만들지 않는다.

누를 수 있는 것처럼 보이면 안 되므로 `hover` 효과를 넣지 않는다. 그 판단을 지침에 적는다.

커밋: `feat: Badge를 더한다`

### Task 3: Alert

`Badge`와 같은 상태 색 체계를 쓴다. **두 문서의 `variant` 값 이름이 어긋나면 안 된다** — `Badge`는 `neutral`로 시작하고 `Alert`는 `info`로 시작하는데, 겹치는 넷(`info`·`success`·`warning`·`destructive`)은 같은 이름이어야 한다.

커밋: `feat: Alert를 더한다`

### Task 4: Breadcrumb

`react-router`의 `Link`를 쓴다. 마지막 항목은 링크가 아니라 `<span>`이고 `aria-current="page"`를 단다.

커밋: `feat: Breadcrumb을 더한다`

### Task 5: Pagination

`Button`을 재사용한다. 새 버튼을 만들지 않는다. 이전·다음은 `variant="outline" size="sm"`, 페이지 번호는 현재 페이지만 `variant="default"`.

전체 개수와 페이지당 개수는 예시의 값이므로 손으로 적어도 된다 — 데이터에서 파생될 성질이 아니다. 다만 **예시 안에서 서로 어긋나면 안 된다**(전체 47개인데 페이지가 3개면 페이지당 개수와 맞아야 한다).

커밋: `feat: Pagination을 더한다`

### Task 6: Radio

`Checkbox`와 짝을 이룬다. **`size` 축을 두지 않는 이유를 `Checkbox`와 같은 문구로 적는다.** 두 문서가 서로를 가리킨다.

커밋: `feat: Radio를 더한다`

### Task 7: Switch

`pending` 상태가 이 컴포넌트의 특징이다. 즉시 반영이라 서버를 기다리는 동안의 모습이 필요하다. 스피너를 손잡이 자리에 두거나 트랙을 흐리게 하는 등, 방식을 정하고 그 이유를 지침에 적는다.

커밋: `feat: Switch를 더한다`

### Task 8: Tabs

`variant`가 `line`과 `enclosed` 둘이다. 활성 표시의 위치가 다르므로 구조도의 부위 이름이 둘 다에 맞아야 한다.

커밋: `feat: Tabs를 더한다`

### Task 9: Tooltip

`TooltipProvider`가 필요하다. **앱 전체에 하나만 둔다** — `AppShell`에 두고 페이지가 각자 두지 않는다. `delayDuration`을 정하고 그 값의 근거를 주석에 적는다.

구조도에서 말풍선을 보이려면 열린 상태여야 한다. `open`을 강제하는 방법을 찾고, `Select`가 `container`로 한 것처럼 무대 안에 그려지게 한다.

커밋: `feat: Tooltip을 더한다`

### Task 10: Dialog

구조도의 미리보기가 문제다. 덮개와 컨테이너가 화면 전체를 덮으므로 무대 안에 가둬야 한다. `Select`의 `container` 방식을 참고하되, **제품 컴포넌트에 문서용 구멍을 내지 않는다.** 방법이 없으면 구조도를 열리지 않은 트리거만으로 두고 나머지 부위를 `Usage`에서 보인다 — 그 판단을 보고서에 적는다.

커밋: `feat: Dialog를 더한다`

### Task 11: Dropdown Menu

`Select`와 구조가 비슷하다. **두 문서의 차이를 지침이 분명히 말해야 한다** — `Select`는 값을 고르고 `Dropdown Menu`는 동작을 실행한다.

위험 항목은 `text-destructive`를 쓰고 구분선 아래로 모은다.

커밋: `feat: Dropdown Menu를 더한다`

### Task 12: Avatar

`state` 축이 `image` · `initials` · `fallback` 셋이다. 이미지 실패를 전시해야 하므로 **깨진 URL을 일부러 쓴다.** 그 의도를 주석에 적는다 — 다음 사람이 오타로 오해하고 고치지 않도록.

커밋: `feat: Avatar를 더한다`

### Task 13: Toast

`ToastProvider`와 `ToastViewport`가 필요하다. `Tooltip`과 같은 이유로 **앱 전체에 하나만 둔다.**

문서에서 사라지는 것을 전시하기 어렵다. 예시는 `open`을 고정해 두고, 사라짐은 지침이 말한다.

커밋: `feat: Toast를 더한다`

### Task 14: Table

이 회차에서 가장 큰 문서다. 앞선 컴포넌트를 예시에서 쓴다 — 상태 열에 `Badge`, 선택 칸에 `Checkbox`, 담당자에 `Avatar`, 아래에 `Pagination`.

`density` 축이 Foundations의 `Spacing`이 정한 밀도 축을 처음 쓰는 자리다. `--spacing-row`와 `--spacing-row-compact` 토큰이 이미 있으므로 그것을 쓴다.

`state`의 `loading`과 `empty`는 행이 아니라 표 전체의 모습이다. 축의 다른 값과 성질이 다르므로, 격자에서 어떻게 보일지 판단하고 어긋나면 보고한다.

커밋: `feat: Table을 더한다`

---

## Task 15: 전체 정합성

**Files:**
- Modify: `src/data/registry.ts`

- [ ] **Step 1: 열여덟 컴포넌트의 축을 대조한다**

이름·값·순서·설명 문구를 표로 만들어 비교한다. 특히:

- `state`의 공통 값(`default`·`hover`·`focus`·`disabled`)이 같은 이름인가
- `size` 축을 가진 것들의 값과 순서가 같은가
- `variant`의 상태 색 이름(`info`·`success`·`warning`·`destructive`)이 `Badge`·`Alert`·`Toast`에서 같은가
- 설명 문구의 어미가 같은 형태인가

어긋난 것을 맞추고 대조표를 보고서에 적는다.

- [ ] **Step 2: 없는 것을 언급하는 문서를 찾는다**

각 문서가 자기에게 없는 축·상태·속성을 언급하는 곳이 있는지 훑는다. v0.7.0에서 `Checkbox`가 없는 `size` 축을, `Select`가 없는 읽기 전용을 언급한 전례가 있다.

- [ ] **Step 3: 서로를 가리키는 문서가 실제로 맞는지 본다**

`Checkbox`↔`Radio`, `Select`↔`Dropdown Menu`, `Alert`↔`Toast`, `Switch`↔`Checkbox`가 서로를 가리킨다. **가리키는 쪽의 설명이 가리켜지는 쪽의 실제 내용과 맞는지** 확인한다.

- [ ] **Step 4: 검증과 커밋**

커밋: `fix: 열여덟 컴포넌트의 축과 문구를 맞춘다`

- [ ] **Step 5: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다. 컨트롤러가 확인한다.

1. 다섯 카테고리가 모두 차고 Components 목록에 18개가 나온다
2. 각 문서의 여섯 절이 다 찬다
3. 컨트롤 높이가 같은 `size`에서 전부 같다
4. 포커스 링이 전부 같다
5. 구조도가 인스턴스 하나이고 지시선이 겹치지 않는다
6. 각 문서의 목차 항목 수가 제목 수와 같다
7. 겹침을 쓰는 것들(`Tooltip`·`Dialog`·`Dropdown Menu`·`Toast`)이 격자에서 다른 칸을 덮지 않는다
8. 상태 색이 `Badge`·`Alert`·`Toast`에서 같은 뜻으로 쓰인다
9. 다크 모드에서 18개 문서가 읽힌다
10. 720px에서 가로 넘침이 없다

## v0.8.0 완료 기준

- [ ] 위 10개 항목을 모두 통과한다
- [ ] 임의 값 대괄호 표기가 없다
- [ ] `npm test`와 `npm run build`가 통과한다
- [ ] 18개 메타의 `verified`가 컨트롤러 검증 뒤 `true`다
- [ ] `main`에 병합하고 프로덕션에 배포한다

## v0.8.0 범위 밖

- `DatePicker` · `Combobox` · `FileUpload`
- `Field` 감싸개
- `Patterns` · `Updates` · `Get started` 채우기
- `useMeasuredTokens` 5벌 중복 해소
