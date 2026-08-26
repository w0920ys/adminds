import type { ReactNode } from 'react'
import { Anatomy } from '@/components/docs/Anatomy'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { ExampleList } from '@/components/docs/ExampleList'
import { GuidelineBlock } from '@/components/docs/GuidelineBlock'
import { Playground } from '@/components/docs/Playground'
import { PropertyBlock, type RenderOptions } from '@/components/docs/PropertyBlock'
import type { ComponentMeta, ComponentStatus } from '@/data/registry'
import { cn } from '@/lib/utils'

/*
 * Badge와 같은, 15% 탄 배경 위에 글자를 얹는 칩 패턴이라 같은
 * on-tint 토큰을 쓴다 — text-2xs font-bold(11px)는 WCAG 4.5:1
 * 대상이고, 탄 배경 위에 원래 색을 그대로 쓰면 라이트에서 기준에
 * 못 미친다(review 1.91 · stable 3.06 · deprecated 3.64 · draft
 * 4.34였다).
 */
const STATUS_STYLE: Record<ComponentStatus, string> = {
  draft: 'bg-muted text-neutral-on-tint',
  review: 'bg-warning/15 text-warning-on-tint',
  stable: 'bg-success/15 text-success-on-tint',
  deprecated: 'bg-destructive/15 text-destructive-on-tint',
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
      {/*
       * 빈 절은 렌더링하지 않는다. Properties가 없는 Tooltip처럼, 축을
       * 정직하게 보일 수 없어 비워 둔 절이 '이 컴포넌트는 이 축이
       * 없다'가 아니라 '문서가 덜 채워졌다'로 읽히기 때문이다 —
       * 이 프로젝트가 계속 바로잡아 온 결함과 같은 종류다. 특정
       * 컴포넌트를 겨냥한 예외가 아니라 내용이 비면 절 자체가
       * 사라지는 일반 규칙이다.
       *
       * Anatomy는 preview 하나만으로는 판단하지 않는다 — meta.anatomy가
       * 비어 있다면 지시선을 그릴 부위 자체가 없다는 뜻이라 Anatomy도
       * 같은 규칙을 따른다(Toast처럼 부위 전체가 포털이라 무대 안에서
       * 보일 수 없는 경우가 그렇다).
       */}
      {meta.anatomy.length > 0 && (
        <DocSection title="Anatomy">
          <Anatomy meta={meta} preview={preview} />
        </DocSection>
      )}

      <DocSection title="Playground">
        <Playground meta={meta} render={render} />
      </DocSection>

      {meta.properties.length > 0 && (
        <DocSection title="Properties">
          <div className="flex flex-col gap-10 md:gap-12">
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
      )}

      {meta.guidelines.length > 0 && (
        <DocSection title="Guidelines">
          <div className="flex flex-col gap-10 md:gap-12">
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

      {meta.usage.length > 0 && (
        <DocSection title="Usage">
          <ExampleList examples={meta.usage} renderExample={renderExample} />
        </DocSection>
      )}

      {meta.cases.length > 0 && (
        <DocSection title="Cases">
          <ExampleList examples={meta.cases} renderExample={renderExample} />
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
