import type { ReactNode } from 'react'
import { docProse } from '@/components/docs/DocPage'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'
import { forcedStateClass } from '@/components/docs/state-preview'
import type { ComponentMeta, ComponentProperty } from '@/data/registry'
import { getProperty } from '@/data/registry'
import { cn } from '@/lib/utils'

export type RenderOptions = Record<string, string>

/** 축의 첫 옵션들로 기본 조합을 만든다. 격자의 각 칸은 여기서 한 축만 바꾼다. */
function baseOptions(meta: ComponentMeta): RenderOptions {
  return Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value]))
}

export function PropertyBlock({
  meta,
  property,
  render,
}: {
  meta: ComponentMeta
  property: ComponentProperty
  render: (options: RenderOptions) => ReactNode
}) {
  const base = baseOptions(meta)
  const cross = property.crossWith ? getProperty(meta, property.crossWith) : undefined

  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="group flex items-center">
          <h3 className="text-base font-semibold">{property.title}</h3>
          <HeadingAnchor />
        </div>
        <p className={cn('text-muted-foreground mt-2 text-sm', docProse)}>{property.description}</p>
      </div>

      {property.display === 'matrix' && cross ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-xs">
                <th scope="col" className="bg-surface sticky left-0 px-3 py-2 font-bold">
                  {property.title}
                </th>
                {cross.options.map((option) => (
                  <th key={option.value} scope="col" className="px-3 py-2 font-bold">
                    {option.value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {property.options.map((option) => (
                <tr key={option.value}>
                  <th
                    scope="row"
                    className="bg-surface sticky left-0 border-t px-3 py-3 text-sm font-medium"
                  >
                    {option.value}
                    {option.note && (
                      <span className="text-muted-foreground block text-xs font-normal">
                        {option.note}
                      </span>
                    )}
                  </th>
                  {cross.options.map((crossOption) => (
                    <td key={crossOption.value} className="border-t px-3 py-3">
                      {render({
                        ...base,
                        [property.name]: option.value,
                        [cross.name]: crossOption.value,
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            property.display === 'row'
              ? 'flex flex-wrap items-end gap-x-6 gap-y-5 rounded-lg border p-4 md:p-5'
              : 'grid gap-x-4 gap-y-5 rounded-lg border p-4 sm:grid-cols-2 md:p-5 lg:grid-cols-3'
          }
        >
          {property.options.map((option) => (
            <div key={option.value} className="flex flex-col gap-3">
              <p className="text-muted-foreground text-xs font-bold">{option.value}</p>
              <div
                className={cn(
                  'flex min-h-10 items-center',
                  property.name === 'state' ? forcedStateClass(option.value) : undefined,
                )}
              >
                {render({ ...base, [property.name]: option.value })}
              </div>
              {option.note && (
                <p className="text-muted-foreground max-w-48 text-xs">{option.note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
