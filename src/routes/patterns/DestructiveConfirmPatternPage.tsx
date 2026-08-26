import { useState, type ReactNode } from 'react'
import { PatternPage } from '@/components/docs/PatternPage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Toast, ToastAction, ToastClose, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

/*
 * Example은 흐름 전체를 한 조각에 담는다 — 버튼을 눌러 Dialog를 열고,
 * 삭제를 누르면 Dialog가 닫히며 그 자리에 Toast가 뜬다. Dialog는
 * `open`의 초기값이 `false`라 닫힌 채로 마운트된다.
 *
 * 이 Toast에는 되돌리기를 두지 않는다 — 본문이 "삭제하면 되돌릴 수
 * 없습니다"라고 말하기 때문이다. 되돌리기가 있는 쪽은 undo-in-toast
 * 지침의 do 예시에서 ToastAction으로 보인다. 문구와 화면이 서로
 * 어긋나면 안 된다.
 *
 * Toast를 예시 액자 안에서 보이는 방법은 ToastPage와 같다. 지역
 * ToastProvider를 열고 ToastViewport를 그 자리에 세운 뒤
 * duration={Infinity}로 사라지지 않게 한다.
 */
function DestructiveFlow() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <ToastProvider duration={Infinity}>
      <div className="flex flex-col items-start gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>
                이 사용자의 주문 12건도 함께 지워집니다. 삭제하면 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(false)
                  setDone(true)
                }}
              >
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {done && (
          <Toast className="w-full max-w-72" onOpenChange={(next) => !next && setDone(false)}>
            <ToastTitle>'홍길동'을 삭제했습니다</ToastTitle>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
      </div>
    </ToastProvider>
  )
}

/*
 * Guideline 예시. Dialog는 DialogPage와 같은 방법으로 트리거 뒤에
 * 닫힌 채로 둔다 — 목업을 그리지 않고, 열려 있는 상태로 마운트하지
 * 않는다.
 */
function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'name-the-target':
      // do: 제목이 대상의 이름을 말한다. dont: 무엇을 지우는지 제목만으로는 알 수 없다.
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{kind === 'do' ? "'홍길동'을 삭제하시겠습니까" : '삭제하시겠습니까'}</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'show-the-count':
      // do: 몇 건인지 제목에 적는다. dont: 개수 없이 "항목"이라고만 적는다.
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              선택 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{kind === 'do' ? '선택한 12건을 삭제합니다' : '선택한 항목을 삭제합니다'}</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'undo-in-toast':
      // do: 되돌릴 수 있는 동작에는 Toast에 되돌리기를 둔다.
      // dont: 되돌릴 수 있는데도 대화상자로 한 번 더 묻는다 — 되돌리기 버튼이 또 다른 확인을 연다.
      return kind === 'do' ? (
        <ToastProvider duration={Infinity}>
          <Toast className="w-full max-w-72">
            <ToastTitle>게시글을 삭제했습니다</ToastTitle>
            <ToastAction altText="되돌리기">되돌리기</ToastAction>
            <ToastClose />
          </Toast>
          <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
        </ToastProvider>
      ) : (
        // 되돌리기를 누르면 곧장 되돌리는 대신 Dialog가 한 번 더 묻는다.
        // DialogTrigger가 ToastAction을 그대로 감싸 실제 ToastAction의
        // DOM에 Dialog를 여는 동작을 얹는다 — 텍스트만 흉내 낸 버튼이 아니다.
        <ToastProvider duration={Infinity}>
          <div className="flex flex-col items-start gap-4">
            <Dialog>
              <Toast className="w-full max-w-72">
                <ToastTitle>게시글을 삭제했습니다</ToastTitle>
                <DialogTrigger asChild>
                  <ToastAction altText="되돌리기">되돌리기</ToastAction>
                </DialogTrigger>
                <ToastClose />
              </Toast>
              <DialogContent size="sm">
                <DialogHeader>
                  <DialogTitle>되돌리시겠습니까</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">아니요</Button>
                  </DialogClose>
                  <Button>되돌리기</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
          </div>
        </ToastProvider>
      )

    case 'say-when-irreversible':
      // do: 본문에 되돌릴 수 없다고 적는다. dont: 본문 없이 제목만 두고 실행 버튼을 붉게 칠한다.
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'을 삭제하시겠습니까</DialogTitle>
              {kind === 'do' && (
                <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    default:
      return null
  }
}

/** delete-one: 제목에 대상의 이름을 적는다 */
function DeleteOneCase() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          문서 삭제
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>'2026년 3월 보고서'를 삭제하시겠습니까</DialogTitle>
          <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** delete-many: 제목에 개수를 적고 본문에 무엇이 함께 지워지는지 적는다 */
function DeleteManyCase() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          선택 항목 삭제
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>선택한 12건을 삭제하시겠습니까</DialogTitle>
          <DialogDescription>
            선택한 게시글과 그에 달린 댓글이 모두 함께 지워집니다. 삭제하면 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/*
 * irreversible: 본문에 되돌릴 수 없다고 적고 Toast에 되돌리기를 두지
 * 않는다. 대상이 사용자 삭제(Example)와 겹치지 않도록 API 키 삭제로
 * 둔다.
 */
function IrreversibleCase() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <ToastProvider duration={Infinity}>
      <div className="flex flex-col items-start gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              API 키 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'프로덕션 키'를 삭제하시겠습니까</DialogTitle>
              <DialogDescription>
                이 키를 쓰는 모든 연동이 즉시 끊깁니다. 삭제하면 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(false)
                  setDone(true)
                }}
              >
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {done && (
          <Toast className="w-full max-w-72" onOpenChange={(next) => !next && setDone(false)}>
            <ToastTitle>'프로덕션 키'를 삭제했습니다</ToastTitle>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
      </div>
    </ToastProvider>
  )
}

/*
 * failed: destructive Toast로 알린다. Dialog는 닫지 않고 다시 시도할
 * 수 있게 둔다 — 확인 버튼을 눌러도 setOpen(false)를 부르지 않는다.
 */
function FailedCase() {
  const [failed, setFailed] = useState(false)

  return (
    <ToastProvider duration={Infinity}>
      <div className="flex flex-col items-start gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => setFailed(true)}>
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {failed && (
          <Toast
            variant="destructive"
            className="w-full max-w-72"
            onOpenChange={(next) => !next && setFailed(false)}
          >
            <ToastTitle>삭제하지 못했습니다</ToastTitle>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
      </div>
    </ToastProvider>
  )
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'delete-one':
      return <DeleteOneCase />
    case 'delete-many':
      return <DeleteManyCase />
    case 'irreversible':
      return <IrreversibleCase />
    case 'failed':
      return <FailedCase />
    default:
      return null
  }
}

export function DestructiveConfirmPatternPage() {
  const meta = getPattern('destructive-confirm')
  if (!meta) return <Placeholder title="Destructive confirm 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<DestructiveFlow />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
