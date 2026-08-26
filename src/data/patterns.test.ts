import { describe, expect, it } from 'vitest'
import { getPattern, patternStats, patterns } from '@/data/patterns'
import { getComponent } from '@/data/registry'

describe('patterns', () => {
  it('id로 패턴을 찾는다', () => {
    expect(getPattern('list')?.name).toBe('List')
  })

  it('없는 id는 undefined를 돌려준다', () => {
    expect(getPattern('nope')).toBeUndefined()
  })

  it('id가 중복되지 않는다', () => {
    const ids = patterns.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('집계 숫자를 배열에서 센다', () => {
    const stats = patternStats()
    expect(stats.total).toBe(patterns.length)
    expect(stats.verified).toBe(patterns.filter((p) => p.verified).length)
  })
})

describe('structure', () => {
  it('모든 패턴이 자리를 하나 이상 갖는다', () => {
    for (const pattern of patterns) {
      expect(pattern.structure.length, pattern.id).toBeGreaterThan(0)
    }
  })

  it('자리 이름이 패턴 안에서 중복되지 않는다', () => {
    for (const pattern of patterns) {
      const slots = pattern.structure.map((s) => s.slot)
      expect(new Set(slots).size, pattern.id).toBe(slots.length)
    }
  })

  /*
   * 자리가 가리키는 컴포넌트가 registry에 없으면 Structure의 링크가
   * 죽은 곳으로 간다. 화면에서 눈으로 잡을 수 없는 종류의 거짓이라
   * 여기서 막는다.
   */
  it('자리가 가리키는 컴포넌트가 registry에 있다', () => {
    for (const pattern of patterns) {
      for (const step of pattern.structure) {
        for (const id of step.components ?? []) {
          expect(getComponent(id), `${pattern.id}: ${id}`).toBeDefined()
        }
      }
    }
  })
})

describe('예시 식별자', () => {
  it('guideline과 case의 id가 서로 겹치지 않는다', () => {
    for (const pattern of patterns) {
      const ids = [...pattern.guidelines.map((g) => g.id), ...pattern.cases.map((c) => c.id)]
      expect(new Set(ids).size, pattern.id).toBe(ids.length)
    }
  })

  it('모든 id가 kebab-case다', () => {
    for (const pattern of patterns) {
      const ids = [pattern.id, ...pattern.guidelines.map((g) => g.id), ...pattern.cases.map((c) => c.id)]
      for (const id of ids) {
        expect(id, `${pattern.id}: ${id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      }
    }
  })
})
