import type { ReactNode } from 'react'
import { User } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type AvatarSize = 'sm' | 'default' | 'lg'

/*
 * 네트워크 없이 항상 성공적으로 불러와지는 사진 자리표시자.
 * 인라인 SVG를 URL 인코딩한 data URI라 외부 요청이 없고, image 상태를
 * 전시할 때마다 로딩 성패가 갈리지 않는다.
 */
const PLACEHOLDER_PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23d9d2c5'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%238a7f68'/%3E%3Cpath d='M8 60c0-14 10-22 24-22s24 8 24 22' fill='%238a7f68'/%3E%3C/svg%3E"

/*
 * 의도적으로 실패하는 주소다 — 오타가 아니다. .invalid는 RFC 2606이
 * 정한, 어떤 DNS에서도 절대 해석되지 않는 예약 도메인이라 image 실패
 * 상태를 실행할 때마다 안정적으로 재현된다.
 */
const BROKEN_IMAGE_URL = 'https://avatar.invalid/broken.jpg'

/** Latin 이름은 단어 앞글자 최대 둘, 한글 등 한 단어 이름은 첫 글자 하나를 쓴다 */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length > 1) return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return name.slice(0, 1)
}

function renderAvatar(options: RenderOptions) {
  const size = (options.size ?? 'default') as AvatarSize
  const state = options.state ?? 'image'

  if (state === 'initials') {
    return (
      <Avatar size={size}>
        <AvatarFallback>{getInitials('홍길동')}</AvatarFallback>
      </Avatar>
    )
  }

  if (state === 'fallback') {
    return (
      <Avatar size={size}>
        <AvatarImage src={BROKEN_IMAGE_URL} alt="" />
        <AvatarFallback>
          <User className="size-1/2" />
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Avatar size={size}>
      <AvatarImage src={PLACEHOLDER_PHOTO} alt="홍길동" />
      <AvatarFallback>홍</AvatarFallback>
    </Avatar>
  )
}

function AvatarStack() {
  const names = ['홍길동', '김철수', '이영희']
  return (
    <div className="flex items-center">
      {names.map((name) => (
        <Avatar key={name} size="sm" className="ring-background -ml-2 ring-2 first:ml-0">
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <span className="bg-muted text-muted-foreground ring-background -ml-2 flex size-control-sm shrink-0 items-center justify-center rounded-full text-12 font-medium ring-2">
        +3
      </span>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'initials-fallback':
      return kind === 'do' ? (
        <Avatar>
          <AvatarFallback>{getInitials('홍길동')}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar>
          <AvatarFallback />
        </Avatar>
      )

    case 'not-a-name-substitute':
      return kind === 'do' ? (
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>{getInitials('홍길동')}</AvatarFallback>
          </Avatar>
          <span className="text-16">홍길동</span>
        </div>
      ) : (
        <Avatar size="sm">
          <AvatarFallback>{getInitials('홍길동')}</AvatarFallback>
        </Avatar>
      )

    case 'stack-with-count':
      return kind === 'do' ? (
        <AvatarStack />
      ) : (
        <div className="flex items-center">
          {['홍길동', '김철수', '이영희', '박민수', '최지우'].map((name) => (
            <Avatar key={name} size="sm" className="ring-background -ml-2 ring-2 first:ml-0">
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'user-list':
      return (
        <div className="flex flex-col gap-2">
          {['홍길동', '김철수'].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              <span className="text-16">{name}</span>
            </div>
          ))}
        </div>
      )

    case 'comment':
      return (
        <div className="flex items-start gap-2">
          <Avatar size="sm">
            <AvatarImage src={PLACEHOLDER_PHOTO} alt="홍길동" />
            <AvatarFallback>홍</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-16 font-medium">홍길동</p>
            <p className="text-muted-foreground text-12">이 항목 확인했습니다</p>
          </div>
        </div>
      )

    case 'assignee':
      return (
        <div className="bg-surface flex h-row-compact items-center gap-3 rounded-md border px-3">
          <span className="flex-1 truncate text-14">주문 20260824-001</span>
          <Avatar size="sm">
            <AvatarFallback>{getInitials('김철수')}</AvatarFallback>
          </Avatar>
        </div>
      )

    case 'stacked-list':
      return <AvatarStack />

    case 'image-failure':
      return (
        <Avatar>
          <AvatarImage src={BROKEN_IMAGE_URL} alt="이서연" />
          <AvatarFallback>{getInitials('이서연')}</AvatarFallback>
        </Avatar>
      )

    case 'single-char-name':
      return (
        <Avatar>
          <AvatarFallback>{getInitials('민')}</AvatarFallback>
        </Avatar>
      )

    case 'no-name':
      return (
        <Avatar>
          <AvatarFallback>
            <User className="size-1/2" />
          </AvatarFallback>
        </Avatar>
      )

    case 'narrow-screen':
      return (
        <Bounds className="flex w-32 items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>{getInitials('워크스페이스 전체 관리 권한을 가진 최고 관리자')}</AvatarFallback>
          </Avatar>
          <span className="text-16">워크스페이스 전체 관리 권한을 가진 최고 관리자</span>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Avatar는 겹침이 없는 유일한 컴포넌트다 — image·fallback 둘 다
 * data-anatomy="content"를 받는다. 한 인스턴스에는 둘 중 하나만
 * 실제로 DOM에 존재하므로(Radix가 상태에 따라 조건부로 마운트한다)
 * 같은 이름을 붙여도 겹치지 않는다. 이미지가 로드되기 전 짧은 순간엔
 * fallback이, 로드된 뒤엔 image가 측정된다.
 */
function AnatomyPreview() {
  return (
    <Avatar data-anatomy="container" size="lg">
      <AvatarImage data-anatomy="content" src={PLACEHOLDER_PHOTO} alt="홍길동" />
      <AvatarFallback data-anatomy="content">홍</AvatarFallback>
    </Avatar>
  )
}

export function AvatarPage() {
  const meta = getComponent('avatar')
  if (!meta) return <Placeholder title="Avatar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderAvatar}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
