import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { components, componentStats, type ComponentCategory } from '@/data/registry'

const CATEGORY_LABEL: Record<ComponentCategory, string> = {
  actions: 'Actions',
  inputs: 'Inputs',
  navigation: 'Navigation',
  feedback: 'Feedback',
  'data-display': 'Data Display',
}

export function ComponentsIndex() {
  const stats = componentStats()
  const categories = [...new Set(components.map((c) => c.category))]

  return (
    <DocPage
      title="Components"
      description={`등록된 컴포넌트 ${stats.total}개 중 ${stats.verified}개를 눈으로 확인했습니다.`}
    >
      {categories.map((category) => (
        <DocSection key={category} title={CATEGORY_LABEL[category]}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {components
              .filter((c) => c.category === category)
              .map((meta) => (
                <li key={meta.id}>
                  <Link
                    to={`/components/${meta.id}`}
                    className="hover:bg-accent/50 block rounded-lg border p-4"
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
