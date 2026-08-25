import type { ReactNode } from 'react'
import { DoDont } from '@/components/docs/DoDont'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Guideline } from '@/data/registry'

export function GuidelineBlock({
  guideline,
  renderExample,
}: {
  guideline: Guideline
  renderExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
}) {
  const doExample = renderExample?.(guideline.id, 'do')
  const dontExample = renderExample?.(guideline.id, 'dont')

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <div>
        <h3 className="text-base font-semibold">{guideline.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{guideline.body}</p>
      </div>

      {(doExample || dontExample) && (
        <div className="grid gap-3 md:grid-cols-2">
          {doExample && <ExampleFrame kind="do">{doExample}</ExampleFrame>}
          {dontExample && <ExampleFrame kind="dont">{dontExample}</ExampleFrame>}
        </div>
      )}

      {(guideline.do || guideline.dont) && (
        <DoDont do={guideline.do ?? []} dont={guideline.dont ?? []} />
      )}
    </section>
  )
}
