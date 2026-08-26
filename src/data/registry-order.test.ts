import { describe, expect, it } from 'vitest'
import { sections, flattenDocs } from '@/components/layout/nav-config'
import { components } from '@/data/registry'

/** LNB의 Components 목록에서 Overview를 뺀 문서 경로들 */
function navComponentIds(): string[] {
  const section = sections.find((s) => s.id === 'components')!
  return flattenDocs(section.items)
    .filter((doc) => doc.to !== section.to)
    .map((doc) => doc.to.replace('/components/', ''))
}

describe('registry와 nav-config', () => {
  it('같은 컴포넌트를 같은 순서로 담는다', () => {
    expect(components.map((c) => c.id)).toEqual(navComponentIds())
  })
})
