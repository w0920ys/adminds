import { useEffect, useState } from 'react'
import { Check, Link2, X } from 'lucide-react'

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * 제목 옆에 놓여 그 절의 URL을 복사한다.
 * id는 렌더 시점에 아직 없을 수 있으므로 누를 때 DOM에서 읽는다 —
 * 목차가 마운트 뒤에 붙이기 때문이다.
 */
export function HeadingAnchor() {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const heading = event.currentTarget.closest('h2, h3')
    if (!heading?.id) {
      setState('failed')
      return
    }
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${heading.id}`)
      setState('copied')
    } catch {
      /* 클립보드를 쓸 수 없는 환경이 있다. 조용히 넘기지 않고 실패를 보여준다 */
      setState('failed')
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="이 절의 주소 복사"
      className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:opacity-100 ml-2 inline-grid size-6 shrink-0 place-items-center rounded align-middle opacity-0 group-hover:opacity-100"
    >
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? '복사했습니다' : state === 'failed' ? '복사하지 못했습니다' : ''}
      </span>
      {state === 'copied' ? (
        <Check size={14} className="text-success" aria-hidden />
      ) : state === 'failed' ? (
        <X size={14} className="text-destructive" aria-hidden />
      ) : (
        <Link2 size={14} aria-hidden />
      )}
    </button>
  )
}
