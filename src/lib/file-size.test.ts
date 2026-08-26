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
    expect(formatFileSize(1023)).toBe('1023 B')
  })

  it('KB 단위로 넘어간다', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1024 * 999)).toBe('999 KB')
  })

  it('MB·GB 단위로 넘어간다', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    expect(formatFileSize(1024 * 1024 * 3.4)).toBe('3.4 MB')
    expect(formatFileSize(1024 * 1024 * 1024 * 2)).toBe('2 GB')
  })

  it('NaN·Infinity는 0 B로 방어한다', () => {
    expect(formatFileSize(Number.NaN)).toBe('0 B')
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe('0 B')
  })
})
