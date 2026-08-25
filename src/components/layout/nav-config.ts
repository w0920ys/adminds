export type DocLink = {
  to: string
  label: string
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

export const sections: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get started',
    to: '/',
    items: [
      { to: '/', label: 'Overview' },
      { to: '/get-started/install', label: '설치' },
      { to: '/get-started/principles', label: '원칙' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    to: '/foundations',
    items: [
      { to: '/foundations', label: 'Overview' },
      { to: '/foundations/color', label: 'Color' },
      { to: '/foundations/typography', label: 'Typography' },
      { to: '/foundations/spacing', label: 'Spacing' },
      { to: '/foundations/iconography', label: 'Iconography' },
      { to: '/foundations/state', label: 'State' },
      { to: '/foundations/voice-and-tone', label: 'Voice and Tone' },
      { to: '/foundations/writing', label: 'Writing' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    to: '/components',
    items: [
      { to: '/components', label: 'Overview' },
      { to: '/components/button', label: 'Button' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    to: '/patterns',
    items: [{ to: '/patterns', label: 'Overview' }],
  },
  {
    id: 'updates',
    label: 'Updates',
    to: '/updates',
    items: [{ to: '/updates', label: 'Overview' }],
  },
]

/**
 * LNB 순서를 평탄화한 선형 문서 목록.
 * 페이지 하단의 이전/다음이 여기서 나오며, 섹션 경계를 넘어 이어진다.
 */
export const docOrder: DocLink[] = sections.flatMap((section) => section.items)

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

export function findAdjacent(pathname: string): { prev?: DocLink; next?: DocLink } {
  const index = docOrder.findIndex((doc) => doc.to === pathname)
  if (index === -1) return { prev: undefined, next: undefined }
  return {
    prev: index > 0 ? docOrder[index - 1] : undefined,
    next: index < docOrder.length - 1 ? docOrder[index + 1] : undefined,
  }
}
