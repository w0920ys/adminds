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
    id: 'input',
    name: 'Input',
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
    verified: false,
  },
  {
    id: 'select',
    name: 'Select',
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
    verified: false,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
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
    verified: false,
  },
  {
    id: 'radio',
    name: 'Radio',
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
    verified: false,
  },
  {
    id: 'switch',
    name: 'Switch',
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
    verified: false,
  },
  {
    id: 'textarea',
    name: 'Textarea',
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
    verified: false,
  },
  {
    id: 'tabs',
    name: 'Tabs',
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
    verified: false,
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
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
    verified: false,
  },
  {
    id: 'pagination',
    name: 'Pagination',
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
    verified: false,
  },
  {
    id: 'alert',
    name: 'Alert',
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
    verified: false,
  },
  {
    id: 'toast',
    name: 'Toast',
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
    verified: false,
  },
  {
    id: 'table',
    name: 'Table',
    category: 'data-display',
    status: 'stable',
    addedIn: 'v0.8.0',
    changedIn: 'v0.8.0',
    purpose: '어드민의 중심 화면이다. 여러 행의 데이터를 칸으로 나누어 보이고, 고르거나 정렬하게 한다.',
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
        note: '정렬 가능한 열 이름 옆의 방향 아이콘. 누르면 정렬 방향이 바뀐다',
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
    verified: false,
  },
  {
    id: 'badge',
    name: 'Badge',
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
    verified: false,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
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
    verified: false,
  },
  {
    id: 'dialog',
    name: 'Dialog',
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
    verified: false,
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
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
    verified: false,
  },
  {
    id: 'avatar',
    name: 'Avatar',
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
    verified: false,
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
