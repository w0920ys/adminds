import { CopyValue } from '@/components/docs/CopyValue'
import type { TokenRow } from '@/lib/tokens'

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-14">
        <thead>
          <tr className="text-muted-foreground text-12 tracking-widest">
            <th scope="col" className="px-3 py-2 font-bold">TOKEN</th>
            <th scope="col" className="px-3 py-2 font-bold">CSS VARIABLE</th>
            <th scope="col" className="px-3 py-2 font-bold">VALUE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cssVar}>
              <th scope="row" className="border-t px-3 py-3 font-medium">{row.name}</th>
              <td className="text-muted-foreground border-t px-1.5 py-1">
                <CopyValue value={row.cssVar} />
              </td>
              <td className="text-muted-foreground border-t px-1.5 py-1">
                {/* 값이 없으면 복사할 것도 없으므로 버튼을 두지 않는다 */}
                {row.value ? (
                  <CopyValue value={row.value} />
                ) : (
                  <span className="px-1.5 py-0.5">(정의되지 않음)</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
