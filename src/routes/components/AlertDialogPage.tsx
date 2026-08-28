import { useState, type ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { getComponent } from '@/data/registry'
import { cn } from '@/lib/utils'
import { Placeholder } from '@/routes/Placeholder'

type AlertDialogVariant = 'default' | 'destructive'

/*
 * variant는 컨테이너가 열려야 보이는 값이다. Alert Dialog도 Dialog처럼
 * 모달이라 강제로 열어 두면 같은 사고가 난다. 대신 트리거 자체를 값에
 * 맞게 다르게 꾸민다 — destructive는 위험 버튼으로. 무엇이 다른지는
 * 독자가 눌러서 본다. size는 여기 없다 — Properties에도 컴포넌트에도
 * 아예 두지 않는다. 경고 대화상자는 짧아야 한다.
 */
function renderAlertDialog(options: RenderOptions) {
  const variant = (options.variant ?? 'default') as AlertDialogVariant
  const isDestructive = variant === 'destructive'

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={isDestructive ? 'destructive' : 'outline'} size="sm">
          {isDestructive ? '사용자 삭제' : '변경 사항 적용'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDestructive ? "'홍길동'을 삭제하시겠습니까" : '변경 사항을 적용하시겠습니까'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDestructive
              ? '삭제하면 되돌릴 수 없습니다.'
              : '적용하면 워크스페이스의 모든 구성원에게 반영됩니다.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant={variant}>{isDestructive ? '삭제' : '적용'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/*
 * AlertDialogAction은 Radix의 Close라 눌리면 즉시 닫힌다. 실행이
 * 실패해 다시 시도할 수 있게 열어 두어야 하는 자리에서는 그 자리에
 * AlertDialogAction 대신 buttonVariants를 입힌 일반 button을 둔다 —
 * 실패를 흉내 내려고 상태를 하나 두었다.
 */
function ActionFailedExample() {
  const [failed, setFailed] = useState(false)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          첨부파일 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>'분기 보고서.pdf'를 삭제하시겠습니까</AlertDialogTitle>
          <AlertDialogDescription>
            {failed ? '삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.' : '삭제하면 되돌릴 수 없습니다.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <button type="button" className={cn(buttonVariants({ variant: 'destructive' }))} onClick={() => setFailed(true)}>
            삭제
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    /*
     * DO는 Alert Dialog로 삭제를 묻는다 — 바깥을 눌러도 닫히지 않고
     * 나가는 길이 취소 하나뿐이다. DON'T는 같은 상호작용을 Dialog로
     * 잘못 두는 경우다 — 닫기 X가 있고 바깥 클릭으로 잃을 것 없이
     * 닫히므로, 잃을 것이 있는 삭제 확인에는 맞지 않는다.
     */
    case 'distinguish-dialog':
      return kind === 'do' ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'홍길동'을 삭제하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>삭제하면 되돌릴 수 없습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
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
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'paired-actions':
      return kind === 'do' ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              워크스페이스 나가기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>워크스페이스에서 나가시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>나가면 다시 초대받아야 들어올 수 있습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction>나가기</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              워크스페이스 나가기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>워크스페이스에서 나가시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>나가면 다시 초대받아야 들어올 수 있습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>나가기</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'specific-title':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              게시글 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {kind === 'do' ? "'게시글 12건'을 삭제하시겠습니까" : '정말 삭제하시겠습니까'}
              </AlertDialogTitle>
              <AlertDialogDescription>삭제하면 되돌릴 수 없습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    /*
     * DO는 되돌릴 수 있는 '보관'을 곧바로 실행한다 — 되돌리는 길은
     * Toast 문서가 다룬다. DON'T는 같은 되돌릴 수 있는 동작에 Alert
     * Dialog를 씌워 확인을 소음으로 만드는 경우다.
     */
    case 'not-for-reversible':
      return kind === 'do' ? (
        <Button variant="outline" size="sm">
          대화 보관
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              대화 보관
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>대화를 보관하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>보관한 대화는 보관함에서 다시 볼 수 있습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction>보관</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'delete-confirm':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'홍길동'을 삭제하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>삭제하면 되돌릴 수 없습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'discard-changes':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              나가기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>저장하지 않은 변경 사항이 있습니다</AlertDialogTitle>
              <AlertDialogDescription>나가면 입력한 내용을 잃습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>계속 편집</AlertDialogCancel>
              <AlertDialogAction>나가기</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'revoke-permission':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              권한 회수
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'홍길동'의 관리자 권한을 회수하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>회수하면 모든 설정 접근 권한을 잃습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">회수</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'bulk-confirm':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              선택 항목 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'선택한 12건'을 삭제하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>삭제하면 되돌릴 수 없습니다. 아래 목록이 함께 지워집니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="rounded-md border text-16">
              {['홍길동', '김서연', '이서준'].map((name) => (
                <li key={name} className="border-b px-3 py-2 last:border-b-0">
                  {name}
                </li>
              ))}
            </ul>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'irreversible':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              저장소 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'프로젝트 저장소'를 삭제하시겠습니까</AlertDialogTitle>
              <AlertDialogDescription>
                삭제하면 되돌릴 수 없고, 저장소 안의 모든 파일이 함께 사라집니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'action-failed':
      return <ActionFailedExample />

    case 'long-body':
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              약관 확인 후 동의
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>이용 약관에 동의하십니까</AlertDialogTitle>
              <AlertDialogDescription>동의하면 계정 생성이 계속됩니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <div
              role="region"
              aria-label="이용 약관 본문"
              tabIndex={0}
              className="max-h-48 overflow-y-auto rounded-md text-16 outline-none focus-visible:ring-ring/50 focus-visible:ring-2"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <p key={i} className="text-muted-foreground py-1">
                  제{i + 1}조. 본문이 길어지면 컨테이너는 늘어나지 않고 이 영역 안에서 세로로 스크롤됩니다.
                </p>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction>동의</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full">
                계정 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>계정을 삭제하시겠습니까</AlertDialogTitle>
                <AlertDialogDescription>
                  좁은 화면에서도 컨테이너는 가장자리에 여백을 두고 너비를 채운다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대에는 trigger만 남는다. 덮개와 컨테이너는 화면 전체를
 * 덮으므로 무대 상자 안에 담을 방법이 없고, 억지로 가두면 실제 Alert
 * Dialog의 동작(뷰포트 기준 중앙 정렬, 바깥 클릭 차단)과 달라져
 * 문서가 거짓말을 하게 된다. 나머지 부위는 Usage에서 실제로 눌러
 * 확인한다.
 */
function AnatomyPreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-anatomy="trigger" variant="destructive">
          사용자 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>'홍길동'을 삭제하시겠습니까</AlertDialogTitle>
          <AlertDialogDescription>삭제하면 되돌릴 수 없습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive">삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function AlertDialogPage() {
  const meta = getComponent('alert-dialog')
  if (!meta) return <Placeholder title="Alert Dialog 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderAlertDialog}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
