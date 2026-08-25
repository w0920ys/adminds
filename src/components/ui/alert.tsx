import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * 아이콘은 CSS로 색만 물려받는다. 어떤 아이콘을 넣을지는 문서 페이지가 정하고,
 * 이 컴포넌트는 variant에 맞는 색만 [&>svg]로 물려준다 — Button이 svg에
 * 크기를 물려주는 것과 같은 방식이라 이 시스템에서 새 규칙이 아니다.
 */
const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-md border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'border-info/30 bg-info/10 [&>svg]:text-info',
        success: 'border-success/30 bg-success/10 [&>svg]:text-success',
        warning: 'border-warning/30 bg-warning/10 [&>svg]:text-warning',
        destructive: 'border-destructive/30 bg-destructive/10 [&>svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div role="alert" data-slot="alert" className={cn(alertVariants({ variant, className }))} {...props} />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="alert-title" className={cn('font-medium', className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="alert-description" className={cn('text-muted-foreground', className)} {...props} />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
