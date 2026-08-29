import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { flattenDocs, sections } from '@/components/layout/nav-config'
import { patternStats } from '@/data/patterns'
import { componentStats } from '@/data/registry'
import { sectionRole } from '@/routes/get-started/section-roles'

export function GetStartedOverview() {
  const components = componentStats()
  const patterns = patternStats()

  return (
    <DocPage
      title="어드민 디자인 시스템"
      description="어드민 화면을 만들 때 쓰는 디자인 시스템이자, 그 시스템이 제대로 서 있는지 눈으로 확인하는 작업대입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          제품이 아니라 작업대입니다. 컴포넌트를 실제 화면에 붙이기 전에 변형과 상태를 한자리에
          늘어놓고 눈으로 확인하는 곳이고, 확인을 마친 것을 다음 프로젝트로 가져가는 곳입니다.
        </p>
        <p className="text-muted-foreground text-16">
          한 사람이 만들고 한 사람이 씁니다. 그래서 기여 안내도 합의 절차도 없습니다. 대신
          문서가 코드에 대해 사실만 말하는지를 계속 확인합니다 — 여기서는 문서가 곧 제품입니다.
        </p>
      </DocSection>

      <DocSection title="Sections">
        <ul className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id} className="h-full">
              <Link
                to={section.to}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-16">{section.label}</strong>
                <p className="text-muted-foreground mt-1 text-12">{sectionRole[section.id]}</p>
                <span className="text-muted-foreground mt-2 block text-12">
                  문서 {flattenDocs(section.items).length}개
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Reading order">
        <p className="text-muted-foreground text-16">
          순서가 있습니다. Foundations가 바닥입니다 — 색과 간격과 말투를 여기서 정하고, 그
          값이 모든 컴포넌트에 그대로 실립니다.
        </p>
        <p className="text-muted-foreground text-16">
          그 위에 Components가 섭니다. 부품 하나하나의 구조와 속성을 다루고, 값은 Foundations에서
          가져다 씁니다.
        </p>
        <p className="text-muted-foreground text-16">
          Patterns가 그것들을 엮습니다. 목록·상세·입력처럼 화면 단위의 규칙이라, 엮을 부품이
          없으면 쓸 수 없습니다. 그래서 이 섹션이 가장 늦게 채워졌습니다.
        </p>
      </DocSection>

      <DocSection title="Status">
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-lg border p-4">
            <strong className="text-40 font-bold tracking-tight">{components.total}</strong>
            <p className="text-muted-foreground mt-1 text-12">
              컴포넌트 · 그중 {components.verified}개를 눈으로 확인했습니다
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <strong className="text-40 font-bold tracking-tight">{patterns.total}</strong>
            <p className="text-muted-foreground mt-1 text-12">
              패턴 · 그중 {patterns.verified}개를 눈으로 확인했습니다
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <strong className="text-40 font-bold tracking-tight">
              {sections.reduce((n, s) => n + flattenDocs(s.items).length, 0)}
            </strong>
            <p className="text-muted-foreground mt-1 text-12">문서</p>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  )
}
