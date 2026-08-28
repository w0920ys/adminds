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
   * DataTable도 그것을 모르므로 같은 이유로 여기서도 필수다. 기본값을 두면
   * 한 화면의 표 둘이 같은 이름의 랜드마크가 되어, 이름을 요구한 목적이
   * 오류 하나 없이 조용히 없어진다.
   */
  label: string
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
  label,
}: DataTableProps<T>): ReactNode {
  const [internalSort, setInternalSort] = React.useState<SortState>(null)
  const [internalPage, setInternalPage] = React.useState(1)
  const [internalSelected, setInternalSelected] = React.useState<ReadonlySet<string>>(() => new Set())

  const currentSort = sort !== undefined ? sort : internalSort
  const currentPage = page !== undefined ? page : internalPage
  const currentSelected = selected !== undefined ? selected : internalSelected

  /*
   * 정렬을 바꾸면 페이지도 1로 돌린다. 3페이지에서 '이름 오름차순'을 누른
   * 사람이 보는 것은 가나다순 맨 끝 두 줄이지 맨 앞이 아니다 — 정렬 머리를
   * 누르는 행위의 뜻은 '이 기준으로 맨 위가 무엇인지'다. 마지막 페이지의
   * 행이 정렬 전후로 우연히 같으면 aria-sort만 바뀌고 아무 일도 없어 보인다.
   * 제어일 때도 onPageChange(1)이 함께 나가야 부모가 따라올 수 있다.
   */
  function commitSort(next: SortState) {
    if (sort === undefined) setInternalSort(next)
    onSortChange?.(next)
    commitPage(1)
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
   * onPageChange를 부르는 일이 되기 때문이다. 이전·다음·번호·aria-current가
   * 모두 shownPage를 기준으로 셈하므로 다음 클릭에는 이것으로 충분하다.
   * 되쓰지 않은 내부 페이지는 그대로 살아 있다 — 행이 줄었다 다시 늘면
   * 사용자가 누른 적 없는 그 페이지로 돌아간다.
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
  const selectLabelId = React.useId()

  /*
   * 선택 칸과 sticky 열이 함께 있으면 선택 칸도 함께 고정한다.
   *
   * 고정하지 않으면 선택 칸은 static이라 가로로 구르는 즉시 왼쪽 밖으로
   * 나가고(scrollLeft 200에서 left −199), sticky 열이 방금 비운 그 자리에
   * 붙는다. 겹쳐 보이는 것이 아니라 체크박스가 화면에서 사라져 다시 닿을
   * 수 없게 된다 — 왼쪽 끝까지 되굴러야 선택을 풀 수 있다. 그런데 sticky
   * 첫 열은 table.tsx가 좁은 화면을 위해 둔 것이므로, 굴러갈 것을 전제한
   * 자리에서 선택이 못 쓰게 되는 셈이다.
   *
   * 그래서 선택 칸은 left-0에, sticky 열은 선택 칸 폭만큼 오른쪽에 세운다.
   * 두 값이 같은 토큰(--spacing-control-lg)에서 나오므로 서로 어긋날 수
   * 없다. 선택 칸의 좌우 패딩을 지우고 폭을 그 토큰으로 못 박는 것도 같은
   * 이유다 — 폭이 패딩과 체크박스 크기의 합으로 정해지면 토큰과 갈라진다.
   * 폭은 w-0과 min-w를 함께 준다. table-layout이 auto라 둘의 역할이 다르다
   * — min-w가 40px을 아래에서 받치고, w-0이 '남는 폭을 더 가져가지 않는다'는
   * 뜻을 낸다. min-w만 두면 표가 그릇보다 좁을 때 이 칸이 남는 폭을 나눠
   * 받아 210px까지 벌어진다(재어 보고 골랐다). 40px 안에서 16px 체크박스를
   * 가운데 두므로 보이는 모습은 px-3일 때와 같다.
   */
  const stickySelect = selectable && columns.some((column) => column.sticky)
  const selectCellClassName = 'w-0 min-w-control-lg px-0 text-center'
  const stickyColumnOffset = selectable ? 'left-control-lg' : undefined

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

      {/*
       * 불러오는 중이라는 사실을 소리로도 전한다. Skeleton은 스스로
       * aria-hidden이라(skeleton.tsx) 접근성 트리에서는 아무 일도 일어나지
       * 않는 표로 들린다 — 그 문구를 두는 것이 부르는 쪽의 일이라고 그
       * 컴포넌트가 적어 두었고, 여기가 state를 쥐고 있는 자리다.
       * SkeletonPage의 announce-via-text 예시와 같은 문구를 쓴다.
       *
       * 상자는 늘 두고 안의 글자만 바꾼다. 불러올 때 region 자체를 새로
       * 끼우면 스크린 리더가 그 변화를 놓칠 수 있다. sr-only는 화면에서만
       * 감추므로(position: absolute) flex의 gap도 벌리지 않는다.
       */}
      <div role="status" className="sr-only">
        {isLoading ? '불러오는 중입니다' : ''}
      </div>

      {/* 행 체크박스의 이름 뒤에 이어 붙일 문구. 표 안에는 span을 둘 자리가 없다 */}
      {selectable ? (
        <span id={selectLabelId} className="sr-only">
          행 선택
        </span>
      ) : null}

      <Table label={label} density={density}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead sticky={stickySelect} className={selectCellClassName}>
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
              /* 정렬할 수 있는 열은 sortValue가 있는 열이다. 그 규칙은 lib이 정했다 */
              if (!column.sortValue) {
                return (
                  <TableHead
                    key={column.id}
                    numeric={column.numeric}
                    sticky={column.sticky}
                    className={column.sticky ? stickyColumnOffset : undefined}
                  >
                    {column.header}
                  </TableHead>
                )
              }
              return (
                <TableHead
                  key={column.id}
                  numeric={column.numeric}
                  sticky={column.sticky}
                  className={column.sticky ? stickyColumnOffset : undefined}
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
                    <TableCell sticky={stickySelect} className={selectCellClassName}>
                      <Skeleton className="mx-auto size-4 rounded-sm" />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sticky={column.sticky}
                      className={column.sticky ? stickyColumnOffset : undefined}
                    >
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
             * 행의 체크박스 이름은 첫 칸과 숨긴 '행 선택'이 함께 짓는다.
             * DataTable은 행이 무엇인지 모르므로(cell은 ReactNode를 돌려줄
             * 뿐이다) 스스로 '홍길동 선택' 같은 이름을 만들 수 없다. 첫 칸을
             * 가리키면 화면에 보이는 그 글자가 이름에 들어와 행마다 달라진다.
             *
             * 다만 첫 칸이 글자를 돌려주지 않는 표가 흔하다 — 아바타·아이콘·
             * Badge가 첫 칸인 어드민 표에서는 그 참조가 빈 이름이 되고, 그것은
             * 모든 행이 '행 선택'으로 같은 것보다 나쁘다(이름 없는 컨트롤이
             * 된다). 그래서 숨긴 문구의 id를 뒤에 잇는다 — 앞의 참조가 비면
             * 그 조각만 빠져 '행 선택'이 남고, 글자가 있으면 '가나다 행 선택'이
             * 된다. Slider가 aria-labelledby 뒤에 위치 이름을 잇는 것과 같다.
             *
             * id는 encodeURIComponent로 감싼다. aria-labelledby는 공백으로
             * 토큰을 가르므로 getRowId가 공백을 담은 값을 돌려주면 참조가
             * 쪼개진다. 인코딩은 서로 다른 id를 서로 다르게 남긴다.
             */
            const labelId = `${rowLabelPrefix}-${encodeURIComponent(id)}`
            return (
              <TableRow key={id} selected={currentSelected.has(id)}>
                {selectable ? (
                  <TableCell sticky={stickySelect} className={selectCellClassName}>
                    <Checkbox
                      aria-labelledby={`${labelId} ${selectLabelId}`}
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
                    className={column.sticky ? stickyColumnOffset : undefined}
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
       * 불러오는 중에는 페이지 줄의 내용을 그리지 않는다. 불러오는 중의
       * rows.length는 최종 건수가 아니므로 '전체 0건'도 '전체 12건'도 곧
       * 틀린 말이 된다. 대신 자리는 비워 둔다 — 뼈대 행이 표가 튀지 않게
       * 잡아 두는데 footer가 통째로 사라지면 다 불러온 순간 그만큼 튄다.
       * 높이는 그 자리에 설 sm 버튼과 같은 토큰이다.
       */}
      {isLoading ? (
        <div className="h-control-sm" aria-hidden />
      ) : (
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
