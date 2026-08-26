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
]

export function getPattern(id: string): PatternMeta | undefined {
  return patterns.find((p) => p.id === id)
}

export function patternStats(): { total: number; verified: number } {
  return {
    total: patterns.length,
    verified: patterns.filter((p) => p.verified).length,
  }
}
