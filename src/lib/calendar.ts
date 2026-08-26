/**
 * 한 달의 격자를 만드는 순수 함수들. 달력 라이브러리를 들이지 않는다 — 한 달의 격자를
 * 만드는 일은 날짜 계산이고 그것은 순수 함수라 테스트가 직접 값으로 지킬 수 있다.
 */

const WEEKS_IN_GRID = 6
const DAYS_IN_WEEK = 7
/** 하루를 대표하는 시각으로 자정이 아니라 정오를 쓴다. 아래 buildMonthGrid 주석 참고 */
const NOON_UTC_HOUR = 12

/**
 * 한 달 격자의 한 칸. date는 그 날 UTC 정오를 가리키는 시각이고, inMonth는 이 칸이
 * buildMonthGrid에 넘긴 달에 속하는 날인지를 나타낸다(앞뒤 칸은 이웃 달의 날이라 false).
 */
export type MonthGridCell = {
  date: Date
  inMonth: boolean
}

/**
 * year·day로 그 달의 마지막 날짜를 구한다. month+1의 0번째 날은 곧 month의 마지막
 * 날이라는 달력 규칙을 쓴다 — 31을 하드코딩하지 않아 2월도 그대로 맞는다.
 */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

/**
 * year·month·day가 가리키는 날의 UTC 정오 Date를 만든다. day가 그 달의 범위를
 * 벗어나도(0 이하거나 그 달의 마지막 날을 넘어도) Date.UTC가 달력 계산으로
 * 정규화해 이웃 달·이웃 해로 굴러간다.
 *
 * 자정이 아니라 정오를 쓰는 이유 — 로컬 자정 기준으로 하루(24시간)를 밀리초로
 * 더하면 서머타임이 있는 표준시대에서 봄에는 23시간, 가을에는 25시간이 되어
 * 격자가 하루씩 어긋난다. 게다가 UTC는 서머타임 자체가 없으므로, 정오를 UTC로
 * 고정하면 이 함수가 어느 표준시에서 실행되든 이웃 날짜 사이의 간격이 항상
 * 정확히 24시간이다. 한국은 서머타임이 없지만 이 컴포넌트를 쓰는 화면이 항상
 * 한국 표준시에서 열린다고 보장할 수 없어 그 사실에 기대지 않는다.
 */
function noonUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, NOON_UTC_HOUR))
}

/**
 * year·month(Date와 같이 0부터 시작하는 값 — 0이 1월, 11이 12월)가 가리키는 달의
 * 여섯 주 × 일곱 날 격자를 만든다. 일요일에서 시작하고, 그 달에 속하지 않는
 * 앞뒤 칸은 이웃 달의 날짜로 채운다.
 */
export function buildMonthGrid(year: number, month: number): MonthGridCell[][] {
  const firstOfMonth = noonUtc(year, month, 1)
  const startWeekday = firstOfMonth.getUTCDay()
  const totalDaysInMonth = daysInMonth(year, month)

  const cells: MonthGridCell[] = []
  for (let i = 0; i < WEEKS_IN_GRID * DAYS_IN_WEEK; i += 1) {
    const dayOfMonth = 1 - startWeekday + i
    cells.push({
      date: noonUtc(year, month, dayOfMonth),
      inMonth: dayOfMonth >= 1 && dayOfMonth <= totalDaysInMonth,
    })
  }

  const weeks: MonthGridCell[][] = []
  for (let week = 0; week < WEEKS_IN_GRID; week += 1) {
    weeks.push(cells.slice(week * DAYS_IN_WEEK, (week + 1) * DAYS_IN_WEEK))
  }
  return weeks
}

/**
 * year·month를 delta달만큼 옮긴다. 12로 나눈 나머지로 계산해 해 경계를 자연히
 * 넘는다 — 12월에 1을 더하면 다음 해 1월이고, 1월에서 1을 빼면 지난해 12월이다.
 */
export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + month + delta
  const normalizedMonth = ((total % 12) + 12) % 12
  const normalizedYear = Math.floor(total / 12)
  return { year: normalizedYear, month: normalizedMonth }
}

/** Date를 'YYYY-MM-DD'로 적는다. 로컬 달력 날짜(연·월·일)를 그대로 쓴다 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 두 Date가 같은 로컬 달력 날짜를 가리키는지. 시각은 보지 않는다 */
export function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/**
 * a가 b보다 앞선 로컬 달력 날짜인지(시각은 무시한다). 'YYYY-MM-DD' 문자열은
 * 자릿수가 고정돼 있어 문자열 비교의 순서가 곧 날짜 순서와 같다.
 */
export function isBeforeDay(a: Date, b: Date): boolean {
  return formatISODate(a) < formatISODate(b)
}
