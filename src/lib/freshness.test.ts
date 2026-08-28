import { describe, expect, it } from 'vitest'
import { isUpdatedInRelease, parseDocDate } from '@/lib/freshness'

describe('parseDocDate', () => {
  it('YYYY-MM-DD를 로컬 자정으로 읽는다', () => {
    const date = parseDocDate('2026-08-26')!
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(7)
    expect(date.getDate()).toBe(26)
    expect(date.getHours()).toBe(0)
  })

  it('형식이 아니면 undefined다', () => {
    expect(parseDocDate('2026-8-26')).toBeUndefined()
    expect(parseDocDate('어제')).toBeUndefined()
    expect(parseDocDate('')).toBeUndefined()
  })

  it('없는 날짜는 undefined다', () => {
    expect(parseDocDate('2026-02-31')).toBeUndefined()
    expect(parseDocDate('2026-13-01')).toBeUndefined()
  })
})

describe('isUpdatedInRelease', () => {
  it('릴리스가 나온 날 갱신된 문서는 이번 릴리스에서 바뀐 것이다', () => {
    expect(isUpdatedInRelease('2026-08-27', '2026-08-27')).toBe(true)
  })

  it('릴리스 이후에 갱신된 문서(다음 릴리스를 준비하며 먼저 고친 문서)도 포함한다', () => {
    expect(isUpdatedInRelease('2026-08-28', '2026-08-27')).toBe(true)
  })

  it('릴리스보다 앞서 갱신된 문서는 이번 릴리스에서 바뀐 것이 아니다', () => {
    expect(isUpdatedInRelease('2026-08-25', '2026-08-27')).toBe(false)
  })

  it('문서 날짜를 읽을 수 없으면 바뀐 것으로 치지 않는다', () => {
    expect(isUpdatedInRelease('언젠가', '2026-08-27')).toBe(false)
  })

  it('릴리스 날짜를 읽을 수 없으면 바뀐 것으로 치지 않는다', () => {
    expect(isUpdatedInRelease('2026-08-27', '언젠가')).toBe(false)
  })
})
