const nf = new Intl.NumberFormat('ko-KR')

export function formatNumber(n: number): string {
  return nf.format(Math.round(n))
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}
