import { flattenDocs, sections } from '@/components/layout/nav-config'
import { patterns, type PatternMeta } from '@/data/patterns'
import { categoryLabel, components } from '@/data/registry'
import type { SearchRecord } from '@/lib/search'
import { parseTokenNames } from '@/lib/tokens'
import tokensCss from '@/styles/tokens.css?raw'

/**
 * 검색 인덱스.
 *
 * 따로 굽지 않고 registry와 nav-config에서 그때그때 만든다 — 이미 번들에 있는
 * 데이터이고 60건 남짓이라, 빌드 단계를 하나 늘려 얻을 것이 없다.
 *
 * 문서가 아니라 절 단위로 쪼개는 것은 아직 하지 않았다. 절 앵커는 화면에
 * 그려진 제목 순서에서 정해지므로 여기서 다시 계산하면 어긋날 수 있고,
 * 어긋난 앵커는 없는 앵커보다 나쁘다. 컴포넌트 본문은 아래처럼 한 덩이로
 * 넣어 두었으므로 절의 내용으로도 그 컴포넌트는 찾힌다.
 */

type Meta = (typeof components)[number]

/**
 * 이름을 가진 것들 — 옵션 값 'destructive'는 남의 설명에 스친 'destructive'보다 무겁다.
 * usage·cases의 제목은 여기 넣지 않는다. '검색 결과에서 들어간 경우'처럼 이름이 아니라
 * 상황을 적은 문장이라, 무겁게 달면 '색' 한 글자가 Breadcrumb을 Color 위로 올린다.
 */
function componentTerms(meta: Meta): string[] {
  return [
    ...meta.anatomy.map((part) => part.label),
    ...meta.properties.flatMap((property) => [
      property.title,
      ...property.options.map((option) => option.value),
    ]),
    ...meta.guidelines.map((guideline) => guideline.title),
  ]
}

/** 컴포넌트 문서 안의 글을 한 덩이로 잇는다. 스니펫도 여기서 잘린다 */
function componentBody(meta: Meta): string {
  return [
    meta.purpose,
    ...meta.anatomy.map((part) => part.note),
    ...meta.properties.flatMap((property) => [
      property.description,
      ...property.options.map((option) => option.note ?? ''),
    ]),
    ...meta.guidelines.flatMap((guideline) => [
      guideline.title,
      guideline.body,
      ...(guideline.do ?? []),
      ...(guideline.dont ?? []),
    ]),
    ...[...meta.usage, ...meta.cases].flatMap((example) => [example.title, example.note]),
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * 패턴 문서 안의 이름 가진 것들 — 자리 이름과 지침 제목.
 * cases의 제목은 componentTerms와 같은 이유로 뺀다. '하나 삭제'처럼 이름이
 * 아니라 경우를 적은 말이라, 무겁게 달면 엉뚱한 한 글자에 걸린다.
 */
function patternTerms(meta: PatternMeta): string[] {
  return [
    ...meta.structure.map((step) => step.slot),
    ...meta.guidelines.map((guideline) => guideline.title),
  ]
}

/** 패턴 문서 안의 글을 한 덩이로 잇는다. 스니펫도 여기서 잘린다 */
function patternBody(meta: PatternMeta): string {
  return [
    meta.purpose,
    ...meta.structure.map((step) => step.note),
    ...meta.guidelines.flatMap((guideline) => [
      guideline.title,
      guideline.body,
      ...(guideline.do ?? []),
      ...(guideline.dont ?? []),
    ]),
    meta.example.title,
    meta.example.note,
    ...meta.cases.flatMap((example) => [example.title, example.note]),
  ]
    .filter(Boolean)
    .join(' ')
}

const docsByPath = new Map(
  sections.flatMap((section) =>
    flattenDocs(section.items).map((doc) => [doc.to, { doc, section }] as const),
  ),
)

const componentRecords: SearchRecord[] = components.map((meta) => ({
  to: `/components/${meta.id}`,
  kind: 'component',
  title: meta.name,
  breadcrumb: ['Components', categoryLabel[meta.category]],
  keywords: [meta.id, ...meta.aliases, categoryLabel[meta.category]],
  summary: meta.purpose,
  terms: componentTerms(meta),
  body: componentBody(meta),
  updatedAt: docsByPath.get(`/components/${meta.id}`)?.doc.updatedAt,
}))

/**
 * 패턴 문서.
 *
 * nav-config만으로도 제목과 한 줄 설명은 실리지만, 그 길로는 patterns.ts의
 * aliases가 인덱스에 닿지 않는다. '빈 상태'로 찾으면 Empty State 컴포넌트만
 * 나오고 그 경우를 다루는 패턴은 나오지 않았다. 그래서 컴포넌트와 같은 모양으로
 * 자기 데이터에서 직접 만든다.
 *
 * kind는 'doc'이다. 종류를 하나 더 만들면 검색 결과의 묶음이 넷으로 늘어나는데,
 * 패턴은 읽는 사람에게 문서지 다른 갈래가 아니다.
 */
const patternRecords: SearchRecord[] = patterns.map((meta) => ({
  to: `/patterns/${meta.id}`,
  kind: 'doc' as const,
  title: meta.name,
  breadcrumb: ['Patterns'],
  keywords: [meta.id, ...meta.aliases, 'Patterns'],
  summary: meta.purpose,
  terms: patternTerms(meta),
  body: patternBody(meta),
  updatedAt: docsByPath.get(`/patterns/${meta.id}`)?.doc.updatedAt,
}))

/** 자기 데이터로 이미 실린 문서. 아래에서 다시 싣지 않는다 */
const richPaths = new Set(patternRecords.map((record) => record.to))

/**
 * 컴포넌트·패턴 문서를 뺀 나머지 문서.
 * Foundations 본문은 JSX 안에 있어 정적으로 긁을 수 없으므로 제목과 한 줄
 * 설명만 싣는다. 본문까지 걸리게 하려면 문서 저작 방식부터 바꿔야 한다.
 */
const docRecords: SearchRecord[] = [...docsByPath.values()]
  .filter(({ doc }) => !doc.to.startsWith('/components/') && !richPaths.has(doc.to))
  .map(({ doc, section }) => ({
    to: doc.to,
    kind: 'doc' as const,
    title: doc.label === 'Overview' ? `${section.label} Overview` : doc.label,
    breadcrumb: [section.label],
    keywords: [doc.label, section.label],
    summary: doc.summary,
    updatedAt: doc.updatedAt,
  }))

/** 토큰이 어느 문서에 사는가. 나머지는 전체 목록이 있는 Design Token으로 보낸다 */
const TOKEN_HOME: { prefix: string; to: string; label: string }[] = [
  { prefix: '--color-', to: '/foundations/palette', label: 'Palette' },
  { prefix: '--spacing-', to: '/foundations/spacing', label: 'Spacing' },
  { prefix: '--radius-', to: '/foundations/spacing', label: 'Spacing' },
  { prefix: '--text-', to: '/foundations/typography', label: 'Typography' },
  { prefix: '--shadow-', to: '/foundations/design-token', label: 'Design Token' },
  { prefix: '--z-index-', to: '/foundations/design-token', label: 'Design Token' },
]

const tokenRecords: SearchRecord[] = TOKEN_HOME.flatMap(({ prefix, to, label }) =>
  parseTokenNames(tokensCss, prefix).map((cssVar) => ({
    to,
    kind: 'token' as const,
    title: cssVar,
    breadcrumb: ['Foundations', label],
    // 접두사를 뗀 이름도 넣는다 — 사람은 'destructive'라고 치지 '--color-destructive'라고 치지 않는다
    keywords: [cssVar.slice(prefix.length), prefix.replace(/^--|-$/g, '')],
  })),
)

export const searchIndex: SearchRecord[] = [
  ...componentRecords,
  ...patternRecords,
  ...docRecords,
  ...tokenRecords,
]

/** 빈 검색창에 보여줄 것. 전체 목록 대신 방금 바뀐 문서를 보인다 */
export const recentDocs: SearchRecord[] = [...componentRecords, ...patternRecords, ...docRecords]
  .filter((record) => record.updatedAt)
  .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
  .slice(0, 5)
