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
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'flex-col h-2.5 border-t border-t-transparent',
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
