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
    version: 'v0.6.0',
    publishedAt: '2026-08-25',
    title: '구조를 가리키는 이름을 다시 영문으로 돌렸어요',
    purpose:
      'v0.5.0에서 섹션 제목을 전부 한국어로 통일했는데, 결과를 본 사용자가 방향을 뒤집었어요. 구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리하고, 목차·간격·footer 같은 읽는 경험도 함께 다듬었어요.',
    changes: [
      { target: 'Writing / 섹션 제목', type: 'Updated', note: '구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리했어요. Writing 문서의 Language 절도 새 규칙으로 다시 썼어요.' },
      { target: 'Anatomy', type: 'Fixed', note: '지시선이 부위 가장자리에서 꺾이도록 고쳐 서로 겹치지 않게 했어요.' },
      { target: 'HeadingAnchor', type: 'New', note: '제목에 마우스를 올리면 그 절의 주소를 복사하는 아이콘이 나타나요.' },
      { target: 'AppShell / TableOfContents', type: 'Updated', note: '목차를 main 안에 sticky로 옮기고 스크롤바를 감췄고, 스크롤을 다루는 코드를 한 모듈로 모아 해시 안착과 문서 전환 위치를 고쳤어요.' },
      { target: 'DocPage / ComponentPage', type: 'Updated', note: '섹션 사이 간격을 넓히고, LNB 하위 항목의 모서리를 없앴어요.' },
      { target: 'Foundations / Components Overview', type: 'New', note: '카드 목록 위에 그 섹션이 무엇을 다루는지 설명하는 개요를 실었어요.' },
      { target: 'SiteFooter', type: 'New', note: '모든 페이지 최하단에 저작권·메뉴·연락처를 담은 footer를 추가했어요.' },
      { target: 'PropertyOption', type: 'Fixed', note: '값이 남지 않은 label 필드와 optionLabel 함수를 지웠어요.' },
    ],
    requests: [
      { label: '구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리해주세요', done: true },
      { label: 'Anatomy 지시선이 겹치지 않게 고쳐주세요', done: true },
      { label: '제목에서 그 절의 주소를 복사할 수 있게 해주세요', done: true },
      { label: '목차를 컨테이너 위에 sticky로 붙이고 스크롤바는 감춰주세요', done: true },
      { label: 'LNB 하위 항목의 모서리를 없애고 섹션 사이 간격을 넓혀주세요', done: true },
      { label: 'Overview 페이지에 그 섹션의 개요를 실어주세요', done: true },
      { label: '모든 페이지에 footer를 넣어주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '해시로 안착한 뒤 문서가 자라는 동안 사용자가 직접 스크롤하면 그 조작이 다시 덮어써지는가', category: 'Patterns', completed: false },
    ],
    impact: ['전체 화면', 'Foundations', 'Components', 'Patterns'],
  },
  {
    version: 'v0.5.0',
    publishedAt: '2026-08-25',
    title: '읽는 경험을 다듬었어요',
    purpose:
      '문서가 늘어나면서 드러난 문제들을 손봤어요. 섹션 제목을 한국어로 통일하고 제목 위계를 세우고, 목차를 붙이고, 지침의 do와 don\'t를 한데 묶고, Color의 하위 문서를 LNB에서 들여썼어요.',
    changes: [
      { target: 'Writing / 섹션 제목', type: 'Updated', note: '섹션 제목을 한국어로 통일하고, 이 규칙을 Writing 문서에 적었어요. 페이지 이름과 코드 식별자만 영어로 남겼어요.' },
      { target: 'DocPage / ComponentPage', type: 'Updated', note: '섹션 제목 크기를 본문보다 크게 키워 위계를 세웠어요.' },
      { target: 'TableOfContents', type: 'New', note: 'PC 화면 오른쪽에 문서 목차를 추가했어요. 스크롤하면 현재 위치가 따라 강조돼요.' },
      { target: 'GuidelineBlock', type: 'Updated', note: "지침의 do와 don't를 하나의 열로 묶고 같은 줄의 높이를 맞췄어요." },
      { target: 'Lnb / nav-config', type: 'Updated', note: 'Color Role과 Palette를 Color 아래로 들여썼어요.' },
      { target: 'PropertyBlock', type: 'Updated', note: '속성 표 헤더와 옵션 라벨 크기를 제목 위계에 맞췄어요.' },
    ],
    requests: [
      { label: '한 페이지 안에서 한글과 영어가 섞이지 않게 해주세요', done: true },
      { label: '섹션 제목이 본문보다 작아 보이는 문제를 고쳐주세요', done: true },
      { label: '긴 문서에서 지금 어디를 읽고 있는지 알려주세요', done: true },
      { label: "지침의 do와 don't가 따로 노는 것처럼 보이지 않게 해주세요", done: true },
      { label: 'Color Role과 Palette가 Color의 하위 문서라는 것을 목록에서도 보여주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '섹션 제목을 전부 한국어로 통일한 방향이 실제 기대와 맞는가', category: 'Foundations', completed: false },
    ],
    impact: ['전체 화면', 'Foundations', 'Components'],
  },
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
