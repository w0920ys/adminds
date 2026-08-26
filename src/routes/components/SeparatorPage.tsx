import type { ComponentProps, ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type SeparatorOrientation = NonNullable<ComponentProps<typeof Separator>['orientation']>

function renderSeparator(options: RenderOptions) {
  const orientation = (options.orientation ?? 'horizontal') as SeparatorOrientation

  if (orientation === 'vertical') {
    return (
      <div className="flex h-24 items-center gap-4 text-sm">
        <span>메뉴 A</span>
        <Separator orientation="vertical" />
        <span>메뉴 B</span>
      </div>
    )
  }

  return (
    <div className="flex w-64 flex-col gap-4 text-sm">
      <span>위 구획</span>
      <Separator orientation="horizontal" />
      <span>아래 구획</span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 카드는 아직 없으므로 테두리 있는 상자와
 * Separator로 구획을 대신한다 — 나중에 Card가 생겨도 이 예시를
 * 되돌아와 고치지 않는다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'meaningful-vs-decorative':
      return kind === 'do' ? (
        <div className="bg-surface flex items-center gap-3 rounded-md border p-3 text-sm">
          <span>복사</span>
          <span>붙여넣기</span>
          <Separator orientation="vertical" decorative={false} className="h-4" />
          <span className="text-destructive">삭제</span>
        </div>
      ) : (
        <div className="bg-surface flex flex-col gap-3 rounded-md border p-4 text-sm">
          <p>기본 정보</p>
          <Separator decorative={false} />
          <p>결제 정보</p>
        </div>
      )

    case 'no-line-when-spacing-suffices':
      return kind === 'do' ? (
        <div className="flex w-56 flex-col gap-6 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-medium">일반</p>
            <p className="text-muted-foreground text-xs">계정 정보를 관리합니다</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium">보안</p>
            <p className="text-muted-foreground text-xs">비밀번호와 인증을 관리합니다</p>
          </div>
        </div>
      ) : (
        <div className="flex w-56 flex-col gap-6 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-medium">일반</p>
            <p className="text-muted-foreground text-xs">계정 정보를 관리합니다</p>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
            <p className="font-medium">보안</p>
            <p className="text-muted-foreground text-xs">비밀번호와 인증을 관리합니다</p>
          </div>
        </div>
      )

    case 'not-between-every-item':
      return kind === 'do' ? (
        <div className="bg-surface flex w-48 flex-col rounded-md border p-1 text-sm">
          <span className="rounded px-2 py-1.5">복사</span>
          <span className="rounded px-2 py-1.5">붙여넣기</span>
          <Separator className="my-1" />
          <span className="rounded px-2 py-1.5 text-destructive">삭제</span>
        </div>
      ) : (
        <div className="bg-surface flex w-48 flex-col rounded-md border p-1 text-sm">
          <span className="rounded px-2 py-1.5">복사</span>
          <Separator className="my-1" />
          <span className="rounded px-2 py-1.5">붙여넣기</span>
          <Separator className="my-1" />
          <span className="rounded px-2 py-1.5">삭제</span>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'card-section':
      return (
        <div className="bg-surface flex w-64 flex-col gap-3 rounded-md border p-4 text-sm">
          <div>
            <p className="font-medium">일반</p>
            <p className="text-muted-foreground text-xs">계정 정보를 관리합니다</p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">보안</p>
            <p className="text-muted-foreground text-xs">비밀번호와 인증을 관리합니다</p>
          </div>
        </div>
      )

    case 'menu-group':
      return (
        <div className="bg-surface flex w-48 flex-col rounded-md border p-1 text-sm">
          <span className="rounded px-2 py-1.5">복사</span>
          <span className="rounded px-2 py-1.5">붙여넣기</span>
          <Separator className="my-1" />
          <span className="rounded px-2 py-1.5 text-destructive">삭제</span>
        </div>
      )

    case 'toolbar-group':
      return (
        <div className="bg-surface flex items-center gap-2 rounded-md border p-2 text-sm">
          <span>실행 취소</span>
          <span>다시 실행</span>
          <Separator orientation="vertical" className="h-4" />
          <span>잘라내기</span>
          <span>복사</span>
          <span>붙여넣기</span>
        </div>
      )

    case 'form-section':
      return (
        <div className="flex w-64 flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sep-ex-name" className="text-sm font-medium">
              이름
            </label>
            <Input id="sep-ex-name" />
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sep-ex-email" className="text-sm font-medium">
              이메일
            </label>
            <Input id="sep-ex-email" type="email" />
          </div>
        </div>
      )

    case 'vertical-height':
      return (
        <div className="flex h-16 items-center gap-4 text-sm">
          <span>메뉴 A</span>
          <Separator orientation="vertical" />
          <span>메뉴 B</span>
        </div>
      )

    case 'spacing-sufficient':
      return (
        <div className="flex w-56 flex-col gap-6 text-sm">
          <p>주문 20260824-001</p>
          <p>주문 20260823-014</p>
        </div>
      )

    case 'asymmetric-margin':
      return (
        <div className="bg-surface flex items-center gap-3 rounded-md border py-2 pr-4 pl-2 text-sm">
          <span>실행 취소</span>
          <Separator orientation="vertical" className="h-4" />
          <span>다시 실행</span>
        </div>
      )

    default:
      return null
  }
}

export function SeparatorPage() {
  const meta = getComponent('separator')
  if (!meta) return <Placeholder title="Separator 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSeparator}
      preview={<Separator />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
