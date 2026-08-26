import { describe, expect, it } from 'vitest'
import { makeSnippet, normalize, scoreRecord, search, tokenize, type SearchRecord } from '@/lib/search'

const record = (over: Partial<SearchRecord> = {}): SearchRecord => ({
  to: '/components/dialog',
  kind: 'component',
  title: 'Dialog',
  breadcrumb: ['Components', 'Feedback'],
  keywords: ['모달', 'modal'],
  summary: '사용자의 흐름을 멈추고 확인을 받는다',
  body: '되돌릴 수 없는 동작에는 destructive를 쓴다',
  ...over,
})

describe('normalize', () => {
  it('공백과 하이픈을 지워 같은 말로 만든다', () => {
    expect(normalize('Drop Down Menu')).toBe('dropdownmenu')
    expect(normalize('dropdown-menu')).toBe('dropdownmenu')
  })
})

describe('tokenize', () => {
  it('공백으로 낱말을 가른다', () => {
    expect(tokenize('버튼 크기')).toEqual(['버튼', '크기'])
  })

  it('빈 질의는 낱말이 없다', () => {
    expect(tokenize('   ')).toEqual([])
  })
})

describe('scoreRecord', () => {
  it('이름으로 걸린 것이 본문으로 걸린 것보다 높다', () => {
    const byTitle = scoreRecord(record(), ['dialog'])
    const byBody = scoreRecord(record(), ['destructive'])
    expect(byTitle).toBeGreaterThan(byBody)
  })

  it('별칭으로도 걸린다', () => {
    expect(scoreRecord(record(), ['모달'])).toBeGreaterThan(0)
  })

  it('접두 매치가 부분 매치보다 높다', () => {
    const prefix = scoreRecord(record({ title: 'Separator' }), ['sep'])
    const partial = scoreRecord(record({ title: 'Separator' }), ['ara'])
    expect(prefix).toBeGreaterThan(partial)
  })

  it('한 글자 질의는 본문을 보지 않는다', () => {
    const onlyInBody = record({ title: 'Alert', keywords: [], summary: undefined, body: '검색 결과를 알린다' })
    expect(scoreRecord(onlyInBody, ['색'])).toBe(0)
    expect(scoreRecord(onlyInBody, ['검색'])).toBeGreaterThan(0)
  })

  it('한 글자여도 한 줄 설명으로는 걸린다', () => {
    expect(scoreRecord(record({ summary: '색 토큰' }), ['색'])).toBeGreaterThan(0)
  })

  it('낱말 하나라도 없으면 답이 아니다', () => {
    expect(scoreRecord(record(), ['dialog', '없는말'])).toBe(0)
  })
})

describe('makeSnippet', () => {
  it('매치 지점을 가운데 두고 자른다', () => {
    const snippet = makeSnippet('되돌릴 수 없는 동작에는 destructive를 쓴다', 'destructive')!
    expect(snippet[1]).toBe('destructive')
    expect(snippet[0]).toContain('되돌릴')
  })

  it('원문에 없으면 발췌하지 않는다', () => {
    expect(makeSnippet('짧은 본문', 'dropdownmenu')).toBeUndefined()
  })
})

describe('search', () => {
  const records = [
    record(),
    record({ to: '/foundations/color', kind: 'doc', title: 'Color', keywords: ['색'], summary: '색 토큰', body: undefined }),
    record({ to: '/foundations/palette', kind: 'token', title: '--color-destructive', keywords: ['destructive'], summary: undefined, body: undefined }),
  ]

  it('빈 질의는 결과가 없다', () => {
    expect(search('  ', records)).toEqual([])
  })

  it('종류별로 묶고 컴포넌트를 맨 위에 둔다', () => {
    const groups = search('destructive', records)
    expect(groups.map((g) => g.kind)).toEqual(['component', 'token'])
  })

  it('묶음마다 개수를 자른다', () => {
    const many = Array.from({ length: 9 }, (_, i) => record({ title: `Dialog ${i}` }))
    expect(search('dialog', many, 5)[0].hits.length).toBe(5)
  })
})
