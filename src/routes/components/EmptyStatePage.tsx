import type { ReactNode } from 'react'
import { AlertTriangle, FileX, Inbox, Lock, SearchX, type LucideIcon } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  type EmptyStateSize,
  type EmptyStateVariant,
} from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * empty와 no-results는 아이콘 색이 같다(둘 다 오류가 아니다) — 구별은
 * 문구가 한다. 그래서 네 variant마다 아이콘 모양·제목·설명을 그
 * variant가 실제로 쓰이는 상황에 맞춰 다르게 준다. Properties 격자와
 * Playground가 이 render 하나를 함께 쓰므로, 두 곳 모두에서 네 칸이
 * 뜻으로 구별된다.
 */
const VARIANT_CONTENT: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string; actionLabel: string }
> = {
  empty: {
    icon: Inbox,
    title: '아직 등록된 상품이 없습니다',
    description: '새 상품을 추가해 판매를 시작하세요.',
    actionLabel: '상품 추가',
  },
  'no-results': {
    icon: SearchX,
    title: '검색 결과가 없습니다',
    description: '다른 검색어로 다시 시도하거나 필터를 초기화하세요.',
    actionLabel: '필터 초기화',
  },
  error: {
    icon: AlertTriangle,
    title: '데이터를 불러오지 못했습니다',
    description: '네트워크 상태를 확인하고 다시 시도하세요.',
    actionLabel: '다시 시도',
  },
  'no-permission': {
    icon: Lock,
    title: '이 페이지에 접근할 권한이 없습니다',
    description: '관리자에게 접근 권한을 요청하세요.',
    actionLabel: '권한 요청',
  },
}

function renderEmptyState(options: RenderOptions) {
  const variant = (options.variant ?? 'empty') as EmptyStateVariant
  const size = (options.size ?? 'default') as EmptyStateSize
  const content = VARIANT_CONTENT[variant]
  const Icon = content.icon

  return (
    <EmptyState variant={variant} size={size} className="w-full max-w-sm">
      <EmptyStateIcon>
        <Icon />
      </EmptyStateIcon>
      <EmptyStateTitle>{content.title}</EmptyStateTitle>
      <EmptyStateDescription>{content.description}</EmptyStateDescription>
      <EmptyStateAction>
        <Button size="sm">{content.actionLabel}</Button>
      </EmptyStateAction>
    </EmptyState>
  )
}

/*
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 EmptyState와
 * Table·Card·Input·Button 같은 기존 컴포넌트만으로 만든 어드민 화면의
 * 한 조각이다.
 */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'distinguish-empty-error':
      return kind === 'do' ? (
        <EmptyState variant="empty" size="compact" className="w-56">
          <EmptyStateIcon>
            <Inbox />
          </EmptyStateIcon>
          <EmptyStateTitle>아직 등록된 상품이 없습니다</EmptyStateTitle>
          <EmptyStateDescription>새 상품을 추가하세요.</EmptyStateDescription>
        </EmptyState>
      ) : (
        <EmptyState variant="error" size="compact" className="w-56">
          <EmptyStateIcon>
            <AlertTriangle />
          </EmptyStateIcon>
          <EmptyStateTitle>아직 등록된 상품이 없습니다</EmptyStateTitle>
          <EmptyStateDescription>새 상품을 추가하세요.</EmptyStateDescription>
        </EmptyState>
      )

    case 'action-when-possible':
      return kind === 'do' ? (
        <EmptyState variant="empty" size="compact" className="w-56">
          <EmptyStateIcon>
            <Inbox />
          </EmptyStateIcon>
          <EmptyStateTitle>아직 등록된 상품이 없습니다</EmptyStateTitle>
          <EmptyStateDescription>새 상품을 추가하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="sm">상품 추가</Button>
          </EmptyStateAction>
        </EmptyState>
      ) : (
        <EmptyState variant="no-permission" size="compact" className="w-56">
          <EmptyStateIcon>
            <Lock />
          </EmptyStateIcon>
          <EmptyStateTitle>접근 권한이 없습니다</EmptyStateTitle>
          <EmptyStateDescription>관리자에게 권한을 요청하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="sm">새로 만들기</Button>
          </EmptyStateAction>
        </EmptyState>
      )

    case 'first-visit-not-error':
      return kind === 'do' ? (
        <EmptyState variant="empty" size="compact" className="w-56">
          <EmptyStateIcon>
            <Inbox />
          </EmptyStateIcon>
          <EmptyStateTitle>첫 프로젝트를 만들어 보세요</EmptyStateTitle>
          <EmptyStateDescription>아직 만든 프로젝트가 없습니다.</EmptyStateDescription>
        </EmptyState>
      ) : (
        <EmptyState variant="error" size="compact" className="w-56">
          <EmptyStateIcon>
            <AlertTriangle />
          </EmptyStateIcon>
          <EmptyStateTitle>첫 프로젝트를 만들어 보세요</EmptyStateTitle>
          <EmptyStateDescription>아직 만든 프로젝트가 없습니다.</EmptyStateDescription>
        </EmptyState>
      )

    case 'writing-order':
      return kind === 'do' ? (
        <EmptyState variant="no-results" size="compact" className="w-60">
          <EmptyStateIcon>
            <SearchX />
          </EmptyStateIcon>
          <EmptyStateTitle>검색 결과가 없습니다</EmptyStateTitle>
          <EmptyStateDescription>다른 검색어로 다시 시도하세요.</EmptyStateDescription>
        </EmptyState>
      ) : (
        <EmptyState variant="no-results" size="compact" className="w-60">
          <EmptyStateIcon>
            <SearchX />
          </EmptyStateIcon>
          <EmptyStateTitle>다른 검색어로 다시 시도하세요</EmptyStateTitle>
          <EmptyStateDescription>검색 결과가 없습니다.</EmptyStateDescription>
        </EmptyState>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'empty-table':
      return (
        <Table label="상품 목록">
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead numeric>재고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-auto hover:bg-transparent">
              <TableCell colSpan={2} className="h-auto py-2">
                <EmptyState variant="empty" size="compact">
                  <EmptyStateIcon>
                    <Inbox />
                  </EmptyStateIcon>
                  <EmptyStateTitle>아직 등록된 상품이 없습니다</EmptyStateTitle>
                  <EmptyStateDescription>새 상품을 추가해 판매를 시작하세요.</EmptyStateDescription>
                  <EmptyStateAction>
                    <Button size="sm">상품 추가</Button>
                  </EmptyStateAction>
                </EmptyState>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'no-search-results':
      return (
        <div className="flex w-72 flex-col gap-3">
          <Input defaultValue="무선 키보드 프로" readOnly />
          <EmptyState variant="no-results" size="compact">
            <EmptyStateIcon>
              <SearchX />
            </EmptyStateIcon>
            <EmptyStateTitle>검색 결과가 없습니다</EmptyStateTitle>
            <EmptyStateDescription>다른 검색어로 다시 시도하거나 필터를 초기화하세요.</EmptyStateDescription>
            <EmptyStateAction>
              <Button variant="outline" size="sm">
                필터 초기화
              </Button>
            </EmptyStateAction>
          </EmptyState>
        </div>
      )

    case 'permission-wall':
      return (
        <Card variant="outlined" className="w-72">
          <CardContent>
            <EmptyState variant="no-permission">
              <EmptyStateIcon>
                <Lock />
              </EmptyStateIcon>
              <EmptyStateTitle>이 페이지에 접근할 권한이 없습니다</EmptyStateTitle>
              <EmptyStateDescription>관리자에게 접근 권한을 요청하세요.</EmptyStateDescription>
              <EmptyStateAction>
                <Button size="sm">권한 요청</Button>
              </EmptyStateAction>
            </EmptyState>
          </CardContent>
        </Card>
      )

    case 'load-failed':
      return (
        <Card variant="outlined" className="w-72">
          <CardContent>
            <EmptyState variant="error">
              <EmptyStateIcon>
                <AlertTriangle />
              </EmptyStateIcon>
              <EmptyStateTitle>데이터를 불러오지 못했습니다</EmptyStateTitle>
              <EmptyStateDescription>네트워크 상태를 확인하고 다시 시도하세요.</EmptyStateDescription>
              <EmptyStateAction>
                <Button variant="outline" size="sm">
                  다시 시도
                </Button>
              </EmptyStateAction>
            </EmptyState>
          </CardContent>
        </Card>
      )

    case 'no-action':
      return (
        <EmptyState variant="empty" className="w-64">
          <EmptyStateIcon>
            <FileX />
          </EmptyStateIcon>
          <EmptyStateTitle>보관된 항목입니다</EmptyStateTitle>
          <EmptyStateDescription>보관된 항목에는 새로 추가할 수 없습니다.</EmptyStateDescription>
        </EmptyState>
      )

    case 'in-table':
      return (
        <Table label="검색 결과">
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-auto hover:bg-transparent">
              <TableCell colSpan={2} className="h-auto py-2">
                <EmptyState variant="no-results" size="compact">
                  <EmptyStateIcon>
                    <SearchX />
                  </EmptyStateIcon>
                  <EmptyStateTitle>검색 결과가 없습니다</EmptyStateTitle>
                  <EmptyStateDescription>다른 검색어로 다시 시도하세요.</EmptyStateDescription>
                </EmptyState>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'two-actions':
      return (
        <EmptyState variant="empty" className="w-72">
          <EmptyStateIcon>
            <Inbox />
          </EmptyStateIcon>
          <EmptyStateTitle>가져올 데이터가 없습니다</EmptyStateTitle>
          <EmptyStateDescription>CSV로 가져오거나 하나씩 직접 추가하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="sm">CSV 업로드</Button>
            <Button variant="outline" size="sm">
              수동으로 추가
            </Button>
          </EmptyStateAction>
        </EmptyState>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <EmptyState variant="empty">
            <EmptyStateIcon>
              <Inbox />
            </EmptyStateIcon>
            <EmptyStateTitle>아직 등록된 상품이 없습니다</EmptyStateTitle>
            <EmptyStateDescription>새 상품을 추가해 판매를 시작하세요.</EmptyStateDescription>
            <EmptyStateAction>
              <Button size="sm">상품 추가</Button>
            </EmptyStateAction>
          </EmptyState>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Action은 선택 부위이지만 다른
 * 부위와 함께 보일 수 있는 상태(둘 다 존재할 수 있음)이지 서로 배타적인
 * 상태가 아니므로 이 인스턴스에 함께 둔다.
 */
function AnatomyPreview() {
  return (
    <EmptyState data-anatomy="container" variant="empty" className="w-72">
      <EmptyStateIcon data-anatomy="icon">
        <Inbox />
      </EmptyStateIcon>
      <EmptyStateTitle data-anatomy="title">아직 등록된 상품이 없습니다</EmptyStateTitle>
      <EmptyStateDescription data-anatomy="description">
        새 상품을 추가해 판매를 시작하세요.
      </EmptyStateDescription>
      <EmptyStateAction data-anatomy="action">
        <Button size="sm">상품 추가</Button>
      </EmptyStateAction>
    </EmptyState>
  )
}

export function EmptyStatePage() {
  const meta = getComponent('empty-state')
  if (!meta) return <Placeholder title="Empty State 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderEmptyState}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
