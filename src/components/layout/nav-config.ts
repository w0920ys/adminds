export type DocLink = {
  to: string
  label: string
  /** 이 문서가 무엇을 다루는가. Overview 카드와 검색 결과가 같은 문장을 쓴다 */
  summary?: string
  /** 문서 최종 수정일. YYYY-MM-DD */
  updatedAt: string
  /** LNB에서 이 항목 아래 들여쓰기로 놓이는 하위 문서. 순서에서는 부모 바로 뒤에 온다 */
  children?: DocLink[]
}

/**
 * LNB에서 문서 여러 개를 묶는 머리글. 링크가 아니므로 이동하지 않고,
 * 순서·이전·다음 계산에서도 존재하지 않는 것처럼 지나간다.
 * 자식과 다르다 — children은 문서의 하위 문서지만, 묶음은 분류일 뿐이다.
 */
export type DocGroup = {
  label: string
  items: DocLink[]
}

export type NavItem = DocLink | DocGroup

export function isGroup(item: NavItem): item is DocGroup {
  return !('to' in item)
}

export type NavSection = {
  id: string
  /** GNB에 표시되는 이름 */
  label: string
  /** 섹션 진입 경로. 자기 Overview와 같다 */
  to: string
  /** LNB 목록. 첫 항목은 항상 Overview이고, 그 뒤로 문서나 묶음이 온다 */
  items: NavItem[]
}

/** 문서 내용을 고칠 때 그 항목의 updatedAt도 함께 갱신한다. */
export const sections: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get started',
    to: '/',
    items: [
      { to: '/', label: 'Overview', summary: '이 디자인 시스템이 무엇이고 어디서부터 읽는가', updatedAt: '2026-08-29' },
      { to: '/get-started/install', label: 'Install', summary: '설치와 첫 컴포넌트 붙이기', updatedAt: '2026-08-29' },
      { to: '/get-started/principles', label: 'Principles', summary: '판단이 갈릴 때 기대는 원칙', updatedAt: '2026-08-29' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    to: '/foundations',
    items: [
      { to: '/foundations', label: 'Overview', summary: '컴포넌트보다 먼저 합의하는 것들', updatedAt: '2026-08-29' },
      { to: '/foundations/design-token', label: 'Design Token', summary: '토큰의 층과 이름 규칙, 전체 목록', updatedAt: '2026-08-29' },
      {
        to: '/foundations/color',
        label: 'Color',
        summary: '역할 기반 시맨틱 색 토큰과 라이트·다크 대응',
        updatedAt: '2026-08-29',
        children: [
          { to: '/foundations/color-role', label: 'Color Role', summary: '역할 사이의 위계와 짝', updatedAt: '2026-08-29' },
          { to: '/foundations/palette', label: 'Palette', summary: '원시 색 스케일과 시맨틱 연결', updatedAt: '2026-08-29' },
        ],
      },
      { to: '/foundations/typography', label: 'Typography', summary: '크기 스케일과 굵기, 정보 위계', updatedAt: '2026-08-29' },
      { to: '/foundations/spacing', label: 'Spacing', summary: '4px 기반 간격과 어드민 밀도 축', updatedAt: '2026-08-29' },
      { to: '/foundations/iconography', label: 'Iconography', summary: '아이콘 크기·스트로크·사용 규칙', updatedAt: '2026-08-29' },
      { to: '/foundations/state', label: 'State', summary: '상호작용 상태의 표현 규칙', updatedAt: '2026-08-29' },
      { to: '/foundations/voice-and-tone', label: 'Voice and Tone', summary: '어드민이 사용자에게 말하는 방식', updatedAt: '2026-08-29' },
      { to: '/foundations/writing', label: 'Writing', summary: '라벨·문구·오류 메시지 작성 규칙', updatedAt: '2026-08-29' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    to: '/components',
    items: [
      { to: '/components', label: 'Overview', summary: '화면을 이루는 낱개의 부품 목록', updatedAt: '2026-08-29' },
      {
        label: 'Actions',
        items: [
          { to: '/components/button', label: 'Button', updatedAt: '2026-08-29' },
          { to: '/components/context-menu', label: 'Context Menu', updatedAt: '2026-08-29' },
          { to: '/components/dropdown-menu', label: 'Dropdown Menu', updatedAt: '2026-08-29' },
          { to: '/components/toggle', label: 'Toggle', updatedAt: '2026-08-29' },
        ],
      },
      {
        label: 'Inputs',
        items: [
          { to: '/components/checkbox', label: 'Checkbox', updatedAt: '2026-08-29' },
          { to: '/components/combobox', label: 'Combobox', updatedAt: '2026-08-26' },
          { to: '/components/date-picker', label: 'Date Picker', updatedAt: '2026-08-29' },
          { to: '/components/field', label: 'Field', updatedAt: '2026-08-29' },
          { to: '/components/file-upload', label: 'File Upload', updatedAt: '2026-08-29' },
          { to: '/components/input', label: 'Input', updatedAt: '2026-08-29' },
          { to: '/components/radio', label: 'Radio', updatedAt: '2026-08-29' },
          { to: '/components/select', label: 'Select', updatedAt: '2026-08-29' },
          { to: '/components/slider', label: 'Slider', updatedAt: '2026-08-29' },
          { to: '/components/switch', label: 'Switch', updatedAt: '2026-08-29' },
          { to: '/components/textarea', label: 'Textarea', updatedAt: '2026-08-29' },
        ],
      },
      {
        label: 'Navigation',
        items: [
          { to: '/components/breadcrumb', label: 'Breadcrumb', updatedAt: '2026-08-29' },
          { to: '/components/command', label: 'Command', updatedAt: '2026-08-29' },
          { to: '/components/pagination', label: 'Pagination', updatedAt: '2026-08-29' },
          { to: '/components/steps', label: 'Steps', updatedAt: '2026-08-29' },
          { to: '/components/tabs', label: 'Tabs', updatedAt: '2026-08-26' },
        ],
      },
      {
        label: 'Data Display',
        items: [
          { to: '/components/accordion', label: 'Accordion', updatedAt: '2026-08-29' },
          { to: '/components/avatar', label: 'Avatar', updatedAt: '2026-08-29' },
          { to: '/components/badge', label: 'Badge', updatedAt: '2026-08-29' },
          { to: '/components/card', label: 'Card', updatedAt: '2026-08-29' },
          { to: '/components/collapsible', label: 'Collapsible', updatedAt: '2026-08-29' },
          { to: '/components/data-table', label: 'Data Table', updatedAt: '2026-08-29' },
          { to: '/components/description-list', label: 'Description List', updatedAt: '2026-08-26' },
          { to: '/components/scroll-area', label: 'Scroll Area', updatedAt: '2026-08-29' },
          { to: '/components/separator', label: 'Separator', updatedAt: '2026-08-29' },
          { to: '/components/table', label: 'Table', updatedAt: '2026-08-29' },
        ],
      },
      {
        label: 'Feedback',
        items: [
          { to: '/components/alert', label: 'Alert', updatedAt: '2026-08-29' },
          { to: '/components/alert-dialog', label: 'Alert Dialog', updatedAt: '2026-08-29' },
          { to: '/components/dialog', label: 'Dialog', updatedAt: '2026-08-29' },
          { to: '/components/empty-state', label: 'Empty State', updatedAt: '2026-08-26' },
          { to: '/components/popover', label: 'Popover', updatedAt: '2026-08-29' },
          { to: '/components/progress', label: 'Progress', updatedAt: '2026-08-29' },
          { to: '/components/sheet', label: 'Sheet', updatedAt: '2026-08-29' },
          { to: '/components/skeleton', label: 'Skeleton', updatedAt: '2026-08-29' },
          { to: '/components/toast', label: 'Toast', updatedAt: '2026-08-29' },
          { to: '/components/tooltip', label: 'Tooltip', updatedAt: '2026-08-29' },
        ],
      },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    to: '/patterns',
    items: [
      { to: '/patterns', label: 'Overview', summary: '여러 부품을 엮는 화면 단위의 규칙', updatedAt: '2026-08-29' },
      { to: '/patterns/list', label: 'List', summary: '여러 항목을 훑고 걸러 하나를 고르는 화면', updatedAt: '2026-08-29' },
      { to: '/patterns/detail', label: 'Detail', summary: '항목 하나를 갈래로 나눠 보이는 화면', updatedAt: '2026-08-29' },
      { to: '/patterns/form', label: 'Form', summary: '라벨·도움말·오류의 배치를 정하는 입력 화면', updatedAt: '2026-08-29' },
      { to: '/patterns/empty-and-error', label: 'Empty and error', summary: '비어 있을 때와 실패했을 때의 화면', updatedAt: '2026-08-29' },
      { to: '/patterns/destructive-confirm', label: 'Destructive confirm', summary: '되돌릴 수 없는 동작을 묻고 알리는 흐름', updatedAt: '2026-08-27' },
    ],
  },
  {
    id: 'updates',
    label: 'Updates',
    to: '/updates',
    items: [{ to: '/updates', label: 'Overview', summary: '버전마다 무엇이 바뀌었는가', updatedAt: '2026-08-29' }],
  },
]

/**
 * 업데이트 점(dot)을 보여주는 섹션. Get started는 안내문 자체가 자주 바뀌지 않는
 * 고정 섹션이고, Updates는 "무엇이 바뀌었는가"를 이미 통째로 보여주는 섹션이라
 * 그 자신이 다시 dot으로 스스로를 가리킬 필요가 없다 — 그래서 이 두 섹션은
 * updatedAt과 무관하게 항상 뺀다.
 */
export const UPDATE_DOT_SECTION_IDS: ReadonlySet<string> = new Set([
  'foundations',
  'components',
  'patterns',
])

/** 묶음을 풀고 부모 다음에 자식이 오도록 평탄화한다. 순서가 필요한 곳은 모두 이것을 쓴다. */
export function flattenDocs(items: NavItem[]): DocLink[] {
  return items.flatMap((item) =>
    isGroup(item) ? flattenDocs(item.items) : [item, ...flattenDocs(item.children ?? [])],
  )
}

/**
 * 묶음만 풀고 하위 문서는 펼치지 않은 1단계 문서 목록.
 * Overview 카드처럼 "이 섹션이 무슨 문서를 갖는가"를 늘어놓는 곳에서 쓴다.
 */
export function topLevelDocs(items: NavItem[]): DocLink[] {
  return items.flatMap((item) => (isGroup(item) ? item.items : [item]))
}

/**
 * LNB 순서를 평탄화한 전체 문서 목록.
 * 경로로 문서를 찾거나(findDoc) 라우트와 대조하는 데 쓴다.
 * 이전·다음 이동은 여기서 나오지 않는다 — findAdjacent가 섹션 안에서만 계산한다.
 */
export const docOrder: DocLink[] = sections.flatMap((section) => flattenDocs(section.items))

/**
 * 현재 경로가 속한 섹션.
 * 첫 섹션(Get started)은 루트를 쓰므로 다른 섹션을 먼저 확인하고, 없으면 첫 섹션으로 떨어진다.
 */
export function findSection(pathname: string): NavSection {
  const match = sections
    .slice(1)
    .find((section) => pathname === section.to || pathname.startsWith(`${section.to}/`))
  return match ?? sections[0]
}

export function findDoc(pathname: string): DocLink | undefined {
  return docOrder.find((doc) => doc.to === pathname)
}

/**
 * 이전·다음 문서. 같은 섹션 안에서만 이동한다.
 * 섹션이 바뀌면 맥락도 바뀌므로 경계를 넘지 않는다.
 * 각 섹션의 Overview는 그 섹션의 입구이지 순서상의 한 문서가 아니므로 목록에서 뺀다.
 */
export function findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink } {
  const section = findSection(pathname)
  if (pathname === section.to) return { prev: undefined, next: undefined }

  const docs = flattenDocs(section.items).filter((item) => item.to !== section.to)
  const index = docs.findIndex((doc) => doc.to === pathname)
  if (index === -1) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? docs[index - 1] : undefined,
    next: index < docs.length - 1 ? docs[index + 1] : undefined,
  }
}
