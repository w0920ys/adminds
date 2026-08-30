import { useState } from 'react'
import type { ReactNode } from 'react'
import { LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { AppShell, type AppShellNavItem } from '@/components/ui/app-shell'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { cn } from '@/lib/utils'
import { Placeholder } from '@/routes/Placeholder'

const NAV_ITEMS: AppShellNavItem[] = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'users', label: '사용자', icon: Users },
  { id: 'orders', label: '주문', icon: ShoppingCart },
  { id: 'settings', label: '설정', icon: Settings },
]

/* 사이드바 스크롤을 실제로 보여주려면 항목이 넉넉히 많아야 한다 */
const MANY_NAV_ITEMS: AppShellNavItem[] = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'users', label: '사용자', icon: Users },
  { id: 'orders', label: '주문', icon: ShoppingCart },
  { id: 'products', label: '상품' },
  { id: 'coupons', label: '쿠폰' },
  { id: 'reviews', label: '리뷰' },
  { id: 'notices', label: '공지' },
  { id: 'inquiries', label: '문의' },
  { id: 'reports', label: '리포트' },
  { id: 'settings', label: '설정', icon: Settings },
]

function DemoContent({ label, compact = false }: { label: string; compact?: boolean }) {
  /*
   * Usage·Cases는 ExampleList가 grid-cols-2로 강제로 반씩 나눠 main이
   * 실제로 150px 안팎까지 좁아진다(sidebar는 md:w-56로 shrink-0이라
   * 줄지 않고 main만 줄어든다). 그 폭에서 6문단짜리 본문을 그대로
   * 두면 문단마다 여러 줄로 잘게 접혀 상자가 과하게 길어진다 —
   * compact는 한 줄짜리 안내문 하나로 줄여 좁은 폭에서도 자연스럽게
   * 보이게 한다. 더 넓은 Playground·Properties에서는 기본값(전체
   * 문단)을 그대로 쓴다.
   */
  return (
    <div className="flex flex-col gap-4 p-6">
      {/*
       * h2/h3가 아니라 div다 — 이 페이지의 TableOfContents는 main 안의
       * 모든 h2·h3를 훑어 목차로 삼는다(assignHeadingIds). 진짜 제목처럼
       * 보이는 이 데모 헤딩을 h2로 두면 Playground·Properties·Usage·Cases에
       * 찍힌 인스턴스 수만큼 "대시보드"가 목차에 반복해서 끼어든다.
       */}
      <div className="text-18 font-semibold">{label}</div>
      {compact ? (
        <p className="text-muted-foreground text-14">{label} 화면의 본문이 이 안에서 스크롤된다.</p>
      ) : (
        Array.from({ length: 6 }).map((_, i) => (
          <p key={i} className="text-muted-foreground text-14">
            {label} 화면의 본문 {i + 1}번째 문단이다. 사이드바에서 다른 항목을 눌러도 이 영역만
            스크롤되고 사이드바는 그대로 남는다.
          </p>
        ))
      )}
    </div>
  )
}

/*
 * 원본엔 없는 className 확장 포인트(app-shell.tsx 참고)로 md:h-svh를
 * 고정 높이로 덮어써 문서 페이지의 한 상자 안에 가둔다 — 실제
 * 화면에서는 이 prop을 비워 두고 뷰포트 전체를 채운다.
 */
function AppShellDemo({
  nav = NAV_ITEMS,
  withActions = false,
  compact = false,
}: {
  nav?: AppShellNavItem[]
  withActions?: boolean
  compact?: boolean
}) {
  const [activeId, setActiveId] = useState(nav[0]?.id)
  const activeLabel = nav.find((item) => item.id === activeId)?.label ?? '대시보드'

  return (
    <AppShell
      /*
       * whitespace-nowrap을 브랜드 슬롯 자체에 둔다 — brand는 셸이
       * 알지 못하는 opaque ReactNode라, 모바일 헤더에서 햄버거·actions와
       * 한 줄을 다툴 만큼 좁아지면 공백 없는 한글 문자열이 글자 단위로
       * 줄바뀜된다(StatCard의 값 줄바꿈과 같은 종류의 함정). 이 슬롯을
       * 채우는 쪽이 직접 막아야 한다.
       */
      brand={<span className="whitespace-nowrap">먹었지</span>}
      nav={nav}
      activeId={activeId}
      onNavigate={setActiveId}
      actions={
        withActions ? (
          <Button variant="ghost" size="sm" className="w-full justify-start">
            로그아웃
          </Button>
        ) : undefined
      }
      className={cn('overflow-hidden rounded-lg border', compact ? 'md:h-[220px]' : 'md:h-[420px]')}
    >
      <DemoContent label={activeLabel} compact={compact} />
    </AppShell>
  )
}

function render(options: RenderOptions) {
  return (
    <AppShellDemo
      nav={options.nav === 'empty' ? [] : NAV_ITEMS}
      withActions={options.actions === 'shown'}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'admin-dashboard-shell':
      return <AppShellDemo withActions compact />

    case 'no-nav':
      return <AppShellDemo nav={[]} withActions compact />

    case 'many-nav-items':
      return <AppShellDemo nav={MANY_NAV_ITEMS} compact />

    default:
      return null
  }
}

export function AppShellPage() {
  const meta = getComponent('app-shell')
  if (!meta) return <Placeholder title="App Shell 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={render({ nav: 'with-items', actions: 'hidden' })}
      renderExample={renderExample}
    />
  )
}
