import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  "flex w-full min-w-0 rounded-md border border-input bg-background text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted read-only:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30",
  {
    variants: {
      size: {
        sm: 'h-control-sm px-2.5',
        default: 'h-control px-3',
        lg: 'h-control-lg px-3.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

/*
 * 네이티브 input에도 size 속성이 있고 그것은 숫자다.
 * 변형 이름과 겹치므로 네이티브 쪽을 걷어낸다 — 이 시스템에서 폭은 부모가 정한다.
 */
type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

function Input({ className, size, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
