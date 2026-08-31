import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { patternStats, patterns } from '@/data/patterns'

export function PatternsOverview() {
  const stats = patternStats()

  return (
    <DocPage
      title="Patterns"
      description={`등록된 패턴 ${stats.total}개 중 ${stats.verified}개를 눈으로 확인했습니다.`}
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          Patterns는 여러 부품이 모여 이루는 화면의 규칙입니다. 컴포넌트 문서가 부품 하나의
          구조와 속성을 다룬다면, 여기서는 그 부품들이 어떤 자리에 놓여 하나의 화면이 되는지를
          다룹니다.
        </p>
        <p className="text-muted-foreground text-16">
          문서는 같은 순서로 읽습니다. Structure가 어떤 컴포넌트가 어떤 자리에 오는지 늘어놓고,
          Guidelines가 판단이 갈리는 자리를 짚고, Example이 화면 하나를 통째로 보이고, Cases가
          비었을 때·실패했을 때·좁을 때를 보입니다.
        </p>
        <p className="text-muted-foreground text-16">
          여기서 정하지 않는 것도 있습니다. 색과 간격 같은 값은 Foundations에서, 부품 하나의
          구조와 속성은 Components에서 다룹니다. 패턴 문서에는 축도 상태도 없습니다 — 화면의
          규칙에는 고를 수 있는 축이 없기 때문입니다.
        </p>
      </DocSection>

      <DocSection title="Pages">
        <ul className="grid gap-4 sm:grid-cols-2">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="h-full">
              <Link
                to={`/patterns/${pattern.id}`}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-16">{pattern.name}</strong>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-12">{pattern.purpose}</p>
                <span className="text-muted-foreground mt-2 block text-12">
                  {pattern.status} · {pattern.changedIn}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  )
}
