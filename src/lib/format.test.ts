import { describe, expect, it } from 'vitest'
import { formatPercent } from '@/lib/format'

describe('formatPercent', () => {
  it('기본은 소수 한 자리다', () => {
    expect(formatPercent(42)).toBe('42.0%')
  })

  it('digits로 자릿수를 정한다', () => {
    expect(formatPercent(42.567, 0)).toBe('43%')
    expect(formatPercent(42.567, 2)).toBe('42.57%')
  })

  it('0과 100도 그대로 표시한다', () => {
    expect(formatPercent(0)).toBe('0.0%')
    expect(formatPercent(100)).toBe('100.0%')
  })
})
