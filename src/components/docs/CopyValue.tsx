import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 값을 보여주고 마우스를 올리면 복사 아이콘을 띄운다.
 * 누르면 아이콘이 체크로 바뀌고 2초 뒤 되돌아온다.
 */
export function CopyValue({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      /* 클립보드를 쓸 수 없는 환경에서는 조용히 넘어간다 */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${value} 복사됨` : `${value} 복사`}
      className={cn(
        'group hover:bg-accent flex items-center gap-1.5 rounded px-1.5 py-0.5 text-left',
        className,
      )}
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <Check size={12} className="text-success shrink-0" aria-hidden />
      ) : (
        <Copy
          size={12}
          className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  )
}
