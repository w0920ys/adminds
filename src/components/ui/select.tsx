import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { inputVariants } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default' | 'lg'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        inputVariants({ size }),
        'items-center justify-between gap-2 text-left data-[placeholder]:text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        {/*
          문서의 Anatomy 무대는 preview의 DOM 서브트리 안에서 data-anatomy를
          querySelector로 찾는다. 화살표는 트리거 내부에 박혀 있어 페이지가
          바깥에서 이 속성을 주입할 수 없으므로 여기서 붙인다. 실제 화면에서는
          아무 효과가 없는 데이터 속성이다.
        */}
        <ChevronDown data-anatomy="arrow" className="size-4 shrink-0 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  container,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  /**
   * Portal이 렌더링할 컨테이너. 비워두면 Radix 기본값인 document.body를 쓴다.
   * Anatomy 무대는 이 값을 무대 안의 노드로 지정해 목록·항목·선택 표시가
   * 무대의 DOM 서브트리 밖으로 포탈되지 않게 한다 — 그래야 자동 지시선이
   * 그 부위를 찾을 수 있다.
   */
  container?: React.ComponentProps<typeof SelectPrimitive.Portal>['container']
}) {
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          'bg-popover text-popover-foreground z-popover min-w-32 overflow-hidden rounded-md border shadow-md',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 grid place-items-center">
        <SelectPrimitive.ItemIndicator>
          {/* 화살표와 같은 이유로 여기서 data-anatomy를 붙인다. */}
          <Check data-anatomy="selected-indicator" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
