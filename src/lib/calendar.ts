/**
 * 한 달의 격자를 만드는 순수 함수들. 달력 라이브러리를 들이지 않는다 — 한 달의 격자를
 * 만드는 일은 날짜 계산이고 그것은 순수 함수라 테스트가 직접 값으로 지킬 수 있다.
 *
 * 이 파일이 다루는 Date는 모두 로컬 달력 날짜를 뜻한다 — 만들 때는 그 날 로컬 정오를
 * 쓰고(noonLocal), 읽을 때는 로컬 연·월·일 게터만 본다. 두 쪽이 같은 달력을 보므로
 * 아래 함수들은 어느 표준시에서 실행되든 같은 날을 같은 날로 다룬다. 정오를 쓰는
 * 이유는 noonLocal 주석에 있다. daysInMonth만 Date를 주고받지 않는 순수 산술이라
 * 표준시와 무관하다.
 */

const WEEKS_IN_GRID = 6
const DAYS_IN_WEEK = 7
/** 하루를 대표하는 시각으로 자정이 아니라 정오를 쓴다. 아래 noonLocal 주석 참고 */
const NOON_HOUR = 12
/** 하루의 밀리초. 정오로 고정된 날짜에 더하고 빼면 서머타임이 있어도 날짜가 하루씩 옮겨간다 */
const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * 한 달 격자의 한 칸. date는 그 날 로컬 정오를 가리키는 시각이고, inMonth는 이 칸이
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
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

/**
 * year·month·day가 가리키는 날의 로컬 정오 Date를 만든다. day가 그 달의 범위를
 * 벗어나도(0 이하거나 그 달의 마지막 날을 넘어도) Date 생성자가 달력 계산으로
 * 정규화해 이웃 달·이웃 해로 굴러간다.
 *
 * 자정이 아니라 정오를 쓰는 이유 — 자정 기준으로 하루(86400000밀리초)를 더하면
 * 서머타임이 있는 표준시대에서 그 하루가 23시간이거나 25시간이라 날짜가 어긋난다
 * (America/New_York에서 2026-11-01 자정에 86400000을 더하면 여전히 11월 1일이다).
 * 정오는 서머타임이 한두 시간 앞뒤로 밀어도 같은 날 안에 머물러 이 어긋남이 없다.
 *
 * UTC 정오가 아니라 로컬 정오를 쓰는 이유 — 이 파일의 날짜 판정(formatISODate·
 * isSameDay·isBeforeDay)과 Calendar가 칸에 그리는 숫자는 모두 로컬 연·월·일
 * 게터를 읽는다. 정오를 UTC로 고정하면 UTC+12 이상인 표준시대(뉴질랜드·피지,
 * 서머타임 동안의 노퍽 섬)에서는 그 시각이 이미 다음 날이라 격자 전체가 하루
 * 밀린다 — 2026년 8월 격자의 첫 칸이 Pacific/Auckland에서 7월 26일이 아니라
 * 27일로 읽혔다. 로컬 정오로 고정하면 만드는 쪽과 읽는 쪽이 같은 달력을 본다.
 */
function noonLocal(year: number, month: number, day: number): Date {
  return new Date(year, month, day, NOON_HOUR)
}

/**
 * year·month(Date와 같이 0부터 시작하는 값 — 0이 1월, 11이 12월)가 가리키는 달의
 * 여섯 주 × 일곱 날 격자를 만든다. 일요일에서 시작하고, 그 달에 속하지 않는
 * 앞뒤 칸은 이웃 달의 날짜로 채운다.
 */
export function buildMonthGrid(year: number, month: number): MonthGridCell[][] {
  const firstOfMonth = noonLocal(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const totalDaysInMonth = daysInMonth(year, month)

  const cells: MonthGridCell[] = []
  for (let i = 0; i < WEEKS_IN_GRID * DAYS_IN_WEEK; i += 1) {
    const dayOfMonth = 1 - startWeekday + i
    cells.push({
      date: noonLocal(year, month, dayOfMonth),
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

/**
 * date에 amount일을 더한다(음수면 뺀다). date가 buildMonthGrid의 칸처럼 정오를
 * 가리키면, 이 함수가 어느 표준시에서 실행되든 amount일 뒤(앞)의 로컬 달력 날짜를
 * 돌려준다 — 서머타임 경계를 넘는 날은 결과의 시각이 11시나 13시로 밀리지만
 * 날짜는 그대로다. 자정 기준으로 더했다면 그 밀림이 곧 날짜의 어긋남이 됐다.
 */
export function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * MS_PER_DAY)
}

/**
 * date를 delta달만큼 옮긴다. 옮긴 달에 그 날짜가 없으면(예: 1월 31일에서 한 달 뒤로
 * 가면 2월은 31일이 없다) 그 달의 마지막 날로 당겨(clamp) 존재하지 않는 날짜를
 * 만들지 않는다. 결과도 buildMonthGrid의 칸과 같은 로컬 정오 기준이다.
 */
export function addMonthsToDate(date: Date, delta: number): Date {
  const { year, month } = addMonths(date.getFullYear(), date.getMonth(), delta)
  const day = Math.min(date.getDate(), daysInMonth(year, month))
  return noonLocal(year, month, day)
}
