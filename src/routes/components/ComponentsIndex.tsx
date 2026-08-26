import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { categoryLabel, componentStats, componentsByCategory } from '@/data/registry'

export function ComponentsIndex() {
  const stats = componentStats()
  const groups = componentsByCategory()

  return (
    <DocPage
      title="Components"
      description={`등록된 컴포넌트 ${stats.total}개 중 ${stats.verified}개를 눈으로 확인했습니다.`}
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          Components는 화면을 이루는 낱개의 부품입니다. 각 문서는 그 부품의 구조와 속성,
          언제 쓰고 언제 쓰지 않는지를 다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          문서는 같은 순서로 읽습니다. Anatomy가 부품의 뼈대를 보이고, Playground에서
          조합을 만져보고, Properties가 축마다 무엇을 정하는지 늘어놓고, Guidelines가
          판단이 갈리는 자리를 짚고, Usage와 Cases가 실제 화면과 예외를 보입니다.
        </p>
        <p className="text-muted-foreground text-sm">
          여기서 정하지 않는 것도 있습니다. 색과 간격 같은 값은 Foundations에서,
          여러 부품을 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
        </p>
      </DocSection>

      {groups.map(({ category, items }) => (
        <DocSection key={category} title={categoryLabel[category]}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((meta) => (
              <li key={meta.id} className="h-full">
                <Link
                  to={`/components/${meta.id}`}
                  className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
                >
                  <strong className="text-sm">{meta.name}</strong>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{meta.purpose}</p>
                  <span className="text-muted-foreground mt-2 block text-2xs">
                    {meta.status} · {meta.changedIn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </DocSection>
      ))}
    </DocPage>
  )
}
