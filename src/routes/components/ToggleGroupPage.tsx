import type { ComponentProps, ReactNode } from 'react'
import { Bold, Italic, LayoutGrid, List, Underline } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type GroupVariant = ComponentProps<typeof ToggleGroup>['variant']
type GroupSize = ComponentProps<typeof ToggleGroup>['size']

/*
 * type이 실제로 다른 컴포넌트 상태를 고른다 — single은 defaultValue가
 * 문자열 하나, multiple은 배열이다. 두 경우 다 켜진 값을 미리 둬 첫
 * 렌더에서 빈 묶음으로 보이지 않게 한다.
 */
function renderToggleGroup(options: RenderOptions) {
  const { type, variant, size } = options

  if (type === 'multiple') {
    return (
      <ToggleGroup type="multiple" variant={variant as GroupVariant} size={size as GroupSize} defaultValue={['bold']}>
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
    <ToggleGroup type="single" variant={variant as GroupVariant} size={size as GroupSize} defaultValue="list">
      <ToggleGroupItem value="list" aria-label="목록 보기">
        <List aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="격자 보기">
        <LayoutGrid aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 ToggleGroup으로
 * 만든 어드민 화면의 한 조각이다 — Toggle 문서(TogglePage)가 이미
 * 그리는 같은 장면을 여기서도 그린다. Toggle Group을 독립 컴포넌트로
 * 설치하려는 사람은 이 페이지만 보고도 충분해야 하기 때문이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'shared-size':
      return kind === 'do' ? (
        <ToggleGroup type="single" defaultValue="week" variant="outline" size="sm">
          <ToggleGroupItem value="today">오늘</ToggleGroupItem>
          <ToggleGroupItem value="week">이번 주</ToggleGroupItem>
          <ToggleGroupItem value="month">이번 달</ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <ToggleGroup type="single" defaultValue="week" variant="outline">
          <ToggleGroupItem value="today" size="sm">
            오늘
          </ToggleGroupItem>
          <ToggleGroupItem value="week" size="lg">
            이번 주
          </ToggleGroupItem>
          <ToggleGroupItem value="month" size="sm">
            이번 달
          </ToggleGroupItem>
        </ToggleGroup>
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
          <p className="text-muted-foreground text-12">같은 사용자 목록을 표로도, 카드로도 보인다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <ToggleGroup type="single" defaultValue="overview">
            <ToggleGroupItem value="overview">개요</ToggleGroupItem>
            <ToggleGroupItem value="settings">설정</ToggleGroupItem>
            <ToggleGroupItem value="logs">로그</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-12">서로 다른 화면을 통째로 갈아 끼운다 — Tabs를 써야 한다</p>
        </div>
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
          <p className="text-muted-foreground text-12">기본값을 정해 두어 값이 비는 순간이 없다</p>
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
          <p className="text-muted-foreground text-12">기본값이 없어 처음부터 아무것도 켜져 있지 않다</p>
        </div>
      )

    case 'name-icon-only':
      return kind === 'do' ? (
        <div className="flex items-center gap-3">
          <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <code className="bg-muted rounded px-1.5 py-1 text-12">aria-label='목록 보기'</code>
        </div>
      ) : (
        <ToggleGroup type="single" defaultValue="list" inert>
          <ToggleGroupItem value="list">
            <List aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid">
            <LayoutGrid aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
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
          <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List aria-hidden />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="격자 보기">
              <LayoutGrid aria-hidden />
            </ToggleGroupItem>
          </ToggleGroup>
          <code className="bg-muted rounded px-1.5 py-1 text-12">aria-label='목록 보기'</code>
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
          <p className="text-muted-foreground text-12">켜진 항목을 다시 누르면 둘 다 꺼진 상태가 된다</p>
        </div>
      )

    case 'many-items':
      return (
        <ToggleGroup type="multiple" defaultValue={['name']} size="sm">
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
          <ToggleGroup type="multiple" defaultValue={['name']} size="sm">
            <ToggleGroupItem value="name">이름</ToggleGroupItem>
            <ToggleGroupItem value="role">역할</ToggleGroupItem>
            <ToggleGroupItem value="team">소속</ToggleGroupItem>
            <ToggleGroupItem value="email">이메일</ToggleGroupItem>
          </ToggleGroup>
        </Bounds>
      )

    default:
      return null
  }
}

/** Group·Item 둘 다 무대 안에 그대로 있다 — data-anatomy를 직접 얹어
 * 지시선이 실제 DOM 경계를 가리키게 한다(TogglePage의 Anatomy 미리보기와 같은 자리). */
function AnatomyPreview() {
  return (
    <ToggleGroup type="single" defaultValue="list" data-anatomy="group">
      <ToggleGroupItem value="list" aria-label="목록 보기" data-anatomy="item">
        <List aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="격자 보기">
        <LayoutGrid aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export function ToggleGroupPage() {
  const meta = getComponent('toggle-group')
  if (!meta) return <Placeholder title="Toggle Group 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderToggleGroup}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
