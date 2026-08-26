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

  /*
   * 답을 아는 목록을 넣어 센다. 그전에는 patterns.length와
   * patterns.filter(...)를 기대값 자리에 그대로 다시 적었는데, 그것은
   * 구현과 같은 식이라 구현이 틀리면 기대값도 같이 틀렸다.
   */
  it('넘긴 목록에서 전체와 검증 완료를 센다', () => {
    const sample = patterns.slice(0, 2).map((pattern, i) => ({ ...pattern, verified: i === 0 }))
    expect(patternStats(sample)).toEqual({ total: 2, verified: 1 })
  })

  /* 기본값이 실제 목록이어야 화면의 '패턴 N개'가 0으로 비지 않는다 */
  it('인자가 없으면 실제 패턴 목록을 센다', () => {
    expect(patternStats().total).toBeGreaterThan(0)
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
