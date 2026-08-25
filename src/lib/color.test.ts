import { describe, expect, it } from 'vitest'
import { rgbToHex } from '@/lib/color'

describe('rgbToHex', () => {
  it('세 채널을 여섯 자리 hex로 만든다', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
  })

  it('한 자리 값을 0으로 채운다', () => {
    expect(rgbToHex(1, 2, 3)).toBe('#010203')
  })

  it('범위를 벗어난 값을 자른다', () => {
    expect(rgbToHex(-10, 300, 128)).toBe('#00ff80')
  })

  it('소수를 반올림한다', () => {
    expect(rgbToHex(127.6, 0, 0)).toBe('#800000')
  })
})
