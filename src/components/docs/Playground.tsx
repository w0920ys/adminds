import { useState, type ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { cn } from '@/lib/utils'

export function Playground({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (options: RenderOptions) => ReactNode
}) {
  const [options, setOptions] = useState<RenderOptions>(() =>
    Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value])),
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-8">
        {render(options)}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        {meta.properties.map((property) => (
          <fieldset key={property.name} className="flex flex-col gap-1.5">
            <legend className="text-muted-foreground text-2xs font-bold tracking-widest">
              {property.title.toUpperCase()}
            </legend>
            <div className="flex flex-wrap gap-1">
              {property.options.map((option) => {
                const selected = options[property.name] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setOptions((prev) => ({ ...prev, [property.name]: option.value }))
                    }
                    className={cn(
                      'rounded-md border px-2 py-1 text-xs',
                      selected
                        ? 'bg-primary text-primary-foreground border-transparent font-medium'
                        : 'hover:bg-accent/60',
                    )}
                  >
                    {option.label ?? option.value}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
