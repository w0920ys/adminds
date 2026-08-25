import { useState, type ComponentProps, type ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Toast, ToastAction, ToastClose, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ToastVariant = ComponentProps<typeof Toast>['variant']

/** variant마다 실제로 어울리는 메시지. Badge·Alert와 같은 상태 색 체계를 쓴다 */
const VARIANT_MESSAGE: Record<string, string> = {
  default: '링크가 복사되었습니다',
  success: '변경 사항이 저장되었습니다',
  destructive: '삭제하지 못했습니다',
}

/*
 * Toast는 앱 전역에 단 하나뿐인 뷰포트(AppShell)로 Portal된다. 이
 * 문서는 같은 인스턴스를 Anatomy·Playground·Properties·Guidelines처럼
 * 여러 자리에 동시에, 제자리에 고정해 보여야 한다 — 전역 뷰포트를
 * 그대로 쓰면 전부 화면 오른쪽 아래 한 곳으로 몰리고 원래 자리에는
 * 빈 칸만 남는다(Select가 열린 목록을, Dialog가 덮개를 무대 밖에
 * 그린 것과 같은 문제). 그래서 이 문서 전용 Provider·뷰포트를 함께
 * 두어 격리된 컨텍스트 안에서 이 자리로만 Portal되게 한다 — 실제
 * 컴포넌트를 그대로 쓰면서도 제자리에 보인다. 실제 화면에서는 이렇게
 * 여러 인스턴스를 나란히 두지 않는다.
 *
 * duration을 Infinity로 고정해 정지된 문서 화면에 계속 보이게 한다.
 * 실제 Toast는 이렇게 붙박이로 있지 않고 사라진다 — 그 사실은
 * Anatomy와 Guidelines가 문구로 밝힌다. 진짜로 나타났다 사라지는
 * 모습은 Usage의 저장 완료 하나만, 이 문서 전용 뷰포트가 아니라
 * 실제 앱 뷰포트를 통해 보인다.
 */
function PinnedToast({ children }: { children: ReactNode }) {
  return (
    <ToastProvider duration={Infinity}>
      {children}
      <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
    </ToastProvider>
  )
}

function renderToast(options: RenderOptions) {
  const variant = (options.variant ?? 'default') as ToastVariant
  const layout = options.layout ?? 'message-only'
  return (
    <PinnedToast>
      <Toast variant={variant} className="w-72">
        <ToastTitle>{VARIANT_MESSAGE[variant ?? 'default']}</ToastTitle>
        {layout === 'with-action' && <ToastAction altText="되돌리기">되돌리기</ToastAction>}
        <ToastClose />
      </Toast>
    </PinnedToast>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Toast와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다. Usage의 저장 완료를
 * 뺀 나머지는 모두 위 PinnedToast로 고정해 두었다는 뜻이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'reading-time':
      return kind === 'do' ? (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>링크가 복사되었습니다</ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      ) : (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>
              요청하신 작업이 백그라운드에서 처리되기 시작했고 완료되면 별도의 알림으로 다시
              안내해 드리며 실패할 경우에는 재시도 방법도 함께 안내됩니다
            </ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'not-for-critical':
      return kind === 'do' ? (
        <Alert variant="destructive" className="w-72">
          <AlertTitle>삭제할 수 없습니다</AlertTitle>
        </Alert>
      ) : (
        <PinnedToast>
          <Toast variant="destructive" className="w-72">
            <ToastTitle>삭제할 수 없습니다</ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'action-only-for-undo':
      return kind === 'do' ? (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>게시글을 삭제했습니다</ToastTitle>
            <ToastAction altText="되돌리기">되돌리기</ToastAction>
            <ToastClose />
          </Toast>
        </PinnedToast>
      ) : (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>게시글을 삭제했습니다</ToastTitle>
            <ToastAction altText="되돌리기">되돌리기</ToastAction>
            <ToastAction altText="상세 보기">상세 보기</ToastAction>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    default:
      return null
  }
}

/*
 * 저장 완료만 실제로 나타났다 사라지는 진짜 예시다. AppShell이 앱
 * 전역에 둔 ToastProvider·ToastViewport를 그대로 쓴다 — PinnedToast를
 * 거치지 않는다. 버튼을 누르면 화면 오른쪽 아래에 실제 Toast가 떴다가
 * AppShell이 정한 5초 뒤에 스스로 사라진다.
 */
function LiveSaveToastDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-start gap-2">
      <Button size="sm" onClick={() => setOpen(true)}>
        저장
      </Button>
      <p className="text-muted-foreground text-2xs">눌러보면 화면 오른쪽 아래에 실제로 나타났다 사라진다</p>
      <Toast variant="success" open={open} onOpenChange={setOpen} className="w-72">
        <ToastTitle>변경 사항이 저장되었습니다</ToastTitle>
        <ToastClose />
      </Toast>
    </div>
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'save-complete':
      return <LiveSaveToastDemo />

    case 'delete-undo':
      return (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>게시글을 삭제했습니다</ToastTitle>
            <ToastAction altText="되돌리기">되돌리기</ToastAction>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'copy-complete':
      return (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>초대 링크가 클립보드에 복사되었습니다</ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'background-task-done':
      return (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>대량 내보내기가 끝났습니다</ToastTitle>
            <ToastAction altText="다운로드">다운로드</ToastAction>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'stacked':
      return (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>초대 링크가 복사되었습니다</ToastTitle>
            <ToastClose />
          </Toast>
          <Toast variant="success" className="w-72">
            <ToastTitle>변경 사항이 저장되었습니다</ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'long-message':
      return (
        <PinnedToast>
          <Toast className="w-72">
            <ToastTitle>
              등록된 카드의 유효기간이 지나 다음 결제일에 정기 결제가 실패할 수 있습니다
            </ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'error':
      return (
        <PinnedToast>
          <Toast variant="destructive" className="w-72">
            <ToastTitle>변경 사항을 저장하지 못했습니다</ToastTitle>
            <ToastClose />
          </Toast>
        </PinnedToast>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <PinnedToast>
            <Toast className="w-full">
              <ToastTitle>저장되었습니다</ToastTitle>
              <ToastClose />
            </Toast>
          </PinnedToast>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대 전용 PinnedToast 인스턴스. 컨테이너·메시지·동작·닫기
 * 넷 모두 실제 Toast의 진짜 DOM이다 — 위 PinnedToast 설명대로 이
 * 문서 전용 뷰포트가 무대 안에 있어 stage.querySelector가 찾아낸다.
 */
function AnatomyPreview() {
  return (
    <PinnedToast>
      <Toast data-anatomy="container" variant="success" className="w-72">
        <ToastTitle data-anatomy="message">변경 사항이 저장되었습니다</ToastTitle>
        <ToastAction data-anatomy="action" altText="되돌리기">
          되돌리기
        </ToastAction>
        <ToastClose data-anatomy="close" />
      </Toast>
    </PinnedToast>
  )
}

export function ToastPage() {
  const meta = getComponent('toast')
  if (!meta) return <Placeholder title="Toast 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderToast}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
