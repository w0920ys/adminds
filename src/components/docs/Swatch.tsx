import type { TokenRow } from '@/lib/tokens'

export function Swatch({ row }: { row: TokenRow }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 rounded-lg border"
        style={{ background: `var(${row.cssVar})` }}
        aria-hidden
      />
      <div>
        <strong className="text-sm">{row.name}</strong>
        <p className="text-muted-foreground text-2xs break-all">
          {row.value || '(정의되지 않음)'}
        </p>
      </div>
    </div>
  )
}
