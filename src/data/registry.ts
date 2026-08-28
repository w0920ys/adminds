export type ComponentCategory =
  | 'actions'
  | 'inputs'
  | 'navigation'
  | 'feedback'
  | 'data-display'

/**
 * 카테고리를 늘어놓는 순서. 읽는 순서이자 LNB의 묶음 순서다.
 * 무엇을 누르는가(actions) → 무엇을 채우는가(inputs) → 어디로 가는가(navigation) →
 * 무엇을 보는가(data-display) → 무엇을 듣는가(feedback) 순으로 좁혀 읽는다.
 */
export const categoryOrder: ComponentCategory[] = [
  'actions',
  'inputs',
  'navigation',
  'data-display',
  'feedback',
]

export const categoryLabel: Record<ComponentCategory, string> = {
  actions: 'Actions',
  inputs: 'Inputs',
  navigation: 'Navigation',
  'data-display': 'Data Display',
  feedback: 'Feedback',
}

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
  /**
   * 검색에서 이 컴포넌트를 부르는 다른 이름들.
   * 문서 본문이 얇아 전문 검색만으로는 "모달"이 Dialog에 닿지 않으므로
   * 사람이 실제로 치는 말을 손으로 적어 둔다. 한국어 이름과 흔한 오표기를 함께 넣는다.
   */
  aliases: string[]
  category: ComponentCategory
  status: ComponentStatus
  /** 컴포넌트나 그 문서가 처음 실린 버전. */
  addedIn: string
  /** 컴포넌트나 그 문서가 마지막으로 바뀐 버전. 구현과 이 메타(문서) 중 어느 쪽이 바뀌었든 갱신한다. */
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
    aliases: ['버튼', 'cta', '액션', 'action'],
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.2.0',
    changedIn: 'v0.4.0',
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
          { value: 'label-only', note: '기본' },
          { value: 'icon-leading', note: '동작의 종류를 아이콘으로 먼저 알릴 때' },
          { value: 'icon-trailing', note: '이동·펼침처럼 결과를 암시할 때' },
          { value: 'icon-only', note: '자리가 좁을 때. aria-label이 반드시 필요' },
        ],
      },
      {
        name: 'width',
        title: 'Width',
        description: '버튼이 차지하는 가로 폭을 정한다.',
        display: 'row',
        options: [
          { value: 'hug', note: '기본' },
          { value: 'fill', note: '모바일 하단 고정 동작, 좁은 폼' },
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
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    aliases: ['드롭다운', '메뉴', '더보기', 'menu', 'kebab', '케밥'],
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '한 자리에서 여러 동작을 고르게 한다. 값을 고르는 자리에는 Select를 쓴다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: "누르면 트리거 아래에 목록이 뜬다. bg-popover, 테두리, radius-md, 쌓임 순서는 z-popover. 각 항목은 text-sm이고 포커스되면 bg-accent, 위험한 항목은 text-destructive다. 위험한 항목은 구분선(bg-border, 1px) 아래로 모은다. Select와 달리 고른 항목에 Check 표시가 남지 않는다 — 여기서는 값을 고르는 것이 아니라 동작을 실행하는 것이고, 실행되면 메뉴가 닫힌다. Radix DropdownMenu는 기본이 modal이라(RemoveScroll·FocusScope·hideOthers) 열린 목록은 구조도 무대에 담지 않는다",
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '트리거의 상호작용 상태를 나타낸다. 열림·정렬은 열려야만 보이는 값이라 이 격자에는 없다 — Usage에서 실제로 눌러서 본다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 열 수 없음' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'select-for-values',
        title: 'Select for values',
        body: '값을 고르는 자리에는 Dropdown Menu 대신 Select를 씁니다. Dropdown Menu의 항목은 눌리는 순간 실행되고 메뉴가 닫힙니다.',
        do: ['상태나 분류처럼 값을 고르는 자리에는 Select를 쓴다', '삭제·수정처럼 동작을 실행하는 자리에는 Dropdown Menu를 쓴다'],
        dont: ['값을 고르는 용도로 Dropdown Menu를 쓰지 않는다'],
      },
      {
        id: 'destructive-grouping',
        title: 'Destructive grouping',
        body: '위험한 항목은 구분선 아래로 모으고 text-destructive를 씁니다. 일반 동작 사이에 섞여 있으면 실수로 누르기 쉽습니다.',
        do: ['위험한 항목을 구분선 아래로 모은다', '위험한 항목에 text-destructive를 쓴다'],
        dont: ['위험한 항목을 일반 항목 사이에 섞어 두지 않는다'],
      },
      {
        id: 'few-items-buttons',
        title: 'Few items, buttons',
        body: '항목이 셋 이하면 Dropdown Menu 대신 버튼을 나란히 두는 편이 낫습니다. 누르는 수가 하나 줄고 선택지가 바로 보입니다.',
        do: ['항목이 셋 이하면 버튼을 나란히 둔다'],
        dont: ['항목이 둘뿐인데 그것을 감추려고 Dropdown Menu로 접지 않는다'],
      },
    ],
    usage: [
      { id: 'row-actions', title: '표 행의 더보기', note: '행마다 반복되는 동작을 아이콘 버튼 뒤에 모은다' },
      { id: 'page-header-actions', title: '페이지 헤더의 보조 동작', note: '주 동작 옆에 부수적인 동작을 모은다. align="end"로 오른쪽 끝에 맞춘다' },
      { id: 'bulk-actions', title: '대량 작업', note: '선택한 행에 적용할 동작을 모은다' },
      { id: 'account-menu', title: '계정 메뉴', note: '설정·로그아웃처럼 계정에 관한 동작을 모은다' },
    ],
    cases: [
      { id: 'many-items', title: '항목이 아주 많은 경우', note: '목록이 뷰포트를 넘으면 목록 안에서 스크롤된다' },
      { id: 'bottom-of-screen', title: '화면 아래쪽에서 열리는 경우', note: '자리가 없으면 위쪽으로 뒤집혀 열린다' },
      { id: 'destructive-only', title: '위험 항목만 있는 경우', note: '구분선 없이 항목 전체가 text-destructive를 쓴다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '트리거가 줄어들지 않고 목록 너비는 트리거와 무관하게 유지된다' },
    ],
    verified: true,
  },
  {
    id: 'toggle',
    name: 'Toggle',
    aliases: ['토글', '토글 그룹', 'toggle group', '세그먼트', 'segmented control', '눌린 버튼'],
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose:
      '지금 보고 있는 것에 서식이나 필터를 켠다. 설정을 켜고 그 자리에서 저장하는 Switch와 다르다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: '높이는 Button과 같은 control 토큰, 모서리는 radius-md. 눌리면 Radix가 data-state="on"을 붙이고 배경이 accent로 바뀐다',
      },
      { part: 'icon', label: 'Icon', note: '16×16, 라벨과 8px 간격', optional: true },
      { part: 'label', label: 'Label', note: 'text-sm / font-medium', optional: true },
      {
        part: 'group-container',
        label: 'Group Container',
        note: '여러 Toggle Group Item을 가로로 늘어놓고, 폭이 모자라면 다음 줄로 넘긴다. 항목 사이 간격은 4px',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '쉬고 있을 때 테두리를 보일지 정한다. 표 위의 도구 줄처럼 밀도가 높은 자리에는 테두리를 두지 않는다.',
        display: 'row',
        options: [
          { value: 'default', note: '기본. 쉬고 있을 때는 배경도 테두리도 없다' },
          { value: 'outline', note: '눌러야 하는 자리라는 것을 쉬고 있을 때도 보인다' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '같은 줄에 놓이는 컨트롤과 높이를 맞춘다. Button과 같은 control 토큰을 쓴다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 위의 도구 줄' },
          { value: 'default', note: '기본' },
          { value: 'lg', note: '화면 위쪽의 보기 전환처럼 손이 자주 가는 자리' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '눌려 있는지와 상호작용을 나타낸다. 켜진 모습은 Radix가 붙이는 data-state="on"이다.',
        display: 'grid',
        options: [
          { value: 'default', note: '기본. 꺼져 있다' },
          { value: 'hover', note: '마우스가 올라온 상태' },
          { value: 'on', note: '켜져 있다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '켜고 끌 수 없음' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '홀로 서는지 묶이는지, 묶인다면 몇 개까지 켜지는지 정한다.',
        display: 'grid',
        options: [
          { value: 'single', note: '홀로 선 Toggle 하나' },
          { value: 'group-single', note: '묶음에서 하나만 켜진다. 보기 전환' },
          { value: 'group-multiple', note: '묶음에서 여럿이 함께 켜진다. 서식 도구' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'distinguish-switch',
        title: 'Distinguish from Switch',
        body: 'Switch는 설정을 켜고 그 자리에서 저장됩니다. Toggle은 지금 보고 있는 것에 서식이나 필터를 겁니다. 저장 버튼이 따로 있는 설정 화면이면 Switch를 씁니다.',
        do: ['서식·필터처럼 지금 보이는 것을 바꿀 때 Toggle을 쓴다', '저장이 따로 필요한 설정에는 Switch를 쓴다'],
        dont: ['저장 버튼이 있는 설정 화면에 Toggle을 쓰지 않는다'],
      },
      {
        id: 'group-vs-tabs',
        title: 'Toggle Group vs Tabs',
        body: 'Tabs는 화면의 내용을 통째로 갈아 끼웁니다. Toggle Group은 같은 내용을 다르게 보이거나 걸러 낼 뿐 내용 자체를 바꾸지 않습니다.',
        do: ['같은 데이터를 다른 형태로 보이거나 거를 때 Toggle Group을 쓴다'],
        dont: ['서로 다른 화면을 전환하는 데 Toggle Group을 쓰지 않는다'],
      },
      {
        id: 'name-icon-only',
        title: 'Name icon-only toggles',
        body: '아이콘만 두면 스크린 리더가 아무것도 읽지 못합니다. aria-label이나 화면에서 감춘 글자로 이름을 함께 둡니다.',
        do: ['아이콘만 있는 Toggle과 Toggle Group Item에 aria-label을 붙인다'],
        dont: ['이름 없이 아이콘만 남기지 않는다'],
      },
      {
        id: 'decide-empty-single',
        title: 'Decide whether group-single can be empty',
        body: 'Radix는 켜진 항목을 다시 눌러 끄는 것을 막지 않습니다. 목록 보기처럼 반드시 하나가 켜져 있어야 하는 자리에서는 값이 비지 않게 쓰는 쪽에서 붙잡습니다.',
        do: ['반드시 하나가 필요한 묶음은 onValueChange에서 빈 값을 막는다'],
        dont: ['빈 값을 허용해도 되는지 확인하지 않고 group-single을 쓰지 않는다'],
      },
    ],
    usage: [
      { id: 'view-switcher', title: '목록·격자 보기 전환', note: 'group-single로 하나만 켜지게 한다. 아이콘만으로도 뜻이 통해 라벨을 생략할 때가 많다' },
      { id: 'formatting-toolbar', title: '서식 도구', note: 'group-multiple로 굵게·기울임처럼 함께 켤 수 있는 값을 묶는다' },
      { id: 'period-filter', title: '기간 필터', note: "group-single로 '오늘'·'이번 주'·'이번 달' 중 하나를 고른다" },
      { id: 'column-picker', title: '표시할 열 고르기', note: 'group-multiple로 표에서 보일 열을 여러 개 함께 켠다' },
    ],
    cases: [
      { id: 'icon-only', title: '아이콘만 있는 경우', note: 'aria-label이 없으면 스크린리더에서 이름 없는 버튼이 된다' },
      { id: 'empty-value', title: '값이 비는 경우', note: 'group-single에서 켜진 항목을 다시 누르면 값이 빈다. 막으려면 쓰는 쪽에서 붙잡는다' },
      { id: 'many-items', title: '항목이 많은 경우', note: '한 줄에 다 들어가지 않으면 줄바꿈된다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '묶음 폭이 컨테이너를 넘지 않고 줄바꿈된다' },
    ],
    verified: false,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    aliases: ['체크박스', '체크', '다중 선택', 'check'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.7.0',
    changedIn: 'v0.8.0',
    purpose: '여러 값 중 하나 이상을 켜고 끄도록 한다. 하나만 고를 수 있으면 Radio를 쓴다.',
    anatomy: [
      {
        part: 'box',
        label: 'Box',
        note: '4×4(16px), 꺼짐은 border-input, 켜짐은 bg-primary, 모서리는 radius-sm. 켜지거나 중간 상태면 안쪽에 Check 또는 Minus가 그려진다',
      },
      { part: 'label', label: 'Label', note: 'text-sm. 상자와 함께 눌리는 자리', optional: true },
      {
        part: 'description',
        label: 'Description',
        note: '라벨 아래의 보조 설명. text-muted-foreground / text-xs',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '선택 여부와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'unchecked' },
          { value: 'checked' },
          {
            value: 'indeterminate',
            note: "일부만 선택됨. '모름'이나 '해당 없음'을 뜻하지 않는다",
          },
          { value: 'hover', note: '포인터가 올라간 동안. 켜진 상자에서는 보이지 않는다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 상태를 바꿀 수 없음' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '라벨과 설명을 붙이는 방식을 정한다.',
        display: 'row',
        options: [
          { value: 'standalone', note: '표의 행처럼 라벨이 다른 곳에 이미 있을 때' },
          { value: 'with-label', note: '기본. 라벨 전체가 눌리는 자리다' },
          { value: 'with-description', note: '라벨만으로 부족할 때 아래에 설명을 더한다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'label-click-target',
        title: 'Label as click target',
        body: '라벨이 있으면 라벨 전체가 누를 수 있는 자리여야 합니다. 상자만 누르게 하면 어드민의 조밀한 표에서 맞히기 어렵습니다.',
        do: ['Checkbox와 라벨 문구를 label 요소로 함께 감싼다', '라벨을 누르면 상자도 함께 반응하는지 확인한다'],
        dont: ['상자만 클릭 영역으로 두고 라벨 문구는 별도 텍스트로 두지 않는다'],
      },
      {
        id: 'indeterminate-meaning',
        title: 'Indeterminate meaning',
        body: "중간 상태는 '일부 선택'에만 씁니다. '모름'이나 '해당 없음'을 뜻하지 않습니다.",
        do: ['표 전체 선택에서 일부 행만 선택되었을 때 중간 상태를 쓴다'],
        dont: ["'모름'이나 '해당 없음'을 나타내는 데 중간 상태를 쓰지 않는다"],
      },
      {
        id: 'checkbox-vs-radio',
        title: 'Checkbox vs radio',
        body: '체크박스와 라디오를 바꿔 쓰지 않습니다. 여럿 고를 수 있으면 체크박스, 하나만 고를 수 있으면 라디오입니다.',
        do: ['여럿을 고를 수 있는 목록에는 Checkbox를 쓴다', '하나만 고를 수 있는 목록에는 Radio를 쓴다'],
        dont: ['하나만 고를 수 있는 목록에 Checkbox를 쓰지 않는다'],
      },
      {
        id: 'checkbox-vs-switch',
        title: 'Checkbox vs switch',
        body: 'Checkbox와 Switch를 바꿔 쓰지 않습니다. 저장을 눌러야 반영되면 Checkbox, 누르는 즉시 반영되면 Switch입니다.',
        do: ['저장 버튼이 있는 폼에는 Checkbox를 쓴다', '누르는 즉시 반영해야 하는 자리에는 Switch를 쓴다'],
        dont: ['즉시 반영되어야 하는 자리에 저장을 기다리는 Checkbox를 쓰지 않는다'],
      },
      {
        id: 'single-size',
        title: 'Single size',
        body: 'Checkbox는 size 축을 두지 않습니다. 체크박스는 한 크기로 충분하고, 크기를 늘리면 옆 글자와의 정렬이 깨집니다.',
        do: ['체크박스를 옆 라벨의 줄 높이에 맞춘 한 크기로 쓴다'],
        dont: ['체크박스만 키워 옆 글자와의 정렬을 어긋나게 하지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: "Input · Select · Checkbox 셋이 함께 지키는 규칙입니다. 포커스 링은 셋이 같은 모양입니다. 오류는 aria-invalid로 나타내고 색과 문구를 함께 씁니다. 상태 표현의 자세한 규칙은 Foundations의 State 문서를 따릅니다.",
      },
    ],
    usage: [
      { id: 'row-select', title: '표의 행 선택', note: '라벨 없이 상자만 두고, 스크린리더용 이름은 따로 붙인다' },
      { id: 'select-all', title: '표 머리의 전체 선택', note: '일부만 선택되었을 때 중간 상태로 나타낸다' },
      { id: 'terms-agreement', title: '약관 동의', note: '라벨 전체를 눌러 동의할 수 있어야 한다' },
      { id: 'setting-toggle', title: '설정 켜고 끄기', note: '라벨 아래에 설명을 더해 무엇이 바뀌는지 알린다' },
    ],
    cases: [
      { id: 'multiline-label', title: '라벨이 두 줄 이상', note: '상자는 첫 줄에 맞춰 위쪽에 정렬한다' },
      { id: 'disabled-checked', title: '비활성인데 켜져 있는 경우', note: '색은 흐려지지만 켜진 상태 자체는 그대로 보인다' },
      { id: 'nested-selection', title: '중첩된 선택', note: '하위 항목의 일부만 선택되면 상위는 중간 상태로 나타낸다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '라벨이 줄바꿈되어도 상자와의 정렬은 유지된다' },
    ],
    verified: true,
  },
  {
    id: 'combobox',
    name: 'Combobox',
    aliases: ['콤보박스', '검색 선택', '검색형 셀렉트', 'searchable select', 'autocomplete'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.0',
    purpose: '많은 항목 중에서 검색해 하나 이상을 고르게 한다. Popover 위에 세우고 트리거는 Select와 같은 모양이다. 항목이 열 개 이하면 Select로 충분하다.',
    /*
     * Search·List·Item·Empty message는 열린 표면 안에서만 존재하고
     * PopoverContent가 document.body로 포털한다 — Popover·Select가 이미
     * 같은 이유로 anatomy를 무대 안에 남는 부위만으로 좁힌 것과 같은
     * 결론이다. stage.querySelector가 포털된 노드를 찾지 못해 지시선을
     * 그릴 수 없으므로, 여기서도 무대 안에 실제로 남는 Trigger·Value
     * 둘만 부위로 둔다.
     */
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '테두리·높이·포커스 링은 Select의 트리거와 같은 토큰을 쓴다. 오른쪽 끝에 16×16 ChevronDown이 열림 여부와 무관하게 항상 보인다. 누르면 트리거 아래에 검색 칸과 걸러진 목록이 뜬다. 검색 칸에서 위아래 화살표로 항목을 옮기고 Enter로 고르며 Escape로 닫는다. 목록은 role=listbox, 항목은 role=option이고 지금 짚은 항목은 검색 칸의 aria-activedescendant가 알린다',
      },
      {
        part: 'value',
        label: 'Value',
        note: 'layout이 single이면 고른 항목의 문구가 그대로 보인다. multiple이면 고른 항목마다 Badge가 쌓이고 각 배지 오른쪽에 지우는 버튼이 있다. 아직 고르지 않았으면 이 자리에 자리표시자가 대신 보인다',
      },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: '트리거의 높이를 정한다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [{ value: 'sm' }, { value: 'default' }, { value: 'lg' }],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 선택을 바꿀 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description:
          '하나만 고르는지 여럿을 고르는지를 정한다. layout이라는 이름의 prop은 없다 — multiple prop이 이 축을 가른다.',
        display: 'row',
        options: [
          { value: 'single', note: '기본. 고른 항목의 문구가 트리거에 보인다' },
          { value: 'multiple', note: '고른 항목이 트리거 안에 Badge로 쌓인다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'select-vs-combobox',
        title: 'Select vs Combobox',
        body: '항목이 열 개를 넘으면 Select 대신 Combobox를 씁니다. 그 아래에서는 검색 칸이 오히려 한 단계를 더합니다.',
        do: ['항목이 열 개를 넘으면 Combobox를 쓴다', '항목이 적으면 Select로 충분하다'],
        dont: ['항목이 몇 개뿐인데 검색 칸부터 앞세우지 않는다'],
      },
      {
        id: 'substring-match',
        title: 'Substring match',
        body: "포함으로 거릅니다. 앞글자만 맞추면 '김하나'를 '하나'로 찾을 수 없습니다.",
        do: ['문구 중간에 있는 일치도 찾아낸다', '대소문자를 가리지 않는다'],
        dont: ['앞글자만 맞추는 거르기를 쓰지 않는다'],
      },
      {
        id: 'empty-result-guidance',
        title: 'Empty result guidance',
        body: '결과가 없을 때 할 일을 알립니다. 빈 목록만 남기지 않고 무엇을 할 수 있는지 적습니다.',
        do: ['검색어를 바꿔 보라는 안내를 함께 보인다'],
        dont: ['빈 목록만 남기고 다음 행동을 알리지 않는다'],
      },
      {
        id: 'reversible-selection',
        title: 'Reversible selection',
        body: '고른 것을 되돌릴 수 있게 합니다. 여럿 고르는 경우 각 항목에 지우는 자리를 둡니다.',
        do: ['multiple에서 각 배지에 지우는 버튼을 둔다'],
        dont: ['고른 항목을 지울 방법 없이 쌓아 두지 않는다'],
      },
    ],
    usage: [
      { id: 'assignee', title: '담당자 지정', note: '팀원이 많아 스크롤보다 검색이 빠른 자리에 쓴다' },
      { id: 'tag-select', title: '태그 선택', note: 'multiple로 여러 태그를 함께 고른다' },
      { id: 'product-search', title: '상품 검색', note: '이름 일부만 알아도 찾을 수 있다' },
      { id: 'org-select', title: '소속 조직 선택', note: '조직이 계층 없이 평평하게 많을 때 쓴다' },
    ],
    cases: [
      { id: 'no-results', title: '결과가 없는 경우', note: '검색어를 바꿔 보라는 안내를 함께 보인다' },
      { id: 'many-options', title: '항목이 아주 많은 경우', note: '목록이 뷰포트를 넘으면 목록 안에서 스크롤된다' },
      { id: 'many-selected', title: '고른 것이 많은 경우', note: '배지가 늘어나며 트리거가 여러 줄로 늘어난다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '트리거 폭이 줄어도 배지는 줄바꿈되어 잘리지 않는다' },
    ],
    verified: false,
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    aliases: ['날짜 선택', '달력', '기간 선택', 'calendar', 'date range'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.0',
    purpose:
      '달력에서 날짜 하나 또는 기간을 고르게 한다. Popover 위에 Calendar를 놓고, 트리거는 Select와 같은 모양이다.',
    /*
     * Month header·Weekday row·Day grid·Day는 열린 표면 안에서만 존재하고
     * PopoverContent가 document.body로 포털한다 — Combobox의 Search·List·
     * Item·Empty message와 같은 이유로 stage.querySelector가 닿지 못해
     * 지시선을 그릴 수 없다. 무대 안에 실제로 남는 Trigger·Value 둘만
     * 부위로 둔다.
     */
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '테두리·높이·포커스 링은 Select의 트리거와 같은 토큰을 쓴다. 오른쪽 끝에 16×16 CalendarDays가 항상 보인다. 누르면 트리거 아래에 달력이 뜬다',
      },
      {
        part: 'value',
        label: 'Value',
        note: "layout이 single이면 고른 날짜가 'YYYY-MM-DD'로 보인다. range면 시작과 끝을 '–'로 잇고, 시작만 골랐으면 '종료일을 고르세요'가 이어 붙는다. 아직 고르지 않았으면 이 자리에 자리표시자가 대신 보인다",
      },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: '트리거의 높이와 달력 날짜 칸의 크기를 함께 정한다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [{ value: 'sm' }, { value: 'default' }, { value: 'lg' }],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 선택을 바꿀 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '날짜 하나를 고르는지 기간을 고르는지를 정한다.',
        display: 'row',
        options: [
          { value: 'single', note: '기본. 날짜 하나를 고른다' },
          { value: 'range', note: '시작과 끝, 두 날짜를 고른다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'format-as-placeholder',
        title: 'Format as placeholder',
        body: "형식을 자리표시자로 알립니다. 'YYYY-MM-DD'처럼 어떤 모양으로 적는지 미리 보입니다.",
        do: ["자리표시자에 실제 날짜 형식('YYYY-MM-DD')을 그대로 쓴다"],
        dont: ["'날짜 선택'처럼 형식을 알리지 않는 자리표시자를 쓰지 않는다"],
      },
      {
        id: 'today-vs-selected',
        title: 'Today vs selected',
        body: '오늘과 고른 날을 다르게 표시합니다. 둘이 같은 모양이면 오늘을 이미 고른 것으로 읽습니다.',
        do: ['오늘은 테두리로, 고른 날은 채운 배경으로 나눈다'],
        dont: ['오늘과 고른 날을 같은 채운 배경으로 그리지 않는다'],
      },
      {
        id: 'disabled-reason',
        title: 'Disabled reason',
        body: '고를 수 없는 날은 이유를 알립니다. 흐리게만 두면 왜 안 되는지 알 수 없습니다.',
        do: ['고를 수 없는 날에 이유를 title과 aria-label로 함께 단다'],
        dont: ['이유 없이 흐리게만 두지 않는다'],
      },
      {
        id: 'range-shows-both-ends',
        title: 'Range shows both ends',
        body: '범위는 시작과 끝을 함께 보입니다. 하나만 고른 중간 상태에서 무엇을 더 골라야 하는지 알립니다.',
        do: ['시작만 골랐으면 종료일을 고르라고 트리거에 알린다'],
        dont: ['시작만 고른 채로 아무 안내 없이 값 자리를 비워 두지 않는다'],
      },
    ],
    usage: [
      { id: 'period-filter', title: '기간 필터', note: 'range로 시작일과 종료일을 함께 고른다' },
      { id: 'expiry-date', title: '만료일 설정', note: '오늘 이전 날짜는 고를 수 없게 막는다' },
      { id: 'reservation-date', title: '예약일', note: '오늘과 다가올 날짜 중에서 고른다' },
      { id: 'reference-date', title: '조회 기준일', note: '단일 날짜로 화면의 기준 시점을 정한다' },
    ],
    cases: [
      { id: 'block-before-today', title: '오늘 이전을 막는 경우', note: '고를 수 없는 날에 이유를 함께 단다' },
      { id: 'range-over-a-month', title: '범위가 한 달을 넘는 경우', note: '트리거는 달을 넘어도 시작·끝을 그대로 보인다' },
      { id: 'no-value', title: '값이 없는 경우', note: "자리표시자로 형식('YYYY-MM-DD')을 미리 보인다" },
      { id: 'narrow-screen', title: '좁은 화면', note: '트리거 폭이 줄어도 값이 잘리지 않고 줄임표로 대신한다' },
    ],
    verified: false,
  },
  {
    id: 'field',
    name: 'Field',
    aliases: ['필드', '폼 필드', '입력 항목', 'form field', 'label'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.0',
    purpose:
      '라벨·도움말·오류를 입력 하나에 묶습니다. id를 잇는 일이 이 컴포넌트의 존재 이유입니다 — Field가 useId로 만든 id를 컨텍스트에 담아 FieldLabel의 htmlFor와 FieldControl의 aria-describedby·aria-invalid로 손 대지 않고 이어 줍니다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: 'layout이 stacked면 세로로 쌓고, horizontal이면 grid-cols-[auto_1fr]로 라벨과 값 칸을 나눈다',
      },
      { part: 'label', label: 'Label', note: 'FieldLabel. htmlFor로 Control과 이어진다. text-sm font-medium' },
      {
        part: 'requirement-mark',
        label: 'Requirement Mark',
        note: "필수는 '*', 선택은 '(선택)'. 라벨 문구 뒤에 붙는다",
        optional: true,
      },
      {
        part: 'control',
        label: 'Control',
        note: 'FieldControl. Slot으로 자식 하나에 id · aria-describedby · aria-invalid를 내려 준다',
      },
      {
        part: 'help',
        label: 'Help',
        note: 'FieldHelp. text-muted-foreground / text-xs. 자기 id를 Field에 등록해 aria-describedby에 실린다',
        optional: true,
      },
      {
        part: 'error',
        label: 'Error',
        note: 'FieldError. text-destructive / text-xs. 도움말이 있어도 지우지 않고 함께 등록된다',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'layout',
        title: 'Layout',
        description: '라벨을 입력 위에 둘지, 왼쪽 고정 폭에 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'stacked', note: '기본. 라벨이 입력 위에 온다' },
          { value: 'horizontal', note: '라벨이 왼쪽 고정 폭. 설정 화면처럼 라벨이 짧고 항목이 많을 때' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '입력의 상호작용과 값의 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'error', note: 'aria-invalid가 켜지고 FieldError가 함께 온다' },
          { value: 'disabled', note: '라벨도 함께 흐려진다' },
        ],
      },
      {
        name: 'label',
        title: 'Label',
        description: '필수·선택 표시 여부를 정한다. 한 폼에서는 하나만 고른다.',
        display: 'row',
        options: [
          { value: 'plain', note: '표시 없음' },
          { value: 'required', note: "필수가 드문 폼에서 '*'로 표시" },
          { value: 'optional', note: "선택이 드문 폼에서 '(선택)'으로 표시" },
        ],
      },
    ],
    guidelines: [
      {
        id: 'label-above-input',
        title: 'Label above input',
        body: '라벨을 입력 위에 둡니다. 시선이 아래로 내려가는 흐름과 맞고, 번역으로 라벨이 길어져도 자리가 흔들리지 않습니다.',
        do: ['라벨을 입력 칸 바로 위에 놓는다'],
        dont: ['입력 옆이나 아래에 라벨을 두어 시선의 흐름을 거스르지 않는다'],
      },
      {
        id: 'help-before-error-after',
        title: 'Help before, error after',
        body: '도움말은 입력 앞에, 오류는 입력 뒤에 둡니다. 도움말은 적기 전에 읽어야 하고 오류는 적은 뒤에 나옵니다.',
        do: ['도움말을 입력 위에, 오류를 입력 아래에 놓는다'],
        dont: ['오류 문구를 입력 위에 두어 도움말과 자리를 다투게 하지 않는다'],
      },
      {
        id: 'single-requirement-mark',
        title: 'One requirement mark per form',
        body: '필수 표시와 선택 표시 중 하나만 씁니다. 한 폼에서 둘을 섞으면 표시가 없는 항목이 무엇인지 알 수 없습니다.',
        do: ['필수가 드문 폼에서는 필수만, 선택이 드문 폼에서는 선택만 표시한다'],
        dont: ['같은 폼 안에서 필수 표시와 선택 표시를 함께 쓰지 않는다'],
      },
      {
        id: 'keep-help-with-error',
        title: "Don't clear help on error",
        body: '오류가 나와도 도움말을 지우지 않습니다. 무엇이 틀렸는지와 무엇을 넣어야 하는지는 둘 다 필요합니다.',
        do: ['오류가 나타난 뒤에도 도움말을 그대로 둔다'],
        dont: ['오류 문구가 나타나면 도움말을 없애지 않는다'],
      },
      {
        id: 'wrap-the-rendered-element',
        title: 'Wrap the element that renders',
        body:
          'FieldControl은 Slot으로 자식에게 id를 내려줍니다. 그 자식이 실제로 DOM 노드를 그려야 id가 어딘가에 붙습니다. Select처럼 context만 제공하고 자기 노드를 그리지 않는 컴포넌트를 통째로 감싸면 id가 갈 곳이 없어 사라집니다. Select 안에서 실제로 렌더링되는 SelectTrigger처럼, 그 컴포넌트가 실제로 그리는 요소를 감싸야 합니다.',
        do: ['Select 안에서 실제로 렌더링되는 SelectTrigger를 FieldControl로 감싼다'],
        dont: ['Select처럼 context만 제공하는 컴포넌트를 통째로 FieldControl로 감싸지 않는다'],
      },
    ],
    usage: [
      { id: 'form-row', title: '폼 한 줄', note: '라벨과 입력 하나를 세로로 묶은 가장 흔한 자리' },
      { id: 'setting-item', title: '설정 항목', note: '라벨이 왼쪽 고정 폭인 가로 배치' },
      { id: 'table-filter', title: '표 위의 필터', note: '라벨 없이 입력만 두고 aria-label로 이름을 붙인다' },
      {
        id: 'grouped-inputs',
        title: '여러 입력을 한 라벨로 묶는 경우',
        note: 'htmlFor가 하나를 가리킬 수 없으므로 FieldControl 대신 fieldset·legend로 묶는다',
      },
    ],
    cases: [
      {
        id: 'error-with-help',
        title: '오류와 도움말이 함께 있는 경우',
        note: 'aria-describedby가 두 id를 공백으로 이어 붙여 함께 가리킨다',
      },
      { id: 'long-label', title: '라벨이 긴 경우', note: 'horizontal에서도 라벨은 줄바꿈되고 값 칸의 폭은 그대로다' },
      { id: 'no-label', title: '라벨이 필요 없는 입력', note: 'FieldLabel 없이 FieldControl만 두고 aria-label로 이름을 대신한다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '폭이 좁아지면 값 칸이 함께 줄어든다' },
    ],
    verified: false,
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    aliases: ['파일 업로드', '파일 첨부', '드롭존', '업로드', 'upload', 'dropzone'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.1',
    purpose:
      '파일을 고르거나 끌어다 놓아 올릴 준비를 하게 합니다. 네이티브 input을 감추고 그 위에 dropzone이나 버튼을 그립니다. 이 컴포넌트는 파일을 실제로 올리지 않습니다 — 올리는 일은 이 화면을 쓰는 서비스의 몫이고, 여기서는 그 화면만 정합니다.',
    anatomy: [
      {
        part: 'dropzone',
        label: 'Dropzone',
        note: '점선 테두리의 영역이거나(dropzone) 버튼 하나(button). 눌러도 끌어다 놓아도 파일 창이 열린다',
      },
      { part: 'icon', label: 'Icon', note: '24×24, dropzone 위쪽', optional: true },
      { part: 'instruction', label: 'Instruction', note: "'끌어다 놓거나 눌러서 올리세요' 같은 안내 문구" },
      { part: 'constraint', label: 'Constraint', note: '허용 형식과 최대 크기. 올리기 전에 미리 알린다', optional: true },
      { part: 'file-list', label: 'File List', note: '고른 파일들을 세로로 쌓는다', optional: true },
      { part: 'file-item', label: 'File Item', note: '이름·크기·진행률·오류를 한 줄에 담는다' },
      { part: 'remove', label: 'Remove', note: '이 파일을 목록에서 지운다' },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '고르는 영역의 모양을 정한다.',
        display: 'row',
        options: [
          { value: 'dropzone', note: '끌어다 놓기와 클릭을 함께 받는 넓은 영역' },
          { value: 'button', note: '자리가 좁을 때. 클릭만 받는다' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'dragging', note: '파일을 끌고 영역 위에 온 동안' },
          { value: 'disabled', note: '지금은 파일을 고를 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description:
          '파일을 하나만 받는지 여러 개 받는지 정한다. layout이라는 이름의 prop은 없다 — multiple prop이 이 축을 가른다.',
        display: 'row',
        options: [
          { value: 'single', note: '기본. 새로 고르면 이전 파일을 대신한다' },
          { value: 'multiple', note: '고를 때마다 목록에 더한다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'clickable-button',
        title: 'Clickable button, not drag alone',
        body: '끌어다 놓기만으로는 부족합니다. 누를 수 있는 버튼을 함께 둡니다. 끌어다 놓기는 키보드로 할 수 없습니다.',
        do: ['dropzone 안에도 눌러서 파일 창을 여는 동작을 함께 둔다'],
        dont: ['끌어다 놓기만 되고 클릭으로는 열리지 않는 영역을 두지 않는다'],
      },
      {
        id: 'announce-format-and-size',
        title: 'Announce format and size upfront',
        body: '허용 형식과 최대 크기를 미리 적습니다. 올린 뒤에 알리면 그 시간이 버려집니다.',
        do: ['Constraint 문구에 허용 확장자와 최대 크기를 미리 적는다'],
        dont: ['파일을 고른 뒤에야 형식이나 크기 제한을 알리지 않는다'],
      },
      {
        id: 'show-progress',
        title: 'Show progress',
        body: '진행률을 보입니다. 큰 파일은 Progress를 함께 씁니다.',
        do: ['큰 파일을 올리는 동안 FileUploadItem에 Progress를 함께 그린다'],
        dont: ['큰 파일이 끝날 때까지 진행 표시 없이 그대로 두지 않는다'],
      },
      {
        id: 'keep-failed-files',
        title: "Don't remove failed files",
        body: '실패한 파일을 목록에서 지우지 않습니다. 왜 실패했는지와 함께 남겨 다시 시도할 수 있게 합니다.',
        do: ['실패한 파일에 이유를 문구로 남기고 목록에 그대로 둔다'],
        dont: ['실패했다고 목록에서 조용히 지우지 않는다'],
      },
    ],
    usage: [
      { id: 'profile-image', title: '프로필 이미지', note: 'button 변형으로 이미지 하나만 빠르게 바꾼다' },
      { id: 'bulk-import', title: '대량 등록 파일', note: '형식이 정해진 파일 하나를 끌어다 놓거나 골라 올린다' },
      { id: 'attachment', title: '첨부 파일', note: '문서나 이미지 여러 개를 목록에 쌓는다' },
      { id: 'logo-replace', title: '로고 교체', note: '기존 로고를 새 파일로 바꾼다' },
    ],
    cases: [
      { id: 'wrong-format', title: '형식이 맞지 않는 경우', note: '지우지 않고 이유를 문구로 남긴다' },
      { id: 'over-size-limit', title: '크기를 넘는 경우', note: '최대 크기를 넘겼다는 이유를 함께 남긴다' },
      { id: 'uploading', title: '올리는 중', note: 'Progress로 진행률을 보인다' },
      { id: 'multiple-files', title: '여러 파일', note: '고른 파일마다 이름·크기·지우기가 한 줄씩 쌓인다' },
      {
        id: 'field-error',
        title: 'Field 안에서 오류인 경우',
        note: 'Field state="error"가 dropzone에 aria-invalid를 내려주고, 이유는 FieldError가 잇는다',
      },
    ],
    verified: false,
  },
  {
    id: 'input',
    name: 'Input',
    aliases: ['텍스트 필드', '입력', '인풋', 'text field', 'textfield'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.7.0',
    changedIn: 'v0.8.0',
    purpose: '사용자가 한 줄짜리 값을 직접 입력하도록 한다. 여러 값 중 고르게 할 때는 Select를, 여러 줄이 필요하면 Textarea를 쓴다.',
    anatomy: [
      { part: 'container', label: 'Container', note: '테두리는 border-input, 높이는 size 토큰, 모서리는 radius-md' },
      {
        part: 'value',
        label: 'Value',
        note: '사용자가 입력한 값. text-sm. 비어 있으면 이 자리에 자리표시자가 대신 보인다',
      },
      {
        part: 'prefix-icon',
        label: 'Prefix Icon',
        note: '16×16, 값과 8px 간격',
        optional: true,
      },
      {
        part: 'suffix',
        label: 'Suffix',
        note: '지우기 버튼이나 단위 표시. 값과 8px 간격',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: '입력 칸의 높이를 정한다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [{ value: 'sm' }, { value: 'default' }, { value: 'lg' }],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용과 값의 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 값을 바꿀 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
          {
            value: 'readonly',
            note: '값을 읽고 복사할 수 있으나 고칠 수 없다. disabled와 다르다',
          },
        ],
      },
      {
        name: 'width',
        title: 'Width',
        description: '입력 칸이 차지하는 가로 폭을 정한다. 기대하는 값의 길이에 맞춘다.',
        display: 'row',
        options: [
          { value: 'hug', note: '기대하는 값 길이에 맞춘 폭. 기본' },
          { value: 'fill', note: '부모 요소의 폭을 채운다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'placeholder-as-label',
        title: 'Placeholder as label',
        body: '자리표시자를 라벨 대신 쓰면 안 됩니다. 입력을 시작하는 순간 사라지므로 무엇을 넣는 칸인지 알 수 없게 됩니다.',
        do: ['입력 칸마다 라벨을 둔다', '자리표시자는 형식이나 예시를 보여줄 때만 쓴다'],
        dont: ['라벨 없이 자리표시자만으로 입력 칸의 용도를 설명하지 않는다'],
      },
      {
        id: 'error-indication',
        title: 'Error indication',
        body: '오류는 색만으로 알리지 않습니다. 테두리 색과 함께 문구를 달아야 하며, 문구는 Writing의 오류 메시지 규칙을 따릅니다.',
        do: ['aria-invalid와 함께 오류 문구를 보여준다', '문구는 Writing의 오류 메시지 규칙을 따른다'],
        dont: ['테두리 색만 바꾸고 문구를 생략하지 않는다'],
      },
      {
        id: 'width',
        title: 'Width',
        body: '폭은 기대하는 값의 길이에 맞춥니다. 우편번호 칸이 이름 칸과 같은 폭이면 무엇을 넣는 칸인지 흐려집니다.',
        do: ['짧은 값에는 좁은 폭을 쓴다', '기대하는 값의 길이에 폭을 맞춘다'],
        dont: ['모든 입력 칸을 같은 폭으로 맞추지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: "Input · Select · Checkbox 셋이 함께 지키는 규칙입니다. 높이는 같은 size에서 서로 같습니다. sm은 표와 필터 바, default는 폼, lg는 단독 입력입니다. 포커스 링은 셋이 같은 모양입니다. 오류는 aria-invalid로 나타내고 색과 문구를 함께 씁니다. 비활성과 읽기 전용은 다릅니다. 상태 표현의 자세한 규칙은 Foundations의 State 문서를 따릅니다.",
      },
    ],
    usage: [
      { id: 'search-box', title: '검색 상자', note: '앞에 검색 아이콘을 두고 자리표시자로 예시를 보여준다' },
      { id: 'form-row', title: '폼 한 줄', note: '라벨 + 입력 + 도움말' },
      { id: 'table-filter', title: '표 안 필터', note: 'sm 크기로 주변 컨트롤과 높이를 맞춘다' },
      { id: 'amount-input', title: '금액 입력', note: '뒤에 단위를 붙인다' },
    ],
    cases: [
      { id: 'overflow-value', title: '값이 칸보다 긴 경우', note: '줄바꿈하지 않고 칸 안에서 스크롤된다' },
      { id: 'readonly', title: '읽기 전용', note: '읽고 복사할 수 있으나 고칠 수 없다. disabled와 다르다' },
      { id: 'error-with-help', title: '오류와 도움말이 함께 있는 경우', note: '오류 문구가 도움말 자리를 대신한다' },
      { id: 'password', title: '비밀번호', note: 'type만 다르고 시각적으로는 달라지지 않는다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '기본 폭이 부모를 채우므로 별도 처리가 필요 없다' },
    ],
    verified: true,
  },
  {
    id: 'radio',
    name: 'Radio',
    aliases: ['라디오', '단일 선택', 'radio group'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '여럿 중 하나만 고르도록 한다. 여럿을 고를 수 있으면 Checkbox를 쓴다.',
    anatomy: [
      {
        part: 'group',
        label: 'Group',
        note: "항목을 감싸고 role='radiogroup'을 부여한다. layout에 따라 세로나 가로로 늘어놓는다",
      },
      {
        part: 'item',
        label: 'Item',
        note: '4×4(16px) 원, 꺼짐은 border-input, 켜지면 border-primary. 켜지면 안쪽에 지름 8px 점이 채워진다',
      },
      { part: 'label', label: 'Label', note: 'text-sm. 항목과 함께 눌리는 자리' },
      {
        part: 'description',
        label: 'Description',
        note: '라벨 아래의 보조 설명. text-muted-foreground / text-xs',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '선택 여부와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'unselected' },
          { value: 'selected' },
          { value: 'hover', note: '포인터가 올라간 동안. 선택된 항목에서는 보이지 않는다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 상태를 바꿀 수 없음' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '항목을 늘어놓는 방향과 설명 유무를 정한다.',
        display: 'row',
        options: [
          { value: 'vertical', note: '기본. 항목이 여럿이거나 설명이 붙을 때' },
          { value: 'horizontal', note: '항목이 짧고 적을 때' },
          { value: 'with-description', note: '항목마다 보조 설명이 필요할 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'option-count',
        title: 'Option count',
        body: '선택지가 다섯을 넘으면 Radio 대신 Select를 씁니다. 항목이 많아지면 화면을 많이 차지하고 한눈에 훑기 어렵습니다.',
        do: ['선택지가 다섯 이하일 때 Radio를 쓴다'],
        dont: ['선택지가 다섯을 넘는데 Radio로 늘어놓지 않는다'],
      },
      {
        id: 'default-selection',
        title: 'Default selection',
        body: '기본값을 반드시 하나 고릅니다. 아무것도 선택되지 않은 채로 두면 사용자가 무엇을 골라야 하는지 짐작해야 합니다.',
        do: ['처음부터 항목 하나가 선택된 상태로 둔다'],
        dont: ['아무 항목도 선택되지 않은 채로 폼을 시작하지 않는다'],
      },
      {
        id: 'no-deselect',
        title: 'No deselect',
        body: "라디오는 한 번 선택하면 스스로 선택을 취소할 수 없습니다. '선택 안 함'이 필요하면 그것도 하나의 항목으로 둡니다.",
        do: ["'선택 안 함'이 뜻 있는 값이면 항목으로 만든다"],
        dont: ["선택을 취소하는 항목 없이 '선택 안 함'을 기대하지 않는다"],
      },
      {
        id: 'no-size-axis',
        title: 'No size axis',
        body: 'Radio는 size 축을 두지 않습니다. 라디오는 한 크기로 충분하고, 크기를 늘리면 옆 글자와의 정렬이 깨집니다.',
        do: ['라디오를 옆 라벨의 줄 높이에 맞춘 한 크기로 쓴다'],
        dont: ['라디오만 키워 옆 글자와의 정렬을 어긋나게 하지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: 'Checkbox와 짝을 이루는 컴포넌트입니다. size 축을 두지 않는 이유는 Checkbox와 같은 문구로 적습니다. 포커스 링은 Input · Select · Checkbox와 같은 모양입니다.',
      },
    ],
    usage: [
      { id: 'sort-order', title: '정렬 기준', note: '선택지가 몇 개 안 될 때는 Select 대신 Radio로 바로 보인다' },
      { id: 'deploy-scope', title: '배포 범위', note: '전체·단계적처럼 서로 배타적인 범위 중 하나를 고른다' },
      { id: 'billing-cycle', title: '결제 주기', note: '월간·연간처럼 값마다 설명이 필요할 때 with-description을 쓴다' },
      { id: 'permission-level', title: '권한 등급', note: '등급은 항상 하나이므로 Checkbox가 아니라 Radio를 쓴다' },
    ],
    cases: [
      { id: 'two-line-item', title: '항목이 두 줄 이상', note: '항목은 첫 줄에 맞춰 위쪽에 정렬한다' },
      { id: 'disabled-selected', title: '비활성인데 선택된 경우', note: '색은 흐려지지만 선택된 상태 자체는 그대로 보인다' },
      { id: 'two-options', title: '항목이 둘뿐', note: '둘뿐이어도 서로 배타적이면 Radio를 쓴다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '라벨이 줄바꿈되어도 항목과의 정렬은 유지된다' },
    ],
    verified: true,
  },
  {
    id: 'select',
    name: 'Select',
    aliases: ['셀렉트', '드롭다운', '선택', 'dropdown', 'combobox'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.7.0',
    changedIn: 'v0.8.0',
    purpose: '여러 값 중 하나를 고르게 한다. 선택지가 둘셋뿐이면 Radio를, 동작을 실행하는 자리에는 Dropdown Menu를 쓴다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '테두리·높이·포커스 링은 Input과 같은 토큰을 쓴다. 나란히 놓여도 어긋나지 않는다. 오른쪽 끝에 16×16 ChevronDown이 열림 여부와 무관하게 항상 보인다. 열리면 트리거 아래에 목록이 뜬다. bg-popover, 모서리는 radius-md, 쌓임 순서는 z-popover. 목록의 각 줄은 text-sm이고 포커스되면 bg-accent, 고른 항목에는 오른쪽에 16×16 Check 아이콘이 함께 보인다',
      },
      {
        part: 'value',
        label: 'Value',
        note: '선택된 항목의 문구. 아직 고르지 않았으면 이 자리에 자리표시자가 대신 보인다',
      },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: '트리거의 높이를 정한다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [{ value: 'sm' }, { value: 'default' }, { value: 'lg' }],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 선택을 바꿀 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
        ],
      },
      {
        name: 'width',
        title: 'Width',
        description: '트리거가 차지하는 가로 폭을 정한다. 기대하는 값의 길이에 맞춘다.',
        display: 'row',
        options: [
          { value: 'hug', note: '기대하는 값 길이에 맞춘 폭. 기본' },
          { value: 'fill', note: '부모 요소의 폭을 채운다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'radio-vs-select',
        title: 'Radio vs Select',
        body: '선택지가 적으면 Radio를, 많으면 Select를 씁니다. 둘셋뿐인데 접어 두면 누르는 수만 늘어납니다.',
        do: ['선택지가 넷 이상이면 Select를 쓴다', '선택지를 한눈에 다 보여줄 필요가 없을 때 접어 둔다'],
        dont: ['선택지가 두셋뿐인데 Select로 접어 두지 않는다'],
      },
      {
        id: 'placeholder-vs-default',
        title: 'Placeholder vs default value',
        body: '자리표시자와 기본값을 구별합니다. 고르지 않은 상태와 기본이 골라진 상태는 다릅니다.',
        do: ['기본으로 둘 값이 있으면 defaultValue로 미리 선택한다', '정말 고르지 않았으면 자리표시자를 쓴다'],
        dont: ['기본값을 자리표시자 문구로 흉내 내지 않는다'],
      },
      {
        id: 'item-order',
        title: 'Item order',
        body: '항목 순서에 뜻을 담습니다. 빈도나 크기 순이 알파벳순보다 나은 자리가 많습니다.',
        do: ['빈도나 단계가 있으면 그 순서를 따른다', '자주 쓰는 항목을 위로 올린다'],
        dont: ['뜻 없이 알파벳순으로만 늘어놓지 않는다'],
      },
      {
        id: 'select-vs-dropdown-menu',
        title: 'Select vs Dropdown Menu',
        body: 'Select와 Dropdown Menu를 바꿔 쓰지 않습니다. Select는 값을 고르고 Dropdown Menu는 동작을 실행합니다.',
        do: ['상태나 분류처럼 값을 고르는 자리에는 Select를 쓴다', '삭제·수정처럼 동작을 실행하는 자리에는 Dropdown Menu를 쓴다'],
        dont: ['동작을 실행하는 자리에 Select를 쓰지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: "Input · Select · Checkbox 셋이 함께 지키는 규칙입니다. 높이는 같은 size에서 서로 같습니다. sm은 표와 필터 바, default는 폼, lg는 단독 입력입니다. 포커스 링은 셋이 같은 모양입니다. 오류는 aria-invalid로 나타내고 색과 문구를 함께 씁니다. 상태 표현의 자세한 규칙은 Foundations의 State 문서를 따릅니다.",
      },
    ],
    usage: [
      { id: 'table-filter', title: '표 필터', note: 'sm 크기로 주변 컨트롤과 높이를 맞춘다' },
      { id: 'form-category', title: '폼의 분류 선택', note: '라벨과 함께 폼 한 줄에 놓는다' },
      { id: 'page-size', title: '페이지당 행 수', note: '숫자 몇 개 중 하나를 고르는 좁은 트리거' },
      { id: 'status-change', title: '상태 변경', note: '표의 행에서 상태를 바로 바꿀 때 쓴다' },
    ],
    cases: [
      { id: 'many-items', title: '항목이 아주 많은 경우', note: '목록이 뷰포트를 넘으면 목록 안에서 스크롤된다' },
      { id: 'long-item-text', title: '항목 글이 트리거보다 긴 경우', note: '줄바꿈하지 않고 잘린다' },
      { id: 'single-option', title: '선택지가 하나뿐인 경우', note: 'Select로 접어 두는 대신 값을 그대로 보여주는 편이 낫다' },
      { id: 'empty-list', title: '비어 있는 목록', note: '항목이 없다는 안내를 목록 자리에 보여준다' },
    ],
    verified: true,
  },
  {
    id: 'slider',
    name: 'Slider',
    aliases: ['슬라이더', '범위 선택', '값 조절', 'range slider'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.0',
    purpose: '드래그하거나 화살표 키로 움직여 값을 어림잡아 고른다. Radix의 Slider를 감싼다.',
    anatomy: [
      { part: 'track', label: 'Track', note: '전체 범위를 나타내는 바탕. 늘 bg-muted다' },
      {
        part: 'range',
        label: 'Range',
        note: '손잡이가 하나면 시작부터 손잡이까지, range처럼 둘이면 두 손잡이 사이를 bg-primary로 채운다',
      },
      {
        part: 'thumb',
        label: 'Thumb',
        note: '드래그하거나 화살표 키로 움직이는 손잡이. 테두리와 bg-background. layout이 range면 값의 개수만큼 둘이 된다',
      },
      { part: 'value', label: 'Value', note: '지금 값을 숫자로 보인다', optional: true },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: 'Track의 두께와 Thumb의 크기를 함께 정한다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 행, 필터 바처럼 조밀한 자리' },
          { value: 'default', note: '기본' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '상호작용 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'focus', note: '키보드 포커스. 화살표 키로 값을 움직일 수 있다' },
          { value: 'disabled', note: '지금 값을 바꿀 수 없음' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description:
          '손잡이가 하나인지 둘인지를 정한다. layout이라는 이름의 prop은 없다 — value(비제어라면 defaultValue) 배열의 길이가 손잡이 수다.',
        display: 'row',
        options: [
          { value: 'single', note: '값 하나를 고른다' },
          { value: 'range', note: '값이 둘이다. 손잡이가 둘이고 그 사이가 채워진다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'show-value-as-number',
        title: '값을 숫자로 함께 보인다',
        body: '손잡이 위치만으로는 지금 값이 얼마인지 읽히지 않습니다.',
        do: ['손잡이 곁에 지금 값을 숫자로 함께 보인다'],
        dont: ['손잡이 위치만 보이고 값을 숫자로 남기지 않는다'],
      },
      {
        id: 'exact-value-needs-input',
        title: '정확한 값이 필요하면 입력 칸을 곁에 둔다',
        body: '슬라이더는 어림잡는 도구입니다. 37을 정확히 맞춰야 하는 자리에는 맞지 않습니다.',
        do: ['정확한 값이 중요하면 슬라이더 곁에 숫자 입력 칸을 둔다'],
        dont: ['정확한 값이 필요한 자리에 슬라이더 하나만 두지 않는다'],
      },
      {
        id: 'step-matches-unit',
        title: '눈금 간격을 값의 단위에 맞춘다',
        body: '0.01씩 움직이는 슬라이더는 손으로 맞출 수 없습니다.',
        do: ['값이 실제로 뜻을 갖는 단위로 step을 정한다'],
        dont: ['너무 잘게 나눈 step으로 손으로 맞추기 어렵게 두지 않는다'],
      },
      {
        id: 'five-or-fewer-use-radio',
        title: '선택지가 다섯 개 이하면 슬라이더를 쓰지 않는다',
        body: 'Radio가 더 빠르고 정확합니다.',
        do: ['선택지가 다섯 개를 넘고 연속된 값일 때 슬라이더를 쓴다'],
        dont: ['다섯 개 이하의 정해진 선택지를 슬라이더로 고르게 하지 않는다'],
      },
    ],
    usage: [
      { id: 'price-range-filter', title: '가격 범위 필터', note: 'range로 최소·최대 가격을 함께 고른다' },
      { id: 'threshold-setting', title: '임계값 설정', note: '알림을 보낼 기준값을 하나 고른다' },
      { id: 'image-quality', title: '이미지 품질', note: '저장할 때 압축 정도를 고른다' },
      { id: 'display-count', title: '표시 개수', note: '한 화면에 보일 항목 수를 고른다' },
    ],
    cases: [
      { id: 'wide-range', title: '범위가 아주 넓은 경우', note: '전체 범위가 넓을수록 손잡이 하나가 움직이는 값의 폭도 커진다' },
      { id: 'thumbs-at-same-value', title: '두 손잡이가 같은 값이 된 경우', note: '겹쳐도 각자 화살표 키로 다시 갈라 움직일 수 있다' },
      { id: 'no-value', title: '값이 없는 경우', note: '아직 고르지 않았으면 범위의 시작값을 기본으로 둔다' },
      {
        id: 'error-with-help',
        title: '도움말·오류와 함께 있는 경우',
        note: "Field가 감싸면 도움말·오류의 id가 역할 없는 Root가 아니라 role='slider'를 단 손잡이의 aria-describedby로 이어진다. state가 error일 때의 aria-invalid도 같은 자리에 붙는다",
      },
      { id: 'narrow-screen', title: '좁은 화면', note: '폭이 좁아져도 Track이 부모 폭을 그대로 따라간다' },
    ],
    verified: false,
  },
  {
    id: 'switch',
    name: 'Switch',
    aliases: ['스위치', '토글', 'toggle', '온오프', 'on off'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose:
      '즉시 반영되는 켜고 끄기를 나타낸다. Checkbox와 다르다 — 체크박스는 저장을 눌러야 반영되고 스위치는 누르는 즉시 반영된다.',
    anatomy: [
      {
        part: 'track',
        label: 'Track',
        note: 'w-11 h-6, 꺼짐은 bg-input, 켜짐은 bg-primary, 모서리는 radius-full',
      },
      {
        part: 'thumb',
        label: 'Thumb',
        note: '5×5(20px)의 흰 원. 상태에 따라 트랙의 왼쪽이나 오른쪽으로 옮겨간다. pending이면 이 자리에 스피너가 대신 그려진다',
      },
      { part: 'label', label: 'Label', note: 'text-sm. 켜진 상태를 뜻하는 말로 적는다', optional: true },
      {
        part: 'description',
        label: 'Description',
        note: '라벨 아래의 보조 설명. text-muted-foreground / text-xs',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '켜짐 여부와 상호작용, 반영 진행을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'off' },
          { value: 'on' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 상태를 바꿀 수 없음' },
          {
            value: 'pending',
            note: '반영을 기다리는 동안. 손잡이가 스피너로 바뀌고 다시 누를 수 없다',
          },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '라벨과 설명을 붙이는 방식을 정한다.',
        display: 'row',
        options: [
          { value: 'standalone', note: '표의 행처럼 라벨이 다른 곳에 이미 있을 때' },
          { value: 'with-label', note: '기본. 라벨 전체가 눌리는 자리다' },
          { value: 'with-description', note: '라벨만으로 부족할 때 아래에 설명을 더한다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'form-with-save',
        title: 'Form with save button',
        body: '저장 버튼이 있는 폼에서는 Switch 대신 Checkbox를 씁니다. 저장을 누르기 전까지 아무것도 바뀌지 않아야 하는데, Switch는 누르는 즉시 반영되어 그 약속을 어깁니다.',
        do: ['저장 버튼이 있는 폼에는 Checkbox를 쓴다', '즉시 반영해도 되는 자리에만 Switch를 쓴다'],
        dont: ['저장을 눌러야 반영되는 폼 안에 Switch를 두지 않는다'],
      },
      {
        id: 'irreversible',
        title: 'Irreversible actions',
        body: '되돌리기 어려운 동작에는 Switch를 쓰지 않습니다. 실수로 눌러도 즉시 반영되므로 후회할 틈이 없습니다.',
        do: ['가역적인 설정에만 Switch를 쓴다', '되돌리기 어려우면 Dialog로 한 번 더 확인한다'],
        dont: ['삭제나 결제처럼 되돌릴 수 없는 동작에 Switch를 쓰지 않는다'],
      },
      {
        id: 'label-wording',
        title: 'Label wording',
        body: '라벨은 켜진 상태를 뜻하는 말로 적습니다. 꺼진 상태를 기준으로 적으면 스위치가 켜졌을 때 라벨과 상태가 서로 반대로 읽힙니다.',
        do: ["'알림 받기'처럼 켜진 상태를 뜻하는 말을 쓴다"],
        dont: ["'알림 끄기'처럼 꺼진 상태를 뜻하는 말을 라벨로 쓰지 않는다"],
      },
      {
        id: 'pending-feedback',
        title: 'Pending feedback',
        body: '반영을 기다리는 동안은 손잡이 자리에 스피너를 보입니다. 트랙 전체를 흐리게 하면 disabled와 구분되지 않으므로, 손잡이라는 좁은 자리에서만 움직임을 주고 트랙의 색은 목표 상태를 그대로 보입니다.',
        do: ['손잡이를 스피너로 바꾸고 트랙은 목표 상태의 색을 유지한다', '반영이 끝나기 전까지 다시 누르지 못하게 막는다'],
        dont: ['트랙 전체를 흐리게 해 disabled처럼 보이게 하지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: 'Checkbox · Radio와 포커스 링을 공유합니다. 포커스 링은 셋이 같은 모양입니다. 자세한 규칙은 Foundations의 State 문서를 따릅니다.',
      },
    ],
    usage: [
      { id: 'notification-toggle', title: '알림 켜기', note: '켜진 상태를 뜻하는 라벨과 함께 즉시 반영한다' },
      { id: 'visibility', title: '공개 여부', note: '누르는 즉시 다른 사용자에게 보이거나 감춰진다' },
      { id: 'auto-renew', title: '자동 갱신', note: '설명을 더해 무엇이 자동으로 일어나는지 알린다' },
      { id: 'row-toggle', title: '표의 행 안 토글', note: '라벨 없이 트랙만 두고 스크린리더용 이름을 따로 붙인다' },
    ],
    cases: [
      { id: 'update-failed', title: '반영이 실패한 경우', note: '이전 상태로 되돌리고 실패를 알린다' },
      { id: 'locked', title: '권한이 없어 잠긴 경우', note: 'disabled로 두고 이유를 근처에 적는다' },
      { id: 'long-label', title: '라벨이 긴 경우', note: '라벨은 줄바꿈하고 트랙 위치는 그대로 둔다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '라벨이 줄바꿈되어도 트랙과의 정렬은 유지된다' },
    ],
    verified: true,
  },
  {
    id: 'textarea',
    name: 'Textarea',
    aliases: ['텍스트 영역', '여러 줄', 'multiline', '메모', '긴 글'],
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '여러 줄짜리 값을 직접 입력하도록 한다. 한 줄이면 Input을 쓴다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: '테두리는 border-input, 최소 높이는 min-h-20, 모서리는 radius-md',
      },
      {
        part: 'value',
        label: 'Value',
        note: '사용자가 입력한 값. text-sm. 비어 있으면 이 자리에 자리표시자가 대신 보인다',
      },
      {
        part: 'handle',
        label: 'Resize Handle',
        note: 'resize가 vertical일 때 우측 하단에 브라우저가 그리는 손잡이. 별도 DOM 요소가 아니라 지시선은 없다',
        optional: true,
      },
      {
        part: 'char-count',
        label: 'Character Count',
        note: '글자 수 제한이 있을 때 남은 수를 보인다. text-muted-foreground / text-xs',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '상호작용과 값의 상태를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'hover', note: '포인터가 올라간 동안' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 값을 바꿀 수 없음' },
          { value: 'invalid', note: 'aria-invalid로 나타낸다. 테두리 색과 문구를 함께 쓴다' },
          {
            value: 'readonly',
            note: '값을 읽고 복사할 수 있으나 고칠 수 없다. disabled와 다르다',
          },
        ],
      },
      {
        name: 'resize',
        title: 'Resize',
        description: '사용자가 크기를 조절할 수 있는 방향을 정한다. size 축 대신 이 축을 둔다.',
        display: 'row',
        options: [
          { value: 'none', note: '자리가 정해진 곳. 표 안, 좁은 패널' },
          { value: 'vertical', note: '세로로만 늘릴 수 있다. 기본' },
          { value: 'auto', note: '내용에 맞춰 자란다. field-sizing-content를 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'no-horizontal-resize',
        title: 'No horizontal resize',
        body: '가로 크기 조절은 허용하지 않습니다. 폭이 바뀌면 옆 요소와의 정렬이 흐트러지고 폼의 레이아웃이 무너집니다.',
        do: ['세로로만 크기를 조절하게 한다', '내용에 따라 자라야 하면 resize를 auto로 둔다'],
        dont: ['className으로 가로 크기 조절을 강제로 허용하지 않는다'],
      },
      {
        id: 'min-height',
        title: 'Min height',
        body: '최소 높이는 기대하는 글의 길이에 맞춥니다. 여러 문단이 오가는 자리에 기본 높이만 두면 계속 스크롤하며 써야 합니다.',
        do: ['긴 본문이 예상되면 min-height를 늘린다', '짧은 메모는 기본 높이로 충분하다'],
        dont: ['글의 길이와 무관하게 모든 Textarea를 같은 높이로 두지 않는다'],
      },
      {
        id: 'character-limit',
        title: 'Character limit',
        body: '글자 수 제한이 있으면 남은 수를 함께 보입니다. 제한을 넘기면 그 사실이 먼저 눈에 띄어야 합니다.',
        do: ['입력 칸 아래에 남은 글자 수를 보인다', '제한을 넘으면 색으로 알린다'],
        dont: ['제한이 있는데 남은 수를 보이지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: 'Input과 테두리·포커스 링·오류 표현을 공유합니다. inputVariants를 그대로 재사용하므로 두 컴포넌트의 테두리 색과 포커스 링은 항상 같은 모양입니다. 오류는 aria-invalid로 나타내고 색과 문구를 함께 씁니다.',
      },
    ],
    usage: [
      { id: 'memo', title: '메모', note: '내부용 짧은 기록. 기본 높이로 충분하다' },
      {
        id: 'rejection-reason',
        title: '반려 사유',
        note: '다음 사람이 무엇을 고쳐야 하는지 알 수 있게 구체적으로 적도록 안내한다',
      },
      { id: 'notice-body', title: '공지 본문', note: '여러 문단이 될 수 있으므로 최소 높이를 넉넉히 둔다' },
      { id: 'address-supplement', title: '주소 보조', note: '한 줄로도 충분하지만 긴 입력을 막지 않는다' },
    ],
    cases: [
      { id: 'very-long-text', title: '아주 긴 글', note: '세로로 스크롤되고 가로로는 늘어나지 않는다' },
      { id: 'over-limit', title: '글자 수 초과', note: '남은 수가 음수로 바뀌고 색으로 알린다' },
      {
        id: 'readonly',
        title: '읽기 전용',
        note: '값을 읽고 복사할 수 있으나 고칠 수 없다. disabled와 다르다',
      },
      { id: 'narrow-screen', title: '좁은 화면', note: '기본 폭이 부모를 채우므로 별도 처리가 필요 없다' },
    ],
    verified: true,
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    aliases: ['경로', '빵부스러기', 'path', '위치'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '지금 어디에 있는지와 어떻게 왔는지를 보인다. 뒤로 가기의 대체물로 쓰지 않는다.',
    anatomy: [
      {
        part: 'list',
        label: 'List',
        note: '가로로 늘어선 목록. nav aria-label로 감싸고 안은 ol이다',
      },
      {
        part: 'item',
        label: 'Item',
        note: '지나온 계층으로 가는 링크. text-sm, text-muted-foreground, hover에서 text-foreground',
      },
      {
        part: 'separator',
        label: 'Separator',
        note: '항목 사이의 구분 기호. aria-hidden으로 스크린리더가 읽지 않는다',
      },
      {
        part: 'collapsed',
        label: 'Collapsed',
        note: '줄어든 가운데 계층의 자리. truncated에서만 나타나는 부위다',
        optional: true,
      },
      {
        part: 'current',
        label: 'Current',
        note: '지금 위치. 링크가 아닌 span이고 aria-current="page"를 단다',
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '계층을 모두 보일지 가운데를 줄일지 정한다.',
        display: 'grid',
        options: [
          { value: 'default', note: '계층이 넷 이하일 때' },
          { value: 'truncated', note: '계층이 넷을 넘어 가운데를 줄임표로 접었을 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'last-item-not-link',
        title: 'Last item is not a link',
        body: '마지막 항목은 지금 위치이므로 링크가 아닙니다. 누를 수 있는 것처럼 보이면 눌러도 반응이 없어 혼란을 줍니다.',
        do: ['마지막 항목은 span과 aria-current로 나타낸다', '나머지 항목과 다른 스타일로 구분한다'],
        dont: ['마지막 항목을 앞의 항목과 똑같은 링크로 두지 않는다'],
      },
      {
        id: 'truncate-deep-hierarchy',
        title: 'Truncate deep hierarchy',
        body: '계층이 넷을 넘으면 가운데를 줄입니다. 모든 계층을 한 줄에 나열하면 길어져서 정작 지금 위치를 찾기 어려워집니다.',
        do: ['첫 항목과 마지막 항목만 남기고 가운데는 줄임표로 접는다'],
        dont: ['계층이 깊다고 모든 단계를 한 줄에 그대로 나열하지 않는다'],
      },
      {
        id: 'not-a-back-button',
        title: 'Not a back button',
        body: 'Breadcrumb은 뒤로 가기의 대체물이 아닙니다. 방문한 순서가 아니라 콘텐츠의 계층 구조를 보여줍니다.',
        do: ['URL이 나타내는 계층 구조를 그대로 보여준다'],
        dont: ['브라우저 히스토리를 대신하는 용도로 쓰지 않는다'],
      },
    ],
    usage: [
      { id: 'detail-header', title: '상세 화면 상단', note: '지금 보는 항목이 어느 목록에서 왔는지 알린다' },
      { id: 'settings-subpage', title: '설정 하위', note: '설정 안의 세부 메뉴 위치를 보인다' },
      { id: 'nested-list', title: '중첩된 목록', note: '폴더처럼 계층을 오가는 목록에서 위치를 보인다' },
      { id: 'from-search-result', title: '검색 결과에서 들어간 경우', note: '검색 결과로 되돌아가는 경로를 남긴다' },
    ],
    cases: [
      { id: 'long-name', title: '이름이 아주 긴 경우', note: '줄바꿈하지 않고 끝을 줄임표로 자른다' },
      { id: 'deep-hierarchy', title: '계층이 깊은 경우', note: '첫 항목과 마지막 항목만 남기고 가운데를 접는다' },
      { id: 'top-level', title: '최상위인 경우', note: '갈 곳이 없으므로 Breadcrumb 자체를 생략하는 편이 낫다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '자리가 부족하면 다음 줄로 넘어간다' },
    ],
    verified: true,
  },
  {
    id: 'command',
    name: 'Command',
    aliases: ['커맨드', '명령 팔레트', 'command palette', '빠른 이동', '검색', 'cmdk'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose:
      '검색해서 곧장 실행한다. 값을 골라 폼에 담으면 Combobox고, 어딘가로 가거나 동작을 실행하면 Command다. cmdk 없이 Dialog와 이 저장소의 순수 함수만으로 세웠다.',
    anatomy: [
      {
        part: 'search',
        label: 'Search',
        note: '검색 칸. 왼쪽에 16×16 Search 아이콘이 있고 아래 목록과 테두리로 나뉜다. 위아래 화살표로 짚은 자리를 옮기고 Enter로 실행한다',
      },
      {
        part: 'list',
        label: 'List',
        note: '걸러진 항목이 담기는 자리. role=listbox이고 세로로 스크롤된다',
      },
      {
        part: 'group-label',
        label: 'Group label',
        note: '항목이 속한 묶음의 이름표. 이름표가 없는 항목은 이 부위 없이 곧장 나열된다',
        optional: true,
      },
      {
        part: 'item',
        label: 'Item',
        note: '실행할 수 있는 낱개 항목. role=option이고 지금 짚은 항목은 aria-activedescendant가 알린다',
      },
      {
        part: 'empty-message',
        label: 'Empty message',
        note: '걸러진 결과가 없을 때 목록 자리를 대신하는 문구. 결과가 있는 상태에서는 나타나지 않는다',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '질의에 따라 목록이 어떻게 달라지는지 보인다. 포털을 쓰지 않아 세 모습이 격자 안에 그대로 담긴다.',
        display: 'grid',
        options: [
          { value: 'default', note: '기본. 질의가 비어 전체가 보인다' },
          { value: 'filtered', note: '질의로 좁혀진 목록' },
          { value: 'empty', note: '맞는 것이 없다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'distinguish-combobox',
        title: 'Distinguish from Combobox',
        body: '값을 골라 폼에 담으면 Combobox입니다. 어딘가로 가거나 무언가를 실행하면 Command입니다.',
        do: ['눌러서 곧장 실행되는 동작에는 Command를 쓴다', '검색해서 값 하나를 폼에 담을 때는 Combobox를 쓴다'],
        dont: ['실행되는 동작을 값처럼 트리거에 남겨 두지 않는다'],
      },
      {
        id: 'empty-state-teaches',
        title: 'Empty state teaches',
        body: '질의가 비었을 때 전체를 쏟지 않고 자주 쓰는 것이나 최근 것을 보입니다.',
        do: ['빈 화면에 최근 항목처럼 무엇을 칠 수 있는지 보여준다'],
        dont: ['빈 화면에 전체 목록을 쏟아 무엇부터 봐야 할지 알 수 없게 두지 않는다'],
      },
      {
        id: 'groups-are-labels',
        title: 'Groups are labels, not walls',
        body: '위아래 이동은 묶음 경계를 넘어 이어집니다. 묶음마다 멈추면 아래쪽 묶음에 손이 닿지 않습니다.',
        do: ['여러 묶음을 한 목록 안에 이름표로만 나눈다'],
        dont: ['묶음마다 목록을 따로 떼어 옮겨 다녀야 하게 만들지 않는다'],
      },
      {
        id: 'keywords-carry-aliases',
        title: 'Keywords carry aliases',
        body: "이름만으로는 사람이 치는 말에 닿지 않습니다. '모달'로 Dialog를 찾으려면 항목이 그 말을 들고 있어야 합니다.",
        do: ['항목마다 사람이 실제로 치는 다른 이름을 keywords로 함께 태운다'],
        dont: ['영문 이름 하나만 놓고 그 말을 몰라도 찾을 수 있으리라 기대하지 않는다'],
      },
    ],
    usage: [
      { id: 'quick-navigation', title: '빠른 이동', note: '문서 컴포넌트 목록에서 원하는 페이지로 곧장 이동한다' },
      { id: 'run-action', title: '동작 실행', note: '폼을 거치지 않고 자주 쓰는 동작을 곧바로 수행한다' },
      { id: 'column-picker', title: '표에서 보일 열 고르기', note: '고른 열이 바로 반영된다. 값을 쌓아 두는 Combobox와 다르다' },
      { id: 'global-search', title: '전역 검색', note: '컴포넌트와 Foundations 문서를 한 자리에서 함께 찾는다' },
    ],
    cases: [
      { id: 'no-results', title: '결과가 없는 경우', note: '검색어를 바꿔 보라는 안내를 함께 보인다' },
      { id: 'many-entries', title: '항목이 아주 많은 경우', note: '목록이 자리를 넘으면 목록 안에서 스크롤된다' },
      { id: 'single-group', title: '묶음이 하나뿐인 경우', note: '묶음이 하나면 그 이름표 하나만 보인다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '검색 칸과 목록 모두 폭이 줄어도 넘치지 않는다' },
    ],
    verified: true,
  },
  {
    id: 'pagination',
    name: 'Pagination',
    aliases: ['페이지', '페이지네이션', '페이징', 'paging'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '긴 목록을 나눠 보인다. 스크롤로 계속 불러오게 하려면 무한 스크롤을 쓴다.',
    anatomy: [
      { part: 'previous', label: 'Previous', note: 'Button variant="outline" size="sm". 첫 페이지에서 비활성' },
      {
        part: 'page-numbers',
        label: 'Page Numbers',
        note: '페이지 번호 버튼의 묶음. 현재 페이지만 variant="default", 나머지는 variant="ghost". variant가 simple이면 나타나지 않는다',
        optional: true,
      },
      { part: 'next', label: 'Next', note: 'Button variant="outline" size="sm". 마지막 페이지에서 비활성' },
      { part: 'per-page', label: 'Per Page', note: '페이지당 개수를 보이는 문구' },
      { part: 'total-count', label: 'Total Count', note: '전체 개수를 보이는 문구' },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '페이지 번호를 낱개로 보일지 위치만 보일지 정한다.',
        display: 'row',
        options: [
          { value: 'numbered', note: '페이지 번호를 낱개 버튼으로 늘어놓는다. 기본' },
          { value: 'simple', note: "'3 / 5 페이지'처럼 위치만 보인다. 페이지 수가 아주 많을 때" },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '지금 페이지의 위치에 따라 이전·다음 버튼의 활성 여부가 달라진다.',
        display: 'grid',
        options: [
          { value: 'default', note: '첫 페이지도 마지막 페이지도 아닐 때. 이전·다음 모두 활성' },
          { value: 'first-page', note: '첫 페이지. 이전이 비활성' },
          { value: 'last-page', note: '마지막 페이지. 다음이 비활성' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'show-total-count',
        title: 'Show total count',
        body: '전체 개수를 함께 보입니다. 페이지 수만 보이면 전체가 얼마나 되는지 가늠할 수 없습니다.',
        do: ["'총 47개'처럼 전체 개수를 페이지 이동 옆에 둔다"],
        dont: ['이동 버튼만 두고 전체 개수를 생략하지 않는다'],
      },
      {
        id: 'disable-edge-buttons',
        title: 'Disable edge buttons',
        body: '첫 페이지와 마지막 페이지에서는 더 갈 수 없는 방향의 버튼을 비활성으로 둡니다. 눌러도 아무 일이 일어나지 않는 버튼은 오작동처럼 보입니다.',
        do: ['첫 페이지에서 이전을, 마지막 페이지에서 다음을 비활성으로 둔다'],
        dont: ['더 갈 곳이 없는데 버튼을 계속 눌리는 상태로 두지 않는다'],
      },
      {
        id: 'hide-single-page',
        title: 'Hide when single page',
        body: '페이지가 하나뿐이면 Pagination 자체를 감춥니다. 옮겨 갈 곳이 없는데 이동 버튼을 보이면 쓸모없는 자리만 차지합니다.',
        do: ['목록 전체가 한 페이지에 다 들어가면 Pagination을 렌더링하지 않는다'],
        dont: ['페이지가 하나뿐인데 두 버튼을 모두 비활성으로 둔 채 자리를 차지하게 두지 않는다'],
      },
    ],
    usage: [
      { id: 'below-table', title: '표 아래', note: '표의 행 수와 전체 개수를 함께 보인다' },
      { id: 'below-card-list', title: '카드 목록 아래', note: '카드가 여러 줄일 때 목록 끝에 둔다' },
      { id: 'log', title: '로그', note: '전체 개수를 가늠하기 어려우면 simple을 쓴다' },
      { id: 'search-result', title: '검색 결과', note: '검색된 전체 건수를 함께 보인다' },
    ],
    cases: [
      { id: 'unknown-total', title: '전체 개수를 모르는 경우', note: '전체 개수와 페이지 번호를 빼고 이전·다음만 남긴다' },
      { id: 'many-pages', title: '페이지가 아주 많은 경우', note: '가운데 번호를 줄임표로 접는다' },
      { id: 'no-results', title: '결과가 없는 경우', note: '보일 항목이 없으므로 Pagination도 함께 생략한다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '자리가 부족하면 다음 줄로 넘어간다' },
    ],
    verified: true,
  },
  {
    id: 'steps',
    name: 'Steps',
    aliases: ['단계', '스텝', '스테퍼', 'stepper', '마법사', 'wizard'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '여러 단계로 이루어진 흐름에서 지금 단계와 전체 진행 상태를 보인다. state는 단계 하나의 상태이므로 Steps가 현재 단계 번호로 계산하지 않고 각 Step이 직접 받는다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: 'ol. orientation에 따라 가로 또는 세로로 늘어놓는다',
      },
      {
        part: 'step',
        label: 'Step',
        note: 'li. state를 직접 받는다. 자기가 몇 번째인지, 전체가 몇 개인지 몰라도 된다',
      },
      {
        part: 'indicator',
        label: 'Indicator',
        note: 'state에 따라 테두리 원·채운 원·체크 아이콘·X 아이콘으로 달라진다',
      },
      { part: 'label', label: 'Label', note: '단계 이름 한 줄' },
      {
        part: 'description',
        label: 'Description',
        note: '단계를 보충하는 설명',
        optional: true,
      },
      {
        part: 'connector',
        label: 'Connector',
        note: '다음 단계로 이어지는 선. 마지막 단계 뒤에는 없다',
      },
    ],
    properties: [
      {
        name: 'orientation',
        title: 'Orientation',
        description: '단계를 가로로 늘어놓을지 세로로 늘어놓을지 정한다.',
        display: 'row',
        options: [
          { value: 'horizontal', note: '기본. 가로로 늘어놓는다' },
          { value: 'vertical', note: '세로로 늘어놓는다' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '단계 하나의 진행 상태를 나타낸다. 격자의 칸마다 그 상태인 단계 하나를 보인다.',
        display: 'grid',
        options: [
          { value: 'pending', note: '아직 오지 않은 단계. 테두리 원과 숫자' },
          { value: 'current', note: "지금 하고 있는 단계. 채운 원과 숫자, aria-current='step'" },
          { value: 'complete', note: '끝난 단계. 채운 원과 체크 아이콘' },
          { value: 'error', note: '실패한 단계. 채운 원과 X 아이콘' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '라벨만 보일지, 라벨 아래에 설명을 더할지 정한다.',
        display: 'row',
        options: [
          { value: 'label', note: '기본. 단계 이름만 보인다' },
          { value: 'with-description', note: '이름 아래에 설명을 한 줄 더한다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'color-and-shape',
        title: 'Color and shape',
        body: '현재 단계를 색과 모양 둘로 알립니다. 색만 다르면 색을 구별하지 못하는 사람에게는 어디까지 왔는지 보이지 않습니다. 끝난 단계는 체크 표시로, 지금 단계는 채운 원으로 갈라 보입니다.',
        do: ['끝난 단계는 체크 아이콘으로, 지금 단계는 채운 원과 숫자로 갈라 보인다'],
        dont: ['색만 다르고 모양은 같은 원으로 단계 상태를 구별하지 않는다'],
      },
      {
        id: 'clickable-visited-only',
        title: 'Clickable visited steps only',
        body: '되돌아갈 수 있는 단계만 누를 수 있게 합니다. 아직 지나지 않은 단계를 누를 수 있게 두면 건너뛸 수 있다고 오해합니다.',
        do: ['complete 상태인 지난 단계만 누를 수 있게 한다'],
        dont: ['아직 오지 않은 pending 단계를 눌러 건너뛸 수 있게 두지 않는다'],
      },
      {
        id: 'step-count-range',
        title: 'Step count range',
        body: '단계를 셋에서 다섯 사이로 둡니다. 둘이면 나눌 이유가 없고, 여섯을 넘으면 어디까지 왔는지 세어야 합니다.',
        do: ['단계를 셋에서 다섯 사이로 나눈다'],
        dont: ['여섯을 넘는 단계를 한 Steps에 모두 늘어놓지 않는다'],
      },
      {
        id: 'no-progress-bar',
        title: 'No progress bar alongside',
        body: '진행률 막대와 함께 쓰지 않습니다. 같은 것을 두 번 말합니다.',
        do: ['단계 진행은 Steps 하나로만 보인다'],
        dont: ['Steps 옆에 진행률 막대를 나란히 두어 같은 정보를 반복하지 않는다'],
      },
    ],
    usage: [
      {
        id: 'multi-step-form',
        title: '여러 단계 폼',
        note: '한 화면에 담기 어려운 입력을 단계로 나눈다',
      },
      {
        id: 'approval-flow-position',
        title: '승인 흐름의 현재 위치',
        note: '결재나 심사가 지금 어느 단계인지 보인다',
      },
      {
        id: 'processing-status',
        title: '처리 단계 표시',
        note: '주문이나 배송처럼 시간이 걸리는 처리 과정을 보인다',
      },
      {
        id: 'installation-guide',
        title: '설치 안내',
        note: '순서대로 따라야 하는 설치 절차를 안내한다',
      },
    ],
    cases: [
      {
        id: 'many-steps',
        title: '단계가 많은 경우',
        note: '다섯을 넘으면 한 단계씩 좁아져 라벨을 읽기 어려워진다',
      },
      { id: 'long-step-name', title: '단계 이름이 긴 경우', note: '줄바꿈되어 다음 줄로 이어진다' },
      {
        id: 'failed-step',
        title: '실패한 단계',
        note: 'error로 표시하고 그 뒤의 단계는 pending으로 남는다',
      },
      { id: 'narrow-screen', title: '좁은 화면', note: '가로 폭이 부족하면 라벨이 줄바꿈된다' },
    ],
    verified: false,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    aliases: ['탭', 'tab', '전환'],
    category: 'navigation',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '같은 자리에서 내용을 바꿔 보인다.',
    anatomy: [
      {
        part: 'list',
        label: 'List',
        note: "role='tablist'. 탭들을 감싸고 variant에 따라 밑줄이나 배경 그릇을 그린다",
      },
      {
        part: 'tab',
        label: 'Tab',
        note: "role='tab'. text-sm / font-medium, 기본은 text-muted-foreground, 활성이면 text-foreground",
      },
      {
        part: 'active-indicator',
        label: 'Active Indicator',
        note: '활성 탭의 위치를 가리킨다. line은 탭 아래의 2px 밑줄(bg-primary)로, enclosed는 활성 탭 자체의 배경(bg-background)과 그림자로 나타난다',
      },
      { part: 'panel', label: 'Panel', note: "role='tabpanel'. 선택된 탭의 내용을 담는다" },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '활성 표시의 자리를 정한다.',
        display: 'row',
        options: [
          { value: 'line', note: '기본. 콘텐츠와 가벼운 경계로 이어질 때' },
          { value: 'enclosed', note: '탭 자체가 그릇처럼 보여 구분된 패널 여럿을 다룰 때' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '탭 하나의 선택 여부와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'active', note: '지금 열려 있는 탭' },
          { value: 'hover', note: '포인터가 올라간 동안. 활성 탭에서는 보이지 않는다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '지금 고를 수 없음' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'url-sync',
        title: 'URL synchronization',
        body: '탭 사이를 오갈 때 주소가 함께 바뀌어야 합니다. 새로고침하거나 링크를 공유해도 같은 탭이 열려 있어야 합니다.',
        do: ['탭 값을 주소의 경로나 쿼리와 동기화한다', '주소로 바로 들어왔을 때 그 탭이 먼저 열리게 한다'],
        dont: ['탭 상태를 컴포넌트 안에만 두고 주소와 연결하지 않는다'],
      },
      {
        id: 'noun-naming',
        title: 'Tab naming',
        body: '탭 이름은 명사로 적습니다. 동사로 적으면 탭이 지금 눌러야 하는 동작처럼 보입니다.',
        do: ["'개요'처럼 명사로 적는다"],
        dont: ["'개요 보기'처럼 동사를 붙이지 않는다"],
      },
      {
        id: 'tab-count-limit',
        title: 'Tab count limit',
        body: '탭이 일곱을 넘으면 Tabs 대신 다른 구조(Select나 사이드 메뉴)를 씁니다. 너무 많으면 한 줄에 담기 어렵고 훑어보기도 힘듭니다.',
        do: ['탭이 일곱 이하일 때 Tabs를 쓴다'],
        dont: ['탭이 일곱을 넘는데 한 줄에 욱여넣지 않는다'],
      },
      {
        id: 'shared-rules',
        title: 'Shared rules',
        body: '포커스 링은 다른 컨트롤과 같은 모양입니다. 자세한 규칙은 Foundations의 State 문서를 따릅니다.',
      },
    ],
    usage: [
      { id: 'detail-sections', title: '상세 화면의 정보 구분', note: '한 대상의 여러 면을 같은 자리에서 오가며 본다' },
      { id: 'settings-groups', title: '설정 묶음', note: '주제별로 나눈 설정을 한 화면에서 전환한다' },
      { id: 'log-types', title: '로그 종류', note: '종류가 정해져 있고 한 번에 하나씩만 본다' },
      { id: 'period-stats', title: '기간별 통계', note: '일간·주간·월간처럼 같은 화면을 다른 기준으로 본다' },
    ],
    cases: [
      { id: 'long-tab-name', title: '탭 이름이 긴 경우', note: '줄바꿈하지 않고 한 줄로 두어 목록의 높이를 지킨다' },
      { id: 'overflow-tabs', title: '탭이 화면보다 많은 경우', note: '목록이 가로로 스크롤되고 밑줄은 스크롤을 따라간다' },
      { id: 'tab-with-badge', title: '배지가 붙는 경우', note: '탭 이름 뒤에 붙여 개수나 상태를 함께 알린다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '탭이 줄어들지 않고 가로 스크롤로 대응한다' },
    ],
    verified: true,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    aliases: ['아코디언', '접기', '펼치기', 'collapse', 'expander', '토글 목록'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '여러 항목 중 필요한 것만 펼쳐 한 번에 필요한 만큼만 보인다. 포털을 쓰지 않고 페이지를 잠그지 않아 expanded를 defaultValue로 그대로 보일 수 있다.',
    anatomy: [
      { part: 'container', label: 'Container', note: 'Item들을 세로로 늘어놓는다' },
      {
        part: 'item',
        label: 'Item',
        note: 'Trigger와 Content를 감싼다. disabled를 직접 받는다',
      },
      {
        part: 'trigger',
        label: 'Trigger',
        note: "h3(AccordionHeader)로 감싼 버튼. 열림 여부를 오른쪽 화살표(ChevronDown)의 회전으로 함께 보인다",
      },
      {
        part: 'content',
        label: 'Content',
        note: '열렸을 때 보이는 내용. --radix-accordion-content-height로 높이를 여닫는다',
      },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '항목 사이의 경계를 어떻게 보일지 정한다.',
        display: 'row',
        options: [
          { value: 'plain', note: '기본. 구분선 하나로 한 줄기처럼 이어져 보인다' },
          { value: 'bordered', note: '항목마다 테두리 상자로 서로 떨어져 보인다' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '항목 하나의 열림 여부와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'collapsed', note: '기본. 접힌 상태' },
          { value: 'expanded', note: '펼쳐진 상태. defaultValue로 보인다' },
          { value: 'disabled', note: '열고 닫을 수 없음' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'decide-single-or-multiple',
        title: '한 번에 하나만 열지 여럿 열지 미리 정한다',
        body: '항목끼리 비교해야 하면 여럿, 한 줄기로 읽어야 하면 하나입니다. type(single·multiple)은 쉬고 있는 모습에서 완전히 같아 이 문서의 축으로 두지 않습니다.',
        do: [
          '항목끼리 비교해야 하면 여러 개를 동시에 열 수 있게 정한다',
          '순서대로 하나씩 읽어야 하면 한 번에 하나만 열리게 정한다',
        ],
        dont: ['정하지 않고 상황에 따라 동작을 바꾸지 않는다'],
      },
      {
        id: 'dont-hide-important-content',
        title: '중요한 내용을 접어 두지 않는다',
        body: '접힌 것은 없는 것과 같습니다. 반드시 봐야 하는 내용은 펼쳐 둡니다.',
        do: ['반드시 봐야 하는 내용은 Accordion 밖에 두거나 펼친 채로 둔다'],
        dont: ['중요한 안내를 접힌 Item 안에 숨겨 두지 않는다'],
      },
      {
        id: 'dont-hide-page-length',
        title: '접었다 펴는 것으로 화면 길이를 숨기지 않는다',
        body: '내용이 너무 많으면 접을 것이 아니라 나눌 곳입니다.',
        do: ['한 항목의 내용은 한눈에 읽을 수 있는 길이로 둔다'],
        dont: ['너무 긴 내용을 접어서 화면 길이만 줄여 보이지 않는다'],
      },
    ],
    usage: [
      {
        id: 'advanced-settings',
        title: '설정의 고급 항목',
        note: '자주 안 쓰는 고급 설정을 접어 두어 기본 설정에 집중하게 한다',
      },
      {
        id: 'filter-groups',
        title: '필터 묶음',
        note: '조건이 많은 필터를 주제별로 나눠 필요한 것만 펼쳐 본다',
      },
      {
        id: 'long-form-sections',
        title: '긴 폼의 구획',
        note: '입력할 것이 많은 폼을 구획으로 나눠 한 번에 하나씩 채우게 한다',
      },
      { id: 'faq', title: '자주 묻는 질문', note: '질문과 답을 짝지어 필요한 질문만 펼쳐 본다' },
    ],
    cases: [
      {
        id: 'single-item',
        title: '항목이 하나뿐인 경우',
        note: '항목이 하나라도 접고 펼 수 있는 기능은 그대로 남는다',
      },
      { id: 'long-title', title: '제목이 긴 경우', note: '줄바꿈되어 다음 줄로 이어진다' },
      {
        id: 'long-content',
        title: '내용이 아주 긴 경우',
        note: '내용이 길어도 높이를 그대로 따라 늘어난다',
      },
      {
        id: 'all-expanded',
        title: '모두 펼친 경우',
        note: 'type이 multiple이면 여러 항목을 동시에 열어 둘 수 있다',
      },
    ],
    verified: false,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    aliases: ['프로필', '사진', 'profile', 'user', '유저'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '사람이나 조직을 나타낸다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: 'rounded-full, overflow-hidden. 크기는 size에 따라 size-control-sm·size-control·size-control-lg',
      },
      {
        part: 'content',
        label: 'Content',
        note: '이미지가 성공적으로 불러와지면 그 사진(object-cover)이 안을 채운다. 이미지가 없거나 아직 불러오는 동안에는 대체 글자가 대신한다 — 이름이 있으면 이니셜(첫 글자), 이름조차 없으면 일반 사람 아이콘. bg-muted, text-muted-foreground, text-xs',
      },
    ],
    properties: [
      {
        name: 'size',
        title: 'Size',
        description: '컨테이너의 지름을 정한다. 같은 줄에 놓이는 컨트롤끼리는 크기를 맞춘다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 행처럼 조밀한 자리' },
          { value: 'default', note: '기본. 목록·카드' },
          { value: 'lg', note: '프로필 헤더처럼 단독으로 놓일 때' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '무엇이 안을 채우는지를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'image', note: '이미지를 성공적으로 불러온 경우' },
          { value: 'initials', note: '이미지가 없고 이름은 있는 경우. 이름의 첫 글자를 보인다' },
          { value: 'fallback', note: '이미지가 실패했고 이름도 없는 경우. 일반 사람 아이콘을 보인다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'initials-fallback',
        title: 'Initials as fallback',
        body: '이미지가 없으면 이름의 첫 글자를 씁니다. 빈 원만 남기면 그 자리에 누가 있어야 하는지 알 수 없습니다.',
        do: ['이미지가 없으면 이름의 첫 글자를 대체 글자로 보인다'],
        dont: ['이미지도 이니셜도 없이 빈 원만 남기지 않는다'],
      },
      {
        id: 'not-a-name-substitute',
        title: 'Not a name substitute',
        body: 'Avatar가 이름을 대신하지 않습니다. 얼굴이나 이니셜만으로는 누구인지 확신할 수 없어 이름 글자를 함께 둡니다.',
        do: ['Avatar 옆에 이름을 글자로 함께 둔다'],
        dont: ['이름 없이 Avatar 하나만 두고 누구인지 짐작하게 하지 않는다'],
      },
      {
        id: 'stack-with-count',
        title: 'Stack with count',
        body: '여럿을 겹쳐 놓을 때 개수를 함께 보입니다. 겹친 뒤로 몇 명이 더 있는지 알 수 없으면 목록의 전체 크기를 가늠할 수 없습니다.',
        do: ['겹친 목록 끝에 남은 인원 수(+N)를 보인다'],
        dont: ['겹친 뒤에 몇 명이 더 있는지 알려 주지 않는다'],
      },
    ],
    usage: [
      { id: 'user-list', title: '사용자 목록', note: '이름 앞에 sm 크기로 놓는다' },
      { id: 'comment', title: '댓글', note: '작성자를 이름과 함께 보인다' },
      { id: 'assignee', title: '담당자 표시', note: '표의 담당자 칸에서 이름 대신 짧게 보인다' },
      { id: 'stacked-list', title: '겹친 목록', note: '참여자가 많을 때 겹쳐 놓고 나머지는 개수로 보인다' },
    ],
    cases: [
      { id: 'image-failure', title: '이미지 실패', note: '실패하면 대체 글자로 자동 전환된다' },
      { id: 'single-char-name', title: '이름이 한 글자', note: '그 한 글자를 그대로 이니셜로 쓴다' },
      { id: 'no-name', title: '이름이 없는 경우', note: '이니셜을 만들 수 없으므로 일반 사람 아이콘을 쓴다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '크기가 줄지 않고 옆 글자가 줄바꿈된다' },
    ],
    verified: true,
  },
  {
    id: 'badge',
    name: 'Badge',
    aliases: ['라벨', '태그', '뱃지', 'tag', 'label', 'chip'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '짧은 상태나 분류를 보인다. 누를 수 있는 동작에는 쓰지 않는다.',
    anatomy: [
      { part: 'container', label: 'Container', note: 'radius-sm, variant에 따른 배경·글자색' },
      {
        part: 'dot',
        label: 'Dot',
        note: '1.5×1.5, bg-current로 글자색을 그대로 물려받는다',
        optional: true,
      },
      { part: 'label', label: 'Label', note: 'text-2xs / font-bold' },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '상태의 뜻을 정한다. Foundations의 Color Role이 정한 상태 색의 뜻을 그대로 따른다.',
        display: 'row',
        options: [
          { value: 'neutral', note: '뜻이 정해지지 않은 값이나 분류' },
          { value: 'info', note: '사용자의 행동과 무관한 사실. 점검 예정, 새 기능' },
          { value: 'success', note: '요청이 끝나고 더 할 일이 없음. 승인, 완료' },
          { value: 'warning', note: '그대로 두면 문제가 됨. 만료 임박, 한도 근접' },
          { value: 'destructive', note: '되돌릴 수 없거나 실패함. 정지, 오류' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '점을 함께 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'text', note: '기본' },
          { value: 'with-dot', note: '점으로 상태를 먼저 알린다. 표의 좁은 칸에 유용' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'color-alone',
        title: 'Color alone',
        body: '색만으로 뜻을 전하지 않습니다. 라벨 문구가 뜻을 전하는 주된 수단이고 색은 그것을 강조할 뿐입니다.',
        do: ['라벨 문구로 상태를 명확히 적는다', '색과 문구를 함께 쓴다'],
        dont: ['문구 없이 색이 있는 점만으로 상태를 나타내지 않는다'],
      },
      {
        id: 'no-hover',
        title: 'No hover',
        body: 'Badge는 누를 수 있는 요소가 아니므로 hover 효과를 넣지 않습니다. 커서나 hover 효과가 있으면 사용자가 누를 수 있다고 착각합니다.',
        do: ['상태를 알리는 정보로만 쓴다', '동작이 필요하면 Button을 쓴다'],
        dont: ['hover 효과나 커서 모양을 더하지 않는다'],
      },
      {
        id: 'no-single-char',
        title: 'No single character',
        body: '한 글자만 담은 배지는 만들지 않습니다. 무엇을 뜻하는지 짐작해야 하고, 번역하면 폭이 달라져 정렬이 흔들립니다.',
        do: ['짧더라도 뜻이 통하는 단어를 쓴다'],
        dont: ["'신'처럼 한 글자만 담지 않는다"],
      },
    ],
    usage: [
      { id: 'table-status-column', title: '표의 상태 열', note: '행마다 상태를 짧게 알린다' },
      { id: 'list-category', title: '목록 항목의 분류', note: '제목 옆에 붙여 분류를 보인다' },
      { id: 'count', title: '개수', note: '숫자만 담아 대기 중이거나 처리할 항목 수를 보인다' },
      { id: 'new-indicator', title: '새 항목 표시', note: '새로 추가된 항목 옆에 붙인다' },
    ],
    cases: [
      { id: 'long-label', title: '라벨이 긴 경우', note: '줄바꿈하지 않고 배지가 늘어난다' },
      { id: 'many-in-row', title: '여럿이 나란한 경우', note: '간격을 두고 줄바꿈을 허용한다' },
      { id: 'no-value', title: '값이 없는 경우', note: '배지를 생략하고 자리를 비운다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '글자 크기를 줄이지 않고 줄바꿈으로 대응한다' },
    ],
    verified: true,
  },
  {
    id: 'card',
    name: 'Card',
    aliases: ['카드', '패널', 'panel', '박스'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose: '관련된 내용을 하나의 틀로 묶어 보인다. 안쪽 구획은 Separator로 나눈다.',
    anatomy: [
      { part: 'container', label: 'Container', note: 'rounded-lg. variant에 따른 테두리·배경·그림자' },
      {
        part: 'header',
        label: 'Header',
        note: 'grid. Action이 있으면 두 번째 열을 만들어 오른쪽 끝에 고정한다',
        optional: true,
      },
      { part: 'title', label: 'Title', note: 'font-semibold' },
      {
        part: 'description',
        label: 'Description',
        note: 'text-muted-foreground text-sm',
        optional: true,
      },
      {
        part: 'action',
        label: 'Action',
        note: '헤더 오른쪽 끝. 제목이 길어져도 밀려나지 않는다',
        optional: true,
      },
      { part: 'content', label: 'Content', note: 'padding 축이 좌우 여백을 없애는 대상' },
      { part: 'footer', label: 'Footer', note: 'padding 값과 무관하게 자기 여백을 유지한다', optional: true },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '테두리를 쓸지 그림자를 쓸지 정한다.',
        display: 'row',
        options: [
          { value: 'outlined', note: '기본. 카드가 여럿 나란히 놓이는 화면. 그림자가 여럿이면 화면이 들뜬다' },
          { value: 'elevated', note: '배경 위에 떠 있어야 하는 하나짜리 카드' },
        ],
      },
      {
        name: 'padding',
        title: 'Padding',
        description: 'Content의 좌우 여백을 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'default', note: '기본' },
          { value: 'none', note: '카드가 표를 통째로 담을 때. 표에는 자기 여백이 있어 카드 여백이 겹치면 두 겹이 된다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'no-card-in-card',
        title: '카드를 카드 안에 넣지 않는다',
        body: '테두리가 겹치면 위계가 아니라 잡음이 됩니다. 안쪽 구획은 Separator로 나눕니다.',
        do: ['안쪽 구획은 Separator로 나눈다'],
        dont: ['카드 안에 또 다른 카드를 넣지 않는다'],
      },
      {
        id: 'no-whole-card-link',
        title: '카드 전체를 링크로 만들지 않는다',
        body: '카드 안에 누를 수 있는 것이 둘 이상이면 어디를 눌러야 하는지 흐려집니다. 제목만 링크로 둡니다.',
        do: ['제목만 링크로 둔다'],
        dont: ['카드 전체를 하나의 링크로 감싸지 않는다'],
      },
      {
        id: 'no-padding-with-table',
        title: '표를 담을 때는 여백을 없앤다',
        body: 'padding을 none으로 두고 표의 여백을 씁니다.',
        do: ["표를 담을 때는 padding을 'none'으로 둔다"],
        dont: ['표와 카드 양쪽에 여백을 겹쳐 두지 않는다'],
      },
    ],
    usage: [
      { id: 'dashboard-metric', title: '대시보드의 지표', note: '지표 하나를 카드 한 장에 담는다' },
      { id: 'detail-section', title: '상세 화면의 구획', note: '상세 화면을 여러 구획으로 나누고 구획마다 카드를 둔다' },
      { id: 'settings-group', title: '설정 묶음', note: '관련된 설정 항목을 하나의 카드로 묶는다' },
      { id: 'table-frame', title: '표를 담는 틀', note: 'padding을 none으로 두고 표의 여백을 그대로 쓴다' },
    ],
    cases: [
      { id: 'title-only', title: '제목만 있고 내용이 없는 경우', note: '내용 없이 제목만 있어도 카드 구조는 그대로 유지된다' },
      { id: 'long-content', title: '내용이 아주 긴 경우', note: '내용이 길어지면 카드 높이가 함께 늘어난다' },
      {
        id: 'uneven-height',
        title: '카드가 나란히 놓여 높이가 다른 경우',
        note: 'Card 자신은 높이를 맞추지 않는다. 나란히 두는 화면의 grid나 flex가 높이를 맞춘다',
      },
      {
        id: 'narrow-screen',
        title: '좁은 화면',
        note: '폭이 좁아져도 Header의 두 번째 열은 줄지 않아 Action이 자리를 지킨다',
      },
    ],
    verified: false,
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    aliases: ['접기', '펼치기', '더 보기', 'collapse', 'expander', '접이식'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose:
      '접히는 자리 하나를 감싼다. Accordion과 달리 트리거를 헤딩으로 감싸지 않아, 카드 안이든 표 행 안이든 제목 층위를 새로 만들지 않고 놓을 수 있다.',
    anatomy: [
      { part: 'trigger', label: 'Trigger', note: '버튼 하나. h로 감싸지 않는다' },
      {
        part: 'indicator',
        label: 'Indicator',
        note: 'ChevronDown. 열림 여부를 회전으로 보인다. Trigger 안에서 그려진다',
      },
      {
        part: 'content',
        label: 'Content',
        note: '열렸을 때 보이는 내용. --radix-collapsible-content-height로 높이를 여닫는다',
      },
    ],
    properties: [
      {
        name: 'state',
        title: 'State',
        description: '접혀 있는지와 상호작용을 나타낸다.',
        display: 'grid',
        options: [
          { value: 'collapsed', note: '기본. 접힌 상태' },
          { value: 'expanded', note: '펼쳐진 상태. defaultOpen으로 보인다' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
          { value: 'disabled', note: '열고 닫을 수 없음' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'distinguish-from-accordion',
        title: 'Accordion과 구별한다',
        body: '접히는 자리가 하나면 Collapsible, 여럿을 늘어놓고 그중에서 고르면 Accordion입니다.',
        do: ['접히는 자리가 하나뿐이면 Collapsible을 쓴다', '여럿을 늘어놓고 그중 하나를 고르게 하면 Accordion을 쓴다'],
        dont: ['접히는 자리 하나에 Accordion을 써서 있지도 않은 제목을 만들지 않는다'],
      },
      {
        id: 'announce-hidden-content',
        title: '접힌 채로 무엇이 있는지 알린다',
        body: "'더 보기'만으로는 무엇이 더 있는지 알 수 없습니다. '조건 3개 더'처럼 안에 든 것을 말합니다.",
        do: ["Trigger 라벨에 안에 든 것을 구체적으로 적는다 (예: '조건 3개 더')"],
        dont: ["'더 보기'처럼 안에 무엇이 있는지 알 수 없는 라벨만 쓰지 않는다"],
      },
      {
        id: 'dont-hide-important-content',
        title: '중요한 내용을 접어 두지 않는다',
        body: '접힌 것은 없는 것과 같습니다. 반드시 봐야 하는 내용은 펼쳐 둡니다.',
        do: ['반드시 봐야 하는 내용은 Collapsible 밖에 두거나 펼친 채로 둔다'],
        dont: ['중요한 안내를 접힌 Content 안에 숨겨 두지 않는다'],
      },
      {
        id: 'dont-make-whole-row-trigger',
        title: '표 행 전체를 트리거로 만들지 않는다',
        body: '행 안에 링크나 버튼이 함께 있으면 어디를 눌러야 펴지는지 알 수 없습니다. 펴는 자리를 따로 둡니다.',
        do: ['표 행에서는 펴는 자리를 따로 둔다'],
        dont: ['행 안에 다른 링크나 버튼이 있는데 행 전체를 트리거로 만들지 않는다'],
      },
    ],
    usage: [
      { id: 'advanced-search', title: '고급 검색 조건', note: '자주 안 쓰는 검색 조건을 접어 두어 기본 조건에 집중하게 한다' },
      { id: 'card-detail', title: '카드 안의 부가 정보', note: '카드의 핵심 정보 아래에 부가 정보를 접어 둔다' },
      { id: 'long-log', title: '긴 로그 한 덩이', note: '길게 이어지는 로그를 접어 두고 필요할 때만 펼친다' },
      { id: 'table-row-detail', title: '표 행의 하위 내용', note: '행마다 딸린 하위 내용을 접어 두고 필요한 행만 펼친다' },
    ],
    cases: [
      { id: 'long-content', title: '내용이 아주 긴 경우', note: '내용이 길어도 높이를 그대로 따라 늘어난다' },
      { id: 'start-collapsed', title: '접힌 채로 시작하는 경우', note: 'defaultOpen을 주지 않으면 접힌 채로 시작한다' },
      { id: 'form-inside', title: '안에 폼이 있는 경우', note: '접혀 있는 동안 안의 입력은 접근성 트리에서도 함께 빠진다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '폭이 좁아져도 Trigger와 Content는 그대로 줄어든다' },
    ],
    verified: false,
  },
  {
    id: 'data-table',
    name: 'Data Table',
    aliases: ['데이터 테이블', '데이터 표', '정렬 가능한 표', '체크박스 표', 'sortable table', 'selectable table'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.13.0',
    changedIn: 'v0.13.0',
    purpose:
      '여러 행을 훑어보고 골라 한꺼번에 다루는 어드민 표다. 정렬·페이지 나눔·선택을 한 벌로 갖춰 목록 화면마다 그 셋을 다시 짜지 않게 한다. 세 상태 모두 비제어가 기본이고, 이름이 같은 prop을 주면 그때부터 부모가 쥔다.',
    anatomy: [
      {
        part: 'toolbar',
        label: 'Toolbar',
        note: 'toolbar prop이 있고 선택된 행이 하나 이상일 때만 나타난다. 선택 개수와 선택을 비우는 함수를 건네받아 대량 작업 버튼을 조립하는 자리다',
        optional: true,
      },
      {
        part: 'select-all-cell',
        label: 'Select-all cell',
        note: '머리 행 첫 칸의 Checkbox. 이름은 "이 페이지 전부 선택"이다 — 실제로 지금 페이지의 행만 선택하거나 해제하고 다른 페이지에서 고른 것은 건드리지 않는다. 지금 페이지에 행이 없으면 disabled된다',
        optional: true,
      },
      {
        part: 'sortable-header',
        label: 'Sortable header',
        note: 'sortValue를 준 열의 머리. 이름 전체가 button이 되어 누르면 없음 → 오름차순 → 내림차순 → 없음 순으로 돈다. 정렬 기준을 바꾸면 페이지도 1로 돌아간다',
      },
      {
        part: 'sort-indicator',
        label: 'Sort indicator',
        note: 'sortable-header 끝의 방향 아이콘(ChevronUp, 12px, aria-hidden). 내림차순이면 180도 돌고, 정렬되지 않은 열에서도 자리는 남아 opacity만 0이 된다 — 누를 때마다 머리 너비가 바뀌어 표가 튀는 것을 막는다',
      },
      {
        part: 'row',
        label: 'Row',
        note: '데이터 한 줄. 선택된 행은 Table의 selected 상태를 그대로 물려받아 bg-accent로 칠해진다',
      },
      {
        part: 'select-cell',
        label: 'Select cell',
        note: '행마다의 첫 칸. 이름은 첫 열의 글자와 숨긴 "행 선택" 문구를 이어 짓는다 — 첫 열이 아바타나 아이콘처럼 글자를 담지 않는 표에서도 이름 없는 컨트롤이 되지 않는다',
        optional: true,
      },
      {
        part: 'footer',
        label: 'Footer',
        note: 'Pagination을 담는 자리. 전체 건수·페이지당 건수와 이전·번호·다음 버튼을 보인다. 불러오는 중에는 내용을 비우고 버튼 하나 높이(h-control-sm)만큼 자리만 예약해 둔다',
      },
    ],
    properties: [
      {
        name: 'density',
        title: 'Density',
        description: 'Table의 density를 그대로 물려받는다. 여기서 새로 정하지 않는다.',
        display: 'row',
        options: [
          { value: 'compact', note: '행이 많은 목록·로그' },
          { value: 'default', note: '기본' },
        ],
      },
      {
        name: 'selection',
        title: 'Selection',
        description: '행마다 Checkbox를 두어 고를 수 있게 할지 정한다. selectable prop 하나가 이 축을 결정한다.',
        display: 'row',
        options: [
          { value: 'none', note: '기본. 선택 칸이 없다' },
          {
            value: 'multiple',
            note: '선택 칸이 생긴다. 머리의 체크박스는 이 페이지 전부를 뜻하고, 선택 자체는 getRowId로 매겨 두어 페이지를 넘어가도 남는다',
          },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description:
          '표 전체가 무엇을 보이는지 정한다. Table의 state(행 하나의 상호작용 상태)와는 다른 축이다 — DataTable은 표 전체를 그리므로 불러오는 중·빈 목록이 한 축의 값으로 나란히 놓인다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'loading', note: '행 자리에 Skeleton을 두고, 화면에 보이지 않는 문구로 불러오는 중임을 소리로도 알린다' },
          { value: 'empty', note: '머리는 남기고 몸에 EmptyState를 둔다. rows가 비어 있으면 state를 따로 주지 않아도 같은 화면이 된다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'label-names-the-region',
        title: '표마다 다른 이름을 준다',
        body: 'label은 필수 prop이다. 가로로 구르는 그릇이 role="region"이라 이름이 있어야 하는데, 그 표에 무엇이 들었는지는 부르는 쪽만 안다. 기본값을 두지 않은 것도 그래서다 — 한 화면의 표 둘이 같은 이름의 랜드마크가 되면 이름을 요구한 목적이 오류 하나 없이 사라진다.',
        do: ['"주문 내역"처럼 그 표가 무엇을 담는지, 같은 화면의 다른 표와 갈리는 이름을 준다'],
        dont: ["'표'나 '목록'처럼 어느 표에나 맞는 이름을 여러 표에 돌려쓰지 않는다"],
      },
      {
        id: 'header-checkbox-means-this-page',
        title: '머리 체크박스는 이 페이지만 뜻한다',
        body: '머리의 체크박스는 지금 페이지의 행만 선택하거나 해제한다. pageSelectionState가 지금 페이지의 id만 보기 때문이다 — 다른 페이지에서 고른 것은 건드리지 않는다. 선택한 개수는 selected 전체 집합의 크기이므로 페이지를 넘어가도 남는다.',
        do: ['선택 개수는 toolbar나 그 옆에서 전체 기준으로 보여준다'],
        dont: ["머리 체크박스를 눌러 '전체 선택'이 된다고 문구를 달지 않는다 — 이 페이지만이다"],
      },
      {
        id: 'sort-resets-to-first-page',
        title: '정렬을 바꾸면 페이지도 1로 돌아간다',
        body: '3페이지에서 정렬 머리를 누르면 페이지가 1로 돌아간다. 페이지에 머물면 방금 고른 기준의 맨 위가 아니라 이전 목록의 중간이 보인다.',
        do: ['제어 모드에서는 onSortChange와 함께 오는 onPageChange(1)을 그대로 받아 표시 페이지를 따라간다'],
        dont: ['정렬만 제어하고 페이지는 그대로 두어, 정렬 기준이 바뀌었는데 화면은 이전 페이지에 머물게 두지 않는다'],
      },
      {
        id: 'missing-value-sorts-last',
        title: '값이 없는 칸은 정렬 방향과 무관하게 끝으로 간다',
        body: 'sortValue가 null이나 undefined를 돌려준 행은 오름차순이든 내림차순이든 항상 끝에 놓인다. 없는 값은 작은 값이 아니라 값이 아니기 때문이다.',
        do: ['셀에 보일 값이 없으면 —로 밝혀 정렬에서 끝에 몰리는 이유를 짐작할 수 있게 한다'],
        dont: ['정렬 결과에서 빈 값을 맨 앞으로 보내려고 sortValue를 0이나 빈 문자열로 채우지 않는다'],
      },
      {
        id: 'sticky-select-cell-pins-with-columns',
        title: '선택 칸은 sticky 열과 함께 고정된다',
        body: 'selectable을 켜고 열 하나에 sticky를 주면 선택 칸도 함께 left-0에 고정되고, sticky 열은 그만큼(--spacing-control-lg) 오른쪽으로 밀린다. sticky 열이 하나도 없으면 선택 칸도 고정되지 않는다 — 그러면 가로로 구르는 즉시 선택 칸이 화면 왼쪽 밖으로 밀려나 체크박스에 손이 닿지 않고, 왼쪽 끝까지 되굴러야만 다시 닿는다.',
        do: ['가로로 구르는 넓은 표에 selectable을 켤 때는 첫 열에도 sticky를 준다 — 선택 칸은 DataTable이 함께 고정한다'],
        dont: ['넓은 표에 selectable만 켜고 sticky 열을 하나도 두지 않는다 — 선택 칸이 왼쪽 밖으로 밀려나 손이 닿지 않는다'],
      },
      {
        id: 'loading-is-announced',
        title: '불러오는 중임을 소리로도 알린다',
        body: 'Skeleton은 스스로 aria-hidden이라 접근성 트리에 아무것도 남기지 않는다. DataTable은 role="status"의 sr-only 문구로 "불러오는 중입니다"를 함께 전한다.',
        do: ['state를 loading으로 둘 때는 이 문구가 그대로 나가게 두고 따로 감추지 않는다'],
        dont: ['Skeleton만 두고 불러오는 중이라는 사실을 어디에도 소리로 남기지 않은 채 두지 않는다'],
      },
    ],
    usage: [
      {
        id: 'user-list',
        title: '사용자 목록',
        note: '이름 옆에 Avatar, 상태 칸에 Badge를 쓴다. 이름 열에 sortValue를 주면 가나다순으로 정렬할 수 있다',
      },
      { id: 'order-history', title: '주문 내역', note: '금액 열은 numeric으로 오른쪽 정렬하고, 상태는 Badge로 보인다' },
      { id: 'log', title: '로그', note: '시간순으로 쌓이는 단순한 표. perPage를 크게 두어 스크롤보다 페이지 이동을 줄인다' },
      {
        id: 'bulk-selection',
        title: '선택과 대량 작업',
        note: 'selectable을 켜고, toolbar에 선택한 개수에 따라 나타날 대량 작업 버튼을 준다',
      },
    ],
    cases: [
      {
        id: 'empty-list',
        title: '빈 목록',
        note: '머리는 남기고 몸에 EmptyState를 둔다. rows가 비어 있으면 state를 따로 주지 않아도 이 화면이 된다',
      },
      {
        id: 'no-filter-results',
        title: '필터 결과 없음',
        note: 'emptyContent로 기본 문구 대신 조건을 지우는 안내와 버튼을 넣을 수 있다',
      },
      {
        id: 'loading',
        title: '불러오는 중',
        note: '행 자리에 Skeleton을 최대 다섯 줄 두고, 화면에 보이지 않는 문구로 불러오는 중임을 함께 알린다',
      },
      {
        id: 'selection-across-pages',
        title: '선택 상태에서 페이지 이동',
        note: '선택은 getRowId로 매겨 두므로 페이지를 옮겨도 선택한 개수가 그대로 남는다',
      },
      {
        id: 'missing-value',
        title: '값이 없는 칸',
        note: '—로 밝히는 것은 cell을 쓰는 쪽의 몫이다. sortValue가 없는 값을 돌려주면 정렬 방향과 무관하게 그 행은 끝으로 간다',
      },
      {
        id: 'narrow-screen',
        title: '좁은 화면',
        note: '표가 가로로 구르고, sticky를 켠 열은 고정된 채 남는다. selectable까지 함께 켜면 선택 칸도 왼쪽에 고정되어 스크롤해도 손이 닿는다',
      },
    ],
    verified: false,
  },
  {
    id: 'description-list',
    name: 'Description List',
    aliases: ['정의 목록', '키값', '상세 정보', 'dl', 'definition list', '속성 목록'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '라벨과 값의 쌍을 나열해 상세 정보를 보인다. <dl>·<dt>·<dd>를 써 키와 값이라는 뜻을 마크업에 그대로 담는다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: '<dl>. columns가 격자의 열 수를 정한다',
      },
      {
        part: 'item',
        label: 'Item',
        note: '<dt>와 <dd>를 감싸는 <div>. 격자에서 한 칸을 차지하는 단위',
      },
      {
        part: 'term',
        label: 'Term',
        note: '<dt>. layout이 horizontal이면 왼쪽 고정 폭을 갖는다',
      },
      { part: 'detail', label: 'Detail', note: '<dd>' },
    ],
    properties: [
      {
        name: 'layout',
        title: 'Layout',
        description: '라벨을 위에 두고 값을 아래에 둘지, 라벨을 왼쪽 고정 폭에 두고 값을 오른쪽에 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'stacked', note: '라벨이 위, 값이 아래. 값이 길거나 폭이 좁을 때 쓴다' },
          { value: 'horizontal', note: '라벨이 왼쪽 고정 폭, 값이 오른쪽. 값이 짧을 때 훑어보기 좋다' },
        ],
      },
      {
        name: 'columns',
        title: 'Columns',
        description: '한 줄에 항목을 몇 개 늘어놓을지 정한다.',
        display: 'row',
        options: [{ value: 'one' }, { value: 'two' }, { value: 'three' }],
      },
    ],
    guidelines: [
      {
        id: 'short-labels',
        title: '라벨을 짧게 적는다',
        body: '라벨이 값보다 길면 훑어보는 눈이 값을 찾지 못합니다.',
        do: ['라벨을 한두 단어로 짧게 적는다'],
        dont: ['라벨이 값보다 길어지도록 풀어 쓰지 않는다'],
      },
      {
        id: 'no-empty-value',
        title: '값이 없으면 자리를 비우지 않는다',
        body: "항목을 지우거나 '—'를 넣습니다. 빈칸은 불러오는 중인지 값이 없는 것인지 알려주지 않습니다.",
        do: ["값이 없으면 항목을 지우거나 '—'를 넣는다"],
        dont: ['값이 없다고 빈 dd를 그대로 두지 않는다'],
      },
      {
        id: 'meaningful-order',
        title: '순서에 뜻을 담는다',
        body: '자주 보는 것을 위에 둡니다. 데이터베이스의 열 순서를 그대로 옮기지 않습니다.',
        do: ['자주 확인하는 항목을 위에 둔다'],
        dont: ['데이터베이스의 열 순서를 그대로 옮기지 않는다'],
      },
    ],
    usage: [
      { id: 'detail-basic-info', title: '상세 화면의 기본 정보', note: '상세 화면 상단에서 핵심 값을 나열한다' },
      { id: 'dialog-confirmation', title: 'Dialog 안의 확인 정보', note: '실행하기 전에 확인할 값을 나열한다' },
      { id: 'card-summary', title: '카드 안 요약', note: 'Card 안에서 관련 값을 간추려 보인다' },
      { id: 'table-expanded-row', title: '표의 펼친 행', note: '표의 한 행을 펼쳤을 때 나머지 값을 보인다' },
    ],
    cases: [
      { id: 'very-long-value', title: '값이 아주 긴 경우', note: '긴 값은 줄바꿈되어 다음 줄로 이어진다' },
      { id: 'no-value', title: '값이 없는 경우', note: "값이 없으면 호출하는 쪽이 '—'를 넣는다" },
      { id: 'badge-value', title: '값이 Badge인 경우', note: 'dd 안에 Badge를 그대로 놓는다' },
      {
        id: 'narrow-screen',
        title: '좁은 화면',
        note: 'layout이 horizontal이고 columns가 three이면 한 칸이 좁아져 라벨 자리가 부족해진다',
      },
    ],
    verified: false,
  },
  {
    id: 'scroll-area',
    name: 'Scroll Area',
    aliases: ['스크롤 영역', '스크롤바', 'scrollbar', '스크롤', '넘치는 내용'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose:
      '브라우저의 기본 스크롤바는 운영체제마다 다르게 생기고 다크 모드에서 색이 따라오지 않는다. Radix가 그 자리에 자기 스크롤바를 그려 토큰으로 칠할 수 있게 한다. 굴리는 일 자체는 브라우저가 그대로 한다.',
    anatomy: [
      { part: 'viewport', label: 'Viewport', note: '실제로 넘치고 굴러가는 자리. 부모가 준 크기 안에서만 동작한다' },
      { part: 'content', label: 'Content', note: 'Viewport 안에 놓이는 내용' },
      { part: 'scrollbar', label: 'Scrollbar', note: '방향마다 하나. hover면 마우스가 올라왔을 때만 보인다' },
      { part: 'thumb', label: 'Thumb', note: 'Scrollbar 안에서 움직이는 막대. bg-muted-foreground로 칠한다 — bg-border는 실측 대비가 1.2:1 안팎이라 트랙 뒤 배경과 사실상 구분되지 않았다' },
    ],
    properties: [
      {
        name: 'orientation',
        title: 'Orientation',
        description: '어느 쪽으로 넘치는 내용을 굴릴지 정한다.',
        display: 'row',
        options: [
          { value: 'vertical', note: '기본. 세로로 넘치는 목록' },
          { value: 'horizontal', note: '가로로 넓은 표' },
          { value: 'both', note: '넓고 긴 표. 스크롤바 둘이 모서리에서 만난다' },
        ],
      },
      {
        name: 'visibility',
        title: 'Visibility',
        description: '스크롤바를 언제 보일지 정한다. Radix의 type prop 중 이 시스템이 쓰는 두 값이다.',
        display: 'row',
        options: [
          { value: 'hover', note: '기본. 마우스가 올라왔을 때만 보인다' },
          { value: 'always', note: '늘 보인다. 굴러간다는 사실 자체가 중요한 자리' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'fixed-size-only',
        title: '높이나 너비를 정한 자리에만 쓴다',
        body: '스크롤 영역은 자기 크기를 스스로 정하지 않는다. 부모가 크기를 주지 않으면 아무것도 굴러가지 않고 내용이 그대로 늘어난다.',
        do: ['h-40처럼 높이를 정한 상자 안에 놓는다'],
        dont: ['크기를 주지 않은 채로 놓아 내용이 그대로 늘어나게 하지 않는다'],
      },
      {
        id: 'dont-wrap-whole-page',
        title: '페이지 전체를 감싸지 않는다',
        body: '브라우저의 스크롤을 대신하면 브라우저가 되돌려 주던 스크롤 위치가 사라진다.',
        do: ['Sheet의 본문, 카드 안의 목록처럼 크기가 정해진 자리에만 쓴다'],
        dont: ['main이나 페이지 전체를 ScrollArea로 감싸지 않는다'],
      },
      {
        id: 'show-horizontal-cutoff',
        title: '가로로 잘린다는 것을 보인다',
        body: '가로 스크롤은 세로보다 알아채기 어렵다. 오른쪽 끝에 그림자나 흐림을 두어 더 있다는 것을 알린다.',
        do: ['넓은 표의 오른쪽 끝에 그림자를 두어 더 있다는 것을 알린다'],
        dont: ['가로로 잘린 표를 아무 신호 없이 그대로 두지 않는다'],
      },
      {
        id: 'set-always-visible-when-it-matters',
        title: '늘 보일 자리를 정한다',
        body: "hover로 두면 마우스가 없는 화면에서 '더 있다'는 신호가 사라진다. 목록이 굴러간다는 사실 자체가 중요한 자리에는 always를 쓴다.",
        do: ['목록이 굴러간다는 사실 자체가 중요한 자리에는 visibility를 always로 둔다'],
        dont: ["always가 필요한 자리에 기본값인 hover를 그대로 두어 신호를 놓치지 않는다"],
      },
      {
        id: 'choose-over-scrollbar-none',
        title: '막대만 감출지 새로 그릴지 가른다',
        body: 'src/styles/tokens.css의 scrollbar-none은 막대만 감추고 스크롤은 그대로 둔다. ScrollArea는 반대로 막대를 감추는 대신 Radix가 새로 그린 막대로 바꾼다 — 그 자리에 스크롤이 있다는 사실 자체를 보여야 하는지가 둘을 가른다.',
        do: [
          '막대가 안 보여도 그만인 자리(예: 페이지 전체를 감싸는 main)에는 scrollbar-none을 쓴다',
          '작은 상자 안에서 더 있다는 것 자체를 알려야 하는 자리에는 ScrollArea를 쓴다',
        ],
        dont: ['다크 모드에서 기본 막대 색이 안 맞는다는 이유만으로 scrollbar-none을 골라 스크롤 신호 자체를 지우지 않는다'],
      },
      {
        id: 'keyboard-focus-path',
        title: '포커스 가능한 요소로 통로를 만든다',
        body: 'Radix는 Viewport에 tabIndex를 주지 않는다. 그래도 내용이 실제로 넘치면 브라우저가 스크롤 컨테이너 자체를 포커스 가능한 자리로 다뤄 Tab으로 닿기도 한다(Chrome 127+). 다만 넘치지 않는 상자는 그 대상이 아니고 이 동작을 아직 하지 않는 브라우저도 있어, 이 길에만 기대면 어디서 통할지가 갈린다. 안에 링크·버튼·입력처럼 포커스를 받는 요소를 두면 그것이 어디서나 통로가 되어, 거기서부터 방향키로 나머지를 훑을 수 있다.',
        do: [
          '안에 최소 하나는 포커스 가능한 요소(버튼·링크·입력)를 두어 브라우저를 가리지 않는 키보드 통로를 만든다',
          '포커스 가능한 요소가 전혀 없는 순수 텍스트라면, 이 상자에 키보드로 닿을지가 브라우저와 넘침 여부에 달린다는 것을 알고 쓴다',
        ],
      },
    ],
    usage: [
      { id: 'sheet-body', title: 'Sheet의 본문', note: '머리와 발을 고정하고 본문만 굴린다' },
      { id: 'popover-list', title: '긴 목록이 든 Popover', note: 'Popover 안에서 목록만 따로 굴린다' },
      { id: 'wide-table', title: '넓은 표', note: '열이 많은 표를 가로로 굴린다' },
      { id: 'log-viewer', title: '로그 보기', note: '길게 이어지는 로그를 정해진 높이 안에서 굴린다' },
    ],
    cases: [
      { id: 'short-content', title: '내용이 짧은 경우', note: '넘치지 않으면 스크롤바 자체가 나오지 않는다' },
      { id: 'both-directions', title: '가로·세로 둘 다 넘치는 경우', note: '스크롤바 둘이 모서리에서 Corner로 만난다' },
      { id: 'always-visible', title: '스크롤바를 늘 보이는 경우', note: 'visibility가 always면 마우스와 무관하게 보인다' },
      { id: 'narrow-screen', title: '좁은 화면', note: 'w-full max-w-*로 두어 폭이 줄어들어도 상자가 따라 줄어든다' },
    ],
    verified: false,
  },
  {
    id: 'separator',
    name: 'Separator',
    aliases: ['구분선', '디바이더', 'divider', 'hr', '선'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose: '가로 또는 세로로 선을 그어 화면의 영역을 나눈다. 기본은 장식이므로 뜻이 있는 경계에서만 decorative를 거짓으로 둔다.',
    anatomy: [],
    properties: [
      {
        name: 'orientation',
        title: 'Orientation',
        description: '선을 가로로 그을지 세로로 그을지 정한다.',
        display: 'row',
        options: [{ value: 'horizontal' }, { value: 'vertical' }],
      },
    ],
    guidelines: [
      {
        id: 'meaningful-vs-decorative',
        title: '뜻이 있는 경계와 장식을 구별한다',
        body: '메뉴에서 성격이 다른 묶음을 가르는 선은 뜻이 있고, 카드 안 구획을 나누는 선은 장식입니다. 스크린 리더가 읽어야 하는 것은 앞의 것뿐입니다.',
        do: ['성격이 다른 동작 묶음의 경계에는 decorative를 거짓으로 둔다'],
        dont: ['카드 안 구획처럼 장식으로 쓰는 선에 decorative를 거짓으로 두지 않는다'],
      },
      {
        id: 'no-line-when-spacing-suffices',
        title: '여백으로 충분하면 선을 긋지 않는다',
        body: '간격이 이미 묶음을 말하고 있으면 선은 잡음입니다.',
        do: ['넉넉한 간격만으로 구획을 나눌 수 있는지 먼저 살핀다'],
        dont: ['이미 여백이 구획을 나누고 있는데 선을 더하지 않는다'],
      },
      {
        id: 'not-between-every-item',
        title: '목록의 모든 항목 사이에 긋지 않는다',
        body: '선이 많아지면 각각의 뜻이 사라집니다.',
        do: ['성격이 다른 묶음 사이에만 선을 긋는다'],
        dont: ['목록의 항목마다 선을 넣지 않는다'],
      },
    ],
    usage: [
      { id: 'card-section', title: '카드 안의 구획', note: '테두리 있는 상자 안에서 서로 다른 정보 구획을 나눈다' },
      { id: 'menu-group', title: '메뉴 항목 묶음 사이', note: '성격이 다른 동작 묶음의 경계를 알린다' },
      { id: 'toolbar-group', title: '툴바의 동작 묶음 사이', note: '관련 있는 동작끼리 묶는다' },
      { id: 'form-section', title: '폼의 구획', note: '입력 항목이 많은 폼에서 구획을 나눈다' },
    ],
    cases: [
      { id: 'vertical-height', title: '세로 구분선의 높이', note: '부모가 높이를 정해야 세로 구분선이 보인다' },
      { id: 'spacing-sufficient', title: '여백만으로 충분한 경우', note: '선 없이 간격만으로 구획을 나눈다' },
      { id: 'asymmetric-margin', title: '양옆 여백이 다른 경우', note: '툴바처럼 시작 여백과 끝 여백이 다르게 그어진다' },
    ],
    verified: false,
  },
  {
    id: 'table',
    name: 'Table',
    aliases: ['테이블', '표', '목록', 'grid', 'list'],
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '어드민의 중심 화면이다. 여러 행의 데이터를 칸으로 나누어 보이고, 정렬 가능한 열은 이름을 누르는 단추로, 지금 방향은 aria-sort로 드러낸다. 다음 방향을 고르는 일은 호출하는 쪽의 몫이다.',
    anatomy: [
      { part: 'header', label: 'Header', note: 'bg-surface. 열 이름을 담는 행. text-xs font-bold' },
      { part: 'row', label: 'Row', note: '높이는 density가 정한다 — --spacing-row 또는 --spacing-row-compact' },
      { part: 'cell', label: 'Cell', note: 'text-sm. 숫자 칸은 text-right에 tabular-nums' },
      {
        part: 'select-cell',
        label: 'Select cell',
        note: 'Checkbox를 그대로 재사용한다',
        optional: true,
      },
      {
        part: 'sort-indicator',
        label: 'Sort indicator',
        note: '정렬 가능한 열 이름 옆의 방향 아이콘. TableHead의 sortable을 켜면 이름이 단추가 되어 누를 수 있게 되고, aria-sort로 지금 방향을 알린다 — 다음 방향을 정해 sortDirection으로 넘기는 것은 호출하는 쪽이다',
        optional: true,
      },
    ],
    /*
     * 설계 문서는 state에 loading·empty를 함께 두었지만 코드로 옮기며
     * 걷어냈다. default·hover·selected는 행 하나의 상호작용 상태라
     * 격자 한 칸에 행 하나를 두면 그대로 보인다. loading과 empty는
     * 행이 아니라 표 전체가 행 대신 무엇을 채우는지의 문제라 같은
     * 격자에서 '한 축만 바꾼' 비교가 되지 않는다 — 격자 옆 칸은
     * 여전히 행 하나인데 이 칸만 표 전체가 스켈레톤이나 빈 상태로
     * 바뀌어 버린다. 설계 문서의 Cases에도 이미 '빈 목록'·'불러오는
     * 중'이 예외 상황으로 따로 있으므로, 그 자리에서 표 전체를 실제
     * 크기로 보인다 — 격자 한 칸보다 표 전체를 보여주는 자리가
     * 정직하다. 같은 이유로 '빈 상태'도 anatomy 부위 목록에 두지
     * 않는다 — 행이 있는 인스턴스와 함께 보일 수 없으니 부위가
     * 아니라 상태다(Avatar의 image·fallback과 반대로, 이쪽은 상태
     * 쪽을 anatomy에서 뺐다).
     */
    properties: [
      {
        name: 'density',
        title: 'Density',
        description: 'Foundations의 Spacing이 정한 밀도 축이다. 행 높이를 --spacing-row 계열 토큰으로 정한다.',
        display: 'row',
        options: [
          { value: 'compact', note: '행이 많은 표. 목록·로그' },
          { value: 'default', note: '기본. 담당자 사진처럼 세로 공간이 필요한 칸이 있을 때' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '행 하나의 상호작용 상태를 나타낸다. loading·empty는 행이 아니라 표 전체의 모습이라 이 축에 두지 않는다 — Cases에서 표 전체로 본다.',
        display: 'grid',
        options: [
          { value: 'default' },
          { value: 'selected', note: 'Checkbox로 고른 행. bg-accent' },
          { value: 'hover', note: '포인터가 올라간 동안. 배경으로 나타낸다 — 행은 면이지 테두리 있는 컨트롤이 아니다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'numeric-align',
        title: 'Numeric alignment',
        body: '숫자는 오른쪽으로 정렬합니다. 자릿수가 다른 값도 한눈에 크기를 비교할 수 있습니다.',
        do: ['금액·개수 같은 숫자 칸은 text-right로 정렬한다'],
        dont: ['숫자 칸을 글자 칸과 같은 왼쪽 정렬로 두지 않는다'],
      },
      {
        id: 'clickable-row-affordance',
        title: 'Clickable row affordance',
        body: '행 전체를 누를 수 있게 하려면 그 사실을 보입니다. 커서만 바뀌면 상세 화면으로 이동하는지 알기 어렵습니다.',
        do: ['행 hover에서 배경이 바뀌는 것 외에 화살표 같은 이동 표시를 함께 둔다'],
        dont: ['아무 표시 없이 행 전체를 누르면 다른 화면으로 이동하게 하지 않는다'],
      },
      {
        id: 'horizontal-scroll-fixed-column',
        title: 'Horizontal scroll, fixed column',
        body: '열이 화면보다 넓으면 표 안에서 가로로 스크롤하고 첫 열은 고정합니다. 스크롤하는 동안에도 어느 행인지 놓치지 않아야 합니다.',
        do: ['첫 열에 sticky를 켜 가로로 스크롤해도 행을 식별할 수 있게 한다'],
        dont: ['첫 열까지 함께 흘러가게 두어 스크롤하면 어느 행인지 알 수 없게 하지 않는다'],
      },
    ],
    usage: [
      { id: 'user-list', title: '사용자 목록', note: '이름 옆에 Avatar, 상태 칸에 Badge를 쓴다' },
      { id: 'order-history', title: '주문 내역', note: '금액은 오른쪽 정렬, 상태는 Badge로 보인다' },
      { id: 'log', title: '로그', note: '시간순으로 쌓이는 단순한 표. 꾸밈 없이 글자만 나열한다' },
      {
        id: 'bulk-selection',
        title: '선택과 대량 작업',
        note: 'Checkbox로 고르고, 선택 개수와 대량 작업을 위에, Pagination을 아래에 둔다',
      },
    ],
    cases: [
      { id: 'empty-list', title: '빈 목록', note: '머리는 남기고 본문에 안내 문구 한 줄을 둔다' },
      { id: 'loading', title: '불러오는 중', note: '행 자리에 스켈레톤을 두어 곧 채워질 것을 알린다' },
      { id: 'missing-value', title: '값이 없는 칸', note: '빈칸으로 두지 않고 —로 값이 없음을 밝힌다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '표 안에서 가로로 스크롤되고 첫 열은 고정된 채 남는다' },
    ],
    verified: true,
  },
  {
    id: 'alert',
    name: 'Alert',
    aliases: ['경고', '배너', 'banner', 'notice', '안내'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '화면에 머무르는 알림을 보인다. 잠깐 나타났다 사라져도 되면 Toast를 쓴다.',
    anatomy: [
      { part: 'icon', label: 'Icon', note: '16×16, variant가 정하는 색을 그대로 물려받는다' },
      { part: 'title', label: 'Title', note: 'text-sm / font-medium' },
      { part: 'body', label: 'Body', note: 'text-muted-foreground / text-sm', optional: true },
      { part: 'action', label: 'Action', note: 'Button을 그대로 재사용한다', optional: true },
      { part: 'dismiss', label: 'Dismiss', note: '닫기 버튼. 16×16', optional: true },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '상태의 뜻을 정한다. Badge와 같은 상태 색 체계를 쓴다.',
        display: 'row',
        options: [
          { value: 'info', note: '사용자의 행동과 무관한 사실. 점검 예정, 새 기능' },
          { value: 'success', note: '요청이 끝나고 더 할 일이 없음. 저장 완료' },
          { value: 'warning', note: '그대로 두면 문제가 됨. 만료 임박' },
          { value: 'destructive', note: '되돌릴 수 없거나 실패함. 삭제 불가, 오류' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '본문과 동작을 함께 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'title-only', note: '제목만으로 뜻이 통할 때' },
          { value: 'with-body', note: '기본. 제목 아래에 설명을 더한다' },
          { value: 'with-action', note: '사용자가 바로 할 수 있는 일이 있을 때' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'alert-vs-toast',
        title: 'Alert vs toast',
        body: 'Alert와 Toast를 바꿔 쓰지 않습니다. 화면에 계속 보여야 하면 Alert, 사용자가 놓쳐도 되는 일시적 알림이면 Toast입니다.',
        do: ['화면에 머물러야 하는 정보에는 Alert를 쓴다', '잠깐 알리고 사라져도 되는 정보에는 Toast를 쓴다'],
        dont: ['사용자가 반드시 봐야 하는 정보를 Toast로 흘려보내지 않는다'],
      },
      {
        id: 'color-alone',
        title: 'Color alone',
        body: '색만으로 뜻을 전하지 않습니다. 제목 문구가 구체적이어야 하고, 색은 그것을 강조할 뿐입니다.',
        do: ['제목에 무엇이 문제인지 구체적으로 적는다', '색과 아이콘, 문구를 함께 쓴다'],
        dont: ["'문제가 발생했습니다'처럼 색에만 기대는 막연한 제목을 쓰지 않는다"],
      },
      {
        id: 'include-action-when-actionable',
        title: 'Include action when actionable',
        body: '사용자가 할 수 있는 일이 있으면 동작을 둡니다. 문제를 알리기만 하고 다음 걸음을 두지 않으면 사용자가 스스로 찾아야 합니다.',
        do: ['해결할 수 있는 문제면 동작 버튼을 함께 둔다'],
        dont: ['사용자가 할 수 있는 일이 있는데 동작 없이 알리기만 하지 않는다'],
      },
      {
        id: 'no-stacking',
        title: 'No stacking',
        body: '한 화면에 여러 개를 쌓지 않습니다. 알림이 늘어설수록 어느 것부터 봐야 할지 알 수 없게 됩니다.',
        do: ['가장 중요한 알림 하나만 남긴다'],
        dont: ['같은 화면에 Alert를 여러 개 쌓아두지 않는다'],
      },
      {
        id: 'live-announcement',
        title: 'Live announcement',
        body: "live prop이 role을 정합니다. 기본값 'off'는 role을 두지 않고, 'assertive'는 alert 역할, 'polite'는 status 역할을 얹습니다. Alert 대부분은 화면에 계속 머무르는 정적인 배너라 실시간 알림이 필요 없습니다.",
        do: ["사용자의 행동 직후 결과를 즉시 알려야 할 때만 'assertive'나 'polite'를 켠다"],
        dont: ['권한 안내·점검 공지처럼 계속 머무르는 배너에 live를 켜 스크린 리더의 흐름을 끊지 않는다'],
      },
    ],
    usage: [
      { id: 'save-result', title: '저장 결과', note: '성공했을 때 화면 위쪽에 보인다. live="assertive"로 즉시 알린다' },
      { id: 'permission-notice', title: '권한 안내', note: '해당 기능을 쓸 수 없는 이유를 알린다' },
      { id: 'expiry-notice', title: '만료 예고', note: '만료 전에 무엇을 해야 하는지 알린다' },
      { id: 'maintenance-notice', title: '점검 공지', note: '점검 시간과 영향 범위를 알린다' },
    ],
    cases: [
      { id: 'long-body', title: '본문이 긴 경우', note: '줄바꿈되고 제목과 왼쪽 정렬을 맞춘다' },
      {
        id: 'multiple-actions',
        title: '동작이 둘 이상인 경우',
        note: '주요 동작을 먼저 두고 나머지는 낮은 위계로 둔다',
      },
      { id: 'inside-list', title: '목록 안에 놓이는 경우', note: '항목마다 두지 않고 목록 위에 하나만 둔다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '아이콘과 텍스트가 줄바꿈되어도 정렬은 유지된다' },
    ],
    verified: true,
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    aliases: ['경고 대화상자', '확인 대화상자', '삭제 확인', 'confirm', '확인창'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose: '되돌릴 수 없는 동작을 실행하기 전에 취소와 실행 중 하나를 고르게 한다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '누르면 화면 전체를 덮는 반투명 덮개(bg-black/50)와 가운데 정렬된 컨테이너(bg-background, 테두리, radius-lg, shadow-lg)가 뜬다. 컨테이너 안은 제목(text-lg font-semibold)·본문(text-sm text-muted-foreground)·오른쪽 정렬된 취소·실행 버튼 순서로 쌓이고, Dialog와 달리 닫기(X) 아이콘이 없다 — 나가는 길은 취소 버튼 하나다. 바깥을 눌러도 닫히지 않고 접근성 트리에서 alertdialog로 읽힌다(설치한 패키지의 소스로 확인). 쌓임 순서는 z-overlay. 컨테이너는 화면 전체를 덮어 구조도 무대 안에 담을 수 없으므로 나머지 부위는 Usage에서 실제로 눌러서 본다',
      },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '되돌릴 수 없는 동작인지에 따라 실행 버튼의 색과 제목의 문구가 달라진다.',
        display: 'row',
        options: [
          { value: 'default', note: '되돌릴 수 있지만 한 번 물어야 하는 동작' },
          { value: 'destructive', note: '삭제처럼 되돌릴 수 없는 동작. 실행 버튼이 destructive 색을 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'distinguish-dialog',
        title: 'Distinguish from Dialog',
        body: '잃을 것이 있으면 Alert Dialog입니다. 바깥을 눌러도 닫히지 않고, 나가는 길이 취소 하나뿐입니다.',
        do: ['되돌릴 수 없는 동작을 확인할 때 Alert Dialog를 쓴다'],
        dont: ['묻고 답하면 그만인 상호작용에 Alert Dialog를 쓰지 않는다(Dialog를 쓴다)'],
      },
      {
        id: 'paired-actions',
        title: 'Paired actions',
        body: '동작을 반드시 쌍으로 둡니다. 취소와 실행 둘입니다. 닫기 X를 두지 않습니다 — X는 취소인지 그냥 닫기인지 말하지 않습니다.',
        do: ['취소와 실행 버튼을 항상 함께 둔다'],
        dont: ['닫기 X 아이콘으로 나가는 길을 하나 더 만들지 않는다'],
      },
      {
        id: 'specific-title',
        title: 'Specific title',
        body: "제목에 무엇이 일어나는지 적습니다. '정말 실행하시겠습니까'만으로는 무엇이 사라지는지 알 수 없습니다.",
        do: ["'게시글 12건을 삭제하시겠습니까'처럼 대상과 개수를 제목에 밝힌다"],
        dont: ["'정말 실행하시겠습니까'처럼 대상 없이 묻지 않는다"],
      },
      {
        id: 'not-for-reversible',
        title: 'Not for reversible actions',
        body: '되돌릴 수 있는 동작에는 쓰지 않습니다. 되돌릴 수 있으면 묻지 말고 실행한 뒤 Toast에 되돌리기를 둡니다. 묻는 단계와 되돌리는 단계를 둘 다 두면 확인이 소음이 됩니다.',
        do: ['되돌릴 수 있는 동작은 바로 실행하고 Toast로 되돌리기를 제공한다'],
        dont: ['되돌릴 수 있는 동작까지 Alert Dialog로 한 번 더 묻지 않는다'],
      },
    ],
    usage: [
      { id: 'delete-confirm', title: '삭제 확인', note: '무엇이 지워지는지 제목에 밝히고 destructive 색을 쓴다' },
      {
        id: 'discard-changes',
        title: '저장하지 않은 변경 버리기',
        note: '나가면 입력한 내용을 잃는다는 사실을 본문에 적는다',
      },
      { id: 'revoke-permission', title: '권한 회수', note: '누구의 어떤 권한이 사라지는지 제목에 밝힌다' },
      { id: 'bulk-confirm', title: '대량 작업 확인', note: '몇 건에 어떤 일이 일어나는지 본문에 적는다' },
    ],
    cases: [
      { id: 'irreversible', title: '되돌릴 수 없는 경우', note: '실행 버튼이 destructive 색을 쓰고 제목이 대상을 밝힌다' },
      { id: 'action-failed', title: '실행이 실패한 경우', note: '닫지 않고 다시 시도할 수 있게 둔다' },
      { id: 'long-body', title: '본문이 긴 경우', note: '컨테이너는 늘어나지 않고 본문 안에서 세로로 스크롤된다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '가장자리에 여백을 두고 너비를 채운다' },
    ],
    verified: false,
  },
  {
    id: 'dialog',
    name: 'Dialog',
    aliases: ['모달', '팝업', 'modal', 'popup', '확인창'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '흐름을 멈추고 확인이나 입력을 받는다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '누르면 화면 전체를 덮는 반투명 덮개(bg-black/50)와 가운데 정렬된 컨테이너(bg-background, 테두리, radius-lg, shadow-lg)가 뜬다. 컨테이너 안은 제목(text-lg font-semibold)·본문(text-sm text-muted-foreground)·오른쪽 정렬된 동작 버튼 순서로 쌓이고, 오른쪽 위 모서리에 닫기(X) 아이콘이 항상 있다. 쌓임 순서는 z-overlay. 컨테이너는 화면 전체를 덮어 구조도 무대 안에 담을 수 없으므로 나머지 부위는 Usage에서 실제로 눌러서 본다',
      },
    ],
    /*
     * size는 DialogContent에만 붙는데 DialogContent는 Portal 안에서
     * 열려야만 DOM에 있다. Tooltip이 side를, Select·Dropdown Menu가
     * open·align을 뺀 것과 같은 이유로 properties에 두지 않는다 —
     * 닫힌 트리거는 size가 무엇이든 같아 보여 Properties의 세 칸이
     * 똑같은 버튼만 남긴다. size prop 자체는 컴포넌트에 그대로 있고,
     * sm·default·lg 세 값 모두 Usage에서 실제로 열어 확인한다
     * (짧은 입력·상세 미리보기·대량 작업 확인).
     */
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '되돌릴 수 없는 동작인지에 따라 실행 버튼의 색과 제목의 문구가 달라진다.',
        display: 'row',
        options: [
          { value: 'default', note: '확인이나 입력처럼 되돌릴 수 있는 동작' },
          { value: 'destructive', note: '삭제처럼 되돌릴 수 없는 동작. 실행 버튼이 destructive 색을 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'action-order',
        title: 'Action order',
        body: '오른쪽에 실행, 왼쪽에 취소를 둡니다. 눈이 마지막에 닿는 자리에 지금 진행 중인 동작을 끝맺는 버튼을 놓습니다.',
        do: ['실행 버튼을 오른쪽 끝에 둔다', '취소나 닫기는 그 왼쪽에 둔다'],
        dont: ['실행 버튼을 왼쪽에 두고 취소를 오른쪽에 두지 않는다'],
      },
      {
        id: 'destructive-title',
        title: 'Destructive title',
        body: "위험한 동작은 무엇이 지워지는지 제목에 적습니다. '정말 삭제하시겠습니까'만으로는 무엇이 사라지는지 알 수 없습니다.",
        do: ["'게시글 12건을 삭제하시겠습니까'처럼 대상을 제목에 밝힌다"],
        dont: ["'정말 삭제하시겠습니까'처럼 대상 없이 묻지 않는다"],
      },
      {
        id: 'outside-click',
        title: 'Outside click',
        body: '바깥을 눌러 닫는 것은 잃을 것이 없을 때만 허용합니다. 입력 중인 폼이 있으면 실수로 닫혀 내용을 잃을 수 있습니다.',
        do: ['확인만 하는 Dialog는 바깥 클릭으로 닫히게 둔다'],
        dont: ['입력 중인 폼이 있는 Dialog를 바깥 클릭 한 번으로 닫히게 두지 않는다'],
      },
    ],
    usage: [
      { id: 'delete-confirm', title: '삭제 확인', note: '무엇이 지워지는지 제목에 밝히고 destructive 색을 쓴다' },
      { id: 'short-input', title: '짧은 입력', note: '필드 한둘만 있는 폼은 sm이나 default로 충분하다' },
      { id: 'detail-preview', title: '상세 미리보기', note: '목록을 벗어나지 않고 항목의 내용을 확인한다' },
      { id: 'bulk-confirm', title: '대량 작업 확인', note: '몇 건에 어떤 일이 일어나는지 본문에 적는다' },
    ],
    cases: [
      { id: 'long-body', title: '본문이 긴 경우', note: '컨테이너는 늘어나지 않고 본문 안에서 세로로 스크롤된다' },
      { id: 'form-inside', title: '안에 폼이 있는 경우', note: '바깥 클릭으로 닫히지 않고 취소 버튼으로만 닫힌다' },
      { id: 'stacked-dialogs', title: '겹쳐 열리는 경우', note: '안쪽 Dialog가 위에 쌓이고 닫으면 바깥 Dialog로 돌아간다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '가장자리에 여백을 두고 너비를 채운다' },
    ],
    verified: true,
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    aliases: ['빈 상태', '빈 화면', '결과 없음', 'empty', 'no data', '데이터 없음'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '표나 목록에 보일 내용이 없을 때 무엇이 없는지, 왜 없는지, 무엇을 할 수 있는지 안내한다. 아직 만든 것이 없는 것과 불러오지 못한 것을 variant로 구별한다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: 'Icon·Title·Description·Action을 세로로 가운데 정렬해 담는다',
      },
      {
        part: 'icon',
        label: 'Icon',
        note: '어떤 아이콘을 넣을지는 호출하는 쪽이 정한다. variant는 색과 배경만 정한다',
      },
      { part: 'title', label: 'Title', note: '무엇이 없는지 한 줄로 적는다' },
      { part: 'description', label: 'Description', note: '왜 없는지와 무엇을 할 수 있는지 적는다' },
      {
        part: 'action',
        label: 'Action',
        note: '할 수 있는 일이 있을 때만 둔다',
        optional: true,
      },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '상황에 따라 아이콘의 색과 배경을 정한다. 무엇이 다른지는 문구가 말한다.',
        display: 'grid',
        options: [
          { value: 'empty', note: '아직 만든 것이 없는 첫 방문의 빈 상태. 오류가 아니다' },
          {
            value: 'no-results',
            note: "검색이나 필터 결과가 없는 경우. 'empty'와 같은 색을 쓴다 — 둘 다 오류가 아니다",
          },
          { value: 'error', note: '불러오기에 실패한 경우' },
          { value: 'no-permission', note: '권한이 없어 접근할 수 없는 경우' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '표 안이나 카드 안처럼 자리가 좁은 곳에서는 compact를 쓴다.',
        display: 'row',
        options: [
          { value: 'default' },
          { value: 'compact', note: '아이콘이 작아지고 위아래 여백이 준다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'distinguish-empty-error',
        title: '비어 있는 것과 실패한 것을 구별한다',
        body: '아직 만든 것이 없는 것과 불러오지 못한 것은 사용자가 할 일이 다릅니다.',
        do: ["아직 없으면 'empty', 불러오지 못했으면 'error'를 쓴다"],
        dont: ['상황에 맞지 않는 variant로 실제로 일어난 일을 감추지 않는다'],
      },
      {
        id: 'action-when-possible',
        title: '할 수 있는 일이 있으면 동작을 둔다',
        body: '필터를 지우거나, 새로 만들거나, 다시 시도하는 것입니다. 없다면 두지 않습니다.',
        do: ['사용자가 실제로 할 수 있는 일만 Action으로 둔다'],
        dont: ['할 수 있는 일이 없는데도 누를 것을 남겨 두지 않는다'],
      },
      {
        id: 'first-visit-not-error',
        title: '첫 방문의 빈 상태는 안내이지 오류가 아니다',
        body: '경고 색을 쓰지 않고 무엇을 할 수 있는지 알립니다.',
        do: ["첫 방문의 빈 상태는 'empty'의 무채색을 쓴다"],
        dont: ['아직 아무 일도 일어나지 않은 상태에 경고·오류 색을 쓰지 않는다'],
      },
      {
        id: 'writing-order',
        title: '무엇이 · 왜 · 무엇을 할 수 있는지 순서로 적는다',
        body: "Foundations의 Writing이 정한 순서입니다.",
        do: ['무엇이 없는지를 Title에, 왜와 무엇을 할 수 있는지를 Description에 순서대로 적는다'],
        dont: ['할 일부터 적고 무엇이 없는지를 뒤에 붙이지 않는다'],
      },
    ],
    usage: [
      { id: 'empty-table', title: '표에 행이 없을 때', note: '데이터가 아직 없는 표에서 빈 행 대신 이 상태를 보인다' },
      {
        id: 'no-search-results',
        title: '검색 결과가 없을 때',
        note: '검색어나 필터에 맞는 결과가 없을 때 다른 조건을 시도하도록 안내한다',
      },
      { id: 'permission-wall', title: '권한이 없을 때', note: '접근 권한이 없는 화면에서 무엇을 요청해야 하는지 안내한다' },
      {
        id: 'load-failed',
        title: '불러오기에 실패했을 때',
        note: '네트워크나 서버 오류로 데이터를 불러오지 못했을 때 다시 시도하도록 안내한다',
      },
    ],
    cases: [
      { id: 'no-action', title: '동작이 없는 경우', note: '사용자가 할 수 있는 일이 없으면 Action을 두지 않는다' },
      { id: 'in-table', title: '표 안에 놓이는 경우', note: '표 안에서는 size를 compact로 두어 자리를 줄인다' },
      { id: 'two-actions', title: '동작이 둘인 경우', note: '주된 동작과 대안이 되는 동작을 나란히 둔다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '폭이 좁아져도 Description은 줄바꿈되어 읽힌다' },
    ],
    verified: false,
  },
  {
    id: 'popover',
    name: 'Popover',
    aliases: ['팝오버', '팝업', '플로팅 패널', 'popover'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.10.0',
    changedIn: 'v0.10.0',
    purpose: '트리거를 누르면 그 곁에 곁들여 보는 내용을 띄운다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '누르면 곁에 bg-popover, text-popover-foreground, 테두리, radius-md, shadow-md인 내용이 뜬다. 쌓임 순서는 z-popover다. 트리거에서 sideOffset만큼 떨어지고 collisionPadding만큼 뷰포트 가장자리를 남긴 채 반대편으로 뒤집힌다. 안은 제목·보조 설명을 담는 Header(선택)·실제 상호작용이 있는 Body·적용·초기화 같은 동작을 담는 Footer(선택) 순서로 쌓일 수 있다. Radix가 이 표면을 document.body로 포털하므로 구조도 무대 안에 담을 수 없다 — Dialog·Tooltip·Dropdown Menu와 같은 이유로 Trigger 하나만 부위로 남긴다. 열린 표면의 구조는 Usage와 Cases에서 실제로 눌러서 본다. modal이 아니라 바깥을 눌러도 GNB를 포함해 그대로 눌린다',
      },
    ],
    /*
     * 열린 표면은 트리거의 변형이 아니라 다른 표면이다. 포털된 고정
     * 위치 요소는 행 높이에 계산되지 않아 격자의 아래 칸을 덮는다 —
     * Tooltip에서 이미 같은 결론에 이르렀다. properties를 빈 배열로
     * 두면 ComponentPage가 절을 그리지 않는다.
     */
    properties: [],
    guidelines: [
      {
        id: 'dialog-vs-popover',
        title: 'Dialog vs Popover',
        body: '하던 일을 멈추고 답해야 하면 Dialog를 쓰고, 곁들여 보는 것이면 Popover를 씁니다.',
        do: ['필터·짧은 설명처럼 곁들여 보는 내용에는 Popover를 쓴다'],
        dont: ['삭제 확인처럼 하던 일을 멈추고 답해야 하는 내용을 Popover에 담지 않는다'],
      },
      {
        id: 'tooltip-vs-popover',
        title: 'Tooltip vs Popover',
        body: '안에 누를 수 있는 것이 하나라도 있으면 Popover를 씁니다. Tooltip은 마우스를 치우면 사라지므로 누를 수 없습니다.',
        do: ['버튼이나 링크처럼 누를 수 있는 것이 있으면 Popover를 쓴다'],
        dont: ['누를 수 있는 것을 Tooltip 안에 넣지 않는다'],
      },
      {
        id: 'no-nested-popover',
        title: 'No nested popovers',
        body: '팝오버 안에서 또 팝오버를 열지 않습니다. 어느 것을 닫아야 뒤로 가는지 알 수 없게 됩니다.',
        do: ['팝오버 하나로 끝나는 내용만 담는다'],
        dont: ['팝오버 안에서 또 다른 팝오버를 열지 않는다'],
      },
      {
        id: 'edge-reposition',
        title: 'Reposition at screen edges',
        body: '화면 가장자리에서는 잘리기 전에 반대편으로 뒤집힙니다. Radix가 맡는 일이므로 collisionPadding만 정합니다.',
        do: ['뷰포트 가장자리에서 자동으로 뒤집히도록 그대로 둔다'],
        dont: ['위치를 고정값으로 강제해 뒤집힘을 막지 않는다'],
      },
      {
        id: 'name-the-surface',
        title: 'Name the surface',
        body: '열린 표면은 role="dialog"입니다. 이름이 없으면 스크린 리더가 이름 없는 대화상자로 읽으므로 표면마다 이름을 답니다.',
        do: [
          '표면 안에 제목이 있으면 그 제목의 id를 PopoverContent의 aria-labelledby로 잇는다',
          '제목이 없으면 안에 무엇이 들었는지 밝히는 aria-label을 단다',
        ],
        dont: ['PopoverContent를 이름 없이 두지 않는다'],
      },
    ],
    usage: [
      { id: 'filter-group', title: '필터 묶음', note: '여러 조건을 한 자리에 묶어 고른다' },
      { id: 'date-picker', title: '날짜 선택', note: '입력 곁에 자주 쓰는 날짜를 곁들인다' },
      { id: 'item-search', title: '항목 검색', note: '입력하며 찾고 목록에서 고른다' },
      { id: 'short-description-with-link', title: '짧은 설명과 링크', note: '몇 문장과 이어지는 링크를 함께 보인다' },
    ],
    cases: [
      { id: 'screen-edge', title: '화면 가장자리', note: '자리가 없으면 반대쪽으로 자동으로 뒤집힌다' },
      { id: 'long-content', title: '내용이 긴 경우', note: '세로로 넘치면 Content 안에서만 스크롤된다' },
      { id: 'with-form', title: '안에 폼이 있는 경우', note: '입력을 마치기 전에는 바깥을 눌러도 값이 남는다' },
      { id: 'narrow-screen', title: '좁은 화면', note: 'collisionPadding만큼 여백을 남기고 폭이 줄어든다' },
    ],
    verified: false,
  },
  {
    id: 'progress',
    name: 'Progress',
    aliases: ['진행률', '프로그레스', '진행 바', 'progress bar', '로딩 바'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '작업이 얼마나 끝났는지 막대 길이로 보인다. Radix의 Progress를 감싸 role="progressbar"와 aria-valuenow를 맡기고, Indicator는 width 대신 translateX로 값만큼만 보이게 민다.',
    anatomy: [
      { part: 'track', label: 'Track', note: '전체 길이를 나타내는 바탕. 늘 bg-muted다' },
      {
        part: 'indicator',
        label: 'Indicator',
        note: '진행한 만큼 채우는 막대. variant가 배경색을 정한다',
      },
      { part: 'label', label: 'Label', note: '무엇의 진행인지 알리는 이름', optional: true },
      { part: 'value', label: 'Value', note: '진행률을 숫자로 보인다', optional: true },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: 'Indicator의 배경색을 정한다. Track은 늘 bg-muted다.',
        display: 'row',
        options: [
          { value: 'default', note: '기본. 중립적인 진행' },
          { value: 'success', note: '성공적으로 끝난 진행' },
          { value: 'warning', note: '주의가 필요한 진행' },
          { value: 'destructive', note: '실패한 진행' },
        ],
      },
      {
        name: 'size',
        title: 'Size',
        description: '막대의 두께를 정한다.',
        display: 'row',
        options: [
          { value: 'sm', note: '표 행, 카드 안처럼 조밀한 자리' },
          { value: 'default', note: '기본' },
        ],
      },
      {
        name: 'state',
        title: 'State',
        description: '값을 아는지 모르는지를 나타낸다.',
        display: 'grid',
        options: [
          { value: 'determinate', note: 'value를 주어 진행률만큼 막대가 찬다' },
          {
            value: 'indeterminate',
            note: "value를 주지 않은 상태. Radix가 data-state='indeterminate'를 달아 좁힌 막대가 좌우로 오간다",
          },
        ],
      },
    ],
    guidelines: [
      {
        id: 'give-value-when-known',
        title: '끝을 알 수 있으면 값을 준다',
        body: '남은 양을 아는데도 indeterminate로 두면 기다리는 사람이 얼마나 남았는지 짐작할 수 없습니다.',
        do: ['남은 양을 알면 value를 주어 determinate로 보인다'],
        dont: ['끝을 알 수 있는데도 indeterminate로 남겨 두지 않는다'],
      },
      {
        id: 'show-number-with-bar',
        title: '숫자를 함께 보인다',
        body: '막대 길이만으로는 87%인지 92%인지 읽히지 않습니다.',
        do: ['막대 옆이나 위에 Value로 숫자를 함께 보인다'],
        dont: ['막대 길이만으로 정확한 값을 짐작하게 두지 않는다'],
      },
      {
        id: 'dont-signal-failure-by-color-alone',
        title: '색만으로 실패를 알리지 않는다',
        body: '빨간 막대 옆에 무엇이 실패했는지 문구를 답니다.',
        do: ['destructive 막대 옆에 무엇이 실패했는지 문구를 함께 둔다'],
        dont: ['색만 바꾸고 실패 사유를 문구로 남기지 않는다'],
      },
      {
        id: 'no-regression',
        title: '되돌아가지 않는다',
        body: '값이 줄어들면 진행이 아니라 오작동으로 읽힙니다. 다시 시작한다면 0부터 새로 그립니다.',
        do: ['값은 앞으로만 나아가게 한다', '다시 시작할 때는 0부터 새 Progress로 그린다'],
        dont: ['값을 줄여 뒤로 가는 모습을 보이지 않는다'],
      },
    ],
    usage: [
      { id: 'file-upload', title: '파일 업로드', note: '업로드가 끝날 때까지 남은 양을 보인다' },
      {
        id: 'bulk-job-progress',
        title: '대량 작업 진행',
        note: '여러 건을 한 번에 처리하는 동안 진행률을 보인다',
      },
      {
        id: 'usage-against-limit',
        title: '한도 대비 사용량',
        note: '전체 한도에서 지금까지 쓴 양을 보인다',
      },
      {
        id: 'multi-step-progress',
        title: '여러 단계의 진척',
        note: '단계별 이름 없이 전체 진행률만 하나의 수치로 보인다',
      },
    ],
    cases: [
      {
        id: 'zero-and-hundred',
        title: '0%와 100%',
        note: '시작과 끝에서도 막대와 값이 자연스럽게 보인다',
      },
      {
        id: 'unknown-value',
        title: '값을 알 수 없는 경우',
        note: 'value 없이 indeterminate로 두어 진행 중임만 알린다',
      },
      {
        id: 'failed',
        title: '실패한 경우',
        note: 'destructive variant로 바꾸고 실패 사유를 문구로 덧붙인다',
      },
      { id: 'narrow-width', title: '아주 좁은 폭', note: '폭이 좁아도 막대와 값이 겹치지 않는다' },
    ],
    verified: false,
  },
  {
    id: 'sheet',
    name: 'Sheet',
    aliases: ['시트', '사이드 패널', '드로어', 'drawer', 'side panel', '슬라이드 패널'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.12.0',
    changedIn: 'v0.12.0',
    purpose: 'Radix의 Dialog를 감싸 가장자리에 붙인다. 목록이나 작업 맥락을 곁에 둔 채 이어서 일할 때 쓴다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '누르면 화면 전체를 덮는 반투명 덮개(bg-black/50)와 side가 정한 가장자리에 붙는 컨테이너(bg-background, 테두리, shadow-lg)가 뜬다. 컨테이너는 좌우에서 열리면 세로 전체를, 위아래에서 열리면 가로 전체를 채우고 반대쪽 치수만 size가 정한 max-w 또는 max-h로 제한한다. 안은 제목(text-lg font-semibold)·본문(text-sm text-muted-foreground)이 있는 Header, 스크롤되는 Body, 오른쪽 정렬된 동작 버튼이 있는 Footer 순서로 쌓이고, 오른쪽 위 모서리에 닫기(X) 아이콘이 항상 있다. 쌓임 순서는 z-overlay. 컨테이너는 화면 가장자리에 붙어 구조도 무대 안에 담을 수 없으므로 나머지 부위는 Usage에서 실제로 눌러서 본다',
      },
    ],
    /*
     * side의 네 값도 size의 세 값도 닫힌 트리거에서는 완전히 같아
     * 보인다 — Dialog가 size를 축에서 뺀 것과 같은 이유로 격자의
     * 칸마다 똑같은 버튼만 남는다. properties를 빈 배열로 두면
     * ComponentPage가 이 절을 그리지 않는다. side·size prop 자체는
     * 컴포넌트에 그대로 있고, 네 방향과 세 크기 모두 Usage와
     * Cases에서 실제로 열어 확인한다.
     */
    properties: [],
    guidelines: [
      {
        id: 'distinguish-dialog',
        title: 'Distinguish from Dialog',
        body: '묻고 답하고 원래 자리로 돌아가면 Dialog입니다. 목록을 곁에 둔 채로 이어서 일하면 Sheet입니다.',
        do: ['목록이나 작업 맥락을 유지한 채 이어서 편집할 때 Sheet를 쓴다'],
        dont: ['묻고 답하면 원래 화면으로 돌아가는 상호작용에 Sheet를 쓰지 않는다(Dialog를 쓴다)'],
      },
      {
        id: 'consistent-side',
        title: 'Give the side meaning',
        body: '한 제품 안에서 방향에 뜻을 줍니다. 편집은 오른쪽, 이동은 왼쪽처럼 미리 정합니다. 화면마다 방향이 바뀌면 어디서 나올지 예측할 수 없습니다.',
        do: ['같은 제품 안에서는 뜻이 같은 동작을 늘 같은 방향에 연다'],
        dont: ['같은 동작을 화면마다 다른 방향에서 열지 않는다'],
      },
      {
        id: 'no-nested-sheet',
        title: 'No nested sheets',
        body: 'Sheet 위에 Sheet를 열지 않습니다. 어느 것을 닫아야 뒤로 가는지 알 수 없게 됩니다. Popover에서 이미 같은 결론에 이르렀습니다.',
        do: ['Sheet 안에서 확인이 더 필요하면 Dialog를 그 위에 연다'],
        dont: ['Sheet 위에 또 다른 Sheet를 쌓지 않는다'],
      },
      {
        id: 'outside-click',
        title: 'Outside click',
        body: '안에 입력 중인 폼이 있으면 바깥 클릭으로 닫지 않습니다. Dialog의 outside-click 지침이 그대로 적용됩니다.',
        do: ['확인만 하는 Sheet는 바깥 클릭으로 닫히게 둔다'],
        dont: ['입력 중인 폼이 있는 Sheet를 바깥 클릭 한 번으로 닫히게 두지 않는다'],
      },
      {
        id: 'pin-header-footer',
        title: 'Pin header and footer',
        body: '머리와 발을 고정하고 본문만 굴립니다. 내용이 세로로 길면 제목과 동작 버튼이 늘 보여야 합니다. 본문에 Scroll Area를 씁니다.',
        do: ['제목과 동작 버튼을 고정하고 본문만 세로로 스크롤되게 한다'],
        dont: ['본문이 길어질 때 컨테이너 전체가 늘어나 제목이나 버튼이 화면 밖으로 밀려나게 두지 않는다'],
      },
    ],
    usage: [
      { id: 'filter-panel', title: '필터 패널', note: '목록을 곁에 둔 채 여러 조건을 고르고 바로 적용한다' },
      { id: 'detail-edit', title: '상세 편집', note: '필드가 많은 편집 폼은 lg 크기로 넉넉하게 연다' },
      { id: 'narrow-nav', title: '좁은 화면의 내비게이션', note: '좁은 화면에서 메뉴를 왼쪽에서 끌어낸다' },
      { id: 'activity-log', title: '활동 기록', note: '지금 화면 아래에서 최근 활동을 시간순으로 보인다' },
    ],
    cases: [
      { id: 'long-body', title: '본문이 긴 경우', note: '머리와 발은 고정되고 본문만 안에서 세로로 스크롤된다' },
      { id: 'form-inside', title: '안에 폼이 있는 경우', note: '바깥 클릭으로 닫히지 않고 취소 버튼으로만 닫힌다' },
      { id: 'top-bottom', title: '위·아래에서 여는 경우', note: '좌우와 달리 폭이 아니라 높이가 size로 제한된다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '가장자리에 여백을 두고 너비를 채운다' },
    ],
    verified: false,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    aliases: ['스켈레톤', '로딩', '플레이스홀더', 'loading', 'placeholder'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.9.0',
    changedIn: 'v0.9.0',
    purpose:
      '아직 도착하지 않은 내용의 자리를 실제 모양에 가까운 뼈대로 채운다. 뼈대 자체는 aria-hidden이고, 불러오는 중이라는 사실은 role="status" 문구가 따로 알린다.',
    anatomy: [],
    properties: [
      {
        name: 'shape',
        title: 'Shape',
        description: '뼈대가 흉내 낼 실제 내용의 모양을 정한다.',
        display: 'row',
        options: [{ value: 'text' }, { value: 'title' }, { value: 'block' }, { value: 'circle' }],
      },
    ],
    guidelines: [
      {
        id: 'match-real-content',
        title: '실제 내용의 모양을 닮게 만든다',
        body: '뼈대가 실제와 다르면 내용이 도착하는 순간 화면이 튑니다. 줄 수와 폭을 맞춥니다.',
        do: ['실제 내용의 줄 수와 폭에 맞춰 뼈대를 그린다'],
        dont: ['실제 내용과 다른 모양의 뼈대를 두어 내용이 도착할 때 화면을 튀게 하지 않는다'],
      },
      {
        id: 'not-for-brief-loads',
        title: '짧게 끝나는 것에는 쓰지 않는다',
        body: '곧 사라질 뼈대는 깜빡임으로만 보입니다.',
        do: ['오래 걸리는 로딩에만 뼈대를 쓴다'],
        dont: ['금방 끝나는 로딩에 뼈대를 두어 깜빡임만 남기지 않는다'],
      },
      {
        id: 'no-mixing-with-spinner',
        title: '뼈대와 스피너를 한 화면에 섞지 않는다',
        body: '무엇을 기다리는지 두 가지로 말하면 둘 다 흐려집니다.',
        do: ['한 화면에는 뼈대나 스피너 중 하나만 쓴다'],
        dont: ['뼈대와 스피너를 한 화면에 함께 쓰지 않는다'],
      },
      {
        id: 'announce-via-text',
        title: '스크린 리더에는 문구로 알린다',
        body: '뼈대 자체는 aria-hidden이고, 상태는 문구가 전합니다.',
        do: ["role='status'를 가진 문구로 불러오는 중임을 알린다"],
        dont: ['불러오는 중이라는 사실을 문구 없이 뼈대만으로 전하려 하지 않는다'],
      },
    ],
    usage: [
      { id: 'table-row', title: '표의 행', note: '표가 아직 불러오지 않았을 때 행 모양의 뼈대를 반복해 보인다' },
      { id: 'card-list', title: '카드 목록', note: '카드 여러 장이 함께 불러올 때 카드 모양의 뼈대를 나열한다' },
      {
        id: 'detail-basic-info',
        title: '상세 화면의 기본 정보',
        note: '상세 화면 상단의 제목과 본문 자리를 뼈대로 채운다',
      },
      {
        id: 'avatar-with-name',
        title: '아바타와 이름',
        note: '아바타와 이름 두 줄이 함께 불러오는 자리를 뼈대로 채운다',
      },
    ],
    cases: [
      {
        id: 'shorter-or-longer-content',
        title: '실제 내용보다 짧거나 긴 경우',
        note: '뼈대 폭보다 실제 내용이 짧거나 길면 도착하는 순간 폭이 다시 잡힌다',
      },
      { id: 'partial-arrival', title: '일부만 도착한 경우', note: '일부 항목만 먼저 도착하면 나머지 자리만 뼈대로 남는다' },
      { id: 'repeat-count', title: '반복 횟수를 정하는 경우', note: '반복 횟수는 배열에서 파생하고 손으로 적지 않는다' },
      {
        id: 'surface',
        title: '놓이는 표면이 다른 경우',
        note: 'bg-muted 채움이라 놓이는 표면의 명도가 다를 때만 도형으로 읽힌다',
      },
    ],
    verified: false,
  },
  {
    id: 'toast',
    name: 'Toast',
    aliases: ['토스트', '스낵바', 'snackbar', '알림', 'notification'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '잠깐 나타났다 사라지는 알림을 보인다. 화면에 계속 남아야 하면 Alert를 쓴다.',
    anatomy: [
      {
        part: 'container',
        label: 'Container',
        note: 'bg-popover, 테두리, radius-md, 쌓임 순서는 z-toast(50). variant마다 테두리·배경 색조가 다르고 아이콘은 없다. Toast는 항상 앱 전체에 하나뿐인 뷰포트로 Portal되어 화면 오른쪽 아래에 뜬다 — 이 문서의 예시는 격자마다 제자리에 보여야 하므로 문서 전용 뷰포트에 열림 상태를 고정해 두었다. 실제 Toast는 이렇게 붙박이로 있지 않고 5초 안에 사라진다. Usage의 저장 완료만 진짜로 나타났다 사라지는 예시다',
      },
      { part: 'message', label: 'Message', note: 'text-sm. 한두 줄 안에서 끝나는 짧은 문장' },
      {
        part: 'action',
        label: 'Action',
        note: '되돌리기처럼 즉시 실행할 수 있는 동작 하나. 밑줄로 나타낸다',
        optional: true,
      },
      { part: 'close', label: 'Close', note: '항상 있는 닫기 버튼. 16×16' },
    ],
    properties: [
      {
        name: 'variant',
        title: 'Variant',
        description: '상태의 뜻을 정한다. Badge·Alert와 같은 상태 색 체계를 쓰되 아이콘은 두지 않는다.',
        display: 'row',
        options: [
          { value: 'default', note: '중립적인 안내. 복사 완료, 백그라운드 작업 종료' },
          { value: 'success', note: '요청이 성공적으로 끝남. 저장 완료' },
          { value: 'destructive', note: '실패했거나 되돌릴 수 없는 결과' },
        ],
      },
      {
        name: 'layout',
        title: 'Layout',
        description: '되돌리기 같은 동작을 함께 둘지 정한다.',
        display: 'row',
        options: [
          { value: 'message-only', note: '기본. 알리기만 하고 끝난다' },
          { value: 'with-action', note: '되돌리기를 제공할 때만 쓴다' },
        ],
      },
    ],
    guidelines: [
      {
        id: 'reading-time',
        title: 'Reading time',
        body: '읽는 데 필요한 시간을 줍니다. 뜨자마자 사라지면 무슨 일이 있었는지 알 수 없습니다.',
        do: ['한두 줄 안에서 끝나는 짧은 문장만 담는다', '되돌리기가 있으면 누를 시간까지 감안한다'],
        dont: ['한 화면에 여러 Toast를 동시에 띄워 읽을 시간을 서로 빼앗지 않는다'],
      },
      {
        id: 'not-for-critical',
        title: 'Not for critical information',
        body: '사용자가 놓치면 안 되는 것에는 Toast를 쓰지 않습니다. 잠깐 보이고 사라지므로 놓치면 다시 확인할 방법이 없습니다.',
        do: ['반드시 확인해야 하는 오류나 안내는 화면에 계속 남는 Alert를 쓴다'],
        dont: ["'저장하지 못했습니다'처럼 다음 행동이 필요한 실패를 Toast 하나로 끝내지 않는다"],
      },
      {
        id: 'action-only-for-undo',
        title: 'Action only for undo',
        body: '되돌리기를 제공할 때만 동작을 둡니다. 사라지는 물건에 여러 선택지를 담으면 고르기 전에 사라집니다.',
        do: ['삭제 직후처럼 되돌릴 수 있는 동작에만 Action을 둔다'],
        dont: ['Toast 안에 여러 동작을 나란히 두지 않는다'],
      },
    ],
    usage: [
      { id: 'save-complete', title: '저장 완료', note: '성공하면 잠깐 나타났다 사라진다. 버튼을 눌러 실제로 확인한다' },
      { id: 'delete-undo', title: '삭제 후 되돌리기', note: '삭제를 실행하면서 동시에 되돌릴 길을 남긴다' },
      { id: 'copy-complete', title: '복사 완료', note: '클립보드 복사처럼 결과가 바로 보이지 않는 동작을 확인해 준다' },
      { id: 'background-task-done', title: '백그라운드 작업 종료', note: '다른 일을 하는 동안 끝난 작업을 알린다' },
    ],
    cases: [
      { id: 'stacked', title: '여럿이 겹치는 경우', note: '뷰포트 안에서 세로로 쌓이고 오래된 것이 위로 밀린다' },
      { id: 'long-message', title: '메시지가 긴 경우', note: '줄바꿈되지만 두어 줄을 넘기지 않게 짧게 쓴다' },
      { id: 'error', title: '오류인 경우', note: '실패를 Toast로 알리되 반드시 확인해야 하는 오류는 Alert를 함께 쓴다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '뷰포트 폭이 줄어들고 Toast는 그 폭을 채운다' },
    ],
    verified: true,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    aliases: ['툴팁', '말풍선', '설명', 'hint'],
    category: 'feedback',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '가리키는 것의 이름이나 짧은 설명을 보인다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '호버하거나 포커스하면 트리거 주변에 말풍선이 뜬다. bg-popover, 테두리, radius-md, 쌓임 순서는 z-popover. 글자는 text-xs이고 트리거를 향한 작은 꼬리(Arrow)가 함께 붙는다. 표 헤더처럼 넘침이 있는 컨테이너 안에서도 잘리지 않도록 Portal로 렌더링된다',
      },
    ],
    /*
     * side는 트리거 자체에는 아무 시각 차이를 남기지 않는다 — 말풍선이
     * 열려야만 값이 갈린다. defaultOpen으로 강제해 봤지만 Radix
     * Tooltip은 열림 상태를 포인터·포커스가 쥐고 있어 유지되지
     * 않았다(실측: 격자에 똑같이 생긴 트리거만 남고 말풍선은 0개).
     * Select가 open을, Dropdown Menu가 open·align을 축에서 뺀 것과
     * 같은 이유로 properties에 두지 않는다. side prop 자체는
     * 컴포넌트에 그대로 있고 위치 차이는 Usage·Cases에서 실제
     * 호버로 보인다.
     */
    properties: [],
    guidelines: [
      {
        id: 'icon-only-button',
        title: 'Icon-only buttons',
        body: '아이콘만 있는 버튼에는 반드시 Tooltip을 붙입니다. 글자가 없으면 아이콘의 뜻을 짐작해야 합니다.',
        do: ['아이콘만 있는 버튼에 Tooltip으로 이름을 붙인다', '스크린리더용 이름도 aria-label로 함께 준다'],
        dont: ['아이콘만 두고 이름을 어디에도 남기지 않는다'],
      },
      {
        id: 'not-only-source',
        title: 'Not the only source',
        body: '중요한 정보를 Tooltip에만 두지 않습니다. 터치 기기에는 호버가 없어 마우스를 대지 않으면 존재조차 알 수 없습니다.',
        do: ['비활성 이유처럼 중요한 정보는 화면에 먼저 보이게 하고 Tooltip은 보조로 둔다'],
        dont: ['비활성인 이유를 Tooltip에만 적어 두지 않는다'],
      },
      {
        id: 'single-line',
        title: 'Single line',
        body: 'Tooltip 글은 한 줄을 넘기지 않습니다. 길어지면 본문이나 Dialog로 옮깁니다.',
        do: ['한 줄로 끝나는 짧은 문구만 담는다'],
        dont: ['여러 문장을 Tooltip 안에 욱여넣지 않는다'],
      },
    ],
    usage: [
      { id: 'icon-button', title: '아이콘 버튼', note: '아이콘만 있는 버튼의 이름을 밝힌다' },
      { id: 'truncated-text', title: '줄임된 글', note: '표에서 잘린 값의 전체 글을 보인다' },
      { id: 'disabled-reason', title: '비활성 이유', note: '화면에 보이는 안내를 보조하는 자리로만 쓴다' },
      { id: 'table-header', title: '표 머리의 설명', note: '열 이름만으로 부족한 뜻을 덧붙인다' },
    ],
    cases: [
      { id: 'long-text', title: '글이 긴 경우', note: '한 줄을 넘기면 여러 줄로 줄바꿈된다' },
      { id: 'screen-edge', title: '화면 가장자리', note: '자리가 없으면 반대쪽으로 자동으로 뒤집힌다' },
      { id: 'touch-device', title: '터치 기기', note: '호버가 없으므로 이름을 aria-label로도 함께 남긴다' },
      { id: 'narrow-screen', title: '좁은 화면', note: '트리거가 줄바꿈되어도 말풍선 위치는 트리거를 따라간다' },
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

/** 카테고리 순서대로 묶은 컴포넌트 목록. 묶음 안은 이름순이다. */
export function componentsByCategory(): { category: ComponentCategory; items: ComponentMeta[] }[] {
  return categoryOrder.map((category) => ({
    category,
    items: getComponentsByCategory(category).sort((a, b) => a.name.localeCompare(b.name)),
  }))
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
