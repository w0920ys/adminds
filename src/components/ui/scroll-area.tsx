import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'

/*
 * 굴리는 일은 브라우저가 그대로 한다. Radix가 대신하는 것은 스크롤바를
 * 그리는 일뿐이다 — 기본 스크롤바는 운영체제마다 다르게 생겼고 다크
 * 모드에서 색이 따라오지 않는다.
 *
 * 이 컴포넌트는 자기 크기를 정하지 않는다. 부모가 높이나 너비를 주지
 * 않으면 아무것도 굴러가지 않고 내용이 그대로 늘어난다. 잘못 쓰는 가장
 * 흔한 방식이라 지침의 첫 줄에도 같은 말이 있다.
 */
function ScrollArea({
  className,
  children,
  type = 'hover',
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'vertical' | 'horizontal' | 'both'
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/*
        Viewport에 포커스 링을 둔다. Radix는 여기에 tabIndex를 주지 않지만,
        그것이 이 요소가 포커스를 못 받는다는 뜻은 아니다 — 실제로 넘치는
        스크롤 컨테이너는 브라우저가 스스로 포커스 가능한 자리로 다룬다
        (Chrome 127+의 keyboard-focusable scrollers). 안에 포커스 가능한
        요소가 없는 순수 텍스트 상자가 바로 그 대상이고, Chrome에서
        el.focus()가 실제로 먹는 것을 이 저장소의 Viewport로 확인했다.
        링을 걷어내면 그 자리에 브라우저 기본 outline이 대신 떠서, ui
        컴포넌트가 스물한 자리에서 똑같이 쓰는 링과 여기서만 갈린다.

        다만 늘 켜지는 링은 아니다. 넘치지 않는 상자는 포커스 대상이 아니고
        이 동작을 아직 하지 않는 브라우저도 있다. 어느 브라우저에서나 통하는
        키보드 통로는 안에 놓인 포커스 가능한 요소가 만들고, 그 사정은 지침
        keyboard-focus-path가 적는다.
      */}
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:ring-ring/50 focus-visible:ring-2"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      /*
       * 세로 막대에 h-full을, 가로 막대에 w-full을 얹지 않는다. Radix가
       * 인라인으로 주는 top:0·bottom:var(--radix-scroll-area-corner-height)
       * (세로) / left:0·right:var(--radix-scroll-area-corner-width)(가로)가
       * 코너 자리를 이미 완전히 정한다 — 여기에 h-full/w-full까지 더하면
       * top+height+bottom(또는 left+width+right) 세 값이 모두 정해지는
       * 과잉 제약이 되어 브라우저가 bottom/right를 버린다(CSS 2.1
       * §10.6.4). 그러면 코너 자리가 실제로는 비워지지 않아 both일 때
       * 두 막대가 모서리에서 겹친다 — both의 두 인스턴스로 실측했다.
       */
      className={cn(
        /*
         * type="hover"에서 Radix는 Presence로 마운트·해제만 하고 애니메이션은
         * 전혀 주지 않는다 — data-state(visible/hidden)만 달아 두고 나머지는
         * 우리 몫이다. transition-opacity로는 안 된다: Presence는 실제 해제
         * 시점을 CSS *keyframe* 애니메이션(animationstart/end)으로만
         * 감지하므로, transition만 걸면 opacity가 0으로 줄어드는 도중에
         * 노드가 그냥 뽑혀 나가 뚝 끊겨 보인다 — Popover가 이미 쓰는
         * animate-in/out·fade-in/out-0(tw-animate-css의 keyframe)과 같은
         * 처방을 그대로 따른다.
         *
         * my-1(세로)·mx-1(가로)로 양 끝에 약간의 틈을 둔다. Radix가 인라인으로
         * 박아 두는 top:0·bottom:var(...)(세로) / left:0·right:var(...)(가로)는
         * 그대로 둔 채 margin만 더하는 것이라 위 h-full/w-full 얘기와는
         * 다르다 — top·bottom·margin이 함께 방정식을 이뤄 height를 풀 뿐,
         * 세 번째 크기 지정이 새로 끼어드는 게 아니라서 코너 자리를 다시
         * 깨지 않는다.
         */
        'flex touch-none p-px transition-colors select-none',
        'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:fade-in-0 data-[state=hidden]:fade-out-0',
        orientation === 'vertical' && 'my-1 w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'mx-1 h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      {/*
       * bg-border(--border, 라이트 oklch(0.922 0 0))는 트랙 뒤 배경과
       * 명도 차가 거의 없어 실측 대비가 1.2:1 안팎이다 — thumb이
       * 안 보이면 컴포넌트 전체가 실패한 것이므로, Progress·Slider의
       * 트랙이 쓰는 것보다 한 단계 더 진한 muted-foreground로 칠한다.
       */}
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-muted-foreground relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
