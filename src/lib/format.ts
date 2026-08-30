/**
 * 퍼센트를 소수점 자릿수 지정해 문자열로 만든다. digits 기본값은 1 —
 * ChartFunnel의 전체 전환율처럼 한 자리 소수가 필요한 자리에 맞춘다.
 * 반올림은 Number.toFixed에 그대로 맡긴다 — 이 값들은 화면에 보이는
 * 요약 수치라 계산 정밀도(은행가 반올림 등)까지 다툴 자리가 아니다.
 */
export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}
