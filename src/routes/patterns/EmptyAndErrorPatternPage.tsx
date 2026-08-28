import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, Lock, SearchX } from 'lucide-react'
import { PatternPage } from '@/components/docs/PatternPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  type EmptyStateVariant,
} from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 네 variant가 함께 쓰는 조각 하나. Example과 Guidelines의 예시가
 * 모두 이 Slot을 쓴다 — 같은 뼈대에서 문구와 색만 갈리는 걸 보이는
 * 것이 이 패턴의 요점이다.
 */
function Slot({
  variant,
  icon,
  title,
  description,
  action,
}: {
  variant: EmptyStateVariant
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <EmptyState variant={variant} size="compact">
      <EmptyStateIcon>{icon}</EmptyStateIcon>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {action && <EmptyStateAction>{action}</EmptyStateAction>}
    </EmptyState>
  )
}

type SlotContent = {
  label: string
  variant: EmptyStateVariant
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

/*
 * Example이 나란히 놓는 네 자리. 하나의 화면(프로젝트 목록)이 처할 수
 * 있는 네 상황이라, label은 그 상황의 이름이지 variant 이름이 아니다.
 */
const FOUR_SLOTS: SlotContent[] = [
  {
    label: '아직 없음',
    variant: 'empty',
    icon: <Inbox aria-hidden />,
    title: '아직 만든 프로젝트가 없습니다',
    description: '새 프로젝트를 만들어 시작하세요.',
    action: <Button size="sm">프로젝트 만들기</Button>,
  },
  {
    label: '검색 결과 없음',
    variant: 'no-results',
    icon: <SearchX aria-hidden />,
    title: '검색 결과가 없습니다',
    description: '다른 검색어를 입력하거나 필터를 초기화하세요.',
    action: (
      <Button size="sm" variant="outline">
        필터 초기화
      </Button>
    ),
  },
  {
    label: '권한 없음',
    variant: 'no-permission',
    icon: <Lock aria-hidden />,
    title: '이 프로젝트에 접근할 권한이 없습니다',
    description: '프로젝트 관리자에게 접근 권한을 요청하세요.',
    action: (
      <Button size="sm" variant="outline">
        권한 요청
      </Button>
    ),
  },
  {
    label: '불러오기 실패',
    variant: 'error',
    icon: <AlertTriangle aria-hidden />,
    title: '프로젝트를 불러오지 못했습니다',
    description: '네트워크 상태를 확인하고 다시 시도하세요.',
    action: (
      <Button size="sm" variant="outline">
        다시 시도
      </Button>
    ),
  },
]

function FourSlotsExample() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {FOUR_SLOTS.map((slot) => (
        <div key={slot.variant} className="min-w-0 rounded-lg border p-4">
          <p className="text-muted-foreground text-11 font-bold tracking-widest">{slot.label}</p>
          <div className="mt-3">
            <Slot
              variant={slot.variant}
              icon={slot.icon}
              title={slot.title}
              description={slot.description}
              action={slot.action}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'empty-is-not-error':
      // do: 빈 상태는 안내하는 말로, 실패는 무엇이 잘못됐는지로 — 문구가 갈린다.
      // dont: 상황이 다른데도 둘 다 "데이터가 없습니다"로 적어 구별되지 않는다.
      return kind === 'do' ? (
        <div className="flex w-full flex-col gap-3">
          <Slot
            variant="empty"
            icon={<Inbox aria-hidden />}
            title="아직 만든 프로젝트가 없습니다"
            description="새 프로젝트를 만들어 시작하세요."
          />
          <Slot
            variant="error"
            icon={<AlertTriangle aria-hidden />}
            title="프로젝트를 불러오지 못했습니다"
            description="네트워크 상태를 확인하고 다시 시도하세요."
          />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <Slot
            variant="empty"
            icon={<Inbox aria-hidden />}
            title="데이터가 없습니다"
            description="잠시 후 다시 확인하세요."
          />
          <Slot
            variant="error"
            icon={<AlertTriangle aria-hidden />}
            title="데이터가 없습니다"
            description="잠시 후 다시 확인하세요."
          />
        </div>
      )

    case 'give-an-action':
      // do: 다음에 누를 수 있는 동작이 문구 그대로 있다.
      // dont: 할 일이 없는 권한 없음 자리에 뜻 없는 "확인" 버튼을 더한다.
      return kind === 'do' ? (
        <Slot
          variant="empty"
          icon={<Inbox aria-hidden />}
          title="아직 만든 프로젝트가 없습니다"
          description="새 프로젝트를 만들어 시작하세요."
          action={<Button size="sm">첫 항목 만들기</Button>}
        />
      ) : (
        <Slot
          variant="no-permission"
          icon={<Lock aria-hidden />}
          title="이 프로젝트에 접근할 권한이 없습니다"
          description="프로젝트 관리자에게 접근 권한을 요청하세요."
          action={<Button size="sm">확인</Button>}
        />
      )

    case 'first-visit-is-guidance':
      // do: 중립 색(empty)과 무엇을 만들 수 있는지.
      // dont: 같은 첫 방문 상황을 error 색과 사고처럼 바뀐 문구로 그린다 — 색만 다른 게 아니다.
      return kind === 'do' ? (
        <Slot
          variant="empty"
          icon={<Inbox aria-hidden />}
          title="아직 만든 프로젝트가 없습니다"
          description="새 프로젝트를 만들어 보세요."
        />
      ) : (
        <Slot
          variant="error"
          icon={<AlertTriangle aria-hidden />}
          title="프로젝트를 불러오는 데 실패했습니다"
          description="다시 시도해 주세요."
        />
      )

    default:
      return null
  }
}

/** nothing-yet: 첫 방문의 빈 화면. 만들 수 있는 길을 준다 */
function NothingYetCase() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <EmptyState variant="empty">
          <EmptyStateIcon>
            <Inbox aria-hidden />
          </EmptyStateIcon>
          <EmptyStateTitle>아직 만든 프로젝트가 없습니다</EmptyStateTitle>
          <EmptyStateDescription>새 프로젝트를 만들어 시작하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="lg">프로젝트 만들기</Button>
          </EmptyStateAction>
        </EmptyState>
      </CardContent>
    </Card>
  )
}

/** no-search-results: 무엇으로 걸렀는지 검색창에 남겨 되짚고, 조건을 지우는 길을 준다 */
function NoSearchResultsCase() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input defaultValue="분기 보고서" readOnly aria-label="프로젝트 검색" />
      <EmptyState variant="no-results" size="compact">
        <EmptyStateIcon>
          <SearchX aria-hidden />
        </EmptyStateIcon>
        <EmptyStateTitle>검색 결과가 없습니다</EmptyStateTitle>
        <EmptyStateDescription>다른 검색어를 입력하거나 필터를 초기화하세요.</EmptyStateDescription>
        <EmptyStateAction>
          <Button variant="outline" size="sm">
            필터 초기화
          </Button>
        </EmptyStateAction>
      </EmptyState>
    </div>
  )
}

/** no-permission: 누구에게 요청해야 하는지만 적는다. 다시 시도로는 풀리지 않는 상황이라 그 동작을 두지 않는다 */
function NoPermissionCase() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <EmptyState variant="no-permission">
          <EmptyStateIcon>
            <Lock aria-hidden />
          </EmptyStateIcon>
          <EmptyStateTitle>이 프로젝트에 접근할 권한이 없습니다</EmptyStateTitle>
          <EmptyStateDescription>프로젝트 관리자에게 접근 권한을 요청하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button size="lg">권한 요청</Button>
          </EmptyStateAction>
        </EmptyState>
      </CardContent>
    </Card>
  )
}

/** load-failed: 다시 시도를 둔다. 실제 원인을 알지 못하므로 지어내지 않고 확인할 것만 적는다 */
function LoadFailedCase() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <EmptyState variant="error">
          <EmptyStateIcon>
            <AlertTriangle aria-hidden />
          </EmptyStateIcon>
          <EmptyStateTitle>프로젝트를 불러오지 못했습니다</EmptyStateTitle>
          <EmptyStateDescription>네트워크 상태를 확인하고 다시 시도하세요.</EmptyStateDescription>
          <EmptyStateAction>
            <Button variant="outline" size="lg">
              다시 시도
            </Button>
          </EmptyStateAction>
        </EmptyState>
      </CardContent>
    </Card>
  )
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'nothing-yet':
      return <NothingYetCase />
    case 'no-search-results':
      return <NoSearchResultsCase />
    case 'no-permission':
      return <NoPermissionCase />
    case 'load-failed':
      return <LoadFailedCase />
    default:
      return null
  }
}

export function EmptyAndErrorPatternPage() {
  const meta = getPattern('empty-and-error')
  if (!meta) return <Placeholder title="Empty and error 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<FourSlotsExample />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
