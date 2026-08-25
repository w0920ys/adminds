/**
 * hover와 focus는 실제 입력 없이 나타나지 않는다.
 * tokens.css의 강제 변형을 붙여 전시한다 — 문서가 그 상태를 보여줘야 하기 때문이다.
 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
}

export function forcedStateClass(stateValue: string | undefined): string | undefined {
  return stateValue ? FORCE_CLASS[stateValue] : undefined
}
