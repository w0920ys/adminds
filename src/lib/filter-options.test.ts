import { describe, expect, it } from 'vitest'
import { filterOptions } from '@/lib/filter-options'

const OPTIONS = [
  { value: 'kim', label: '김하나' },
  { value: 'lee', label: '이두리' },
  { value: 'park', label: 'Park Sam' },
]

describe('filterOptions', () => {
  it('질의가 비면 전부 돌려준다', () => {
    expect(filterOptions(OPTIONS, '')).toHaveLength(3)
  })

  it('앞글자만이 아니라 포함으로 맞춘다', () => {
    expect(filterOptions(OPTIONS, '하나').map((o) => o.value)).toEqual(['kim'])
  })

  it('대소문자를 가리지 않는다', () => {
    expect(filterOptions(OPTIONS, 'park').map((o) => o.value)).toEqual(['park'])
    expect(filterOptions(OPTIONS, 'PARK').map((o) => o.value)).toEqual(['park'])
  })

  it('앞뒤 공백을 무시한다', () => {
    expect(filterOptions(OPTIONS, '  하나  ').map((o) => o.value)).toEqual(['kim'])
  })

  it('맞는 것이 없으면 빈 배열이다', () => {
    expect(filterOptions(OPTIONS, '없는이름')).toEqual([])
  })

  it('원본 순서를 지킨다', () => {
    expect(filterOptions(OPTIONS, '').map((o) => o.value)).toEqual(['kim', 'lee', 'park'])
  })
})
