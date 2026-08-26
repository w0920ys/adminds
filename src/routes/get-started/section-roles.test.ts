import { describe, expect, it } from 'vitest'
import { sections } from '@/components/layout/nav-config'
import { sectionRole } from '@/routes/get-started/section-roles'

describe('sectionRole', () => {
  /*
   * 섹션이 늘거나 이름이 바뀌면 첫 화면이 조용히 그 섹션을 빠뜨린다.
   * 화면을 봐도 '없는 것'은 보이지 않으므로 여기서 막는다.
   */
  it('nav-config의 섹션과 키가 정확히 같다', () => {
    expect(Object.keys(sectionRole).sort()).toEqual(sections.map((s) => s.id).sort())
  })

  it('모든 설명이 비어 있지 않다', () => {
    for (const [id, role] of Object.entries(sectionRole)) {
      expect(role, id).toBeTruthy()
    }
  })
})
