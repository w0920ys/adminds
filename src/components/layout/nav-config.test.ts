import { describe, expect, it } from 'vitest'
import type { DocLink } from '@/components/layout/nav-config'
import { docOrder, findAdjacent, findDoc, findSection, flattenDocs, sections } from '@/components/layout/nav-config'

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
  it('모든 섹션의 문서를 LNB 순서대로 이어붙인다', () => {
    const expected = sections.reduce((n, s) => n + flattenDocs(s.items).length, 0)
    expect(docOrder.length).toBe(expected)
    expect(docOrder[0]).toBe(sections[0].items[0])
  })
})

describe('flattenDocs', () => {
  it('부모 다음에 자식이 온다', () => {
    const tree: DocLink[] = [
      {
        to: '/a',
        label: 'A',
        updatedAt: '2026-08-25',
        children: [
          { to: '/a/1', label: 'A1', updatedAt: '2026-08-25' },
          { to: '/a/2', label: 'A2', updatedAt: '2026-08-25' },
        ],
      },
      { to: '/b', label: 'B', updatedAt: '2026-08-25' },
    ]
    expect(flattenDocs(tree).map((d) => d.to)).toEqual(['/a', '/a/1', '/a/2', '/b'])
  })

  it('자식이 없으면 그대로다', () => {
    const tree: DocLink[] = [{ to: '/a', label: 'A', updatedAt: '2026-08-25' }]
    expect(flattenDocs(tree).map((d) => d.to)).toEqual(['/a'])
  })
})

describe('Color 하위 문서', () => {
  it('Color Role과 Palette가 Color의 자식이다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const color = foundations.items.find((d) => d.to === '/foundations/color')!
    expect(color.children?.map((c) => c.to)).toEqual([
      '/foundations/color-role',
      '/foundations/palette',
    ])
  })

  it('이전·다음 순서가 Color 다음에 하위 문서를 지나 Typography로 간다', () => {
    expect(findAdjacent('/foundations/color').next?.to).toBe('/foundations/color-role')
    expect(findAdjacent('/foundations/color-role').next?.to).toBe('/foundations/palette')
    expect(findAdjacent('/foundations/palette').next?.to).toBe('/foundations/typography')
    expect(findAdjacent('/foundations/typography').prev?.to).toBe('/foundations/palette')
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
  it('Overview에는 이전도 다음도 없다', () => {
    for (const section of sections) {
      expect(findAdjacent(section.to), `${section.id} Overview`).toEqual({
        prev: undefined,
        next: undefined,
      })
    }
  })

  it('섹션의 첫 문서에는 이전이 없다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const first = foundations.items[1]
    expect(findAdjacent(first.to).prev).toBeUndefined()
    expect(findAdjacent(first.to).next).toBe(foundations.items[2])
  })

  it('섹션의 마지막 문서에는 다음이 없다', () => {
    const foundations = sections.find((s) => s.id === 'foundations')!
    const last = foundations.items[foundations.items.length - 1]
    expect(findAdjacent(last.to).next).toBeUndefined()
    expect(findAdjacent(last.to).prev).toBe(foundations.items[foundations.items.length - 2])
  })

  it('섹션 경계를 넘지 않는다', () => {
    for (const section of sections) {
      for (const doc of section.items) {
        const { prev, next } = findAdjacent(doc.to)
        for (const link of [prev, next]) {
          if (!link) continue
          expect(findSection(link.to).id, `${doc.to} -> ${link.to}`).toBe(section.id)
        }
      }
    }
  })

  it('이동 대상에 Overview가 포함되지 않는다', () => {
    const overviewPaths = new Set(sections.map((s) => s.to))
    for (const doc of docOrder) {
      const { prev, next } = findAdjacent(doc.to)
      for (const link of [prev, next]) {
        if (!link) continue
        expect(overviewPaths.has(link.to), `${doc.to} -> ${link.to}`).toBe(false)
      }
    }
  })

  it('목록에 없는 경로는 양쪽 모두 없다', () => {
    expect(findAdjacent('/nope')).toEqual({ prev: undefined, next: undefined })
  })
})

describe('findDoc', () => {
  it('경로로 문서를 찾는다', () => {
    expect(findDoc('/foundations/color')?.label).toBe('Color')
  })

  it('없는 경로는 undefined다', () => {
    expect(findDoc('/nope')).toBeUndefined()
  })
})

describe('updatedAt', () => {
  it('모든 문서에 최종 수정일이 있다', () => {
    for (const doc of docOrder) {
      expect(doc.updatedAt, doc.to).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('라우트와 네비게이션의 일치', () => {
  it('LNB의 모든 경로가 라우터에 등록되어 있다', async () => {
    const { registeredPaths } = await import('@/routes/routes')
    for (const doc of docOrder) {
      expect(registeredPaths, `${doc.to} 라우트 누락`).toContain(doc.to)
    }
  })

  it('라우터에 LNB에 없는 문서 경로가 있지 않다', async () => {
    const { registeredPaths } = await import('@/routes/routes')
    const navPaths = new Set(docOrder.map((d) => d.to))
    for (const path of registeredPaths) {
      expect(navPaths, `${path}가 LNB에 없다`).toContain(path)
    }
  })
})
