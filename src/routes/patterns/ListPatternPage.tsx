import { useMemo, useState, type ReactNode } from 'react'
import { Download, Inbox, Plus, Search, SearchX } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { PatternPage } from '@/components/docs/PatternPage'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPattern } from '@/data/patterns'
import { categoryLabel, categoryOrder, components, type ComponentStatus } from '@/data/registry'
import type { DataTableColumn } from '@/lib/data-table'
import { versionOrder } from '@/lib/version'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 행을 손으로 적지 않는다. 이 저장소의 components(@/data/registry)를 그대로
 * 목록의 자료로 쓴다 — ScrollAreaPage·DataTablePage가 먼저 그렇게 했다.
 * 덕분에 행이 마흔둘이라 페이지가 여러 장이 되고, '선택 상태에서 페이지
 * 이동'을 글이 아니라 실제로 눌러서 볼 수 있다.
 */
type Row = (typeof components)[number]

const rowId = (row: Row) => row.id

/** 빈 목록. 매번 새 배열을 만들면 DataTable의 정렬 memo가 헛돈다 */
const NO_ROWS: Row[] = []

const STATUS_LABEL: Record<ComponentStatus, string> = {
  draft: '초안',
  review: '검토 중',
  stable: '안정',
  deprecated: '폐기 예정',
}

const STATUS_VARIANT: Record<ComponentStatus, 'neutral' | 'warning' | 'success' | 'destructive'> = {
  draft: 'neutral',
  review: 'warning',
  stable: 'success',
  deprecated: 'destructive',
}

/*
 * 정렬할 수 있는 열은 sortValue를 가진 열뿐이다. '상태'를 뺀 셋에 두었다.
 *
 * '상태'에만 두지 않은 것은 지금 마흔두 행이 모두 stable이라 견줄 것이
 * 없어서다 — 머리를 눌러도 순서가 그대로인 열은 고장으로 읽힌다.
 *
 * '도입'은 versionOrder로 견준다. 버전을 글자로 견주면 v0.10.0이 v0.9.0
 * 앞에 서므로, 칸에는 'v0.9.0'을 그대로 보이고 견주기는 수로 한다 — cell과
 * sortValue가 나뉘어 있는 이유가 이 자리다. 도입 버전은 어드민 목록에서
 * 독자가 가장 먼저 눌러 볼 머리 가운데 하나다.
 */
const COLUMNS: DataTableColumn<Row>[] = [
  { id: 'name', header: '이름', cell: (row) => row.name, sortValue: (row) => row.name },
  {
    id: 'category',
    header: '구분',
    cell: (row) => categoryLabel[row.category],
    sortValue: (row) => categoryLabel[row.category],
  },
  {
    id: 'status',
    header: '상태',
    cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  {
    id: 'added',
    header: '도입',
    cell: (row) => row.addedIn,
    sortValue: (row) => versionOrder(row.addedIn),
  },
]

/*
 * 아래 Breadcrumb 첫 칸의 href가 '#'인 것은 의도다. BreadcrumbPage는 asChild에
 * react-router Link를 넣지만, 여기 Example은 어드민 화면 하나를 통째로 흉내낸
 * 목업이라 그 칸이 가리킬 곳이 이 사이트에 없다. 이 칸만 Link로 바꾸면 목업에서
 * 유일하게 문서 밖으로 나가는 자리가 되고, 그 끝이 없는 페이지다. 없는 곳을
 * 가리키느니 아무 데도 가지 않는 편이 낫다.
 */
function ScreenHeader() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">디자인 시스템</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>컴포넌트</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-24 font-semibold tracking-tight">컴포넌트</h4>
        <Button size="sm">
          <Plus aria-hidden />
          컴포넌트 추가
        </Button>
      </div>
    </div>
  )
}

type ListFilter = {
  query: string
  setQuery: (value: string) => void
  category: string
  setCategory: (value: string) => void
  rows: Row[]
  reset: () => void
}

/**
 * 필터 줄이 실제로 표를 좁히게 한다.
 *
 * 조건을 글로만 적어 두면 '결과 수를 함께 보인다'는 지침이 화면에서 참인지
 * 확인할 길이 없고, '필터 결과 없음'에서 조건을 지우고 돌아올 길도 없다.
 */
function useListFilter(initialQuery = ''): ListFilter {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('all')

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return components.filter((component) => {
      if (category !== 'all' && component.category !== category) return false
      if (!needle) return true
      return (
        component.name.toLowerCase().includes(needle) ||
        component.aliases.some((alias) => alias.toLowerCase().includes(needle))
      )
    })
  }, [query, category])

  function reset() {
    setQuery('')
    setCategory('all')
  }

  return { query, setQuery, category, setCategory, rows, reset }
}

/** 필터의 검색어 입력. 아이콘은 InputPage의 search-box와 같은 방식으로 얹는다 */
function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-48">
      <Search
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
      />
      <Input
        size="sm"
        className="pl-8"
        placeholder="이름이나 다른 이름"
        aria-label="컴포넌트 검색"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function CategorySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-32" aria-label="구분으로 거르기">
        <SelectValue placeholder="구분" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">전체</SelectItem>
        {categoryOrder.map((category) => (
          <SelectItem key={category} value={category}>
            {categoryLabel[category]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** filter-above-table의 do: 조건과 결과 수가 표 위 한 줄에 함께 온다 */
function FilterRow({ filter, showCount = true }: { filter: ListFilter; showCount?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField value={filter.query} onChange={filter.setQuery} />
      <CategorySelect value={filter.category} onChange={filter.setCategory} />
      {showCount && <p className="text-muted-foreground ml-auto text-16">{filter.rows.length}건</p>}
    </div>
  )
}

/**
 * 조건에 걸리는 것이 없을 때 표 몸에 서는 안내.
 *
 * 필터가 실제로 표를 좁히는 화면이라면 어디서든 이 자리에 닿을 수 있다 —
 * no-filter-results 케이스만이 아니라 Example에서도 걸리지 않는 말을 치면
 * 곧바로 여기다. DataTable의 기본 빈 상태('표시할 항목이 없습니다')를 그냥
 * 두면 그 화면에서 조건을 지울 길이 없어, cases가 적은 '조건을 지우는 길을
 * 함께 준다'가 그 자리에서 거짓이 된다. 그래서 필터를 쥔 화면은 모두 이것을
 * 넘긴다.
 */
function FilterEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState variant="no-results" size="compact" className="mx-auto">
      <EmptyStateIcon>
        <SearchX aria-hidden />
      </EmptyStateIcon>
      <EmptyStateTitle>조건에 맞는 컴포넌트가 없습니다</EmptyStateTitle>
      <EmptyStateDescription>다른 검색어를 넣거나 조건을 지우세요.</EmptyStateDescription>
      <EmptyStateAction>
        <Button size="sm" onClick={onReset}>
          필터 초기화
        </Button>
      </EmptyStateAction>
    </EmptyState>
  )
}

/** 지침 예시용. 조건을 쳐 보면 결과 수가 따라 움직이는 쪽과 아무것도 없는 쪽이 갈린다 */
function FilterRowExample({ showCount }: { showCount: boolean }) {
  const filter = useListFilter()
  return <FilterRow filter={filter} showCount={showCount} />
}

/**
 * 대량 작업 줄. 필터 줄이 서던 자리를 그대로 차지한다.
 *
 * DataTable에도 toolbar 자리가 있지만 이 줄을 거기 두지 않았다. 화면이
 * 달라져서가 아니다 — ListScreen은 선택이 있으면 필터 줄을 아예 그리지
 * 않으므로 toolbar로 옮겨도 줄이 둘로 늘지 않고, ListScreen도 DataTable도
 * flex flex-col gap-4라 표 위 한 줄이 서는 자리와 간격도 같다.
 *
 * 두지 않은 이유는 소유에 있다. 이 줄과 필터 줄은 자리를 맞바꾸는 사이라,
 * 어느 쪽을 세울지 정하는 조건(선택 유무)을 쥔 쪽이 두 줄을 함께 쥐어야
 * 한 규칙이 두 파일로 쪼개지지 않는다. 그리고 patterns.ts의 structure가
 * '대량 작업 줄'을 패턴의 자리로 세고 있으니, 그 자리의 위치를 DataTable이
 * 정하게 두면 문서가 자기 것이라 적은 자리의 소유가 갈린다.
 */
function BulkBar({ count, onClear }: { count: number; onClear?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-16 font-medium">{count}건 선택됨</p>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          상태 변경
        </Button>
        <Button variant="outline" size="sm">
          <Download aria-hidden />
          내보내기
        </Button>
        {onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            선택 해제
          </Button>
        )}
      </div>
    </div>
  )
}

/** bulk-bar-in-place의 dont: 필터 줄을 남긴 채 대량 작업 줄을 새로 끼워 넣는다 */
function BulkBarStacked() {
  const filter = useListFilter()
  return (
    <div className="flex flex-col gap-2">
      <FilterRow filter={filter} />
      <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
        <p className="text-16 font-medium">3건 선택됨</p>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            상태 변경
          </Button>
        </div>
      </div>
    </div>
  )
}

/** single-primary-action: filled === 1은 채운 버튼 하나 + outline 하나, filled === 2는 채운 버튼 둘 */
function ActionRow({ filled }: { filled: 1 | 2 }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="text-24 font-semibold tracking-tight">컴포넌트</h4>
      <div className="flex items-center gap-2">
        <Button size="sm" variant={filled === 2 ? 'default' : 'outline'}>
          <Download aria-hidden />
          내보내기
        </Button>
        <Button size="sm">
          <Plus aria-hidden />
          컴포넌트 추가
        </Button>
      </div>
    </div>
  )
}

/**
 * 목록 화면 한 벌. Example과 두 Case가 같은 것을 쓴다.
 *
 * 선택을 여기서 쥐는 이유는 두 가지다. 선택이 있을 때 필터 줄 자리를
 * 대량 작업 줄로 바꿔야 하고(bulk-bar-in-place), 그 개수는 지금 페이지가
 * 아니라 선택 전체를 세야 하기 때문이다 — DataTable이 선택을 페이지 너머로
 * 들고 있으므로 페이지를 넘겨도 이 수는 그대로다.
 *
 * initialSelected는 처음부터 골라 둘 행의 수다. 0이면 독자가 체크박스를
 * 누르기 전까지 대량 작업 줄이 서지 않으므로, 그 줄부터 보여야 하는
 * 예시에만 수를 준다.
 */
function ListScreen({
  label,
  perPage = 5,
  initialSelected = 0,
  showHeader = true,
}: {
  label: string
  perPage?: number
  initialSelected?: number
  showHeader?: boolean
}) {
  const filter = useListFilter()
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(components.slice(0, initialSelected).map(rowId)),
  )

  return (
    <div className="flex flex-col gap-4">
      {showHeader && <ScreenHeader />}
      {selected.size > 0 ? (
        <BulkBar count={selected.size} onClear={() => setSelected(new Set())} />
      ) : (
        <FilterRow filter={filter} />
      )}
      <DataTable
        label={label}
        columns={COLUMNS}
        rows={filter.rows}
        getRowId={rowId}
        selectable
        perPage={perPage}
        selected={selected}
        onSelectedChange={setSelected}
        emptyContent={<FilterEmptyState onReset={filter.reset} />}
      />
    </div>
  )
}

/** empty: 아직 아무것도 없는 목록. 표의 머리는 남고 몸에 안내가 온다 */
function EmptyScreen() {
  return (
    <DataTable
      label="아직 항목이 없는 컴포넌트 목록"
      columns={COLUMNS}
      rows={NO_ROWS}
      getRowId={rowId}
      selectable
      emptyContent={
        <EmptyState variant="empty" size="compact" className="mx-auto">
          <EmptyStateIcon>
            <Inbox aria-hidden />
          </EmptyStateIcon>
          <EmptyStateTitle>아직 등록된 컴포넌트가 없습니다</EmptyStateTitle>
          <EmptyStateDescription>컴포넌트를 추가해 목록을 채워 보세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="sm">
              <Plus aria-hidden />
              컴포넌트 추가
            </Button>
          </EmptyStateAction>
        </EmptyState>
      }
    />
  )
}

/**
 * no-filter-results: 조건이 너무 좁을 때.
 *
 * 처음 조건을 아무것도 걸리지 않는 말로 두어 빈 화면부터 보이고, '필터
 * 초기화'가 실제로 그 조건을 지운다 — 누르면 마흔두 행이 돌아온다.
 * 조건을 지우는 길을 준다는 말이 글이 아니라 버튼으로 서 있어야 한다.
 */
function NoResultsScreen() {
  const filter = useListFilter('없는 이름')

  return (
    <div className="flex flex-col gap-4">
      <FilterRow filter={filter} />
      <DataTable
        label="조건으로 거른 컴포넌트 목록"
        columns={COLUMNS}
        rows={filter.rows}
        getRowId={rowId}
        selectable
        emptyContent={<FilterEmptyState onReset={filter.reset} />}
      />
    </div>
  )
}

/** narrow-screen: 좁은 폭 상자 안에 같은 조각을 넣는다 */
function NarrowScreen() {
  return (
    <div className="flex flex-col gap-2">
      <Bounds className="max-w-xs p-3">
        <ListScreen label="좁은 화면의 컴포넌트 목록" perPage={3} />
      </Bounds>
      <p className="text-muted-foreground text-11">
        점선은 화면 폭입니다. 필터 줄은 세로로 쌓이고, 표는 안에서 가로로 스크롤됩니다. 제목 줄은
        폭이 남는 동안 한 줄에 머뭅니다.
      </p>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'filter-above-table':
      // do: 필터와 결과 수가 표 위 한 줄에. dont: 결과 수 없이 필터만.
      return <FilterRowExample showCount={kind === 'do'} />
    case 'bulk-bar-in-place':
      // do: 필터 줄 자리를 대량 작업 줄이 대신 차지한다. dont: 줄을 하나 더 끼워 넣는다.
      return kind === 'do' ? <BulkBar count={3} /> : <BulkBarStacked />
    case 'single-primary-action':
      // do: 채운 버튼 하나 + outline 하나. dont: 채운 버튼 둘.
      return <ActionRow filled={kind === 'do' ? 1 : 2} />
    default:
      return null
  }
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'empty':
      return <EmptyScreen />
    case 'no-filter-results':
      return <NoResultsScreen />
    case 'loading':
      /* 뼈대 행은 DataTable이 깐다. 그래야 '불러오는 중입니다'가 소리로도 나간다 */
      return (
        <DataTable
          label="불러오는 중인 컴포넌트 목록"
          columns={COLUMNS}
          rows={components}
          getRowId={rowId}
          selectable
          state="loading"
          perPage={3}
        />
      )
    case 'selection-across-pages':
      return (
        <ListScreen
          label="선택을 유지한 채 페이지를 넘기는 컴포넌트 목록"
          perPage={4}
          initialSelected={2}
          showHeader={false}
        />
      )
    case 'narrow-screen':
      return <NarrowScreen />
    default:
      return null
  }
}

export function ListPatternPage() {
  const meta = getPattern('list')
  if (!meta) return <Placeholder title="List 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<ListScreen label="컴포넌트 목록" />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
