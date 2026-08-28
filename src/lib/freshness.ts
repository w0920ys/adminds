/**
 * 문서가 이번 릴리스에서 바뀌었는지 판단한다.
 *
 * LNB와 검색 결과의 업데이트 점(dot)이 이 판단 하나에 달려 있다. 하루가
 * 지나면 사라지는 방식 대신 릴리스 단위로 판단한다 — 문서의 updatedAt이
 * 최신 릴리스가 나온 날짜이거나 그 이후면 이번 릴리스에서 바뀐 것으로 본다.
 * 다음 릴리스를 준비하며 먼저 고쳐 둔 문서(최신 릴리스보다 늦은 날짜)도
 * 아직 릴리스 기록에 적히지 않았을 뿐 이번 릴리스에서 바뀐 것이므로 포함한다.
 *
 * 기준이 되는 릴리스 날짜는 이 파일이 스스로 찾지 않는다. releases.ts를
 * 직접 알게 하면 순수 함수 하나가 데이터 구조 하나를 통째로 끌고 다니게
 * 되므로, 호출하는 쪽이 currentRelease.publishedAt을 읽어 넘긴다 — GNB
 * 제목 옆 버전 배지가 이미 그 값을 읽는 자리와 같다.
 *
 * 날짜만 있고 시각은 없으므로 두 값 모두 로컬 자정으로 읽어 비교한다.
 */

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
 * updatedAt이 releaseDate와 같거나 그 이후인가 — "이번 릴리스에서 바뀌었는가".
 * 둘 중 하나라도 형식을 읽을 수 없으면 바뀐 것으로 치지 않는다.
 */
export function isUpdatedInRelease(updatedAt: string, releaseDate: string): boolean {
  const docDate = parseDocDate(updatedAt)
  const release = parseDocDate(releaseDate)
  if (!docDate || !release) return false

  return docDate.getTime() >= release.getTime()
}
