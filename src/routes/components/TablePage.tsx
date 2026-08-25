import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination, PaginationContent, PaginationInfo, PaginationItem } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderTable(options: RenderOptions) {
  const density = (options.density ?? 'default') as 'default' | 'compact'
  const state = options.state ?? 'default'
  return (
    <Table density={density} className="w-72">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead numeric>주문</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected={state === 'selected'}>
          <TableCell>홍길동</TableCell>
          <TableCell numeric>12</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Table과 이미 있는
 * Badge·Checkbox·Avatar·Pagination만으로 만든 어드민 화면의 한
 * 조각이다. 토큰이 바뀌면 예시도 따라 바뀌므로 문서가 실제와 어긋나지
 * 않는다.
 * ------------------------------------------------------------------ */

/** horizontal-scroll-fixed-column · narrow-screen이 공유하는 일곱 칸짜리 넓은 행 */
function WideRow({ sticky }: { sticky: boolean }) {
  return (
    <TableRow>
      <TableCell sticky={sticky}>홍길동</TableCell>
      <TableCell>hong@example.com</TableCell>
      <TableCell>
        <Badge variant="success">활성</Badge>
      </TableCell>
      <TableCell>2024-03-02</TableCell>
      <TableCell>10분 전</TableCell>
      <TableCell>김서연</TableCell>
      <TableCell numeric>12</TableCell>
    </TableRow>
  )
}

function WideHeader({ sticky }: { sticky: boolean }) {
  return (
    <TableRow>
      <TableHead sticky={sticky}>이름</TableHead>
      <TableHead>이메일</TableHead>
      <TableHead>상태</TableHead>
      <TableHead>가입일</TableHead>
      <TableHead>최근 로그인</TableHead>
      <TableHead>담당자</TableHead>
      <TableHead numeric>주문 수</TableHead>
    </TableRow>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'numeric-align':
      return (
        <Table className="w-56">
          <TableHeader>
            <TableRow>
              <TableHead>상품</TableHead>
              <TableHead numeric={kind === 'do'}>금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>키보드</TableCell>
              <TableCell numeric={kind === 'do'}>89,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>마우스</TableCell>
              <TableCell numeric={kind === 'do'}>3,200</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'clickable-row-affordance':
      return (
        <Table className="w-56">
          <TableBody>
            <TableRow className="cursor-pointer">
              <TableCell>주문 20260824-001</TableCell>
              {kind === 'do' && (
                <TableCell className="w-6">
                  <ChevronRight size={14} className="text-muted-foreground" aria-hidden />
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'horizontal-scroll-fixed-column':
      return (
        <div className="w-64">
          <Table>
            <TableHeader>
              <WideHeader sticky={kind === 'do'} />
            </TableHeader>
            <TableBody>
              <WideRow sticky={kind === 'do'} />
            </TableBody>
          </Table>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'user-list':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: '홍길동', email: 'hong@example.com', variant: 'success' as const, label: '활성' },
              { name: '김서연', email: 'seoyeon@example.com', variant: 'warning' as const, label: '정지 예정' },
            ].map((user) => (
              <TableRow key={user.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.variant}>{user.label}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    case 'order-history':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>상품</TableHead>
              <TableHead numeric>금액</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>20260824-001</TableCell>
              <TableCell>기계식 키보드</TableCell>
              <TableCell numeric>89,000</TableCell>
              <TableCell>
                <Badge variant="success">결제 완료</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>20260823-014</TableCell>
              <TableCell>무선 마우스</TableCell>
              <TableCell numeric>32,000</TableCell>
              <TableCell>
                <Badge variant="warning">배송 준비</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'log':
      return (
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>시간</TableHead>
              <TableHead>이벤트</TableHead>
              <TableHead>사용자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { time: '09:12:03', event: '로그인', user: '홍길동' },
              { time: '09:14:41', event: '설정 변경', user: '김서연' },
              { time: '09:20:07', event: '로그아웃', user: '홍길동' },
            ].map((row) => (
              <TableRow key={row.time}>
                <TableCell className="text-muted-foreground">{row.time}</TableCell>
                <TableCell>{row.event}</TableCell>
                <TableCell>{row.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    case 'bulk-selection':
      return (
        <div className="flex flex-col gap-3">
          <div className="bg-surface flex items-center gap-3 rounded-md border px-3 py-2">
            <span className="text-sm">2건 선택됨</span>
            <Button variant="outline" size="sm">
              선택 삭제
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead sticky className="w-10">
                  <Checkbox checked="indeterminate" aria-label="전체 선택" />
                </TableHead>
                <TableHead sticky>이름</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow selected>
                <TableCell sticky>
                  <Checkbox defaultChecked aria-label="'홍길동' 선택" />
                </TableCell>
                <TableCell sticky>홍길동</TableCell>
                <TableCell>
                  <Avatar size="sm">
                    <AvatarFallback>김</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Badge variant="success">활성</Badge>
                </TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell sticky>
                  <Checkbox defaultChecked aria-label="'김서연' 선택" />
                </TableCell>
                <TableCell sticky>김서연</TableCell>
                <TableCell>
                  <Avatar size="sm">
                    <AvatarFallback>박</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Badge variant="warning">정지 예정</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sticky>
                  <Checkbox aria-label="'이서준' 선택" />
                </TableCell>
                <TableCell sticky>이서준</TableCell>
                <TableCell>
                  <Avatar size="sm">
                    <AvatarFallback>김</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">초안</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination>
            <PaginationInfo>총 24개</PaginationInfo>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                이전
              </Button>
              <PaginationContent>
                <PaginationItem>
                  <Button variant="default" size="sm" aria-current="page">
                    1
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="ghost" size="sm">
                    2
                  </Button>
                </PaginationItem>
              </PaginationContent>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </Pagination>
        </div>
      )

    case 'empty-list':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-muted-foreground py-8 text-center">
                표시할 항목이 없습니다
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'loading':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2].map((row) => (
              <TableRow key={row} className="hover:bg-transparent">
                <TableCell>
                  <span aria-hidden className="bg-muted block h-4 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <span aria-hidden className="bg-muted block h-4 w-28 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <span aria-hidden className="bg-muted block h-4 w-12 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    case 'missing-value':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>담당자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>홍길동</TableCell>
              <TableCell>김서연</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>이서준</TableCell>
              <TableCell>
                <span className="text-muted-foreground" aria-label="담당자 없음">
                  —
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <Table>
              <TableHeader>
                <WideHeader sticky />
              </TableHeader>
              <TableBody>
                <WideRow sticky />
              </TableBody>
            </Table>
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 화면 폭입니다. 표 안에서 가로로 스크롤되고 첫 열은 고정됩니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대는 인스턴스 하나다. header·row·cell·select-cell(선택)·
 * sort-indicator(선택)가 한 표 안에 함께 있다 — '빈 상태'는 행이 있는
 * 이 인스턴스와 함께 보일 수 없으므로 여기 없다(registry의 state 설명
 * 참고). sticky는 이 무대에서 켜지 않는다 — 가로 스크롤이 없는 좁은
 * 무대에서는 아무 시각 차이도 남기지 않고, 그 효과는 Guidelines·
 * Cases에서 실제로 스크롤해 확인한다.
 */
function AnatomyPreview() {
  return (
    <Table className="w-80">
      <TableHeader>
        <TableRow data-anatomy="header">
          <TableHead className="w-10">
            <Checkbox aria-label="전체 선택" />
          </TableHead>
          <TableHead>
            <button type="button" className="inline-flex items-center gap-1">
              이름
              <ChevronDown data-anatomy="sort-indicator" size={12} aria-hidden />
            </button>
          </TableHead>
          <TableHead numeric>주문</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-anatomy="row">
          <TableCell data-anatomy="select-cell">
            <Checkbox aria-label="'홍길동' 선택" />
          </TableCell>
          <TableCell data-anatomy="cell">홍길동</TableCell>
          <TableCell numeric>12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="'김서연' 선택" />
          </TableCell>
          <TableCell>김서연</TableCell>
          <TableCell numeric>4</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export function TablePage() {
  const meta = getComponent('table')
  if (!meta) return <Placeholder title="Table 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderTable}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
