import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

/**
 * tokens.css에서 온 유틸(h-control·min-w-control-lg·left-control-lg …)이
 * twMerge의 그룹 밖에 있으면 표준 유틸과 충돌로 잡히지 않아 둘 다 살아남고,
 * 이기는 쪽을 최종 스타일시트의 정의 순서가 정한다. 그 틈에서 Combobox의
 * 높이 결함이 났고, DataTable의 sticky 열 오프셋도 같은 틈 위에 서 있었다.
 *
 * utils.ts가 그것을 막으려고 classGroups를 넓혔으므로 넓힌 그룹마다 한 줄씩
 * 못 박는다. 등록이 빠지면 아래 기대값은 'a b'처럼 둘 다 남은 문자열이 되어
 * 그 자리에서 깨진다.
 */
describe('cn', () => {
  it('토큰 유틸과 표준 유틸이 같은 그룹에서 충돌해 하나만 남는다', () => {
    expect(cn('h-control', 'h-auto')).toBe('h-auto')
    expect(cn('h-row', 'h-row-compact')).toBe('h-row-compact')
    expect(cn('min-h-control', 'min-h-0')).toBe('min-h-0')
    expect(cn('size-control-lg', 'size-4')).toBe('size-4')
    expect(cn('min-w-control-lg', 'min-w-0')).toBe('min-w-0')
    expect(cn('left-0', 'left-control-lg')).toBe('left-control-lg')
  })

  /*
   * DataTable이 sticky 열에 실제로 만드는 조합이다. table.tsx가 left-0을
   * 먼저 내보내고 DataTable이 left-control-lg를 뒤에 얹는다.
   */
  it('sticky 열의 오프셋은 나중에 온 것만 남는다', () => {
    expect(cn('bg-surface sticky left-0 z-sticky', 'left-control-lg')).toBe(
      'bg-surface sticky z-sticky left-control-lg',
    )
  })

  /* inset은 left를 포함하므로, 뒤에 오면 앞의 left 토큰을 지워야 한다 */
  it('inset이 앞의 left 토큰을 지운다', () => {
    expect(cn('left-control-lg', 'inset-0')).toBe('inset-0')
  })
})
