import { describe, expect, it } from 'vitest'
import { isFresh, parseDocDate } from '@/lib/freshness'

const at = (iso: string) => new Date(iso)

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

describe('isFresh', () => {
  it('같은 날 갱신은 새것이다', () => {
    expect(isFresh('2026-08-26', at('2026-08-26T00:00:00'))).toBe(true)
    expect(isFresh('2026-08-26', at('2026-08-26T23:59:59'))).toBe(true)
  })

  it('자정을 넘기면 떨어진다', () => {
    expect(isFresh('2026-08-26', at('2026-08-27T00:00:00'))).toBe(false)
    expect(isFresh('2026-08-25', at('2026-08-26T09:00:00'))).toBe(false)
  })

  it('앞선 날짜는 새것으로 치지 않는다', () => {
    expect(isFresh('2026-08-27', at('2026-08-26T09:00:00'))).toBe(false)
  })

  it('읽을 수 없는 날짜는 새것으로 치지 않는다', () => {
    expect(isFresh('언젠가', at('2026-08-26T09:00:00'))).toBe(false)
  })
})
