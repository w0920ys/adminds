import type { ReactNode } from 'react'
import { Clock, Menu } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/** 여러 예시가 공유하는 알림 항목 선택지 */
const NOTIFICATION_OPTIONS = [
  { id: 'comment', label: '댓글' },
  { id: 'mention', label: '멘션' },
  { id: 'notice', label: '공지' },
]

/** Playground 전용(Properties는 축이 없어 비어 있다) — 트리거를 눌러 오른쪽에서 여는 인스턴스 하나 */
function renderSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          알림 설정
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>알림 설정</SheetTitle>
          <SheetDescription>어떤 활동에 알림을 받을지 고릅니다.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          {NOTIFICATION_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked={option.id !== 'notice'} />
              {option.label}
            </label>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button>저장</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    /*
     * DO는 목록을 곁에 남긴 채 이어서 편집하는 Sheet를 보인다 — 목록
     * 자체는 실제 화면이 아니라 이 예시만을 위한 가짜 맥락이라
     * 문서의 구조(h2·h3)와 섞이지 않도록 <h4>로 적는다. DON'T는 같은
     * Sheet를 '정말 삭제하시겠습니까'처럼 묻고 답하면 원래 자리로
     * 돌아가는 확인 용도로 잘못 쓴 경우다 — 이런 상호작용은 Dialog다.
     */
    case 'distinguish-dialog':
      return kind === 'do' ? (
        <div className="flex w-full flex-col gap-2">
          <h4 className="text-muted-foreground text-2xs font-bold tracking-widest">사용자 목록</h4>
          <ul className="rounded-md border text-sm">
            {['홍길동', '김서연'].map((name) => (
              <li key={name} className="flex items-center justify-between border-b px-3 py-2 last:border-b-0">
                {name}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      편집
                    </Button>
                  </SheetTrigger>
                  <SheetContent size="sm">
                    <SheetHeader>
                      <SheetTitle>'{name}' 편집</SheetTitle>
                    </SheetHeader>
                    <Input defaultValue={name} />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline">취소</Button>
                      </SheetClose>
                      <Button>저장</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>정말 삭제하시겠습니까</SheetTitle>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Button variant="destructive">삭제</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'consistent-side':
      return (
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                사용자 편집
              </Button>
            </SheetTrigger>
            <SheetContent size="sm" side="right">
              <SheetHeader>
                <SheetTitle>사용자 편집</SheetTitle>
              </SheetHeader>
              <Input defaultValue="홍길동" />
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                상품 편집
              </Button>
            </SheetTrigger>
            <SheetContent size="sm" side={kind === 'do' ? 'right' : 'left'}>
              <SheetHeader>
                <SheetTitle>상품 편집</SheetTitle>
              </SheetHeader>
              <Input defaultValue="키보드" />
            </SheetContent>
          </Sheet>
        </div>
      )

    case 'no-nested-sheet':
      return kind === 'do' ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              권한 변경
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>'홍길동'의 권한 변경</SheetTitle>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>적용</Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogHeader>
                    <DialogTitle>관리자 권한을 부여하시겠습니까</DialogTitle>
                    <DialogDescription>확인이 더 필요하면 Sheet 위에 Dialog를 연다.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button>확인</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              권한 변경
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>'홍길동'의 권한 변경</SheetTitle>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>적용</Button>
                </SheetTrigger>
                <SheetContent size="sm">
                  <SheetHeader>
                    <SheetTitle>관리자 권한을 부여하시겠습니까</SheetTitle>
                    <SheetDescription>안쪽 Sheet가 바깥 Sheet 위에 쌓이면 어느 쪽을 닫아야 뒤로 가는지 알 수 없다.</SheetDescription>
                  </SheetHeader>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">취소</Button>
                    </SheetClose>
                    <Button>확인</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'outside-click':
      return kind === 'do' ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              변경 사항 확인
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>변경 사항을 저장하시겠습니까</SheetTitle>
              <SheetDescription>입력 중인 내용이 없어 바깥을 눌러도 잃을 것이 없습니다.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Button>저장</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              새 프로젝트
            </Button>
          </SheetTrigger>
          <SheetContent size="sm" onPointerDownOutside={(event) => event.preventDefault()}>
            <SheetHeader>
              <SheetTitle>새 프로젝트</SheetTitle>
              <SheetDescription>입력 중인 내용이 있으므로 바깥 클릭으로는 닫히지 않는다.</SheetDescription>
            </SheetHeader>
            <Input placeholder="프로젝트 이름" />
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Button>만들기</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'pin-header-footer':
      return kind === 'do' ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              이용 약관
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>이용 약관</SheetTitle>
            </SheetHeader>
            <div className="max-h-48 overflow-y-auto text-sm">
              {Array.from({ length: 8 }).map((_, i) => (
                <p key={i} className="text-muted-foreground py-1">
                  제{i + 1}조. 본문만 스크롤되고 머리와 발은 고정됩니다.
                </p>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">닫기</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              이용 약관
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <p className="text-sm font-semibold">이용 약관</p>
            {Array.from({ length: 8 }).map((_, i) => (
              <p key={i} className="text-muted-foreground text-sm">
                제{i + 1}조. Header·Footer 없이 본문과 한 덩어리로 두면 전체가 함께 밀려난다.
              </p>
            ))}
            <SheetClose asChild>
              <Button variant="outline">닫기</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'filter-panel':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              필터
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>상태로 거르기</SheetTitle>
              <SheetDescription>조건에 맞는 항목만 목록에 남깁니다.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {['활성', '정지', '탈퇴'].map((label, i) => (
                <label key={label} className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked={i === 0} />
                  {label}
                </label>
              ))}
            </div>
            <SheetFooter>
              <Button variant="outline">초기화</Button>
              <SheetClose asChild>
                <Button>적용</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'detail-edit':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              상세 편집
            </Button>
          </SheetTrigger>
          <SheetContent side="right" size="lg">
            <SheetHeader>
              <SheetTitle>'홍길동' 정보 편집</SheetTitle>
              <SheetDescription>필드가 많은 편집 폼은 lg 크기로 넉넉하게 연다.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sheet-detail-name" className="text-sm font-medium">
                  이름
                </label>
                <Input id="sheet-detail-name" defaultValue="홍길동" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sheet-detail-email" className="text-sm font-medium">
                  이메일
                </label>
                <Input id="sheet-detail-email" defaultValue="hong@example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sheet-detail-role" className="text-sm font-medium">
                  역할
                </label>
                <Input id="sheet-detail-role" defaultValue="운영자" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Button>저장</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'narrow-nav':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="메뉴 열기">
              <Menu aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" size="sm">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {['대시보드', '사용자', '주문', '설정'].map((label) => (
                <SheetClose asChild key={label}>
                  <Button variant="ghost" className="justify-start">
                    {label}
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      )

    case 'activity-log':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Clock aria-hidden />
              활동 기록
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>최근 활동</SheetTitle>
            </SheetHeader>
            <ul className="flex flex-col gap-2 overflow-y-auto text-sm">
              {['상태가 활성으로 바뀜', '권한이 변경됨', '메모가 추가됨'].map((entry, i) => (
                <li key={entry} className="border-b pb-2 last:border-0">
                  <p>{entry}</p>
                  <p className="text-muted-foreground text-xs">2026-08-{String(24 - i).padStart(2, '0')}</p>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      )

    case 'long-body':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              약관 보기
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>이용 약관</SheetTitle>
            </SheetHeader>
            <div
              role="region"
              aria-label="이용 약관 본문"
              tabIndex={0}
              className="max-h-48 overflow-y-auto rounded-md text-sm outline-none focus-visible:ring-ring/50 focus-visible:ring-2"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <p key={i} className="text-muted-foreground py-1">
                  제{i + 1}조. 본문이 길어지면 머리와 발은 그대로 있고 이 영역만 세로로 스크롤됩니다.
                </p>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">닫기</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'form-inside':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              새 항목 추가
            </Button>
          </SheetTrigger>
          <SheetContent size="sm" onPointerDownOutside={(event) => event.preventDefault()}>
            <SheetHeader>
              <SheetTitle>새 항목 추가</SheetTitle>
              <SheetDescription>입력 중인 내용이 있으므로 바깥 클릭으로는 닫히지 않는다.</SheetDescription>
            </SheetHeader>
            <Input placeholder="항목 이름" />
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">취소</Button>
              </SheetClose>
              <Button>추가</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'top-bottom':
      return (
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                공지
              </Button>
            </SheetTrigger>
            <SheetContent side="top" size="sm">
              <SheetHeader>
                <SheetTitle>새 공지가 있습니다</SheetTitle>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">확인</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                활동 기록
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" size="sm">
              <SheetHeader>
                <SheetTitle>최근 활동</SheetTitle>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">닫기</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                상세 보기
              </Button>
            </SheetTrigger>
            <SheetContent size="sm">
              <SheetHeader>
                <SheetTitle>사용자 정보</SheetTitle>
                <SheetDescription>좁은 화면에서도 컨테이너는 가장자리에 붙어 너비를 채운다.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">닫기</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Anatomy 무대에는 trigger만 남는다. 덮개와 컨테이너는 화면 전체를
 * 덮으므로 무대 상자 안에 담을 방법이 없고, 억지로 가두면 실제
 * Sheet의 동작(가장자리에 붙는 배치)과 달라져 문서가 거짓말을 하게
 * 된다. 나머지 부위는 Usage에서 실제로 눌러 확인한다.
 */
function AnatomyPreview() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button data-anatomy="trigger" variant="outline">
          알림 설정
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>알림 설정</SheetTitle>
          <SheetDescription>어떤 활동에 알림을 받을지 고릅니다.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          {NOTIFICATION_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked={option.id !== 'notice'} />
              {option.label}
            </label>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button>저장</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SheetPage() {
  const meta = getComponent('sheet')
  if (!meta) return <Placeholder title="Sheet 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSheet}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
