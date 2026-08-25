/**
 * 이 화면에서 스크롤하는 것은 main 하나다.
 * 그 사실을 아는 곳을 여기 하나로 두어, 스크롤을 다루는 코드가 흩어지지 않게 한다.
 */
export function scrollRoot(): HTMLElement | null {
  return document.querySelector('main')
}

/** 제목을 스크롤 컨테이너의 맨 위로 올린다. 대상을 찾지 못하면 아무것도 하지 않는다 */
export function scrollToHeading(id: string): boolean {
  const root = scrollRoot()
  const target = document.getElementById(id)
  if (!root || !target) return false
  root.scrollTop += target.getBoundingClientRect().top - root.getBoundingClientRect().top
  return true
}

/**
 * 주소가 가리키는 절의 id를 읽는다.
 * 인코딩이 깨져 있으면 원문 그대로 본다 — 잘린 붙여넣기로 '%'가 홀로 남으면
 * decodeURIComponent가 던지고, 그 예외가 화면 전체를 오류 페이지로 바꾼다.
 */
export function readHash(): string {
  const raw = window.location.hash.slice(1)
  if (!raw) return ''
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}
