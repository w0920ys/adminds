import { describe, expect, it } from 'vitest'
import { formatFileSize } from '@/lib/file-size'

describe('formatFileSize', () => {
  it('0 이하는 0 B다', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(-5)).toBe('0 B')
  })

  it('1024 미만은 B 단위, 소수점 없이 반올림한다', () => {
    expect(formatFileSize(1)).toBe('1 B')
    expect(formatFileSize(512)).toBe('512 B')
  })

  it('소수 첫째 자리까지 반올림한다', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1024 * 1024 * 3.4)).toBe('3.4 MB')
  })

  it('NaN·Infinity는 0 B로 방어한다', () => {
    expect(formatFileSize(Number.NaN)).toBe('0 B')
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe('0 B')
  })

  /*
   * 각 단위 경계의 '한 바이트 모자란 값'과 '정확히 그 값'을 짝으로 지킨다.
   * 이전 구현은 반올림 전 값으로만 단위를 골라 1048575(1MB보다 1바이트
   * 작다)가 반올림 뒤 '1024 KB'로 보이는 결함이 있었다 — 다섯 테스트
   * 모두 1024의 정확한 배수만 썼던 탓에 그 결함을 잡지 못했다. 아래는
   * 경계에서 한 바이트 모자란 값을 넣어 그 결함을 다시 심으면 반드시
   * 깨지게 한다.
   */
  describe('단위 경계', () => {
    it('KB 경계 — 1024보다 한 바이트 작으면 B, 정확히 1024면 KB', () => {
      expect(formatFileSize(1024 - 1)).toBe('1023 B')
      expect(formatFileSize(1024)).toBe('1 KB')
    })

    it('MB 경계 — 1024**2보다 한 바이트 작아도 반올림하면 MB로 넘어간다', () => {
      expect(formatFileSize(1024 ** 2 - 1)).toBe('1 MB')
      expect(formatFileSize(1024 ** 2)).toBe('1 MB')
    })

    it('GB 경계', () => {
      expect(formatFileSize(1024 ** 3 - 1)).toBe('1 GB')
      expect(formatFileSize(1024 ** 3)).toBe('1 GB')
    })

    it('TB 경계', () => {
      expect(formatFileSize(1024 ** 4 - 1)).toBe('1 TB')
      expect(formatFileSize(1024 ** 4)).toBe('1 TB')
    })

    it('PB 경계 — 예전에는 여기서 반올림이 1024 TB로 잘못 남았다', () => {
      expect(formatFileSize(1024 ** 5 - 1)).toBe('1 PB')
      expect(formatFileSize(1024 ** 5)).toBe('1 PB')
    })

    it('가장 큰 단위(PB)를 넘는 값은 PB 안에서 자리만 커진다 — 그 위 단위를 이름 붙이지 않았다', () => {
      expect(formatFileSize(1024 ** 6)).toBe('1024 PB')
    })
  })
})
