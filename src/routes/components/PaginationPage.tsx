import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationInfo,
  PaginationItem,
} from '@/components/ui/pagination'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 전체 개수·페이지당 개수·페이지 수는 예시 안에서 서로 어긋나지 않는다.
 * 47개를 10개씩 나누면 5페이지다.
 */
const TOTAL_ITEMS = 47
const PER_PAGE = 10
const TOTAL_PAGES = 5

function currentPageFor(state: string): number {
  if (state === 'first-page') return 1
  if (state === 'last-page') return TOTAL_PAGES
  return 3
}

function PageButton({ page, current }: { page: number; current: number }) {
  return (
    <PaginationItem>
      <Button
        variant={page === current ? 'default' : 'ghost'}
        size="sm"
        aria-current={page === current ? 'page' : undefined}
      >
        {page}
      </Button>
    </PaginationItem>
  )
}

function renderPagination(options: RenderOptions) {
  const { variant, state } = options
  const current = currentPageFor(state)
  const prevDisabled = current === 1
  const nextDisabled = current === TOTAL_PAGES

  return (
    <Pagination className="w-full max-w-md">
      <div className="flex items-center gap-3">
        <PaginationInfo>총 {TOTAL_ITEMS}개</PaginationInfo>
        <PaginationInfo>페이지당 {PER_PAGE}개</PaginationInfo>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={prevDisabled}>
          <ChevronLeft aria-hidden /> 이전
        </Button>
        {variant === 'simple' ? (
          <PaginationInfo>
            {current} / {TOTAL_PAGES} 페이지
          </PaginationInfo>
        ) : (
          <PaginationContent>
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
              <PageButton key={page} page={page} current={current} />
            ))}
          </PaginationContent>
        )}
        <Button variant="outline" size="sm" disabled={nextDisabled}>
          다음 <ChevronRight aria-hidden />
        </Button>
      </div>
    </Pagination>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Pagination과 Button,
 * 시스템 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면
 * 예시도 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

/** Alert의 inside-list, Badge의 many-in-row가 쓰던 것과 같은 자리표시용 목록 */
function MiniList({ rows }: { rows: string[] }) {
  return (
    <div className="bg-surface w-72 divide-y overflow-hidden rounded-md border">
      {rows.map((row) => (
        <div key={row} className="flex h-row-compact items-center px-3 text-14">
          {row}
        </div>
      ))}
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'show-total-count':
      return (
        <Pagination className="w-64">
          {kind === 'do' && <PaginationInfo>총 24개</PaginationInfo>}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              이전
            </Button>
            <PaginationContent>
              <PageButton page={1} current={2} />
              <PageButton page={2} current={2} />
              <PageButton page={3} current={2} />
            </PaginationContent>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </Pagination>
      )

    case 'disable-edge-buttons':
      return (
        <Pagination className="w-64">
          <PaginationInfo>총 24개</PaginationInfo>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={kind === 'do'}>
              이전
            </Button>
            <PaginationContent>
              <PageButton page={1} current={1} />
              <PageButton page={2} current={1} />
              <PageButton page={3} current={1} />
            </PaginationContent>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </Pagination>
      )

    case 'hide-single-page':
      return kind === 'do' ? (
        <MiniList rows={['항목 A', '항목 B']} />
      ) : (
        <div className="flex w-72 flex-col gap-2">
          <MiniList rows={['항목 A', '항목 B']} />
          <Pagination>
            <PaginationInfo>총 2개</PaginationInfo>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <PaginationContent>
                <PageButton page={1} current={1} />
              </PaginationContent>
              <Button variant="outline" size="sm" disabled>
                다음
              </Button>
            </div>
          </Pagination>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'below-table':
      return (
        <div className="flex w-72 flex-col gap-3">
          <MiniList rows={['홍길동', '김서연']} />
          <Pagination>
            <PaginationInfo>총 24개</PaginationInfo>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                이전
              </Button>
              <PaginationContent>
                <PageButton page={1} current={1} />
                <PageButton page={2} current={1} />
                <PageButton page={3} current={1} />
              </PaginationContent>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </Pagination>
        </div>
      )

    case 'below-card-list':
      return (
        <div className="flex w-72 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {['프로젝트 A', '프로젝트 B'].map((name) => (
              <div key={name} className="bg-surface rounded-md border p-3 text-16">
                {name}
              </div>
            ))}
          </div>
          <Pagination>
            <PaginationInfo>총 12개</PaginationInfo>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                이전
              </Button>
              <PaginationContent>
                <PageButton page={1} current={1} />
                <PageButton page={2} current={1} />
              </PaginationContent>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </Pagination>
        </div>
      )

    case 'log':
      return (
        <Pagination className="w-64">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              이전
            </Button>
            <PaginationInfo>3 / 5 페이지</PaginationInfo>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </Pagination>
      )

    case 'search-result':
      return (
        <Pagination className="w-64">
          <PaginationInfo>검색 결과 47건</PaginationInfo>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              이전
            </Button>
            <PaginationContent>
              <PageButton page={1} current={1} />
              <PageButton page={2} current={1} />
            </PaginationContent>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </Pagination>
      )

    case 'unknown-total':
      return (
        <Pagination className="w-48">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              <ChevronLeft aria-hidden /> 이전
            </Button>
            <Button variant="outline" size="sm">
              다음 <ChevronRight aria-hidden />
            </Button>
          </div>
        </Pagination>
      )

    case 'many-pages':
      return (
        <Pagination className="w-72">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              이전
            </Button>
            <PaginationContent>
              <PageButton page={1} current={12} />
              <PageButton page={2} current={12} />
              <li aria-hidden className="text-muted-foreground px-1 text-16">
                …
              </li>
              <PageButton page={24} current={12} />
              <PageButton page={25} current={12} />
            </PaginationContent>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </Pagination>
      )

    case 'no-results':
      return (
        <div className="flex w-72 flex-col items-center gap-1 rounded-md border border-dashed py-8">
          <p className="text-muted-foreground text-16">표시할 항목이 없습니다</p>
        </div>
      )

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <Pagination>
              <PaginationInfo>총 47개</PaginationInfo>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">
                  이전
                </Button>
                <PaginationContent>
                  <PageButton page={1} current={1} />
                  <PageButton page={2} current={1} />
                </PaginationContent>
                <Button variant="outline" size="sm">
                  다음
                </Button>
              </div>
            </Pagination>
          </Bounds>
          <p className="text-muted-foreground text-11">
            점선은 컨테이너 폭입니다. 자리가 부족하면 다음 줄로 넘어갑니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

export function PaginationPage() {
  const meta = getComponent('pagination')
  if (!meta) return <Placeholder title="Pagination 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderPagination}
      preview={
        <Pagination className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <PaginationInfo data-anatomy="total-count">총 {TOTAL_ITEMS}개</PaginationInfo>
            <PaginationInfo data-anatomy="per-page">페이지당 {PER_PAGE}개</PaginationInfo>
          </div>
          <div className="flex items-center gap-1">
            <Button data-anatomy="previous" variant="outline" size="sm">
              <ChevronLeft aria-hidden /> 이전
            </Button>
            <PaginationContent data-anatomy="page-numbers">
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                <PageButton key={page} page={page} current={3} />
              ))}
            </PaginationContent>
            <Button data-anatomy="next" variant="outline" size="sm">
              다음 <ChevronRight aria-hidden />
            </Button>
          </div>
        </Pagination>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
