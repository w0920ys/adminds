export type ComponentCategory =
  | 'actions'
  | 'inputs'
  | 'navigation'
  | 'feedback'
  | 'data-display'

export type ComponentStatus = 'draft' | 'review' | 'stable' | 'deprecated'

export type AnatomyPart = {
  /** 미리보기의 data-anatomy 속성과 맞물리는 id */
  part: string
  /** 해부도에 표시할 이름 */
  label: string
  /** 치수·역할 설명 */
  note: string
  /** 없어도 되는 부위인지 */
  optional?: boolean
}

export type PropertyOption = {
  value: string
  /** 표시용. 없으면 value를 쓴다 */
  label?: string
  /** 이 옵션을 언제 쓰는가 */
  note?: string
}

export type ComponentProperty = {
  /** 축의 식별자. 컴포넌트의 실제 prop일 수도 있고(variant, size), 조합으로 표현되는 축일 수도 있다(layout, width, state) */
  name: string
  /** 문서에 표시할 제목 */
  title: string
  /** 이 축이 무엇을 정하는가 */
  description: string
  options: PropertyOption[]
  /** grid = 옵션을 격자로, row = 한 줄로, matrix = 다른 축과 교차 */
  display: 'grid' | 'row' | 'matrix'
  /** display가 matrix일 때 교차할 축 이름 */
  crossWith?: string
}

export type Guideline = {
  /** 예시 렌더링을 페이지가 주입할 때 쓰는 식별자 */
  id: string
  title: string
  body: string
  do?: string[]
  dont?: string[]
}

export type Example = {
  /** 예시 렌더링을 페이지가 주입할 때 쓰는 식별자 */
  id: string
  title: string
  note: string
}

export type ComponentMeta = {
  id: string
  name: string
  category: ComponentCategory
  status: ComponentStatus
  addedIn: string
  changedIn: string
  purpose: string
  anatomy: AnatomyPart[]
  properties: ComponentProperty[]
  guidelines: Guideline[]
  usage: Example[]
  cases: Example[]
  verified: boolean
}

export const components: ComponentMeta[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.2.0',
    changedIn: 'v0.3.0',
    purpose: '사용자가 즉시 실행할 수 있는 동작을 나타낸다. 페이지 이동은 링크를 쓴다.',
    anatomy: [
      { part: 'container', label: 'Container', note: '높이는 size 토큰, 모서리는 radius-md' },
      { part: 'prefix-icon', label: 'Prefix Icon', note: '16×16, 라벨과 8px 간격', optional: true },
      { part: 'label', label: 'Label', note: 'text-sm / font-medium' },
      { part: 'suffix-icon', label: 'Suffix Icon', note: '16×16, 라벨과 8px 간격', optional: true },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '동작의 위계와 성격을 정한다. 한 화면의 주요 동작에만 default를 쓴다.',
        display: 'row',
        options: [
          { value: 'default', note: '이 화면에서 가장 중요한 동작' },
          { value: 'secondary', note: '주요 동작 옆의 보조 동작' },
          { value: 'outline', note: '배경과 구분이 필요한 중립 동작' },
          { value: 'ghost', note: '표 행 내부처럼 밀도가 높은 자리' },
          { value: 'destructive', note: '삭제·차단처럼 되돌리기 어려운 동작' },
          { value: 'link', note: '문장 안에서 동작을 실행할 때' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '주변 컨트롤의 밀도에 맞춘다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 행, 필터 바' },
          { value: 'default', note: '기본' },
          { value: 'lg', note: '빈 상태나 온보딩의 단독 동작' },
          { value: 'icon', note: '아이콘만 있는 정사각 버튼' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '아이콘과 라벨의 배치를 정한다. 아이콘은 라벨의 뜻을 보강할 때만 쓴다.',
        display: 'row',
        options: [
          { value: 'label-only', label: '라벨만', note: '기본' },
          { value: 'icon-leading', label: '앞 아이콘', note: '동작의 종류를 아이콘으로 먼저 알릴 때' },
          { value: 'icon-trailing', label: '뒤 아이콘', note: '이동·펼침처럼 결과를 암시할 때' },
          { value: 'icon-only', label: '아이콘만', note: '자리가 좁을 때. aria-label이 반드시 필요' },
        ],
      },
      {
        name: 'width',
        title: 'Width',
        description: '버튼이 차지하는 가로 폭을 정한다.',
        display: 'row',
        options: [
          { value: 'hug', label: '내용에 맞춤', note: '기본' },
          { value: 'fill', label: '가득 채움', note: '모바일 하단 고정 동작, 좁은 폼' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용과 처리 상황을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 실행할 수 없음. 이유를 함께 알린다' },
          { value: 'loading', note: '처리 중. disabled와 스피너를 함께 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'hierarchy',
        title: 'Hierarchy',
        body: '한 화면에는 주요 동작이 하나만 있어야 합니다. default를 여러 개 두면 무엇을 먼저 해야 할지 알 수 없게 됩니다. 주요 동작 하나에 default, 그 옆의 대안에 secondary나 outline, 부수적인 동작에 ghost를 씁니다.',
        do: [
          '주요 동작은 화면당 하나로 제한한다',
          '나란히 놓인 버튼 중 하나만 default로 둔다',
          '취소는 ghost나 outline으로 둔다',
        ],
        dont: [
          '같은 줄의 버튼을 모두 default로 두지 않는다',
          '위계를 색만으로 표현하지 않는다',
        ],
      },
      {
        id: 'destructive-actions',
        title: 'Destructive actions',
        body: '삭제·차단·해제처럼 되돌리기 어려운 동작에는 destructive를 씁니다. 색만으로는 부족하므로 라벨에도 동작을 그대로 적고, 영향 범위가 넓으면 확인 단계를 둡니다.',
        do: [
          "라벨에 동작을 그대로 적는다 — '확인'이 아니라 '삭제'",
          '되돌릴 수 없는 동작은 확인 단계를 둔다',
        ],
        dont: [
          'destructive를 단순한 강조 용도로 쓰지 않는다',
          '위험한 동작을 기본 포커스 위치에 두지 않는다',
        ],
      },
      {
        id: 'buttons-vs-links',
        title: 'Buttons vs links',
        body: '버튼은 무언가를 실행하고, 링크는 어딘가로 이동합니다. 생김새가 아니라 하는 일로 고릅니다. 이동을 버튼으로 만들면 새 탭 열기나 주소 복사가 동작하지 않습니다.',
        do: ['이동에는 링크를 쓴다', '실행에는 버튼을 쓴다'],
        dont: ['링크처럼 보이게 하려고 이동을 버튼으로 만들지 않는다'],
      },
    ],
    usage: [
      {
        id: 'page-header',
        title: '페이지 헤더',
        note: "제목 오른쪽에 주요 동작 하나. 예: '사용자 추가'",
      },
      { id: 'table-row', title: '표 행 내부', note: 'sm + ghost로 밀도를 지킨다. 아이콘만 쓸 때는 aria-label을 붙인다' },
      { id: 'confirm-dialog', title: '확인 다이얼로그', note: '오른쪽에 실행, 왼쪽에 취소. 위험한 동작은 destructive' },
      { id: 'empty-state', title: '빈 상태', note: 'lg 크기의 단독 동작으로 다음 행동을 제안한다' },
    ],
    cases: [
      { id: 'long-label', title: '긴 라벨', note: '줄바꿈하지 않고 컨테이너를 늘린다. 좁은 화면에서는 width를 fill로' },
      { id: 'icon-only', title: '아이콘만', note: 'aria-label이 없으면 스크린리더에서 이름 없는 버튼이 된다' },
      { id: 'no-permission', title: '권한 없음', note: 'disabled로 두되 왜 못 하는지 툴팁이나 보조 문구로 알린다' },
      { id: 'in-progress', title: '처리 중', note: 'disabled + 스피너. 라벨을 진행형으로 바꿔 상태를 알린다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '라벨을 숨기고 아이콘만 남길 때는 aria-label을 유지한다' },
    ],
    verified: true,
  },
]

export function getComponent(id: string): ComponentMeta | undefined {
  return components.find((c) => c.id === id)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return components.filter((c) => c.category === category)
}

export function getProperty(meta: ComponentMeta, name: string): ComponentProperty | undefined {
  return meta.properties.find((p) => p.name === name)
}

export function componentStats(): { total: number; verified: number; stable: number } {
  return {
    total: components.length,
    verified: components.filter((c) => c.verified).length,
    stable: components.filter((c) => c.status === 'stable').length,
  }
}
