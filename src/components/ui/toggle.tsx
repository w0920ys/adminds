import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * 켜진 모습은 data-state="on"으로 온다. Radix가 붙이는 속성이라 문서의
 * state 격자에서도 그 속성만 강제하면 실제와 같은 모습이 나온다.
 * 높이는 Button과 같은 control 토큰을 쓴다 — 같은 줄에 나란히 놓이는
 * 자리가 많아 높이가 어긋나면 바로 보인다.
 */
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border bg-background shadow-xs',
      },
      size: {
        sm: 'h-control-sm min-w-control-sm px-2',
        default: 'h-control min-w-control px-2.5',
        lg: 'h-control-lg min-w-control-lg px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
