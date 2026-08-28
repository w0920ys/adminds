# 어드민 디자인 시스템 v0.13.0 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Table`이 문서에서 약속해 놓고 지키지 않던 정렬과 선택을, `DataTable` 컴포넌트와 그 뒤의 순수 함수로 실제로 구현한다.

**Architecture:** 정렬·페이지 나눔·선택의 모든 규칙은 `src/lib/data-table.ts`의 순수 함수에 있고 테스트가 지킨다. `src/components/ui/data-table.tsx`는 그 함수들을 `Table`·`Checkbox`·`Pagination`·`Button`으로 조립하는 얇은 층이다. `Table`은 원시로 남되 `TableHead`가 정렬 머리를 그릴 수 있게 된다.

**Tech Stack:** Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · Vitest (node 환경) · lucide-react. **새 npm 패키지를 들이지 않는다.**

## Global Constraints

- 작업 브랜치는 `v0.13.0`이다. `main`에 직접 커밋하지 않는다
- **Vitest는 `node` 환경에서 돈다. jsdom이 없다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않는다 — 검사할 값은 `src/lib`의 순수 함수로 뺀다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않는다.** 이 프로젝트가 모든 회차에서 가장 자주 낸 결함이고, 이번 회차는 그 결함 하나를 갚는 회차다. 확인하지 않은 주장을 넣지 않는다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다
- 전시 컴포넌트(`src/components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다. 제품 컴포넌트(`src/components/ui/*`)는 문서 시스템의 표시를 알지 않는다
- **17px 이하 글자는 4.5:1을 넘어야 한다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. 재지 않고 어림잡지 않는다
- **`--spacing-control-sm`·`--spacing-control`·`--spacing-control-lg`(2·2.25·2.5rem)와 `--spacing-row` 계열은 의도된 어드민 밀도 축이다.** shadcn 기본값 쪽으로 "고치지" 않는다
- 예시 안의 가짜 화면 제목은 `<h4>`를 쓴다. `<h3>`을 쓰지 않는다 — `assignHeadingIds`(`src/lib/heading-id.ts`)가 `main` 아래의 모든 `h2`·`h3`을 고정 목차로 쓸어 담는다
- 줄어들 수 없는 고정 폭을 두지 않는다. `w-full max-w-*`를 쓴다
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. **`prettier --write`를 돌리지 않는다.** 이 저장소에는 prettier 설정이 없다
- `public/r/*.json`을 손으로 고치지 않는다. `npm run registry`를 돌린다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않는다
- **이 하네스는 키보드 동작을 검증할 수 없다** — 실제 키 입력이 쓸 만한 `keydown`을 만들지 못하고(`Enter`가 `code: ""`·`keyCode: 0`으로 도착한다), 합성한 `Escape`는 Radix 층을 닫지 못한다. 키보드 동작은 소스로 추론하고 그렇게만 적는다. **하네스를 보정하려고 제품 코드를 고치지 않는다**
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다

---

## 파일 구조

| 파일 | 책임 |
|---|---|
| `src/lib/data-table.ts` (새로) | 정렬·페이지 나눔·선택의 규칙. 순수 함수만. React를 import하지 않는다 |
| `src/lib/data-table.test.ts` (새로) | 위 규칙 전부 |
| `src/components/ui/data-table.tsx` (새로) | 위 함수들을 `Table`·`Checkbox`·`Pagination`·`Button`으로 조립 |
| `src/components/ui/table.tsx` (고침) | `TableHead`가 정렬 머리를 그릴 수 있게 된다 |
| `src/data/registry.ts` (고침) | `data-table` 항목 추가, `table` 항목의 거짓 문장 수정 |
| `registry.json` (고침) | `data-table`·`data-table-lib` 항목 |
| `src/routes/components/DataTablePage.tsx` (새로) | 문서 페이지 |
| `src/routes/components/TablePage.tsx` (고침) | Anatomy 무대의 죽은 아이콘을 진짜 정렬 머리로 |
| `src/routes/routes.tsx` (고침) | 라우트 등록 |
| `src/components/layout/nav-config.ts` (고침) | LNB 등록 |
| `src/routes/patterns/ListPatternPage.tsx` (고침) | `DataTable`로 옮긴다 |
| `src/data/patterns.ts` (고침) | `list` 패턴의 구조 링크 |
| `src/data/releases.ts` (고침) | v0.13.0 회차 |

검색 색인(`src/data/search-index.ts`)은 **손대지 않는다.** `registry.ts`의 `components`와 `nav-config`에서 그때그때 만들어지므로 등록이 저절로 된다.

---

## Task 1: 정렬 규칙

**Files:**
- Create: `src/lib/data-table.ts`
- Test: `src/lib/data-table.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces:
  ```ts
  export type SortDirection = 'asc' | 'desc'
  export type SortState = { columnId: string; direction: SortDirection } | null
  export type DataTableColumn<T> = {
    id: string
    header: string
    cell: (row: T) => React.ReactNode
    sortValue?: (row: T) => string | number | null
    numeric?: boolean
    sticky?: boolean
  }
  export function nextSortState(current: SortState, columnId: string): SortState
  export function sortRows<T>(rows: readonly T[], sort: SortState, columns: readonly DataTableColumn<T>[]): T[]
  ```

`DataTableColumn`이 `React.ReactNode`를 쓰므로 이 파일은 `import type { ReactNode } from 'react'` 한 줄만 타입으로 가져온다. 값으로서의 React는 가져오지 않는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/lib/data-table.test.ts`를 만든다.

```ts
import { describe, expect, it } from 'vitest'
import { nextSortState, sortRows, type DataTableColumn } from '@/lib/data-table'

type Row = { id: string; name: string; amount: number; owner: string | null }

const ROWS: Row[] = [
  { id: 'a', name: '가나다', amount: 300, owner: '윤' },
  { id: 'b', name: '라마바', amount: 100, owner: null },
  { id: 'c', name: '사아자', amount: 200, owner: '민' },
]

const COLUMNS: DataTableColumn<Row>[] = [
  { id: 'name', header: '이름', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'amount', header: '금액', cell: (row) => row.amount, sortValue: (row) => row.amount, numeric: true },
  { id: 'owner', header: '담당', cell: (row) => row.owner ?? '—', sortValue: (row) => row.owner },
  { id: 'actions', header: '동작', cell: () => null },
]

const ids = (rows: Row[]) => rows.map((row) => row.id)

describe('nextSortState', () => {
  it('정렬이 없으면 오름차순으로 시작한다', () => {
    expect(nextSortState(null, 'name')).toEqual({ columnId: 'name', direction: 'asc' })
  })

  it('오름차순인 열을 다시 누르면 내림차순이 된다', () => {
    expect(nextSortState({ columnId: 'name', direction: 'asc' }, 'name')).toEqual({
      columnId: 'name',
      direction: 'desc',
    })
  })

  it('내림차순인 열을 다시 누르면 정렬이 풀린다', () => {
    expect(nextSortState({ columnId: 'name', direction: 'desc' }, 'name')).toBeNull()
  })

  it('다른 열을 누르면 그 열의 오름차순으로 갈아탄다', () => {
    expect(nextSortState({ columnId: 'name', direction: 'desc' }, 'amount')).toEqual({
      columnId: 'amount',
      direction: 'asc',
    })
  })
})

describe('sortRows', () => {
  it('정렬이 없으면 원래 순서를 지킨다', () => {
    expect(ids(sortRows(ROWS, null, COLUMNS))).toEqual(['a', 'b', 'c'])
  })

  it('입력 배열을 바꾸지 않는다', () => {
    const before = [...ROWS]
    sortRows(ROWS, { columnId: 'amount', direction: 'asc' }, COLUMNS)
    expect(ROWS).toEqual(before)
  })

  it('숫자를 크기로 정렬한다 — 글자로 견주지 않는다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'amount', direction: 'asc' }, COLUMNS))).toEqual(['b', 'c', 'a'])
    expect(ids(sortRows(ROWS, { columnId: 'amount', direction: 'desc' }, COLUMNS))).toEqual(['a', 'c', 'b'])
  })

  it('글자를 한국어 순서로 정렬한다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'name', direction: 'asc' }, COLUMNS))).toEqual(['a', 'b', 'c'])
  })

  it('값이 없는 칸은 오름차순에서 끝에 둔다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'owner', direction: 'asc' }, COLUMNS))).toEqual(['c', 'a', 'b'])
  })

  it('값이 없는 칸은 내림차순에서도 끝에 둔다 — 없는 값은 작은 값이 아니다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'owner', direction: 'desc' }, COLUMNS))).toEqual(['a', 'c', 'b'])
  })

  it('sortValue가 없는 열로는 정렬하지 않고 원래 순서를 지킨다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'actions', direction: 'asc' }, COLUMNS))).toEqual(['a', 'b', 'c'])
  })

  it('없는 열 id로는 원래 순서를 지킨다', () => {
    expect(ids(sortRows(ROWS, { columnId: 'nope', direction: 'asc' }, COLUMNS))).toEqual(['a', 'b', 'c'])
  })

  it('같은 값끼리는 원래 순서를 지킨다', () => {
    const tied: Row[] = [
      { id: 'x', name: '같음', amount: 1, owner: null },
      { id: 'y', name: '같음', amount: 1, owner: null },
      { id: 'z', name: '같음', amount: 1, owner: null },
    ]
    expect(ids(sortRows(tied, { columnId: 'name', direction: 'desc' }, COLUMNS))).toEqual(['x', 'y', 'z'])
  })
})
```

- [ ] **Step 2: 테스트가 실패하는 것을 본다**

Run: `npm test -- src/lib/data-table.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/data-table"`

- [ ] **Step 3: 최소 구현을 쓴다**

`src/lib/data-table.ts`:

```ts
import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortState = { columnId: string; direction: SortDirection } | null

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /**
   * 이 열로 정렬할 때 견줄 값. 주지 않으면 그 열은 정렬되지 않는다.
   *
   * cell과 나누는 이유는 cell이 ReactNode를 돌려주기 때문이다 — 상태 칸이
   * <Badge>활성</Badge>을 돌려주면 그것으로는 대소를 가릴 수 없다.
   */
  sortValue?: (row: T) => string | number | null
  numeric?: boolean
  sticky?: boolean
}

/**
 * 열 하나를 눌렀을 때의 다음 정렬 상태.
 *
 * 없음 -> 오름 -> 내림 -> 없음으로 돈다. 다른 열을 누르면 그 열의 오름차순으로
 * 갈아탄다.
 */
export function nextSortState(current: SortState, columnId: string): SortState {
  if (current?.columnId !== columnId) return { columnId, direction: 'asc' }
  if (current.direction === 'asc') return { columnId, direction: 'desc' }
  return null
}

function compare(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'ko')
}

/**
 * 정렬된 새 배열을 돌려준다. 입력을 바꾸지 않는다.
 *
 * 값이 없는 칸(sortValue가 null이나 undefined를 돌려준 행)은 방향과 무관하게
 * 항상 끝으로 간다. 없는 값은 작은 값이 아니라 값이 아니기 때문이다.
 *
 * Array.prototype.sort는 ES2019부터 안정 정렬이 보장되므로 같은 값끼리는
 * 원래 순서가 지켜진다.
 */
export function sortRows<T>(
  rows: readonly T[],
  sort: SortState,
  columns: readonly DataTableColumn<T>[],
): T[] {
  if (!sort) return [...rows]

  const column = columns.find((candidate) => candidate.id === sort.columnId)
  const sortValue = column?.sortValue
  if (!sortValue) return [...rows]

  const sign = sort.direction === 'asc' ? 1 : -1

  return [...rows].sort((left, right) => {
    const a = sortValue(left)
    const b = sortValue(right)
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1
    if (b === null || b === undefined) return -1
    return compare(a, b) * sign
  })
}
```

- [ ] **Step 4: 테스트가 통과하는 것을 본다**

Run: `npm test -- src/lib/data-table.test.ts`
Expected: PASS — 13 tests

- [ ] **Step 5: 전체 검사**

Run: `npm test && npx tsc -b && npm run build`
Expected: 모두 통과

- [ ] **Step 6: 커밋**

```bash
git add src/lib/data-table.ts src/lib/data-table.test.ts
git commit -m "feat(data-table): 정렬 규칙을 순수 함수로 세운다"
```

---

## Task 2: 페이지 나눔과 선택 규칙

**Files:**
- Modify: `src/lib/data-table.ts`
- Test: `src/lib/data-table.test.ts`

**Interfaces:**
- Consumes: Task 1의 `src/lib/data-table.ts`
- Produces:
  ```ts
  export type PageSelectionState = 'none' | 'some' | 'all'
  export function paginate<T>(rows: readonly T[], page: number, perPage: number): { rows: T[]; page: number; pageCount: number }
  export function toggleRow(selected: ReadonlySet<string>, id: string): Set<string>
  export function toggleAllOnPage(selected: ReadonlySet<string>, pageIds: readonly string[]): Set<string>
  export function pageSelectionState(selected: ReadonlySet<string>, pageIds: readonly string[]): PageSelectionState
  ```

`paginate`가 `page`를 돌려주는 것은 부른 쪽이 **자기가 넘긴 페이지가 잘렸는지 알아야 하기 때문**이다. 행을 지워 페이지 수가 줄면 3페이지에 있던 사람이 갈 곳이 없어진다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/lib/data-table.test.ts`의 끝에 붙인다. 파일 맨 위의 import를 이렇게 바꾼다.

```ts
import {
  nextSortState,
  pageSelectionState,
  paginate,
  sortRows,
  toggleAllOnPage,
  toggleRow,
  type DataTableColumn,
} from '@/lib/data-table'
```

붙일 테스트:

```ts
describe('paginate', () => {
  const rows = ['a', 'b', 'c', 'd', 'e']

  it('그 페이지의 행만 돌려준다', () => {
    expect(paginate(rows, 1, 2).rows).toEqual(['a', 'b'])
    expect(paginate(rows, 2, 2).rows).toEqual(['c', 'd'])
  })

  it('마지막 페이지는 덜 찰 수 있다', () => {
    expect(paginate(rows, 3, 2).rows).toEqual(['e'])
  })

  it('전체 페이지 수를 센다', () => {
    expect(paginate(rows, 1, 2).pageCount).toBe(3)
  })

  it('행이 없어도 페이지 수는 1이다 — 0페이지짜리 표는 없다', () => {
    expect(paginate([], 1, 20)).toEqual({ rows: [], page: 1, pageCount: 1 })
  })

  it('범위를 넘은 페이지는 마지막 페이지로 당기고 그 사실을 돌려준다', () => {
    expect(paginate(rows, 9, 2)).toEqual({ rows: ['e'], page: 3, pageCount: 3 })
  })

  it('1보다 작은 페이지는 첫 페이지로 당긴다', () => {
    expect(paginate(rows, 0, 2)).toEqual({ rows: ['a', 'b'], page: 1, pageCount: 3 })
  })

  it('입력 배열을 바꾸지 않는다', () => {
    const before = [...rows]
    paginate(rows, 2, 2)
    expect(rows).toEqual(before)
  })
})

describe('toggleRow', () => {
  it('없던 것을 넣는다', () => {
    expect([...toggleRow(new Set(['a']), 'b')]).toEqual(['a', 'b'])
  })

  it('있던 것을 뺀다', () => {
    expect([...toggleRow(new Set(['a', 'b']), 'a')]).toEqual(['b'])
  })

  it('원래 집합을 바꾸지 않는다', () => {
    const selected = new Set(['a'])
    toggleRow(selected, 'b')
    expect([...selected]).toEqual(['a'])
  })
})

describe('toggleAllOnPage', () => {
  it('이 페이지가 다 골라져 있지 않으면 이 페이지를 다 넣는다', () => {
    expect([...toggleAllOnPage(new Set(['a']), ['a', 'b', 'c'])]).toEqual(['a', 'b', 'c'])
  })

  it('이 페이지가 다 골라져 있으면 이 페이지만 뺀다', () => {
    expect([...toggleAllOnPage(new Set(['a', 'b', 'z']), ['a', 'b'])]).toEqual(['z'])
  })

  it('다른 페이지에서 고른 것은 건드리지 않는다', () => {
    expect([...toggleAllOnPage(new Set(['z']), ['a', 'b'])]).toEqual(['z', 'a', 'b'])
  })
})

describe('pageSelectionState', () => {
  it('이 페이지에서 아무것도 안 골랐으면 none이다', () => {
    expect(pageSelectionState(new Set(['z']), ['a', 'b'])).toBe('none')
  })

  it('일부만 골랐으면 some이다', () => {
    expect(pageSelectionState(new Set(['a']), ['a', 'b'])).toBe('some')
  })

  it('다 골랐으면 all이다', () => {
    expect(pageSelectionState(new Set(['a', 'b', 'z']), ['a', 'b'])).toBe('all')
  })

  it('행이 없는 페이지는 none이다 — 빈 페이지를 다 골랐다고 하지 않는다', () => {
    expect(pageSelectionState(new Set(['z']), [])).toBe('none')
  })

  it('다른 페이지의 선택은 이 페이지의 상태를 바꾸지 않는다', () => {
    expect(pageSelectionState(new Set(['a', 'b', 'z']), ['a', 'b'])).toBe('all')
    expect(pageSelectionState(new Set(['a']), ['a', 'b'])).toBe('some')
  })
})
```

- [ ] **Step 2: 테스트가 실패하는 것을 본다**

Run: `npm test -- src/lib/data-table.test.ts`
Expected: FAIL — `paginate is not a function` 계열로 새 테스트 18개가 실패한다

- [ ] **Step 3: 최소 구현을 쓴다**

`src/lib/data-table.ts`의 끝에 붙인다.

```ts
export type PageSelectionState = 'none' | 'some' | 'all'

/**
 * 그 페이지의 행과, 실제로 보인 페이지 번호와, 전체 페이지 수.
 *
 * page를 돌려주는 것은 부른 쪽이 자기가 넘긴 페이지가 당겨졌는지 알아야 하기
 * 때문이다 — 행이 줄어 페이지 수가 줄면 3페이지에 있던 사람은 갈 곳이 없다.
 * 행이 하나도 없어도 페이지 수는 1이다. 0페이지짜리 표는 없다.
 */
export function paginate<T>(
  rows: readonly T[],
  page: number,
  perPage: number,
): { rows: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * perPage
  return { rows: rows.slice(start, start + perPage), page: safePage, pageCount }
}

/** 행 하나를 넣거나 뺀 새 집합. 원래 집합을 바꾸지 않는다. */
export function toggleRow(selected: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(selected)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

/**
 * 지금 페이지의 행 전부를 넣거나 뺀 새 집합.
 *
 * 이 페이지가 이미 다 골라져 있으면 이 페이지만 뺀다. 다른 페이지에서 고른
 * 것은 건드리지 않는다 — 선택은 페이지를 넘어가도 남는다.
 */
export function toggleAllOnPage(selected: ReadonlySet<string>, pageIds: readonly string[]): Set<string> {
  const next = new Set(selected)
  if (pageSelectionState(selected, pageIds) === 'all') {
    for (const id of pageIds) next.delete(id)
  } else {
    for (const id of pageIds) next.add(id)
  }
  return next
}

/**
 * 지금 페이지가 얼마나 골라졌는지. 머리의 체크박스가 이것으로 정해진다.
 *
 * 지금 페이지만 본다 — 머리의 체크박스는 '이 페이지 전부'를 뜻한다. 아직 받아
 * 오지 않은 행까지 고르는 일은 서버가 알아야 하는 일이다.
 */
export function pageSelectionState(
  selected: ReadonlySet<string>,
  pageIds: readonly string[],
): PageSelectionState {
  if (pageIds.length === 0) return 'none'
  const picked = pageIds.filter((id) => selected.has(id)).length
  if (picked === 0) return 'none'
  return picked === pageIds.length ? 'all' : 'some'
}
```

- [ ] **Step 4: 테스트가 통과하는 것을 본다**

Run: `npm test -- src/lib/data-table.test.ts`
Expected: PASS — 31 tests

- [ ] **Step 5: 전체 검사**

Run: `npm test && npx tsc -b && npm run build`

- [ ] **Step 6: 커밋**

```bash
git add src/lib/data-table.ts src/lib/data-table.test.ts
git commit -m "feat(data-table): 페이지 나눔과 선택 규칙을 세운다"
```

---

## Task 3: `Table`이 약속을 지키게 한다

이 Task는 `DataTable`과 **독립적으로 되돌릴 수 있어야 한다.** `data-table.tsx`를 만들지 않고 `Table`만 고친다.

**Files:**
- Modify: `src/components/ui/table.tsx:100-119` (`TableHead`)
- Modify: `src/routes/components/TablePage.tsx` (Anatomy 무대의 `sort-indicator`)
- Modify: `src/data/registry.ts` (`table` 항목의 `purpose`와 `sort-indicator` 설명)

**Interfaces:**
- Consumes: 없음
- Produces: `TableHead`가 `sortable?: boolean`과 `sortDirection?: 'asc' | 'desc' | false`를 받는다. Task 4의 `DataTable`이 이것을 쓴다

- [ ] **Step 1: 지금 무엇이 거짓인지 눈으로 확인한다**

Run:
```bash
grep -n "sort-indicator" src/data/registry.ts src/routes/components/TablePage.tsx
grep -n "aria-sort" -r src/
```

Expected: `registry.ts`는 "누르면 정렬 방향이 바뀐다"라고 적고 있고, `TablePage.tsx`가 그리는 것은 `<ChevronDown data-anatomy="sort-indicator" size={12} aria-hidden />`이며, `aria-sort`는 저장소에 하나도 없다.

**이 단계는 확인이지 합격 검사가 아니다.** 본 것을 보고서에 적는다.

- [ ] **Step 2: `TableHead`를 고친다**

`src/components/ui/table.tsx`의 `TableHead`를 이렇게 바꾼다.

`onClick`은 `th`가 아니라 정렬 단추에 실려야 누를 수 있는 것이 무엇인지 드러난다. 그래서 `onClick`을 따로 뽑아, `sortable`이면 `button`에 싣고 아니면 `th`에 그대로 싣는다 — 정렬 머리가 아닌 `th`의 기존 동작을 깨지 않기 위해서다.

```tsx
function TableHead({
  className,
  numeric,
  sticky,
  sortable,
  sortDirection = false,
  onClick,
  children,
  ...props
}: React.ComponentProps<'th'> & {
  numeric?: boolean
  sticky?: boolean
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | false
}) {
  const ariaSort = sortDirection === false ? 'none' : sortDirection === 'asc' ? 'ascending' : 'descending'

  return (
    <th
      scope="col"
      data-slot="table-head"
      /*
       * aria-sort는 정렬 가능한 열에만 싣는다. 정렬 가능하지 않은 열에
       * 'none'을 실으면 보조 기술에 정렬할 수 있다고 말하는 것이 된다.
       */
      aria-sort={sortable ? ariaSort : undefined}
      onClick={sortable ? undefined : onClick}
      className={cn(
        'text-muted-foreground h-full px-3 text-left align-middle text-xs font-bold whitespace-nowrap',
        numeric && 'text-right',
        sticky && 'bg-surface sticky left-0 z-sticky',
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          data-slot="table-sort-button"
          onClick={onClick}
          className={cn(
            'text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 -mx-1 inline-flex items-center gap-1 rounded px-1 outline-none focus-visible:ring-2',
            numeric && 'flex-row-reverse',
          )}
        >
          {children}
          {/*
           * 방향 아이콘 자리는 정렬되지 않은 열에도 남긴다. 나타났다 사라지면
           * 누를 때마다 머리의 너비가 바뀌어 표가 튄다.
           */}
          <ChevronUp
            data-slot="table-sort-indicator"
            size={12}
            aria-hidden
            className={cn(
              'shrink-0 transition-transform',
              sortDirection === false && 'opacity-0',
              sortDirection === 'desc' && 'rotate-180',
            )}
          />
        </button>
      ) : (
        children
      )}
    </th>
  )
}
```

파일 맨 위에 `import { ChevronUp } from 'lucide-react'`를 더한다. `table.tsx`는 지금 lucide를 쓰지 않으므로 새 import 줄이 하나 생기고, 그러면 `registry.json`의 `table` 항목에 `dependencies: ["lucide-react"]`가 필요해진다 — **그것까지 이 Task에서 한다.** 고친 뒤 `npm run registry`를 돌리고 `npm test -- src/data/registry-parity.test.ts`가 통과하는 것을 본다.

- [ ] **Step 3: `TablePage`의 Anatomy 무대를 고친다**

`src/routes/components/TablePage.tsx`에서 `data-anatomy="sort-indicator"`가 붙은 맨 `<ChevronDown>`을 찾아, 그 자리를 `<TableHead sortable sortDirection="asc">`로 바꾼다. `data-anatomy="sort-indicator"`는 `TableHead` 안의 아이콘이 아니라 **바깥 `th`**에 남겨야 Anatomy 번호가 붙을 자리를 잃지 않는다 — `data-anatomy` 속성이 어디에 붙어야 하는지는 같은 파일의 다른 부위(`select-cell` 등)가 하는 방식을 그대로 따른다.

무대가 정말 정렬되게 만들지 않는다. Anatomy 무대는 부위를 보이는 자리이지 동작하는 자리가 아니고, 같은 파일의 다른 부위도 그렇게 되어 있다.

`ChevronDown`이 이 파일에서 더 이상 쓰이지 않으면 import를 지운다.

- [ ] **Step 4: `registry.ts`의 문장을 코드에 맞춘다**

`table` 항목의 `sort-indicator` 설명과 `purpose`를 다시 본다.

- `sort-indicator`의 "누르면 정렬 방향이 바뀐다"는 이제 **참이 된다** — 다만 그것을 하는 것은 `TableHead`의 `sortable`이므로, 그 사실이 드러나게 적는다
- `purpose`의 "고르거나 정렬하게 한다"에서 **고르는 일은 `Table`이 하지 않는다.** `TableRow`의 `selected`는 골라진 것을 보이기만 하고 세지 않는다. 이 문장을 고친다

**무엇으로 고칠지는 코드를 보고 정한다.** 이 계획서가 문구를 지정하지 않는 것은, 지정한 문구가 또 코드와 어긋나는 것이 이 저장소가 반복해 온 결함이기 때문이다. 고친 문장이 왜 참인지 보고서에 적는다.

- [ ] **Step 5: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 테스트 31개 그대로 통과, 타입 0, 빌드 통과, oxlint 오류 0

그리고 화면으로 확인한다 — `/components/table`의 Anatomy 무대에 정렬 머리가 보이고, `th`에 `aria-sort="ascending"`이 실려 있는지 DOM에서 읽는다. 읽은 값을 보고서에 적는다.

- [ ] **Step 6: 커밋**

```bash
git add src/components/ui/table.tsx src/routes/components/TablePage.tsx src/data/registry.ts registry.json public/r
git commit -m "fix(table): 정렬 머리를 실제로 그리고 aria-sort를 싣는다"
```

---

## Task 4: `DataTable` 컴포넌트

**Files:**
- Create: `src/components/ui/data-table.tsx`

**Interfaces:**
- Consumes: Task 1·2의 `src/lib/data-table.ts` 전부, Task 3의 `TableHead`(`sortable`·`sortDirection`)
- Produces:
  ```tsx
  export type DataTableProps<T> = {
    columns: readonly DataTableColumn<T>[]
    rows: readonly T[]
    getRowId: (row: T) => string
    density?: 'compact' | 'default'
    selectable?: boolean
    perPage?: number
    state?: 'default' | 'loading' | 'empty'
    emptyContent?: ReactNode
    toolbar?: (context: { selectedCount: number; clearSelection: () => void }) => ReactNode
    sort?: SortState
    onSortChange?: (sort: SortState) => void
    page?: number
    onPageChange?: (page: number) => void
    selected?: ReadonlySet<string>
    onSelectedChange?: (selected: Set<string>) => void
  }
  export function DataTable<T>(props: DataTableProps<T>): ReactNode
  ```

- [ ] **Step 1: 제어·비제어를 어떻게 쓰는지 먼저 읽는다**

Run: `grep -n "onOpenChange\|useState\|?? " src/components/ui/combobox.tsx | head -20`

이 저장소가 이미 쓰는 모양을 그대로 따른다. 새로 발명하지 않는다. 읽은 것을 보고서에 적는다.

- [ ] **Step 2: 컴포넌트를 쓴다**

`src/components/ui/data-table.tsx`. 갖춰야 할 것:

- 세 상태(`sort`·`page`·`selected`)를 **비제어를 기본으로, prop이 오면 제어로** 다룬다. 각각 `props.X ?? internalX` 꼴이고, 바꾸는 함수는 내부 상태를 갱신하고 `onXChange`를 부른다
- 그리는 순서: `sortRows` → `paginate`. **정렬을 먼저 하고 자른다.** 반대로 하면 페이지 안에서만 정렬되어 2페이지의 값이 1페이지보다 클 수 있다
- `paginate`가 돌려준 `page`가 넘긴 `page`와 다르면 그 값을 쓴다(범위를 넘은 페이지가 당겨진 경우)
- `selectable`이면 머리에 `Checkbox`를 두고 `pageSelectionState`가 `'some'`일 때 `checked="indeterminate"`를 넘긴다. `aria-label`은 "이 페이지 전부 선택"이다 — 전체가 아니라 이 페이지라는 것이 이름에 있어야 한다
- 열 머리는 `column.sortValue`가 있으면 `<TableHead sortable sortDirection={...} onClick={...}>`, 없으면 그냥 `<TableHead>`
- `state === 'loading'`이면 행 자리에 `Skeleton`을, `'empty'`이거나 `rows.length === 0`이면 `emptyContent`(기본값은 `EmptyState`)를 `colSpan`으로 펼친 한 행에 둔다. **머리는 남긴다**
- `toolbar`는 선택이 있을 때만 부른다. `selectedCount`는 페이지가 아니라 **전체 선택 집합의 크기**다
- footer에 `Pagination` · `PaginationInfo` · `PaginationContent` · `PaginationItem`과 `Button`을 조립한다. `Pagination`이 내보내는 것은 그 넷뿐이고 페이지 번호 버튼은 `Button`으로 만드는 물건이다 — `ListPatternPage.tsx:229-246`이 이미 그렇게 한다. 그 자리를 보고 따른다
- 고정 폭을 두지 않는다. 표가 넘치면 가로로 구르게 하고 `sticky` 열은 남는다

이 컴포넌트는 **문서 시스템을 알지 않는다.** `@/components/docs/*`를 import하지 않는다.

- [ ] **Step 3: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`
Expected: 테스트 31개 통과, 타입 0, 빌드 통과, oxlint 오류 0

- [ ] **Step 4: 커밋**

```bash
git add src/components/ui/data-table.tsx
git commit -m "feat(data-table): 순수 함수 위에 표를 조립한다"
```

---

## Task 5: 레지스트리 등록

**Files:**
- Modify: `src/data/registry.ts` (`data-table` 항목 추가)
- Modify: `registry.json`
- Regenerate: `public/r/*.json`

**Interfaces:**
- Consumes: Task 4의 `src/components/ui/data-table.tsx`, Task 1·2의 `src/lib/data-table.ts`
- Produces: `getComponent('data-table')`이 값을 돌려준다. Task 6의 문서 페이지가 이것을 쓴다

- [ ] **Step 1: `registry.ts`에 항목을 더한다**

`data-display` 무리에 `data-table`을 더한다. 배열에서의 자리는 화면 순서를 정하지 않는다 — `componentsByCategory()`가 `name.localeCompare`로 정렬한다. 기존 항목들 사이의 알파벳 자리에 둔다.

채울 것: `id: 'data-table'` · `name: 'Data Table'` · `aliases` · `category: 'data-display'` · `status` · `addedIn: 'v0.13.0'` · `changedIn: 'v0.13.0'` · `purpose` · `anatomy`(`toolbar` · `select-all-cell` · `sortable-header` · `sort-indicator` · `row` · `select-cell` · `footer`) · `properties`(`density` · `selection` · `state`) · `guidelines` · `usage` · `cases`.

스펙의 「`Data Table` 컴포넌트」 절이 이 값들의 내용을 적어 두었다. **다만 그대로 옮기기 전에 Task 4에서 실제로 만든 것과 맞는지 본다.** 스펙과 코드가 어긋나면 코드가 옳고, 어긋난 사실을 보고서에 적는다.

`status`는 `stable`로 두지 않는다. 이 컴포넌트는 이번 회차에 처음 실린다 — 같은 처지였던 v0.12.0의 여섯이 무엇으로 실렸는지 보고 따른다.

- [ ] **Step 2: `registry.json`에 항목 둘을 더한다**

`data-table-lib`(`registry:lib`)과 `data-table`(`registry:ui`) 둘이다. `calendar-lib`/`date-picker` 쌍과 `command-filter`/`command` 쌍이 그 모양이다.

```json
{
  "name": "data-table-lib",
  "type": "registry:lib",
  "title": "Data Table",
  "description": "정렬·페이지 나눔·선택 규칙을 담은 순수 함수들. Data Table이 쓴다.",
  "files": [{ "path": "src/lib/data-table.ts", "type": "registry:lib" }]
}
```

```json
{
  "name": "data-table",
  "type": "registry:ui",
  "title": "Data Table",
  "dependencies": ["lucide-react"],
  "registryDependencies": [
    "https://adminds.vercel.app/r/button.json",
    "https://adminds.vercel.app/r/checkbox.json",
    "https://adminds.vercel.app/r/data-table-lib.json",
    "https://adminds.vercel.app/r/pagination.json",
    "https://adminds.vercel.app/r/table.json",
    "https://adminds.vercel.app/r/tokens.json",
    "https://adminds.vercel.app/r/utils.json"
  ],
  "files": [{ "path": "src/components/ui/data-table.tsx", "type": "registry:ui" }]
}
```

**`registryDependencies`는 Task 4가 실제로 import한 것과 맞아야 한다.** `data-table.tsx`의 import를 보고 세어 맞춘다. `EmptyState`나 `Skeleton`을 썼으면 그것도 들어간다. 위 목록은 시작점이지 정답이 아니다.

`adminds` 묶음 항목의 `registryDependencies`에도 `data-table`을 더한다. `description`에 개수가 적혀 있으면 그것도 함께 본다 — 손으로 세지 말고 `registry.json`의 항목 수를 실제로 세어서 맞춘다.

- [ ] **Step 3: 페이로드를 다시 굽는다**

Run: `npm run registry`
그다음 `git status`로 무엇이 바뀌었는지 본다.

- [ ] **Step 4: 파리티 테스트가 통과하는지 본다**

Run: `npm test -- src/data/registry-parity.test.ts`
Expected: PASS

이 테스트는 `public/r/*.json`의 내용이 소스와 바이트로 같은지 본다. 실패하면 `npm run registry`를 안 돌렸거나 소스를 그 뒤에 고친 것이다.

- [ ] **Step 5: 전체 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build`

```bash
git add src/data/registry.ts registry.json public/r
git commit -m "feat(registry): Data Table을 싣는다"
```

---

## Task 6: 문서 페이지

**Files:**
- Create: `src/routes/components/DataTablePage.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/nav-config.ts`

**Interfaces:**
- Consumes: Task 5의 `getComponent('data-table')`, Task 4의 `DataTable`
- Produces: `/components/data-table` 라우트

- [ ] **Step 1: 이웃 페이지의 뼈대를 읽는다**

Run: `sed -n '1,40p' src/routes/components/ScrollAreaPage.tsx`

`ComponentPage`에 `meta` · `preview` · `render` · `extraSections?` · `renderGuidelineExample?` · `renderExample?`를 넘기는 모양이다. 그대로 따른다.

- [ ] **Step 2: 페이지를 쓴다**

축 무대(`render`)는 `density` · `selection` · `state` 셋을 그린다.

**예시의 자료를 손으로 적지 않는다.** 이 저장소는 `@/data/registry`의 `components`를 예시 자료로 쓰는 방식을 이미 갖고 있다 — `ScrollAreaPage.tsx`의 `ComponentList`와 `WideTable`이 그렇게 한다. 같은 자료로 열을 만들면 행 수도 내용도 데이터에서 파생되고, 손으로 적은 목록이 낡는 일이 없다.

지침 예시(DO/DON'T)를 그릴 때, **DON'T 예시가 자기가 보이려는 결함을 실제로 배포하지 않게 한다.** 이 저장소는 그런 자리에 `inert`를 쓴 선례가 둘 있다(`toggle`의 이름 없는 아이콘, `collapsible`의 유령 제목). 목차를 어지럽히거나 포커스를 받는 DON'T를 그리게 되면 같은 기법을 쓴다.

가짜 화면 제목은 `<h4>`다. `<h3>`을 쓰면 고정 목차에 빨려 들어간다.

- [ ] **Step 3: 라우트와 LNB에 등록한다**

`src/routes/routes.tsx`에 import와 `{ path: 'data-table', element: <DataTablePage /> }`를 더한다. 자리는 이웃과 같은 방식으로 둔다.

`src/components/layout/nav-config.ts`의 Components 절에 `{ to: '/components/data-table', label: 'Data Table', updatedAt: '2026-08-28' }`를 더한다.

검색 색인은 손대지 않는다 — `registry.ts`와 `nav-config`에서 저절로 만들어진다. **정말 그런지 확인한다:** 화면에서 검색을 열고 "data table"과 "표"를 쳐서 새 문서가 나오는지 본다. 본 것을 보고서에 적는다.

- [ ] **Step 4: 화면으로 확인한다**

`/components/data-table`을 열어 본다:
- 축 무대 셋이 다 그려지는가
- 정렬 머리를 눌러 순서가 바뀌는가. 눌러서 바뀐 실제 순서를 보고서에 적는다
- 선택 체크박스를 눌러 개수가 늘고, 페이지를 넘겨도 개수가 남는가. **이것이 이 회차의 핵심 약속이므로 실제로 눌러서 확인한다**
- 콘솔에 오류가 없는가
- 고정 목차의 앵커 수와 화면의 제목 수가 같은가

- [ ] **Step 5: 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/routes/components/DataTablePage.tsx src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "docs(data-table): 문서 페이지를 싣고 길을 낸다"
```

---

## Task 7: `list` 패턴을 `DataTable`로 옮긴다

**Files:**
- Modify: `src/routes/patterns/ListPatternPage.tsx`
- Modify: `src/data/patterns.ts` (`list` 항목의 `structure`와 문장)

**Interfaces:**
- Consumes: Task 4의 `DataTable`
- Produces: 없음

- [ ] **Step 1: 지금 무엇을 조립하고 있는지 읽는다**

Run: `grep -n "Table\|Checkbox\|Pagination\|ROWS" src/routes/patterns/ListPatternPage.tsx`

지금은 `Table`·`Checkbox`·`Pagination`을 손으로 조립하고 `ROWS` 상수를 쓴다.

- [ ] **Step 2: `DataTable`로 바꾼다**

표를 그리는 자리를 `DataTable` 하나로 바꾼다. 이 패턴이 이미 걸어 둔 예외 상황들이 **실제로 그렇게 되는지** 본다:

- "결과 없음" · "필터 결과 없음" — `state`나 빈 `rows`로 그린다
- "불러오는 중" — `state="loading"`
- "선택 상태에서 페이지 이동 — 선택이 몇 건인지 페이지를 넘어가도 보인다" — **이것이 참이 되는지 실제로 눌러서 확인한다.** 이 문장은 `patterns.ts`에 이미 적혀 있고, v0.13.0 이전에는 화면이 그것을 시연하지 않았다
- "좁은 화면" — 표가 가로로 구른다

패턴 페이지가 여전히 보여야 하는 것은 **패턴**이지 컴포넌트가 아니다. 필터 줄·제목 줄·대량 작업 줄은 그대로 남는다. `DataTable`의 `toolbar`가 대량 작업 줄을 받을 자리인지, 아니면 패턴이 자기 줄을 따로 두는 것이 맞는지 코드를 보고 정하고, 정한 이유를 보고서에 적는다.

- [ ] **Step 3: `patterns.ts`의 문장과 링크를 본다**

`list` 항목의 `structure`가 가리키는 컴포넌트 목록에 `table`이 있고 `data-table`이 없으면 화면의 링크가 이제 낡은 것이다. `purpose`와 `principles`의 문장도 화면이 실제로 하는 일과 맞는지 본다.

**고칠 문구를 이 계획서가 지정하지 않는다.** 코드를 보고 정하고, 왜 참인지 보고서에 적는다.

- [ ] **Step 4: 화면으로 확인한다**

`/patterns/list`를 열어 위 네 가지 예외 상황이 다 보이는지, 링크가 맞는 문서로 가는지, 콘솔 오류가 없는지 본다.

- [ ] **Step 5: 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/routes/patterns/ListPatternPage.tsx src/data/patterns.ts
git commit -m "refactor(patterns): 목록 패턴을 Data Table 위로 옮긴다"
```

---

## Task 8: 회차 기록과 문장 점검

**Files:**
- Modify: `src/data/releases.ts`
- Modify: 필요하면 `README.md`

**Interfaces:**
- Consumes: Task 1~7의 커밋 전부
- Produces: 없음

- [ ] **Step 1: 이 브랜치가 실제로 무엇을 했는지 센다**

Run:
```bash
git log --oneline v0.12.0..HEAD
git diff --stat v0.12.0..HEAD
```

**본 것만 적는다.** v0.12.0의 리뷰에서 이 자리가 두 번 틀렸다 — 노트를 쓴 뒤에 커밋이 더 붙어 숫자가 낡았고, 커밋이 실제로 한 일과 다른 설명이 실렸다. 노트를 쓰기 전에 `git show`로 각 커밋이 무엇을 했는지 확인한다.

- [ ] **Step 2: `releases.ts`에 v0.13.0을 더한다**

이웃 회차 항목의 모양을 그대로 따른다. `date`는 실제 날짜다.

적을 것: `Data Table`이 새로 실린 것, `Table`이 `aria-sort`와 정렬 머리를 갖게 된 것, `list` 패턴이 옮겨 간 것. **각 항목이 어느 커밋의 무엇인지 대조하고 적는다.**

- [ ] **Step 3: 개수 문장을 확인한다**

Run: `npm test -- src/data/registry-parity.test.ts`

v0.12.0에서 `registry.json`과 `README.md`의 개수 문구를 지키는 테스트가 들어갔다. 개수가 38에서 39로 바뀌었으므로 그 테스트가 **실패해야 맞다.** 실패하면 문구를 고치고 다시 돌린다.

만약 실패하지 않으면 그 사실 자체가 발견이다 — 테스트가 무엇을 지키는지 다시 보고 보고서에 적는다.

- [ ] **Step 4: 이번 회차가 갚기로 한 결함을 다시 훑는다**

이 회차는 "코드와 다른 말을 하는 문장"을 갚는 회차다. 마지막으로 한 번 훑는다:

```bash
grep -rn "정렬" src/data/registry.ts src/data/patterns.ts | head -30
```

`Table`·`Data Table`·`list` 패턴에 대해 화면에 나가는 문장이 지금 코드와 맞는지 본다. 맞지 않는 것을 고치고, 무엇을 고쳤는지 보고서에 적는다. **한 곳을 고치면 같은 주장이 다른 곳에도 있는지 본다** — v0.12.0에서 같은 거짓 문장이 여섯 자리에 퍼져 있던 적이 있다.

- [ ] **Step 5: 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/data/releases.ts README.md
git commit -m "chore: v0.13.0 기록을 남기고 개수 문구를 맞춘다"
```

---

## 자체 검토 기록

**스펙 대조:** 스펙의 판단 넷은 Task 1(정렬 규칙·`sortValue`)·Task 2(선택을 id로)·Task 3(`Table`이 약속을 지킴)·Task 4(`Table` 위의 조립)에 각각 있다. 「문서에 반영되는 것」의 다섯 줄은 Task 5(레지스트리·페이로드·개수)·Task 6(문서 페이지·라우트·LNB)·Task 8(회차 기록)이 덮는다. 검색 색인은 파생되므로 Task 6의 4단계가 확인만 한다. 「범위 밖」의 일곱은 어느 Task에도 없다.

**빈 자리 점검:** `TBD`·`나중에`·`적절히` 같은 말이 없다. 문구를 지정하지 않은 자리 셋(Task 3의 4단계, Task 7의 3단계, Task 8의 4단계)은 빠뜨린 것이 아니라 **의도한 것**이다 — 계획서가 미리 적은 문구가 코드와 어긋나는 것이 이 저장소가 반복해 온 결함이라, 그 자리들은 "코드를 보고 정하고 왜 참인지 보고서에 적는다"를 요구사항으로 둔다.

**이름 대조:** `SortState`·`SortDirection`·`DataTableColumn`·`PageSelectionState`·`nextSortState`·`sortRows`·`paginate`·`toggleRow`·`toggleAllOnPage`·`pageSelectionState`가 Task 1·2의 정의와 Task 4의 쓰임에서 같다. `TableHead`의 `sortable`·`sortDirection`은 Task 3이 정의하고 Task 4가 쓴다. `getRowId`는 Task 4에만 있다.
