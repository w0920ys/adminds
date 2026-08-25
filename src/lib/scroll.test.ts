import { describe, expect, it } from 'vitest'
import { decodeHashFragment } from '@/lib/scroll'

describe('decodeHashFragment', () => {
  it('평범한 조각을 그대로 돌려준다', () => {
    expect(decodeHashFragment('guidelines')).toBe('guidelines')
  })

  it('퍼센트 인코딩된 한글을 되돌린다', () => {
    expect(decodeHashFragment('%EC%82%AC%EC%9A%A9-%EA%B7%9C%EC%B9%99')).toBe('사용-규칙')
  })

  it("'100%'처럼 깨진 입력에서 던지지 않고 원문을 돌려준다", () => {
    expect(decodeHashFragment('100%')).toBe('100%')
  })

  it('빈 문자열을 빈 문자열로 돌려준다', () => {
    expect(decodeHashFragment('')).toBe('')
  })
})
