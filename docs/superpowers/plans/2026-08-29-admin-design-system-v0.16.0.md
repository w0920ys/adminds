# 어드민 디자인 시스템 v0.16.0 구현 계획 — 남은 로드맵 컴포넌트

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Context Menu`·`Menubar`·`Resizable` 세 컴포넌트를 새로 짜고, 각각 문서 페이지와 함께 등록한다.

**Architecture:** 세 컴포넌트 다 독립 데모다 — 서로 데이터·상태를 공유하지 않고 `DataTable` 등 기존 컴포넌트에 연결되지도 않는다. Context Menu·Menubar는 `src/components/ui/dropdown-menu.tsx`(Radix 메뉴 계열의 스타일 기준)를 그대로 옮긴다. Resizable은 `react-resizable-panels`(새 의존성)를 감싼다. 각 컴포넌트는 (1) `src/components/ui/*.tsx` 원시, (2) `registry.ts`+`registry.json` 항목, (3) `routes.tsx`+`nav-config.ts` 배선, (4) `src/routes/components/*Page.tsx` 문서 페이지를 한 Task 안에서 함께 마친다 — `registry-parity.test.ts`가 `registry.ts`에 항목이 있는데 `registry.json`·구운 payload가 없으면 그 자리에서 테스트를 실패시키기 때문에, 두 파일을 다른 Task로 쪼갤 수 없다(각 Task가 끝날 때 `npm test`가 통과해야 한다는 이 계획의 전역 제약과 맞물린다).

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v4, `@radix-ui/react-context-menu`, `@radix-ui/react-menubar`, `react-resizable-panels`(신규), shadcn 레지스트리, Vitest(node 환경, jsdom 없음).

## Global Constraints

- 작업 브랜치는 `v0.16.0`이다. `main`에 직접 커밋하지 않는다
- **Vitest는 `node` 환경에서 돈다. jsdom이 없다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않는다. 검증은 `npm run build`(tsc+vite) 통과와 개발 서버(`http://localhost:5206`)에서 실제로 우클릭·메뉴 열기·키보드 탐색·패널 드래그까지 눌러 보는 것으로 한다
- **`registry.ts`에 항목을 추가하는 Task는 반드시 같은 Task 안에서 `registry.json` 항목 추가와 `npm run registry` 재굽기까지 마친다.** `registry-parity.test.ts`가 둘의 불일치를 그 자리에서 테스트 실패로 잡는다
- `public/r/*.json`을 손으로 고치지 않는다. `npm run registry`를 돌린다
- 컴포넌트 파일은 기존 관례를 그대로 따른다 — `data-slot` 속성, `cn()` 유틸, `forwardRef` 안 씀(React 19는 ref를 일반 prop으로 받는다), `React.ComponentProps<typeof Primitive.X>`로 타입을 뽑는다
- 새로 만드는 컴포넌트는 실제로 쓰는 만큼만 짓는다(YAGNI) — `dropdown-menu.tsx`가 Content/Item/Separator/Label 넷뿐이고 CheckboxItem·RadioGroup·Sub이 없는 것이 그 예다. Context Menu도 이 문서 페이지가 실제로 쓰는 것(Content/Item/Separator/Label + destructive)만 짓는다. Menubar는 View 메뉴의 확대/축소 표시에 CheckboxItem이 실제로 필요하므로 그것만 추가로 짓는다
- 임의 값 대괄호 표기 금지
- 언어 규칙 — 구조를 가리키는 이름은 영문, 설명은 한국어
- 화면에 나오는 숫자·값을 손으로 적지 않는다(README·registry.json의 컴포넌트 개수는 `components.length` 실측과 맞아야 한다는 뜻 — `registry-parity.test.ts`의 "손으로 적은 컴포넌트 개수" 테스트가 이를 강제한다)
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않는다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다
- `releases.ts`에 새로 쓰는 항목은 간결한 한 줄 요약으로만 쓴다(사용자 지시, v0.13.0 이후 규칙) — 이 계획에는 회차 기록 Task가 없다. v0.15.0에서 빠졌던 걸 사용자 확인 후 추가한 전례가 있으니, Task 5(마지막) 완료 뒤 반드시 사용자에게 회차 기록 Task를 추가할지 확인한다

---

## Task 1: 의존성 셋 추가

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: 없음
- Produces: `@radix-ui/react-context-menu`·`@radix-ui/react-menubar`·`react-resizable-panels` 세 패키지, 뒤 Task들이 import한다

- [ ] **Step 1: 세 패키지를 설치한다**

Run:
```bash
npm install @radix-ui/react-context-menu @radix-ui/react-menubar react-resizable-panels
```

버전 번호를 손으로 적지 않는다 — npm이 실제로 받은 버전을 `package.json`에 스스로 적어 넣는다. 다른 `@radix-ui/*` 패키지들과 같은 자리(알파벳 순서)에 npm이 알아서 넣는다.

- [ ] **Step 2: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: Context Menu·Menubar·Resizable에 쓸 의존성 셋을 더한다"
```

---

## Task 2: Context Menu

**Files:**
- Create: `src/components/ui/context-menu.tsx`
- Create: `src/routes/components/ContextMenuPage.tsx`
- Modify: `src/data/registry.ts`(새 항목 추가, `dropdown-menu` 항목 바로 앞)
- Modify: `registry.json`(새 `registry:ui` 항목 추가)
- Modify: `src/routes/routes.tsx`(라우트 추가)
- Modify: `src/components/layout/nav-config.ts`(Actions 묶음에 링크 추가)

**Interfaces:**
- Consumes: Task 1의 `@radix-ui/react-context-menu`
- Produces: `ContextMenu`·`ContextMenuTrigger`·`ContextMenuContent`·`ContextMenuItem`·`ContextMenuSeparator`·`ContextMenuLabel`(모두 `src/components/ui/context-menu.tsx`에서 export)

- [ ] **Step 1: `src/components/ui/context-menu.tsx`를 만든다**

`src/components/ui/dropdown-menu.tsx`를 먼저 읽어라 — 이 파일은 그 스타일을 그대로 옮긴 것이다. 아래 내용 그대로 새 파일을 만든다:

```tsx
import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from '@/lib/utils'

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          'bg-popover text-popover-foreground z-popover min-w-40 overflow-hidden rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

/*
 * dropdown-menu.tsx의 Item과 같은 규칙이다 — destructive prop 하나로
 * 위험 항목을 표시하고, data-destructive 속성으로 포커스 배경까지
 * 함께 바꾼다. 값을 고르는 게 아니라 동작을 실행하는 메뉴라 선택
 * 표시(Check)가 없다.
 */
function ContextMenuItem({
  className,
  destructive,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { destructive?: boolean }) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-destructive={destructive ? '' : undefined}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[destructive]:text-destructive data-[destructive]:focus:bg-destructive/10 data-[destructive]:focus:text-destructive',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function ContextMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-11 font-bold tracking-widest', className)}
      {...props}
    />
  )
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel }
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 더한다**

`components` 배열 안에서 `id: 'dropdown-menu'`로 시작하는 항목을 찾아라(Actions 카테고리 블록 안, `button` 다음 자리다). 그 항목 **바로 앞**에 아래 항목을 통째로 끼워 넣는다(카테고리 안이 알파벳 순서라 `context-menu`가 `dropdown-menu`보다 앞선다):

```ts
{
  id: 'context-menu',
  name: 'Context Menu',
  aliases: ['우클릭 메뉴', '컨텍스트 메뉴', 'right click', '컨텍스트'],
  category: 'actions',
  status: 'stable',
  addedIn: 'v0.16.0',
  changedIn: 'v0.16.0',
  purpose: '우클릭한 자리에서 그 대상에 대한 동작을 고르게 한다. 항상 눌러야 여는 Dropdown Menu와 달리, 마우스 오른쪽 버튼(또는 롱프레스)이 여는 자리를 정한다.',
  verified: true,
  anatomy: [
    {
      part: 'trigger',
      label: 'Trigger',
      note: '우클릭(또는 롱프레스)하면 그 좌표에 목록이 뜬다. bg-popover, 테두리, radius-md, 쌓임 순서는 z-popover. 각 항목은 text-16이고 포커스되면 bg-accent, 위험한 항목은 text-destructive다. Dropdown Menu와 같은 Item 규칙을 그대로 쓴다 — 위험한 항목은 구분선 아래로 모은다.',
    },
  ],
  properties: [
    {
      name: 'state',
      title: 'State',
      description: '트리거의 상호작용 상태를 나타낸다. 열림은 우클릭해야만 보이는 값이라 이 격자에는 없다 — Usage에서 실제로 우클릭해서 본다.',
      display: 'grid',
      options: [
        { value: 'default' },
        { value: 'hover', note: '포인터가 올라간 동안' },
        { value: 'disabled', note: '지금 열 수 없음' },
      ],
    },
  ],
  guidelines: [
    {
      id: 'not-only-affordance',
      title: 'Not the only way in',
      body: '우클릭은 존재를 몰라도 되는 사용자가 없어야 합니다. Context Menu가 제공하는 동작은 같은 화면의 다른 곳(더보기 버튼 등)에서도 닿을 수 있어야 합니다 — 발견하기 어려운 유일한 통로로 두지 않습니다.',
      do: ['우클릭 메뉴가 여는 동작을 다른 명시적 버튼으로도 제공한다'],
      dont: ['우클릭 메뉴에만 있고 다른 곳에서는 닿을 수 없는 동작을 두지 않는다'],
    },
  ],
  usage: [
    { id: 'row-actions', title: '표 행 동작', note: '표의 한 행을 우클릭하면 그 행에 대한 동작이 뜬다.' },
    { id: 'card-actions', title: '카드 동작', note: '카드 전체를 우클릭 영역으로 삼는다.' },
  ],
  cases: [
    { id: 'disabled-target', title: '동작이 없는 대상', note: '우클릭해도 열 동작이 없는 대상에는 Context Menu 자체를 달지 않는다 — 열리는데 안이 비어 있으면 안 된다.' },
  ],
},
```

- [ ] **Step 3: `registry.json`에 항목을 더한다**

`dropdown-menu` 항목(`"name": "dropdown-menu"`)을 찾아 그 앞에 끼워 넣는다:

```json
{
  "name": "context-menu",
  "type": "registry:ui",
  "title": "Context Menu",
  "dependencies": [
    "@radix-ui/react-context-menu"
  ],
  "registryDependencies": [
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/utils.json"
  ],
  "files": [
    {
      "path": "src/components/ui/context-menu.tsx",
      "type": "registry:ui"
    }
  ]
},
```

- [ ] **Step 4: `src/routes/routes.tsx`에 라우트를 더한다**

파일 위쪽 import 목록에 `import { ContextMenuPage } from '@/routes/components/ContextMenuPage'`를 더한다(다른 컴포넌트 페이지 import들과 같은 자리, 알파벳 순서는 안 지켜도 된다 — 기존 import 목록도 안 지킨다). `components` 라우트의 `children` 배열 **맨 끝**(`{ path: 'accordion', element: <AccordionPage /> },` 다음)에 더한다:

```tsx
{ path: 'context-menu', element: <ContextMenuPage /> },
```

- [ ] **Step 5: `src/components/layout/nav-config.ts`에 링크를 더한다**

`Components` 섹션의 `Actions` 묶음(`{ to: '/components/button', ... }`로 시작)을 찾아라. `Button`과 `Dropdown Menu` 사이(알파벳 순서)에 끼워 넣는다:

```ts
{ to: '/components/context-menu', label: 'Context Menu', updatedAt: '<오늘 실제 날짜>' },
```

`<오늘 실제 날짜>`는 시스템 날짜를 확인해서 `YYYY-MM-DD` 형식으로 적는다 — 손으로 지어내지 않는다.

- [ ] **Step 6: `src/routes/components/ContextMenuPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderContextMenu(options: RenderOptions) {
  const disabled = options.state === 'disabled'
  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={disabled}
        className="bg-surface text-muted-foreground flex h-24 w-56 items-center justify-center rounded-md border text-16"
      >
        여기를 우클릭
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Pencil />
          수정
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy />
          복제
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          <Trash2 />
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'not-only-affordance':
      return kind === 'do' ? (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-64 items-center justify-between gap-3 rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동</span>
            <Button variant="ghost" size="icon" aria-label="'홍길동' 더보기">
              <MoreHorizontal />
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-64 items-center rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동(우클릭 메뉴만 있음)</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'row-actions':
      return (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-72 items-center justify-between gap-3 rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동</span>
            <span className="text-muted-foreground text-12">우클릭</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy />
              복제
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )

    case 'card-actions':
      return (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex w-64 flex-col gap-1 rounded-lg border p-4">
            <strong className="text-16">2026년 3분기 보고서</strong>
            <span className="text-muted-foreground text-12">카드 전체를 우클릭</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              이름 바꾸기
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy />
              복제
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )

    case 'disabled-target':
      return (
        <div className="bg-surface text-muted-foreground flex h-row-compact w-64 items-center rounded-md border px-3 text-14">
          시스템 계정(동작 없음, Context Menu 없음)
        </div>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        data-anatomy="trigger"
        className="bg-surface text-muted-foreground flex h-24 w-56 items-center justify-center rounded-md border text-16"
      >
        여기를 우클릭
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Pencil />
          수정
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy />
          복제
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          <Trash2 />
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function ContextMenuPage() {
  const meta = getComponent('context-menu')
  if (!meta) return <Placeholder title="Context Menu 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderContextMenu}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: registry를 굽는다**

Run: `npm run registry`

이 명령이 `registry.json`을 읽어 `public/r/context-menu.json`을 새로 만든다. Step 3에서 `registry.json`에 항목을 미리 넣어 둬야 이 단계가 그 항목을 실제로 굽는다.

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

`registry-parity.test.ts`가 여기서 통과해야 한다 — `registry.ts`·`registry.json`·구운 payload 셋이 서로 맞아떨어지는지 이 테스트가 확인한다.

- [ ] **Step 9: 브라우저로 확인**

개발 서버(5206)에서 `/components/context-menu`를 연다. Anatomy 무대의 상자를 우클릭해 메뉴가 뜨는지, 수정/복제/삭제 항목이 보이고 삭제가 빨간색인지 확인한다. Properties의 State 격자에서 `disabled` 칸이 실제로 우클릭해도 안 열리는지 확인한다. Guidelines의 do/dont 예시가 다르게 보이는지, Usage의 두 예시(표 행·카드)와 Cases의 한 예시(동작 없는 대상)가 각각 보이는지 확인한다. `/components`(Components 목록)에서도 새 카드가 Actions 묶음에 나타나는지 확인한다.

- [ ] **Step 10: 커밋**

```bash
git add src/components/ui/context-menu.tsx src/routes/components/ContextMenuPage.tsx src/data/registry.ts registry.json public/r/context-menu.json src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(context-menu): 우클릭 메뉴를 새로 짓는다

Dropdown Menu와 같은 Item 규칙(destructive, 구분선 아래 모으기)을
그대로 옮기고, 여는 방식만 우클릭으로 바꿨다."
```

---

## Task 3: Menubar

**Files:**
- Create: `src/components/ui/menubar.tsx`
- Create: `src/routes/components/MenubarPage.tsx`
- Modify: `src/data/registry.ts`(새 항목 추가, `toggle` 항목 바로 앞)
- Modify: `registry.json`(새 `registry:ui` 항목 추가)
- Modify: `src/routes/routes.tsx`(라우트 추가)
- Modify: `src/components/layout/nav-config.ts`(Actions 묶음에 링크 추가)

**Interfaces:**
- Consumes: Task 1의 `@radix-ui/react-menubar`
- Produces: `Menubar`·`MenubarMenu`·`MenubarTrigger`·`MenubarContent`·`MenubarItem`·`MenubarCheckboxItem`·`MenubarSeparator`(모두 `src/components/ui/menubar.tsx`에서 export)

- [ ] **Step 1: `src/components/ui/menubar.tsx`를 만든다**

```tsx
import * as React from 'react'
import { Check } from 'lucide-react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { cn } from '@/lib/utils'

const Menubar = MenubarPrimitive.Root
const MenubarMenu = MenubarPrimitive.Menu

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-default items-center rounded-sm px-3 py-1.5 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground z-popover min-w-40 overflow-hidden rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

/* dropdown-menu.tsx의 Item과 같은 규칙 — destructive prop, data-destructive 속성 */
function MenubarItem({
  className,
  destructive,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & { destructive?: boolean }) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-destructive={destructive ? '' : undefined}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[destructive]:text-destructive data-[destructive]:focus:bg-destructive/10 data-[destructive]:focus:text-destructive',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

/*
 * 선택 표시(Check)는 왼쪽에 붙는다 — Select(select.tsx)는 오른쪽에
 * 두지만, 여러 항목을 위아래로 훑어 내려가는 메뉴 계열(Context Menu·
 * Menubar)에서는 표시가 늘 같은 자리(왼쪽)에 있어야 값 자체(텍스트)를
 * 나란히 읽기 쉽다.
 */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
}
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 더한다**

`id: 'toggle'` 항목(Actions 카테고리 블록의 마지막) **바로 앞**에 끼워 넣는다(`menubar`가 `toggle`보다 알파벳상 앞선다):

```ts
{
  id: 'menubar',
  name: 'Menubar',
  aliases: ['메뉴바', '상단 메뉴', 'menu bar'],
  category: 'actions',
  status: 'stable',
  addedIn: 'v0.16.0',
  changedIn: 'v0.16.0',
  purpose: '가로로 늘어선 메뉴 묶음을 제공한다. 데스크톱 앱의 File/Edit/View 같은 자리다.',
  verified: true,
  anatomy: [
    {
      part: 'trigger',
      label: 'Trigger',
      note: '가로로 늘어선 트리거 각각이 하나의 메뉴를 연다. 열리면 트리거 아래에 목록이 뜬다. bg-popover, 테두리, radius-md, 쌓임 순서는 z-popover. 항목은 Dropdown Menu와 같은 규칙(text-16, 포커스 bg-accent, 위험 항목 text-destructive)이다. 값을 켜고 끄는 항목은 CheckboxItem으로 왼쪽에 체크 표시를 둔다.',
    },
  ],
  properties: [
    {
      name: 'state',
      title: 'State',
      description: '트리거의 상호작용 상태를 나타낸다. 열림은 눌러야만 보이는 값이라 이 격자에는 없다 — Usage에서 실제로 눌러서 본다.',
      display: 'grid',
      options: [
        { value: 'default' },
        { value: 'hover', note: '포인터가 올라간 동안' },
        { value: 'disabled', note: '지금 열 수 없음' },
      ],
    },
  ],
  guidelines: [
    {
      id: 'few-top-level-menus',
      title: 'Few top-level menus',
      body: '가로로 늘어선 메뉴가 많아지면 한 화면에서 훑어보기 어렵습니다. 최상위 메뉴는 서너 개 안으로 둡니다 — 더 필요하면 하위 메뉴가 아니라 화면 구조 자체를 다시 생각합니다.',
      do: ['최상위 메뉴를 서너 개 안으로 둔다'],
      dont: ['최상위 메뉴를 여러 줄로 늘어놓지 않는다'],
    },
  ],
  usage: [
    { id: 'app-shell', title: '앱 셸 메뉴바', note: 'File · Edit · View 세 메뉴로 데스크톱 앱 스타일의 상단 메뉴바를 구성한다.' },
  ],
  cases: [
    { id: 'disabled-menu', title: '지금 쓸 수 없는 항목', note: '문서가 없어 저장할 게 없을 때는 File 메뉴 자체가 아니라 그 안의 저장 항목만 비활성화한다.' },
  ],
},
```

- [ ] **Step 3: `registry.json`에 항목을 더한다**

`toggle` 항목(`"name": "toggle"`)을 찾아 그 앞에 끼워 넣는다:

```json
{
  "name": "menubar",
  "type": "registry:ui",
  "title": "Menubar",
  "dependencies": [
    "@radix-ui/react-menubar"
  ],
  "registryDependencies": [
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/utils.json"
  ],
  "files": [
    {
      "path": "src/components/ui/menubar.tsx",
      "type": "registry:ui"
    }
  ]
},
```

- [ ] **Step 4: `src/routes/routes.tsx`에 라우트를 더한다**

import 목록에 `import { MenubarPage } from '@/routes/components/MenubarPage'`를 더한다. `components` 라우트의 `children` 배열 맨 끝(Task 2가 추가한 `context-menu` 라우트 다음)에 더한다:

```tsx
{ path: 'menubar', element: <MenubarPage /> },
```

- [ ] **Step 5: `src/components/layout/nav-config.ts`에 링크를 더한다**

`Actions` 묶음에서 `Dropdown Menu`(Task 2가 만든 `Context Menu` 다음)와 `Toggle` 사이(알파벳 순서)에 끼워 넣는다:

```ts
{ to: '/components/menubar', label: 'Menubar', updatedAt: '<오늘 실제 날짜>' },
```

- [ ] **Step 6: `src/routes/components/MenubarPage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { Copy, FileText, Redo2, Save, Scissors, Undo2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderMenubar(options: RenderOptions) {
  const disabled = options.state === 'disabled'
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            새로 만들기
          </MenubarItem>
          <MenubarItem>
            <Save />
            저장
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo2 />
            실행 취소
          </MenubarItem>
          <MenubarItem>
            <Redo2 />
            다시 실행
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'few-top-level-menus':
      return kind === 'do' ? (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>새로 만들기</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>실행 취소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>확대</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        <div className="flex flex-col gap-1">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>새로 만들기</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>실행 취소</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>확대</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Insert</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>표</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Format</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>굵게</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>맞춤법 검사</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'app-shell':
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <FileText />
                새로 만들기
              </MenubarItem>
              <MenubarItem>
                <Save />
                저장
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Undo2 />
                실행 취소
              </MenubarItem>
              <MenubarItem>
                <Redo2 />
                다시 실행
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Scissors />
                잘라내기
              </MenubarItem>
              <MenubarItem>
                <Copy />
                복사
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>확대/축소 표시</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    case 'disabled-menu':
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <FileText />
                새로 만들기
              </MenubarItem>
              <MenubarItem disabled>
                <Save />
                저장(문서 없음)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger data-anatomy="trigger">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            새로 만들기
          </MenubarItem>
          <MenubarItem>
            <Save />
            저장
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo2 />
            실행 취소
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export function MenubarPage() {
  const meta = getComponent('menubar')
  if (!meta) return <Placeholder title="Menubar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderMenubar}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 브라우저로 확인**

개발 서버(5206)에서 `/components/menubar`를 연다. File을 눌러 메뉴가 열리는지, Edit도 같은 방식으로 열리는지, 열린 채로 옆(Edit)으로 마우스를 옮기면 File이 닫히고 Edit이 열리는지(Radix Menubar의 기본 동작) 확인한다. Usage의 View 메뉴에서 CheckboxItem 왼쪽에 체크 표시가 있는지 확인한다. Cases의 저장 항목이 비활성화(회색, 안 눌림)인지 확인한다.

- [ ] **Step 10: 커밋**

```bash
git add src/components/ui/menubar.tsx src/routes/components/MenubarPage.tsx src/data/registry.ts registry.json public/r/menubar.json src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(menubar): 상단 메뉴바를 새로 짓는다

Dropdown Menu의 Item 규칙을 옮기고, CheckboxItem 하나를 새로
더했다 — 값을 켜고 끄는 항목(View의 확대/축소 표시)에 쓴다."
```

---

## Task 4: Resizable

**Files:**
- Create: `src/components/ui/resizable.tsx`
- Create: `src/routes/components/ResizablePage.tsx`
- Modify: `src/data/registry.ts`(새 항목 추가, `description-list`와 `scroll-area` 항목 사이)
- Modify: `registry.json`(새 `registry:ui` 항목 추가)
- Modify: `src/routes/routes.tsx`(라우트 추가)
- Modify: `src/components/layout/nav-config.ts`(Data Display 묶음에 링크 추가)

**Interfaces:**
- Consumes: Task 1의 `react-resizable-panels`
- Produces: `ResizablePanelGroup`·`ResizablePanel`·`ResizableHandle`(모두 `src/components/ui/resizable.tsx`에서 export)

- [ ] **Step 1: `src/components/ui/resizable.tsx`를 만든다**

```tsx
import * as React from 'react'
import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '@/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  )
}

const ResizablePanel = ResizablePrimitive.Panel

/*
 * 핸들은 방향에 따라 90도 돈다 — 가로 분할이면 세로선(w-px), 세로
 * 분할이면 가로선(h-px)이다. Radix가 아니라 react-resizable-panels가
 * data-panel-group-direction을 핸들에 심어 주므로 그 값으로 CSS만
 * 바꾼다. withHandle이 켜지면 가운데 그립(점 여섯 개 아이콘)이 뜬다 —
 * 드래그할 수 있다는 것을 시각적으로 알려준다.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & { withHandle?: boolean }) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        'bg-border relative flex w-px items-center justify-center',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
        'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
        'data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
          <GripVertical className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
```

- [ ] **Step 2: `src/data/registry.ts`에 항목을 더한다**

`id: 'description-list'` 항목이 끝나는 자리와 `id: 'scroll-area'` 항목이 시작하는 자리 **사이**에 끼워 넣는다(Data Display 카테고리 블록 안, 알파벳 순서로 `description-list` 다음 `resizable` 다음 `scroll-area`다):

```ts
{
  id: 'resizable',
  name: 'Resizable',
  aliases: ['크기 조절', '분할', 'split', 'panel', '패널'],
  category: 'data-display',
  status: 'stable',
  addedIn: 'v0.16.0',
  changedIn: 'v0.16.0',
  purpose: '화면을 여러 패널로 나누고, 경계를 드래그해 각 패널의 크기를 바꾸게 한다.',
  verified: true,
  anatomy: [
    {
      part: 'handle',
      label: 'Handle',
      note: '패널 사이의 경계선. 가운데 그립 아이콘(선택)으로 드래그 가능함을 알린다. 세로 분할(direction=vertical)에서는 가로선으로, 가로 분할에서는 세로선으로 90도 돈다. 포커스되면 ring이 뜬다 — 키보드(방향키)로도 크기를 조절할 수 있다.',
    },
  ],
  properties: [
    {
      name: 'direction',
      title: 'Direction',
      description: '패널이 가로로 나뉘는지 세로로 나뉘는지 정한다.',
      display: 'row',
      options: [
        { value: 'horizontal', note: '좌우로 나뉜다' },
        { value: 'vertical', note: '위아래로 나뉜다' },
      ],
    },
  ],
  guidelines: [
    {
      id: 'min-size',
      title: 'Set a minimum size',
      body: '패널을 끝까지 좁히면 안의 내용이 잘리거나 아예 안 보이게 됩니다. 각 패널에 최소 크기를 둬 내용이 항상 읽히게 합니다.',
      do: ['각 패널에 defaultSize·minSize를 두어 너무 좁아지지 않게 한다'],
      dont: ['최소 크기 없이 패널이 0까지 줄어들게 두지 않는다'],
    },
  ],
  usage: [
    { id: 'master-detail', title: '마스터-디테일', note: '왼쪽은 목록, 오른쪽은 선택한 항목의 상세 — 전형적인 좌우 분할이다.' },
    { id: 'vertical-split', title: '세로 분할', note: '위는 미리보기, 아래는 로그처럼 위아래로 나뉜 배치.' },
  ],
  cases: [
    { id: 'narrow-screen', title: '좁은 화면', note: 'Resizable 자체는 반응형을 강제하지 않는다 — 좁은 화면에서 드래그로 나누는 대신 위아래로 쌓을지는 호출부가 결정한다.' },
  ],
},
```

- [ ] **Step 3: `registry.json`에 항목을 더한다**

`scroll-area` 항목(`"name": "scroll-area"`) 앞에 끼워 넣는다:

```json
{
  "name": "resizable",
  "type": "registry:ui",
  "title": "Resizable",
  "dependencies": [
    "react-resizable-panels"
  ],
  "registryDependencies": [
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/utils.json"
  ],
  "files": [
    {
      "path": "src/components/ui/resizable.tsx",
      "type": "registry:ui"
    }
  ]
},
```

- [ ] **Step 4: `src/routes/routes.tsx`에 라우트를 더한다**

import 목록에 `import { ResizablePage } from '@/routes/components/ResizablePage'`를 더한다. `children` 배열 맨 끝(Task 3이 추가한 `menubar` 다음)에 더한다:

```tsx
{ path: 'resizable', element: <ResizablePage /> },
```

- [ ] **Step 5: `src/components/layout/nav-config.ts`에 링크를 더한다**

`Data Display` 묶음에서 `Description List`와 `Scroll Area` 사이(알파벳 순서)에 끼워 넣는다:

```ts
{ to: '/components/resizable', label: 'Resizable', updatedAt: '<오늘 실제 날짜>' },
```

- [ ] **Step 6: `src/routes/components/ResizablePage.tsx`를 만든다**

```tsx
import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderResizable(options: RenderOptions) {
  const direction = options.direction === 'vertical' ? 'vertical' : 'horizontal'
  return (
    <Bounds className={direction === 'vertical' ? 'h-56 w-72' : 'h-40 w-72'}>
      <ResizablePanelGroup direction={direction} className="rounded-md border">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">A</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Bounds>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'min-size':
      return kind === 'do' ? (
        <Bounds className="h-32 w-64">
          <ResizablePanelGroup direction="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 25%</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 25%</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      ) : (
        <Bounds className="h-32 w-64">
          <ResizablePanelGroup direction="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize={50}>
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 크기 없음</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 크기 없음</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'master-detail':
      return (
        <Bounds className="h-56 w-full max-w-lg">
          <ResizablePanelGroup direction="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize={35} minSize={20}>
              <div className="flex h-full flex-col gap-1 p-3">
                <span className="text-16">홍길동</span>
                <span className="text-16">김철수</span>
                <span className="text-16">이영희</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="flex h-full flex-col gap-2 p-4">
                <strong className="text-18">홍길동</strong>
                <p className="text-muted-foreground text-16">가입일 2026-01-15</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )

    case 'vertical-split':
      return (
        <Bounds className="h-64 w-full max-w-lg">
          <ResizablePanelGroup direction="vertical" className="rounded-md border">
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="text-muted-foreground flex h-full items-center justify-center text-16">미리보기</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="text-muted-foreground flex h-full flex-col gap-1 overflow-y-auto p-3 text-12">
                <span>12:00:01 요청 시작</span>
                <span>12:00:02 응답 완료</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <Bounds className="h-40 w-72">
      <ResizablePanelGroup direction="horizontal" className="rounded-md border">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">A</div>
        </ResizablePanel>
        <ResizableHandle withHandle data-anatomy="handle" />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Bounds>
  )
}

export function ResizablePage() {
  const meta = getComponent('resizable')
  if (!meta) return <Placeholder title="Resizable 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderResizable}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
```

- [ ] **Step 7: registry를 굽는다**

Run: `npm run registry`

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 브라우저로 확인**

개발 서버(5206)에서 `/components/resizable`을 연다. Playground/Properties에서 `direction`을 `vertical`로 바꾸면 실제로 위아래 분할로 바뀌는지 확인한다. 핸들을 실제로 드래그해 두 패널의 너비(또는 높이)가 바뀌는지, `minSize`(20%) 아래로는 안 줄어드는지 확인한다. 키보드로 핸들에 포커스를 두고 방향키로 크기가 바뀌는지 확인한다. Usage의 마스터-디테일·세로 분할 두 예시가 각각 보이는지 확인한다.

- [ ] **Step 10: 커밋**

```bash
git add src/components/ui/resizable.tsx src/routes/components/ResizablePage.tsx src/data/registry.ts registry.json public/r/resizable.json src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(resizable): 크기 조절 가능한 패널을 새로 짓는다

react-resizable-panels를 감싼다. Radix 계열이 아닌 이 회차의
유일한 컴포넌트다."
```

---

## Task 5: 묶음 마무리 — registry.json의 adminds 번들과 손으로 적은 개수

**Files:**
- Modify: `registry.json`(adminds 번들의 `registryDependencies`와 `description`)
- Modify: `README.md`(컴포넌트 개수 문구)

**Interfaces:**
- Consumes: Task 2~4가 만든 세 `registry:ui` 항목
- Produces: 없음(최종 소비자)

- [ ] **Step 1: 지금 컴포넌트 수를 실제로 센다**

Run:
```bash
grep -c "^    id: '" src/data/registry.ts
```

Task 1~4 전이 39개였다(v0.14.0 최종 리뷰에서 확인된 수). Task 2~4가 셋을 더했으니 이 명령은 42를 찍어야 한다 — 다른 수가 나오면 멈추고 원인을 찾는다(어느 Task가 항목을 빠뜨렸거나 중복으로 넣었다는 뜻이다).

- [ ] **Step 2: `registry.json`의 `adminds` 번들을 갱신한다**

`"name": "adminds"` 항목을 찾는다.

`description`의 "서른아홉"을 "마흔두"로 바꾼다(개수 셋이 늘었다 — 서른아홉+셋=마흔둘이지만, "개" 앞에 오는 관형형은 "마흔두"다. "둘"이 아니라 "두"를 쓴다 — "두 개"가 맞는 표현이고 "둘 개"는 틀린 표현이다):

```
"토큰과 컴포넌트 마흔두 개를 한 번에 가져온다."
```

`registryDependencies` 배열에 세 줄을 알파벳 순서 자리에 끼워 넣는다:
```
"https://adminds.vercel.app/r/context-menu.json",
```
(`combobox.json`과 `data-table.json` 사이, 또는 실제 배열의 알파벳 순서를 보고 정확한 자리를 찾는다)
```
"https://adminds.vercel.app/r/menubar.json",
```
(`file-upload.json`과 `input.json` 사이 근방, 실제 배열의 알파벳 순서를 보고 정확한 자리를 찾는다)
```
"https://adminds.vercel.app/r/resizable.json",
```
(`radio.json`과 `scroll-area.json` 사이 근방, 실제 배열의 알파벳 순서를 보고 정확한 자리를 찾는다)

정확한 삽입 자리는 실제 파일을 읽고 알파벳 순서를 직접 확인해서 정해라 — 위 위치는 참고용이다. `registry-parity.test.ts`의 "묶음 항목이 모든 컴포넌트를 가리킨다" 테스트가 셋 다 빠짐없이 들어갔는지 검증한다.

- [ ] **Step 3: `README.md`의 개수 문구를 갱신한다**

`README.md`에서 다음 줄을 찾는다:
```
npx shadcn@latest add https://adminds.vercel.app/r/adminds.json # 토큰과 39개 전부
```
"39"를 "42"로 바꾼다.

- [ ] **Step 4: registry를 다시 굽는다**

Run: `npm run registry`

`adminds` 번들의 payload(`public/r/adminds.json`)가 Step 2의 변경을 반영해 다시 구워진다.

- [ ] **Step 5: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

`registry-parity.test.ts`의 "손으로 적은 컴포넌트 개수" 테스트 둘(adminds 설명, README)이 여기서 `components.length`(42)와 실제로 맞아떨어지는지 검증한다.

- [ ] **Step 6: 커밋**

```bash
git add registry.json README.md public/r/adminds.json
git commit -m "chore(registry): adminds 번들에 세 컴포넌트를 마저 잇는다"
```

- [ ] **Step 7: 사용자에게 회차 기록 여부를 확인한다**

이 계획에는 회차 기록(`releases.ts`+`package.json` 버전) Task가 없다 — v0.15.0에서 이걸 빠뜨렸다가 Task 1 완료 후 사용자 확인을 거쳐 추가한 전례가 있다. Task 5(이 Task) 완료를 보고할 때, 반드시 사용자에게 회차 기록을 추가할지 물어본다. 추가하기로 하면 v0.15.0의 Task 5(`releases.ts`+`package.json`)를 참고해 같은 모양의 Task를 계획에 덧붙이고 실행한다.

---

## 자체 검토 기록

**스펙 커버리지 확인:**
- 1절(아키텍처, 새 의존성 셋) — Task 1
- 2절(Context Menu) — Task 2
- 3절(Menubar) — Task 3
- 4절(Resizable) — Task 4
- 5절(등록) — Task 2~4에 각각 접어 넣음(registry.ts+registry.json+routes.tsx+nav-config.ts를 한 Task 안에서 함께 마쳐야 `registry-parity.test.ts`가 통과한다는 게 계획 작성 중 발견한 제약이다 — 스펙은 "등록"을 별도 절로 뒀지만 계획은 각 컴포넌트 Task 안에 접어 넣었다. 대신 번들(adminds) 갱신만 모든 컴포넌트가 존재해야 하므로 마지막 Task로 남긴다)
- 범위 밖 항목(DataTable 통합, 실제 동작 배선, 컴포넌트 간 상호작용) — 이 계획 어디서도 건드리지 않음

**타입 일관성:** `RenderOptions`(`PropertyBlock.tsx`가 이미 export)를 세 Task 모두 그대로 쓴다 — 새 타입 없음. `ComponentMeta`(`registry.ts`가 이미 export)의 필드 이름(`anatomy`·`properties`·`guidelines`·`usage`·`cases`)을 세 Task의 registry.ts 항목이 정확히 같은 이름으로 채운다.

**플레이스홀더 스캔:** `<오늘 실제 날짜>` 표기가 Task 2·3·4의 nav-config.ts Step에 있는데, 이건 손으로 못 박을 수 없는 자리(계획 작성 시점과 구현 시점의 날짜가 다를 수 있다)라 조건부가 아니라 구현자가 반드시 시스템 날짜를 확인해 채워야 한다는 지시를 명시적으로 담았다 — Task 10(v0.10 밀도 실측)류 조건부 플레이스홀더와 같은 성격이다.

**모호성 점검:** Context Menu의 API 범위(YAGNI로 최소한만, dropdown-menu.tsx와 동일)와 Menubar의 CheckboxItem 필요성(View 메뉴 예시가 실제로 요구함)을 계획 작성 중 스펙 1절의 느슨한 표현("Content/Item/Separator/CheckboxItem/RadioGroup/Sub")과 대조해 명확히 좁혔다 — 스펙 2·3절의 실사례(사용자가 승인한 내용)가 실제로 요구하는 것만 짓는다는 원칙으로 판단했다. registry.ts·registry.json의 정확한 삽입 위치(알파벳 순서, 카테고리 블록 안)는 실제 파일을 읽어 확인한 카테고리 순서(Actions/Inputs/Navigation/Data Display/Feedback, 각 안에서 알파벳)를 근거로 정했다.
