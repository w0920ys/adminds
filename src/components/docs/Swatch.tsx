import { useEffect, useState } from 'react'
import { CopyValue } from '@/components/docs/CopyValue'
import { toHex } from '@/lib/color'
import type { TokenRow } from '@/lib/tokens'

export function Swatch({ row }: { row: TokenRow }) {
  const [hex, setHex] = useState('')

  /* toHex는 document를 쓰므로 렌더 중에 부르지 않는다.
     테마가 바뀌면 실측값이 바뀌므로 그것을 의존성에 둔다 */
  useEffect(() => {
    setHex(toHex(row.value))
  }, [row.value])

  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 rounded-lg border"
        style={{ background: `var(${row.cssVar})` }}
        aria-hidden
      />
      <div className="flex flex-col gap-0.5">
        <CopyValue value={row.name} className="text-sm font-semibold" />
        <CopyValue value={row.cssVar} className="text-muted-foreground text-2xs" />
        {row.value ? (
          <CopyValue value={row.value} className="text-muted-foreground text-2xs" />
        ) : (
          <p className="text-muted-foreground px-1.5 py-0.5 text-2xs">(정의되지 않음)</p>
        )}
        {hex && <CopyValue value={hex} className="text-muted-foreground text-2xs" />}
      </div>
    </div>
  )
}
