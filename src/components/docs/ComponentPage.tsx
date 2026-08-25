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
}

export function ComponentPage({ meta }: ComponentPageProps) {
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
    </div>
  )
}
