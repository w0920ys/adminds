export type ReleaseChange = {
  target: string
  type: 'New' | 'Updated' | 'Fixed'
  note: string
}

export type ReleaseRequest = {
  label: string
  done: boolean
}

export type ReviewItem = {
  label: string
  category: string
  completed: boolean
}

export type Release = {
  version: string
  publishedAt: string
  title: string
  purpose: string
  changes: ReleaseChange[]
  requests: ReleaseRequest[]
  reviewItems: ReviewItem[]
  impact: string[]
}

/** 최신 버전이 배열의 맨 앞이다. */
export const releases: Release[] = [
  {
    version: 'v0.2.0',
    publishedAt: '2026-08-25',
    title: '토큰과 컴포넌트 배관을 연결했어요',
    purpose: 'Tailwind v4 + shadcn 기반으로 재작성하고, 메타데이터에서 전시 화면이 생성되는 구조를 세운다.',
    changes: [
      { target: 'Tokens', type: 'New', note: '색·radius·shadow·density·z-index를 한 곳에 모았어요.' },
      { target: 'AppShell', type: 'New', note: '사이드바 항목이 실제로 이동합니다.' },
      { target: 'Button', type: 'New', note: 'shadcn Button과 전시 페이지를 붙였어요.' },
      { target: 'Registry', type: 'New', note: '컴포넌트 메타에서 전시 화면이 자동 생성됩니다.' },
    ],
    requests: [
      { label: '컴포넌트 anatomy 표시', done: true },
      { label: '반응형 고려', done: true },
      { label: '새 버전 업데이트 알림', done: false },
    ],
    reviewItems: [
      { label: 'StateGrid의 hover 강제 표현이 실제 hover와 일치하는가', category: 'Components', completed: false },
      { label: '다크 모드에서 surface-raised 대비가 충분한가', category: 'Foundations', completed: false },
      { label: '720px에서 전시 그리드가 깨지지 않는가', category: 'Patterns', completed: false },
    ],
    impact: ['전체 화면', 'Button', 'Foundations'],
  },
  {
    version: 'v0.1.0',
    publishedAt: '2026-08-24',
    title: '첫 번째 기준선이 준비됐어요',
    purpose: '어드민 워크벤치의 첫 화면을 만들어 방향을 확인한다.',
    changes: [
      { target: 'Overview', type: 'New', note: '디자인 시스템 현황 화면을 만들었어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Overview'],
  },
]

export const currentRelease: Release = releases[0]

export function requestProgress(release: Release) {
  return {
    done: release.requests.filter((r) => r.done).length,
    total: release.requests.length,
  }
}
