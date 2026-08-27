import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Collapsible = CollapsiblePrimitive.Root

type CollapsibleTriggerProps = React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  /*
   * 화살표(Indicator)는 Trigger 안에서 그려져 소비자가 직접 닿을 수
   * 없다 — Switch의 thumbProps와 같은 이유로 임의의 속성을 그대로
   * 전달하는 통로만 열어 둔다. 무엇을 전달할지는 소비자가 정하므로 이
   * 컴포넌트는 그 내용을 알지 못한다. 문서의 Anatomy 미리보기가
   * data-anatomy="indicator"를 여기로 흘려보낸다.
   */
  indicatorProps?: React.ComponentProps<typeof ChevronDown> & {
    [dataAttr: `data-${string}`]: string
  }
}

/*
 * Accordion과 달리 트리거를 h3으로 감싸지 않는다. 접히는 자리가 하나면
 * 그것은 절이 아니라 컨트롤이고, 있지도 않은 제목을 하나 만들면
 * assignHeadingIds가 그것을 문서의 절로 보고 목차에 올린다. Accordion이
 * 그 문제를 data-slot으로 걸러 내야 했던 것과 같은 뿌리다.
 */
function CollapsibleTrigger({
  className,
  children,
  indicatorProps,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        'group flex w-full items-center justify-between gap-2 rounded-md py-2 text-sm font-medium outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden
        {...indicatorProps}
        data-slot="collapsible-indicator"
        className={cn(
          'size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180',
          indicatorProps?.className,
        )}
      />
    </CollapsiblePrimitive.Trigger>
  )
}

/*
 * 접힌 동안 콘텐츠는 접근성 트리에서 완전히 빠진다 —
 * node_modules/@radix-ui/react-collapsible/dist/index.js의
 * CollapsibleContentImpl이 `hidden: !isOpen`을 무대 요소에 직접 건다.
 * 시각적으로 잘라내는 것(overflow-hidden)과는 다른 층이다.
 */
function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('text-muted-foreground pt-0 pb-2', className)}>{children}</div>
    </CollapsiblePrimitive.Content>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
