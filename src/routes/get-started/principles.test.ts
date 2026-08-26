import { describe, expect, it } from 'vitest'
import { findDoc } from '@/components/layout/nav-config'
import { principles } from '@/routes/get-started/principles'

describe('principles', () => {
  it('id가 중복되지 않는다', () => {
    const ids = principles.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  /*
   * 근거 문서가 없으면 원칙이 죽은 곳을 가리킨다. 원칙은 새로 만드는
   * 것이 아니라 이미 지키고 있는 것에 이름을 붙이는 것이므로, 가리킬
   * 문서가 없다는 것은 그 원칙이 근거 없이 지어졌다는 뜻이다.
   */
  it('모든 원칙의 근거 문서가 LNB에 실재한다', () => {
    for (const principle of principles) {
      expect(findDoc(principle.source), principle.id).toBeDefined()
    }
  })

  it('작업대 자체를 다루는 원칙이 마지막에 하나 있다', () => {
    const scopes = principles.map((p) => p.scope)
    expect(scopes.filter((s) => s === 'workbench')).toHaveLength(1)
    expect(scopes[scopes.length - 1]).toBe('workbench')
  })
})
