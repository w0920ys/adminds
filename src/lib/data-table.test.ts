import { describe, expect, it } from 'vitest'
import {
  nextSortState,
  pageSelectionState,
  paginate,
  sortRows,
  toggleAllOnPage,
  toggleRow,
  type DataTableColumn,
} from '@/lib/data-table'

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

  it('page가 NaN이면 첫 페이지로 당긴다', () => {
    expect(paginate(rows, NaN, 2)).toEqual({ rows: ['a', 'b'], page: 1, pageCount: 3 })
  })

  it('page가 Infinity이면 첫 페이지로 당긴다', () => {
    expect(paginate(rows, Infinity, 2)).toEqual({ rows: ['a', 'b'], page: 1, pageCount: 3 })
  })

  it('page가 -Infinity이면 첫 페이지로 당긴다', () => {
    expect(paginate(rows, -Infinity, 2)).toEqual({ rows: ['a', 'b'], page: 1, pageCount: 3 })
  })

  it('perPage가 0이면 유한하고 양수인 값으로 처리하고 모든 행을 보인다', () => {
    const result = paginate(rows, 1, 0)
    expect(result.rows).toEqual(['a'])
    expect(result.pageCount).toBe(5)
    expect(result.page).toBe(1)
  })

  it('perPage가 음수이면 유한하고 양수인 값으로 처리하고 모든 행을 보인다', () => {
    const result = paginate(rows, 1, -5)
    expect(result.rows).toEqual(['a'])
    expect(result.pageCount).toBe(5)
    expect(result.page).toBe(1)
  })

  it('perPage가 Infinity이면 유한하고 양수인 값으로 처리한다', () => {
    const result = paginate(rows, 1, Infinity)
    expect(result.rows).toEqual(['a'])
    expect(result.pageCount).toBe(5)
    expect(result.page).toBe(1)
  })

  it('perPage가 NaN이면 유한하고 양수인 값으로 처리한다', () => {
    const result = paginate(rows, 1, NaN)
    expect(result.rows).toEqual(['a'])
    expect(result.pageCount).toBe(5)
    expect(result.page).toBe(1)
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
