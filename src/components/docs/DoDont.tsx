import { Check, X } from 'lucide-react'

export function DoDont({ do: dos, dont: donts }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border p-4 md:p-5">
        {/* success-on-tint를 쓴다 — 원래 success 색은 흰 바탕에서도 3.67:1이다 */}
        <p className="text-success-on-tint mb-3 flex items-center gap-1.5 text-12 font-bold tracking-widest">
          <Check size={13} aria-hidden /> DO
        </p>
        <ul className="flex flex-col gap-2">
          {dos.map((line) => (
            <li key={line} className="text-16">
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border p-4 md:p-5">
        <p className="text-destructive mb-3 flex items-center gap-1.5 text-12 font-bold tracking-widest">
          <X size={13} aria-hidden /> DON'T
        </p>
        <ul className="flex flex-col gap-2">
          {donts.map((line) => (
            <li key={line} className="text-16">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
