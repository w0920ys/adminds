# 어드민 디자인 시스템 v0.7.0 구현 계획 — 폼 입력 가족

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Input` · `Select` · `Checkbox` 세 컴포넌트와 그 문서를 더한다. 세 문서가 상태·높이·포커스 링을 같은 규칙으로 다루게 해서, 디자인 시스템이 부품 하나를 넘어서도 성립하는지 확인한다.

**Architecture:** 기존 구조를 그대로 쓴다. `src/components/ui/*`에 컴포넌트, `src/data/registry.ts`에 메타, `src/routes/components/*Page.tsx`에 `render` 콜백. 문서 페이지는 메타에서 파생되므로 새 전시 컴포넌트를 만들지 않는다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, Radix UI, react-router 8, Vitest, lucide-react

**설계 문서:** `docs/superpowers/specs/2026-08-25-admin-design-system-v0.7.0-design.md` — 각 컴포넌트의 축·지침·사용 예·예외 상황 내용은 그 문서가 단일 출처다. 이 계획서는 코드의 모양을 정한다.

## Global Constraints

- 작업 브랜치는 `v0.7.0`. `main`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기(`[3px]`, `[#abc]`, `[calc(...)]`, `rounded-[0.25rem]`) 금지** — `[&_svg]:size-4` 같은 임의 **셀렉터** 변형은 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
  ```

- **언어 규칙** — 구조를 가리키는 이름은 **영문**(섹션 제목, 페이지 이름, UI 라벨, 속성 이름, 코드 식별자), 설명은 **한국어**. 이미 영문인 용어는 유지. 방향·순서를 가리키는 낱말과 제품 이름은 한국어.
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 네비게이션·목차·컴포넌트 목록은 파생이어야 한다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **문구는 Foundations의 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표(라벨·표 셀·제목에는 안 찍음), 번역투 회피.
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사. 끝에 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **`git add -A`를 쓰지 않는다.** 바꾼 파일만 지정해서 커밋한다.

## File Structure

**새로 만드는 파일**

- `src/components/ui/input.tsx` — 네이티브 `<input>` 위의 `cva` 래퍼
- `src/components/ui/checkbox.tsx` — Radix `Checkbox` 래퍼
- `src/components/ui/select.tsx` — Radix `Select` 래퍼. `Select`·`SelectTrigger`·`SelectValue`·`SelectContent`·`SelectItem`만 내보낸다
- `src/routes/components/InputPage.tsx`
- `src/routes/components/CheckboxPage.tsx`
- `src/routes/components/SelectPage.tsx`

**고치는 파일**

- `src/components/ui/button.tsx` — 높이를 `--spacing-control` 토큰에 연결
- `src/data/registry.ts` — `ComponentMeta` 3개 추가
- `src/components/layout/nav-config.ts` — Components 섹션에 문서 3개 추가
- `src/routes/routes.tsx` — 라우트 3개 추가

---

## Task 1: Input

**Files:**
- Create: `src/components/ui/input.tsx`, `src/routes/components/InputPage.tsx`
- Modify: `src/components/ui/button.tsx`, `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`

**Interfaces:**
- Consumes: 없음 (첫 Task)
- Produces: `Input`, `inputVariants`. 이후 `Select`의 트리거가 같은 높이·테두리·포커스 링을 쓴다. 높이 클래스는 `h-control-sm` / `h-control` / `h-control-lg`

- [ ] **Step 1: `Button`의 높이를 토큰에 연결한다**

`tokens.css`에 `--spacing-control-sm: 2rem` · `--spacing-control: 2.25rem` · `--spacing-control-lg: 2.5rem`이 이미 있다. `Button`은 같은 값을 `h-8` · `h-9` · `h-10`으로 적고 있어 **값만 같고 연결되어 있지 않다.** 토큰을 바꿔도 `Button`은 따라오지 않는다.

이번 회차가 "같은 `size`에서 세 컴포넌트의 높이가 같다"를 약속하므로, 그 약속을 토큰이 지키게 한다.

`src/components/ui/button.tsx`의 `size` 변형에서 높이만 바꾼다. 나머지 클래스는 건드리지 않는다.

```ts
      size: {
        default: 'h-control px-4 py-2 has-[>svg]:px-3',
        sm: 'h-control-sm rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-control-lg rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-control',
      },
```

`size-control`이 Tailwind에서 생성되는지 빌드 결과물로 확인한다. 생성되지 않으면 `icon`만 `h-control w-control`로 적는다. 확인 결과를 보고서에 적는다.

- [ ] **Step 2: `Input`을 만든다**

`src/components/ui/input.tsx`:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  "flex w-full min-w-0 rounded-md border border-input bg-background text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted read-only:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30",
  {
    variants: {
      size: {
        sm: 'h-control-sm px-2.5',
        default: 'h-control px-3',
        lg: 'h-control-lg px-3.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

/*
 * 네이티브 input에도 size 속성이 있고 그것은 숫자다.
 * 변형 이름과 겹치므로 네이티브 쪽을 걷어낸다 — 이 시스템에서 폭은 부모가 정한다.
 */
type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

function Input({ className, size, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
```

`read-only:`는 Tailwind v4의 기본 변형이다. 생성되는지 빌드 결과물에서 확인하고, 없으면 `data-readonly` 속성과 셀렉터 변형으로 바꾼다. 확인 결과를 보고서에 적는다.

- [ ] **Step 3: registry에 `Input` 메타를 더한다**

설계 문서의 `1. Input` 절이 내용의 단일 출처다. 축·구조·지침·사용 예·예외 상황을 그대로 옮긴다.

메타의 형태는 기존 `button` 항목을 본보기로 삼는다. 지켜야 할 것:

- `id: 'input'`, `name: 'Input'`, `category: 'inputs'`, `status: 'stable'`, `addedIn: 'v0.7.0'`, `changedIn: 'v0.7.0'`, `verified: false`
- `properties`의 `name`은 `size` · `state` · `width`. 각 `title`은 `Size` · `State` · `Width`
- 옵션의 `label`을 쓰지 않는다. `value`가 그대로 보인다 (v0.6.0에서 정한 규칙)
- `anatomy`의 `part` 값은 미리보기의 `data-anatomy`와 맞물린다
- `guidelines`의 `id`는 `renderGuidelineExample`의 `switch`와 맞물린다
- `usage`·`cases`의 `id`는 `renderExample`의 `switch`와 맞물린다

`verified: false`로 둔다. 컨트롤러가 브라우저로 확인한 뒤에 올린다.

- [ ] **Step 4: `InputPage`를 만든다**

`ButtonPage.tsx`가 본보기다. 같은 구조를 따른다 — `renderInput(options)`, `renderGuidelineExample(id, kind)`, `renderExample(id)`, 그리고 `ComponentPage`에 넘기는 `preview`.

`renderInput`이 다뤄야 하는 상태:

```tsx
function renderInput(options: RenderOptions) {
  const { size, state, width } = options
  return (
    <Input
      size={size as InputSize}
      defaultValue={state === 'readonly' ? '읽기 전용 값' : undefined}
      placeholder="이름을 입력하세요"
      disabled={state === 'disabled'}
      readOnly={state === 'readonly'}
      aria-invalid={state === 'invalid' || undefined}
      className={cn(width === 'hug' && 'w-48')}
    />
  )
}
```

`hover`와 `focus`는 여기서 다루지 않는다. 마우스와 키보드 없이 그 상태를 보이려면 강제 변형이 필요한데, 그것은 다음 단계에서 공통 자리에 둔다. `ButtonPage`도 같은 방식이다.

`preview`는 `data-anatomy` 속성을 단 실제 조각이다. 목업 상자를 그리지 않는다.

- [ ] **Step 5: Playground에서도 hover와 focus가 보이게 한다**

지금 `PropertyBlock`만 `state-hover` · `state-focus`를 붙이고 `Playground`는 붙이지 않는다. 그래서 Playground에서 `hover`를 골라도 아무 일이 일어나지 않는다. `Button`도 지금 그렇다.

페이지마다 우회하지 말고 공통 자리에서 고친다. 세 컴포넌트가 모두 이 축을 쓰므로 지금 고치는 편이 싸다.

`src/components/docs/state-preview.ts`를 만든다.

```ts
/**
 * hover와 focus는 실제 입력 없이 나타나지 않는다.
 * tokens.css의 강제 변형을 붙여 전시한다 — 문서가 그 상태를 보여줘야 하기 때문이다.
 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
}

export function forcedStateClass(stateValue: string | undefined): string | undefined {
  return stateValue ? FORCE_CLASS[stateValue] : undefined
}
```

`PropertyBlock.tsx`에서 자기 `FORCE_CLASS`를 지우고 이 함수를 쓴다. 동작이 바뀌면 안 된다 — `property.name === 'state'`일 때만 붙이는 조건은 그대로다.

```tsx
                  property.name === 'state' ? forcedStateClass(option.value) : undefined,
```

`Playground.tsx`의 미리보기 상자에 붙인다.

```tsx
      <div
        className={cn(
          'bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-8',
          forcedStateClass(options.state),
        )}
      >
        {render(options)}
      </div>
```

`options.state`는 `state` 축이 없는 컴포넌트에서는 `undefined`이므로 아무것도 붙지 않는다. `cn` import가 이미 있는지 확인한다.

- [ ] **Step 6: 네비게이션과 라우트를 더한다**

`nav-config.ts`의 Components 섹션 `items`에 `Button` 뒤로 넣는다.

```ts
      { to: '/components/input', label: 'Input', updatedAt: '2026-08-25' },
```

`routes.tsx`의 `components` 자식에 넣는다.

```tsx
          { path: 'input', element: <InputPage /> },
```

- [ ] **Step 7: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
grep -rn "FORCE_CLASS" src/
grep -o '\.h-control[^{]*{[^}]*}' dist/assets/*.css | head
grep -o 'read-only\\:[^{]*{[^}]*}' dist/assets/*.css | head -3
```

빌드 성공, 68/68 통과, 첫 grep 출력 없음. 셋째·넷째로 `h-control` 계열과 `read-only:` 변형이 실제로 생성됐는지 확인하고 출력을 보고서에 붙인다.

- [ ] **Step 8: 커밋**

```
feat: Input을 더하고 컨트롤 높이를 토큰에 연결한다

Button이 높이를 h-8·h-9·h-10으로 적고 있어 --spacing-control 토큰과
값만 같고 연결되어 있지 않았다. 같은 size에서 컨트롤의 높이가 같다는
약속을 토큰이 지키게 한다.

Input은 Color Role에만 적혀 있던 input·ring 토큰을 처음 쓴다.
```

---

## Task 2: Checkbox

**Files:**
- Create: `src/components/ui/checkbox.tsx`, `src/routes/components/CheckboxPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `package.json`

**Interfaces:**
- Consumes: Task 1이 정한 포커스 링 표현(`focus-visible:ring-ring/50 focus-visible:ring-2`)과 오류 표현(`aria-invalid`)
- Produces: `Checkbox`

- [ ] **Step 1: 의존성을 더한다**

```bash
npm install @radix-ui/react-checkbox
```

`package.json`과 락파일이 함께 바뀐다. 둘 다 커밋한다.

- [ ] **Step 2: `Checkbox`를 만든다**

`src/components/ui/checkbox.tsx`:

```tsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-sm border border-input shadow-xs outline-none transition-shadow',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-current">
        {props.checked === 'indeterminate' ? (
          <Minus className="size-3" />
        ) : (
          <Check className="size-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
```

`import * as React from 'react'`가 필요한지 확인한다 — `React.ComponentProps`를 쓰므로 필요하다. `data-[state=checked]`는 임의 **셀렉터** 변형이므로 허용된다. 값 대괄호가 아니다.

- [ ] **Step 3: registry에 `Checkbox` 메타를 더한다**

설계 문서의 `2. Checkbox` 절을 그대로 옮긴다.

- `id: 'checkbox'`, `name: 'Checkbox'`, `category: 'inputs'`
- `properties`는 `state` · `layout` 둘뿐이다. **`size` 축을 만들지 않는다** — 설계가 그렇게 정했고, 그 이유를 지침에 적는다
- 나머지 규약은 Task 1 Step 3과 같다

- [ ] **Step 4: `CheckboxPage`를 만든다**

Task 1과 같은 구조다. `indeterminate` 상태는 `checked="indeterminate"`로 넘긴다.

라벨을 붙이는 배치(`with-label`, `with-description`)에서는 `<label>`로 감싸 라벨 전체가 눌리게 한다. 그것이 이 컴포넌트의 지침이므로 예시가 지침을 어기면 안 된다.

- [ ] **Step 5: 네비게이션과 라우트를 더한다**

Task 1과 같은 방식. 순서는 `Input` 뒤가 아니라 **`Select` 뒤**다 — 설계의 순서는 `Button` · `Input` · `Select` · `Checkbox`다. Task 3이 `Select`를 넣을 자리를 비워 두고 `Checkbox`를 마지막에 둔다.

- [ ] **Step 6: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

빌드 성공, 68/68 통과, grep 출력 없음.

- [ ] **Step 7: 커밋**

```
feat: Checkbox를 더한다

표 전체 선택에 반드시 쓰이는 중간 상태를 축에 넣었다. 크기 축은 두지
않는다 — 크기를 늘리면 옆 글자와의 정렬이 깨지므로 그 판단을 지침에 적었다.
```

---

## Task 3: Select

**Files:**
- Create: `src/components/ui/select.tsx`, `src/routes/components/SelectPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `package.json`

**Interfaces:**
- Consumes: Task 1의 `inputVariants` — 트리거가 같은 높이·테두리·포커스 링을 써야 한다
- Produces: `Select` · `SelectTrigger` · `SelectValue` · `SelectContent` · `SelectItem`

- [ ] **Step 1: 의존성을 더한다**

```bash
npm install @radix-ui/react-select
```

- [ ] **Step 2: `Select`를 만든다**

`src/components/ui/select.tsx`. shadcn 구성을 따르되 문서에 필요한 다섯 조각만 내보낸다.

트리거의 높이·테두리·포커스 링은 `Input`과 같아야 한다. **클래스를 손으로 다시 적지 말고 `inputVariants`를 쓴다** — 손으로 적으면 한쪽만 바뀌었을 때 어긋난다.

```tsx
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { inputVariants } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default' | 'lg'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        inputVariants({ size }),
        'items-center justify-between gap-2 text-left data-[placeholder]:text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          'bg-popover text-popover-foreground z-popover min-w-32 overflow-hidden rounded-md border shadow-md',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 grid place-items-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
```

`z-popover`가 `tokens.css`에 있는지 확인한다. 없으면 그 자리에 맞는 기존 z-index 토큰을 쓰고, 어느 것을 썼는지 보고서에 적는다. 임의 값을 쓰지 않는다.

`inputVariants`가 `flex`를 이미 갖고 있으므로 트리거에서 다시 적지 않는다.

- [ ] **Step 3: registry에 `Select` 메타를 더한다**

설계 문서의 `3. Select` 절을 그대로 옮긴다.

`state` 축에 `open`이 있다. 열린 목록을 전시해야 하므로 `renderSelect`가 `open` 상태에서 `<Select open>`으로 열어 둔다. 격자 칸 안에서 목록이 다른 칸을 덮을 수 있으니, `Cases`가 아니라 `Properties`의 `state` 격자에서 어떻게 보이는지 컨트롤러가 확인한다.

- [ ] **Step 4: `SelectPage`를 만든다**

Task 1과 같은 구조. 선택지는 어드민에서 실제로 쓸 법한 것으로 둔다 — 상태 필터(`전체` · `활성` · `정지` · `탈퇴`)처럼.

- [ ] **Step 5: 네비게이션과 라우트를 더한다**

`Input`과 `Checkbox` 사이에 넣는다.

- [ ] **Step 6: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
grep -n "inputVariants" src/components/ui/select.tsx
```

빌드 성공, 68/68 통과, 첫 grep 출력 없음, 마지막 grep에 한 줄 나온다(트리거가 `Input`의 변형을 재사용하는지).

- [ ] **Step 7: 커밋**

```
feat: Select를 더한다

트리거가 Input의 변형을 그대로 쓴다. 클래스를 손으로 다시 적으면
한쪽만 바뀌었을 때 나란히 놓인 두 컨트롤이 어긋난다.
```

---

## Task 4: 세 문서의 공통 규칙을 맞춘다

**Files:**
- Modify: `src/data/registry.ts`

**Interfaces:**
- Consumes: Task 1~3의 세 메타
- Produces: 없음

- [ ] **Step 1: 네 가지 공통 규칙이 세 지침에 같은 문구로 있는지 확인한다**

설계 문서의 `4. 세 컴포넌트가 함께 지켜야 하는 것` 절이 네 가지를 정한다.

- 같은 `size`에서 높이가 서로 같다
- 포커스 링이 셋 다 같은 모양이다
- 오류는 `aria-invalid`로 나타내고 색과 문구를 함께 쓴다
- 비활성과 읽기 전용은 다르다

세 컴포넌트의 `guidelines`를 읽고, 이 규칙들이 서로 다른 말로 적혀 있으면 하나로 맞춘다. `Checkbox`에는 읽기 전용이 없으므로 그 항목은 빼되, 빼는 것과 다르게 적는 것을 구별한다.

`State` 문서가 상태 표현 규칙을 이미 정하고 있으므로 세 지침은 그 문서를 가리킨다. 규칙 본문을 세 번 적지 않는다.

- [ ] **Step 2: 세 메타가 서로 어긋나지 않는지 확인한다**

- `size` 축을 가진 둘(`Input`·`Select`)의 옵션 값과 순서가 같은가
- `state` 축의 공통 값(`default`·`hover`·`focus`·`disabled`)이 같은 이름인가
- `width` 축을 가진 둘의 옵션이 같은가

어긋난 것을 고치고, 무엇을 고쳤는지 보고서에 적는다.

- [ ] **Step 3: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

- [ ] **Step 4: 커밋**

```
fix: 폼 입력 세 문서의 공통 규칙을 한 문구로 맞춘다
```

- [ ] **Step 5: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다. 컨트롤러가 다음을 확인한다.

1. 세 문서가 LNB와 Components 목록에 나오고 순서가 `Button` · `Input` · `Select` · `Checkbox`다
2. 같은 `size`에서 `Button` · `Input` · `Select` 트리거의 높이가 실제로 같다
3. 세 컴포넌트의 포커스 링이 같은 굵기·색·오프셋이다
4. `Input`의 `readonly`와 `disabled`가 눈으로 구별된다
5. `Checkbox`의 `indeterminate`가 체크와 다르게 보인다
6. `Select`의 `open` 상태가 격자 안에서 다른 칸을 가리지 않는다
7. `aria-invalid`가 세 컴포넌트에서 같은 모양으로 보인다
8. Anatomy 지시선이 세 문서 모두에서 겹치지 않는다
9. 각 문서의 목차가 채워지고 활성 추종이 동작한다
10. 다크 모드와 720px에서 세 문서가 읽힌다

## v0.7.0 완료 기준

- [ ] 위 10개 항목을 모두 통과한다
- [ ] 임의 값 대괄호 표기가 없다
- [ ] `npm test`와 `npm run build`가 통과한다
- [ ] 세 메타의 `verified`를 컨트롤러 검증 뒤에 `true`로 올린다

## v0.7.0 범위 밖

- `Radio` · `Textarea` · `Switch`
- 라벨·도움말·오류를 묶는 `Field` 감싸개
- `Patterns` · `Updates` · `Get started` 채우기
- `useMeasuredTokens` 5벌 중복 해소
