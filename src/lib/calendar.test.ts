import { describe, expect, it } from 'vitest'
import { addMonths, buildMonthGrid, formatISODate, isBeforeDay, isSameDay } from '@/lib/calendar'

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
      const gap = flat[i].date.getTime() - flat[i - 1].date.getTime()
      expect(gap).toBe(24 * 60 * 60 * 1000)
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
