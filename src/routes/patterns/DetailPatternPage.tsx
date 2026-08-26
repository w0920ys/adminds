import type { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
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
import { DescriptionDetail, DescriptionItem, DescriptionList, DescriptionTerm } from '@/components/ui/description-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

const USER_NAME = '홍길동'

type InfoField = { term: string; detail: string }

const USER_INFO: InfoField[] = [
  { term: '이메일', detail: 'hong@example.com' },
  { term: '가입일', detail: '2024-03-02' },
  { term: '담당자', detail: '김서연' },
  { term: '최근 로그인', detail: '2024-03-10 14:03' },
]

type Order = { id: string; product: string; amount: string; status: '완료' | '배송중' | '취소' }

const ORDERS: Order[] = [
  { id: 'ORD-1029', product: '무선 키보드', amount: '58,000원', status: '완료' },
  { id: 'ORD-1042', product: '노트북 스탠드', amount: '32,000원', status: '배송중' },
  { id: 'ORD-1058', product: '모니터 암', amount: '76,000원', status: '취소' },
]

const ORDER_STATUS_VARIANT: Record<Order['status'], 'success' | 'info' | 'destructive'> = {
  완료: 'success',
  배송중: 'info',
  취소: 'destructive',
}

type Activity = { id: string; label: string; at: string }

const ACTIVITIES: Activity[] = [
  { id: 'created', label: '계정이 생성되었습니다', at: '2024-03-02 09:12' },
  { id: 'login', label: '로그인했습니다', at: '2024-03-10 14:03' },
  { id: 'role-changed', label: '권한이 관리자로 바뀌었습니다', at: '2024-03-15 11:47' },
]

/** 탭이 많은 경우를 보이려고 늘린 목록. 실제 탭 구성(정보·주문·활동)과는 다르다 */
const MANY_TABS = ['정보', '주문', '활동', '결제', '문서', '메모', '이력', '권한']

/**
 * 어디서 들어왔는지 잇는 세 칸. 마지막 칸은 링크가 아니라 현재 위치다.
 *
 * 앞의 두 칸이 href='#'인 것은 ListPatternPage의 ScreenHeader와 같은 이유다 —
 * 이 Example은 목업이라 그 위 갈래에 해당하는 라우트가 없고, asChild에 Link를
 * 넣으면 목업에서 유일하게 문서 밖 없는 페이지로 나가는 자리가 된다.
 */
function OriginBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">회원</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">사용자</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{USER_NAME}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/** 위험한 동작(정지·삭제)을 담는 Dropdown Menu. 트리거는 아이콘 전용이라 aria-label을 단다 */
function ActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="더보기">
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>정지</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** 제목 줄과 동작. 수정은 버튼으로, 정지·삭제는 메뉴 안으로 내린다 */
function ScreenHeader() {
  return (
    <div className="flex flex-col gap-4">
      <OriginBreadcrumb />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-semibold tracking-tight">{USER_NAME}</h4>
          <Badge variant="success">활성</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            수정
          </Button>
          <ActionsMenu />
        </div>
      </div>
    </div>
  )
}

function InfoPanel() {
  return (
    <DescriptionList layout="horizontal">
      {USER_INFO.map((field) => (
        <DescriptionItem key={field.term}>
          <DescriptionTerm>{field.term}</DescriptionTerm>
          <DescriptionDetail>{field.detail}</DescriptionDetail>
        </DescriptionItem>
      ))}
    </DescriptionList>
  )
}

function OrdersPanel() {
  return (
    <Table label="주문 내역">
      <TableHeader>
        <TableRow>
          <TableHead>주문번호</TableHead>
          <TableHead>상품</TableHead>
          <TableHead>금액</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ORDERS.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>{order.amount}</TableCell>
            <TableCell>
              <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{order.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ActivityPanel() {
  return (
    <ul className="flex flex-col gap-3">
      {ACTIVITIES.map((activity) => (
        <li key={activity.id} className="flex items-center justify-between gap-4 text-sm">
          <span>{activity.label}</span>
          <span className="text-muted-foreground text-xs">{activity.at}</span>
        </li>
      ))}
    </ul>
  )
}

/** 탭을 바꿔도 남는 것은 이 컴포넌트 바깥의 ScreenHeader뿐이다. Tabs 자신은 세 갈래의 내용만 갖는다 */
function DetailTabs() {
  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">정보</TabsTrigger>
        <TabsTrigger value="orders">주문</TabsTrigger>
        <TabsTrigger value="activity">활동</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <InfoPanel />
      </TabsContent>
      <TabsContent value="orders">
        <OrdersPanel />
      </TabsContent>
      <TabsContent value="activity">
        <ActivityPanel />
      </TabsContent>
    </Tabs>
  )
}

function DetailExample() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader />
      <DetailTabs />
    </div>
  )
}

/** breadcrumb-shows-origin의 dont: 상위 갈래 없이 제목만 남는다 */
function TitleOnlyHeader() {
  return <h4 className="text-xl font-semibold tracking-tight">{USER_NAME}</h4>
}

/** breadcrumb-shows-origin의 do: Breadcrumb 아래에 제목을 둔다 */
function BreadcrumbHeader() {
  return (
    <div className="flex flex-col gap-4">
      <OriginBreadcrumb />
      <TitleOnlyHeader />
    </div>
  )
}

/** danger-in-menu의 dont: 삭제가 제목 줄에 채운 버튼으로 나란히 선다 */
function DangerInlineHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="text-xl font-semibold tracking-tight">{USER_NAME}</h4>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          수정
        </Button>
        <Button variant="destructive" size="sm">
          삭제
        </Button>
      </div>
    </div>
  )
}

/** danger-in-menu의 do: 삭제는 메뉴 안쪽에 있다 */
function DangerInMenuHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="text-xl font-semibold tracking-tight">{USER_NAME}</h4>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          수정
        </Button>
        <ActionsMenu />
      </div>
    </div>
  )
}

/** header-persists-across-tabs의 do: 제목과 동작이 Tabs 위에, 탭 안쪽에는 내용만 있다 */
function HeaderAboveTabs() {
  return (
    <div className="flex flex-col gap-3">
      <DangerInMenuHeader />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">정보</TabsTrigger>
          <TabsTrigger value="orders">주문</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoPanel />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/** header-persists-across-tabs의 dont: 탭 안쪽마다 제목 줄을 다시 그린다 */
function HeaderRedrawnPerTab() {
  return (
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">정보</TabsTrigger>
        <TabsTrigger value="orders">주문</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <div className="flex flex-col gap-3">
          <DangerInMenuHeader />
          <InfoPanel />
        </div>
      </TabsContent>
      <TabsContent value="orders">
        <div className="flex flex-col gap-3">
          <DangerInMenuHeader />
          <OrdersPanel />
        </div>
      </TabsContent>
    </Tabs>
  )
}

/*
 * long-title: 제목은 줄바꿈하고 동작은 오른쪽 끝에 남는다.
 * ml-auto를 동작 쪽에 둔다 — justify-between은 줄이 하나 남으면(동작만
 * 내려온 줄) 나눌 상대가 없어 왼쪽에 붙는다. ml-auto는 줄이 바뀌어도
 * 그 줄 안에서 스스로를 오른쪽 끝으로 민다.
 */
function LongTitleCase() {
  return (
    <div className="max-w-sm">
      <div className="flex flex-wrap items-start gap-3">
        <h4 className="min-w-0 flex-1 text-xl font-semibold tracking-tight">
          주식회사 아주 긴 이름의 고객사를 담당하는 홍길동
        </h4>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            수정
          </Button>
          <ActionsMenu />
        </div>
      </div>
    </div>
  )
}

/** many-tabs: 탭 줄이 좁은 폭 안에서 가로로 구른다. 탭을 접어 숨기지 않는다 */
function ManyTabsCase() {
  return (
    <div className="max-w-sm">
      <Tabs defaultValue={MANY_TABS[0]}>
        <TabsList className="w-full flex-nowrap overflow-x-auto">
          {MANY_TABS.map((label) => (
            <TabsTrigger key={label} value={label} className="shrink-0">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

/** locked-tab: 탭은 남기고 비활성으로 두며, 왜 잠겼는지 옆에 적는다 */
function LockedTabCase() {
  return (
    <div className="flex flex-col gap-2">
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">정보</TabsTrigger>
          <TabsTrigger value="orders">주문</TabsTrigger>
          <TabsTrigger value="activity" disabled>
            활동
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoPanel />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersPanel />
        </TabsContent>
      </Tabs>
      <p className="text-muted-foreground text-xs">활동 탭은 열람 권한이 없어 잠겼습니다.</p>
    </div>
  )
}

/** narrow-screen: 제목과 동작이 세로로 쌓이고 Description List가 한 줄씩(stacked) 놓인다 */
function NarrowScreenCase() {
  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-xs rounded-md border border-dashed p-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-semibold tracking-tight">{USER_NAME}</h4>
              <Badge variant="success">활성</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                수정
              </Button>
              <ActionsMenu />
            </div>
          </div>
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">정보</TabsTrigger>
              <TabsTrigger value="orders">주문</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <DescriptionList>
                {USER_INFO.map((field) => (
                  <DescriptionItem key={field.term}>
                    <DescriptionTerm>{field.term}</DescriptionTerm>
                    <DescriptionDetail>{field.detail}</DescriptionDetail>
                  </DescriptionItem>
                ))}
              </DescriptionList>
            </TabsContent>
            <TabsContent value="orders">
              <OrdersPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <p className="text-muted-foreground text-2xs">
        점선은 화면 폭입니다. 제목과 동작은 세로로 쌓이고, Description List는 한 줄씩 놓입니다.
      </p>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'breadcrumb-shows-origin':
      return kind === 'do' ? <BreadcrumbHeader /> : <TitleOnlyHeader />
    case 'danger-in-menu':
      return kind === 'do' ? <DangerInMenuHeader /> : <DangerInlineHeader />
    case 'header-persists-across-tabs':
      return kind === 'do' ? <HeaderAboveTabs /> : <HeaderRedrawnPerTab />
    default:
      return null
  }
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'long-title':
      return <LongTitleCase />
    case 'many-tabs':
      return <ManyTabsCase />
    case 'locked-tab':
      return <LockedTabCase />
    case 'narrow-screen':
      return <NarrowScreenCase />
    default:
      return null
  }
}

export function DetailPatternPage() {
  const meta = getPattern('detail')
  if (!meta) return <Placeholder title="Detail 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<DetailExample />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
