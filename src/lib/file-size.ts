/**
 * 바이트 수를 사람이 읽는 단위로 바꾸는 순수 함수. FileUploadItem이 파일 크기를
 * 보일 때 쓴다. 라이브러리를 들이지 않는다 — 1024 단위로 자리를 옮기는 계산은
 * 순수 함수 하나로 충분하고 그래야 테스트가 값으로 직접 지킬 수 있다.
 */

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/**
 * 0 이하는 '0 B'로 고정한다 — 음수 크기는 있을 수 없으니 방어적으로 바닥을 둔다.
 * B 단위는 소수점을 보이지 않고(정수 바이트라 의미가 없다), 그 위 단위는 소수
 * 첫째 자리까지 반올림한다 — '1.5 MB'는 뜻이 있지만 '1.53214 MB'는 소음이다.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / 1024 ** exponent
  const rounded = exponent === 0 ? Math.round(value) : Math.round(value * 10) / 10

  return `${rounded} ${UNITS[exponent]}`
}
