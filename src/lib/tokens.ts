export type TokenRow = {
  /** 표시용 짧은 이름 — 'primary-foreground' */
  name: string
  /** CSS 변수 이름 — '--color-primary-foreground' */
  cssVar: string
  /** 실측된 계산값 — 'oklch(0.985 0 0)' */
  value: string
}

/**
 * CSS 텍스트에서 주어진 접두사로 시작하는 커스텀 프로퍼티 '선언'의 이름을 뽑는다.
 * var(--x) 참조는 선언이 아니므로 제외한다 — 선언은 이름 뒤에 콜론이 온다.
 */
export function parseTokenNames(cssText: string, prefix: string): string[] {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(?<![\\w-])(${escaped}[\\w-]+)\\s*:`, 'g')
  const found = new Set<string>()
  for (const match of cssText.matchAll(pattern)) {
    found.add(match[1])
  }
  return [...found]
}

/**
 * 현재 문서에서 토큰의 계산값을 실측한다.
 * 라이트/다크 어느 쪽이든 지금 적용된 값이 그대로 나온다.
 *
 * prefix를 주면 표시용 이름에서 그것을 떼어낸다. 정규식으로 추측하면
 * --z-index-sticky 처럼 접두사가 여러 세그먼트인 경우를 틀리게 자른다.
 */
export function readTokens(names: string[], prefix?: string): TokenRow[] {
  const computed = getComputedStyle(document.documentElement)
  return names.map((cssVar) => ({
    cssVar,
    name:
      prefix && cssVar.startsWith(prefix)
        ? cssVar.slice(prefix.length)
        : cssVar.replace(/^--/, ''),
    value: computed.getPropertyValue(cssVar).trim(),
  }))
}
