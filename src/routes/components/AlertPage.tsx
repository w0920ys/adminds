import type { ComponentProps, ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type AlertVariant = ComponentProps<typeof Alert>['variant']

/** 아이콘은 페이지가 고른다. Alert는 색만 물려줄 뿐 어떤 아이콘인지 알지 않는다 */
const VARIANT_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: OctagonAlert,
} as const

/** variant마다 실제로 어울리는 제목. Badge와 같은 상태 색 체계를 쓴다 */
const VARIANT_TITLE: Record<string, string> = {
  info: '1월 정기 점검 안내',
  success: '변경 사항이 저장되었습니다',
  warning: '플랜이 3일 뒤 만료됩니다',
  destructive: '삭제할 수 없습니다',
}

function renderAlert(options: RenderOptions) {
  const { variant, layout } = options
  const Icon = VARIANT_ICON[(variant as keyof typeof VARIANT_ICON) ?? 'info']
  const title = VARIANT_TITLE[variant] ?? '제목'

  return (
    <Alert variant={variant as AlertVariant} className="w-80">
      <Icon aria-hidden />
      <div className="flex flex-1 flex-col gap-1">
        <AlertTitle>{title}</AlertTitle>
        {layout !== 'title-only' && (
          <AlertDescription>자세한 설명이 이 자리에 들어갑니다</AlertDescription>
        )}
        {layout === 'with-action' && (
          <div className="mt-1.5">
            <Button size="sm" variant="outline">
              자세히 보기
            </Button>
          </div>
        )}
      </div>
    </Alert>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Alert와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'color-alone':
      return kind === 'do' ? (
        <Alert variant="destructive" className="w-72">
          <OctagonAlert aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>삭제할 수 없습니다</AlertTitle>
            <AlertDescription>연결된 주문이 있는 사용자는 삭제할 수 없습니다</AlertDescription>
          </div>
        </Alert>
      ) : (
        <Alert variant="destructive" className="w-72">
          <OctagonAlert aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>문제가 발생했습니다</AlertTitle>
          </div>
        </Alert>
      )

    case 'include-action-when-actionable':
      return kind === 'do' ? (
        <Alert variant="warning" className="w-72">
          <AlertTriangle aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>저장 공간이 얼마 남지 않았습니다</AlertTitle>
            <AlertDescription>10% 미만입니다</AlertDescription>
            <div className="mt-1.5">
              <Button size="sm" variant="outline">
                요금제 변경
              </Button>
            </div>
          </div>
        </Alert>
      ) : (
        <Alert variant="warning" className="w-72">
          <AlertTriangle aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>저장 공간이 얼마 남지 않았습니다</AlertTitle>
            <AlertDescription>10% 미만입니다</AlertDescription>
          </div>
        </Alert>
      )

    case 'no-stacking':
      return kind === 'do' ? (
        <Alert variant="info" className="w-72">
          <Info aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>1월 정기 점검 안내</AlertTitle>
          </div>
        </Alert>
      ) : (
        <div className="flex w-72 flex-col gap-2">
          <Alert variant="info" className="w-full">
            <Info aria-hidden />
            <div className="flex flex-1 flex-col gap-1">
              <AlertTitle>1월 정기 점검 안내</AlertTitle>
            </div>
          </Alert>
          <Alert variant="warning" className="w-full">
            <AlertTriangle aria-hidden />
            <div className="flex flex-1 flex-col gap-1">
              <AlertTitle>플랜이 3일 뒤 만료됩니다</AlertTitle>
            </div>
          </Alert>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'save-result':
      return (
        <Alert variant="success" className="w-72" live="assertive">
          <CheckCircle2 aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>변경 사항이 저장되었습니다</AlertTitle>
          </div>
          <button
            type="button"
            aria-label="닫기"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X aria-hidden className="size-4" />
          </button>
        </Alert>
      )

    case 'permission-notice':
      return (
        <Alert variant="info" className="w-72">
          <Info aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>편집 권한이 없습니다</AlertTitle>
            <AlertDescription>관리자에게 요청하세요</AlertDescription>
          </div>
        </Alert>
      )

    case 'expiry-notice':
      return (
        <Alert variant="warning" className="w-72">
          <AlertTriangle aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>플랜이 3일 뒤 만료됩니다</AlertTitle>
            <AlertDescription>만료되면 일부 기능을 쓸 수 없습니다</AlertDescription>
            <div className="mt-1.5">
              <Button size="sm" variant="outline">
                요금제 변경
              </Button>
            </div>
          </div>
        </Alert>
      )

    case 'maintenance-notice':
      return (
        <Alert variant="info" className="w-72">
          <Info aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>1월 정기 점검 안내</AlertTitle>
            <AlertDescription>1월 15일 02:00~04:00에는 접속할 수 없습니다</AlertDescription>
          </div>
        </Alert>
      )

    case 'long-body':
      return (
        <Alert variant="warning" className="w-64">
          <AlertTriangle aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>결제 정보를 확인하세요</AlertTitle>
            <AlertDescription>
              등록된 카드의 유효기간이 지났습니다. 새 카드를 등록하지 않으면 다음 결제일에 정기
              결제가 실패하고 워크스페이스 이용이 제한됩니다
            </AlertDescription>
          </div>
        </Alert>
      )

    case 'multiple-actions':
      return (
        <Alert variant="destructive" className="w-72">
          <OctagonAlert aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>초대를 취소하시겠습니까</AlertTitle>
            <div className="mt-1.5 flex gap-2">
              <Button size="sm" variant="destructive">
                초대 취소
              </Button>
              <Button size="sm" variant="ghost">
                유지
              </Button>
            </div>
          </div>
        </Alert>
      )

    case 'inside-list':
      return (
        <div className="flex w-72 flex-col gap-2">
          <Alert variant="warning" className="w-full">
            <AlertTriangle aria-hidden />
            <div className="flex flex-1 flex-col gap-1">
              <AlertTitle>2건이 곧 만료됩니다</AlertTitle>
            </div>
          </Alert>
          <div className="bg-surface divide-y overflow-hidden rounded-md border">
            <div className="flex h-row-compact items-center px-3 text-sm">플랜 A</div>
            <div className="flex h-row-compact items-center px-3 text-sm">플랜 B</div>
          </div>
        </div>
      )

    case 'narrow-screen':
      return (
        <Alert variant="warning" className="w-48">
          <AlertTriangle aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>플랜이 3일 뒤 만료됩니다</AlertTitle>
          </div>
        </Alert>
      )

    default:
      return null
  }
}

export function AlertPage() {
  const meta = getComponent('alert')
  if (!meta) return <Placeholder title="Alert 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderAlert}
      preview={
        <Alert variant="warning" className="w-80">
          <AlertTriangle data-anatomy="icon" aria-hidden />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle data-anatomy="title">플랜이 3일 뒤 만료됩니다</AlertTitle>
            <AlertDescription data-anatomy="body">
              만료되면 일부 기능을 쓸 수 없습니다
            </AlertDescription>
            <div data-anatomy="action" className="mt-1.5">
              <Button size="sm" variant="outline">
                요금제 변경
              </Button>
            </div>
          </div>
          <button
            type="button"
            data-anatomy="dismiss"
            aria-label="닫기"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X aria-hidden className="size-4" />
          </button>
        </Alert>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
