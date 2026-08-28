import { useState, type ReactNode } from 'react'
import { SearchX } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/ui/empty-state'
import { categoryLabel, components, getComponent } from '@/data/registry'
import type { DataTableColumn, SortState } from '@/lib/data-table'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 예시의 행을 손으로 적지 않는다. 이 저장소의 components(@/data/registry)를
 * 그대로 행으로 쓴다 — ScrollAreaPage의 ComponentList·WideTable과 같은
 * 방식이다. 행 수도 칸의 내용도 데이터에서 파생되므로 컴포넌트가 늘거나
 * 버전이 바뀌어도 문서가 낡지 않는다.
 */
type Row = (typeof components)[number]

const rowId = (row: Row) => row.id

/**
 * 'v0.10.1'을 견줄 수 있는 수로 바꾼다.
 *
 * 버전을 글자로 견주면 v0.10.0이 v0.9.0보다 앞에 온다 — 화면에 보이는 값과
 * 정렬 기준이 갈라지는 자리다. cell과 sortValue를 따로 둔 이유가 이것이라,
 * 칸에는 'v0.10.1'을 그대로 보이고 견주기는 이 수로 한다.
 */
function versionOrder(version: string): number {
  const [major = 0, minor = 0, patch = 0] = version.replace(/^v/, '').split('.').map(Number)
  return major * 1_000_000 + minor * 1_000 + patch
}

const nameColumn: DataTableColumn<Row> = {
  id: 'name',
  header: '이름',
  cell: (row) => row.name,
  sortValue: (row) => row.name,
}

const categoryColumn: DataTableColumn<Row> = {
  id: 'category',
  header: '구분',
  cell: (row) => categoryLabel[row.category],
  sortValue: (row) => categoryLabel[row.category],
}

const addedColumn: DataTableColumn<Row> = {
  id: 'added',
  header: '도입',
  cell: (row) => row.addedIn,
  sortValue: (row) => versionOrder(row.addedIn),
}

/* sortValue가 없는 열이다 — 이 머리는 버튼이 되지 않는다. 정렬 가능 여부를 정하는 것은 이 함수의 유무뿐이다 */
const aliasColumn: DataTableColumn<Row> = {
  id: 'aliases',
  header: '다른 이름 수',
  numeric: true,
  cell: (row) => row.aliases.length,
}

/*
 * changedIn이 addedIn과 같으면 나온 뒤로 고친 적이 없다는 뜻이다. 그런 행은
 * 이 열에 보일 값이 없으므로 칸에는 —를 두고 sortValue는 null을 돌려준다 —
 * 값이 없는 행은 오름차순이든 내림차순이든 끝으로 간다.
 */
const changedColumn: DataTableColumn<Row> = {
  id: 'changed',
  header: '마지막 변경',
  cell: (row) =>
    row.changedIn === row.addedIn ? <span className="text-muted-foreground">—</span> : row.changedIn,
  sortValue: (row) => (row.changedIn === row.addedIn ? null : versionOrder(row.changedIn)),
}

/*
 * 위 열의 DON'T 짝. 값이 없는 행을 0으로 채웠다. 지침이 하지 말라고 적은
 * 그 모양이고, 오름차순으로 두면 —가 앞을 가득 채워 실제로 고쳐진 행이
 * 뒷장으로 밀려나는 결과가 화면에 그대로 나온다. 정렬 결과가 달라질 뿐
 * 포커스를 뺏거나 목차를 어지럽히지는 않으므로 따로 죽여 둘 것이 없다.
 */
const filledChangedColumn: DataTableColumn<Row> = {
  ...changedColumn,
  sortValue: (row) => (row.changedIn === row.addedIn ? 0 : versionOrder(row.changedIn)),
}

/** 좁은 화면에서 가로로 굴러야 하는 다섯 칸짜리 열 묶음. 첫 열은 고정한다 */
const wideColumns: DataTableColumn<Row>[] = [
  { ...nameColumn, sticky: true },
  categoryColumn,
  addedColumn,
  aliasColumn,
  changedColumn,
]

const axisColumns = [nameColumn, categoryColumn]
const axisRows = components.slice(0, 7)

/*
 * label은 필수 prop이고 표를 감싼 role="region"의 이름이 된다. 한 화면에
 * 표가 여럿이면 이름도 여럿이어야 하므로, 축 무대는 지금 그리고 있는 축의
 * 값을 그대로 이름에 넣는다 — 무대마다 이름이 갈리고, 그 이름이 이 무대가
 * 무엇을 보이는지도 함께 말한다.
 */
function renderDataTable(options: RenderOptions) {
  const density = options.density === 'default' ? 'default' : 'compact'
  const selection = options.selection ?? 'none'
  const state =
    options.state === 'loading' ? 'loading' : options.state === 'empty' ? 'empty' : 'default'

  return (
    <div className="w-full max-w-sm">
      <DataTable
        label={`밀도 ${density} · 선택 ${selection} · 상태 ${state}인 컴포넌트 목록`}
        columns={axisColumns}
        rows={axisRows}
        getRowId={rowId}
        density={density}
        selectable={selection === 'multiple'}
        state={state}
        perPage={3}
      />
    </div>
  )
}

/**
 * 선택을 상태로 들고 있는 표. 여러 예시가 이것을 함께 쓴다.
 *
 * 선택을 제어로 올린 것은 예시마다 다른 toolbar를 끼우고, 처음 몇 줄을 골라
 * 둔 채로 그릴 수 있게 하기 위해서다. 고르고 페이지를 넘겨 보면 개수가 그대로
 * 남는 것이 눈으로 확인된다.
 *
 * initialCount는 처음부터 골라 둘 행의 수다. DataTable은 고른 것이 없으면
 * toolbar를 아예 부르지 않으므로(toolbar && selectedCount > 0), 0으로 두면
 * 독자가 체크박스를 누르기 전까지 toolbar가 서지 않는다 — toolbar 자체를
 * 보여야 하는 예시는 여기에 수를 준다. AnatomyPreview가 같은 이유로 한 줄을
 * 골라 두고 시작한다.
 */
function SelectableExample({
  label,
  rows = components,
  perPage = 4,
  columns = axisColumns,
  initialCount = 0,
  toolbar,
}: {
  label: string
  rows?: readonly Row[]
  perPage?: number
  columns?: readonly DataTableColumn<Row>[]
  initialCount?: number
  toolbar: (context: { selectedCount: number; clearSelection: () => void }) => ReactNode
}) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(rows.slice(0, initialCount).map(rowId)),
  )

  return (
    <DataTable
      label={label}
      columns={columns}
      rows={rows}
      getRowId={rowId}
      selectable
      perPage={perPage}
      selected={selected}
      onSelectedChange={setSelected}
      toolbar={toolbar}
    />
  )
}

/**
 * 정렬을 제어로 들고 있는 표. 처음부터 한 열로 정렬해 둔 화면을 보여야 하는
 * 예시가 쓴다 — 정렬 머리는 그대로 눌리고, 누르면 이 상태가 따라간다.
 *
 * 페이지는 제어하지 않는다. 정렬을 바꾸면 DataTable이 스스로 1페이지로
 * 돌아가고, 그 되돌림은 제어하지 않은 내부 페이지에도 그대로 걸린다.
 */
function SortedExample({
  label,
  columns,
  initialSort,
  perPage = 5,
}: {
  label: string
  columns: readonly DataTableColumn<Row>[]
  initialSort: SortState
  perPage?: number
}) {
  const [sort, setSort] = useState<SortState>(initialSort)

  return (
    <DataTable
      label={label}
      columns={columns}
      rows={components}
      getRowId={rowId}
      perPage={perPage}
      sort={sort}
      onSortChange={setSort}
    />
  )
}

/**
 * 정렬과 페이지를 둘 다 부모가 쥔 표. sort-resets-to-first-page 지침의 DO다.
 *
 * DataTable은 정렬을 바꿀 때 onSortChange와 onPageChange(1)을 함께 내보낸다.
 * 이 예시는 둘 다 그대로 받아 자기 상태에 쓰므로, 뒷장에서 머리를 눌러도 위에
 * 적힌 페이지가 1로 따라간다 — 그 숫자는 부모가 들고 있는 page 상태를 그대로
 * 읽은 것이다.
 */
function ControlledSortExample() {
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-muted-foreground text-2xs">부모가 쥔 page: {page}</p>
      <DataTable
        label="정렬과 페이지를 부모가 함께 쥔 컴포넌트 목록"
        columns={axisColumns}
        rows={components}
        getRowId={rowId}
        perPage={4}
        sort={sort}
        onSortChange={setSort}
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    /*
     * 두 쪽 모두 같은 표이고 toolbar의 문구만 다르다. DON'T가 보이려는 결함이
     * 문구 자체이므로 그 문구를 그대로 그린다 — 글자일 뿐이라 포커스를 받지도,
     * 목차에 끼어들지도 않는다. 머리 체크박스의 이름('이 페이지 전부 선택')은
     * DataTable이 쥐고 있어 두 쪽이 같다.
     */
    case 'header-checkbox-means-this-page':
      return kind === 'do' ? (
        <SelectableExample
          label="선택한 개수를 전체 기준으로 보이는 컴포넌트 목록"
          perPage={3}
          initialCount={2}
          toolbar={({ selectedCount, clearSelection }) => (
            <>
              <span className="text-sm">{selectedCount}건 선택됨</span>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                선택 해제
              </Button>
            </>
          )}
        />
      ) : (
        <SelectableExample
          label="선택을 전체 선택이라고 잘못 적은 컴포넌트 목록"
          perPage={3}
          initialCount={2}
          toolbar={() => <span className="text-sm">전체 선택됨</span>}
        />
      )

    /*
     * DO만 그린다. 뒷장에서 정렬 머리를 눌러 위의 page가 1로 따라가는 것이
     * 이 지침이 말하는 모습이다. DON'T는 그리지 않는다 — 부모가 정렬과 함께
     * 오는 onPageChange(1)만 골라 무시하도록 짜야 나오는 화면이라, 문서에
     * 고장 난 표를 심는 일이 된다. 규칙은 옆의 문장이 그대로 말한다.
     */
    case 'sort-resets-to-first-page':
      return kind === 'do' ? <ControlledSortExample /> : null

    /*
     * 둘 다 '마지막 변경'으로 오름차순 정렬해 둔 표다. 값이 없는 행을 어떻게
     * 다루느냐만 다르다 — DO는 sortValue가 null이라 —가 끝으로 가고, DON'T는
     * 0으로 채워 —가 앞을 채운다. 실제로 고쳐진 컴포넌트는 다섯이라
     * DON'T에서는 그 다섯이 1페이지에서 사라진다.
     */
    case 'missing-value-sorts-last':
      return (
        <SortedExample
          label={
            kind === 'do'
              ? '값이 없는 칸을 —로 둔 컴포넌트 목록'
              : '값이 없는 칸을 0으로 채운 컴포넌트 목록'
          }
          columns={[nameColumn, kind === 'do' ? changedColumn : filledChangedColumn]}
          initialSort={{ columnId: 'changed', direction: 'asc' }}
          perPage={5}
        />
      )

    case 'sticky-select-cell-pins-with-columns':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <Bounds className="w-56">
            <DataTable
              label="선택 칸과 이름 열이 함께 고정된 컴포넌트 목록"
              columns={wideColumns}
              rows={components}
              getRowId={rowId}
              selectable
              perPage={3}
            />
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 화면 폭입니다. 가로로 굴러도 선택 칸과 이름 열이 왼쪽에 남습니다.
          </p>
        </div>
      ) : (
        /*
         * 선택 칸만 고정하지 않은 표는 DataTable로 만들 수 없다. 없는 화면을
         * 억지로 흉내 내는 대신 그 결과만 글로 짚는다 — ScrollAreaPage가
         * 크기 없는 ScrollArea를 그리지 않고 글로 짚은 것과 같은 자리다.
         */
        <div className="text-muted-foreground w-full max-w-64 rounded-lg border border-dashed p-4 text-xs">
          선택 칸을 고정하지 않으면 가로로 구르는 즉시 선택 칸이 왼쪽 밖으로
          밀려납니다. 체크박스가 손에 닿지 않게 되어, 왼쪽 끝까지 되굴러야만
          선택을 풀 수 있습니다.
        </div>
      )

    case 'loading-is-announced':
      return kind === 'do' ? (
        <DataTable
          label="불러오는 중인 컴포넌트 목록"
          columns={axisColumns}
          rows={components}
          getRowId={rowId}
          state="loading"
          perPage={3}
        />
      ) : (
        <div className="text-muted-foreground w-full max-w-64 rounded-lg border border-dashed p-4 text-xs">
          state를 쓰지 않고 뼈대만 손으로 깔면 화면에는 같아 보입니다. 그러나
          Skeleton은 스스로 aria-hidden이라, 화면 낭독기에는 아무 일도 일어나지
          않는 표로 들립니다.
        </div>
      )

    default:
      return null
  }
}

/*
 * 로그는 시간순으로 쌓인 자료가 그대로 오는 표다. 도입 버전이 늦은 것부터
 * 늘어놓아 그 모양을 만든다 — 글자가 아니라 versionOrder로 견주므로
 * v0.10.0이 v0.9.0 뒤에 서는 일이 없다.
 */
const logRows = [...components].sort((a, b) => versionOrder(b.addedIn) - versionOrder(a.addedIn))

function FilterExample() {
  const [query, setQuery] = useState('없는 이름')
  const rows = components.filter(
    (component) =>
      component.name.toLowerCase().includes(query.toLowerCase()) ||
      component.aliases.some((alias) => alias.includes(query)),
  )

  return (
    <div className="flex w-full flex-col gap-3">
      {/*
       * 조건을 글로만 적어 두면 '조건 지우기'를 한 번 누른 뒤 빈 결과로 돌아갈
       * 길이 없다. 실제 입력을 두어 두 화면을 오갈 수 있게 한다. label로 감싸
       * 이 입력의 이름이 '조건'이 된다.
       */}
      <label className="text-muted-foreground flex items-center gap-2 text-xs">
        조건
        <Input
          size="sm"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-40"
        />
      </label>
      <DataTable
        label="조건으로 거른 컴포넌트 목록"
        columns={axisColumns}
        rows={rows}
        getRowId={rowId}
        perPage={4}
        emptyContent={
          <EmptyState variant="no-results" size="compact" className="mx-auto">
            <EmptyStateIcon>
              <SearchX aria-hidden />
            </EmptyStateIcon>
            <EmptyStateTitle>조건에 맞는 항목이 없습니다</EmptyStateTitle>
            <EmptyStateAction>
              <Button variant="outline" size="sm" onClick={() => setQuery('')}>
                조건 지우기
              </Button>
            </EmptyStateAction>
          </EmptyState>
        }
      />
    </div>
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    /*
     * user-list·order-history에는 예시를 두지 않는다. 사람과 주문은 이
     * 저장소가 가진 자료가 아니라 손으로 지어내야 하는 자료이고, 손으로 적은
     * 행은 낡는다. 두 항목이 말하는 모양(Avatar·Badge·numeric 정렬)은 Table
     * 문서가 같은 이름의 예시로 이미 보이고 있다.
     */
    case 'log':
      return (
        <DataTable
          label="도입 버전이 늦은 것부터 늘어놓은 컴포넌트 로그"
          columns={[addedColumn, nameColumn, categoryColumn]}
          rows={logRows.slice(0, 24)}
          getRowId={rowId}
          density="compact"
          perPage={12}
        />
      )

    case 'bulk-selection':
      return (
        <SelectableExample
          label="대량 작업을 걸 컴포넌트 목록"
          rows={components.slice(0, 10)}
          perPage={4}
          initialCount={2}
          toolbar={({ selectedCount, clearSelection }) => (
            <>
              <span className="text-sm">{selectedCount}건 선택됨</span>
              <Button variant="outline" size="sm">
                내보내기
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                선택 해제
              </Button>
            </>
          )}
        />
      )

    /* rows가 비면 state를 따로 주지 않아도 빈 화면이 된다. 머리는 그대로 남는다 */
    case 'empty-list':
      return (
        <DataTable
          label="표시할 항목이 없는 컴포넌트 목록"
          columns={axisColumns}
          rows={[]}
          getRowId={rowId}
          perPage={4}
        />
      )

    case 'no-filter-results':
      return <FilterExample />

    case 'loading':
      return (
        <DataTable
          label="불러오는 중인 컴포넌트 목록 예시"
          columns={axisColumns}
          rows={components}
          getRowId={rowId}
          state="loading"
          perPage={4}
        />
      )

    case 'selection-across-pages':
      return (
        <div className="flex w-full flex-col gap-2">
          <SelectableExample
            label="페이지를 넘어가도 선택이 남는 컴포넌트 목록"
            perPage={3}
            toolbar={({ selectedCount, clearSelection }) => (
              <>
                <span className="text-sm">{selectedCount}건 선택됨</span>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  선택 해제
                </Button>
              </>
            )}
          />
          <p className="text-muted-foreground text-2xs">
            몇 줄 고르고 다음 페이지로 넘어가 보세요. 위의 개수는 그대로 남습니다.
          </p>
        </div>
      )

    case 'missing-value':
      return (
        <SortedExample
          label="고친 적 없는 행을 —로 둔 컴포넌트 목록"
          columns={[nameColumn, addedColumn, changedColumn]}
          initialSort={{ columnId: 'changed', direction: 'asc' }}
          perPage={5}
        />
      )

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <DataTable
              label="좁은 화면에서 가로로 구르는 컴포넌트 목록"
              columns={wideColumns}
              rows={components}
              getRowId={rowId}
              selectable
              perPage={3}
            />
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 화면 폭입니다. 표 안에서 가로로 구르고, 선택 칸과 이름 열은
            왼쪽에 고정됩니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대는 실제 DataTable 하나다.
 *
 * 지시선이 닿는 부위는 toolbar 하나뿐이다. 나머지 여섯은 DataTable이 스스로
 * 그리는 자리인데, 이 컴포넌트는 ...props를 퍼뜨리지 않고 열의 header도
 * 문자열이라 바깥에서 data-anatomy를 얹을 통로가 없다 — ScrollAreaPage가
 * Scrollbar·Thumb에 지시선을 그리지 않은 것과 같은 이유다. toolbar는 이
 * 페이지가 만들어 넘기는 노드라 그 통로가 열려 있다.
 *
 * 지시선이 없어도 아래 번호 목록이 일곱 부위를 모두 설명한다 — Anatomy가
 * 번호 목록을 기본 층으로 두고 지시선을 그 위에 얹는 구조라서다.
 *
 * 처음부터 한 줄을 골라 둔 것은 toolbar가 고른 것이 있을 때만 나타나기
 * 때문이다. 체크박스는 그대로 눌리고 선택도 따라 바뀐다.
 */
function AnatomyPreview() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set([components[0].id]),
  )

  return (
    <DataTable
      label="Anatomy 무대의 컴포넌트 목록"
      columns={axisColumns}
      rows={components.slice(0, 6)}
      getRowId={rowId}
      selectable
      perPage={3}
      selected={selected}
      onSelectedChange={setSelected}
      toolbar={({ selectedCount, clearSelection }) => (
        <div data-anatomy="toolbar" className="flex items-center gap-2">
          <span className="text-sm">{selectedCount}건 선택됨</span>
          <Button variant="outline" size="sm" onClick={clearSelection}>
            선택 해제
          </Button>
        </div>
      )}
    />
  )
}

export function DataTablePage() {
  const meta = getComponent('data-table')
  if (!meta) return <Placeholder title="Data Table 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderDataTable}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
