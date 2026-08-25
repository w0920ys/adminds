import { describe, expect, it } from 'vitest'
import { makeHeadingId } from '@/lib/heading-id'

describe('makeHeadingId', () => {
  it('한글 제목을 그대로 담고 순번을 앞에 붙인다', () => {
    expect(makeHeadingId('사용 규칙', 3)).toBe('section-3-사용-규칙')
  })

  it('영문 제목을 소문자로 바꾼다', () => {
    expect(makeHeadingId('Status colors', 0)).toBe('section-0-status-colors')
  })

  it('한글도 영문도 아닌 글자를 하이픈으로 바꾸고 양끝에서 떼어낸다', () => {
    expect(makeHeadingId('  --color-*  ', 1)).toBe('section-1-color')
  })

  it('남는 글자가 없으면 자리를 채워 빈 id를 만들지 않는다', () => {
    expect(makeHeadingId('!!!', 2)).toBe('section-2-x')
  })

  it('같은 제목이라도 순번이 다르면 id가 다르다', () => {
    expect(makeHeadingId('Scale', 1)).not.toBe(makeHeadingId('Scale', 2))
  })
})
