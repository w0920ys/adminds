import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** 예시 안에서 공간의 경계를 보여줄 때 쓰는 점선 상자. 네 컴포넌트 문서가 함께 쓴다 */
export function Bounds({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md border border-dashed p-2', className)}>{children}</div>
}
