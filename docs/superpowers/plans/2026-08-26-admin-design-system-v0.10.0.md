# 어드민 디자인 시스템 v0.10.0 구현 계획 — 폼 심화

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 폼이 실제로 요구하는 여섯 개를 더해 컴포넌트를 닫는다. 라벨·도움말·오류를 묶는 감싸개, 많은 항목에서 찾아 고르기, 날짜, 파일.

**Architecture:** v0.7.0이 세우고 v0.9.0이 스물여섯으로 넓힌 구조를 그대로 쓴다. `src/components/ui/*`에 컴포넌트, `src/data/registry.ts`에 메타, `src/routes/components/*Page.tsx`에 `render` 콜백. **이번 회차는 순수 함수 둘을 `src/lib/`에 만든다** — 달력 격자와 항목 거르기. 그 둘은 테스트가 지킨다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, Radix UI, react-router 8, Vitest, lucide-react

**설계 문서:** `docs/superpowers/specs/2026-08-26-admin-design-system-v0.10.0-design.md` — 각 컴포넌트의 축·구조·지침·사용 예·예외 상황은 그 문서가 단일 출처다. 이 계획서는 코드의 모양과 순서를 정한다.

## Global Constraints

- 작업 브랜치는 `v0.10.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기 금지** — `data-[state=open]` 같은 임의 **셀렉터** 변형은 허용하고, `grid-cols-[auto_1fr]` 같은 그리드 트랙 키워드도 허용한다. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
  ```

- **언어 규칙** — 구조를 가리키는 이름은 **영문**, 설명은 **한국어**. 방향·순서를 가리키는 낱말과 제품 이름은 한국어.
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 배열이나 계산에서 파생한다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **제품 컴포넌트(`components/ui/*`)는 문서 시스템의 표시(`data-anatomy`)를 알지 않는다.** 페이지가 주입한다.
- **제품 컴포넌트는 라우터를 알지 않는다.** `BreadcrumbLink`가 마지막 자리였고 `asChild`로 풀었다. 새로 만들지 않는다.
- **부모가 자식의 타입이나 개수를 들여다보지 않는다.** `Steps`에서 한 번 걸렀다 — 배치는 각 하위 컴포넌트가 컨텍스트를 읽어 스스로 정한다.
- **문구는 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표, 번역투 회피.
- **17px 이하 글자는 배경과 4.5:1을 넘어야 한다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. **재지 않고 적지 않는다** — 지난 세 회차가 모두 "괜찮아 보이는" 대비 실패를 하나씩 실어 보냈다.
- **같은 축의 두 값이 똑같이 보이면 안 된다.** 라이트에서 갈라지고 다크에서 합쳐지는 것도 같은 결함이다.
- **모달을 열린 채로 마운트하지 않는다.** Radix의 `Select`·`Dialog`·`DropdownMenu` 내용은 무조건 모달이고, 열린 채로 두면 페이지 전체에 `pointer-events: none`과 `aria-hidden`이 걸린다. `Popover`는 `modal`을 켜지 않으므로 잠그지 않지만, 포털된 고정 위치 요소라 격자의 아래 칸을 덮는다.
- **테스트 대상은 순수 함수다.** 어느 디렉터리에 있는지가 아니라 부수 효과가 없고 반환값으로만 판정되는지로 정한다. 컴포넌트 렌더링은 단위 테스트하지 않는다(jsdom이 없다).
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
- **없는 축이나 상태를 문서가 언급하지 않는다**
- 예시는 실제 컴포넌트로 만든다. 목업 상자를 그리지 않는다
- `hover`·`focus` 상태는 `forcedStateClass`(`src/components/docs/state-preview.ts`)로 전시한다
- 페이지가 넣는 아이콘에는 `aria-hidden`을 단다. 컴포넌트 안쪽에서 그리는 아이콘은 컴포넌트의 몫이다
- `Button` 크기는 `Button` 자기 문서가 뜻을 정해 두었다. 예시에서 버튼을 쓸 때 그 뜻을 따른다

## 이번 회차가 새로 지는 의무 — 레지스트리

이 저장소는 v0.9.0 이후 **shadcn 레지스트리를 겸한다.** `registry.json`이 원본이고 `npm run registry`가 `public/r/`을 다시 만든다.

**컴포넌트를 더하면 `registry.json`에도 항목을 더해야 바깥에 닿는다.** Task 7이 여섯 항목을 한 번에 더하고, 둘이 어긋나면 실패하는 테스트를 만든다.

## 각 Task가 공통으로 하는 일

컴포넌트 하나마다:

1. `src/components/ui/<name>.tsx`를 만든다
2. `src/data/registry.ts`의 `components` 배열에 `ComponentMeta`를 더한다 — 내용은 **설계 문서의 해당 절**에서 가져온다. 자리는 `nav-config` 순서와 같아야 한다(테스트가 검사한다)
3. `src/routes/components/<Name>Page.tsx`를 만든다
4. `nav-config.ts`와 `routes.tsx`에 등록한다
5. `npm run build && npm test`와 대괄호 grep
6. 커밋

**지켜야 할 연결 세 가지** (하나라도 어긋나면 조용히 아무것도 그려지지 않는다):

- `anatomy[].part` ↔ `preview`의 `data-anatomy`
- `guidelines[].id` ↔ `renderGuidelineExample`의 `case`
- `usage[].id`·`cases[].id` ↔ `renderExample`의 `case`

`verified`는 `false`로 둔다. 컨트롤러가 브라우저로 확인한 뒤 올린다.

## 순서

`Popover`가 맨 앞이다. `Combobox`와 `Date Picker`가 그 위에 선다.

| Task | 컴포넌트 | 카테고리 | 새로 만드는 순수 함수 |
|---|---|---|---|
| 1 | `Popover` | Feedback | — |
| 2 | `Field` | Inputs | — |
| 3 | `Slider` | Inputs | — |
| 4 | `Combobox` | Inputs | `lib/filter-options.ts` |
| 5 | `Date Picker` | Inputs | `lib/calendar.ts` |
| 6 | `File Upload` | Inputs | — |
| 7 | 정합성과 레지스트리 | — | — |

`@radix-ui/react-popover`와 `@radix-ui/react-slider`는 **이미 설치·커밋되어 있다.** `npm install`을 돌리지 않는다.

`nav-config`의 자리는 **묶음 안 이름순**이다. `nav-config.test.ts`가 그것을 검사하고, `registry.ts`의 배열 순서도 `nav-config`와 같아야 한다(`registry-order.test.ts`).

| 컴포넌트 | 묶음 | 앞 | 뒤 |
|---|---|---|---|
| `Popover` | Feedback | Empty State | Progress |
| `Combobox` | Inputs | Checkbox | Date Picker |
| `Date Picker` | Inputs | Combobox | Field |
| `Field` | Inputs | Date Picker | File Upload |
| `File Upload` | Inputs | Field | Input |
| `Slider` | Inputs | Select | Switch |

여섯이 다 들어오면 Inputs 묶음은 Checkbox · Combobox · Date Picker · Field · File Upload · Input · Radio · Select · Slider · Switch · Textarea 순이 된다.

---

## Task 1: Popover

**Files:**
- Create: `src/components/ui/popover.tsx`, `src/routes/components/PopoverPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Produces: `Popover` · `PopoverTrigger` · `PopoverContent` — Task 4와 Task 5가 이 위에 선다

- [ ] **Step 1: 컴포넌트를 만든다**

Radix의 `Popover`를 감싼다. shadcn 구성을 따른다.

**`modal`을 켜지 않는다.** 켜면 `Select`에서 겪은 것과 같은 일이 벌어진다 — 바깥이 `pointer-events: none`이 되고 GNB가 `aria-hidden`이 된다. 팝오버는 곁들여 보는 것이지 흐름을 끊는 것이 아니다.

`PopoverContent`는 `bg-popover` · `text-popover-foreground` · 테두리 · `shadow-md`를 쓰고, `sideOffset`과 `collisionPadding`을 준다. 가장자리에서 뒤집는 일은 Radix가 맡는다.

여닫는 움직임은 `data-[state=open]`·`data-[state=closed]` 셀렉터 변형으로 준다 — `tw-animate-css`의 유틸리티가 실제로 생성되는지 **빌드 결과물로 확인한다.** 생성되지 않으면 움직임 없이 두고 그 사실을 보고서에 적는다.

- [ ] **Step 2: 메타를 더한다**

설계 문서의 `## 1. \`Popover\`` 절을 옮긴다.

**`properties`는 빈 배열이다.** 열린 표면은 트리거의 변형이 아니라 다른 표면이라 격자의 칸 하나에 담기지 않는다 — `Tooltip`에서 이미 같은 결론에 이르렀다. `ComponentPage`가 빈 절을 그리지 않는다.

`anatomy`는 다섯이다 — Trigger · Content · Header(선택) · Body · Footer(선택). **구조도의 미리보기는 열린 인스턴스다.** `Select`가 목록과 항목을 그렇게 보였다.

`id`는 `popover`, `category`는 `feedback`, `addedIn`·`changedIn`은 `v0.10.0`, `status`는 `stable`, `verified`는 `false`.

- [ ] **Step 3: 페이지를 만든다**

`Playground`는 트리거를 눌러 여는 인스턴스 하나를 놓는다. 만져 볼 수 있는 것이 열고 닫는 일뿐이라도 그것이 이 컴포넌트의 전부다.

`render`는 축이 없으므로 옵션을 받지 않는다. `Tooltip`의 페이지(`TooltipPage.tsx`)가 같은 처지의 본보기다 — 먼저 읽는다.

- [ ] **Step 4: 검증과 커밋**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
grep -o 'fade-in-0\|zoom-in-95' dist/assets/*.css | sort -u
```

브라우저로 열어 **트리거를 눌러 보고**, 열린 채로 GNB의 링크가 눌리는지 확인한다. 페이지가 잠기면 `modal`이 켜진 것이다.

커밋: `feat: Popover를 더한다`

---

## Task 2: Field

**Files:**
- Create: `src/components/ui/field.tsx`, `src/routes/components/FieldPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-slot`의 `Slot`
- Produces: `Field` · `FieldLabel` · `FieldControl` · `FieldHelp` · `FieldError`

- [ ] **Step 1: id를 잇는 얼개를 만든다**

**이 컴포넌트의 존재 이유가 id를 잇는 것이다.** 지금은 문서마다 `htmlFor`와 `aria-describedby`를 손으로 적고 있다.

- `Field`가 `useId`로 뿌리 id 하나를 만들어 컨텍스트에 담는다
- `FieldLabel`은 그 id를 `htmlFor`에 쓴다
- `FieldHelp`와 `FieldError`는 각자 자기 id(`<root>-help`, `<root>-error`)를 갖는다
- `FieldControl`은 `Slot`으로 **자식 하나**에게 `id` · `aria-describedby` · `aria-invalid`를 내려 준다

`aria-describedby`는 도움말과 오류가 **둘 다 있을 때 둘 다** 가리켜야 한다. 지침이 "오류가 나와도 도움말을 지우지 않는다"고 말하므로 둘이 공존하는 것이 정상 상태다. 공백으로 이어 붙인다.

도움말이나 오류가 **없을 때 `aria-describedby`에 죽은 id가 남으면 안 된다.** 스크린 리더가 가리킬 곳이 없는 참조를 읽는다. 있는 것만 이어 붙인다.

`FieldControl`이 자식의 존재를 세지 않도록, 도움말·오류의 유무는 **그 컴포넌트들이 컨텍스트에 스스로 등록**해서 알린다.

- [ ] **Step 2: 축을 만든다**

`layout`(`stacked`·`horizontal`) · `state`(`default`·`error`·`disabled`) · `label`(`plain`·`required`·`optional`).

`horizontal`은 라벨이 왼쪽 고정 폭이다. `Steps`에서 배운 대로 **부모가 자식을 들여다보지 않는다** — `Field`가 `grid grid-cols-[auto_1fr]`로 바뀌고 각 하위 컴포넌트가 컨텍스트의 `layout`을 읽어 자기 자리를 정한다.

`required`와 `optional`은 표시가 서로 반대 방향이다. 격자가 둘을 나란히 보이는 것은 "한 폼에서 하나만 골라 쓰라"는 지침과 짝을 이룬다.

- [ ] **Step 3: 메타·페이지·등록**

설계 문서의 `## 2. \`Field\`` 절을 옮긴다. `category`는 `inputs`, `nav-config` 자리는 `Textarea` 뒤.

**예시가 이 문서의 값어치다.** `Input`·`Select`·`Textarea`·`Checkbox`·`Radio`·`Switch`가 모두 있으므로 실제 폼 한 줄을 만든다.

- [ ] **Step 4: 검증과 커밋**

브라우저에서 **라벨을 눌러 보고** 입력에 포커스가 가는지 확인한다. `htmlFor`가 어긋나면 타입은 통과하고 라벨만 죽는다. 그리고 도움말과 오류가 함께 있는 인스턴스에서 `aria-describedby`가 **두 id를 모두** 담는지 DOM에서 읽는다.

커밋: `feat: Field를 더한다`

---

## Task 3: Slider

**Files:**
- Create: `src/components/ui/slider.tsx`, `src/routes/components/SliderPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

- [ ] **Step 1: 컴포넌트를 만든다**

Radix의 `Slider`를 감싼다. `@radix-ui/react-slider`는 이미 설치되어 있다.

손잡이가 둘인 `range`는 `value`의 길이로 정해진다 — Radix가 `value` 배열마다 `Thumb`를 요구하므로, **손잡이 개수를 세지 말고** 값 배열을 `map`해서 그린다.

Track은 `bg-muted`, Range는 `bg-primary`, Thumb는 테두리와 `bg-background`. 포커스 링은 공통 계약 그대로다.

- [ ] **Step 2: 축과 메타**

`size`(`sm`·`default`) · `state`(`default`·`focus`·`disabled`) · `layout`(`single`·`range`).

**`with-value`는 축이 아니다.** 값을 함께 보이는 것은 늘 그래야 하는 일이라 고를 값이 아니고, 지침이 그것을 말한다. `Value`는 구조의 선택 부위로만 둔다.

설계 문서의 `## 3. \`Slider\`` 절을 옮긴다.

- [ ] **Step 3: 검증과 커밋**

브라우저에서 **손잡이를 키보드 화살표로 움직여** 값이 바뀌는지 확인한다. `range`에서 두 손잡이가 서로를 넘지 않는지도 본다.

커밋: `feat: Slider를 더한다`

---

## Task 4: Combobox

**Files:**
- Create: `src/lib/filter-options.ts`, `src/lib/filter-options.test.ts`, `src/components/ui/combobox.tsx`, `src/routes/components/ComboboxPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `Popover`(Task 1), `inputVariants`
- Produces: `Combobox`, `filterOptions`

- [ ] **Step 1: 거르는 함수를 테스트부터 쓴다**

`src/lib/filter-options.test.ts`. 이것은 순수 함수이므로 이 저장소에서 드물게 **테스트가 실제로 지킬 수 있는 코드**다.

```ts
import { describe, expect, it } from 'vitest'
import { filterOptions } from '@/lib/filter-options'

const OPTIONS = [
  { value: 'kim', label: '김하나' },
  { value: 'lee', label: '이두리' },
  { value: 'park', label: 'Park Sam' },
]

describe('filterOptions', () => {
  it('질의가 비면 전부 돌려준다', () => {
    expect(filterOptions(OPTIONS, '')).toHaveLength(3)
  })

  it('앞글자만이 아니라 포함으로 맞춘다', () => {
    expect(filterOptions(OPTIONS, '하나').map((o) => o.value)).toEqual(['kim'])
  })

  it('대소문자를 가리지 않는다', () => {
    expect(filterOptions(OPTIONS, 'park').map((o) => o.value)).toEqual(['park'])
    expect(filterOptions(OPTIONS, 'PARK').map((o) => o.value)).toEqual(['park'])
  })

  it('앞뒤 공백을 무시한다', () => {
    expect(filterOptions(OPTIONS, '  하나  ').map((o) => o.value)).toEqual(['kim'])
  })

  it('맞는 것이 없으면 빈 배열이다', () => {
    expect(filterOptions(OPTIONS, '없는이름')).toEqual([])
  })

  it('원본 순서를 지킨다', () => {
    expect(filterOptions(OPTIONS, '').map((o) => o.value)).toEqual(['kim', 'lee', 'park'])
  })
})
```

- [ ] **Step 2: 실패를 확인한다**

```bash
npx vitest run src/lib/filter-options.test.ts
```

`filterOptions is not defined` 계열로 실패해야 한다.

- [ ] **Step 3: 함수를 만든다**

```ts
export type ComboboxOption = { value: string; label: string }

/**
 * 앞글자가 아니라 포함으로 맞춘다 — 앞글자만 맞추면 '김하나'를 '하나'로 찾을 수 없다.
 * 원본 순서를 지킨다. 항목 순서에 뜻이 담기는 경우가 많아 점수순으로 흩뜨리지 않는다.
 */
export function filterOptions<T extends ComboboxOption>(options: T[], query: string): T[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return options
  return options.filter((option) => option.label.toLowerCase().includes(needle))
}
```

- [ ] **Step 4: 통과를 확인한다**

- [ ] **Step 5: 컴포넌트를 만든다**

`Popover` 위에 세운다. 트리거는 `Select`의 트리거와 같은 모양이고(`inputVariants` 재사용), 열린 표면 안에 검색 칸과 걸러진 목록이 있다.

키보드는 직접 다룬다 — 위아래로 옮기고, Enter로 고르고, Escape로 닫는다. 지금 짚은 항목은 `aria-activedescendant`로 알린다. 목록은 `role="listbox"`, 항목은 `role="option"`과 `aria-selected`를 갖는다.

`multiple`은 고른 항목이 트리거 안에 `Badge`로 쌓이는 모습이다. **각 배지에 지우는 자리를 둔다** — 지침이 "고른 것을 되돌릴 수 있게 한다"고 말한다.

**`open`은 축이 아니다.** `Select`와 같은 이유다.

- [ ] **Step 6: 메타·페이지·등록·검증**

설계 문서의 `## 4. \`Combobox\`` 절을 옮긴다.

브라우저에서 **글자를 쳐서 걸러지는지**, **화살표와 Enter로 고를 수 있는지**, **결과가 없을 때 문구가 나오는지** 확인한다. 마우스로만 확인하지 않는다.

커밋: `feat: Combobox를 더한다`

---

## Task 5: Date Picker

**Files:**
- Create: `src/lib/calendar.ts`, `src/lib/calendar.test.ts`, `src/components/ui/calendar.tsx`, `src/components/ui/date-picker.tsx`, `src/routes/components/DatePickerPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `Popover`(Task 1), `inputVariants`
- Produces: `Calendar`, `DatePicker`, `buildMonthGrid`

- [ ] **Step 1: 달력 격자를 테스트부터 쓴다**

**달력 라이브러리를 들이지 않는다.** 한 달의 격자를 만드는 것은 날짜 계산이고 그것은 순수 함수다. 라이브러리를 들이면 그쪽 클래스 이름 체계와 이 저장소의 토큰을 맞추는 일이 새로 생기고, 그쪽이 오히려 크다.

`src/lib/calendar.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildMonthGrid } from '@/lib/calendar'

describe('buildMonthGrid', () => {
  it('여섯 주 곱하기 이레를 돌려준다', () => {
    const grid = buildMonthGrid(2026, 7)
    expect(grid).toHaveLength(6)
    for (const week of grid) expect(week).toHaveLength(7)
  })

  it('일요일에서 시작한다', () => {
    const grid = buildMonthGrid(2026, 7)
    expect(grid[0][0].date.getDay()).toBe(0)
  })

  it('그 달에 속하는지 표시한다', () => {
    const grid = buildMonthGrid(2026, 7)
    const inMonth = grid.flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(31)
    expect(inMonth[0].date.getDate()).toBe(1)
    expect(inMonth[30].date.getDate()).toBe(31)
  })

  it('윤년의 2월은 스물아홉 날이다', () => {
    const inMonth = buildMonthGrid(2028, 1).flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(29)
  })

  it('평년의 2월은 스물여덟 날이다', () => {
    const inMonth = buildMonthGrid(2026, 1).flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(28)
  })

  it('앞뒤 칸은 이웃한 달의 날로 채운다', () => {
    const grid = buildMonthGrid(2026, 7)
    const flat = grid.flat()
    const first = flat.findIndex((cell) => cell.inMonth)
    if (first > 0) expect(flat[first - 1].date.getMonth()).toBe(6)
  })

  it('격자의 날짜가 하루씩 이어진다', () => {
    const flat = buildMonthGrid(2026, 7).flat()
    for (let i = 1; i < flat.length; i += 1) {
      const gap = flat[i].date.getTime() - flat[i - 1].date.getTime()
      expect(gap).toBe(24 * 60 * 60 * 1000)
    }
  })
})
```

마지막 검사가 중요하다. 서머타임이 있는 표준시대에서 자정 기준으로 날을 더하면 하루가 23시간이나 25시간이 되어 격자가 어긋난다. 한국은 서머타임이 없지만 **그 사실에 기대지 않는다** — 정오를 기준으로 삼거나 날짜 부분만 더하는 방식으로 시간대에 흔들리지 않게 만든다.

- [ ] **Step 2: 실패를 확인한다**

- [ ] **Step 3: 함수를 만든다**

`month`는 `Date`와 같은 0부터 시작하는 값이다(`0`이 1월). 그 사실을 주석과 타입 이름으로 분명히 한다 — 헷갈리면 한 달씩 밀린 달력이 나온다.

- [ ] **Step 4: 통과를 확인한다**

- [ ] **Step 5: `Calendar`와 `DatePicker`를 만든다**

`Calendar`는 격자를 그린다. `<table>`을 쓴다 — 행과 열에 뜻이 있고 요일이 머리다. 오늘과 고른 날을 **다르게** 표시한다(지침이 그것을 말한다). 고를 수 없는 날은 `disabled`.

`DatePicker`는 `Popover` 위에 `Calendar`를 놓는다. 트리거는 `Select`와 같은 모양이고 값 자리에 날짜가, 오른쪽에 달력 아이콘이 온다.

`range`는 시작과 끝을 함께 보인다. 하나만 고른 중간 상태에서 무엇을 더 골라야 하는지 알린다.

- [ ] **Step 6: 메타·페이지·등록·검증**

설계 문서의 `## 5. \`Date Picker\`` 절을 옮긴다.

**날짜를 손으로 적지 않는다.** 예시의 값은 계산에서 나온다. 다만 `Date.now()`에 기대면 문서가 날마다 달라지므로, 페이지가 기준 날짜 하나를 상수로 정하고 거기서 파생한다. 그 상수가 무엇을 뜻하는지 주석으로 남긴다.

브라우저에서 **다음 달·이전 달로 옮겨 보고**, 2월과 12월(해가 넘어가는 자리)을 확인한다.

커밋: `feat: Date Picker를 더한다`

---

## Task 6: File Upload

**Files:**
- Create: `src/components/ui/file-upload.tsx`, `src/routes/components/FileUploadPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `src/styles/tokens.css`

- [ ] **Step 1: `dragging` 상태를 전시할 길을 만든다**

`state` 축에 `dragging`이 있는데, 그것은 파일을 끌고 영역 위에 왔을 때만 나타난다. `hover`·`focus`가 `state-hover`·`state-focus`로 강제되듯 **`state-dragging`을 `tokens.css`에 더한다.**

`src/components/docs/state-preview.ts`의 `FORCE_CLASS`에도 짝을 더한다. 이 파일은 전시 컴포넌트지만 구체적 UI 컴포넌트를 import하지 않으므로 경계를 넘지 않는다.

- [ ] **Step 2: 컴포넌트를 만든다**

네이티브 `<input type="file">`을 숨기고 그 위에 떨어뜨리는 영역이나 버튼을 그린다. **숨길 때 `display: none`을 쓰지 않는다** — 키보드로 닿을 수 없게 된다. `sr-only`로 접근성 트리에 남긴다.

`variant`가 `dropzone`이면 점선 테두리의 영역, `button`이면 버튼 하나다.

**끌어다 놓기만으로는 부족하다.** 두 변형 모두 눌러서 파일 창을 열 수 있어야 한다 — 끌어다 놓기는 키보드로 할 수 없다.

파일 목록은 호출하는 쪽이 상태로 들고 있고, `FileUploadItem`이 이름·크기·지우는 자리를 그린다. **컴포넌트가 파일을 올리지 않는다** — 올리는 일은 서비스의 몫이고, 이 저장소는 그 화면만 정한다. 그 사실을 주석과 지침 양쪽에 남긴다.

- [ ] **Step 3: 메타·페이지·등록·검증**

설계 문서의 `## 6. \`File Upload\`` 절을 옮긴다. 진행률은 `Progress`를 함께 써서 보인다.

브라우저에서 **버튼을 눌러 파일 창이 열리는지**, **탭으로 닿는지** 확인한다.

커밋: `feat: File Upload를 더한다`

---

## Task 7: 정합성과 레지스트리

**Files:**
- Modify: `src/data/registry.ts`, `src/data/releases.ts`, `registry.json`, `public/r/*`, `package.json`
- Create: `src/data/registry-parity.test.ts`

- [ ] **Step 1: 레지스트리에 여섯 항목을 더한다**

`registry.json`의 `items`에 새 여섯을 더한다. 기존 항목의 모양을 그대로 따른다.

각 항목의 `dependencies`와 `registryDependencies`는 **손으로 짐작하지 말고 그 컴포넌트의 import에서 뽑는다.**

- `@radix-ui/*` import → `dependencies`
- `class-variance-authority`·`lucide-react` import → `dependencies`
- `@/lib/utils` import → `registryDependencies`에 `.../utils.json`
- `@/components/ui/<x>` import → `.../x.json`
- `@/lib/<x>` import (`filter-options`·`calendar`) → **새 `registry:lib` 항목이 필요하다.** 그 둘도 항목으로 더한다
- 모두 `.../tokens.json`

`adminds` 묶음 항목의 `registryDependencies`에도 새 것들을 더한다.

- [ ] **Step 2: 어긋나면 실패하는 테스트를 쓴다**

`src/data/registry-parity.test.ts`. `registry.ts`에 있는데 `registry.json`에 없으면 바깥에 닿지 않는다 — 조용히 어긋나는 자리라 테스트가 지켜야 한다.

```ts
import { describe, expect, it } from 'vitest'
import registryJson from '../../registry.json'
import { components } from '@/data/registry'

const names = new Set((registryJson.items as { name: string }[]).map((i) => i.name))

describe('registry.ts와 registry.json', () => {
  it('모든 컴포넌트가 레지스트리 항목을 갖는다', () => {
    const missing = components.map((c) => c.id).filter((id) => !names.has(id))
    expect(missing, '레지스트리에 빠진 컴포넌트').toEqual([])
  })

  it('묶음 항목이 모든 컴포넌트를 가리킨다', () => {
    const bundle = (registryJson.items as { name: string; registryDependencies?: string[] }[])
      .find((i) => i.name === 'adminds')!
    const referenced = new Set((bundle.registryDependencies ?? []).map((u) => u.split('/').pop()!.replace('.json', '')))
    const missing = components.map((c) => c.id).filter((id) => !referenced.has(id))
    expect(missing, '묶음에서 빠진 컴포넌트').toEqual([])
  })
})
```

`registry.json`을 import하려면 `tsconfig.app.json`에 `resolveJsonModule`이 필요할 수 있다. 없으면 더한다.

- [ ] **Step 3: 실패를 확인하고 통과시킨다**

Step 1을 이미 했다면 항목 하나를 일부러 빼서 실패를 확인하고 되돌린다.

- [ ] **Step 4: 레지스트리를 다시 만든다**

```bash
npm run registry
```

`public/r/`에 새 파일들이 생겼는지 확인한다.

- [ ] **Step 5: `releases.ts`에 v0.10.0을 더한다**

배열 맨 앞에 더한다. 내용의 근거는 `git log --oneline`과 설계 문서다. 지어내지 않는다.

이 회차가 한 일은 여섯 컴포넌트만이 아니다 — **레지스트리를 갖춘 회차**이기도 하다. v0.9.0 항목이 그것을 담고 있지 않다면 함께 손본다.

`package.json`의 `version`을 `0.10.0`으로 올린다.

- [ ] **Step 6: 문서 전체를 한 번 훑는다**

- 모든 `guidelines[].id`가 페이지의 `renderGuidelineExample`에서 다뤄지는가
- 모든 `usage[].id`·`cases[].id`가 페이지의 `renderExample`에서 다뤄지는가
- 새 문서가 자기에게 없는 축이나 상태를 말하지 않는가 (`Popover`의 `properties`가 비어 있고, `Slider`에 `with-value` 축이 없고, `Combobox`에 `open` 축이 없다)
- `Field`가 생겼으니 **기존 문서 중 라벨·도움말·오류를 손으로 잇던 곳**이 있는지 본다. 있으면 `Field`를 쓰도록 고치는 것이 옳은지 판단하고, 고치지 않기로 했다면 왜인지 보고서에 적는다

눈으로 세지 말고 명령으로 센다.

- [ ] **Step 7: 검증과 커밋**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

커밋: `chore: 서른두 컴포넌트를 레지스트리와 맞춘다`

---

## v0.10.0 완료 기준

- 컴포넌트가 서른두 개다
- 여섯 문서가 모두 열리고, 각자 자기에게 있는 절만 그린다
- `registry.ts`의 모든 컴포넌트가 `registry.json`에 있고, 테스트가 그것을 지킨다
- `public/r/`이 새 컴포넌트를 담는다
- `Updates`가 v0.10.0까지 잇는다
- `npm run build`와 `npm test`가 통과한다
- 대괄호 grep이 비어 있다
- 라이트와 다크 양쪽에서 17px 이하 글자가 4.5:1을 넘는다 (컨트롤러가 브라우저로 확인)
- 어느 페이지도 열린 모달로 잠기지 않는다 (컨트롤러가 눌러서 확인)

## v0.10.0 범위 밖

- `Get started` · `Patterns` 채우기 — v0.11.0
- 접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림) — 별도 회차
- `useMeasuredTokens` 5벌 중복 해소
- 템플릿 저장소(`adminds-starter`)에 새 컴포넌트를 옮기는 일 — 레지스트리로 받는다
