import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DescriptionDetail,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from '@/components/ui/description-list'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type DescriptionListLayout = NonNullable<ComponentProps<typeof DescriptionList>['layout']>
type DescriptionListColumns = NonNullable<ComponentProps<typeof DescriptionList>['columns']>

function renderDescriptionList(options: RenderOptions) {
  const layout = (options.layout ?? 'stacked') as DescriptionListLayout
  const columns = (options.columns ?? 'one') as DescriptionListColumns

  return (
    <DescriptionList layout={layout} columns={columns} className="w-80">
      <DescriptionItem>
        <DescriptionTerm>이름</DescriptionTerm>
        <DescriptionDetail>홍길동</DescriptionDetail>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>이메일</DescriptionTerm>
        <DescriptionDetail>hong@example.com</DescriptionDetail>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>가입일</DescriptionTerm>
        <DescriptionDetail>2026-01-15</DescriptionDetail>
      </DescriptionItem>
    </DescriptionList>
  )
}

/*
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 DescriptionList와
 * Card·Dialog·Table 같은 기존 컴포넌트만으로 만든 어드민 화면의
 * 한 조각이다.
 */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'short-labels':
      return kind === 'do' ? (
        <DescriptionList layout="horizontal" columns="one" className="w-64">
          <DescriptionItem>
            <DescriptionTerm>이메일</DescriptionTerm>
            <DescriptionDetail>hong@example.com</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      ) : (
        <DescriptionList layout="horizontal" columns="one" className="w-64">
          <DescriptionItem>
            <DescriptionTerm>사용자가 등록한 이메일 주소</DescriptionTerm>
            <DescriptionDetail>hong@example.com</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      )

    case 'no-empty-value':
      return kind === 'do' ? (
        <DescriptionList layout="stacked" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>전화번호</DescriptionTerm>
            <DescriptionDetail>—</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      ) : (
        <DescriptionList layout="stacked" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>전화번호</DescriptionTerm>
            <DescriptionDetail />
          </DescriptionItem>
        </DescriptionList>
      )

    case 'meaningful-order':
      return kind === 'do' ? (
        <DescriptionList layout="horizontal" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>상태</DescriptionTerm>
            <DescriptionDetail>
              <Badge variant="success">활성</Badge>
            </DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>이름</DescriptionTerm>
            <DescriptionDetail>홍길동</DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>생성일</DescriptionTerm>
            <DescriptionDetail>2026-01-15</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      ) : (
        <DescriptionList layout="horizontal" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>id</DescriptionTerm>
            <DescriptionDetail>10482</DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>created_at</DescriptionTerm>
            <DescriptionDetail>2026-01-15</DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>이름</DescriptionTerm>
            <DescriptionDetail>홍길동</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'detail-basic-info':
      return (
        <Card variant="outlined" className="w-80">
          <CardHeader>
            <CardTitle>홍길동</CardTitle>
            <CardDescription>고객 상세</CardDescription>
          </CardHeader>
          <CardContent>
            <DescriptionList layout="horizontal" columns="two">
              <DescriptionItem>
                <DescriptionTerm>이메일</DescriptionTerm>
                <DescriptionDetail>hong@example.com</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>가입일</DescriptionTerm>
                <DescriptionDetail>2026-01-15</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>상태</DescriptionTerm>
                <DescriptionDetail>
                  <Badge variant="success">활성</Badge>
                </DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>등급</DescriptionTerm>
                <DescriptionDetail>VIP</DescriptionDetail>
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      )

    case 'dialog-confirmation':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다. 아래 정보를 확인하세요.</DialogDescription>
            </DialogHeader>
            <DescriptionList layout="horizontal" columns="one">
              <DescriptionItem>
                <DescriptionTerm>이메일</DescriptionTerm>
                <DescriptionDetail>hong@example.com</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>가입일</DescriptionTerm>
                <DescriptionDetail>2026-01-15</DescriptionDetail>
              </DescriptionItem>
            </DescriptionList>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'card-summary':
      return (
        <Card variant="outlined" className="w-64">
          <CardContent>
            <DescriptionList layout="stacked" columns="two">
              <DescriptionItem>
                <DescriptionTerm>활성 사용자</DescriptionTerm>
                <DescriptionDetail>128명</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>신규 가입</DescriptionTerm>
                <DescriptionDetail>12명</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>처리 대기</DescriptionTerm>
                <DescriptionDetail>4건</DescriptionDetail>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>오류</DescriptionTerm>
                <DescriptionDetail>0건</DescriptionDetail>
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      )

    case 'table-expanded-row':
      return (
        <Table label="최근 주문">
          <TableHeader>
            <TableRow>
              <TableHead>주문 번호</TableHead>
              <TableHead numeric>금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>20260824-001</TableCell>
              <TableCell numeric>32,000원</TableCell>
            </TableRow>
            <TableRow className="h-auto hover:bg-transparent">
              <TableCell colSpan={2} className="h-auto py-4 whitespace-normal">
                <DescriptionList layout="horizontal" columns="two">
                  <DescriptionItem>
                    <DescriptionTerm>주문자</DescriptionTerm>
                    <DescriptionDetail>홍길동</DescriptionDetail>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>결제 수단</DescriptionTerm>
                    <DescriptionDetail>비자 ****1234</DescriptionDetail>
                  </DescriptionItem>
                </DescriptionList>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'very-long-value':
      return (
        <DescriptionList layout="stacked" columns="one" className="w-64">
          <DescriptionItem>
            <DescriptionTerm>메모</DescriptionTerm>
            <DescriptionDetail>
              배송지가 변경되어 기존 송장을 취소하고 새 송장을 다시 발급했습니다. 고객에게 안내 문자를 다시 보냈습니다.
            </DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      )

    case 'no-value':
      return (
        <DescriptionList layout="horizontal" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>이메일</DescriptionTerm>
            <DescriptionDetail>hong@example.com</DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>전화번호</DescriptionTerm>
            <DescriptionDetail>—</DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      )

    case 'badge-value':
      return (
        <DescriptionList layout="horizontal" columns="one" className="w-56">
          <DescriptionItem>
            <DescriptionTerm>상태</DescriptionTerm>
            <DescriptionDetail>
              <Badge variant="success">활성</Badge>
            </DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <DescriptionList layout="horizontal" columns="three">
            <DescriptionItem>
              <DescriptionTerm>이름</DescriptionTerm>
              <DescriptionDetail>홍길동</DescriptionDetail>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>등급</DescriptionTerm>
              <DescriptionDetail>VIP</DescriptionDetail>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>상태</DescriptionTerm>
              <DescriptionDetail>활성</DescriptionDetail>
            </DescriptionItem>
          </DescriptionList>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. 항목을 둘 두어 목록이라는 것을
 * 보이되, 지시선은 첫 항목의 Term·Detail에만 건다 — 나머지 항목은
 * 구조가 반복된다는 것을 보여줄 뿐이라 표를 붙이지 않는다.
 */
function AnatomyPreview() {
  return (
    <DescriptionList data-anatomy="container" layout="horizontal" columns="one" className="w-72">
      <DescriptionItem data-anatomy="item">
        <DescriptionTerm data-anatomy="term">이메일</DescriptionTerm>
        <DescriptionDetail data-anatomy="detail">hong@example.com</DescriptionDetail>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>가입일</DescriptionTerm>
        <DescriptionDetail>2026-01-15</DescriptionDetail>
      </DescriptionItem>
    </DescriptionList>
  )
}

export function DescriptionListPage() {
  const meta = getComponent('description-list')
  if (!meta) return <Placeholder title="Description List 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderDescriptionList}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
