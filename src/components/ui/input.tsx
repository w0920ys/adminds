import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  /*
   * hover는 배경을 한 단계 옮겨 포인터 affordance를 준다 — Button의 outline
   * variant와 같은 토큰 조합(라이트는 accent, 다크는 input 오버레이 강화)이다.
   * read-only 입력에서는 이 배경이 끼어들면 안 된다. 그런데 :read-only
   * 의사 클래스는 CSS 명세상 편집 가능하지 않은 모든 요소(버튼 포함)에
   * 항상 걸린다 — SelectTrigger는 button이라 늘 :read-only를 만족한다.
   * 그래서 :not(:read-only) 대신 실제 readonly 어트리뷰트만 보는
   * :not([readonly])를 쓴다. Select는 이 어트리뷰트를 절대 달지 않으므로
   * hover가 그대로 살고, Input에 readOnly가 걸리면 hover가 꺼진다.
   */
  "flex w-full min-w-0 rounded-md border border-input bg-background text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted read-only:text-muted-foreground [&:not([readonly])]:hover:bg-accent dark:[&:not([readonly])]:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30",
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
