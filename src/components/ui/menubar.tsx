import * as React from 'react'
import { Check } from 'lucide-react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { cn } from '@/lib/utils'

function Menubar({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn('flex items-center gap-1 rounded-md border p-1', className)}
      {...props}
    />
  )
}
const MenubarMenu = MenubarPrimitive.Menu

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-default items-center rounded-sm px-3 py-1.5 text-16 outline-none select-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground z-popover min-w-40 overflow-hidden rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

/* dropdown-menu.tsx의 Item과 같은 규칙 — destructive prop, data-destructive 속성 */
function MenubarItem({
  className,
  destructive,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & { destructive?: boolean }) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-destructive={destructive ? '' : undefined}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[destructive]:text-destructive data-[destructive]:focus:bg-destructive/10 data-[destructive]:focus:text-destructive',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

/*
 * 선택 표시(Check)는 왼쪽에 붙는다 — Select(select.tsx)는 오른쪽에
 * 두지만, 여러 항목을 위아래로 훑어 내려가는 메뉴 계열(Context Menu·
 * Menubar)에서는 표시가 늘 같은 자리(왼쪽)에 있어야 값 자체(텍스트)를
 * 나란히 읽기 쉽다.
 */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-16 outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
}
