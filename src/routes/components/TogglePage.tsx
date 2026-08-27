import type { ComponentProps, ReactNode } from 'react'
import { Bold, Italic, LayoutGrid, List, Underline } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ToggleVariant = ComponentProps<typeof Toggle>['variant']
type ToggleSize = ComponentProps<typeof Toggle>['size']

/*
 * layout이 실제로 다른 컴포넌트 조합을 고른다 — Toggle 하나, 하나만
 * 켜지는 ToggleGroup, 여럿이 켜지는 ToggleGroup. state의 on은
 * data-state="on"을 손으로 강제하지 않고 defaultPressed·defaultValue로
 * 실제로 켜서 보인다.
 */
function renderToggle(options: RenderOptions) {
  const { variant, size, state, layout } = options
  const disabled = state === 'disabled'
  const pressed = state === 'on'

  if (layout === 'group-single') {
    return (
      <ToggleGroup
        type="single"
        variant={variant as ToggleVariant}
        size={size as ToggleSize}
        disabled={disabled}
        defaultValue={pressed ? 'list' : undefined}
      >
        <ToggleGroupItem value="list" aria-label="목록 보기">
          <List aria-hidden />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="격자 보기">
          <LayoutGrid aria-hidden />
        </ToggleGroupItem>
      </ToggleGroup>
    )
  }

  if (layout === 'group-multiple') {
    return (
      <ToggleGroup
        type="multiple"
        variant={variant as ToggleVariant}
        size={size as ToggleSize}
        disabled={disabled}
        defaultValue={pressed ? ['bold'] : []}
      >
        <ToggleGroupItem value="bold" aria-label="굵게">
          <Bold aria-hidden />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="기울임">
          <Italic aria-hidden />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="밑줄">
          <Underline aria-hidden />
        </ToggleGroupItem>
      </ToggleGroup>
    )
  }

  return (
    <Toggle
      variant={variant as ToggleVariant}
      size={size as ToggleSize}
      disabled={disabled}
      defaultPressed={pressed}
    >
      <Bold aria-hidden />
      굵게
    </Toggle>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Toggle·ToggleGroup과
 * 시스템 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면
 * 예시도 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'distinguish-switch':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-bold">기간</p>
          <ToggleGroup type="single" defaultValue="week" variant="outline">
            <ToggleGroupItem value="today">오늘</ToggleGroupItem>
            <ToggleGroupItem value="week">이번 주</ToggleGroupItem>
            <ToggleGroupItem value="month">이번 달</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 text-sm">
          이메일 알림 받기
          <Toggle aria-label="이메일 알림 받기" defaultPressed />
        </div>
      )

    case 'group-vs-tabs':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-xs">같은 사용자 목록을 표로도, 카드로도 보인다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single" defaultValue="overview">
            <ToggleGroupItem value="overview">개요</ToggleGroupItem>
            <ToggleGroupItem value="settings">설정</ToggleGroupItem>
            <ToggleGroupItem value="logs">로그</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-xs">서로 다른 화면을 통째로 갈아 끼운다 — Tabs를 써야 한다</p>
        </div>
      )

    case 'name-icon-only':
      return kind === 'do' ? (
        <div className="flex items-center gap-3">
          <Toggle aria-label="굵게">
            <Bold aria-hidden />
          </Toggle>
          <code className="bg-muted rounded px-1.5 py-1 text-2xs">aria-label='굵게'</code>
        </div>
      ) : (
        /*
         * inert로 눌러도 반응하지 않고 탭 순서에서도 빠지며 접근성
         * 트리에서도 사라진다 — 이름 없는 아이콘 버튼이 실제로 초점을
         * 받거나 스크린 리더에 노출되는 살아 있는 결함으로 남지 않으면서도
         * 생김새는 그대로 보여 준다. aria-hidden만으로는 포커스 가능한
         * 요소가 접근성 트리에서만 사라질 뿐 탭 순서에는 남아 그 자체로
         * 결함이 된다.
         */
        <Toggle inert>
          <Bold aria-hidden />
        </Toggle>
      )

    case 'decide-empty-single':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-2xs">기본값을 정해 두어 값이 비는 순간이 없다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-2xs">기본값이 없어 처음부터 아무것도 켜져 있지 않다</p>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'view-switcher':
      return (
        <ToggleGroup type="single" defaultValue="list">
          <ToggleGroupItem value="list" aria-label="목록 보기">
            <List aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="격자 보기">
            <LayoutGrid aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      )

    case 'formatting-toolbar':
      return (
        <ToggleGroup type="multiple" defaultValue={['bold']}>
          <ToggleGroupItem value="bold" aria-label="굵게">
            <Bold aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="기울임">
            <Italic aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="밑줄">
            <Underline aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      )

    case 'period-filter':
      return (
        <ToggleGroup type="single" defaultValue="week" variant="outline">
          <ToggleGroupItem value="today">오늘</ToggleGroupItem>
          <ToggleGroupItem value="week">이번 주</ToggleGroupItem>
          <ToggleGroupItem value="month">이번 달</ToggleGroupItem>
        </ToggleGroup>
      )

    case 'column-picker':
      return (
        <ToggleGroup type="multiple" defaultValue={['name', 'role']} variant="outline" size="sm">
          <ToggleGroupItem value="name">이름</ToggleGroupItem>
          <ToggleGroupItem value="role">역할</ToggleGroupItem>
          <ToggleGroupItem value="team">소속</ToggleGroupItem>
          <ToggleGroupItem value="lastSeen">최근 접속</ToggleGroupItem>
        </ToggleGroup>
      )

    case 'icon-only':
      return (
        <div className="flex items-center gap-3">
          <Toggle aria-label="굵게">
            <Bold aria-hidden />
          </Toggle>
          <code className="bg-muted rounded px-1.5 py-1 text-2xs">aria-label='굵게'</code>
        </div>
      )

    case 'empty-value':
      return (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-2xs">켜진 항목을 다시 누르면 둘 다 꺼진 상태가 된다</p>
        </div>
      )

    case 'many-items':
      return (
        <ToggleGroup type="multiple" defaultValue={['name']} size="sm" className="w-full flex-wrap">
          <ToggleGroupItem value="name">이름</ToggleGroupItem>
          <ToggleGroupItem value="role">역할</ToggleGroupItem>
          <ToggleGroupItem value="team">소속</ToggleGroupItem>
          <ToggleGroupItem value="email">이메일</ToggleGroupItem>
          <ToggleGroupItem value="phone">전화번호</ToggleGroupItem>
          <ToggleGroupItem value="lastSeen">최근 접속</ToggleGroupItem>
          <ToggleGroupItem value="createdAt">가입일</ToggleGroupItem>
        </ToggleGroup>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <ToggleGroup type="multiple" defaultValue={['name']} size="sm" className="w-full flex-wrap">
            <ToggleGroupItem value="name">이름</ToggleGroupItem>
            <ToggleGroupItem value="role">역할</ToggleGroupItem>
            <ToggleGroupItem value="team">소속</ToggleGroupItem>
          </ToggleGroup>
        </Bounds>
      )

    default:
      return null
  }
}

export function TogglePage() {
  const meta = getComponent('toggle')
  if (!meta) return <Placeholder title="Toggle 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderToggle}
      preview={
        <ToggleGroup type="multiple" defaultValue={['bold']} data-anatomy="group-container">
          <ToggleGroupItem data-anatomy="container" value="bold">
            <Bold data-anatomy="icon" aria-hidden />
            <span data-anatomy="label">굵게</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="기울임">
            <Italic aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
