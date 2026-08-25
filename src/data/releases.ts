export type ReleaseChange = {
  name: string
  note: string
  type: 'New' | 'Updated'
  icon: string
}

export type ReviewItem = {
  label: string
  category: string
  completed?: boolean
}

export const currentRelease = {
  version: 'v0.1.0',
  title: '첫 번째 기준선이 준비됐어요',
  description: '토큰, 기본 컴포넌트, 데이터 조회 패턴을 기준으로 삼았습니다.',
  publishedAt: '방금 전',
  changes: [
    { name: 'DataTable', note: '행 상태와 밀도 규칙을 추가했어요.', type: 'Updated', icon: '↗' },
    { name: 'FilterBar', note: '검색과 필터의 기본 패턴이에요.', type: 'New', icon: '+' },
    { name: 'EmptyState', note: '목록 화면의 빈 결과를 정리했어요.', type: 'New', icon: '+' },
  ] satisfies ReleaseChange[],
  reviewItems: [
    { label: 'Empty state의 첫 행동 문구', category: 'Components', completed: true },
    { label: 'Mobile에서 테이블 액션 노출', category: 'Patterns' },
    { label: '위험 액션의 확인 단계', category: 'Guideline' },
  ] satisfies ReviewItem[],
}
