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
