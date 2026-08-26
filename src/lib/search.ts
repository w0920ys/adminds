export type SearchKind = 'component' | 'doc' | 'token'

export type SearchRecord = {
  /** 이동할 경로 */
  to: string
  kind: SearchKind
  /** 결과 한 줄의 제목 */
  title: string
  /** 제목 위 경로. LNB 묶음을 여기에 실어 결과에서도 갈래가 보이게 한다 */
  breadcrumb: string[]
  /** 사람이 실제로 치는 다른 이름들 */
  keywords: string[]
  /** 한 줄 설명 */
  summary?: string
  /**
   * 문서 안에서 이름을 가진 것들 — 절 제목, 속성 이름, 옵션 값.
   * 본문과 나누는 이유는 'destructive'가 Button의 옵션 이름일 때와
   * 남의 설명에 스쳐 지나갈 때의 무게가 같으면 안 되기 때문이다.
   */
  terms?: string[]
  /** 본문. 스니펫도 여기서 잘라낸다 */
  body?: string
  updatedAt?: string
}

export type SearchHit = SearchRecord & {
  score: number
  /** 매치 지점을 가운데 둔 발췌. [앞, 매치, 뒤] */
  snippet?: [string, string, string]
}

export type SearchGroup = { kind: SearchKind; label: string; hits: SearchHit[] }

export const KIND_LABEL: Record<SearchKind, string> = {
  component: '컴포넌트',
  doc: '문서',
  token: '토큰',
}

const KIND_ORDER: SearchKind[] = ['component', 'doc', 'token']

/**
 * 질의와 문서를 같은 모양으로 눕힌다.
 * 공백과 하이픈을 지우는 이유는 'drop down menu'와 'DropdownMenu'가
 * 사람에게는 같은 말이기 때문이다. 형태소 분석은 하지 않는다 — 문서가
 * 수십 개뿐이라 부분 문자열로 충분하고, 분석기는 틀릴 때 설명이 안 된다.
 */
export function normalize(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/[\s-_/]+/g, '')
}

/** 질의를 낱말로 가른다. 낱말은 모두 만족해야 한다(AND) */
export function tokenize(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean)
}

/** 완전일치 3 · 접두 2 · 부분 1. 접두에 가산점을 주어 'sep'이 Separator를 위로 올린다 */
function matchScore(text: string, token: string): number {
  const target = normalize(text)
  if (!target) return 0
  if (target === token) return 3
  if (target.startsWith(token)) return 2
  return target.includes(token) ? 1 : 0
}

function bestOf(texts: string[], token: string): number {
  return texts.reduce((best, text) => Math.max(best, matchScore(text, token)), 0)
}

/** 필드마다 무게가 다르다 — 이름으로 걸린 것이 본문으로 걸린 것보다 늘 위다 */
const WEIGHT = { title: 10, keywords: 9, terms: 6, summary: 5, body: 2 } as const

/*
 * 한 글자 질의는 본문을 보지 않는다.
 * '색'은 '검색'·'채색' 안에도 들어 있어서, 본문까지 뒤지면 Color 문서 대신
 * 본문에 '검색'이 스친 컴포넌트들이 앞을 채운다. 이름·별칭·용어·한 줄 설명은
 * 짧고 의도가 분명하므로 한 글자로도 계속 걸린다.
 */
const BODY_MIN_LENGTH = 2

export function scoreRecord(record: SearchRecord, tokens: string[]): number {
  let total = 0
  for (const token of tokens) {
    const best = Math.max(
      matchScore(record.title, token) * WEIGHT.title,
      bestOf(record.keywords, token) * WEIGHT.keywords,
      bestOf(record.terms ?? [], token) * WEIGHT.terms,
      matchScore(record.summary ?? '', token) * WEIGHT.summary,
      token.length >= BODY_MIN_LENGTH ? matchScore(record.body ?? '', token) * WEIGHT.body : 0,
    )
    // 낱말 하나라도 어디에도 없으면 이 문서는 답이 아니다
    if (best === 0) return 0
    total += best
  }
  return total
}

/**
 * 매치 지점을 가운데 둔 발췌.
 * normalize는 공백을 지워 원문 위치를 잃으므로 여기서는 원문 그대로 찾는다.
 * 그래서 'drop down'처럼 띄어 친 질의는 발췌를 못 잡는데, 그때는 발췌 없이
 * 제목만 보여준다 — 틀린 자리를 강조하는 것보다 낫다.
 */
export function makeSnippet(body: string, token: string): [string, string, string] | undefined {
  const at = body.toLowerCase().indexOf(token)
  if (at === -1) return undefined

  const from = Math.max(0, at - 30)
  const to = Math.min(body.length, at + token.length + 90)
  return [
    (from > 0 ? '…' : '') + body.slice(from, at),
    body.slice(at, at + token.length),
    body.slice(at + token.length, to) + (to < body.length ? '…' : ''),
  ]
}

/**
 * 종류별로 묶어 돌려준다.
 * 묶는 이유는 질의가 두 종류이기 때문이다 — 이름을 알고 그 문서로 가려는 사람과,
 * 설명을 찾는 사람. 앞의 것이 뒤의 것에 묻히면 검색이 쓸모없어진다.
 */
export function search(
  query: string,
  records: SearchRecord[],
  limitPerKind = 5,
): SearchGroup[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const hits: SearchHit[] = []
  for (const record of records) {
    const score = scoreRecord(record, tokens)
    if (score === 0) continue
    hits.push({
      ...record,
      score,
      snippet: record.body ? makeSnippet(record.body, tokens[0]) : undefined,
    })
  }

  /*
   * 동점이면 이름순이다. 최신순으로 갈랐더니 'destructive'에서 Button이
   * 다른 컴포넌트에 밀려 5개 밖으로 떨어졌다 — 최신은 관련도가 아니다.
   * 최신 문서는 빈 검색창의 '최근 갱신'이 이미 맡고 있다.
   */
  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))

  return KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_LABEL[kind],
    hits: hits.filter((hit) => hit.kind === kind).slice(0, limitPerKind),
  })).filter((group) => group.hits.length > 0)
}
