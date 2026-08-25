import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="bg-surface-raised grid min-h-44 place-items-center rounded-lg border p-8">
        {preview}
      </div>
      <ol className="flex flex-col gap-2.5">
        {meta.anatomy.map((part, index) => (
          <li key={part.part} className="flex gap-2.5">
            <span className="bg-primary text-primary-foreground mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold">
              {index + 1}
            </span>
            <div>
              <strong className="text-sm">{part.label}</strong>
              <p className="text-muted-foreground text-xs">{part.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
