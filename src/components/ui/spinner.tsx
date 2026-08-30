import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * 아이콘 하나 그리는 게 전부다. 자체 색을 정하지 않고 currentColor를
 * 그대로 쓴다(lucide 아이콘의 기본 stroke) — Button 안에서 쓰이면
 * Button 글자색을, Badge 안에서 쓰이면 Badge 글자색을 따라간다.
 * role="status"·aria-label은 스스로 달아 별도 문구 없이도 스크린
 * 리더가 "불러오는 중"임을 안다 — 다만 옆에 보이는 문구가 있으면
 * 그 문구가 우선 읽히도록 aria-hidden으로 겹침을 피하는 건 쓰는 쪽의
 * 몫이다(Usage의 '버튼 안' 예시가 그렇게 한다).
 */
const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'size-3.5',
      default: 'size-4',
      lg: 'size-6',
    },
  },
  defaultVariants: { size: 'default' },
})

type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2
      data-slot="spinner"
      role="status"
      aria-label="불러오는 중"
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
