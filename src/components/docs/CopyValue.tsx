import { useEffect, useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * 값을 보여주고 마우스를 올리면 복사 아이콘을 띄운다.
 * 누르면 결과에 따라 체크나 X로 바뀌고 2초 뒤 되돌아온다.
 */
export function CopyValue({ value, className }: { value: string; className?: string }) {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      /* 클립보드를 쓸 수 없는 환경이 있다. 조용히 넘기지 않고 실패를 보여준다 */
      setState('failed')
    }
  }

  const label =
    state === 'copied'
      ? `${value} 복사됨`
      : state === 'failed'
        ? `${value} 복사 실패`
        : `${value} 복사`

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={cn(
        'group hover:bg-accent flex items-center gap-1.5 rounded px-1.5 py-0.5 text-left',
        className,
      )}
    >
      <span className="truncate">{value}</span>
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? '복사했습니다' : state === 'failed' ? '복사하지 못했습니다' : ''}
      </span>
      {state === 'copied' && <Check size={12} className="text-success shrink-0" aria-hidden />}
      {state === 'failed' && <X size={12} className="text-destructive shrink-0" aria-hidden />}
      {state === 'idle' && (
        <Copy
          size={12}
          className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  )
}
