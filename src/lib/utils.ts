import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * tailwind-merge는 이 프로젝트가 tokens.css에 심은 --spacing-control·
 * --spacing-control-sm·--spacing-control-lg를 모른다 — h·min-h·size
 * 그룹의 기본 테마 매처는 표준 스페이싱 스케일(숫자·px·fraction 등)만
 * 인식하므로 h-control 같은 클래스는 어느 그룹에도 잡히지 않고
 * "알 수 없는 클래스"로 그냥 통과한다. 그 상태에서 뒤에 h-auto를
 * 덧붙이면 h-auto는 h 그룹의 정식 멤버라 인식되지만 h-control은
 * 그룹 밖에 있어 둘이 충돌로 잡히지 않는다 — twMerge가 아무것도
 * 지우지 않고 두 클래스를 그대로 남기면, 실제로 이기는 쪽은 최종
 * 스타일시트에서 나중에 정의된 규칙이지 class 속성에서 나중에 적힌
 * 클래스가 아니다. Combobox의 multiple 트리거가 배지 줄바꿈으로
 * 자라야 할 때 h-control(고정 높이)이 h-auto를 누르고 이겨 내용이
 * 테두리 밖으로 넘치던 결함이 바로 이 틈에서 났다.
 *
 * control·control-sm·control-lg를 h·min-h·size 세 그룹 모두에
 * 빠짐없이 직접 등록해 이 프로젝트의 컨트롤 높이 유틸을 표준
 * 스케일과 같은 그룹으로 묶는다 — 이후로는 h-control 뒤에 오는
 * h-auto(또는 그 반대 순서)가 twMerge 단계에서 정상적으로 하나만
 * 남는다. size 그룹은 지금 당장 겹치는 override 자리가 없지만(
 * size-control-sm·size-control-lg는 Avatar·Breadcrumb가 쓰고,
 * size-control은 Button의 icon 크기가 쓴다), 세 토큰 중 하나만
 * 빠뜨리면 나중에 누가 그 하나 위에 size-auto 같은 표준 크기를
 * 덧붙일 때 똑같은 틈에 빠진다 — h·min-h와 다르게 세 토큰을
 * 고르지 않고 전부 등록해야 이 그룹이 실제로 안전하다.
 *
 * theme.spacing 쪽의 일반 매처를 넓히는 대신 classGroups를 직접
 * 확장한 것은 의도적이다 — theme.spacing을 건드리면 p-·m-·gap-·w-
 * 등 스페이싱 스케일을 쓰는 모든 그룹이 영향을 받아 파급 범위를
 * 가늠하기 어렵다. h·min-h·size 세 그룹만 정확히 넓히면 다른
 * 유틸리티의 병합 규칙은 그대로다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      h: [{ h: ['control', 'control-sm', 'control-lg'] }],
      'min-h': [{ 'min-h': ['control', 'control-sm', 'control-lg'] }],
      size: [{ size: ['control', 'control-sm', 'control-lg'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
