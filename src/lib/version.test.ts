import { describe, expect, it } from 'vitest'
import { versionOrder } from '@/lib/version'

describe('versionOrder', () => {
  /*
   * 이 함수가 있는 이유 그 자체다. 글자로 견주면 'v0.10.0' < 'v0.9.0'이라
   * 표의 '도입' 열이 화면에 보이는 순서와 다르게 정렬된다.
   */
  it('두 자리 minor가 한 자리 minor보다 뒤에 온다', () => {
    /* 글자로 늘어놓으면 v0.10.0이 앞에 선다 — 고치려는 순서가 이것이다 */
    expect(['v0.9.0', 'v0.10.0'].sort()).toEqual(['v0.10.0', 'v0.9.0'])
    expect(versionOrder('v0.10.0')).toBeGreaterThan(versionOrder('v0.9.0'))
  })

  it('major·minor·patch 순으로 무게가 다르다', () => {
    expect(versionOrder('v1.0.0')).toBeGreaterThan(versionOrder('v0.999.999'))
    expect(versionOrder('v0.2.0')).toBeGreaterThan(versionOrder('v0.1.999'))
    expect(versionOrder('v0.1.2')).toBeGreaterThan(versionOrder('v0.1.1'))
  })

  it('앞의 v는 있어도 없어도 같은 수다', () => {
    expect(versionOrder('v0.11.0')).toBe(versionOrder('0.11.0'))
  })

  it('없는 자리는 0으로 본다', () => {
    expect(versionOrder('v1')).toBe(versionOrder('v1.0.0'))
    expect(versionOrder('v1.2')).toBe(versionOrder('v1.2.0'))
  })

  it('같은 버전은 같은 수다 — 안정 정렬이 원래 순서를 지킨다', () => {
    expect(versionOrder('v0.8.0')).toBe(versionOrder('v0.8.0'))
  })

  /* 정렬 기준으로 실제로 쓰이는 모양 그대로 한 번 더 지킨다 */
  it('정렬 기준으로 쓰면 자리 수가 아니라 값 순서로 늘어선다', () => {
    const versions = ['v0.12.0', 'v0.9.0', 'v0.2.0', 'v0.10.1', 'v0.10.0']
    expect([...versions].sort((a, b) => versionOrder(a) - versionOrder(b))).toEqual([
      'v0.2.0',
      'v0.9.0',
      'v0.10.0',
      'v0.10.1',
      'v0.12.0',
    ])
  })
})
