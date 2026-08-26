import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DocStatus } from '@/components/docs/DocStatus'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { ExampleList } from '@/components/docs/ExampleList'
import { GuidelineBlock } from '@/components/docs/GuidelineBlock'
import type { PatternMeta, PatternStructureStep } from '@/data/patterns'
import { getComponent } from '@/data/registry'

/**
 * 자리를 순서대로 늘어놓는다. Anatomy처럼 지시선을 긋지 않는 이유는
 * 패턴의 예시가 화면 하나라서다 — 부위 하나를 가리키는 좌표가 없다.
 * 대신 각 자리가 어떤 컴포넌트를 쓰는지 그 문서로 잇는다.
 */
function StructureList({ steps }: { steps: PatternStructureStep[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <li key={step.slot} className="flex items-start gap-2.5 rounded-md p-2">
          <span className="bg-muted text-neutral-on-tint mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold">
            {index + 1}
          </span>
          <span className="min-w-0">
            <strong className="text-sm">
              {step.slot}
              {step.optional && (
                <span className="text-muted-foreground font-normal"> (Optional)</span>
              )}
            </strong>
            <span className="text-muted-foreground block text-xs">{step.note}</span>
            {step.components && step.components.length > 0 && (
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {step.components.map((id) => (
                  <Link
                    key={id}
                    to={`/components/${id}`}
                    className="hover:bg-accent text-muted-foreground rounded border px-1.5 py-0.5 text-2xs"
                  >
                    {/* id가 registry에 실재하는지는 patterns.test.ts가 지킨다 */}
                    {getComponent(id)?.name ?? id}
                  </Link>
                ))}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  )
}

export type PatternPageProps = {
  meta: PatternMeta
  /** 실제 컴포넌트로 조립한 화면 한 조각. 목업을 그리지 않는다 */
  example: ReactNode
  /** guideline의 do/don't 예시를 주입한다 */
  renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
  /** cases 항목의 예시를 주입한다 */
  renderCase?: (caseId: string) => ReactNode
  /** 이 패턴에만 필요한 절 */
  extraSections?: { title: string; node: ReactNode }[]
}

export function PatternPage({
  meta,
  example,
  renderGuidelineExample,
  renderCase,
  extraSections = [],
}: PatternPageProps) {
  return (
    <DocPage
      title={meta.name}
      description={meta.purpose}
      meta={
        <DocStatus
          status={meta.status}
          addedIn={meta.addedIn}
          changedIn={meta.changedIn}
          verified={meta.verified}
        />
      }
    >
      {/* 빈 절은 그리지 않는다. ComponentPage와 같은 규칙이다 */}
      {meta.structure.length > 0 && (
        <DocSection title="Structure">
          <StructureList steps={meta.structure} />
        </DocSection>
      )}

      {meta.guidelines.length > 0 && (
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
      )}

      <DocSection title="Example">
        <div className="flex flex-col gap-2">
          <div>
            <strong className="text-sm">{meta.example.title}</strong>
            <p className="text-muted-foreground mt-1 text-xs">{meta.example.note}</p>
          </div>
          <ExampleFrame>{example}</ExampleFrame>
        </div>
      </DocSection>

      {meta.cases.length > 0 && (
        <DocSection title="Cases">
          <ExampleList examples={meta.cases} renderExample={renderCase} />
        </DocSection>
      )}

      {extraSections.map((section) => (
        <DocSection key={section.title} title={section.title}>
          {section.node}
        </DocSection>
      ))}
    </DocPage>
  )
}
