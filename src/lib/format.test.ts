import { describe, expect, it } from 'vitest'
import { formatNumber, formatPercent } from './format'

describe('formatNumber', () => {
  it('천 단위 구분 쉼표를 넣는다', () => {
    expect(formatNumber(12400)).toBe('12,400')
  })

  it('소수를 반올림한다', () => {
    expect(formatNumber(12.6)).toBe('13')
  })

  it('0을 그대로 보인다', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('기본 소수 첫째 자리까지 보인다', () => {
    expect(formatPercent(39.44)).toBe('39.4%')
  })

  it('digits로 자릿수를 정한다', () => {
    expect(formatPercent(39.44, 0)).toBe('39%')
    expect(formatPercent(39.4444, 2)).toBe('39.44%')
  })
})
