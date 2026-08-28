import type { ComponentProps, ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type CardVariant = NonNullable<ComponentProps<typeof Card>['variant']>
type CardPaddingValue = NonNullable<ComponentProps<typeof Card>['padding']>

/** 여러 예시가 함께 쓰는 '최근 주문' 표. 표 안에 표가 있는 카드를 반복해 만들지 않는다 */
function RecentOrdersTable() {
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
        <TableRow>
          <TableCell>20260823-014</TableCell>
          <TableCell numeric>18,500원</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

function renderCard(options: RenderOptions) {
  const variant = (options.variant ?? 'outlined') as CardVariant
  const padding = (options.padding ?? 'default') as CardPaddingValue

  if (padding === 'none') {
    return (
      <Card variant={variant} padding={padding} className="w-72">
        <CardHeader>
          <CardTitle>최근 주문</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant={variant} padding={padding} className="w-72">
      <CardHeader>
        <CardTitle>워크스페이스 사용량</CardTitle>
        <CardDescription>이번 달 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-32 font-bold">128 / 200</p>
      </CardContent>
    </Card>
  )
}

/*
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Card와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'no-card-in-card':
      return kind === 'do' ? (
        <Card variant="outlined" className="w-64">
          <CardContent className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium">일반</p>
              <p className="text-muted-foreground text-12">계정 정보를 관리합니다</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">보안</p>
              <p className="text-muted-foreground text-12">비밀번호와 인증을 관리합니다</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined" className="w-64">
          <CardContent>
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>보안</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-12">비밀번호와 인증을 관리합니다</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )

    case 'no-whole-card-link':
      return kind === 'do' ? (
        <Card variant="outlined" className="w-64">
          <CardHeader>
            <CardTitle>
              <Button asChild variant="link" className="h-auto p-0 text-sm font-semibold">
                <a href="#payment-method">결제 수단</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm">
            <span>비자 ****1234</span>
            <Button size="sm" variant="outline">
              삭제
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined" className="hover:bg-accent/50 w-64 cursor-pointer">
          <CardHeader>
            <CardTitle>결제 수단</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm">
            <span>비자 ****1234</span>
            <Button size="sm" variant="outline">
              삭제
            </Button>
          </CardContent>
        </Card>
      )

    case 'no-padding-with-table':
      return kind === 'do' ? (
        <Card variant="outlined" padding="none" className="w-72">
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable />
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined" padding="default" className="w-72">
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable />
          </CardContent>
        </Card>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'dashboard-metric':
      return (
        <Card variant="elevated" className="w-72">
          <CardHeader>
            <CardTitle>이번 달 매출</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-32 font-bold">₩12,480,000</p>
            <p className="text-success-on-tint text-12">전월 대비 +8.2%</p>
          </CardContent>
        </Card>
      )

    case 'detail-section':
      return (
        <Card variant="outlined" className="w-72">
          <CardHeader>
            <CardTitle>홍길동</CardTitle>
            <CardDescription>고객 상세</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">이메일</span>
              <span>hong@example.com</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">가입일</span>
              <span>2026-01-15</span>
            </div>
          </CardContent>
        </Card>
      )

    case 'settings-group':
      return (
        <Card variant="outlined" className="w-72">
          <CardHeader>
            <CardTitle>알림</CardTitle>
            <CardDescription>이메일과 문자로 알림을 받습니다</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span>이메일 알림</span>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span>문자 알림</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
      )

    case 'table-frame':
      return (
        <Card variant="outlined" padding="none" className="w-80">
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable />
          </CardContent>
        </Card>
      )

    case 'title-only':
      return (
        <Card variant="outlined" className="w-56">
          <CardHeader>
            <CardTitle>대기 중인 승인</CardTitle>
          </CardHeader>
        </Card>
      )

    case 'long-content':
      return (
        <Card variant="outlined" className="w-64">
          <CardHeader>
            <CardTitle>변경 이력</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground flex flex-col gap-2 text-sm">
            <p>2026-08-24 워크스페이스 이름을 바꿨습니다.</p>
            <p>2026-08-20 결제 수단을 등록했습니다.</p>
            <p>2026-08-15 팀원 3명을 초대했습니다.</p>
            <p>2026-08-10 요금제를 Pro로 변경했습니다.</p>
            <p>2026-08-02 워크스페이스를 만들었습니다.</p>
          </CardContent>
        </Card>
      )

    case 'uneven-height':
      return (
        <div className="flex w-96 items-start gap-4">
          <Card variant="outlined" className="flex-1">
            <CardHeader>
              <CardTitle>간단 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">활성 사용자 128명</p>
            </CardContent>
          </Card>
          <Card variant="outlined" className="flex-1">
            <CardHeader>
              <CardTitle>상세 요약</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p>활성 사용자 128명</p>
              <p>이번 주 신규 12명</p>
              <p>이탈 2명</p>
            </CardContent>
          </Card>
        </div>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="truncate">워크스페이스 전체 설정</CardTitle>
              <CardAction>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Header·Description·Action·Footer
 * 넷 다 선택 부위지만, 한 인스턴스에서 모든 지시선이 걸리려면 넷 다
 * 동시에 있는 카드를 보여야 한다 — optional은 메타(optional: true)가
 * 기록하지, 미리보기에서 부위를 뺀다고 표현하지 않는다.
 */
function AnatomyPreview() {
  return (
    <Card data-anatomy="container" variant="outlined" className="w-80">
      <CardHeader data-anatomy="header">
        <CardTitle data-anatomy="title">워크스페이스 사용량</CardTitle>
        <CardDescription data-anatomy="description">이번 달 기준</CardDescription>
        <CardAction data-anatomy="action">
          <Button size="sm" variant="outline">
            자세히
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent data-anatomy="content">
        <p className="text-32 font-bold">128 / 200</p>
      </CardContent>
      <CardFooter data-anatomy="footer">
        <Button size="sm">한도 늘리기</Button>
      </CardFooter>
    </Card>
  )
}

export function CardPage() {
  const meta = getComponent('card')
  if (!meta) return <Placeholder title="Card 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCard}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
