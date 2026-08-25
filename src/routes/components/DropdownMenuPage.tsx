import type { ReactNode } from 'react'
import { Archive, Ban, Copy, LogOut, MoreHorizontal, Pencil, Settings, Trash2, UserPlus } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderDropdownMenu(options: RenderOptions) {
  const disabled = options.state === 'disabled'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="ghost" size="icon" aria-label="더보기" disabled={disabled}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          복제
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
          <Trash2 />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'select-for-values':
      return kind === 'do' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              동작
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Pencil />
              수정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <Trash2 />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              상태 선택
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>활성</DropdownMenuItem>
            <DropdownMenuItem>정지</DropdownMenuItem>
            <DropdownMenuItem>탈퇴</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case 'destructive-grouping':
      return kind === 'do' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="더보기">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Pencil />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy />
              복제
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <Trash2 />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="더보기">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Pencil />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem destructive>
              <Trash2 />
              삭제
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy />
              복제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case 'few-items-buttons':
      return kind === 'do' ? (
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm">
            승인
          </Button>
          <Button variant="destructive" size="sm">
            반려
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              동작
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>승인</DropdownMenuItem>
            <DropdownMenuItem destructive>반려</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'row-actions':
      return (
        <div className="bg-surface flex h-row-compact items-center justify-between gap-3 rounded-md border px-3">
          <span className="flex-1 truncate text-sm">홍길동</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="'홍길동' 더보기">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy />
                복제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <Trash2 />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )

    case 'page-header-actions':
      return (
        <div className="bg-surface flex items-center justify-between gap-3 rounded-md border p-2">
          <span className="text-sm font-medium">사용자 목록</span>
          <div className="flex items-center gap-1.5">
            <Button size="sm">사용자 추가</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="더보기">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <UserPlus />
                  초대 링크 만들기
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive />
                  내보내기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )

    case 'bulk-actions':
      return (
        <div className="bg-surface flex items-center gap-3 rounded-md border px-3 py-2">
          <span className="text-sm">12건 선택됨</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                일괄 작업
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Archive />
                내보내기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <Trash2 />
                선택 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )

    case 'account-menu':
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              홍길동
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings />
              설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case 'many-items':
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              태그 추가
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-56 overflow-y-auto">
            {['공지', '이벤트', '뉴스', '점검', '업데이트', '베타', '긴급', '설문', '가이드', '릴리스', '보안', '정책'].map(
              (tag) => (
                <DropdownMenuItem key={tag}>{tag}</DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case 'bottom-of-screen':
      return (
        <Bounds className="flex h-32 items-end justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                더보기
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem destructive>
                <Trash2 />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Bounds>
      )

    case 'destructive-only':
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="더보기">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem destructive>
              <Ban />
              계정 정지
            </DropdownMenuItem>
            <DropdownMenuItem destructive>
              <Trash2 />
              계정 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                더보기
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem destructive>
                <Trash2 />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대에는 trigger만 남는다. Radix DropdownMenu는 기본이
 * modal이라(RemoveScroll·FocusScope·hideOthers) 열린 목록을 강제로
 * 띄워 두면 Select와 같은 사고가 난다. 열림·정렬은 Usage에서 실제로
 * 눌러서 본다.
 */
function AnatomyPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-anatomy="trigger" variant="outline">
          더보기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          복제
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
          <Trash2 />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DropdownMenuPage() {
  const meta = getComponent('dropdown-menu')
  if (!meta) return <Placeholder title="Dropdown Menu 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderDropdownMenu}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
