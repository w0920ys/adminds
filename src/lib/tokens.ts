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
 * CSS 텍스트에서 주어진 이름의 선언값을 뽑는다. 없으면 빈 문자열이다.
 *
 * 같은 이름이 :root와 .dark에 두 번 적혀 있으면 파일에서 먼저 오는 :root 쪽을
 * 쓴다. 이 함수는 실측이 빈손일 때만 쓰는 폴백인데, 테마에 따라 갈리는 토큰은
 * 실측이 늘 성공하므로 폴백까지 내려올 일이 없다.
 */
export function parseTokenValue(cssText: string, cssVar: string): string {
  const escaped = cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = cssText.match(new RegExp(`(?<![\\w-])${escaped}\\s*:\\s*([^;]+);`))
  return match ? match[1].trim() : ''
}

/**
 * 현재 문서에서 토큰의 계산값을 실측한다.
 * 라이트/다크 어느 쪽이든 지금 적용된 값이 그대로 나온다.
 *
 * prefix를 주면 표시용 이름에서 그것을 떼어낸다. 정규식으로 추측하면
 * --z-index-sticky 처럼 접두사가 여러 세그먼트인 경우를 틀리게 자른다.
 *
 * fallbackCss를 주면 실측이 빈 문자열일 때 그 CSS 텍스트에 적힌 선언값을 대신
 * 읽는다. 선언돼 있는데도 실측이 빌 수 있는 토큰이 있어서 두는 안전장치다 —
 * Tailwind는 테마 기본값의 line-height를 .text-<크기> 규칙 안에 값째로 박아 넣고
 * :root에는 내보내지 않을 때가 있다. 지금 --text-11~--text-48은 tokens.css의
 * @theme inline 블록에 스물네 개(크기 열둘 + 줄 간격 열둘) 모두 커스텀 프로퍼티로
 * 직접 선언돼 있어 getComputedStyle로 전부 잡힌다 — 이 폴백에 기댈 일이 없다.
 * 그래도 다른 접두사의 토큰이 같은 틈에 빠질 수 있어 폴백은 남겨 둔다.
 */
export function readTokens(names: string[], prefix?: string, fallbackCss?: string): TokenRow[] {
  const computed = getComputedStyle(document.documentElement)
  return names.map((cssVar) => {
    const measured = computed.getPropertyValue(cssVar).trim()
    return {
      cssVar,
      name:
        prefix && cssVar.startsWith(prefix)
          ? cssVar.slice(prefix.length)
          : cssVar.replace(/^--/, ''),
      value: measured || (fallbackCss ? parseTokenValue(fallbackCss, cssVar) : ''),
    }
  })
}
