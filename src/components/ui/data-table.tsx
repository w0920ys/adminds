import * as React from 'react'
import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState, EmptyStateIcon, EmptyStateTitle } from '@/components/ui/empty-state'
import { Pagination, PaginationContent, PaginationInfo, PaginationItem } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  nextSortState,
  pageSelectionState,
  paginate,
  sortRows,
  toggleAllOnPage,
  toggleRow,
  type DataTableColumn,
  type SortState,
} from '@/lib/data-table'

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
  /*
   * Table의 label은 필수다 — 가로로 구르는 그릇이 role="region"이라 이름이
   * 있어야 하고, 그 이름은 표 안에 무엇이 들었는지 아는 쪽만 지을 수 있다.
   * DataTable도 그것을 모르므로 호출하는 쪽에서 그대로 물려받는다. 기본값을
   * 두는 것은 위의 목록이 이 컴포넌트의 약속이기 때문이다 — 빠뜨렸다고 표가
   * 이름 없이 서지는 않게 하되, 제대로 된 이름은 넘겨받는다.
   */
  label?: string
}

/** 한 번에 보일 페이지 번호 버튼의 최대 개수. 넘으면 지금 페이지를 가운데 두고 창을 민다 */
const PAGE_WINDOW = 5

/** 불러오는 중일 때 자리를 잡아 둘 뼈대 행의 최대 개수 */
const LOADING_ROWS = 5

function visiblePages(page: number, pageCount: number): number[] {
  const size = Math.min(PAGE_WINDOW, pageCount)
  const start = Math.min(Math.max(1, page - Math.floor(size / 2)), pageCount - size + 1)
  return Array.from({ length: size }, (_, index) => start + index)
}

/**
 * `src/lib/data-table.ts`의 순수 함수들 위에 얹은 표.
 *
 * 정렬·페이지·선택 세 상태를 비제어로 스스로 들고 있다가, 같은 이름의 prop이
 * 오면 그때부터 그 값을 쓴다(Combobox의 value/uncontrolled와 같은 모양이다).
 * 값이 있는지 없는지는 `!== undefined`로 가린다 — `??`로 가리면 정렬 없음을
 * 뜻하는 제어값 `null`이 내부 상태로 흘러 제어가 풀린다.
 *
 * 이 컴포넌트는 문서 시스템을 알지 않는다.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  density = 'default',
  selectable = false,
  perPage = 10,
  state = 'default',
  emptyContent,
  toolbar,
  sort,
  onSortChange,
  page,
  onPageChange,
  selected,
  onSelectedChange,
  label = '데이터 표',
}: DataTableProps<T>): ReactNode {
  const [internalSort, setInternalSort] = React.useState<SortState>(null)
  const [internalPage, setInternalPage] = React.useState(1)
  const [internalSelected, setInternalSelected] = React.useState<ReadonlySet<string>>(() => new Set())

  const currentSort = sort !== undefined ? sort : internalSort
  const currentPage = page !== undefined ? page : internalPage
  const currentSelected = selected !== undefined ? selected : internalSelected

  function commitSort(next: SortState) {
    if (sort === undefined) setInternalSort(next)
    onSortChange?.(next)
  }

  function commitPage(next: number) {
    if (page === undefined) setInternalPage(next)
    onPageChange?.(next)
  }

  function commitSelected(next: Set<string>) {
    if (selected === undefined) setInternalSelected(next)
    onSelectedChange?.(next)
  }

  /*
   * 정렬을 먼저 하고 자른다. 순서를 뒤집으면 페이지 안에서만 정렬되어
   * 2페이지에 1페이지보다 큰 값이 남는다.
   */
  const sorted = React.useMemo(() => sortRows(rows, currentSort, columns), [rows, currentSort, columns])

  /*
   * paginate가 돌려준 page를 그대로 쓴다. 행이 줄어 페이지 수가 줄면 넘긴
   * 페이지는 없는 페이지다 — 그때 화면이 비지 않고 마지막 페이지로 당겨진다.
   * 당겨진 값을 상태로 되쓰지는 않는다. 그리기 도중에 상태를 바꾸거나
   * onPageChange를 부르는 일이 되기 때문이다. 다음 클릭은 여기 보인 페이지를
   * 기준으로 셈하므로 이것만으로 충분하다.
   */
  const { rows: pageRows, page: shownPage, pageCount } = paginate(sorted, currentPage, perPage)

  const isLoading = state === 'loading'
  const isEmpty = !isLoading && (state === 'empty' || rows.length === 0)
  const bodyRows = isLoading || isEmpty ? [] : pageRows
  const pageIds = bodyRows.map(getRowId)
  const selectionState = pageSelectionState(currentSelected, pageIds)

  const columnCount = columns.length + (selectable ? 1 : 0)
  const selectedCount = currentSelected.size

  const rowLabelPrefix = React.useId()

  function clearSelection() {
    commitSelected(new Set())
  }

  /* 고를 것이 없으면 toolbar를 부르지 않는다 — 부르면 빈 막대가 자리를 차지한다 */
  const toolbarContent = toolbar && selectedCount > 0 ? toolbar({ selectedCount, clearSelection }) : null

  return (
    <div className="flex w-full flex-col gap-4">
      {toolbarContent ? (
        <div className="flex flex-wrap items-center gap-2">{toolbarContent}</div>
      ) : null}

      <Table label={label} density={density}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-0">
                {/*
                 * 이름이 '이 페이지'인 것은 실제로 이 페이지만 다루기 때문이다.
                 * 다른 페이지에서 고른 것은 건드리지 않으므로 '전체 선택'은
                 * 하지 않는 일을 말하는 이름이 된다.
                 */}
                <Checkbox
                  aria-label="이 페이지 전부 선택"
                  disabled={pageIds.length === 0}
                  checked={selectionState === 'some' ? 'indeterminate' : selectionState === 'all'}
                  onCheckedChange={() => commitSelected(toggleAllOnPage(currentSelected, pageIds))}
                />
              </TableHead>
            ) : null}
            {columns.map((column) => {
              /* 정렬할 수 있는 열은 sortValue가 있는 열이다. 그 판단은 lib이 이미 내렸다 */
              if (!column.sortValue) {
                return (
                  <TableHead key={column.id} numeric={column.numeric} sticky={column.sticky}>
                    {column.header}
                  </TableHead>
                )
              }
              return (
                <TableHead
                  key={column.id}
                  numeric={column.numeric}
                  sticky={column.sticky}
                  sortable
                  sortDirection={currentSort?.columnId === column.id ? currentSort.direction : false}
                  onClick={() => commitSort(nextSortState(currentSort, column.id))}
                >
                  {column.header}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        {/* 불러오는 중이든 비었든 머리는 남는다 — 표가 무엇을 담는지는 그때도 사실이다 */}
        <TableBody>
          {isLoading
            ? Array.from({ length: Math.max(1, Math.min(perPage, LOADING_ROWS)) }, (_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  {selectable ? (
                    <TableCell className="w-0">
                      <Skeleton className="size-4 rounded-sm" />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell key={column.id} sticky={column.sticky}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {isEmpty ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="whitespace-normal">
                {emptyContent ?? (
                  <EmptyState size="compact" className="mx-auto">
                    <EmptyStateIcon>
                      <Inbox aria-hidden />
                    </EmptyStateIcon>
                    <EmptyStateTitle>표시할 항목이 없습니다</EmptyStateTitle>
                  </EmptyState>
                )}
              </TableCell>
            </TableRow>
          ) : null}

          {bodyRows.map((row) => {
            const id = getRowId(row)
            /*
             * 행의 체크박스 이름은 첫 칸이 짓는다. DataTable은 행이 무엇인지
             * 모르므로(cell은 ReactNode를 돌려줄 뿐이다) 스스로 '홍길동 선택'
             * 같은 이름을 만들 수 없다. 첫 칸을 가리키면 화면에 보이는 그
             * 글자가 그대로 이름이 된다 — 모든 행이 '행 선택'으로 같아지는
             * 것보다 낫다.
             */
            const labelId = `${rowLabelPrefix}-${id}`
            return (
              <TableRow key={id} selected={currentSelected.has(id)}>
                {selectable ? (
                  <TableCell className="w-0">
                    <Checkbox
                      aria-labelledby={labelId}
                      checked={currentSelected.has(id)}
                      onCheckedChange={() => commitSelected(toggleRow(currentSelected, id))}
                    />
                  </TableCell>
                ) : null}
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    id={index === 0 ? labelId : undefined}
                    numeric={column.numeric}
                    sticky={column.sticky}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/*
       * 불러오는 중에는 페이지 줄을 두지 않는다. 아직 몇 건인지 모르는데
       * '전체 0건'이라고 적는 것은 자리표시가 아니라 틀린 말이다.
       */}
      {isLoading ? null : (
        <Pagination>
          <PaginationInfo>
            전체 {rows.length}건 · {perPage}건씩
          </PaginationInfo>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                disabled={shownPage <= 1}
                onClick={() => commitPage(shownPage - 1)}
              >
                이전
              </Button>
            </PaginationItem>
            {visiblePages(shownPage, pageCount).map((number) => (
              <PaginationItem key={number}>
                <Button
                  variant={number === shownPage ? 'outline' : 'ghost'}
                  size="sm"
                  aria-current={number === shownPage ? 'page' : undefined}
                  onClick={() => commitPage(number)}
                >
                  {number}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                disabled={shownPage >= pageCount}
                onClick={() => commitPage(shownPage + 1)}
              >
                다음
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
