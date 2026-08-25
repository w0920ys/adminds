export type ComponentCategory =
  | 'actions'
  | 'inputs'
  | 'navigation'
  | 'feedback'
  | 'data-display'

export type ComponentStatus = 'draft' | 'review' | 'stable' | 'deprecated'

export type AnatomyPart = {
  /** 해부도에 표시할 부위 이름 */
  part: string
  /** 치수·역할 설명 */
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
  guidelines: { do: string[]; dont: string[] }
  anatomy: AnatomyPart[]
  variants: string[]
  sizes: string[]
  states: string[]
  verified: boolean
}

export const components: ComponentMeta[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'actions',
    status: 'stable',
    addedIn: 'v0.2.0',
    changedIn: 'v0.2.0',
    purpose: '사용자가 즉시 실행할 수 있는 동작을 나타낸다. 페이지 이동은 링크를 쓴다.',
    guidelines: {
      do: [
        '한 화면의 주요 액션은 default 하나로 제한한다',
        '삭제·차단처럼 되돌리기 어려운 동작은 destructive를 쓴다',
        '처리에 시간이 걸리면 loading 상태로 중복 클릭을 막는다',
      ],
      dont: [
        '다른 페이지로 이동하는 데 버튼을 쓰지 않는다',
        '아이콘만 있는 버튼에 aria-label을 빠뜨리지 않는다',
        '나란히 놓인 버튼을 모두 default로 두지 않는다',
      ],
    },
    anatomy: [
      { part: 'Container', note: '높이는 size 토큰, 모서리는 radius-md' },
      { part: 'Leading icon', note: '16×16, 라벨과 8px 간격' },
      { part: 'Label', note: 'text-sm / font-medium' },
      { part: 'Focus ring', note: 'ring 토큰, 오프셋 2px' },
    ],
    variants: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    sizes: ['sm', 'default', 'lg', 'icon'],
    states: ['default', 'hover', 'focus', 'disabled', 'loading'],
    verified: true,
  },
]

export function getComponent(id: string): ComponentMeta | undefined {
  return components.find((c) => c.id === id)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return components.filter((c) => c.category === category)
}

export function componentStats() {
  return {
    total: components.length,
    verified: components.filter((c) => c.verified).length,
    stable: components.filter((c) => c.status === 'stable').length,
  }
}
