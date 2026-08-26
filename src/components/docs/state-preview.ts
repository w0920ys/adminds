/**
 * hover·focus·dragging은 실제 입력 없이 나타나지 않는다 — dragging은 파일을
 * 끌고 영역 위에 왔을 때만 붙는 상태다.
 * tokens.css의 강제 변형을 붙여 전시한다 — 문서가 그 상태를 보여줘야 하기 때문이다.
 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
  dragging: 'state-dragging',
}

export function forcedStateClass(stateValue: string | undefined): string | undefined {
  return stateValue ? FORCE_CLASS[stateValue] : undefined
}
