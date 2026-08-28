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
