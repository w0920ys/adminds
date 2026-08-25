import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { Anatomy } from '@/components/docs/Anatomy'
import { StateGrid } from '@/components/docs/StateGrid'
import { VariantGrid } from '@/components/docs/VariantGrid'
import type { ComponentMeta, ComponentStatus } from '@/data/registry'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<ComponentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-warning/15 text-warning',
  stable: 'bg-success/15 text-success',
  deprecated: 'bg-destructive/15 text-destructive',
}

export type ComponentPageProps = {
  meta: ComponentMeta
  preview: ReactNode
  renderVariant: (option: { variant: string; size: string }) => ReactNode
  renderState: (option: { state: string }) => ReactNode
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-2xs font-bold tracking-widest">{title}</h2>
      {children}
    </section>
  )
}

export function ComponentPage({ meta, preview, renderVariant, renderState }: ComponentPageProps) {
  return (
    <div className="flex max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{meta.name}</h1>
          <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[meta.status])}>
            {meta.status}
          </span>
          {meta.verified && (
            <span className="text-muted-foreground text-2xs">검증 완료</span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{meta.purpose}</p>
        <p className="text-muted-foreground text-2xs">
          {meta.addedIn}에 추가 · {meta.changedIn}에서 마지막 변경
        </p>
      </header>

      <Section title="ANATOMY">
        <Anatomy meta={meta} preview={preview} />
      </Section>

      <Section title="GUIDELINES">
        <div className="grid gap-3 md:grid-cols-2">
          <ul className="flex flex-col gap-2 rounded-lg border p-4">
            {meta.guidelines.do.map((line) => (
              <li key={line} className="flex gap-2 text-sm">
                <Check size={15} className="text-success mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2 rounded-lg border p-4">
            {meta.guidelines.dont.map((line) => (
              <li key={line} className="flex gap-2 text-sm">
                <X size={15} className="text-destructive mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="ALL VARIATIONS">
        <div className="rounded-lg border">
          <VariantGrid meta={meta} render={renderVariant} />
        </div>
      </Section>

      <Section title="STATES">
        <StateGrid meta={meta} render={renderState} />
      </Section>
    </div>
  )
}
