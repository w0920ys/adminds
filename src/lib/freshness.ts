/**
 * 문서가 방금 바뀌었는지 판단한다.
 *
 * LNB의 New 배지가 이 판단 하나에 달려 있다. 배지는 "지금 들어오면 새로 볼 것이
 * 있다"는 신호이므로 오래 남으면 안 된다 — 하루가 지나면 사라진다.
 *
 * 날짜만 있고 시각은 없으므로 갱신 시점을 그날 자정으로 읽는다.
 * 오늘 고친 문서는 오늘 하루 배지를 달고, 자정을 넘기면 스스로 떨어진다.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/** YYYY-MM-DD를 로컬 자정으로 읽는다. 형식이 아니면 undefined. */
export function parseDocDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  // 2026-02-31처럼 넘겨받은 값이 굴러가 다른 날이 되는 경우를 걸러낸다
  if (date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return undefined
  return date
}

/**
 * 갱신일에서 하루가 지나지 않았는가.
 * now를 인자로 받는 이유는 테스트 때문만이 아니다 — 자정을 넘긴 화면에서
 * 다시 계산할 수 있어야 배지가 제때 사라진다.
 */
export function isFresh(updatedAt: string, now: Date = new Date()): boolean {
  const date = parseDocDate(updatedAt)
  if (!date) return false

  const elapsed = now.getTime() - date.getTime()
  // 앞선 날짜(elapsed < 0)는 아직 오지 않은 갱신이므로 배지를 달지 않는다
  return elapsed >= 0 && elapsed < DAY_MS
}
