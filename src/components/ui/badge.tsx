import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * hover 변형을 두지 않는다. Badge는 누를 수 있는 요소가 아니므로
 * hover 효과가 있으면 사용자가 누를 수 있다고 착각한다.
 */
const badgeVariants = cva(
  'inline-flex w-fit items-center gap-1 rounded px-2 py-0.5 text-2xs font-bold whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground',
        info: 'bg-info/15 text-info',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        destructive: 'bg-destructive/15 text-destructive',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
