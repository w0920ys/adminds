import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'
import type { Guideline } from '@/data/registry'
import { cn } from '@/lib/utils'

function Side({
  kind,
  example,
  rules,
}: {
  kind: 'do' | 'dont'
  example?: ReactNode
  rules: string[]
}) {
  if (!example && rules.length === 0) return null

  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border p-4">
      <p
        className={cn(
          'flex items-center gap-1.5 text-2xs font-bold tracking-widest',
          kind === 'do' ? 'text-success' : 'text-destructive',
        )}
      >
        {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
        {kind === 'do' ? 'DO' : "DON'T"}
      </p>

      {example && <ExampleFrame>{example}</ExampleFrame>}

      {rules.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rules.map((line) => (
            <li key={line} className="text-sm">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function GuidelineBlock({
  guideline,
  renderExample,
}: {
  guideline: Guideline
  renderExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="group text-base font-semibold">
          {guideline.title}
          <HeadingAnchor />
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">{guideline.body}</p>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-2">
        <Side
          kind="do"
          example={renderExample?.(guideline.id, 'do')}
          rules={guideline.do ?? []}
        />
        <Side
          kind="dont"
          example={renderExample?.(guideline.id, 'dont')}
          rules={guideline.dont ?? []}
        />
      </div>
    </section>
  )
}
