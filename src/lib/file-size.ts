/**
 * 바이트 수를 사람이 읽는 단위로 바꾸는 순수 함수. FileUploadItem이 파일 크기를
 * 보일 때 쓴다. 라이브러리를 들이지 않는다 — 1024 단위로 자리를 옮기는 계산은
 * 순수 함수 하나로 충분하고 그래야 테스트가 값으로 직접 지킬 수 있다.
 */

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const

/**
 * 0 이하는 '0 B'로 고정한다 — 음수 크기는 있을 수 없으니 방어적으로 바닥을 둔다.
 * B 단위는 소수점을 보이지 않고(정수 바이트라 의미가 없다), 그 위 단위는 소수
 * 첫째 자리까지 반올림한다 — '1.5 MB'는 뜻이 있지만 '1.53214 MB'는 소음이다.
 *
 * 단위는 반올림을 마친 값을 기준으로 고른다 — 반올림 전 값만 보고 고르면
 * 1048575바이트(1MB보다 1바이트 작다)가 1024 KB로 나온다. 1023.999...KB를
 * 소수 첫째 자리까지 반올림하면 1024.0이 되는데, 그 반올림한 값은 이미
 * 그 단위의 천장(1024)을 넘었으니 실제로는 한 단계 위 단위(1 MB)로 읽어야
 * 맞다. 그래서 while로 1024 미만이 될 때까지 나눈 뒤에도, 반올림한 값이
 * 다시 1024에 닿으면 한 번 더 올린다.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

  let exponent = 0
  let value = bytes
  while (value >= 1024 && exponent < UNITS.length - 1) {
    value /= 1024
    exponent += 1
  }

  let rounded = exponent === 0 ? Math.round(value) : Math.round(value * 10) / 10

  if (rounded >= 1024 && exponent < UNITS.length - 1) {
    exponent += 1
    value /= 1024
    rounded = Math.round(value * 10) / 10
  }

  return `${rounded} ${UNITS[exponent]}`
}
