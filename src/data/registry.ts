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
    changedIn: 'v0.7.0',
    purpose: '사용자가 한 줄짜리 값을 직접 입력하도록 한다. 여러 값 중 고르게 할 때는 Select를 쓴다.',
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
    id: 'select',
    name: 'Select',
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.7.0',
    changedIn: 'v0.7.0',
    purpose: '여러 값 중 하나를 고르게 한다. 선택지가 둘셋뿐이면 Radio를 쓴다.',
    anatomy: [
      {
        part: 'trigger',
        label: 'Trigger',
        note: '테두리·높이·포커스 링은 Input과 같은 토큰을 쓴다. 나란히 놓여도 어긋나지 않는다. 오른쪽 끝에 16×16 ChevronDown이 열림 여부와 무관하게 항상 보인다',
      },
      {
        part: 'value',
        label: 'Value',
        note: '선택된 항목의 문구. 아직 고르지 않았으면 이 자리에 자리표시자가 대신 보인다',
      },
      {
        part: 'list',
        label: 'List',
        note: '열렸을 때 트리거 아래에 뜨는 목록. bg-popover, 모서리는 radius-md, 쌓임 순서는 z-popover',
        optional: true,
      },
      {
        part: 'item',
        label: 'Item',
        note: '목록의 한 줄. text-sm. 포커스되면 bg-accent. 고른 항목에는 오른쪽에 16×16 Check 아이콘이 함께 보인다',
        optional: true,
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
        description: '상호작용 상태를 나타낸다. 열린 목록은 Anatomy에서 이미 보여준다.',
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
    id: 'checkbox',
    name: 'Checkbox',
    category: 'inputs',
    status: 'stable',
    addedIn: 'v0.7.0',
    changedIn: 'v0.7.0',
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
          { value: 'disabled', note: '지금 상태를 바꿀 수 없음' },
          { value: 'focus', note: '키보드 포커스. 항상 보여야 한다' },
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
    ],
    usage: [
      { id: 'save-result', title: '저장 결과', note: '성공했을 때 화면 위쪽에 보인다' },
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
