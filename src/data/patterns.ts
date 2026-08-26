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
