import type { ComponentProps, ReactNode } from 'react'
import { Bell, Check, ChevronRight, Plus, ShieldAlert, UserPlus } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ItemVariant = ComponentProps<typeof Item>['variant']
type ItemSize = ComponentProps<typeof Item>['size']

function renderItem(options: RenderOptions) {
  const variant = (options.variant ?? 'default') as ItemVariant
  const size = (options.size ?? 'default') as ItemSize

  return (
    <Item variant={variant} size={size} className="w-72 hover:bg-transparent">
      <ItemMedia variant="icon">
        <Bell aria-hidden />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>새 댓글</ItemTitle>
        <ItemDescription>홍길동님이 댓글을 남겼습니다</ItemDescription>
      </ItemContent>
    </Item>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Item·ItemGroup과
 * Avatar·Button·Checkbox로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'item-vs-field':
      return kind === 'do' ? (
        <Item variant="outline" className="w-72 hover:bg-transparent">
          <ItemMedia variant="icon">
            <Check aria-hidden />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>이메일 인증 완료</ItemTitle>
            <ItemDescription>보기만 하는 상태 표시</ItemDescription>
          </ItemContent>
        </Item>
      ) : (
        <Item variant="outline" className="w-72 hover:bg-transparent" inert>
          <Checkbox defaultChecked />
          <ItemContent>
            <ItemTitle>마케팅 알림 받기</ItemTitle>
            <ItemDescription>이건 Field가 할 일이다</ItemDescription>
          </ItemContent>
        </Item>
      )

    case 'separator-between-items':
      return kind === 'do' ? (
        <ItemGroup className="w-64">
          <Item size="sm" className="hover:bg-transparent">
            <ItemContent>
              <ItemTitle>이름</ItemTitle>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item size="sm" className="hover:bg-transparent">
            <ItemContent>
              <ItemTitle>이메일</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      ) : (
        <ItemGroup className="w-64">
          <Item size="sm" className="hover:bg-transparent">
            <ItemContent>
              <ItemTitle>이름</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="sm" className="hover:bg-transparent">
            <ItemContent>
              <ItemTitle>이메일</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      )

    case 'static-row-cancels-hover':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <Item variant="muted" className="w-64 hover:bg-muted">
            <ItemContent>
              <ItemTitle>2026년 8월 26일 가입</ItemTitle>
            </ItemContent>
          </Item>
          <p className="text-muted-foreground text-12">hover:bg-transparent로 껐다 — 눌러도 아무 일도 없다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Item variant="muted" className="w-64">
            <ItemContent>
              <ItemTitle>2026년 8월 26일 가입</ItemTitle>
            </ItemContent>
          </Item>
          <p className="text-muted-foreground text-12">기본 hover가 그대로 남아 누를 수 있는 것처럼 보인다</p>
        </div>
      )

    case 'size-matches-density':
      return kind === 'do' ? (
        <ItemGroup className="w-56">
          {['이름', '역할', '소속'].map((label) => (
            <Item key={label} size="xs" className="hover:bg-transparent">
              <ItemContent>
                <ItemTitle>{label}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <ItemGroup className="w-56">
          {['이름', '역할', '소속'].map((label) => (
            <Item key={label} size="default" className="hover:bg-transparent">
              <ItemContent>
                <ItemTitle>{label}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'notification-list':
      return (
        <ItemGroup className="w-80">
          <Item className="hover:bg-transparent">
            <ItemMedia variant="icon">
              <Bell aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>새 댓글</ItemTitle>
              <ItemDescription>홍길동님이 댓글을 남겼습니다</ItemDescription>
            </ItemContent>
            <ItemActions>
              <span className="text-muted-foreground text-12">3분 전</span>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item className="hover:bg-transparent">
            <ItemMedia variant="icon">
              <ShieldAlert aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>새 기기 로그인</ItemTitle>
              <ItemDescription>알 수 없는 기기에서 로그인이 감지됐습니다</ItemDescription>
            </ItemContent>
            <ItemActions>
              <span className="text-muted-foreground text-12">1시간 전</span>
            </ItemActions>
          </Item>
        </ItemGroup>
      )

    case 'settings-row':
      return (
        <Item variant="outline" className="w-80 hover:bg-transparent">
          <ItemContent>
            <ItemTitle>2단계 인증</ItemTitle>
            <ItemDescription>로그인할 때마다 인증 코드를 요구합니다</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              설정
            </Button>
          </ItemActions>
        </Item>
      )

    case 'search-result':
      return (
        <Item className="w-80 hover:bg-transparent">
          <ItemMedia variant="avatar">
            <Avatar>
              <AvatarFallback>김</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>김민준</ItemTitle>
            <ItemDescription>제품 디자이너 · 팔로워 128명</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              <UserPlus aria-hidden />
              팔로우
            </Button>
          </ItemActions>
        </Item>
      )

    case 'option-picker':
      return (
        <ItemGroup className="w-80 gap-2">
          <Item variant="outline" className="border-primary hover:bg-transparent">
            <ItemContent>
              <ItemTitle>Starter</ItemTitle>
              <ItemDescription>개인 프로젝트에 맞는 기본 플랜</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Check className="text-primary" aria-hidden />
            </ItemActions>
          </Item>
          <Item variant="outline" className="hover:bg-transparent">
            <ItemContent>
              <ItemTitle>Team</ItemTitle>
              <ItemDescription>여럿이 함께 쓰는 협업 플랜</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="text-muted-foreground" aria-hidden />
            </ItemActions>
          </Item>
        </ItemGroup>
      )

    case 'no-media':
      return (
        <Item variant="outline" className="w-72 hover:bg-transparent">
          <ItemContent>
            <ItemTitle>결제 내역이 갱신됐습니다</ItemTitle>
            <ItemDescription>2026년 8월 청구서를 확인하세요</ItemDescription>
          </ItemContent>
        </Item>
      )

    case 'title-only':
      return (
        <Item variant="outline" className="w-72 hover:bg-transparent">
          <ItemMedia variant="icon">
            <Plus aria-hidden />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>새 프로젝트 만들기</ItemTitle>
          </ItemContent>
        </Item>
      )

    case 'long-description':
      return (
        <Item variant="outline" className="w-56 hover:bg-transparent">
          <ItemContent>
            <ItemTitle>공지사항</ItemTitle>
            <ItemDescription>
              2026년 9월 1일 오전 2시부터 4시까지 정기 점검이 진행되며 이 시간 동안 서비스 접속이 제한됩니다
            </ItemDescription>
          </ItemContent>
        </Item>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-56">
          <Item variant="outline" className="hover:bg-transparent">
            <ItemMedia variant="avatar">
              <Avatar>
                <AvatarFallback>박</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>박서연</ItemTitle>
              <ItemDescription>프런트엔드 엔지니어</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                메시지
              </Button>
            </ItemActions>
          </Item>
        </Bounds>
      )

    default:
      return null
  }
}

/** Container·Media·Content·Actions 넷 다 무대 안에 그대로 있다 — data-anatomy를
 * 직접 얹어 지시선이 실제 DOM 경계를 가리키게 한다(ToggleGroup 문서와 같은 자리). */
function AnatomyPreview() {
  return (
    <Item variant="outline" className="w-80 hover:bg-transparent" data-anatomy="container">
      <ItemMedia variant="icon" data-anatomy="media">
        <Bell aria-hidden />
      </ItemMedia>
      <ItemContent data-anatomy="content">
        <ItemTitle>새 댓글</ItemTitle>
        <ItemDescription>홍길동님이 댓글을 남겼습니다</ItemDescription>
      </ItemContent>
      <ItemActions data-anatomy="actions">
        <Button variant="ghost" size="sm">
          읽음
        </Button>
      </ItemActions>
    </Item>
  )
}

export function ItemPage() {
  const meta = getComponent('item')
  if (!meta) return <Placeholder title="Item 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderItem}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
