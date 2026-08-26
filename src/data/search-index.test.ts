import { describe, expect, it } from 'vitest'
import { recentDocs, searchIndex } from '@/data/search-index'
import { patterns } from '@/data/patterns'
import { components } from '@/data/registry'
import { search } from '@/lib/search'

describe('searchIndex', () => {
  it('모든 컴포넌트가 인덱스에 있다', () => {
    const paths = new Set(searchIndex.filter((r) => r.kind === 'component').map((r) => r.to))
    for (const meta of components) {
      expect(paths, meta.id).toContain(`/components/${meta.id}`)
    }
  })

  it('컴포넌트 결과의 빵부스러기가 LNB 묶음을 담는다', () => {
    const dialog = searchIndex.find((r) => r.to === '/components/dialog' && r.kind === 'component')!
    expect(dialog.breadcrumb).toEqual(['Components', 'Feedback'])
  })

  /*
   * 패턴은 nav-config를 타고도 인덱스에 들어오지만, 그 길로 들어오면
   * 제목과 한 줄 설명만 실리고 patterns.ts의 aliases는 버려진다. 아래 둘은
   * 패턴이 자기 데이터로 실렸는지를 본다 — 첫째가 자리를, 둘째가 별칭을 지킨다.
   */
  it('모든 패턴이 인덱스에 있다', () => {
    const paths = new Set(searchIndex.map((r) => r.to))
    for (const meta of patterns) {
      expect(paths, meta.id).toContain(`/patterns/${meta.id}`)
    }
  })

  it('패턴의 별칭이 인덱스의 keywords에 실린다', () => {
    for (const meta of patterns) {
      const record = searchIndex.find((r) => r.to === `/patterns/${meta.id}`)
      expect(record, meta.id).toBeDefined()
      for (const alias of meta.aliases) {
        expect(record!.keywords, `${meta.id}: ${alias}`).toContain(alias)
      }
    }
  })

  it('토큰도 인덱싱한다', () => {
    expect(searchIndex.some((r) => r.kind === 'token')).toBe(true)
  })

  it('최근 갱신은 5개까지, 최신이 먼저다', () => {
    expect(recentDocs.length).toBeLessThanOrEqual(5)
    const dates = recentDocs.map((r) => r.updatedAt ?? '')
    expect([...dates].sort().reverse()).toEqual(dates)
  })
})

describe('실제 질의', () => {
  it('별칭으로 컴포넌트를 찾는다', () => {
    const first = search('모달', searchIndex)[0]
    expect(first.kind).toBe('component')
    expect(first.hits[0].title).toBe('Dialog')
  })

  it('띄어 쓴 영문 이름도 찾는다', () => {
    expect(search('drop down menu', searchIndex)[0].hits[0].title).toBe('Dropdown Menu')
  })

  it('본문의 말로도 컴포넌트에 닿는다', () => {
    const titles = search('destructive', searchIndex).flatMap((g) => g.hits.map((h) => h.title))
    expect(titles).toContain('Button')
  })

  it('토큰 이름을 접두사 없이 찾는다', () => {
    const tokens = search('destructive', searchIndex).find((g) => g.kind === 'token')
    expect(tokens?.hits.some((h) => h.title.includes('destructive'))).toBe(true)
  })

  it('한 글자 질의가 본문에 스친 컴포넌트에 밀리지 않는다', () => {
    const groups = search('색', searchIndex)
    const docs = groups.find((g) => g.kind === 'doc')
    expect(docs?.hits.map((h) => h.title)).toContain('Color')
    // '검색 결과에서 들어간 경우' 같은 예시 제목으로 컴포넌트가 딸려 오지 않는다
    expect(groups.find((g) => g.kind === 'component')?.hits.map((h) => h.title) ?? []).not.toContain(
      'Breadcrumb',
    )
  })

  /*
   * PatternMeta.aliases의 주석은 "검색에서 이 패턴을 부르는 다른 이름들"이라고
   * 말한다. 별칭을 쳤을 때 정작 그 패턴 문서가 안 나오면 그 주석이 거짓이 된다.
   * 별칭 하나하나로 실제 질의를 돌려 그 문서가 결과에 있는지 본다.
   */
  it('별칭을 치면 그 패턴 문서가 결과에 나온다', () => {
    for (const meta of patterns) {
      for (const alias of meta.aliases) {
        const paths = search(alias, searchIndex).flatMap((g) => g.hits.map((h) => h.to))
        expect(paths, `${meta.id}: ${alias}`).toContain(`/patterns/${meta.id}`)
      }
    }
  })

  it('없는 말은 결과가 비어 있다', () => {
    expect(search('zzzznope', searchIndex)).toEqual([])
  })
})
