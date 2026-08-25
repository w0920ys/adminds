import { describe, expect, it } from 'vitest'
import { hasUnseenRelease } from '@/lib/notifications'

describe('hasUnseenRelease', () => {
  it('한 번도 본 적 없으면 미확인이다', () => {
    expect(hasUnseenRelease(null, 'v0.2.0')).toBe(true)
  })

  it('본 버전이 최신과 같으면 확인된 것이다', () => {
    expect(hasUnseenRelease('v0.2.0', 'v0.2.0')).toBe(false)
  })

  it('본 버전이 최신과 다르면 미확인이다', () => {
    expect(hasUnseenRelease('v0.1.0', 'v0.2.0')).toBe(true)
  })
})
