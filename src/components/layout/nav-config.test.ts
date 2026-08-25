import { describe, expect, it } from 'vitest'
import { docOrder, findAdjacent, findSection, sections } from '@/components/layout/nav-config'

describe('sections', () => {
  it('모든 섹션의 첫 LNB 항목은 Overview다', () => {
    for (const section of sections) {
      expect(section.items[0].label).toBe('Overview')
    }
  })

  it('섹션의 진입 경로는 자기 Overview와 같다', () => {
    for (const section of sections) {
      expect(section.to).toBe(section.items[0].to)
    }
  })

  it('경로가 중복되지 않는다', () => {
    const paths = docOrder.map((d) => d.to)
    expect(new Set(paths).size).toBe(paths.length)
  })
})

describe('docOrder', () => {
  it('모든 섹션의 항목을 LNB 순서대로 이어붙인다', () => {
    expect(docOrder.length).toBe(sections.reduce((n, s) => n + s.items.length, 0))
    expect(docOrder[0]).toBe(sections[0].items[0])
  })
})

describe('findSection', () => {
  it('섹션 진입 경로를 그 섹션으로 해석한다', () => {
    expect(findSection('/foundations').id).toBe('foundations')
  })

  it('하위 문서 경로를 그 섹션으로 해석한다', () => {
    expect(findSection('/foundations/color').id).toBe('foundations')
    expect(findSection('/components/button').id).toBe('components')
  })

  it('루트는 첫 섹션이다', () => {
    expect(findSection('/').id).toBe(sections[0].id)
  })

  it('알 수 없는 경로는 첫 섹션으로 떨어진다', () => {
    expect(findSection('/nope/nope').id).toBe(sections[0].id)
  })
})

describe('findAdjacent', () => {
  it('첫 문서에는 이전이 없다', () => {
    expect(findAdjacent(docOrder[0].to).prev).toBeUndefined()
    expect(findAdjacent(docOrder[0].to).next).toBe(docOrder[1])
  })

  it('마지막 문서에는 다음이 없다', () => {
    const last = docOrder[docOrder.length - 1]
    expect(findAdjacent(last.to).next).toBeUndefined()
    expect(findAdjacent(last.to).prev).toBe(docOrder[docOrder.length - 2])
  })

  it('섹션 경계를 넘어 이어진다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const lastOfFoundations = foundations.items[foundations.items.length - 1]
    const next = findAdjacent(lastOfFoundations.to).next
    expect(next).toBeDefined()
    expect(findSection(next!.to).id).not.toBe('foundations')
  })

  it('목록에 없는 경로는 양쪽 모두 없다', () => {
    expect(findAdjacent('/nope')).toEqual({ prev: undefined, next: undefined })
  })
})

describe('라우트와 네비게이션의 일치', () => {
  it('LNB의 모든 경로가 라우터에 등록되어 있다', async () => {
    const { registeredPaths } = await import('@/routes/router')
    for (const doc of docOrder) {
      expect(registeredPaths, `${doc.to} 라우트 누락`).toContain(doc.to)
    }
  })

  it('라우터에 LNB에 없는 문서 경로가 있지 않다', async () => {
    const { registeredPaths } = await import('@/routes/router')
    const navPaths = new Set(docOrder.map((d) => d.to))
    for (const path of registeredPaths) {
      expect(navPaths, `${path}가 LNB에 없다`).toContain(path)
    }
  })
})
