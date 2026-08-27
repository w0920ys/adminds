import { describe, expect, it } from 'vitest'
import {
  filterCommandEntries,
  groupCommandEntries,
  type CommandEntry,
} from '@/lib/command-filter'

const ENTRIES: CommandEntry[] = [
  { value: 'dialog', label: 'Dialog', group: 'Components', keywords: ['모달', 'modal'] },
  { value: 'table', label: 'Table', group: 'Components', keywords: ['표'] },
  { value: 'color', label: 'Color', group: 'Foundations' },
  { value: 'logout', label: '로그아웃' },
]

describe('filterCommandEntries', () => {
  it('질의가 비면 전부 돌려준다', () => {
    expect(filterCommandEntries(ENTRIES, '')).toEqual(ENTRIES)
  })

  it('공백만 있는 질의도 비어 있는 것으로 본다', () => {
    expect(filterCommandEntries(ENTRIES, '   ')).toEqual(ENTRIES)
  })

  it('이름을 포함으로 맞춘다', () => {
    expect(filterCommandEntries(ENTRIES, 'abl').map((e) => e.value)).toEqual(['table'])
  })

  it('대소문자를 가리지 않는다', () => {
    expect(filterCommandEntries(ENTRIES, 'DIALOG').map((e) => e.value)).toEqual(['dialog'])
  })

  /* 이름만 훑으면 '모달'로 Dialog에 닿지 않는다. filterOptions와 갈리는 지점이다 */
  it('별칭으로도 맞춘다', () => {
    expect(filterCommandEntries(ENTRIES, '모달').map((e) => e.value)).toEqual(['dialog'])
  })

  /*
   * 훑는 곳은 label과 keywords뿐이다 — value는 보지 않는다. 'logout'은
   * value에만 o가 있고 라벨은 '로그아웃'이라 여기서 걸러진다.
   */
  it('원본 순서를 지킨다', () => {
    expect(filterCommandEntries(ENTRIES, 'o').map((e) => e.value)).toEqual(['dialog', 'color'])
  })

  it('맞는 것이 없으면 빈 배열이다', () => {
    expect(filterCommandEntries(ENTRIES, 'zzz')).toEqual([])
  })
})

describe('groupCommandEntries', () => {
  it('처음 나온 순서로 묶는다', () => {
    expect(groupCommandEntries(ENTRIES).map((s) => s.label)).toEqual([
      'Components',
      'Foundations',
      '',
    ])
  })

  it('같은 묶음의 항목을 한자리에 모은다', () => {
    const sections = groupCommandEntries(ENTRIES)
    expect(sections[0].entries.map((e) => e.value)).toEqual(['dialog', 'table'])
  })

  it('묶음이 없는 항목은 이름표가 빈 묶음에 담긴다', () => {
    const sections = groupCommandEntries(ENTRIES)
    const unlabeled = sections.find((s) => s.label === '')!
    expect(unlabeled.entries.map((e) => e.value)).toEqual(['logout'])
  })

  it('빈 목록은 빈 묶음 목록이다', () => {
    expect(groupCommandEntries([])).toEqual([])
  })
})
