export type DocLink = {
  to: string
  label: string
  /** 문서 최종 수정일. YYYY-MM-DD */
  updatedAt: string
  /** LNB에서 이 항목 아래 들여쓰기로 놓이는 하위 문서. 순서에서는 부모 바로 뒤에 온다 */
  children?: DocLink[]
}

export type NavSection = {
  id: string
  /** GNB에 표시되는 이름 */
  label: string
  /** 섹션 진입 경로. 자기 Overview와 같다 */
  to: string
  /** LNB 목록. 첫 항목은 항상 Overview */
  items: DocLink[]
}

/** 문서 내용을 고칠 때 그 항목의 updatedAt도 함께 갱신한다. */
export const sections: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get started',
    to: '/',
    items: [
      { to: '/', label: 'Overview', updatedAt: '2026-08-25' },
      { to: '/get-started/install', label: 'Install', updatedAt: '2026-08-25' },
      { to: '/get-started/principles', label: 'Principles', updatedAt: '2026-08-25' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    to: '/foundations',
    items: [
      { to: '/foundations', label: 'Overview', updatedAt: '2026-08-25' },
      { to: '/foundations/design-token', label: 'Design Token', updatedAt: '2026-08-25' },
      {
        to: '/foundations/color',
        label: 'Color',
        updatedAt: '2026-08-25',
        children: [
          { to: '/foundations/color-role', label: 'Color Role', updatedAt: '2026-08-25' },
          { to: '/foundations/palette', label: 'Palette', updatedAt: '2026-08-25' },
        ],
      },
      { to: '/foundations/typography', label: 'Typography', updatedAt: '2026-08-25' },
      { to: '/foundations/spacing', label: 'Spacing', updatedAt: '2026-08-25' },
      { to: '/foundations/iconography', label: 'Iconography', updatedAt: '2026-08-25' },
      { to: '/foundations/state', label: 'State', updatedAt: '2026-08-25' },
      { to: '/foundations/voice-and-tone', label: 'Voice and Tone', updatedAt: '2026-08-25' },
      { to: '/foundations/writing', label: 'Writing', updatedAt: '2026-08-25' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    to: '/components',
    items: [
      { to: '/components', label: 'Overview', updatedAt: '2026-08-25' },
      { to: '/components/button', label: 'Button', updatedAt: '2026-08-25' },
      { to: '/components/input', label: 'Input', updatedAt: '2026-08-25' },
      { to: '/components/select', label: 'Select', updatedAt: '2026-08-25' },
      { to: '/components/checkbox', label: 'Checkbox', updatedAt: '2026-08-25' },
      { to: '/components/radio', label: 'Radio', updatedAt: '2026-08-26' },
      { to: '/components/switch', label: 'Switch', updatedAt: '2026-08-26' },
      { to: '/components/textarea', label: 'Textarea', updatedAt: '2026-08-26' },
      { to: '/components/tabs', label: 'Tabs', updatedAt: '2026-08-26' },
      { to: '/components/breadcrumb', label: 'Breadcrumb', updatedAt: '2026-08-26' },
      { to: '/components/pagination', label: 'Pagination', updatedAt: '2026-08-26' },
      { to: '/components/alert', label: 'Alert', updatedAt: '2026-08-26' },
      { to: '/components/tooltip', label: 'Tooltip', updatedAt: '2026-08-26' },
      { to: '/components/badge', label: 'Badge', updatedAt: '2026-08-26' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    to: '/patterns',
    items: [{ to: '/patterns', label: 'Overview', updatedAt: '2026-08-25' }],
  },
  {
    id: 'updates',
    label: 'Updates',
    to: '/updates',
    items: [{ to: '/updates', label: 'Overview', updatedAt: '2026-08-25' }],
  },
]

/** 부모 다음에 자식이 오도록 평탄화한다. 순서가 필요한 곳은 모두 이것을 쓴다. */
export function flattenDocs(items: DocLink[]): DocLink[] {
  return items.flatMap((item) => [item, ...flattenDocs(item.children ?? [])])
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
