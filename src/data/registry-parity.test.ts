import { describe, expect, it } from 'vitest'
import registryJson from '../../registry.json'
import { components } from '@/data/registry'

/**
 * registry.ts(문서 쪽 메타)와 registry.json(shadcn 레지스트리)이 서로 어긋나면
 * 조용히 갈라진다 — registry.ts에만 있으면 shadcn CLI로 받을 수 없고,
 * registry.json에만 있으면 문서에 닿지 않는 죽은 항목이 남는다. 두 방향을 함께 지킨다.
 */

const registryItems = registryJson.items as { name: string; type: string; registryDependencies?: string[] }[]
const uiNames = new Set(registryItems.filter((i) => i.type === 'registry:ui').map((i) => i.name))

describe('registry.ts와 registry.json', () => {
  it('모든 컴포넌트가 레지스트리 항목을 갖는다', () => {
    const missing = components.map((c) => c.id).filter((id) => !uiNames.has(id))
    expect(missing, '레지스트리에 빠진 컴포넌트').toEqual([])
  })

  it('모든 registry:ui 항목이 문서 컴포넌트를 갖는다', () => {
    const componentIds = new Set(components.map((c) => c.id))
    const orphaned = [...uiNames].filter((name) => !componentIds.has(name))
    expect(orphaned, 'registry.ts에 없는 registry:ui 항목').toEqual([])
  })

  it('묶음 항목이 모든 컴포넌트를 가리킨다', () => {
    const bundle = registryItems.find((i) => i.name === 'adminds')!
    const referenced = new Set((bundle.registryDependencies ?? []).map((u) => u.split('/').pop()!.replace('.json', '')))
    const missing = components.map((c) => c.id).filter((id) => !referenced.has(id))
    expect(missing, '묶음에서 빠진 컴포넌트').toEqual([])
  })
})
