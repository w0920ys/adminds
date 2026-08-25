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
    version: 'v0.4.0',
    publishedAt: '2026-08-25',
    title: '토큰 문서를 완성했어요',
    purpose:
      'Anatomy 지시선과 예시 화면을 다듬고, Design Token·Color Role·Palette 문서를 새로 만들어 토큰 체계를 한 바퀴 완성한다.',
    changes: [
      { target: 'Anatomy', type: 'Updated', note: '지시선 색과 굵기를 다듬고 좁은 화면에서도 겹치지 않게 고쳤어요.' },
      { target: 'ComponentPage', type: 'Updated', note: 'Variant 표와 Size 표를 따로 나눴어요.' },
      { target: 'Playground', type: 'New', note: '조합을 기본값으로 되돌리는 리셋 버튼을 추가했어요.' },
      { target: '컴포넌트 예시', type: 'New', note: '실제 화면을 흉내 낸 예시를 15개 늘렸어요.' },
      { target: 'DocPage', type: 'New', note: '최종 수정일 표시와 섹션 안에서 바로 이동하는 기능을 더했어요.' },
      { target: 'Design Token / Color Role / Palette', type: 'New', note: '토큰 체계를 다루는 문서 3개를 새로 만들었어요.' },
      { target: 'CopyValue', type: 'New', note: '토큰 값을 클릭 한 번에 복사하는 기능을 더했어요.' },
      { target: 'Pretendard / Typography', type: 'Updated', note: '폰트 스택 설명과 타이포그래피 문서를 확장했어요.' },
    ],
    requests: [
      { label: '지시선 색과 굵기, 좁은 화면 대응을 개선해주세요', done: true },
      { label: 'Variant와 Size 표를 나눠주세요', done: true },
      { label: 'Playground에 리셋 버튼을 추가해주세요', done: true },
      { label: '컴포넌트 예시 화면을 더 다양하게 보여주세요', done: true },
      { label: '토큰이 언제 마지막으로 바뀌었는지, 섹션 안에서 바로 이동할 방법도 알려주세요', done: true },
      { label: 'Design Token과 Color Role, Palette 문서를 새로 만들어주세요', done: true },
      { label: '토큰 값을 클릭해서 복사할 수 있게 해주세요', done: true },
      { label: 'Pretendard와 Typography 문서를 더 자세히 다뤄주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: "PropertyBlock의 property.name === 'state' 하드코딩을 데이터 쪽으로 옮길 수 있는가", category: 'Components', completed: false },
      { label: 'Anatomy의 배지 좌표를 매번 다시 계산하지 않고 기억해 둘 수 있는가', category: 'Components', completed: false },
      { label: 'nav-config의 updatedAt을 문서별로 자동 갱신하는 구조가 필요한가', category: 'Patterns', completed: false },
    ],
    impact: ['Foundations', 'Components', 'Anatomy', 'Typography'],
  },
  {
    version: 'v0.3.0',
    publishedAt: '2026-08-25',
    title: 'GNB와 LNB로 문서 골격을 세웠어요',
    purpose:
      'GNB+LNB 2단 내비게이션과 property 축 구조로 문서 골격을 세우고, Foundations를 8개로 채운다.',
    changes: [
      { target: 'GNB / LNB', type: 'New', note: '섹션은 GNB, 문서 목록은 LNB로 나눈 2단 내비게이션을 만들었어요.' },
      { target: 'Foundations', type: 'New', note: '문서 8개를 채웠어요.' },
      { target: 'ComponentProperty', type: 'New', note: 'variant·size 같은 축을 컴포넌트 메타에서 선언하는 구조를 세웠어요.' },
      { target: 'Anatomy', type: 'New', note: '부위를 가리키는 지시선과 클릭하면 강조되는 상호작용을 더했어요.' },
      { target: 'ComponentPage', type: 'New', note: 'Playground·Usage·Cases 섹션을 붙였어요.' },
    ],
    requests: [
      { label: '섹션과 문서 목록을 나눠서 보여주세요', done: true },
      { label: 'Foundations 문서를 더 채워주세요', done: true },
      { label: 'variant·size 같은 축을 컴포넌트마다 정리해주세요', done: true },
      { label: 'anatomy에 부위를 가리키는 지시선을 그려주세요', done: true },
      { label: 'Playground에서 조합을 바로 확인하게 해주세요', done: true },
    ],
    reviewItems: [
      { label: '지시선이 다크 모드에서 색이 흐려 보이는가', category: 'Components', completed: true },
      { label: '좁은 화면에서 지시선끼리 겹치는가', category: 'Components', completed: true },
      { label: 'Variant와 Size 표가 한 표에 섞여 읽기 어려운가', category: 'Components', completed: true },
    ],
    impact: ['전체 화면', 'Foundations', 'Components'],
  },
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
