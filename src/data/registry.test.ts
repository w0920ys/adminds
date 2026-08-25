import { describe, expect, it } from 'vitest'
import { components, componentStats, getComponent, getComponentsByCategory } from '@/data/registry'

describe('registry', () => {
  it('id로 컴포넌트를 찾는다', () => {
    expect(getComponent('button')?.name).toBe('Button')
  })

  it('없는 id는 undefined를 돌려준다', () => {
    expect(getComponent('nope')).toBeUndefined()
  })

  it('카테고리로 거른다', () => {
    const actions = getComponentsByCategory('actions')
    expect(actions.length).toBeGreaterThan(0)
    expect(actions.every((c) => c.category === 'actions')).toBe(true)
  })

  it('집계 숫자를 손으로 적지 않고 배열에서 센다', () => {
    const stats = componentStats()
    expect(stats.total).toBe(components.length)
    expect(stats.verified).toBe(components.filter((c) => c.verified).length)
    expect(stats.stable).toBe(components.filter((c) => c.status === 'stable').length)
  })

  it('id가 중복되지 않는다', () => {
    const ids = components.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
