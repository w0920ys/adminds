import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { ComponentMeta } from '@/data/registry'
import type { PropertyRender, RenderOptions } from '@/components/docs/PropertyBlock'
import { forcedStateClass } from '@/components/docs/state-preview'
import { cn } from '@/lib/utils'

function initialOptions(meta: ComponentMeta): RenderOptions {
  return Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value]))
}

export function Playground({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: PropertyRender
}) {
  const [options, setOptions] = useState<RenderOptions>(() => initialOptions(meta))
  const base = initialOptions(meta)
  const isInitial = meta.properties.every((p) => options[p.name] === base[p.name])

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div
        className={cn(
          'bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-6 md:p-8',
          forcedStateClass(options.state),
        )}
      >
        {render(options)}
      </div>

      <div className="flex flex-col gap-5 rounded-lg border p-4 md:p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-11 font-bold tracking-widest">Options</p>
          <button
            type="button"
            onClick={() => setOptions(initialOptions(meta))}
            disabled={isInitial}
            className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-md px-2 py-1 text-11 disabled:pointer-events-none disabled:opacity-50"
          >
            <RotateCcw size={12} aria-hidden /> Reset
          </button>
        </div>
        {meta.properties.map((property) => (
          <fieldset key={property.name} className="flex flex-col gap-2">
            <legend className="text-muted-foreground text-11 font-bold tracking-widest">
              {property.title.toUpperCase()}
            </legend>
            <div className="flex flex-wrap gap-1.5">
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
                      'rounded-md border px-2 py-1 text-12',
                      selected
                        ? 'bg-primary text-primary-foreground border-transparent font-medium'
                        : 'hover:bg-accent/60',
                    )}
                  >
                    {option.value}
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
