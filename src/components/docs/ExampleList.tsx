import type { ReactNode } from 'react'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Example } from '@/data/registry'

export function ExampleList({
  examples,
  renderExample,
}: {
  examples: Example[]
  renderExample?: (exampleId: string) => ReactNode
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {examples.map((example) => {
        const node = renderExample?.(example.id)
        return (
          <li key={example.id} className="flex flex-col gap-2">
            <div>
              <strong className="text-sm">{example.title}</strong>
              <p className="text-muted-foreground mt-1 text-xs">{example.note}</p>
            </div>
            {node && <ExampleFrame>{node}</ExampleFrame>}
          </li>
        )
      })}
    </ul>
  )
}
