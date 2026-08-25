import { describe, expect, it } from 'vitest'
import {
  components,
  componentStats,
  getComponent,
  getComponentsByCategory,
  getProperty,
} from '@/data/registry'

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

  it('집계 숫자를 배열에서 센다', () => {
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

describe('properties', () => {
  it('이름으로 축을 찾는다', () => {
    const button = getComponent('button')!
    expect(getProperty(button, 'variant')?.title).toBe('Variant')
  })

  it('없는 축은 undefined다', () => {
    expect(getProperty(getComponent('button')!, 'nope')).toBeUndefined()
  })

  it('모든 컴포넌트에서 축 이름이 중복되지 않는다', () => {
    for (const meta of components) {
      const names = meta.properties.map((p) => p.name)
      expect(new Set(names).size, `${meta.id}의 축 이름 중복`).toBe(names.length)
    }
  })

  it('모든 축은 옵션을 하나 이상 갖는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        expect(property.options.length, `${meta.id}.${property.name}`).toBeGreaterThan(0)
      }
    }
  })

  it('축의 옵션 값이 중복되지 않는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        const values = property.options.map((o) => o.value)
        expect(new Set(values).size, `${meta.id}.${property.name}`).toBe(values.length)
      }
    }
  })

  it('matrix 축은 존재하는 축과 교차한다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        if (property.display !== 'matrix') continue
        expect(property.crossWith, `${meta.id}.${property.name}`).toBeDefined()
        expect(getProperty(meta, property.crossWith!), `${meta.id}.${property.name}`).toBeDefined()
      }
    }
  })

  it('matrix가 아닌 축은 crossWith를 갖지 않는다', () => {
    for (const meta of components) {
      for (const property of meta.properties) {
        if (property.display === 'matrix') continue
        expect(property.crossWith, `${meta.id}.${property.name}`).toBeUndefined()
      }
    }
  })
})

describe('anatomy', () => {
  it('part id가 중복되지 않는다', () => {
    for (const meta of components) {
      const parts = meta.anatomy.map((a) => a.part)
      expect(new Set(parts).size, meta.id).toBe(parts.length)
    }
  })
})

describe('예시 식별자', () => {
  it('guideline의 id가 중복되지 않는다', () => {
    for (const meta of components) {
      const ids = meta.guidelines.map((g) => g.id)
      expect(new Set(ids).size, meta.id).toBe(ids.length)
    }
  })

  it('usage와 cases의 id가 서로 겹치지 않는다', () => {
    for (const meta of components) {
      const ids = [...meta.usage, ...meta.cases].map((e) => e.id)
      expect(new Set(ids).size, meta.id).toBe(ids.length)
    }
  })

  it('모든 id가 kebab-case다', () => {
    for (const meta of components) {
      const ids = [
        ...meta.guidelines.map((g) => g.id),
        ...meta.usage.map((e) => e.id),
        ...meta.cases.map((e) => e.id),
      ]
      for (const id of ids) {
        expect(id, `${meta.id}: ${id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      }
    }
  })
})
