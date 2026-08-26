import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  addMonths,
  addMonthsToDate,
  buildMonthGrid,
  daysInMonth,
  formatISODate,
  isBeforeDay,
  isSameDay,
} from '@/lib/calendar'

describe('buildMonthGrid', () => {
  it('여섯 주 곱하기 이레를 돌려준다', () => {
    const grid = buildMonthGrid(2026, 7)
    expect(grid).toHaveLength(6)
    for (const week of grid) expect(week).toHaveLength(7)
  })

  it('일요일에서 시작한다', () => {
    const grid = buildMonthGrid(2026, 7)
    expect(grid[0][0].date.getDay()).toBe(0)
  })

  it('그 달에 속하는지 표시한다', () => {
    const grid = buildMonthGrid(2026, 7)
    const inMonth = grid.flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(31)
    expect(inMonth[0].date.getDate()).toBe(1)
    expect(inMonth[30].date.getDate()).toBe(31)
  })

  it('윤년의 2월은 스물아홉 날이다', () => {
    const inMonth = buildMonthGrid(2028, 1).flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(29)
  })

  it('평년의 2월은 스물여덟 날이다', () => {
    const inMonth = buildMonthGrid(2026, 1).flat().filter((cell) => cell.inMonth)
    expect(inMonth).toHaveLength(28)
  })

  it('앞뒤 칸은 이웃한 달의 날로 채운다', () => {
    const grid = buildMonthGrid(2026, 7)
    const flat = grid.flat()
    const first = flat.findIndex((cell) => cell.inMonth)
    if (first > 0) expect(flat[first - 1].date.getMonth()).toBe(6)
  })

  it('격자의 날짜가 하루씩 이어진다', () => {
    const flat = buildMonthGrid(2026, 7).flat()
    for (let i = 1; i < flat.length; i += 1) {
      const prev = flat[i - 1].date
      const nextDay = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1, 12)
      expect(formatISODate(flat[i].date)).toBe(formatISODate(nextDay))
      expect(flat[i].date.getDay()).toBe((prev.getDay() + 1) % 7)
    }
  })
})

describe('addMonths', () => {
  it('같은 해 안에서는 달만 옮긴다', () => {
    expect(addMonths(2026, 7, 1)).toEqual({ year: 2026, month: 8 })
  })

  it('12월 다음은 다음 해 1월이다', () => {
    expect(addMonths(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
  })

  it('1월 이전은 지난해 12월이다', () => {
    expect(addMonths(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
  })

  it('여러 달을 한 번에 옮겨도 해를 정확히 넘는다', () => {
    expect(addMonths(2026, 7, 20)).toEqual({ year: 2028, month: 3 })
    expect(addMonths(2026, 0, -13)).toEqual({ year: 2024, month: 11 })
  })
})

describe('formatISODate', () => {
  it('YYYY-MM-DD로 적는다', () => {
    expect(formatISODate(new Date(2026, 7, 3))).toBe('2026-08-03')
  })

  it('한 자리 달·날짜를 0으로 채운다', () => {
    expect(formatISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('isSameDay', () => {
  it('같은 날이면 참이다', () => {
    expect(isSameDay(new Date(2026, 7, 3, 9), new Date(2026, 7, 3, 18))).toBe(true)
  })

  it('시각이 달라도 날짜가 다르면 거짓이다', () => {
    expect(isSameDay(new Date(2026, 7, 3), new Date(2026, 7, 4))).toBe(false)
  })

  it('둘 중 하나가 없으면 거짓이다', () => {
    expect(isSameDay(undefined, new Date(2026, 7, 3))).toBe(false)
    expect(isSameDay(new Date(2026, 7, 3), undefined)).toBe(false)
  })
})

describe('isBeforeDay', () => {
  it('앞선 날짜면 참이다', () => {
    expect(isBeforeDay(new Date(2026, 7, 3), new Date(2026, 7, 4))).toBe(true)
  })

  it('같은 날이면 거짓이다', () => {
    expect(isBeforeDay(new Date(2026, 7, 3, 1), new Date(2026, 7, 3, 23))).toBe(false)
  })

  it('해가 달라도 정확히 비교한다', () => {
    expect(isBeforeDay(new Date(2026, 11, 31), new Date(2027, 0, 1))).toBe(true)
  })
})

describe('addDays', () => {
  it('하루를 더하면 다음 날이다', () => {
    const day = new Date(2026, 7, 26, 12)
    expect(formatISODate(addDays(day, 1))).toBe('2026-08-27')
  })

  it('음수를 더하면 이전 날이다', () => {
    const day = new Date(2026, 7, 1, 12)
    expect(formatISODate(addDays(day, -1))).toBe('2026-07-31')
  })

  it('여러 날을 더해도 달을 정확히 넘는다', () => {
    const day = new Date(2026, 11, 28, 12)
    expect(formatISODate(addDays(day, 7))).toBe('2027-01-04')
  })
})

describe('addMonthsToDate', () => {
  it('그 달에 같은 날짜가 있으면 날짜는 그대로다', () => {
    expect(formatISODate(addMonthsToDate(new Date(2026, 6, 15, 12), 1))).toBe('2026-08-15')
  })

  it('옮긴 달에 그 날짜가 없으면 마지막 날로 당긴다', () => {
    expect(formatISODate(addMonthsToDate(new Date(2026, 0, 31, 12), 1))).toBe('2026-02-28')
  })

  it('윤년의 2월로 당길 때는 스물아홉 날까지 허용한다', () => {
    expect(formatISODate(addMonthsToDate(new Date(2028, 0, 31, 12), 1))).toBe('2028-02-29')
  })

  it('해 경계를 넘어도 정확하다', () => {
    expect(formatISODate(addMonthsToDate(new Date(2026, 11, 15, 12), 1))).toBe('2027-01-15')
  })

  it('정오를 그대로 지킨다', () => {
    expect(addMonthsToDate(new Date(2026, 6, 15, 12), 1).getHours()).toBe(12)
  })
})

describe('daysInMonth', () => {
  it('1월은 서른한 날이다', () => {
    expect(daysInMonth(2026, 0)).toBe(31)
  })

  it('평년의 2월은 스물여덟 날이다', () => {
    expect(daysInMonth(2026, 1)).toBe(28)
  })

  it('윤년의 2월은 스물아홉 날이다', () => {
    expect(daysInMonth(2028, 1)).toBe(29)
  })

  it('4월은 서른 날이다', () => {
    expect(daysInMonth(2026, 3)).toBe(30)
  })
})

/*
 * 이 파일의 함수들은 로컬 달력 날짜를 다룬다(calendar.ts 머리 주석) — 만드는 쪽
 * (buildMonthGrid·addMonthsToDate)과 읽는 쪽(formatISODate·isSameDay·isBeforeDay)이
 * 같은 달력을 봐야 한다. 아래는 그 약속이 표준시를 바꿔도 지켜지는지 실제로 TZ를
 * 갈아 끼워 확인한다. UTC+12 이상(Auckland·Kiritimati, 서머타임 동안의 Norfolk)은
 * UTC 정오로 칸을 만들던 이전 구현이 하루씩 밀리던 자리이고, America/New_York은
 * 자정으로 칸을 만들었다면 서머타임 경계에서 밀렸을 자리다.
 */
describe('표준시를 바꿔도', () => {
  /*
   * vi.stubEnv로 TZ를 갈아 끼운다 — Node는 Date를 만들 때마다 TZ를 다시 읽으므로
   * 이 자리에서 바꾼 값이 곧바로 아래 계산에 반영된다. unstubAllEnvs가 원래
   * 값으로 되돌려 다른 테스트 파일이 이 변경을 물려받지 않게 한다.
   */
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  const zones = [
    'UTC',
    'Asia/Seoul',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/Berlin',
    'Pacific/Pago_Pago',
    'Pacific/Norfolk',
    'Pacific/Auckland',
    'Pacific/Kiritimati',
  ]

  for (const zone of zones) {
    describe(zone, () => {
      beforeEach(() => {
        vi.stubEnv('TZ', zone)
      })

      it('격자가 그 달의 첫날부터 마지막 날까지를 제 날짜로 담는다', () => {
        const inMonth = buildMonthGrid(2026, 7).flat().filter((cell) => cell.inMonth)
        expect(formatISODate(inMonth[0].date)).toBe('2026-08-01')
        expect(formatISODate(inMonth[inMonth.length - 1].date)).toBe('2026-08-31')
      })

      it('격자의 첫 칸은 일요일이고 그 주가 이레 동안 이어진다', () => {
        const week = buildMonthGrid(2026, 0).flat().slice(0, 7)
        expect(week[0].date.getDay()).toBe(0)
        expect(week.map((cell) => formatISODate(cell.date))).toEqual([
          '2025-12-28',
          '2025-12-29',
          '2025-12-30',
          '2025-12-31',
          '2026-01-01',
          '2026-01-02',
          '2026-01-03',
        ])
      })

      it('격자의 칸과 바깥에서 만든 같은 날의 Date가 같은 날로 읽힌다', () => {
        const cell = buildMonthGrid(2026, 7)
          .flat()
          .find((c) => c.inMonth && c.date.getDate() === 26)!
        expect(isSameDay(cell.date, new Date(2026, 7, 26))).toBe(true)
        expect(isBeforeDay(cell.date, new Date(2026, 7, 27))).toBe(true)
        expect(isBeforeDay(new Date(2026, 7, 25), cell.date)).toBe(true)
      })

      it('한 해 열두 달의 격자가 모두 하루씩 이어진다', () => {
        for (let month = 0; month < 12; month += 1) {
          const flat = buildMonthGrid(2026, month).flat()
          for (let i = 1; i < flat.length; i += 1) {
            const prev = flat[i - 1].date
            const nextDay = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1, 12)
            expect(formatISODate(flat[i].date), `${zone} ${month + 1}월 ${i}번째 칸`).toBe(
              formatISODate(nextDay),
            )
          }
        }
      })

      it('addDays·addMonthsToDate가 한 해 어느 날에서도 로컬 달력과 어긋나지 않는다', () => {
        for (let dayOfYear = 0; dayOfYear < 365; dayOfYear += 1) {
          const day = new Date(2026, 0, 1 + dayOfYear, 12)
          const expected = new Date(2026, 0, 1 + dayOfYear + 1, 12)
          expect(formatISODate(addDays(day, 1)), `${zone} ${formatISODate(day)}`).toBe(
            formatISODate(expected),
          )
          expect(addMonthsToDate(day, 1).getDate(), `${zone} ${formatISODate(day)}`).toBe(
            Math.min(day.getDate(), daysInMonth(2026, (day.getMonth() + 1) % 12)),
          )
        }
      })
    })
  }

  it('서머타임이 시작·끝나는 날을 지나도 하루는 하루다', () => {
    // 2026년 America/New_York: 3월 8일에 한 시간 잃고(23시간) 11월 1일에 한 시간 얻는다(25시간)
    vi.stubEnv('TZ', 'America/New_York')
    expect(formatISODate(addDays(new Date(2026, 2, 8, 12), 1))).toBe('2026-03-09')
    expect(formatISODate(addDays(new Date(2026, 2, 8, 12), -1))).toBe('2026-03-07')
    expect(formatISODate(addDays(new Date(2026, 10, 1, 12), 1))).toBe('2026-11-02')
    expect(formatISODate(addDays(new Date(2026, 10, 1, 12), -1))).toBe('2026-10-31')
  })
})
