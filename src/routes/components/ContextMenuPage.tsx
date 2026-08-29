import type { ReactNode } from 'react'
import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderContextMenu(options: RenderOptions) {
  const disabled = options.state === 'disabled'
  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={disabled}
        className="bg-surface text-muted-foreground flex h-24 w-56 items-center justify-center rounded-md border text-16"
      >
        여기를 우클릭
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Pencil />
          수정
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy />
          복제
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          <Trash2 />
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'not-only-affordance':
      return kind === 'do' ? (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-64 items-center justify-between gap-3 rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동</span>
            <Button variant="ghost" size="icon" aria-label="'홍길동' 더보기">
              <MoreHorizontal />
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-64 items-center rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동(우클릭 메뉴만 있음)</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'row-actions':
      return (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex h-row-compact w-72 items-center justify-between gap-3 rounded-md border px-3">
            <span className="flex-1 truncate text-14">홍길동</span>
            <span className="text-muted-foreground text-12">우클릭</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              수정
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy />
              복제
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )

    case 'card-actions':
      return (
        <ContextMenu>
          <ContextMenuTrigger className="bg-surface flex w-64 flex-col gap-1 rounded-lg border p-4">
            <strong className="text-16">2026년 3분기 보고서</strong>
            <span className="text-muted-foreground text-12">카드 전체를 우클릭</span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Pencil />
              이름 바꾸기
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy />
              복제
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>
              <Trash2 />
              삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )

    case 'disabled-target':
      return (
        <div className="bg-surface text-muted-foreground flex h-row-compact w-64 items-center rounded-md border px-3 text-14">
          시스템 계정(동작 없음, Context Menu 없음)
        </div>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        data-anatomy="trigger"
        className="bg-surface text-muted-foreground flex h-24 w-56 items-center justify-center rounded-md border text-16"
      >
        여기를 우클릭
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Pencil />
          수정
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy />
          복제
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          <Trash2 />
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function ContextMenuPage() {
  const meta = getComponent('context-menu')
  if (!meta) return <Placeholder title="Context Menu 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderContextMenu}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
