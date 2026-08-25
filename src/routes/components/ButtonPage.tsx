import type { ReactNode } from 'react'
import { ChevronRight, Loader2, Plus, Search, Settings2, Trash2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type ButtonSize = React.ComponentProps<typeof Button>['size']

const LABEL = '버튼'

function renderButton(options: RenderOptions) {
  const { variant, size, layout, width, state } = options
  const isIconOnly = layout === 'icon-only' || size === 'icon'
  const isLoading = state === 'loading'
  const isDisabled = state === 'disabled' || isLoading

  return (
    <Button
      variant={variant as ButtonVariant}
      size={(isIconOnly ? 'icon' : size) as ButtonSize}
      disabled={isDisabled}
      aria-label={isIconOnly ? `${variant} ${LABEL}` : undefined}
      className={cn(width === 'fill' && !isIconOnly && 'w-full')}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && (layout === 'icon-leading' || isIconOnly) && <Plus />}
      {!isIconOnly && (isLoading ? '저장 중' : LABEL)}
      {!isLoading && !isIconOnly && layout === 'icon-trailing' && <ChevronRight />}
    </Button>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Button과 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

/** 예시 안에서 공간의 경계를 보여줄 때 쓰는 점선 상자 */
function Bounds({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md border border-dashed p-2', className)}>{children}</div>
}

/** hierarchy의 do/don't가 공유하는 페이지 헤더 한 줄 */
function EditHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="text-sm font-semibold">사용자 편집</h4>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

/** destructive-actions의 do/don't가 공유하는 다이얼로그 하단 */
function DeleteDialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">사용자 3명 삭제</p>
      <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'hierarchy':
      return kind === 'do' ? (
        <EditHeader>
          <Button variant="outline" size="sm">
            취소
          </Button>
          <Button size="sm">저장</Button>
        </EditHeader>
      ) : (
        <EditHeader>
          <Button size="sm">복제</Button>
          <Button size="sm">내보내기</Button>
          <Button size="sm">저장</Button>
        </EditHeader>
      )

    case 'destructive-actions':
      return kind === 'do' ? (
        <DeleteDialogFooter>
          <Button variant="ghost" size="sm">
            취소
          </Button>
          <Button variant="destructive" size="sm">
            삭제
          </Button>
        </DeleteDialogFooter>
      ) : (
        <DeleteDialogFooter>
          <Button variant="ghost" size="sm">
            취소
          </Button>
          <Button size="sm">확인</Button>
        </DeleteDialogFooter>
      )

    case 'buttons-vs-links':
      return kind === 'do' ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm">
            '홍길동'의 역할은{' '}
            <Button asChild variant="link" className="h-auto p-0 align-baseline">
              <a href="#role-settings">역할 설정</a>
            </Button>
            에서 바꿉니다.
          </p>
          <Button size="sm">초대 메일 다시 보내기</Button>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm">'홍길동'의 역할은 아래에서 바꿉니다.</p>
          <Button size="sm">역할 설정 열기</Button>
          <p className="text-muted-foreground text-2xs">
            새 탭으로 열 수도, 주소를 복사할 수도 없습니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

/** table-row 예시에 쓰는 한 행 */
function UserRow({ name, role, lastSeen }: { name: string; role: string; lastSeen: string }) {
  return (
    <div className="flex h-row-compact items-center gap-3 px-3">
      <span className="flex-1 truncate text-sm">{name}</span>
      <span className="text-muted-foreground hidden text-xs sm:inline">{role}</span>
      <span className="text-muted-foreground hidden text-xs md:inline">{lastSeen}</span>
      <Button variant="ghost" size="sm" aria-label={`'${name}' 편집`}>
        <Settings2 aria-hidden />
      </Button>
      <Button variant="ghost" size="sm" aria-label={`'${name}' 삭제`}>
        <Trash2 aria-hidden />
      </Button>
    </div>
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'page-header':
      return (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold">사용자</h4>
            <p className="text-muted-foreground mt-1 text-xs">워크스페이스에 속한 사용자 24명</p>
          </div>
          <Button size="sm">
            <Plus aria-hidden />
            사용자 추가
          </Button>
        </div>
      )

    case 'table-row':
      return (
        <div className="bg-surface divide-y overflow-hidden rounded-md border">
          <UserRow name="홍길동" role="관리자" lastSeen="2026-08-24" />
          <UserRow name="김서연" role="편집자" lastSeen="2026-08-21" />
        </div>
      )

    case 'confirm-dialog':
      return (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold">사용자 3명 삭제</p>
            <p className="text-muted-foreground mt-1 text-xs">
              선택한 사용자 3명의 계정과 API 키가 지워집니다. 되돌릴 수 없습니다.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" size="sm">
              취소
            </Button>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </div>
        </div>
      )

    case 'empty-state':
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div>
            <p className="text-sm font-semibold">아직 초대한 사용자가 없습니다</p>
            <p className="text-muted-foreground mt-1 text-xs">
              사용자를 초대하면 이 목록에 표시됩니다.
            </p>
          </div>
          <Button size="lg">
            <Plus aria-hidden />첫 사용자 초대
          </Button>
        </div>
      )

    case 'long-label':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-40">
            <Button size="sm">초대 메일 다시 보내기</Button>
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 컨테이너 폭입니다. 라벨을 접지 않고 버튼이 넘어갑니다.
          </p>
        </div>
      )

    case 'icon-only':
      return (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="icon" aria-label="사용자 검색">
            <Search aria-hidden />
          </Button>
          <code className="bg-muted rounded px-1.5 py-1 text-2xs">aria-label='사용자 검색'</code>
        </div>
      )

    case 'no-permission':
      return (
        <div className="flex flex-col items-start gap-2">
          <Button size="sm" disabled>
            <Plus aria-hidden />
            사용자 추가
          </Button>
          <p className="text-muted-foreground text-xs">
            사용자 추가는 워크스페이스 관리자만 할 수 있습니다.
          </p>
        </div>
      )

    case 'in-progress':
      return (
        <div className="flex flex-col items-start gap-2">
          <Button size="sm" disabled>
            <Loader2 className="animate-spin" aria-hidden />
            저장 중
          </Button>
          <p className="text-muted-foreground text-xs">
            저장이 끝나면 라벨이 '저장'으로 돌아갑니다.
          </p>
        </div>
      )

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <Button size="sm" className="w-full">
              <Plus aria-hidden />
              사용자 추가
            </Button>
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            폭이 좁으면 동작 하나를 가득 채웁니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderButton}
      preview={
        <Button data-anatomy="container">
          <Plus data-anatomy="prefix-icon" />
          <span data-anatomy="label">새 사용자</span>
          <ChevronRight data-anatomy="suffix-icon" />
        </Button>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
