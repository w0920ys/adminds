import type { ComponentStatus, Example, Guideline } from '@/data/registry'

/**
 * 패턴 문서의 한 자리. 화면 위에서 어떤 컴포넌트가 어디에 오는가를 적는다.
 * 컴포넌트 문서의 AnatomyPart와 다르다 — 저쪽은 실제로 그려진 미리보기의
 * DOM을 재서 지시선을 긋지만, 패턴은 화면 하나가 통째로 예시라 잴 대상이
 * 정해지지 않는다. 그래서 좌표가 아니라 순서만 갖는다.
 */
export type PatternStructureStep = {
  /** 이 자리의 이름. 컴포넌트 이름이거나 자리 이름이다 */
  slot: string
  /** 이 자리가 무엇을 맡는가 */
  note: string
  /** 이 자리가 쓰는 컴포넌트의 registry id. 그 문서로 잇는다 */
  components?: string[]
  /** 없어도 화면이 성립하는 자리인지 */
  optional?: boolean
}

/** 문서의 성숙도. 컴포넌트와 같은 눈금을 쓴다 — 같은 배지가 같은 뜻으로 읽혀야 한다 */
export type PatternStatus = ComponentStatus

/**
 * 패턴 문서의 메타.
 *
 * ComponentMeta를 재사용하지 않는다. 패턴에는 축(properties)도 상태도
 * 없는데, 그 자리를 빈 배열로 두면 문서에 빈 절이 생긴다 — "이것에는
 * 축이 없다"가 아니라 "문서가 덜 채워졌다"로 읽히는 결함이고,
 * v0.8.0에서 이미 한 번 걷어냈다.
 *
 * Guideline과 Example은 registry에서 가져다 쓴다. 이 둘은 컴포넌트의
 * 성질이 아니라 '문서의 한 절'의 모양이고, GuidelineBlock·ExampleList가
 * 이미 그 타입을 받는다.
 */
export type PatternMeta = {
  id: string
  name: string
  /** 검색에서 이 패턴을 부르는 다른 이름들 */
  aliases: string[]
  status: PatternStatus
  addedIn: string
  changedIn: string
  purpose: string
  structure: PatternStructureStep[]
  guidelines: Guideline[]
  /** 화면 하나를 통째로 보이는 예시. 화면은 페이지가 조립하고 여기에는 제목과 설명만 둔다 */
  example: { title: string; note: string }
  cases: Example[]
  verified: boolean
}

/** LNB에 놓이는 순서다. nav-config의 Patterns 목록이 이 순서와 맞물린다. */
export const patterns: PatternMeta[] = [
  {
    id: 'list',
    name: 'List',
    aliases: ['목록', '리스트', '목록 화면', '테이블 화면'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '여러 항목을 한 화면에서 훑고 걸러 하나를 고르는 화면이다. 어드민에서 가장 자주 열린다.',
    structure: [
      { slot: 'Breadcrumb', note: '지금 보는 목록이 어느 갈래에 있는지 보인다', components: ['breadcrumb'] },
      { slot: '제목과 주요 동작', note: '제목은 왼쪽, 주요 동작은 오른쪽 끝. 주요 동작은 하나만 둔다', components: ['button'] },
      { slot: '필터 줄', note: '검색어와 좁히는 조건을 표 위에 둔다. 결과 수를 함께 보인다', components: ['input', 'select'] },
      { slot: 'Table', note: '선택은 Checkbox, 상태는 Badge, 담당자는 Avatar로 보인다', components: ['table', 'checkbox', 'badge', 'avatar'] },
      { slot: '대량 작업 줄', note: '선택이 있을 때만 필터 줄 자리에 나타난다. 선택 개수와 그 선택에 걸리는 동작을 담는다', components: ['button'], optional: true },
      { slot: 'Pagination', note: '표 아래에 전체 개수와 페이지 이동을 둔다', components: ['pagination'] },
    ],
    guidelines: [
      {
        id: 'filter-above-table',
        title: '필터는 표 위에 두고 결과 수를 함께 보인다',
        body: '거른 뒤에 몇 건이 남았는지 보이지 않으면 조건이 먹혔는지 알 수 없다. 조건과 결과 수를 같은 줄에서 읽게 한다.',
        do: ['검색·조건을 표 바로 위에 모은다', '결과 수를 조건 옆이나 표 아래 Pagination에 보인다'],
        dont: ['조건을 표 아래에 둔다', '조건만 바뀌고 결과 수는 그대로 둔다'],
      },
      {
        id: 'bulk-bar-in-place',
        title: '선택이 있으면 대량 작업 줄이 그 자리에 나타난다',
        body: '대량 작업 줄은 필터 줄 자리를 그대로 쓴다. 새 줄을 밀어 넣으면 표가 아래로 밀려 방금 고른 행이 화면 밖으로 나간다.',
        do: ['필터 줄 자리에 선택 개수와 동작을 대신 보인다', '선택을 풀면 필터 줄로 돌아온다'],
        dont: ['표 위에 줄을 하나 더 끼워 넣는다', '선택이 없는데도 대량 작업 줄을 비활성으로 남긴다'],
      },
      {
        id: 'single-primary-action',
        title: '주요 동작은 제목 줄 오른쪽에 하나만 둔다',
        body: '이 화면에서 가장 자주 하는 일 하나만 채운 버튼으로 둔다. 나머지는 outline이나 Dropdown Menu 안으로 내린다.',
        do: ['채운 버튼 하나 + 보조 동작은 outline'],
        dont: ['채운 버튼을 둘 이상 나란히 둔다'],
      },
    ],
    example: {
      title: '사용자 목록',
      note: 'Breadcrumb부터 Pagination까지, 목록 화면 하나를 실제 컴포넌트로 조립한 것이다.',
    },
    cases: [
      { id: 'empty', title: '결과 없음', note: '아직 아무것도 없는 목록. 표의 머리는 남기고 몸에 안내를 둔다.' },
      { id: 'no-filter-results', title: '필터 결과 없음', note: '조건이 너무 좁을 때. 조건을 지우는 길을 함께 준다.' },
      { id: 'loading', title: '불러오는 중', note: '행 자리를 Skeleton으로 잡아 표가 튀지 않게 한다.' },
      { id: 'selection-across-pages', title: '선택 상태에서 페이지 이동', note: '선택이 몇 건인지 페이지를 넘어가도 보인다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '표는 가로로 구르고 제목 줄과 필터 줄은 세로로 쌓인다.' },
    ],
    verified: false,
  },
  {
    id: 'detail',
    name: 'Detail',
    aliases: ['상세', '상세 화면', '단건 조회'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '목록에서 항목 하나로 들어간 뒤의 화면이다. 한 대상의 정보를 갈래로 나눠 보이고 그 대상에 걸리는 동작을 한자리에 모은다.',
    structure: [
      { slot: 'Breadcrumb', note: '어느 목록에서 들어왔는지 보인다', components: ['breadcrumb'] },
      { slot: '제목과 Badge', note: '대상의 이름과 그 상태를 한 줄에 둔다', components: ['badge'] },
      { slot: '동작', note: '자주 쓰는 동작은 버튼으로, 위험하거나 드문 동작은 Dropdown Menu 안쪽에 둔다', components: ['button', 'dropdown-menu'] },
      { slot: 'Tabs', note: '정보를 갈래로 나눈다. 탭을 바꿔도 위의 제목과 동작은 남는다', components: ['tabs'] },
      { slot: '탭 내용', note: '읽기 위주 정보는 Description List로, 딸린 목록은 Table로 보인다', components: ['description-list', 'table'] },
    ],
    guidelines: [
      {
        id: 'breadcrumb-shows-origin',
        title: '어디서 왔는지 Breadcrumb으로 보인다',
        body: '상세 화면은 늘 어딘가의 아래에 있다. 돌아갈 길이 보이지 않으면 뒤로 가기 말고는 방법이 없다.',
        do: ['목록 → 대상 이름 순으로 잇는다', '마지막 칸은 링크가 아니라 현재 위치로 둔다'],
        dont: ['제목만 두고 상위 갈래를 지운다'],
      },
      {
        id: 'danger-in-menu',
        title: '위험한 동작은 Dropdown Menu 안쪽에 둔다',
        body: '삭제·정지처럼 되돌리기 어려운 동작은 한 번 더 열어야 닿게 한다. 자주 쓰는 동작 옆에 나란히 두면 손이 미끄러진다.',
        do: ['수정은 버튼으로, 삭제는 메뉴 안에'],
        dont: ['삭제를 제목 줄에 채운 버튼으로 둔다'],
      },
      {
        id: 'header-persists-across-tabs',
        title: '탭을 바꿔도 제목과 동작은 남는다',
        body: '탭은 한 대상의 정보를 나누는 것이지 다른 화면으로 가는 것이 아니다. 머리가 함께 바뀌면 같은 대상을 보고 있다는 감각이 끊어진다.',
        do: ['Tabs를 제목과 동작 아래에 둔다'],
        dont: ['탭마다 제목 줄을 다시 그린다'],
      },
    ],
    example: {
      title: '사용자 상세',
      note: '제목과 상태, 동작, 그리고 세 갈래의 탭까지 상세 화면 하나를 조립한 것이다.',
    },
    cases: [
      { id: 'long-title', title: '제목이 긴 경우', note: '제목은 줄바꿈하고 동작은 오른쪽 끝에 남는다.' },
      { id: 'many-tabs', title: '탭이 많은 경우', note: '탭 줄이 가로로 구른다. 탭을 접어 숨기지 않는다.' },
      { id: 'locked-tab', title: '권한이 없어 일부 탭이 잠긴 경우', note: '탭은 남기고 비활성으로 둔다. 왜 잠겼는지 내용에 적는다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '제목과 동작이 세로로 쌓이고 Description List가 한 줄씩 놓인다.' },
    ],
    verified: false,
  },
  {
    id: 'form',
    name: 'Form',
    aliases: ['폼', '입력 화면', '등록 화면', '수정 화면'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '값을 입력받아 저장하는 화면이다. 라벨·도움말·오류가 컨트롤과 어떻게 이어지는지를 정한다.',
    structure: [
      { slot: 'Field', note: '라벨·컨트롤·도움말·오류를 하나의 id 계약으로 묶는다. htmlFor와 aria-describedby를 손으로 맞추지 않는다', components: ['field'] },
      { slot: '컨트롤', note: '값의 모양에 따라 고른다 — 짧은 글은 Input, 고르는 값은 Select, 긴 글은 Textarea', components: ['input', 'select', 'textarea'] },
      { slot: '켜고 끄는 값', note: '저장을 눌러야 반영되면 Checkbox, 누르는 순간 반영되면 Switch', components: ['checkbox', 'radio', 'switch'] },
      { slot: '도움말', note: '입력하기 전에 알아야 할 것. 컨트롤 아래 첫 줄에 둔다', components: ['field'] },
      { slot: '오류 문구', note: '입력한 뒤에 알게 되는 것. 도움말 아래에 둔다', components: ['field'], optional: true },
      { slot: '저장과 취소', note: '저장은 오른쪽, 취소는 왼쪽. Dialog의 동작 순서와 같다', components: ['button'] },
    ],
    guidelines: [
      {
        id: 'label-above-control',
        title: '라벨은 입력 위에 둔다',
        body: '어드민 폼은 길다. 라벨이 왼쪽에 있으면 라벨 열과 입력 열의 폭을 둘 다 맞춰야 하고, 긴 라벨 하나가 모든 행의 폭을 정한다.',
        do: ['Field의 stacked 배치를 기본으로 쓴다'],
        dont: ['긴 라벨이 섞인 폼에 horizontal을 쓴다'],
      },
      {
        id: 'help-before-error-after',
        title: '도움말은 입력 전에, 오류는 입력 후에 보인다',
        body: '도움말은 늘 있고 오류는 틀렸을 때만 나온다. 둘을 같은 자리에서 갈아 끼우면 도움말이 사라져 무엇을 고쳐야 하는지 알 수 없다.',
        do: ['도움말을 남긴 채 그 아래에 오류를 더한다'],
        dont: ['오류가 나면 도움말을 지운다'],
      },
      {
        id: 'save-right-cancel-left',
        title: '저장은 오른쪽, 취소는 왼쪽',
        body: '읽는 방향의 끝에 확정하는 동작을 둔다. Dialog의 취소·실행 순서와 같아야 손이 헷갈리지 않는다.',
        do: ['취소는 outline, 저장은 채운 버튼'],
        dont: ['저장을 왼쪽에 둔다'],
      },
      {
        id: 'switch-vs-checkbox',
        title: '즉시 반영되는 것에는 Switch를, 저장이 필요한 것에는 Checkbox를 쓴다',
        body: '두 컨트롤은 모양이 아니라 시점이 다르다. Switch는 누르는 순간 값이 바뀌고, Checkbox는 저장을 눌러야 바뀐다.',
        do: ['폼 안의 동의·선택은 Checkbox로', '설정 화면의 켜고 끄기는 Switch로'],
        dont: ['저장 버튼이 있는 폼 안에 Switch를 둔다'],
      },
    ],
    example: {
      title: '사용자 등록',
      note: 'Field로 묶은 컨트롤 다섯과 저장·취소까지, 입력 화면 하나를 조립한 것이다.',
    },
    cases: [
      { id: 'multiple-errors', title: '오류가 여럿인 경우', note: '각 Field가 자기 오류를 갖고, 폼 위에 몇 건인지 Alert로 한 번 더 보인다.' },
      { id: 'saving', title: '저장 중', note: '저장 버튼을 비활성으로 두고 무엇이 진행 중인지 적는다.' },
      { id: 'unsaved-changes', title: '나가려 할 때 저장하지 않은 변경이 있는 경우', note: 'Dialog로 묻는다. 되돌릴 수 없는 것이 아니므로 문구는 삭제 확인과 다르다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '컨트롤이 한 열로 쌓이고 저장·취소가 가로폭을 채운다.' },
    ],
    verified: false,
  },
  {
    id: 'empty-and-error',
    name: 'Empty and error',
    aliases: ['빈 상태', '빈 화면', '오류 화면', 'empty state', 'error state'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '보여줄 것이 없거나 불러오지 못했을 때의 화면이다. 어드민에서 자주 나오는데 자주 빠뜨린다.',
    structure: [
      { slot: '아이콘', note: '무슨 종류의 자리인지 한눈에 가른다. 뜻은 아이콘이 아니라 글이 전한다', components: ['empty-state'] },
      { slot: '무슨 일인지', note: '한 줄로 상황을 적는다. 원인을 아는 경우에만 원인을 적는다', components: ['empty-state'] },
      { slot: '무엇을 할 수 있는지', note: '다음에 할 일을 적는다. 할 일이 없으면 이 줄을 비운다', components: ['empty-state'], optional: true },
      { slot: '동작', note: '사용자가 할 수 있는 일이 있을 때만 둔다', components: ['button'], optional: true },
    ],
    guidelines: [
      {
        id: 'empty-is-not-error',
        title: '빈 것과 실패한 것을 구별한다',
        body: '아직 아무것도 없는 것은 정상이고, 불러오지 못한 것은 사고다. 같은 화면으로 보이면 사용자가 없는 문제를 고치려 든다.',
        do: ['빈 상태는 안내하는 말로, 실패는 무엇이 잘못됐는지로'],
        dont: ['둘 다 "데이터가 없습니다"로 적는다'],
      },
      {
        id: 'give-an-action',
        title: '사용자가 할 수 있는 일이 있으면 동작을 둔다',
        body: '빈 화면에서 다음에 무엇을 눌러야 하는지 알려 주는 것이 이 자리의 값이다. 할 일이 없으면 억지로 버튼을 만들지 않는다.',
        do: ['첫 항목 만들기 · 조건 지우기 · 다시 시도'],
        dont: ['할 일이 없는데 "확인" 버튼을 둔다'],
      },
      {
        id: 'first-visit-is-guidance',
        title: '첫 방문의 빈 상태는 안내이지 오류가 아니다',
        body: '아직 만들지 않은 것은 잘못이 아니다. 붉은 색과 경고 아이콘을 쓰면 처음 온 사람이 자기가 무언가 망가뜨렸다고 읽는다.',
        do: ['중립 색으로, 무엇을 만들 수 있는지 적는다'],
        dont: ['destructive 색이나 경고 아이콘을 쓴다'],
      },
    ],
    example: {
      title: '네 가지 빈 자리',
      note: '아직 없음 · 검색 결과 없음 · 권한 없음 · 불러오기 실패를 나란히 놓아 문구와 색이 어떻게 갈리는지 본다.',
    },
    cases: [
      { id: 'nothing-yet', title: '아직 아무것도 없음', note: '첫 항목을 만드는 길을 준다. 경고가 아니다.' },
      { id: 'no-search-results', title: '검색 결과 없음', note: '무엇으로 걸렀는지 되짚고 조건을 지우는 길을 준다.' },
      { id: 'no-permission', title: '권한 없음', note: '누구에게 요청해야 하는지 적는다. 다시 시도는 두지 않는다.' },
      { id: 'load-failed', title: '불러오기 실패', note: '다시 시도를 둔다. 원인을 모르면 원인을 지어내지 않는다.' },
    ],
    verified: false,
  },
  {
    id: 'destructive-confirm',
    name: 'Destructive confirm',
    aliases: ['삭제 확인', '위험 동작', '확인 대화상자', '되돌릴 수 없는 동작'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '되돌릴 수 없는 동작을 실행하기 전에 한 번 멈추는 흐름이다. Dialog로 묻고 Toast로 결과를 알린다.',
    structure: [
      { slot: '위험 동작 Button', note: 'destructive 버튼이거나 Dropdown Menu 안의 항목이다', components: ['button', 'dropdown-menu'] },
      { slot: 'Dialog 제목', note: '무엇이 지워지는지 적는다. "삭제하시겠습니까"만으로는 대상을 알 수 없다', components: ['dialog'] },
      { slot: 'Dialog 본문', note: '영향 범위를 적는다. 되돌릴 수 없으면 그 사실을 여기에 적는다', components: ['dialog'] },
      { slot: '취소와 실행', note: '취소는 왼쪽 outline, 실행은 오른쪽 destructive', components: ['button'] },
      { slot: 'Toast', note: '실행한 뒤에 결과를 알린다. 되돌릴 수 있으면 여기에 되돌리기를 둔다', components: ['toast'] },
    ],
    guidelines: [
      {
        id: 'name-the-target',
        title: '제목에 무엇이 지워지는지 적는다',
        body: '대화상자는 목록에서 멀리 떨어져 뜬다. 방금 무엇을 눌렀는지 제목이 다시 말해 주지 않으면 확인이 확인이 아니다.',
        do: ["'홍길동'을 삭제하시겠습니까"],
        dont: ['삭제하시겠습니까'],
      },
      {
        id: 'show-the-count',
        title: '영향 범위가 넓으면 개수를 보인다',
        body: '여럿을 한꺼번에 지울 때 몇 건인지가 판단의 전부다. 목록을 다 늘어놓을 수 없으면 개수라도 적는다.',
        do: ['선택한 12건을 삭제합니다'],
        dont: ['선택한 항목을 삭제합니다'],
      },
      {
        id: 'undo-in-toast',
        title: '되돌릴 수 있으면 Toast에 되돌리기를 둔다',
        body: '되돌릴 수 있는 동작에는 확인 단계를 줄이고 되돌리기를 준다. 묻는 단계와 되돌리는 단계를 둘 다 두면 확인이 소음이 된다.',
        do: ['ToastAction으로 되돌리기를 둔다'],
        dont: ['되돌릴 수 있는데도 대화상자로 한 번 더 묻는다'],
      },
      {
        id: 'say-when-irreversible',
        title: '되돌릴 수 없으면 그 사실을 본문에 적는다',
        body: '되돌릴 수 없다는 말은 제목이 아니라 본문에 둔다. 제목은 대상을 말하는 자리다.',
        do: ['삭제하면 되돌릴 수 없습니다.'],
        dont: ['본문 없이 제목만 두고 실행 버튼을 붉게 칠한다'],
      },
    ],
    example: {
      title: '사용자 삭제',
      note: '버튼을 눌러 Dialog를 열고, 삭제를 누르면 그 자리에 Toast가 뜨는 흐름 전체다.',
    },
    cases: [
      { id: 'delete-one', title: '하나 삭제', note: '제목에 대상의 이름을 적는다.' },
      { id: 'delete-many', title: '여럿 삭제', note: '제목에 개수를 적고 본문에 무엇이 함께 지워지는지 적는다.' },
      { id: 'irreversible', title: '되돌릴 수 없는 삭제', note: '본문에 되돌릴 수 없다고 적고 Toast에 되돌리기를 두지 않는다.' },
      { id: 'failed', title: '실행 실패', note: 'destructive Toast로 알린다. 대화상자는 닫지 않고 다시 시도할 수 있게 둔다.' },
    ],
    verified: false,
  },
]

export function getPattern(id: string): PatternMeta | undefined {
  return patterns.find((p) => p.id === id)
}

/**
 * Overview 문장과 Get started의 Status 칸에 그대로 나가는 두 숫자.
 *
 * 셀 목록을 인자로 받는다. 기본값이 patterns이라 부르는 쪽은 그대로지만,
 * 이렇게 두어야 테스트가 답을 아는 목록을 넣어 셈이 맞는지 볼 수 있다 —
 * 모듈 바깥의 patterns를 직접 읽으면 테스트가 구현과 같은 식을 다시 쓰는
 * 수밖에 없고, 그런 검사는 구현이 틀릴 때 같이 틀린다.
 */
export function patternStats(list: PatternMeta[] = patterns): {
  total: number
  verified: number
} {
  return {
    total: list.length,
    verified: list.filter((p) => p.verified).length,
  }
}
