import type { ReactNode } from 'react'
import { Anatomy } from '@/components/docs/Anatomy'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { ExampleList } from '@/components/docs/ExampleList'
import { GuidelineBlock } from '@/components/docs/GuidelineBlock'
import { Playground } from '@/components/docs/Playground'
import { PropertyBlock, type RenderOptions } from '@/components/docs/PropertyBlock'
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
  /** Anatomy 무대에 놓일 미리보기. 각 부위에 data-anatomy 속성이 있어야 한다 */
  preview: ReactNode
  /** 축 이름 → 선택된 값을 받아 컴포넌트를 렌더링한다 */
  render: (options: RenderOptions) => ReactNode
  /** 이 컴포넌트에만 필요한 섹션 */
  extraSections?: { title: string; node: ReactNode }[]
  /** guideline의 do/don't 예시를 주입한다 */
  renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
  /** usage·cases 항목의 예시를 주입한다 */
  renderExample?: (exampleId: string) => ReactNode
}

export function ComponentPage({
  meta,
  preview,
  render,
  extraSections = [],
  renderGuidelineExample,
  renderExample,
}: ComponentPageProps) {
  return (
    <DocPage
      title={meta.name}
      description={meta.purpose}
      meta={
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[meta.status])}>
            {meta.status}
          </span>
          <span className="text-muted-foreground text-2xs">
            {meta.addedIn}에 추가 · {meta.changedIn}에서 마지막 변경
            {meta.verified ? ' · 검증 완료' : ' · 검증 필요'}
          </span>
        </div>
      }
    >
      <DocSection title="Anatomy">
        <Anatomy meta={meta} preview={preview} />
      </DocSection>

      <DocSection title="Playground">
        <Playground meta={meta} render={render} />
      </DocSection>

      <DocSection title="Properties">
        <div className="flex flex-col gap-12">
          {meta.properties.map((property) => (
            <PropertyBlock
              key={property.name}
              meta={meta}
              property={property}
              render={render}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Guidelines">
        <div className="flex flex-col gap-12">
          {meta.guidelines.map((guideline) => (
            <GuidelineBlock
              key={guideline.id}
              guideline={guideline}
              renderExample={renderGuidelineExample}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Usage">
        <ExampleList examples={meta.usage} renderExample={renderExample} />
      </DocSection>

      <DocSection title="Cases">
        <ExampleList examples={meta.cases} renderExample={renderExample} />
      </DocSection>

      {extraSections.map((section) => (
        <DocSection key={section.title} title={section.title}>
          {section.node}
        </DocSection>
      ))}
    </DocPage>
  )
}
