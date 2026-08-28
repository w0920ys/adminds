import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { docProse } from '@/components/docs/DocPage'
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
    <div className="flex h-full flex-col gap-4 rounded-lg border p-4 md:p-5">
      {/*
       * DO 글자는 success-on-tint를 쓴다 — 원래 success 색은 흰 바탕
       * 위에서도 3.67:1로 4.5:1에 못 미친다. destructive는 4.76:1로
       * 이미 넘어 그대로 둔다.
       */}
      <p
        className={cn(
          'flex items-center gap-1.5 text-11 font-bold tracking-widest',
          kind === 'do' ? 'text-success-on-tint' : 'text-destructive',
        )}
      >
        {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
        {kind === 'do' ? 'DO' : "DON'T"}
      </p>

      {example && <ExampleFrame>{example}</ExampleFrame>}

      {rules.length > 0 && (
        <ul className="flex flex-col gap-3">
          {rules.map((line) => (
            <li key={line} className="text-16">
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
    <section className="flex flex-col gap-4 md:gap-5">
      <div>
        <div className="group flex items-center">
          <h3 className="text-18 font-semibold">{guideline.title}</h3>
          <HeadingAnchor />
        </div>
        <p className={cn('text-muted-foreground mt-2 text-16', docProse)}>{guideline.body}</p>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-2 md:gap-4">
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
