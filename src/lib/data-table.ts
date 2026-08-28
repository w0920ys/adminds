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
