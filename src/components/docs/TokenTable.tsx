import type { TokenRow } from '@/lib/tokens'

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-muted-foreground text-2xs tracking-widest">
            <th scope="col" className="px-3 py-2 font-bold">TOKEN</th>
            <th scope="col" className="px-3 py-2 font-bold">CSS VARIABLE</th>
            <th scope="col" className="px-3 py-2 font-bold">VALUE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cssVar}>
              <th scope="row" className="border-t px-3 py-2 font-medium">{row.name}</th>
              <td className="text-muted-foreground border-t px-3 py-2">{row.cssVar}</td>
              <td className="text-muted-foreground border-t px-3 py-2">
                {row.value || '(정의되지 않음)'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
