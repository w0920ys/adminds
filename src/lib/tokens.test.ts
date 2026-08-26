import { describe, expect, it } from 'vitest'
import { parseTokenNames, parseTokenValue } from '@/lib/tokens'

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

/*
 * Tailwind가 --text-<크기>--line-height를 :root에 내보내지 않아 실측이 비는
 * 토큰이 있다. 그때 readTokens가 기대는 것이 이 파서다.
 */
describe('parseTokenValue', () => {
  it('선언값을 그대로 뽑는다', () => {
    expect(parseTokenValue(SAMPLE, '--text-2xs')).toBe('0.6875rem')
  })

  it('calc()처럼 괄호가 든 값도 통째로 뽑는다', () => {
    expect(parseTokenValue(SAMPLE, '--radius-sm')).toBe('calc(var(--radius) - 4px)')
  })

  it('없는 이름은 빈 문자열이다', () => {
    expect(parseTokenValue(SAMPLE, '--text-base--line-height')).toBe('')
  })

  it('이름이 더 긴 토큰의 꼬리에 걸리지 않는다', () => {
    const css = '--text-2xs--line-height: calc(1 / 0.6875); --text-2xs: 0.6875rem;'
    expect(parseTokenValue(css, '--text-2xs')).toBe('0.6875rem')
  })

  it('같은 이름이 두 번 나오면 먼저 온 선언을 쓴다', () => {
    expect(parseTokenValue('--a: 1px; --a: 2px;', '--a')).toBe('1px')
  })
})
