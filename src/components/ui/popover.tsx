import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

/*
 * modal을 켜지 않는다 — Radix Popover는 기본이 modal=false라 손대지
 * 않으면 그대로 유지된다. 켜면 Select·Dialog·DropdownMenu에서 겪은
 * pointer-events: none · aria-hidden이 GNB까지 번진다.
 *
 * Radix가 Content에 role="dialog"를 달아 주므로 이름은 호출처가 준다 —
 * 표면 안에 제목이 있으면 그 id를 aria-labelledby로 잇고, 없으면
 * aria-label을 단다. 여기서 기본 이름을 정해 두지 않는 것은 표면마다
 * 담기는 것이 다르기 때문이다(Combobox는 선택 목록, DatePicker는 달
 * 격자다). Dialog가 DialogTitle과 짝을 이루는 것과 같은 자리다.
 */
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 8,
  collisionPadding = 16,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'bg-popover text-popover-foreground z-popover w-72 rounded-md border p-4 shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
