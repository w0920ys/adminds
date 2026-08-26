import type { ReactNode } from 'react'
import { Download, Inbox, Plus, Search, SearchX } from 'lucide-react'
import { PatternPage } from '@/components/docs/PatternPage'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationInfo, PaginationItem } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

type Row = { name: string; email: string; status: '활성' | '정지'; owner: string; joinedAt: string }

const ROWS: Row[] = [
  { name: '홍길동', email: 'hong@example.com', status: '활성', owner: '김서연', joinedAt: '2024-03-02' },
  { name: '김민수', email: 'kim@example.com', status: '활성', owner: '김서연', joinedAt: '2024-03-11' },
  { name: '이수진', email: 'lee@example.com', status: '정지', owner: '박지호', joinedAt: '2024-04-08' },
]

const TABLE_COLUMNS = 6

function ScreenHeader() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">회원</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>사용자</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-xl font-semibold tracking-tight">사용자</h4>
        <Button size="sm">
          <Plus aria-hidden />
          사용자 추가
        </Button>
      </div>
    </div>
  )
}

/** 필터의 검색어 입력. 아이콘은 InputPage의 search-box와 같은 방식으로 얹는다 */
function SearchField() {
  return (
    <div className="relative w-48">
      <Search
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
      />
      <Input size="sm" className="pl-8" placeholder="이름이나 이메일" aria-label="사용자 검색" />
    </div>
  )
}

function StatusSelect() {
  return (
    <Select>
      <SelectTrigger size="sm" className="w-32" aria-label="상태로 거르기">
        <SelectValue placeholder="상태" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">전체</SelectItem>
        <SelectItem value="active">활성</SelectItem>
        <SelectItem value="suspended">정지</SelectItem>
      </SelectContent>
    </Select>
  )
}

function FilterRow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField />
      <StatusSelect />
      <p className="text-muted-foreground ml-auto text-sm">{ROWS.length}건</p>
    </div>
  )
}

/** filter-above-table의 dont: 조건만 있고 결과 수가 없다 */
function FilterRowWithoutCount() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField />
      <StatusSelect />
    </div>
  )
}

/** bulk-bar-in-place의 do: 필터 줄 자리를 대량 작업 줄이 그대로 차지한다 */
function BulkBarInPlace() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-sm font-medium">3건 선택됨</p>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          상태 변경
        </Button>
        <Button variant="outline" size="sm">
          내보내기
        </Button>
      </div>
    </div>
  )
}

/** bulk-bar-in-place의 dont: 필터 줄을 남긴 채 대량 작업 줄을 새로 끼워 넣는다 */
function BulkBarStacked() {
  return (
    <div className="flex flex-col gap-2">
      <FilterRow />
      <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
        <p className="text-sm font-medium">3건 선택됨</p>
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
      <h4 className="text-xl font-semibold tracking-tight">사용자</h4>
      <div className="flex items-center gap-2">
        <Button size="sm" variant={filled === 2 ? 'default' : 'outline'}>
          <Download aria-hidden />
          내보내기
        </Button>
        <Button size="sm">
          <Plus aria-hidden />
          사용자 추가
        </Button>
      </div>
    </div>
  )
}

function UserTableHeader() {
  return (
    <TableRow>
      <TableHead className="w-10">
        <Checkbox aria-label="모두 선택" />
      </TableHead>
      <TableHead>이름</TableHead>
      <TableHead>이메일</TableHead>
      <TableHead>상태</TableHead>
      <TableHead>담당자</TableHead>
      <TableHead>가입일</TableHead>
    </TableRow>
  )
}

function UserTable() {
  return (
    <Table label="사용자 목록">
      <TableHeader>
        <UserTableHeader />
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.email}>
            <TableCell>
              <Checkbox aria-label={`${row.name} 선택`} />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Badge variant={row.status === '활성' ? 'success' : 'neutral'}>{row.status}</Badge>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{row.owner.slice(0, 1)}</AvatarFallback>
                </Avatar>
                {row.owner}
              </span>
            </TableCell>
            <TableCell>{row.joinedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ListExample() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader />
      <FilterRow />
      <UserTable />
      <Pagination>
        <PaginationInfo>전체 {ROWS.length}건 · 20건씩</PaginationInfo>
        <PaginationContent>
          <PaginationItem>
            <Button variant="ghost" size="sm" disabled>
              이전
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="outline" size="sm" aria-current="page">
              1
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" size="sm">
              다음
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

/** empty·no-filter-results 공통: 표의 머리는 남기고 몸에 EmptyState를 둔다 */
function EmptyTable({ variant }: { variant: 'empty' | 'no-results' }) {
  const content =
    variant === 'empty'
      ? {
          Icon: Inbox,
          title: '아직 등록된 사용자가 없습니다',
          description: '사용자를 추가해 목록을 채워 보세요.',
          actionLabel: '사용자 추가',
        }
      : {
          Icon: SearchX,
          title: '검색 결과가 없습니다',
          description: '다른 검색어를 입력하거나 필터를 초기화하세요.',
          actionLabel: '필터 초기화',
        }
  const { Icon } = content

  return (
    <div className="flex flex-col gap-4">
      {variant === 'no-results' && <FilterRow />}
      <Table label="사용자 목록">
        <TableHeader>
          <UserTableHeader />
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={TABLE_COLUMNS} className="whitespace-normal">
              <EmptyState variant={variant} size="compact" className="mx-auto">
                <EmptyStateIcon>
                  <Icon aria-hidden />
                </EmptyStateIcon>
                <EmptyStateTitle>{content.title}</EmptyStateTitle>
                <EmptyStateDescription>{content.description}</EmptyStateDescription>
                <EmptyStateAction>
                  <Button size="sm">{content.actionLabel}</Button>
                </EmptyStateAction>
              </EmptyState>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

/** loading: 행 자리를 Skeleton으로 잡아 표가 튀지 않게 한다 */
function LoadingTable() {
  return (
    <Table label="불러오는 중인 사용자 목록">
      <TableHeader>
        <UserTableHeader />
      </TableHeader>
      <TableBody>
        {[0, 1, 2].map((row) => (
          <TableRow key={row} className="hover:bg-transparent">
            <TableCell>
              <Skeleton className="size-4 rounded-sm" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-12" />
            </TableCell>
            <TableCell>
              <Skeleton shape="circle" className="size-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** selection-across-pages: 선택 개수가 필터 줄 자리에, 페이지를 넘어가도 그대로 보인다 */
function SelectionAcrossPages() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">전체 5건 선택됨</p>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            상태 변경
          </Button>
        </div>
      </div>
      <Table label="사용자 목록">
        <TableHeader>
          <UserTableHeader />
        </TableHeader>
        <TableBody>
          {ROWS.map((row, index) => (
            <TableRow key={row.email} selected={index === 0}>
              <TableCell>
                <Checkbox aria-label={`${row.name} 선택`} defaultChecked={index === 0} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Badge variant={row.status === '활성' ? 'success' : 'neutral'}>{row.status}</Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{row.owner.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  {row.owner}
                </span>
              </TableCell>
              <TableCell>{row.joinedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationInfo>선택 5건 · 2페이지 보는 중</PaginationInfo>
        <PaginationContent>
          <PaginationItem>
            <Button variant="ghost" size="sm">
              이전
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="outline" size="sm" aria-current="page">
              2
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" size="sm">
              다음
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

/** narrow-screen: 좁은 폭 상자 안에 같은 조각을 넣는다. 폭은 max-w-xs로 잡는다 */
function NarrowScreen() {
  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-xs rounded-md border border-dashed p-3">
        <div className="flex flex-col gap-4">
          <ScreenHeader />
          <FilterRow />
          <UserTable />
        </div>
      </div>
      <p className="text-muted-foreground text-2xs">
        점선은 화면 폭입니다. 제목 줄과 필터 줄은 세로로 쌓이고, 표는 안에서 가로로 스크롤됩니다.
      </p>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'filter-above-table':
      // do: 필터와 결과 수가 표 위 한 줄에. dont: 결과 수 없이 필터만.
      return kind === 'do' ? <FilterRow /> : <FilterRowWithoutCount />
    case 'bulk-bar-in-place':
      // do: 필터 줄 자리를 대량 작업 줄이 대신 차지한다. dont: 줄을 하나 더 끼워 넣는다.
      return kind === 'do' ? <BulkBarInPlace /> : <BulkBarStacked />
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
      return <EmptyTable variant="empty" />
    case 'no-filter-results':
      return <EmptyTable variant="no-results" />
    case 'loading':
      return <LoadingTable />
    case 'selection-across-pages':
      return <SelectionAcrossPages />
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
      example={<ListExample />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
