import { Check, X } from 'lucide-react'

export type CopyExample = {
  /** 이 문장이 놓이는 자리 */
  situation: string
  /** 쓰지 않는 문장 */
  dont: string
  /** 이 시스템이 쓰는 문장 */
  do: string
  /** 왜 이렇게 정했는지 한 줄 */
  why: string
}

/**
 * 문구는 규칙보다 문장 쌍으로 봐야 판단이 선다.
 * Voice and Tone과 Writing이 같은 방식으로 예를 보이도록 한 곳에 둔다.
 */
export function CopyPairs({ items }: { items: CopyExample[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.situation} className="overflow-hidden rounded-lg border">
          <p className="text-muted-foreground bg-surface-raised border-b px-4 py-2 text-2xs font-bold tracking-widest">
            {item.situation}
          </p>
          <div className="grid md:grid-cols-2">
            <div className="p-4">
              <p className="text-destructive mb-2 flex items-center gap-1.5 text-2xs font-bold tracking-widest">
                <X size={13} aria-hidden /> 쓰지 않는 문장
              </p>
              <p className="text-muted-foreground text-sm">{item.dont}</p>
            </div>
            <div className="border-t p-4 md:border-t-0 md:border-l">
              <p className="text-success mb-2 flex items-center gap-1.5 text-2xs font-bold tracking-widest">
                <Check size={13} aria-hidden /> 이 시스템이 쓰는 문장
              </p>
              <p className="text-sm font-medium">{item.do}</p>
            </div>
          </div>
          <p className="text-muted-foreground bg-muted/40 border-t px-4 py-2 text-xs">{item.why}</p>
        </div>
      ))}
    </div>
  )
}
