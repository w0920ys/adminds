import { describe, expect, it } from 'vitest'
import { makeHeadingIds } from '@/lib/heading-id'

describe('makeHeadingIds', () => {
  it('한글 제목을 그대로 담는다', () => {
    expect(makeHeadingIds(['사용 규칙'])).toEqual(['사용-규칙'])
  })

  it('영문 제목을 소문자로 바꾼다', () => {
    expect(makeHeadingIds(['Status colors'])).toEqual(['status-colors'])
  })

  it('한글도 영문도 아닌 글자를 하이픈으로 바꾸고 양끝에서 떼어낸다', () => {
    expect(makeHeadingIds(['  --color-*  '])).toEqual(['color'])
  })

  it('남는 글자가 없으면 자리를 채워 빈 id를 만들지 않는다', () => {
    expect(makeHeadingIds(['!!!'])).toEqual(['section'])
  })

  it('같은 제목이 두 번 나오면 순번으로 가른다', () => {
    expect(makeHeadingIds(['Scale', 'Weight', 'Scale'])).toEqual([
      'scale',
      'weight',
      'scale-2',
    ])
  })

  it('앞에 제목이 끼어도 뒤 제목의 id가 그대로다', () => {
    const before = makeHeadingIds(['Overview', 'Guidelines'])
    const after = makeHeadingIds(['Overview', 'Scale', 'Guidelines'])
    expect(after.at(-1)).toBe(before.at(-1))
  })
})
