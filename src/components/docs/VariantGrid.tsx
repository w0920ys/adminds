import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'

export function VariantGrid({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (option: { variant: string; size: string }) => ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="text-muted-foreground sticky left-0 bg-surface px-3 py-2 text-2xs font-bold tracking-widest"
            >
              VARIANT
            </th>
            {meta.sizes.map((size) => (
              <th
                key={size}
                scope="col"
                className="text-muted-foreground px-3 py-2 text-2xs font-bold tracking-widest"
              >
                {size.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meta.variants.map((variant) => (
            <tr key={variant}>
              <th
                scope="row"
                className="bg-surface sticky left-0 border-t px-3 py-3 text-sm font-medium"
              >
                {variant}
              </th>
              {meta.sizes.map((size) => (
                <td key={size} className="border-t px-3 py-3">
                  {render({ variant, size })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
