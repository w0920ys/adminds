# 어드민 디자인 시스템 v0.12.0 — 컴포넌트 여섯 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 어드민이 요구하는데 이 시스템에 없던 여섯(`Sheet` · `Alert Dialog` · `Toggle` · `Collapsible` · `Scroll Area` · `Command`)을 더해 컴포넌트를 32개에서 38개로 늘리고, 그 여섯이 문서·LNB·shadcn 레지스트리 세 곳에 모두 닿게 한다.

**Architecture:** 다섯은 Radix 원시 요소를 감싼다. `Sheet`는 이미 있는 `@radix-ui/react-dialog`를 다시 쓰고(가장자리에 붙은 Dialog다), `Command`는 패키지를 들이지 않고 `Dialog` 위에 순수 함수 둘(`src/lib/command-filter.ts`)로 세운다. 컴포넌트 하나가 Task 하나이고, 각 Task는 제품 컴포넌트·`registry.ts` 메타·문서 페이지·라우트·LNB 항목·`registry.json` 항목을 함께 들여 그 Task만으로 `nav-config.test.ts`와 `registry-parity.test.ts`가 초록이 되게 한다. 마지막 두 Task가 패턴 이전과 릴리스 정리를 맡는다.

**Tech Stack:** React 19 · TypeScript 6 · Tailwind CSS v4(`@theme` 토큰) · react-router v8 · Radix UI · Vite 8 · Vitest 4(node 환경, jsdom 없음)

## Global Constraints

*(앞의 열넷은 스펙의 「전역 제약」을 그대로 옮긴 것이다. 마지막 한 줄은 이 작업장의 사정이다.)*

- 작업 브랜치는 `v0.12.0`. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜는 데이터에서 파생합니다. 손으로 적지 않습니다
- 전시 컴포넌트(`src/components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다. 제품 컴포넌트(`src/components/ui/*`)는 문서 시스템의 표시를 알지 않습니다
- **17px 이하 글자는 4.5:1을 넘어야 합니다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. 재고 적습니다. 어림잡지 않습니다
- **모달을 열린 채로 마운트하지 않습니다**
- 예시 안의 가짜 화면 제목은 `<h4>`를 씁니다. `<h3>`을 쓰지 않습니다 — `assignHeadingIds`(`src/lib/heading-id.ts`)가 `main` 아래의 모든 `h2`·`h3`을 고정 목차로 쓸어 담습니다
- 줄어들 수 없는 고정 폭을 두지 않습니다. `w-full max-w-*`를 씁니다. 줄어들 수 없는 것을 한 줄에 늘어놓지 않습니다
- 서식은 손으로 맞춥니다 — 작은따옴표, 세미콜론 없음. **`prettier --write`를 돌리지 않습니다.** 이 저장소에는 prettier 설정이 없습니다
- `public/r/*.json`을 손으로 고치지 않습니다. `npm run registry`를 돌립니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않습니다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않습니다.** 이 프로젝트가 모든 회차에서 가장 자주 낸 결함입니다. 확인하지 않은 주장은 넣지 않습니다
- **이 하네스는 키보드 동작을 검증할 수 없습니다** — 실제 키 입력이 쓸 만한 `keydown`을 만들지 못하고(`Enter`가 `code: ""`·`keyCode: 0`으로 도착합니다), 합성한 `Escape`는 Radix 층을 닫지 못합니다. 키보드 동작은 소스로 추론하고 그렇게만 적습니다. **하네스를 보정하려고 제품 코드를 고치지 않습니다**
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다

- **이 작업장의 개발 서버는 `.claude/launch.json`의 `adminds-v0.12.0` 항목(포트 5202)이다.** Task 1이 그 항목을 넣고 Task 8이 도로 뺀다. 반드시 `preview_start`에 그 이름을 넘겨 띄운다. Bash로 `npm run dev`를 돌리지 않는다. `adminds` 항목(포트 5199)은 **다른 체크아웃**을 띄운다 — 거기서 잰 값은 전부 무효다. v0.10.0에서 한 에이전트가 정확히 이 실수로 한 판의 측정을 통째로 버렸다(커밋 `452f5a8`).

---

## 파일 구조

**새로 만드는 파일**

| 경로 | 책임 |
|---|---|
| `src/components/ui/sheet.tsx` | 가장자리에 붙는 Dialog. `Sheet`~`SheetDescription` 여덟 |
| `src/components/ui/alert-dialog.tsx` | 바깥 클릭으로 닫히지 않는 경고 대화상자. 아홉 |
| `src/components/ui/toggle.tsx` | 눌려 있는 버튼 하나. `toggleVariants`를 내보낸다 |
| `src/components/ui/toggle-group.tsx` | 그 버튼의 묶음. `toggleVariants`를 그대로 쓴다 |
| `src/components/ui/collapsible.tsx` | 접히는 자리 하나. 머리글 요소가 없다 |
| `src/components/ui/scroll-area.tsx` | 크기가 정해진 상자 안의 스크롤과 그 스크롤바 |
| `src/lib/command-filter.ts` | 거르고 묶는 순수 함수 둘. `Command`의 알맹이 |
| `src/lib/command-filter.test.ts` | 그 둘의 규칙 |
| `src/components/ui/command.tsx` | 검색 칸 + 걸러진 목록(`Command`)과 그 대화상자판(`CommandDialog`) |
| `src/routes/components/SheetPage.tsx` | `/components/sheet` |
| `src/routes/components/AlertDialogPage.tsx` | `/components/alert-dialog` |
| `src/routes/components/TogglePage.tsx` | `/components/toggle` |
| `src/routes/components/CollapsiblePage.tsx` | `/components/collapsible` |
| `src/routes/components/ScrollAreaPage.tsx` | `/components/scroll-area` |
| `src/routes/components/CommandPage.tsx` | `/components/command` |

**고치는 파일**

| 경로 | 무엇을 |
|---|---|
| `.claude/launch.json` | Task 1에서 `adminds-v0.12.0`(5202)을 더하고, Task 8에서 도로 뺀다 |
| `package.json` · `package-lock.json` | 새 Radix 패키지 다섯, 마지막에 버전 `0.12.0` |
| `src/data/registry.ts` | `ComponentMeta` 여섯. 카테고리 안에서 이름순 자리 |
| `src/components/layout/nav-config.ts` | 같은 자리에 LNB 항목 여섯 |
| `src/routes/routes.tsx` | 라우트 여섯 |
| `registry.json` | `registry:ui` 여섯 + `registry:lib` 하나 + `adminds` 묶음 |
| `src/routes/patterns/DestructiveConfirmPatternPage.tsx` | Dialog → Alert Dialog (Task 3) |
| `src/data/patterns.ts` | `destructive-confirm`의 `purpose`·`structure`·`changedIn` (Task 3) |
| `src/data/releases.ts` | v0.12.0 기록 (Task 8) |
| `README.md` | 받아 가는 명령 옆의 개수 (Task 8) |
| `public/r/*.json` | `npm run registry`가 다시 굽는다. 손대지 않는다 |

**작업 순서의 근거.** `Sheet`가 맨 앞이다 — 새 패키지 없이 `Dialog` 하나만 다시 쓰므로 이번 회차의 공통 절차(메타·페이지·라우트·LNB·레지스트리 항목)가 새 의존 없이 한 바퀴 돌아간다. `Alert Dialog`가 그다음이고 그 뒤에 패턴 이전이 온다 — 이전은 새 컴포넌트가 있어야 가능하지만, 되돌릴 수 있어야 하므로 Task를 나눈다. `Command`가 맨 뒤다. 이번 회차에서 가장 크고, 앞의 다섯이 공통 절차를 이미 다져 놓은 뒤에 손대는 편이 낫다.

## 각 Task가 공통으로 하는 일

컴포넌트 Task 여섯(1·2·4·5·6·7)은 모두 아래 여섯 자리를 함께 채운다. **하나라도 빠지면 그 Task의 테스트가 붉어진다** — `nav-config.test.ts`가 라우트와 LNB의 일치를, `registry-parity.test.ts`가 `registry.ts`와 `registry.json`의 일치를 양방향으로 본다.

1. `src/components/ui/<id>.tsx` — 제품 컴포넌트
2. `src/data/registry.ts` — `ComponentMeta` 하나. **카테고리 안에서 이름순 자리에** 넣는다
3. `src/routes/components/<Name>Page.tsx` — 문서 페이지
4. `src/routes/routes.tsx` — import 한 줄(알파벳 순서)과 라우트 한 줄
5. `src/components/layout/nav-config.ts` — 그 카테고리 묶음 안, `registry.ts`와 **같은 자리**
6. `registry.json` — `registry:ui` 항목 하나와 `adminds` 묶음의 `registryDependencies` 한 줄

`nav-config.test.ts`가 거는 제약을 읽고 시작한다. 세 가지다.

- **「묶음 이름과 순서가 registry의 카테고리와 같다」** — 묶음은 `categoryOrder`(actions · inputs · navigation · data-display · feedback) 그대로다. 새 카테고리를 만들지 않는다
- **「각 묶음의 문서가 그 카테고리의 컴포넌트와 일대일로 맞물린다」** — LNB의 순서가 `componentsByCategory()`, 즉 `registry.ts` 배열 순서와 **정확히 같아야** 한다
- **「묶음 안의 문서는 이름순이다」** — `label.localeCompare`로 정렬한 것과 같아야 한다

두 검사가 함께 걸리므로 **`registry.ts` 안의 자리도 이름순**이어야 한다. 이번 회차가 들어가는 자리는 이렇다.

| 카테고리 | 앞 | 새 항목 | 뒤 |
|---|---|---|---|
| Actions | `Dropdown Menu` | **`Toggle`** | (카테고리 끝) |
| Navigation | `Breadcrumb` | **`Command`** | `Pagination` |
| Data Display | `Card` | **`Collapsible`** | `Description List` |
| Data Display | `Description List` | **`Scroll Area`** | `Separator` |
| Feedback | `Alert` | **`Alert Dialog`** | `Dialog` |
| Feedback | `Progress` | **`Sheet`** | `Skeleton` |

`'Alert'.localeCompare('Alert Dialog')`가 음수라 `Alert`가 먼저다. `'Scroll Area'.localeCompare('Separator')`도 음수다(`c` < `e`). 헷갈리면 `node -e` 한 줄로 직접 확인하고 넣는다.

**메타의 공통 값.** 여섯 모두 `status: 'stable'`, `addedIn: 'v0.12.0'`, `changedIn: 'v0.12.0'`, `verified: false`다. `verified`는 사람이 브라우저로 확인한 뒤에 올린다 — 이 계획이 켜지 않는다.

**메타의 본문.** `purpose` · `anatomy` · `properties` · `guidelines` · `usage` · `cases`는 설계 문서 `docs/superpowers/specs/2026-08-27-admin-design-system-v0.12.0-design.md`의 해당 절에 그대로 있다. 그 절의 문장을 옮긴다. 지어내지 않는다. 각 Task가 어느 절인지 적어 둔다.

**LNB 항목의 모양.** `{ to: '/components/<id>', label: '<Name>', updatedAt: '2026-08-27' }`.

---

## Task 1: Sheet

가장자리에서 열리는 표면을 더한다. 새 패키지가 없다 — `@radix-ui/react-dialog`는 `package.json`에 `^1.1.23`으로 이미 있다.

**Files:**
- Modify: `.claude/launch.json`
- Create: `src/components/ui/sheet.tsx`, `src/routes/components/SheetPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `@radix-ui/react-dialog`, `cn`(`@/lib/utils`)
- Produces: `Sheet` · `SheetTrigger` · `SheetClose` · `SheetContent` · `SheetHeader` · `SheetFooter` · `SheetTitle` · `SheetDescription`, 타입 `SheetSide = 'right' | 'left' | 'top' | 'bottom'`

- [ ] **Step 1: 이 작업장의 미리보기 항목을 더한다**

`.claude/launch.json`의 `configurations` 배열에 두 번째 항목으로 넣는다. `adminds`(5199) 항목은 그대로 둔다 — 그것은 다른 체크아웃이다.

```json
    {
      "name": "adminds-v0.12.0",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "--prefix",
        "/Users/yoon/Desktop/데스크탑/바이브코딩/어드민 디자인시스템/.claude/worktrees/v0.12.0",
        "run",
        "dev",
        "--",
        "--port",
        "5202",
        "--strictPort"
      ],
      "port": 5202
    }
```

- [ ] **Step 2: 컴포넌트를 만든다**

`src/components/ui/sheet.tsx`. `dialog.tsx`를 먼저 읽고 온다 — 덮개·닫기 버튼·제목·본문의 모양을 그대로 맞춘다. 다른 것은 컨테이너를 어디에 붙이느냐 하나다.

```tsx
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

export type SheetSide = 'right' | 'left' | 'top' | 'bottom'

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn('fixed inset-0 z-overlay bg-black/50', className)}
      {...props}
    />
  )
}

/*
 * 덮개를 그대로 그릇으로 쓴다 — Dialog가 place-items-center로 가운데에
 * 놓는 자리에서, Sheet는 방향에 따라 flex의 축과 끝을 바꿔 한쪽 변에
 * 붙인다. 늘어나는 쪽은 flex의 기본 stretch가 맡으므로 h-full·w-full을
 * 방향마다 따로 적지 않아도 된다.
 */
const SHEET_ALIGN: Record<SheetSide, string> = {
  right: 'flex-row justify-end',
  left: 'flex-row justify-start',
  top: 'flex-col justify-start',
  bottom: 'flex-col justify-end',
}

/*
 * 좌우는 너비를, 위아래는 높이를 막는다. 어느 쪽도 고정 값이 아니라
 * max-*이므로 화면이 그보다 좁거나 낮으면 컨테이너가 따라 줄어든다.
 */
const sheetContentVariants = cva(
  'relative flex w-full flex-col gap-4 overflow-y-auto border bg-background p-6 shadow-lg outline-none',
  {
    variants: {
      side: {
        right: 'border-l',
        left: 'border-r',
        top: 'border-b',
        bottom: 'border-t',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    compoundVariants: [
      { side: ['right', 'left'], size: 'sm', class: 'max-w-xs' },
      { side: ['right', 'left'], size: 'default', class: 'max-w-sm' },
      { side: ['right', 'left'], size: 'lg', class: 'max-w-xl' },
      { side: ['top', 'bottom'], size: 'sm', class: 'max-h-40' },
      { side: ['top', 'bottom'], size: 'default', class: 'max-h-64' },
      { side: ['top', 'bottom'], size: 'lg', class: 'max-h-96' },
    ],
    defaultVariants: { side: 'right', size: 'default' },
  },
)

function SheetContent({
  className,
  side = 'right',
  size,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants> & { side?: SheetSide; showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <div className={cn('fixed inset-0 z-overlay flex', SHEET_ALIGN[side])}>
        <DialogPrimitive.Content
          data-slot="sheet-content"
          data-side={side}
          className={cn(sheetContentVariants({ side, size }), className)}
          {...props}
        >
          {children}
          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                'absolute top-4 right-4 rounded-xs opacity-70 outline-none transition-opacity hover:opacity-100',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
                'disabled:pointer-events-none',
              )}
            >
              <X className="size-4" />
              <span className="sr-only">닫기</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex shrink-0 flex-col gap-1.5', className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

- [ ] **Step 3: 메타를 더한다**

`src/data/registry.ts`의 `feedback` 항목들 중 `progress`와 `skeleton` 사이에 넣는다.

본문은 설계 문서의 `## 1. \`Sheet\`` 절을 옮긴다. 고정된 값은 이렇다.

```ts
  {
    id: 'sheet',
    name: 'Sheet',
    aliases: ['시트', '사이드 패널', '드로어', 'drawer', 'side panel', '슬라이드 패널'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 1절에서 옮긴다
    properties: [],
    verified: false,
  },
```

**`properties`는 빈 배열이다.** `side`의 네 값도 `size`의 세 값도 닫힌 트리거에서는 똑같아 보인다 — `Dialog`가 `size`를 뺀 것과 같은 이유다. `ComponentPage`가 빈 절을 그리지 않는다.

`anatomy`는 Trigger 하나다. 열린 표면이 `document.body`로 포털되어 무대 안에 없다. Trigger의 `note`에 열린 표면의 생김새를 글로 적는다 — `Dialog`의 메타가 그 본보기다.

- [ ] **Step 4: 문서 페이지를 만든다**

`src/routes/components/SheetPage.tsx`. 축이 없으므로 `PopoverPage.tsx`가 본보기다 — **먼저 읽는다.**

- `render`는 옵션을 받지 않는다. 트리거를 눌러 오른쪽에서 여는 인스턴스 하나를 놓는다
- `renderExample`이 Usage 넷을 그린다. 네 방향과 세 크기가 여기서 실제로 열린다 — `side="left"`, `side="bottom"`, `size="lg"`를 각각 한 번씩 쓴다
- **`open`의 초기값은 언제나 닫힘이다.** 열린 채로 마운트하지 않는다
- 예시 안의 가짜 화면 제목은 `<h4>`를 쓴다

- [ ] **Step 5: 라우트와 LNB를 잇는다**

`src/routes/routes.tsx` — import를 알파벳 자리에 넣고(`SeparatorPage` 뒤, `SkeletonPage` 앞), `components` 자식에 라우트를 넣는다.

```tsx
import { SheetPage } from '@/routes/components/SheetPage'
```

```tsx
          { path: 'sheet', element: <SheetPage /> },
```

`src/components/layout/nav-config.ts` — Feedback 묶음의 `progress`와 `skeleton` 사이.

```ts
          { to: '/components/sheet', label: 'Sheet', updatedAt: '2026-08-27' },
```

- [ ] **Step 6: 레지스트리 항목을 더한다**

`registry.json`의 `items`에서 `separator`와 `skeleton` 사이에 넣는다.

```json
    {
      "name": "sheet",
      "type": "registry:ui",
      "title": "Sheet",
      "dependencies": [
        "@radix-ui/react-dialog",
        "class-variance-authority",
        "lucide-react"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/sheet.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `registryDependencies`에서 `separator.json` 뒤에 한 줄 더한다.

```json
        "https://adminds.vercel.app/r/sheet.json",
```

- [ ] **Step 7: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

Expected: `build`와 `test` 모두 통과. `grep`은 값 대괄호를 하나도 찾지 못한다(셀렉터 변형 `[&_svg]:`는 이 패턴에 걸리지 않는다).

`npm run registry`를 돌리지 않으면 `registry-parity.test.ts`의 「구운 payload가 소스와 바이트까지 같다」가 `public/r에 구운 payload가 없는 항목: ['sheet']`로 실패한다.

- [ ] **Step 8: 브라우저로 확인한다**

`preview_start`에 `adminds-v0.12.0`을 넘겨 띄우고 `/components/sheet`를 연다.

- 트리거를 눌러 오른쪽에서 열리는지
- 네 방향 예시가 각자 다른 변에 붙는지
- 열린 상태에서 창을 좁혀도 컨테이너가 화면을 넘지 않는지(`max-w-*`가 일하는지)
- 제목·본문 글자의 대비를 실제로 재서 17px 이하가 4.5:1을 넘는지

**Escape로 닫히는지는 이 하네스로 확인할 수 없다.** Radix `Dialog`의 동작이므로 그렇게만 적고, 문서에 "확인했다"고 쓰지 않는다.

- [ ] **Step 9: 커밋**

```bash
git add src/components/ui/sheet.tsx src/routes/components/SheetPage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r .claude/launch.json
git commit -m "feat: 가장자리에서 열리는 Sheet를 더한다

Sheet는 가장자리에 붙은 Dialog다. 새 패키지를 들이지 않고 이미 있는
@radix-ui/react-dialog를 다시 썼다. dialog.tsx를 고쳐 겸용하지 않은
것은 DialogContent가 덮개를 가운데 정렬 그릇으로 쓰기 때문이다. 한
파일에서 두 배치를 분기로 다루면 두 컴포넌트의 규칙이 섞인다.

축은 두지 않았다. side의 네 값도 size의 세 값도 닫힌 트리거에서는
똑같아 보여 격자에 담기지 않는다. Dialog가 size를 뺀 것과 같다.

이 작업장을 띄우는 미리보기 항목도 함께 넣는다."
```

---

## Task 2: Alert Dialog

되돌릴 수 없는 동작을 묻는 대화상자를 더한다. `Dialog`의 변형이 아니라 자기 컴포넌트인 이유는 설계 문서의 「판단 2」에 있다.

**Files:**
- Modify: `package.json` · `package-lock.json`
- Create: `src/components/ui/alert-dialog.tsx`, `src/routes/components/AlertDialogPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `@radix-ui/react-alert-dialog`, `buttonVariants`(`@/components/ui/button`), `cn`
- Produces: `AlertDialog` · `AlertDialogTrigger` · `AlertDialogContent` · `AlertDialogHeader` · `AlertDialogFooter` · `AlertDialogTitle` · `AlertDialogDescription` · `AlertDialogCancel` · `AlertDialogAction` — Task 3이 이 이름들을 그대로 쓴다

- [ ] **Step 1: 패키지를 들인다**

```bash
npm install @radix-ui/react-alert-dialog@1.1.23
```

2026-08-27 기준 npm의 최신 판이 `1.1.23`이다. `package.json`에 `^1.1.23`으로 들어가는지 확인한다.

- [ ] **Step 2: 주장하기 전에 소스를 읽는다**

문서에 적을 세 문장이 실제로 참인지 설치된 패키지의 소스에서 확인한다. **읽지 않고 적지 않는다.**

```bash
grep -rn "alertdialog" node_modules/@radix-ui/react-alert-dialog/dist/index.mjs | head
grep -rn "onInteractOutside\|onPointerDownOutside\|preventDefault" node_modules/@radix-ui/react-alert-dialog/dist/index.mjs | head -20
grep -rn "onEscapeKeyDown" node_modules/@radix-ui/react-alert-dialog/dist/index.mjs | head
```

확인할 것 셋.

1. `Content`에 `role="alertdialog"`가 붙는가
2. 바깥 상호작용이 막히는가(`onInteractOutside`/`onPointerDownOutside`에서 `preventDefault`)
3. Escape가 여전히 닫는가

**세 결과를 그대로 메모해 둔다.** Step 4의 메타 문장과 Step 5의 페이지 문구가 이 메모에서만 나온다. 셋 중 하나라도 예상과 다르면 문서를 그 사실에 맞춰 쓴다 — 코드를 하네스에 맞춰 고치지 않는다.

- [ ] **Step 3: 컴포넌트를 만든다**

`src/components/ui/alert-dialog.tsx`. 껍데기는 `dialog.tsx`와 같게 하고 셋을 뺀다 — 닫기 X, `size` 축, `showClose` prop.

```tsx
import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn('fixed inset-0 z-overlay bg-black/50', className)}
      {...props}
    />
  )
}

/*
 * Dialog와 껍데기는 같고 나가는 길이 다르다. 닫기 X를 두지 않는다 —
 * X는 취소인지 그냥 닫기인지 말하지 않는다. 나가는 길은 Cancel 하나다.
 * 바깥 클릭이 막히는 것과 role이 alertdialog인 것은 Radix가 맡는다.
 * size 축도 두지 않는다. 경고는 짧아야 하고, 크기를 고를 수 있게 두면
 * 긴 본문을 담게 된다.
 */
function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay />
      <div className="fixed inset-0 z-overlay grid place-items-center p-4">
        <AlertDialogPrimitive.Content
          data-slot="alert-dialog-content"
          className={cn(
            'relative flex w-full max-w-md flex-col gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </div>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/*
 * 두 동작은 Button을 감싸지 않고 buttonVariants를 직접 쓴다. Radix가
 * Cancel과 Action에 닫는 동작을 붙여 주는데, 그 자리에 asChild로 Button을
 * 끼우면 버튼이 하나 더 겹쳐 보이거나 포커스가 두 겹이 된다.
 */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: 'default' | 'destructive'
}) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
}
```

- [ ] **Step 4: 메타를 더한다**

`src/data/registry.ts`의 `alert`와 `dialog` 사이에 넣는다.

```ts
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    aliases: ['경고 대화상자', '확인 대화상자', '삭제 확인', 'confirm', '확인창'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 2절에서 옮긴다
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '되돌릴 수 없는 동작인지에 따라 실행 버튼의 색과 제목의 문구가 달라진다.',
        display: 'row',
        options: [
          { value: 'default', note: '되돌릴 수 있지만 한 번 물어야 하는 동작' },
          { value: 'destructive', note: '삭제처럼 되돌릴 수 없는 동작. 실행 버튼이 destructive 색을 쓴다' },
        ],
      },
    ],
    verified: false,
  },
```

`anatomy`는 Trigger 하나다 — `Dialog`와 같은 이유(포털)다.

**Step 2에서 확인한 것만 문장으로 쓴다.** 바깥 클릭과 `role`은 확인했으므로 적을 수 있고, Escape는 소스로 확인한 것이므로 "소스로 확인했다"의 무게로만 적는다.

- [ ] **Step 5: 문서 페이지를 만든다**

`src/routes/components/AlertDialogPage.tsx`. `DialogPage.tsx`가 본보기다 — **먼저 읽는다.** 축이 하나뿐이고 그 축이 `Dialog`와 같은 이름·같은 값이라 두 문서가 나란히 읽힌다.

- `render`는 `options.variant`를 받아 트리거의 색을 바꾸고, 눌러 열면 그 색의 `AlertDialogAction`이 나온다
- Usage 넷과 Cases 넷은 설계 문서 2절의 이름 그대로다
- **열린 채로 마운트하지 않는다.** 전부 트리거 뒤에 둔다

- [ ] **Step 6: 라우트와 LNB를 잇는다**

`src/routes/routes.tsx` — import는 `AccordionPage` 뒤, `AlertPage` **앞**이다. `AlertDialogPage`가 `AlertPage`보다 먼저 온다(`'AlertD' < 'AlertP'`). 라우트 한 줄도 `alert` 뒤 `avatar` 앞이 아니라 기존 파일의 라우트 나열 순서를 그대로 따른다.

```tsx
import { AlertDialogPage } from '@/routes/components/AlertDialogPage'
```

```tsx
          { path: 'alert-dialog', element: <AlertDialogPage /> },
```

`src/components/layout/nav-config.ts` — Feedback 묶음의 `alert`와 `dialog` 사이.

```ts
          { to: '/components/alert-dialog', label: 'Alert Dialog', updatedAt: '2026-08-27' },
```

- [ ] **Step 7: 레지스트리 항목을 더한다**

`registry.json`의 `alert`와 `avatar` 사이에 넣는다.

```json
    {
      "name": "alert-dialog",
      "type": "registry:ui",
      "title": "Alert Dialog",
      "dependencies": [
        "@radix-ui/react-alert-dialog"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/button.json",
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/alert-dialog.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `alert.json` 뒤에 한 줄 더한다.

```json
        "https://adminds.vercel.app/r/alert-dialog.json",
```

- [ ] **Step 8: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
```

Expected: 둘 다 통과.

- [ ] **Step 9: 브라우저로 확인한다**

`/components/alert-dialog`를 열고 **바깥을 눌러 본다.** 닫히면 Step 2의 확인이 틀린 것이다 — 그때는 문서를 고치지 말고 왜 닫히는지 먼저 찾는다. `destructive` 실행 버튼의 글자 대비를 재고, 좁은 화면에서 컨테이너가 화면을 넘지 않는지 본다.

- [ ] **Step 10: 커밋**

```bash
git add package.json package-lock.json src/components/ui/alert-dialog.tsx src/routes/components/AlertDialogPage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r
git commit -m "feat: 바깥 클릭으로 닫히지 않는 Alert Dialog를 더한다

Dialog의 variant로 두지 않았다. 둘의 차이가 보이는 것이 아니라
동작하는 것이기 때문이다. 바깥을 눌러도 닫히지 않고, 접근성 트리에서
alertdialog로 읽히고, 동작이 항상 취소와 실행 쌍이다. 셋 다 variant
하나로 표현할 수 없고 Dialog에 조건으로 넣으면 Dialog가 자기 것이
아닌 규칙을 알게 된다.

닫기 X를 두지 않는다. X는 취소인지 그냥 닫기인지 말하지 않는다.
size 축도 두지 않는다. 경고가 길어질 자리를 만들지 않는다.

문서에 적은 세 문장은 설치한 패키지의 소스를 읽고 확인한 것이다."
```

---

## Task 3: `Destructive confirm` 패턴을 Alert Dialog로 옮긴다

`Alert Dialog`가 실린 순간 `src/data/patterns.ts`의 `destructive-confirm`이 거짓이 된다 — `purpose`가 "Dialog로 묻고"라고 말하고, `structure`의 두 자리가 `components: ['dialog']`로 `Dialog` 문서를 가리킨다. 이 Task가 그것을 고친다.

**Task를 나눈 이유.** 검토하는 사람이 새 컴포넌트는 받고 패턴 이전은 되돌리는 선택을 할 수 있어야 한다. Task 2와 합치면 그 선택지가 없어진다.

**Files:**
- Modify: `src/routes/patterns/DestructiveConfirmPatternPage.tsx`
- Modify: `src/data/patterns.ts`
- Modify: `src/components/layout/nav-config.ts`

**Interfaces:**
- Consumes: Task 2의 `AlertDialog` 아홉

- [ ] **Step 1: 페이지를 옮긴다**

`src/routes/patterns/DestructiveConfirmPatternPage.tsx`. 이름이 일대일로 대응하므로 새로 판단할 것이 없다.

| 지금 | 옮긴 뒤 |
|---|---|
| `Dialog` | `AlertDialog` |
| `DialogTrigger` | `AlertDialogTrigger` |
| `DialogContent size="sm"` | `AlertDialogContent` (size 없음) |
| `DialogHeader`·`DialogTitle`·`DialogDescription`·`DialogFooter` | 접두사만 `AlertDialog`로 |
| `<DialogClose asChild><Button variant="outline">취소</Button></DialogClose>` | `<AlertDialogCancel>취소</AlertDialogCancel>` |
| `<Button variant="destructive">삭제</Button>` (닫는 역할) | `<AlertDialogAction variant="destructive">삭제</AlertDialogAction>` |

주의할 자리 셋.

1. **`DestructiveFlow`의 실행 버튼**은 `onClick`으로 `setOpen(false)`와 `setDone(true)`를 함께 한다. `AlertDialogAction`은 스스로 닫으므로 `setOpen(false)`가 필요 없다. `onClick={() => setDone(true)}`만 남긴다. `open`/`onOpenChange`는 그대로 `AlertDialog`에 넘긴다
2. **`undo-in-toast` 지침의 do 예시**는 `DialogTrigger asChild`로 `ToastAction`을 감싸고 있다. `AlertDialogTrigger asChild`로 바꾸면 그대로 산다 — 텍스트만 흉내 낸 버튼이 아니라 실제 `ToastAction`의 DOM에 여는 동작을 얹는 구조를 깨지 않는다
3. **`failed` 케이스**는 "대화상자는 닫지 않고 다시 시도할 수 있게 둔다"고 말한다. 실행 버튼이 `AlertDialogAction`이면 눌리는 즉시 닫힌다. 이 자리에서는 `AlertDialogAction`을 쓰지 말고 `Button variant="destructive"`를 그대로 둔다 — 문구가 말하는 동작과 화면이 어긋나면 안 된다. **그 이유를 그 자리 주석에 적는다**

`Button` import는 남는다(2와 3, 그리고 트리거들이 쓴다). `Dialog` import는 이 파일에서 전부 사라진다.

- [ ] **Step 2: 옮긴 뒤 남은 Dialog가 없는지 본다**

```bash
grep -n "Dialog" src/routes/patterns/DestructiveConfirmPatternPage.tsx | grep -v "AlertDialog"
```

Expected: 아무것도 나오지 않는다. 나오면 그 줄이 Step 1에서 빠뜨린 자리다.

- [ ] **Step 3: 패턴 데이터를 고친다**

`src/data/patterns.ts`의 `destructive-confirm`.

```ts
    changedIn: 'v0.12.0',
    purpose:
      '되돌릴 수 없는 동작을 실행하기 전에 한 번 멈추는 흐름이다. Alert Dialog로 묻고 Toast로 결과를 알린다.',
    structure: [
      { slot: '위험 동작 Button', note: 'destructive 버튼이거나 Dropdown Menu 안의 항목이다', components: ['button', 'dropdown-menu'] },
      { slot: 'Alert Dialog 제목', note: '무엇이 지워지는지 적는다. "삭제하시겠습니까"만으로는 대상을 알 수 없다', components: ['alert-dialog'] },
      { slot: 'Alert Dialog 본문', note: '영향 범위를 적는다. 되돌릴 수 없으면 그 사실을 여기에 적는다', components: ['alert-dialog'] },
      { slot: '취소와 실행', note: '취소는 왼쪽 outline, 실행은 오른쪽 destructive. 바깥을 눌러도 닫히지 않는다', components: ['alert-dialog'] },
      { slot: 'Toast', note: '실행한 뒤에 결과를 알린다. 되돌릴 수 있으면 여기에 되돌리기를 둔다', components: ['toast'] },
    ],
```

`example.note`의 "Dialog를 열고"도 "Alert Dialog를 열고"로 고친다. `guidelines`의 본문에 `Dialog`라는 낱말이 있는지 훑고, 있으면 그 자리도 고친다.

`addedIn`은 `v0.11.0` 그대로 둔다 — 이 패턴이 처음 실린 회차는 바뀌지 않는다.

- [ ] **Step 4: 이 문서의 수정일을 올린다**

`src/components/layout/nav-config.ts`의 Patterns 묶음에서 `/patterns/destructive-confirm` 항목의 `updatedAt`을 `'2026-08-27'`로 맞춘다.

- [ ] **Step 5: 검사한다**

```bash
npm run build && npm test
```

Expected: 둘 다 통과. 특히 `patterns.test.ts`의 「자리가 가리키는 컴포넌트가 registry에 있다」가 `alert-dialog`를 찾는다 — Task 2가 메타를 넣었으므로 통과한다. Task 2 없이 이 Task만 돌리면 여기서 실패한다.

- [ ] **Step 6: 브라우저로 확인한다**

`/patterns/destructive-confirm`을 열고 Example의 삭제 흐름을 실제로 누른다. 삭제를 누르면 대화상자가 닫히고 Toast가 뜨는지, `failed` 케이스만 눌러도 닫히지 않는지 본다. 그리고 **바깥을 눌러 닫히지 않는 것을 여기서도 확인한다** — 이 패턴이 그 동작을 요구하는 자리다.

- [ ] **Step 7: 커밋**

```bash
git add src/routes/patterns/DestructiveConfirmPatternPage.tsx src/data/patterns.ts src/components/layout/nav-config.ts
git commit -m "refactor(patterns): Destructive confirm을 Alert Dialog로 옮긴다

Alert Dialog가 실린 순간 이 패턴의 purpose와 structure가 거짓이 됐다.
Dialog로 묻는다고 적혀 있고 자리 둘이 Dialog 문서를 가리키는데, 이
시스템이 이제 권하는 것은 Alert Dialog다. 화면에서 눈으로 잡히지 않는
종류의 거짓이라 미루지 않았다.

실행 실패 케이스만 Button을 그대로 뒀다. 그 자리의 문구가 '대화상자는
닫지 않고 다시 시도할 수 있게 둔다'인데 AlertDialogAction은 눌리는
즉시 닫힌다. 문구와 화면이 어긋나지 않게 뒀고 그 이유를 주석에 적었다."
```

---

## Task 4: Toggle과 Toggle Group

눌려 있는 버튼과 그 묶음을 더한다. **문서 하나, 파일 둘, 레지스트리 항목 하나**다 — 이유는 설계 문서 3절에 있다.

**Files:**
- Modify: `package.json` · `package-lock.json`
- Create: `src/components/ui/toggle.tsx`, `src/components/ui/toggle-group.tsx`, `src/routes/components/TogglePage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `cn`
- Produces: `Toggle` · `toggleVariants`(`toggle.tsx`), `ToggleGroup` · `ToggleGroupItem`(`toggle-group.tsx`)

- [ ] **Step 1: 패키지를 들인다**

```bash
npm install @radix-ui/react-toggle@1.1.18 @radix-ui/react-toggle-group@1.1.19
```

2026-08-27 기준 npm의 최신 판이 각각 `1.1.18`과 `1.1.19`다. 판 번호가 서로 다른 것이 정상이다.

- [ ] **Step 2: `toggle.tsx`를 만든다**

`toggleVariants`를 여기서 정의하고 **내보낸다.** `toggle-group.tsx`가 그것을 그대로 쓴다.

```tsx
import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * 켜진 모습은 data-state="on"으로 온다. Radix가 붙이는 속성이라 문서의
 * state 격자에서도 그 속성만 강제하면 실제와 같은 모습이 나온다.
 * 높이는 Button과 같은 control 토큰을 쓴다 — 같은 줄에 나란히 놓이는
 * 자리가 많아 높이가 어긋나면 바로 보인다.
 */
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border bg-background shadow-xs',
      },
      size: {
        sm: 'h-control-sm min-w-control-sm px-2',
        default: 'h-control min-w-control px-2.5',
        lg: 'h-control-lg min-w-control-lg px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
```

- [ ] **Step 3: `toggle-group.tsx`를 만든다**

묶음이 `variant`와 `size`를 컨텍스트로 내려 준다. 항목마다 다시 적지 않게 하려는 것이다 — 항목이 자기 것을 직접 받으면 한 묶음 안에서 크기가 갈릴 수 있다.

```tsx
import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

/*
 * 묶음이 정하고 항목이 따른다. 항목이 variant·size를 각자 받으면 한
 * 묶음 안에서 크기가 갈릴 수 있는데, 그것은 이 컴포넌트가 있는 이유와
 * 반대다. 항목이 직접 넘긴 값이 있으면 그것을 우선한다 — 예외를 아예
 * 막지는 않는다.
 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  variant: 'default',
  size: 'default',
})

function ToggleGroup({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn('flex w-fit items-center gap-1', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: variant ?? context.variant, size: size ?? context.size }),
        className,
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
```

- [ ] **Step 4: 메타를 더한다**

`src/data/registry.ts`의 `actions` 카테고리 끝, `dropdown-menu` 뒤에 넣는다.

```ts
  {
    id: 'toggle',
    name: 'Toggle',
    aliases: ['토글', '토글 그룹', 'toggle group', '세그먼트', 'segmented control', '눌린 버튼'],
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 3절에서 옮긴다
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '쉬고 있을 때 테두리를 보일지 정한다. 표 위의 도구 줄처럼 밀도가 높은 자리에는 테두리를 두지 않는다.',
        display: 'row',
        options: [
          { value: 'default', note: '기본. 쉬고 있을 때는 배경도 테두리도 없다' },
          { value: 'outline', note: '눌러야 하는 자리라는 것을 쉬고 있을 때도 보인다' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '같은 줄에 놓이는 컨트롤과 높이를 맞춘다. Button과 같은 control 토큰을 쓴다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 위의 도구 줄' },
          { value: 'default', note: '기본' },
          { value: 'lg', note: '화면 위쪽의 보기 전환처럼 손이 자주 가는 자리' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '눌려 있는지와 상호작용을 나타낸다. 켜진 모습은 Radix가 붙이는 data-state="on"이다.',
        display: 'grid',
        options: [
          { value: 'default', note: '기본. 꺼져 있다' },
          { value: 'hover', note: '마우스가 올라온 상태' },
          { value: 'on', note: '켜져 있다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '켜고 끌 수 없음' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '홀로 서는지 묶이는지, 묶인다면 몇 개까지 켜지는지 정한다.',
        display: 'grid',
        options: [
          { value: 'single', note: '홀로 선 Toggle 하나' },
          { value: 'group-single', note: '묶음에서 하나만 켜진다. 보기 전환' },
          { value: 'group-multiple', note: '묶음에서 여럿이 함께 켜진다. 서식 도구' },
        ],
      },
    ],
    verified: false,
  },
```

- [ ] **Step 5: 문서 페이지를 만든다**

`src/routes/components/TogglePage.tsx`. `render`가 네 축을 모두 받는다.

- `layout === 'single'`이면 `Toggle` 하나, `group-*`이면 `ToggleGroup type="single"` 또는 `type="multiple"`에 항목 셋
- `state`는 `data-state="on"`을 강제하는 대신 **실제로 켜진 인스턴스**로 보인다 — `Toggle`은 `defaultPressed`, `ToggleGroupItem`은 묶음의 `defaultValue`로 켠다. Radix가 붙이는 속성을 손으로 흉내 내면 실제와 어긋날 수 있다
- `hover`와 `focus`는 이 저장소가 다른 컴포넌트에서 쓰는 상태 클래스 방식을 그대로 따른다. `CheckboxPage.tsx`나 `ButtonPage.tsx`에서 그 방법을 **먼저 읽고** 같은 방식으로 쓴다
- 아이콘만 있는 예시에는 반드시 이름을 준다(`aria-label` 또는 `sr-only`). 지침이 그것을 말한다

- [ ] **Step 6: 라우트와 LNB를 잇는다**

`src/routes/routes.tsx`.

```tsx
import { TogglePage } from '@/routes/components/TogglePage'
```

```tsx
          { path: 'toggle', element: <TogglePage /> },
```

`src/components/layout/nav-config.ts` — Actions 묶음의 `dropdown-menu` 뒤(묶음의 마지막).

```ts
          { to: '/components/toggle', label: 'Toggle', updatedAt: '2026-08-27' },
```

- [ ] **Step 7: 레지스트리 항목을 더한다**

`registry.json`의 `toast`와 `tooltip` 사이에 넣는다. **파일이 둘인 항목**이다 — `date-picker`가 같은 모양이다.

```json
    {
      "name": "toggle",
      "type": "registry:ui",
      "title": "Toggle",
      "dependencies": [
        "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group",
        "class-variance-authority"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/toggle.tsx",
          "type": "registry:ui"
        },
        {
          "path": "src/components/ui/toggle-group.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `toast.json` 뒤에 한 줄 더한다.

```json
        "https://adminds.vercel.app/r/toggle.json",
```

- [ ] **Step 8: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
```

Expected: 둘 다 통과. `registry-parity.test.ts`의 「registry.json과 payload의 파일 목록이 어긋난 항목」이 파일 둘을 함께 본다 — 하나만 구워지면 여기서 잡힌다.

- [ ] **Step 9: 브라우저로 확인한다**

`/components/toggle`에서 실제로 눌러 본다.

- `group-single`에서 켜진 것을 다시 눌러 **값이 비는지** 본다. 비면 그것이 Radix의 기본 동작이고, 지침이 말하는 그대로다. 비지 않게 막는 것은 쓰는 쪽의 일이다
- `on` 상태의 글자 대비를 잰다 — `accent` 배경 위의 `accent-foreground`다
- 포커스 링이 `outline`과 `default` 양쪽에서 보이는지 본다

- [ ] **Step 10: 커밋**

```bash
git add package.json package-lock.json src/components/ui/toggle.tsx src/components/ui/toggle-group.tsx src/routes/components/TogglePage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r
git commit -m "feat: Toggle과 Toggle Group을 더한다

문서는 하나다. 홀로 선 Toggle과 묶인 Toggle은 생김새도 크기 축도
상태도 같고 다른 것은 값이 하나인지 여럿인지뿐이라, 축 하나로
표현되는 차이다. Combobox가 single과 multiple을 축으로 둔 것과 같다.
레지스트리 항목도 하나이고 파일 둘을 함께 싣는다.

toggleVariants는 toggle.tsx가 정의해 내보내고 toggle-group.tsx가 그대로
쓴다. 묶음이 variant와 size를 컨텍스트로 내려 주므로 한 묶음 안에서
크기가 갈리지 않는다.

Switch와 겹치지 않는다. Switch는 설정을 켜고 그 자리에서 저장되고,
Toggle은 지금 보고 있는 것에 서식이나 필터를 건다."
```

---

## Task 5: Collapsible

접히는 자리 하나를 더한다. `Accordion`과 겹치지 않는 이유는 설계 문서 4절에 있다.

**Files:**
- Modify: `package.json` · `package-lock.json`
- Create: `src/components/ui/collapsible.tsx`, `src/routes/components/CollapsiblePage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `@radix-ui/react-collapsible`, `cn`
- Produces: `Collapsible` · `CollapsibleTrigger` · `CollapsibleContent`

- [ ] **Step 1: 패키지를 들인다**

```bash
npm install @radix-ui/react-collapsible@1.1.20
```

2026-08-27 기준 npm의 최신 판이 `1.1.20`이다.

- [ ] **Step 2: 컴포넌트를 만든다**

```tsx
import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Collapsible = CollapsiblePrimitive.Root

/*
 * Accordion과 달리 트리거를 h3으로 감싸지 않는다. 접히는 자리가 하나면
 * 그것은 절이 아니라 컨트롤이고, 있지도 않은 제목을 하나 만들면
 * assignHeadingIds가 그것을 문서의 절로 보고 목차에 올린다. Accordion이
 * 그 문제를 data-slot으로 걸러 내야 했던 것과 같은 뿌리다.
 */
function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        'group flex w-full items-center justify-between gap-2 rounded-md py-2 text-sm font-medium outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        data-slot="collapsible-indicator"
        aria-hidden
        className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
      />
    </CollapsiblePrimitive.Trigger>
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('text-muted-foreground pt-0 pb-2', className)}>{children}</div>
    </CollapsiblePrimitive.Content>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

- [ ] **Step 3: 여닫는 움직임이 있는지 확인한다**

`accordion.tsx`는 `data-[state=closed]:animate-accordion-up`과 `data-[state=open]:animate-accordion-down`을 쓴다. 그 유틸리티는 `tw-animate-css`가 준다. `collapsible`용도 있는지 **빌드 결과물로 확인한다.**

```bash
npm run build
grep -o 'collapsible-down\|collapsible-up\|accordion-down' dist/assets/*.css | sort -u
```

`collapsible-down`·`collapsible-up`이 나오면 `CollapsibleContent`의 className에 `data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down`을 더한다. 나오지 않으면 **움직임 없이 그대로 두고**, 억지로 keyframe을 만들지 않는다. 어느 쪽이든 결과를 보고서에 적는다.

`--radix-collapsible-content-height`를 쓰는 문장을 문서에 적을 거라면, 실제로 그 변수를 쓰는 클래스가 있을 때만 적는다. 움직임을 두지 않았다면 그 문장도 적지 않는다.

- [ ] **Step 4: 메타를 더한다**

`src/data/registry.ts`의 `card`와 `description-list` 사이에 넣는다.

```ts
  {
    id: 'collapsible',
    name: 'Collapsible',
    aliases: ['접기', '펼치기', '더 보기', 'collapse', 'expander', '접이식'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 4절에서 옮긴다
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '접혀 있는지와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'collapsed', note: '기본. 접힌 상태' },
          { value: 'expanded', note: '펼쳐진 상태. defaultOpen으로 보인다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '열고 닫을 수 없음' },
        ],
      },
    ],
    verified: false,
  },
```

`variant`를 두지 않는 이유는 설계 문서 4절이 말한다 — 접히는 자리 하나에는 서로 구별할 항목이 없어 경계 축이 성립하지 않는다.

`anatomy`는 Trigger · Indicator · Content 셋이다. 포털을 쓰지 않으므로 셋 다 무대 안에 있다.

- [ ] **Step 5: 문서 페이지를 만든다**

`src/routes/components/CollapsiblePage.tsx`. `AccordionPage.tsx`가 가장 가까운 본보기다 — **먼저 읽는다.**

- `render`가 `options.state`를 받아 `defaultOpen`·`disabled`를 정한다
- 예시는 목업을 그리지 않고 실제 컴포넌트로 조립한다. Usage 넷은 설계 문서 4절 그대로다 — 고급 검색 조건에는 `Field`와 `Input`을, 카드 안의 부가 정보에는 `Card`를, 표 행의 하위 내용에는 `Table`을 쓴다
- **가짜 화면 제목은 `<h4>`다**

- [ ] **Step 6: 라우트와 LNB를 잇는다**

```tsx
import { CollapsiblePage } from '@/routes/components/CollapsiblePage'
```

```tsx
          { path: 'collapsible', element: <CollapsiblePage /> },
```

`src/components/layout/nav-config.ts` — Data Display 묶음의 `card`와 `description-list` 사이.

```ts
          { to: '/components/collapsible', label: 'Collapsible', updatedAt: '2026-08-27' },
```

- [ ] **Step 7: 레지스트리 항목을 더한다**

`registry.json`의 `checkbox`와 `combobox` 사이에 넣는다.

```json
    {
      "name": "collapsible",
      "type": "registry:ui",
      "title": "Collapsible",
      "dependencies": [
        "@radix-ui/react-collapsible",
        "lucide-react"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/collapsible.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `checkbox.json` 뒤에 한 줄 더한다.

```json
        "https://adminds.vercel.app/r/collapsible.json",
```

- [ ] **Step 8: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
```

Expected: 둘 다 통과.

- [ ] **Step 9: 브라우저로 확인한다**

`/components/collapsible`에서 열고 닫아 본다. 그리고 **고정 목차(Contents)에 접히는 항목의 이름이 섞여 들지 않았는지 확인한다** — 이것이 `Accordion` 대신 이 컴포넌트를 만든 이유이므로, 여기서 섞이면 만든 뜻이 없다.

- [ ] **Step 10: 커밋**

```bash
git add package.json package-lock.json src/components/ui/collapsible.tsx src/routes/components/CollapsiblePage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r
git commit -m "feat: 접히는 자리 하나를 위한 Collapsible을 더한다

Accordion과 겹치지 않는다. Accordion은 트리거를 AccordionHeader가
h3으로 감싸고, 그래서 heading-id가 그 제목을 목차에서 일부러 걸러
낸다. 접히는 자리가 하나뿐인데 Accordion을 쓰면 있지도 않은 제목이
하나 생긴다는 뜻이다. Collapsible에는 그 머리글 요소가 없어 카드
안이든 표 행 안이든 제목 층위를 만들지 않고 놓을 수 있다.

variant는 두지 않았다. 접히는 자리 하나에는 서로 구별할 항목이 없어
Accordion의 경계 축이 성립하지 않는다."
```

---

## Task 6: Scroll Area

크기가 정해진 상자 안의 스크롤과 그 스크롤바를 더한다.

**Files:**
- Modify: `package.json` · `package-lock.json`
- Create: `src/components/ui/scroll-area.tsx`, `src/routes/components/ScrollAreaPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `@radix-ui/react-scroll-area`, `cn`
- Produces: `ScrollArea` · `ScrollBar`

- [ ] **Step 1: 패키지를 들인다**

```bash
npm install @radix-ui/react-scroll-area@1.2.18
```

2026-08-27 기준 npm의 최신 판이 `1.2.18`이다. 이번 회차에 들이는 다섯 중 이것만 판이 `1.2.x`다.

- [ ] **Step 2: 컴포넌트를 만든다**

```tsx
import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'

/*
 * 굴리는 일은 브라우저가 그대로 한다. Radix가 대신하는 것은 스크롤바를
 * 그리는 일뿐이다 — 기본 스크롤바는 운영체제마다 다르게 생겼고 다크
 * 모드에서 색이 따라오지 않는다.
 *
 * 이 컴포넌트는 자기 크기를 정하지 않는다. 부모가 높이나 너비를 주지
 * 않으면 아무것도 굴러가지 않고 내용이 그대로 늘어난다. 잘못 쓰는 가장
 * 흔한 방식이라 지침의 첫 줄에도 같은 말이 있다.
 */
function ScrollArea({
  className,
  children,
  type = 'hover',
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'vertical' | 'horizontal' | 'both'
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:ring-ring/50 focus-visible:ring-2"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'w-full flex-col h-2.5 border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
```

`rounded-[inherit]`은 값이 아니라 `inherit` 키워드다. 그래도 대괄호 표기이므로 **Step 8의 `grep`에 걸리는지 확인하고**, 걸리면 `rounded-md`처럼 토큰으로 바꾸거나 그 클래스를 뺀다. 제약을 어기는 쪽을 남기지 않는다.

- [ ] **Step 3: 메타를 더한다**

`src/data/registry.ts`의 `description-list`와 `separator` 사이에 넣는다.

```ts
  {
    id: 'scroll-area',
    name: 'Scroll Area',
    aliases: ['스크롤 영역', '스크롤바', 'scrollbar', '스크롤', '넘치는 내용'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 5절에서 옮긴다
    properties: [
      {
        name: 'orientation',
        title: 'Orientation',
        description: '어느 쪽으로 넘치는 내용을 굴릴지 정한다.',
        display: 'row',
        options: [
          { value: 'vertical', note: '기본. 세로로 넘치는 목록' },
          { value: 'horizontal', note: '가로로 넓은 표' },
          { value: 'both', note: '넓고 긴 표. 스크롤바 둘이 모서리에서 만난다' },
        ],
      },
      {
        name: 'visibility',
        title: 'Visibility',
        description: '스크롤바를 언제 보일지 정한다. Radix의 type prop 중 이 시스템이 쓰는 두 값이다.',
        display: 'row',
        options: [
          { value: 'hover', note: '기본. 마우스가 올라왔을 때만 보인다' },
          { value: 'always', note: '늘 보인다. 굴러간다는 사실 자체가 중요한 자리' },
        ],
      },
    ],
    verified: false,
  },
```

`anatomy`는 Viewport · Content · Scrollbar · Thumb 넷이다.

- [ ] **Step 4: 문서 페이지를 만든다**

`src/routes/components/ScrollAreaPage.tsx`.

- `render`가 `options.orientation`과 `options.visibility`를 받는다. `visibility`는 `ScrollArea`의 `type`으로 넘긴다(`hover` 그대로, `always` 그대로)
- 격자의 각 칸은 **높이를 정한 상자**다. `h-40 w-full max-w-sm` 같은 모양으로 두어 좁은 화면에서 줄어들게 한다
- 안에 넣는 내용은 손으로 적은 목록이 아니라 데이터에서 파생한다. 이 저장소에 이미 있는 것을 쓴다 — 예를 들어 `components`(`@/data/registry`)를 `map`으로 늘어놓으면 목록이 저절로 길고, 손으로 적은 값이 하나도 없다
- `both`는 넓은 표를 담아 두 방향이 동시에 넘치게 한다

- [ ] **Step 5: 라우트와 LNB를 잇는다**

```tsx
import { ScrollAreaPage } from '@/routes/components/ScrollAreaPage'
```

```tsx
          { path: 'scroll-area', element: <ScrollAreaPage /> },
```

`src/components/layout/nav-config.ts` — Data Display 묶음의 `description-list`와 `separator` 사이.

```ts
          { to: '/components/scroll-area', label: 'Scroll Area', updatedAt: '2026-08-27' },
```

- [ ] **Step 6: 레지스트리 항목을 더한다**

`registry.json`의 `radio`와 `select` 사이에 넣는다.

```json
    {
      "name": "scroll-area",
      "type": "registry:ui",
      "title": "Scroll Area",
      "dependencies": [
        "@radix-ui/react-scroll-area"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/scroll-area.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `radio.json` 뒤에 한 줄 더한다.

```json
        "https://adminds.vercel.app/r/scroll-area.json",
```

- [ ] **Step 7: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

Expected: 앞의 둘은 통과, `grep`은 아무것도 찾지 못한다.

- [ ] **Step 8: 브라우저로 확인한다**

`/components/scroll-area`에서 실제로 굴려 본다. `always`에서 스크롤바가 늘 보이는지, `both`에서 두 스크롤바가 모서리에서 겹치지 않는지, 내용이 짧을 때 스크롤바가 아예 나오지 않는지 본다. Thumb 색(`bg-border`)이 라이트·다크 양쪽에서 배경과 갈라지는지도 눈으로 확인한다.

- [ ] **Step 9: 커밋**

```bash
git add package.json package-lock.json src/components/ui/scroll-area.tsx src/routes/components/ScrollAreaPage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r
git commit -m "feat: 크기가 정해진 상자를 위한 Scroll Area를 더한다

굴리는 일은 브라우저가 그대로 하고, Radix가 대신하는 것은 스크롤바를
그리는 일뿐이다. 기본 스크롤바는 운영체제마다 다르게 생겼고 다크
모드에서 색이 따라오지 않는다.

축은 orientation과 visibility 둘이다. Radix의 type prop은 네 값을 갖는데
scroll과 auto는 어드민에서 고를 일이 없고 축에 늘어놓으면 네 칸 중
둘이 같아 보여, 이 시스템이 쓰는 두 값만 축으로 뒀다. prop 자체는
그대로 있다."
```

---

## Task 7: Command

패키지를 들이지 않고 이 저장소의 조각으로 세운다. 이유는 설계 문서의 「판단 1」에 있다. 거르고 묶는 일을 순수 함수로 먼저 만들고 테스트로 못 박은 뒤에 표면을 얹는다.

**Files:**
- Create: `src/lib/command-filter.ts`, `src/lib/command-filter.test.ts`, `src/components/ui/command.tsx`, `src/routes/components/CommandPage.tsx`
- Modify: `src/data/registry.ts`, `src/components/layout/nav-config.ts`, `src/routes/routes.tsx`, `registry.json`

**Interfaces:**
- Consumes: `Dialog` · `DialogContent` · `DialogTitle`(`@/components/ui/dialog`), `inputVariants`(`@/components/ui/input`), `cn`
- Produces:
  - `type CommandEntry = { value: string; label: string; group?: string; keywords?: string[]; disabled?: boolean }`
  - `type CommandSection = { label: string; entries: CommandEntry[] }`
  - `function filterCommandEntries(entries: CommandEntry[], query: string): CommandEntry[]`
  - `function groupCommandEntries(entries: CommandEntry[]): CommandSection[]`
  - `Command` · `CommandDialog`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/lib/command-filter.test.ts`. 이 회차에서 테스트가 실제로 지킬 수 있는 코드가 여기다 — 부수 효과가 없고 반환값으로만 판정된다.

```ts
import { describe, expect, it } from 'vitest'
import {
  filterCommandEntries,
  groupCommandEntries,
  type CommandEntry,
} from '@/lib/command-filter'

const ENTRIES: CommandEntry[] = [
  { value: 'dialog', label: 'Dialog', group: 'Components', keywords: ['모달', 'modal'] },
  { value: 'table', label: 'Table', group: 'Components', keywords: ['표'] },
  { value: 'color', label: 'Color', group: 'Foundations' },
  { value: 'logout', label: '로그아웃' },
]

describe('filterCommandEntries', () => {
  it('질의가 비면 전부 돌려준다', () => {
    expect(filterCommandEntries(ENTRIES, '')).toEqual(ENTRIES)
  })

  it('공백만 있는 질의도 비어 있는 것으로 본다', () => {
    expect(filterCommandEntries(ENTRIES, '   ')).toEqual(ENTRIES)
  })

  it('이름을 포함으로 맞춘다', () => {
    expect(filterCommandEntries(ENTRIES, 'abl').map((e) => e.value)).toEqual(['table'])
  })

  it('대소문자를 가리지 않는다', () => {
    expect(filterCommandEntries(ENTRIES, 'DIALOG').map((e) => e.value)).toEqual(['dialog'])
  })

  /* 이름만 훑으면 '모달'로 Dialog에 닿지 않는다. filterOptions와 갈리는 지점이다 */
  it('별칭으로도 맞춘다', () => {
    expect(filterCommandEntries(ENTRIES, '모달').map((e) => e.value)).toEqual(['dialog'])
  })

  /*
   * 훑는 곳은 label과 keywords뿐이다 — value는 보지 않는다. 'logout'은
   * value에만 o가 있고 라벨은 '로그아웃'이라 여기서 걸러진다.
   */
  it('원본 순서를 지킨다', () => {
    expect(filterCommandEntries(ENTRIES, 'o').map((e) => e.value)).toEqual(['dialog', 'color'])
  })

  it('맞는 것이 없으면 빈 배열이다', () => {
    expect(filterCommandEntries(ENTRIES, 'zzz')).toEqual([])
  })
})

describe('groupCommandEntries', () => {
  it('처음 나온 순서로 묶는다', () => {
    expect(groupCommandEntries(ENTRIES).map((s) => s.label)).toEqual([
      'Components',
      'Foundations',
      '',
    ])
  })

  it('같은 묶음의 항목을 한자리에 모은다', () => {
    const sections = groupCommandEntries(ENTRIES)
    expect(sections[0].entries.map((e) => e.value)).toEqual(['dialog', 'table'])
  })

  it('묶음이 없는 항목은 이름표가 빈 묶음에 담긴다', () => {
    const sections = groupCommandEntries(ENTRIES)
    const unlabeled = sections.find((s) => s.label === '')!
    expect(unlabeled.entries.map((e) => e.value)).toEqual(['logout'])
  })

  it('빈 목록은 빈 묶음 목록이다', () => {
    expect(groupCommandEntries([])).toEqual([])
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/lib/command-filter.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/command-filter"`

- [ ] **Step 3: 순수 함수를 만든다**

`src/lib/command-filter.ts`.

```ts
export type CommandEntry = {
  value: string
  label: string
  /** 이 항목이 속한 묶음의 이름. 없으면 이름표 없는 묶음에 담긴다 */
  group?: string
  /** 사람이 실제로 치는 다른 이름들. 이름과 함께 훑는다 */
  keywords?: string[]
  disabled?: boolean
}

export type CommandSection = { label: string; entries: CommandEntry[] }

/**
 * 거르는 규칙은 filterOptions와 같다 — 공백을 걷고, 대소문자를 가리지
 * 않고, 앞글자가 아니라 포함으로 맞추고, 원본 순서를 지킨다. 항목 순서에
 * 뜻이 담기는 경우가 많아 점수순으로 흩뜨리지 않는다.
 *
 * 다른 것은 훑는 자리 하나다. filterOptions는 label만 보는데 여기서는
 * keywords까지 함께 본다 — '모달'로 Dialog에 닿으려면 항목이 그 말을
 * 들고 있어야 한다. 그 필요 때문에 filterOptions를 넓히지는 않았다.
 * 넓히면 Combobox가 쓰는 ComboboxOption이 함께 넓어진다.
 */
export function filterCommandEntries(entries: CommandEntry[], query: string): CommandEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return entries
  return entries.filter((entry) =>
    [entry.label, ...(entry.keywords ?? [])].some((text) => text.toLowerCase().includes(needle)),
  )
}

/**
 * 묶음은 처음 나온 순서로 놓는다. 목록의 순서에 이미 뜻이 있으므로
 * 이름순으로 다시 세우지 않는다. 묶음이 없는 항목은 이름표가 빈
 * 묶음에 담기고, 그 묶음은 첫 무묶음 항목이 있던 자리에 놓인다 —
 * 이름표가 비면 화면에 머리글을 그리지 않는다.
 */
export function groupCommandEntries(entries: CommandEntry[]): CommandSection[] {
  const sections: CommandSection[] = []
  const byLabel = new Map<string, CommandSection>()

  for (const entry of entries) {
    const label = entry.group ?? ''
    let section = byLabel.get(label)
    if (!section) {
      section = { label, entries: [] }
      byLabel.set(label, section)
      sections.push(section)
    }
    section.entries.push(entry)
  }

  return sections
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/lib/command-filter.test.ts`
Expected: PASS — 열한 개 전부.

- [ ] **Step 5: 표면을 만든다**

`src/components/ui/command.tsx`. `combobox.tsx`와 `SearchDialog.tsx`를 **둘 다 먼저 읽는다** — 키보드를 다루는 방법과 `aria-activedescendant`를 잇는 방법이 거기 있고, 여기서 같은 방법을 쓴다.

지켜야 할 것 넷.

1. **묶음 머리글은 제목 요소가 아니다.** `role="group"` + `aria-labelledby`로 잇고 머리글 자체는 `div`로 그린다. `h3`을 쓰면 `assignHeadingIds`가 그것을 문서의 절로 보고 고정 목차에 올린다 — `Command`는 포털을 쓰지 않고 `main` 안에 그대로 놓이기 때문이다. `SearchDialog`가 `h3`을 쓰고도 멀쩡한 것은 Radix가 그 표면을 `document.body`로 포털하기 때문이고, 그 사정이 여기에는 없다
2. **짚은 자리는 상태 하나(`activeIndex`)로 관리한다.** 마우스 hover도 같은 상태를 옮긴다. 둘이 따로 놀면 화면의 강조와 스크린 리더가 읽는 항목이 어긋난다
3. **위아래 이동은 묶음 경계를 넘어 이어진다.** 걸러진 항목을 평탄한 배열로 한 번 펴 두고 그 인덱스로 짚는다. 묶음마다 번호를 다시 세지 않는다
4. **`disabled` 항목은 짚히지 않는다.** 걸러진 목록에서 짚을 수 있는 것만 세어 이동한다

```tsx
import * as React from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { inputVariants } from '@/components/ui/input'
import {
  filterCommandEntries,
  groupCommandEntries,
  type CommandEntry,
} from '@/lib/command-filter'
import { cn } from '@/lib/utils'

export type { CommandEntry }

export type CommandProps = {
  entries: CommandEntry[]
  /** 검색 칸의 자리표시자 */
  placeholder?: string
  /** 걸러진 결과가 없을 때 목록 자리에 보이는 문구 */
  emptyMessage?: string
  /** 문서의 격자가 걸러진 모습을 그대로 보이려고 쓴다. 열릴 때의 첫 질의다 */
  defaultQuery?: string
  onSelect?: (entry: CommandEntry) => void
  className?: string
}
```

`Command`의 본문은 위 넷을 지키며 `combobox.tsx`의 `handleSearchKeyDown`과 같은 모양으로 쓴다 — `ArrowDown`·`ArrowUp`·`Enter`가 각각 짚기와 고르기를 맡고, `Escape`는 `CommandDialog`가 `Dialog`에 맡긴다.

`CommandDialog`는 이렇게 감싼다.

```tsx
function CommandDialog({
  open,
  onOpenChange,
  ...props
}: CommandProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" showClose={false} className="mt-16 max-w-xl gap-0 self-start p-0">
        <DialogTitle className="sr-only">명령 검색</DialogTitle>
        <Command {...props} />
      </DialogContent>
    </Dialog>
  )
}
```

`DialogTitle`을 감춘 채로라도 두는 이유는 `Dialog`가 이름이 없으면 '이름 없는 대화상자'로 읽히기 때문이다 — `Combobox`의 `PopoverContent`에서 같은 결론에 이르렀고 `SearchDialog`가 이미 같은 방법을 쓴다.

- [ ] **Step 6: 메타를 더한다**

`src/data/registry.ts`의 `breadcrumb`와 `pagination` 사이에 넣는다.

```ts
  {
    id: 'command',
    name: 'Command',
    aliases: ['커맨드', '명령 팔레트', 'command palette', '빠른 이동', '검색', 'cmdk'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    // purpose · anatomy · guidelines · usage · cases는 설계 문서 6절에서 옮긴다
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '질의에 따라 목록이 어떻게 달라지는지 보인다. 포털을 쓰지 않아 세 모습이 격자 안에 그대로 담긴다.',
        display: 'grid',
        options: [
          { value: 'default', note: '기본. 질의가 비어 전체가 보인다' },
          { value: 'filtered', note: '질의로 좁혀진 목록' },
          { value: 'empty', note: '맞는 것이 없다' },
        ],
      },
    ],
    verified: false,
  },
```

`anatomy`는 Search · List · Group label(선택) · Item · Empty message 다섯이다. 포털을 쓰지 않으므로 다섯 다 무대 안에 있다.

**`aliases`에 `cmdk`를 넣는 것은 정직한가.** 이 컴포넌트는 `cmdk`를 쓰지 않는다. 그래도 넣는다 — 별칭은 "이 항목이 무엇으로 만들어졌는가"가 아니라 "사람이 이것을 찾을 때 무엇을 치는가"이고, `cmdk`를 치는 사람이 찾는 것이 바로 이 문서다. 같은 이유로 이 사실이 문서 본문에도 적혀야 한다 — `purpose`나 지침에서 **`cmdk`를 쓰지 않는다는 것을 밝힌다.**

- [ ] **Step 7: 문서 페이지를 만든다**

`src/routes/components/CommandPage.tsx`. `ComboboxPage.tsx`가 가장 가까운 본보기다.

- `render`가 `options.state`를 받아 `defaultQuery`를 정한다 — `default`는 빈 문자열, `filtered`는 몇 개만 남는 질의, `empty`는 아무것도 남지 않는 질의
- **항목 목록은 데이터에서 파생한다.** 손으로 적지 않는다. `components`(`@/data/registry`)를 `map`으로 `CommandEntry`로 바꾸면 항목마다 `label`은 `name`, `group`은 `categoryLabel[category]`, `keywords`는 `aliases`가 그대로 들어간다 — 별칭 지침을 말로 설명하는 대신 그 자리에서 실제로 보이게 된다
- `CommandDialog` 예시는 트리거 버튼 뒤에 둔다. **열린 채로 마운트하지 않는다**
- 예시 안의 가짜 화면 제목은 `<h4>`다

- [ ] **Step 8: 라우트와 LNB를 잇는다**

```tsx
import { CommandPage } from '@/routes/components/CommandPage'
```

```tsx
          { path: 'command', element: <CommandPage /> },
```

`src/components/layout/nav-config.ts` — Navigation 묶음의 `breadcrumb`와 `pagination` 사이.

```ts
          { to: '/components/command', label: 'Command', updatedAt: '2026-08-27' },
```

- [ ] **Step 9: 레지스트리 항목 둘을 더한다**

순수 함수도 항목이 된다 — `filter-options`가 같은 모양으로 이미 있다. `filter-options` 항목 뒤(`accordion` 앞)에 넣는다.

```json
    {
      "name": "command-filter",
      "type": "registry:lib",
      "title": "Command Filter",
      "description": "이름과 별칭으로 항목을 거르고 처음 나온 순서로 묶는 순수 함수. Command가 쓴다.",
      "files": [
        {
          "path": "src/lib/command-filter.ts",
          "type": "registry:lib"
        }
      ]
    },
```

그리고 `registry:ui` 항목을 `combobox`와 `date-picker` 사이에 넣는다.

```json
    {
      "name": "command",
      "type": "registry:ui",
      "title": "Command",
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [
        "https://adminds.vercel.app/r/command-filter.json",
        "https://adminds.vercel.app/r/dialog.json",
        "https://adminds.vercel.app/r/input.json",
        "https://adminds.vercel.app/r/tokens.json",
        "https://adminds.vercel.app/r/utils.json"
      ],
      "files": [
        {
          "path": "src/components/ui/command.tsx",
          "type": "registry:ui"
        }
      ]
    },
```

`adminds` 묶음의 `combobox.json` 뒤에 한 줄 더한다. **`command-filter`는 묶음에 넣지 않는다** — `filter-options`도 넣지 않았다. 순수 함수는 그것을 쓰는 컴포넌트의 `registryDependencies`로 따라간다.

```json
        "https://adminds.vercel.app/r/command.json",
```

- [ ] **Step 10: 굽고 검사한다**

```bash
npm run registry
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#|\[[0-9.]+rem\]' src/
```

Expected: 앞의 둘은 통과, `grep`은 아무것도 찾지 못한다.

- [ ] **Step 11: 브라우저로 확인한다**

`/components/command`를 열고 검색 칸에 실제로 쳐 본다.

- 묶음 머리글이 있는데 **고정 목차(Contents)에는 그 이름이 없는지** 확인한다. 있으면 머리글을 제목 요소로 그린 것이다
- 마우스를 항목 위로 옮겨 강조가 따라오는지 본다
- 결과가 없을 때 문구가 나오는지 본다
- 격자의 `filtered`·`empty` 칸이 실제로 걸러진 모습인지 본다

**위아래 이동과 Enter는 이 하네스로 확인할 수 없다.** 소스로 읽어 추론하고 문서에도 그렇게만 적는다.

- [ ] **Step 12: 커밋**

```bash
git add src/lib/command-filter.ts src/lib/command-filter.test.ts src/components/ui/command.tsx src/routes/components/CommandPage.tsx src/data/registry.ts src/components/layout/nav-config.ts src/routes/routes.tsx registry.json public/r
git commit -m "feat: cmdk 없이 Command를 더한다

shadcn의 Command는 cmdk를 감싼다. 이 시스템은 같은 일을 이미 두 번
라이브러리 없이 했다. Combobox가 Popover 위에 검색 칸과 걸러진 목록을
손으로 세웠고, SearchDialog가 그 형태로 이미 돌아간다. 여기서 패키지를
들이면 cmdk의 필터 규칙이 filterOptions의 규칙과 갈려, 한 저장소 안에서
두 검색이 다르게 걸러진다.

거르고 묶는 일은 command-filter.ts의 순수 함수 둘로 뺐고 테스트가
지킨다. filterOptions를 넓히지 않은 것은 Command가 별칭까지 훑어야
해서인데, 넓히면 Combobox가 쓰는 ComboboxOption이 함께 넓어진다.

묶음 머리글은 제목 요소로 그리지 않는다. Command는 포털을 쓰지 않고
main 안에 놓이므로 h3을 쓰면 assignHeadingIds가 그것을 문서의 절로
보고 고정 목차에 올린다."
```

---

## Task 8: 릴리스 기록과 낡은 숫자 정리

`Updates` 화면이 `releases.ts`에서 파생하고 GNB의 버전 번호도 `currentRelease.version`에서 나온다. 기록을 남기지 않으면 v0.12.0을 배포하고도 화면은 v0.11.0이라고 말한다.

**Files:**
- Modify: `package.json` · `package-lock.json`
- Modify: `src/data/releases.ts`
- Modify: `registry.json`
- Modify: `README.md`
- Modify: `.claude/launch.json`

**Interfaces:**
- Consumes: `Release` 타입(`@/data/releases`), `componentStats`(`@/data/registry`)
- Produces: `releases[0].version === 'v0.12.0'`

- [ ] **Step 1: 버전을 올린다**

`package.json`의 `"version": "0.11.0"`을 `"0.12.0"`으로 바꾼다. `package-lock.json`의 최상위 `"version"`과 `"packages": { "": { "version": ... } }` 두 곳도 같은 값으로 맞춘다.

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

`src/data/releases.test.ts`에는 v0.11.0에서 붙인 「최신 기록의 버전이 package.json의 버전과 같다」가 이미 있다. 새로 쓸 것이 없다.

Run: `npm test -- src/data/releases.test.ts`
Expected: FAIL — `expected 'v0.11.0' to be 'v0.12.0'`

- [ ] **Step 3: 실제 개수를 센다**

기록에 적을 숫자를 손으로 짐작하지 않는다.

```bash
node -e "const s=require('fs').readFileSync('src/data/registry.ts','utf8');console.log('components:',(s.match(/^    id: '/gm)||[]).length)"
node -e "const r=require('./registry.json');console.log('ui:',r.items.filter(i=>i.type==='registry:ui').length,'bundle:',r.items.find(i=>i.name==='adminds').registryDependencies.length)"
```

셋이 맞물리는지 본다 — 컴포넌트 수와 `registry:ui` 수가 같고, 묶음은 거기에 `theme.json` 하나가 더 붙어 있다. 어긋나면 앞 Task에서 빠뜨린 자리가 있다는 뜻이므로 **여기서 숫자를 고치지 말고 빠진 항목을 찾는다.**

- [ ] **Step 4: 릴리스 기록을 쓴다**

`src/data/releases.ts`의 `releases` 배열 맨 앞에 넣는다. **`changes`의 각 줄은 실제로 한 일만 적는다.** 지어낸 항목이 하나라도 있으면 이 회차의 마지막 결함이 된다. Step 3에서 센 숫자를 쓴다.

```ts
  {
    version: 'v0.12.0',
    publishedAt: '2026-08-27',
    title: '덮는 것, 묻는 것, 접는 것 여섯을 더했어요',
    purpose:
      '어드민에서 늘 나오는데 이 시스템에 없던 여섯을 더했어요. 가장자리에서 열리는 Sheet, 실수로 닫히지 않는 Alert Dialog, 눌려 있는 버튼 Toggle과 그 묶음, 접히는 자리 하나를 위한 Collapsible, 크기가 정해진 상자의 Scroll Area, 그리고 쳐서 찾아 곧장 가는 Command예요. 새 패키지는 넷만 들였어요 — Sheet는 이미 있는 Dialog 패키지를 다시 쓰고, Command는 이 저장소가 이미 하던 방식(순수 함수 + Dialog)으로 세웠어요.',
    changes: [
      { target: 'Sheet', type: 'New', note: '가장자리에 붙은 Dialog예요. 새 패키지 없이 이미 있는 @radix-ui/react-dialog를 다시 썼어요. 네 방향과 세 크기를 갖는데 축으로는 두지 않았어요 — 닫힌 트리거에서는 일곱 값이 전부 똑같아 보여서, Dialog가 size를 뺀 것과 같은 이유예요.' },
      { target: 'Alert Dialog', type: 'New', note: 'Dialog의 variant로 두지 않고 자기 컴포넌트로 뒀어요. 차이가 보이는 게 아니라 동작하는 거라서요 — 바깥을 눌러도 닫히지 않고, alertdialog로 읽히고, 나가는 길이 취소 하나예요. 닫기 X를 두지 않았어요.' },
      { target: 'Destructive confirm', type: 'Updated', note: '삭제 확인 패턴을 Alert Dialog로 옮겼어요. Alert Dialog가 실린 순간 이 패턴이 "Dialog로 묻는다"고 말하는 게 거짓이 됐거든요. 실행 실패 케이스만 예외로 뒀는데, 그 자리 문구가 "대화상자는 닫지 않는다"인데 AlertDialogAction은 눌리면 바로 닫혀서예요.' },
      { target: 'Toggle', type: 'New', note: '눌려 있는 버튼 하나와 그 묶음이에요. 문서는 하나로 뒀어요 — 둘의 차이가 값이 하나인지 여럿인지뿐이라 축 하나로 표현돼요. Switch와 겹치지 않아요. Switch는 설정을 켜고 그 자리에서 저장되고, Toggle은 지금 보고 있는 것에 서식이나 필터를 걸어요.' },
      { target: 'Collapsible', type: 'New', note: '접히는 자리가 하나일 때 쓰는 거예요. Accordion은 트리거를 h3으로 감싸서, 접히는 자리가 하나뿐인데 Accordion을 쓰면 있지도 않은 제목이 하나 생겨요. Collapsible에는 그 머리글이 없어서 카드 안이든 표 행 안이든 그냥 놓을 수 있어요.' },
      { target: 'Scroll Area', type: 'New', note: '크기가 정해진 상자 안에서만 굴러가요. 굴리는 일은 브라우저가 그대로 하고 Radix는 스크롤바만 다시 그려요 — 기본 스크롤바가 운영체제마다 다르게 생기고 다크 모드에서 색이 안 따라와서요.' },
      { target: 'Command', type: 'New', note: 'shadcn은 이걸 cmdk로 만드는데 여기서는 패키지를 들이지 않았어요. 이 저장소는 Combobox와 검색 대화상자에서 같은 걸 이미 두 번 손으로 만들었고, 패키지를 들이면 cmdk의 필터 규칙이 filterOptions의 규칙과 갈려요. 거르고 묶는 일은 순수 함수로 빼서 테스트가 지켜요.' },
      { target: 'Registry', type: 'Updated', note: 'registry.json에 컴포넌트 여섯과 순수 함수 하나(command-filter)를 더했어요. adminds 묶음도 새 개수를 전부 가리키게 갱신했어요.' },
      { target: 'README', type: 'Fixed', note: '레지스트리 묶음을 받는 명령 옆에 적힌 개수가 또 낡아 있었어요. 실제 개수로 고쳤어요.' },
    ],
    requests: [],
    reviewItems: [
      { label: 'SearchDialog를 Command 위로 옮길 수 있는가 — 결과 한 줄의 생김새(강조·경로·New 배지)를 제품 컴포넌트가 알게 하지 않으면서', category: 'Components', completed: false },
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '패턴 문서의 Example이 커서 한 파일이 길어진다 — 조각을 나눌 자리가 어디인가', category: 'Patterns', completed: false },
    ],
    impact: [],
  },
```

`requests`와 `impact`는 이 계획이 알 수 없는 값이다. **비워 두거나, 사용자에게 실제로 들어온 요청이 있으면 그것만 적는다. 지어내지 않는다.** `reviewItems`의 뒤 셋은 v0.11.0에서 이월된 것으로 실제로 아직 열려 있다(`releases.ts`에서 확인한다 — 열려 있지 않으면 옮기지 않는다).

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/data/releases.test.ts`
Expected: PASS

- [ ] **Step 6: 손으로 적힌 낡은 숫자 둘을 고친다**

Step 3에서 센 값으로 고친다.

`registry.json`의 `adminds` 항목.

```json
      "description": "토큰과 컴포넌트 서른두 개를 한 번에 가져온다.",
```

`README.md`의 받아 가는 명령 옆 주석.

```
npx shadcn@latest add https://adminds.vercel.app/r/adminds.json # 토큰과 32개 전부
```

README의 「새 컴포넌트를 추가하는 법」 절도 훑는다. 5번 항목이 어긋나는 테스트 이름을 `registry-order.test.ts`라고 적고 있는데, 실제로 그 규칙을 지키는 것은 `src/components/layout/nav-config.test.ts`다. **파일 목록에서 실재를 확인한 뒤에 고친다.**

- [ ] **Step 7: 다시 굽는다**

`registry.json`의 `description`을 고쳤으므로 `adminds.json` payload가 낡았다.

```bash
npm run registry
```

- [ ] **Step 8: 사라질 작업장을 가리키는 미리보기 항목을 뺀다**

`.claude/launch.json`에서 Task 1이 넣은 `adminds-v0.12.0` 항목을 지운다. 이 항목은 절대 경로로 이 작업장을 `--prefix` 하고 있어서, 병합하면 그 작업장이 없어진다. v0.10.0에서 같은 항목을 남겨 둔 탓에 한 에이전트가 낡은 체크아웃을 보고 측정했다(커밋 `452f5a8`). `adminds`(5199) 하나만 남긴다.

**이 단계 뒤로는 `preview_start`로 이 작업장을 띄울 수 없다.** 화면 확인이 더 필요하면 이 Step을 마지막으로 미룬다.

- [ ] **Step 9: 전체 검사**

```bash
npm run build && npm test
git status --short
```

Expected: `build`와 `test` 모두 통과. `git status`에 `public/r/` 아래 갱신된 payload가 보인다. 출력을 눈으로 읽고, 실패가 없다는 것을 확인한 뒤에만 커밋한다.

- [ ] **Step 10: 커밋**

```bash
git add package.json package-lock.json src/data/releases.ts registry.json README.md .claude/launch.json public/r
git commit -m "chore: v0.12.0 기록을 남기고 낡은 숫자를 고친다

Updates 화면과 GNB의 버전 번호가 모두 releases.ts에서 파생한다. 기록을
남기지 않으면 v0.12.0을 배포하고도 화면은 v0.11.0이라고 말한다.

레지스트리 묶음 설명과 README의 개수가 또 낡아 있었다. 손으로 세지
않고 registry.ts와 registry.json에서 세어 고쳤다. README가 순서를
지키는 테스트 이름을 잘못 적고 있던 것도 함께 고친다.

이 작업장을 절대 경로로 가리키는 미리보기 항목도 걷어낸다. 병합하면
작업장이 사라져 낡은 체크아웃을 띄우거나 아예 뜨지 않는다."
```

---

## 자기 점검

**스펙 대응.**

| 스펙 | Task |
|---|---|
| 판단 1 — `Command`를 `cmdk` 없이 | 7 |
| 판단 2 — `Alert Dialog`를 자기 컴포넌트로 | 2 |
| `Destructive confirm`을 이번 회차에 옮긴다 | 3 |
| 1. `Sheet` | 1 |
| 2. `Alert Dialog` | 2 |
| 3. `Toggle` | 4 |
| 4. `Collapsible` | 5 |
| 5. `Scroll Area` | 6 |
| 6. `Command` | 7 |
| 문서에 반영되는 것 — 메타·LNB·라우트·레지스트리 | 1·2·4·5·6·7의 공통 절차 |
| 문서에 반영되는 것 — `releases.ts`, 손으로 적힌 숫자 둘 | 8 |
| 범위 밖 — `SearchDialog` 이전 | 8의 `reviewItems` 첫 줄로 남긴다 |

**이름의 일관성.** `CommandEntry` · `CommandSection` · `filterCommandEntries` · `groupCommandEntries`는 Task 7의 Step 3에서 정의하고 같은 Task의 Step 5·7이 그 이름 그대로 쓴다. `toggleVariants`는 Task 4의 Step 2에서 정의하고 Step 3이 import한다. `AlertDialog` 아홉은 Task 2의 Step 3에서 정의하고 Task 3의 Step 1이 그 이름 그대로 바꿔 넣는다. `SheetSide`는 Task 1 안에서만 쓰인다.

**Task 사이의 의존.** 3은 2에 기댄다(2 없이 3만 돌리면 `patterns.test.ts`가 `alert-dialog`를 찾지 못한다). 8은 앞의 일곱 전부에 기댄다(개수를 센다). 나머지 1·2·4·5·6·7은 서로 기대지 않는다 — 같은 파일 넷(`registry.ts` · `nav-config.ts` · `routes.tsx` · `registry.json`)을 함께 고치므로 **순서대로 하나씩** 한다.

**사람이 정해야 할 것.** 아래 셋은 이 계획이 정하지 않는다.

- 여섯의 `verified`를 전부 `false`로 두었다. 브라우저로 확인을 마친 뒤 올릴지는 사람이 정한다
- Task 8의 `requests`와 `impact`. 실제로 들어온 것이 없으면 빈 배열로 둔다
- Task 5 Step 3에서 `collapsible` 움직임 유틸리티가 없는 것으로 나오면, 움직임 없이 두는 것으로 끝낼지 별도 회차에서 다룰지는 사람이 정한다
