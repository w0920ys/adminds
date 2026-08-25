import { describe, expect, it } from 'vitest'
import { parseTokenNames } from '@/lib/tokens'

const SAMPLE = `
:root {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --text-2xs: 0.6875rem;
}
`

describe('parseTokenNames', () => {
  it('접두사로 시작하는 토큰 이름만 뽑는다', () => {
    expect(parseTokenNames(SAMPLE, '--color-')).toEqual([
      '--color-background',
      '--color-primary',
      '--color-primary-foreground',
    ])
  })

  it('다른 접두사도 동작한다', () => {
    expect(parseTokenNames(SAMPLE, '--radius-')).toEqual(['--radius-sm'])
  })

  it('일치하는 것이 없으면 빈 배열이다', () => {
    expect(parseTokenNames(SAMPLE, '--shadow-')).toEqual([])
  })

  it('중복을 제거한다', () => {
    expect(parseTokenNames('--color-a: 1; --color-a: 2;', '--color-')).toEqual(['--color-a'])
  })

  it('선언부만 잡고 var() 참조는 잡지 않는다', () => {
    expect(parseTokenNames('--x: var(--color-primary);', '--color-')).toEqual([])
  })
})
