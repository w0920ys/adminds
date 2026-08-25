/** 0~255 채널 세 개를 #rrggbb로 만든다. 범위를 벗어나면 자르고 소수는 반올림한다. */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)))
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`
}

/**
 * 계산된 색 문자열을 hex로 바꾼다.
 * oklch 같은 색 공간 변환을 직접 구현하지 않고, 브라우저가 이미 하는 계산을 빌린다 —
 * 1×1 canvas에 그 색을 칠하고 픽셀을 읽는다.
 * 변환할 수 없으면 빈 문자열을 돌려준다.
 */
export function toHex(color: string): string {
  if (!color) return ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return ''

    /*
     * 해석하지 못한 값은 fillStyle 대입이 무시되고 이전 값이 남는다.
     * 서로 다른 두 초기값에서 각각 대입해 결과가 갈리면 해석되지 않은 것이다.
     */
    ctx.fillStyle = '#000000'
    ctx.fillStyle = color
    const fromBlack = ctx.fillStyle
    ctx.fillStyle = '#ffffff'
    ctx.fillStyle = color
    if (fromBlack !== ctx.fillStyle) return ''

    ctx.clearRect(0, 0, 1, 1)
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    if (a === 0) return ''
    return rgbToHex(r, g, b)
  } catch {
    return ''
  }
}
