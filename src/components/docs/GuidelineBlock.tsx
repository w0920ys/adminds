import { DoDont } from '@/components/docs/DoDont'
import type { Guideline } from '@/data/registry'

export function GuidelineBlock({ guideline }: { guideline: Guideline }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <div>
        <h3 className="text-sm font-semibold">{guideline.title}</h3>
        <p className="text-muted-foreground mt-1 text-xs">{guideline.body}</p>
      </div>
      {(guideline.do || guideline.dont) && (
        <DoDont do={guideline.do ?? []} dont={guideline.dont ?? []} />
      )}
    </section>
  )
}
