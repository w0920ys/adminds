import type { ReactNode } from 'react'
import { Info, Pencil, Trash2 } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * Playground 전용(Properties는 축이 없어 비어 있다). side는 열려야만
 * 값이 갈리는 prop이라 defaultOpen으로 강제해 봤지만 Radix Tooltip은
 * 열림 상태를 포인터·포커스가 쥐고 있어 유지되지 않았다 — 격자에
 * 똑같이 생긴 트리거만 남고 말풍선은 뜨지 않았다. 실제 호버로 열리는
 * 진짜 컴포넌트 하나만 보인다.
 */
function renderTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm">
          담당자
        </Button>
      </TooltipTrigger>
      <TooltipContent>홍길동</TooltipContent>
    </Tooltip>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'icon-only-button':
      return kind === 'do' ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="수정">
              <Pencil />
            </Button>
          </TooltipTrigger>
          <TooltipContent>수정</TooltipContent>
        </Tooltip>
      ) : (
        <Button variant="ghost" size="icon">
          <Pencil />
        </Button>
      )

    case 'not-only-source':
      return kind === 'do' ? (
        <div className="flex flex-col gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="w-fit">
                <Button variant="outline" size="sm" disabled>
                  승인
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>권한이 없습니다</TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground text-12">권한이 없어 승인할 수 없습니다</p>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="w-fit">
              <Button variant="outline" size="sm" disabled>
                승인
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>권한이 없습니다</TooltipContent>
        </Tooltip>
      )

    case 'single-line':
      return kind === 'do' ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="삭제">
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>삭제</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="삭제">
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            이 항목을 삭제하면 연결된 하위 항목도 함께 지워지고 되돌릴 수 없으니 신중하게 결정하세요
          </TooltipContent>
        </Tooltip>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'icon-button':
      return (
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="수정">
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>수정</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="삭제">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>삭제</TooltipContent>
          </Tooltip>
        </div>
      )

    case 'truncated-text':
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-32 truncate text-sm">워크스페이스 전체 관리 권한을 가진 최고 관리자</span>
          </TooltipTrigger>
          <TooltipContent>워크스페이스 전체 관리 권한을 가진 최고 관리자</TooltipContent>
        </Tooltip>
      )

    case 'disabled-reason':
      return (
        <div className="flex flex-col gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="w-fit">
                <Button size="sm" disabled>
                  게시
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">필수 항목을 먼저 채우세요</TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground text-12">필수 항목을 먼저 채워야 게시할 수 있습니다</p>
        </div>
      )

    case 'table-header':
      return (
        <div className="bg-surface flex items-center gap-1 rounded-md border px-3 py-2">
          <span className="text-12 font-medium">전환율</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label="전환율 설명" className="text-muted-foreground">
                <Info size={13} aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">방문자 중 결제까지 이어진 비율입니다</TooltipContent>
          </Tooltip>
        </div>
      )

    case 'long-text':
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              정책 안내
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            승인 없이 삭제하면 감사 로그에만 남고 사용자에게는 따로 알림이 가지 않습니다
          </TooltipContent>
        </Tooltip>
      )

    case 'screen-edge':
      return (
        <Bounds className="flex justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="더보기">
                <Info aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">화면 밖으로 나가면 반대쪽으로 뒤집힌다</TooltipContent>
          </Tooltip>
        </Bounds>
      )

    case 'touch-device':
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="새로고침">
              <Info aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>터치 기기에서는 뜨지 않으므로 aria-label이 이름을 대신한다</TooltipContent>
        </Tooltip>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                담당자 배정
              </Button>
            </TooltipTrigger>
            <TooltipContent>담당자를 배정합니다</TooltipContent>
          </Tooltip>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대에는 trigger만 남는다. 말풍선·꼬리는 Portal로 렌더링되어
 * document.body에 그려지므로 stage.querySelector가 찾지 못한다 —
 * Select가 열린 목록을 부위에서 뺀 것과 같은 이유다. 강제로 열지도
 * 않는다. trigger 하나만 측정하면 되므로 실제로 호버해야 여는 진짜
 * 컴포넌트를 그대로 둔다.
 */
function AnatomyPreview() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button data-anatomy="trigger" variant="outline">
          담당자
        </Button>
      </TooltipTrigger>
      <TooltipContent>홍길동</TooltipContent>
    </Tooltip>
  )
}

export function TooltipPage() {
  const meta = getComponent('tooltip')
  if (!meta) return <Placeholder title="Tooltip 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderTooltip}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
