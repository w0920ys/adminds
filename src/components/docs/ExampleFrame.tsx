import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const KIND_LABEL = {
  do: 'DO',
  dont: "DON'T",
} as const

export function ExampleFrame({
  kind = 'plain',
  children,
}: {
  kind?: 'do' | 'dont' | 'plain'
  children: ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      {kind !== 'plain' && (
        // DO 글자는 success-on-tint를 쓴다 — 원래 success 색은 흰 바탕에서도 3.67:1이다
        <p
          className={cn(
            'flex items-center gap-1.5 border-b px-3 py-2.5 text-2xs font-bold tracking-widest',
            kind === 'do' ? 'text-success-on-tint' : 'text-destructive',
          )}
        >
          {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
          {KIND_LABEL[kind]}
        </p>
      )}
      <div className="bg-surface-raised flex-1 p-4 md:p-5">{children}</div>
    </div>
  )
}
