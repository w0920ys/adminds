import type { ComponentProps, ReactNode } from 'react'
import { AlarmClock, Archive, ChevronDown, Flag, Minus, Plus, Search } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type GroupOrientation = ComponentProps<typeof ButtonGroup>['orientation']

function renderButtonGroup(options: RenderOptions) {
  const orientation = (options.orientation ?? 'horizontal') as GroupOrientation

  return (
    <ButtonGroup orientation={orientation} aria-label="선택 동작">
      <Button variant="outline">
        <Archive aria-hidden />
        보관
      </Button>
      <Button variant="outline">
        <Flag aria-hidden />
        신고
      </Button>
      <Button variant="outline">
        <AlarmClock aria-hidden />
        미루기
      </Button>
    </ButtonGroup>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 ButtonGroup·Button·
 * Input으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'group-vs-toggle-group':
      return kind === 'do' ? (
        <ButtonGroup aria-label="문서 동작">
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline">
            <Flag aria-hidden />
            신고
          </Button>
        </ButtonGroup>
      ) : (
        <div className="flex flex-col gap-1">
          <ButtonGroup aria-label="정렬 순서(잘못된 예시)">
            <Button variant="outline">이름순</Button>
            <Button variant="outline">최신순</Button>
          </ButtonGroup>
          <p className="text-muted-foreground text-12">고른 정렬을 계속 보여야 한다 — Toggle Group을 써야 한다</p>
        </div>
      )

    case 'separator-for-borderless':
      return kind === 'do' ? (
        <ButtonGroup aria-label="빠른 실행">
          <Button variant="ghost">복사</Button>
          <ButtonGroupSeparator />
          <Button variant="ghost">붙여넣기</Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup aria-label="빠른 실행(잘못된 예시)">
          <Button variant="ghost">복사</Button>
          <Button variant="ghost">붙여넣기</Button>
        </ButtonGroup>
      )

    case 'label-the-group':
      return kind === 'do' ? (
        <ButtonGroup aria-label="문서 동작">
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline">
            <Flag aria-hidden />
            신고
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline">
            <Flag aria-hidden />
            신고
          </Button>
        </ButtonGroup>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'row-actions':
      return (
        <ButtonGroup aria-label="문서 동작">
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline">
            <Flag aria-hidden />
            신고
          </Button>
          <Button variant="outline">
            <AlarmClock aria-hidden />
            미루기
          </Button>
        </ButtonGroup>
      )

    case 'split-button':
      return (
        <ButtonGroup aria-label="배포">
          <Button variant="outline">배포</Button>
          <ButtonGroupSeparator />
          <Button variant="outline" size="icon" aria-label="다른 배포 옵션">
            <ChevronDown aria-hidden />
          </Button>
        </ButtonGroup>
      )

    case 'stepper':
      return (
        <ButtonGroup aria-label="수량">
          <Button variant="outline" size="icon" aria-label="줄이기">
            <Minus aria-hidden />
          </Button>
          <ButtonGroupText className="min-w-12 justify-center">3</ButtonGroupText>
          <Button variant="outline" size="icon" aria-label="늘리기">
            <Plus aria-hidden />
          </Button>
        </ButtonGroup>
      )

    case 'input-with-button':
      return (
        <ButtonGroup aria-label="검색">
          <Input placeholder="사용자 검색" className="w-48" />
          <Button variant="outline" size="icon" aria-label="검색">
            <Search aria-hidden />
          </Button>
        </ButtonGroup>
      )

    case 'mixed-variant':
      return (
        <ButtonGroup aria-label="빠른 실행">
          <Button variant="secondary">복사</Button>
          <ButtonGroupSeparator />
          <Button variant="secondary">붙여넣기</Button>
        </ButtonGroup>
      )

    case 'vertical':
      return (
        <ButtonGroup orientation="vertical" aria-label="정렬">
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline">
            <Flag aria-hidden />
            신고
          </Button>
          <Button variant="outline">
            <AlarmClock aria-hidden />
            미루기
          </Button>
        </ButtonGroup>
      )

    case 'disabled-item':
      return (
        <ButtonGroup aria-label="문서 동작">
          <Button variant="outline">
            <Archive aria-hidden />
            보관
          </Button>
          <Button variant="outline" disabled>
            <Flag aria-hidden />
            신고
          </Button>
          <Button variant="outline">
            <AlarmClock aria-hidden />
            미루기
          </Button>
        </ButtonGroup>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <ButtonGroup aria-label="문서 동작">
            <Button variant="outline" size="sm">
              보관
            </Button>
            <Button variant="outline" size="sm">
              신고
            </Button>
          </ButtonGroup>
        </Bounds>
      )

    default:
      return null
  }
}

/** Container·Separator 둘 다 무대 안에 그대로 있다 — data-anatomy를 직접
 * 얹어 지시선이 실제 DOM 경계를 가리키게 한다. */
function AnatomyPreview() {
  return (
    <ButtonGroup aria-label="문서 동작" data-anatomy="container">
      <Button variant="outline">
        <Archive aria-hidden />
        보관
      </Button>
      <Button variant="outline">
        <Flag aria-hidden />
        신고
      </Button>
      <ButtonGroupSeparator data-anatomy="separator" />
      <Button variant="ghost">
        <AlarmClock aria-hidden />
        미루기
      </Button>
    </ButtonGroup>
  )
}

export function ButtonGroupPage() {
  const meta = getComponent('button-group')
  if (!meta) return <Placeholder title="Button Group 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderButtonGroup}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
