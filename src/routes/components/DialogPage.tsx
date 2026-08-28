import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Placeholder } from '@/routes/Placeholder'

type DialogVariant = 'default' | 'destructive'

/*
 * variant는 컨테이너가 열려야 보이는 값이다. Dialog는 Select처럼
 * 모달이라 강제로 열어 두면 같은 사고가 난다. 대신 트리거 자체를 값에
 * 맞게 다르게 꾸민다 — destructive는 위험 버튼으로. 무엇이 다른지는
 * 독자가 눌러서 본다. size는 여기 없다 — Properties에는 아예 두지
 * 않는다(registry의 anatomy 옆 주석 참고), sm·default·lg는 Usage의
 * 짧은 입력·상세 미리보기·대량 작업 확인에서 실제로 열어 본다.
 */
function renderDialog(options: RenderOptions) {
  const variant = (options.variant ?? 'default') as DialogVariant
  const isDestructive = variant === 'destructive'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isDestructive ? 'destructive' : 'outline'} size="sm">
          {isDestructive ? '사용자 삭제' : '상세 보기'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isDestructive ? "'홍길동'을 삭제하시겠습니까" : '사용자 정보'}</DialogTitle>
          <DialogDescription>
            {isDestructive ? '삭제하면 되돌릴 수 없습니다.' : '가입일과 최근 접속 이력을 확인합니다.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant={isDestructive ? 'destructive' : 'default'}>{isDestructive ? '삭제' : '확인'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'action-order':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              항목 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'항목 3건'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            {kind === 'do' ? (
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button variant="destructive">삭제</Button>
              </DialogFooter>
            ) : (
              <DialogFooter className="sm:flex-row-reverse sm:justify-end">
                <Button variant="destructive">삭제</Button>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )

    case 'destructive-title':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              게시글 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{kind === 'do' ? "'게시글 12건'을 삭제하시겠습니까" : '정말 삭제하시겠습니까'}</DialogTitle>
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

    case 'outside-click':
      return kind === 'do' ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              변경 사항 확인
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>변경 사항을 저장하시겠습니까</DialogTitle>
              <DialogDescription>입력 중인 내용이 없어 바깥을 눌러도 잃을 것이 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              새 항목 추가
            </Button>
          </DialogTrigger>
          <DialogContent
            size="sm"
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>새 항목 추가</DialogTitle>
              <DialogDescription>입력 중인 내용이 있으므로 바깥 클릭으로는 닫히지 않는다.</DialogDescription>
            </DialogHeader>
            <Input placeholder="항목 이름" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'delete-confirm':
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

    case 'short-input':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              이름 바꾸기
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>워크스페이스 이름 바꾸기</DialogTitle>
            </DialogHeader>
            <Input defaultValue="우리 팀 워크스페이스" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'detail-preview':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              상세 보기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>주문 20260824-001</DialogTitle>
              <DialogDescription>2026년 8월 24일에 접수된 주문입니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'bulk-confirm':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              선택 항목 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>'선택한 12건'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>삭제하면 되돌릴 수 없습니다. 아래 목록이 함께 지워집니다.</DialogDescription>
            </DialogHeader>
            <ul className="rounded-md border text-16">
              {['홍길동', '김서연', '이서준'].map((name) => (
                <li key={name} className="border-b px-3 py-2 last:border-b-0">
                  {name}
                </li>
              ))}
            </ul>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button variant="destructive">삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'long-body':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              약관 보기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>이용 약관</DialogTitle>
            </DialogHeader>
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'form-inside':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              새 프로젝트
            </Button>
          </DialogTrigger>
          <DialogContent size="sm" onPointerDownOutside={(event) => event.preventDefault()}>
            <DialogHeader>
              <DialogTitle>새 프로젝트</DialogTitle>
              <DialogDescription>입력 중인 내용이 있으므로 바깥 클릭으로는 닫히지 않는다.</DialogDescription>
            </DialogHeader>
            <Input placeholder="프로젝트 이름" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button>만들기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'stacked-dialogs':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              권한 변경
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'의 권한 변경</DialogTitle>
              <DialogDescription>관리자 권한을 부여하면 모든 설정에 접근할 수 있습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>적용</Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogHeader>
                    <DialogTitle>관리자 권한을 부여하시겠습니까</DialogTitle>
                    <DialogDescription>안쪽 Dialog가 바깥 Dialog 위에 쌓인다. 닫으면 바깥으로 돌아간다.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button>확인</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                상세 보기
              </Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>사용자 정보</DialogTitle>
                <DialogDescription>좁은 화면에서도 컨테이너는 가장자리에 여백을 두고 너비를 채운다.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">닫기</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대에는 trigger만 남는다. 덮개와 컨테이너는 화면 전체를
 * 덮으므로 무대 상자 안에 담을 방법이 없고, 억지로 가두면 실제
 * Dialog의 동작(뷰포트 기준 중앙 정렬)과 달라져 문서가 거짓말을 하게
 * 된다. 나머지 부위는 Usage에서 실제로 눌러 확인한다.
 */
function AnatomyPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-anatomy="trigger" variant="outline">
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
}

export function DialogPage() {
  const meta = getComponent('dialog')
  if (!meta) return <Placeholder title="Dialog 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderDialog}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
