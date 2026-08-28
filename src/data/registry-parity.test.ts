import { describe, expect, it } from 'vitest'
import registryJson from '../../registry.json'
import { components } from '@/data/registry'

/**
 * registry.ts(문서 쪽 메타)와 registry.json(shadcn 레지스트리)이 서로 어긋나면
 * 조용히 갈라진다 — registry.ts에만 있으면 shadcn CLI로 받을 수 없고,
 * registry.json에만 있으면 문서에 닿지 않는 죽은 항목이 남는다. 두 방향을 함께 지킨다.
 */

const registryItems = registryJson.items as {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  docs?: string
  files?: { path: string }[]
}[]
const uiNames = new Set(registryItems.filter((i) => i.type === 'registry:ui').map((i) => i.name))

/*
 * 파일을 node:fs가 아니라 Vite의 ?raw glob으로 읽는다. 이 파일은 src 아래라
 * tsconfig.app.json이 타입을 검사하는데 거기에는 node 타입이 없다(types는
 * vite/client 하나뿐이다). node 타입을 이 파일에서 끌어오면 프로그램 전체에
 * 얹혀 setTimeout 같은 전역의 타입이 함께 바뀐다 — 테스트 하나 때문에 앱
 * 전체의 타입을 흔들지 않으려고 vite/client가 이미 아는 길로 읽는다.
 *
 * glob의 키는 이 모듈 기준 상대 경로다. 게다가 Vite가 그 경로를 한 번
 * 접어 주기 때문에(../../src/lib/x.ts는 ../lib/x.ts로 온다) 문자열을 잘라
 * 내는 대신 실제로 걸어서 저장소 뿌리 기준 경로로 되돌린다 —
 * registry.json이 적는 경로가 그 형태(src/lib/calendar.ts)이기 때문이다.
 */
const THIS_DIR = 'src/data'

function toRepoPath(globKey: string) {
  const segments = THIS_DIR.split('/')
  for (const part of globKey.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }
  return segments.join('/')
}

const asRawMap = (mod: Record<string, unknown>) =>
  new Map(Object.entries(mod).map(([key, value]) => [toRepoPath(key), value as string]))

/** npm run registry가 구워 놓은 payload들 */
const builtPayloads = asRawMap(
  import.meta.glob('../../public/r/*.json', { query: '?raw', import: 'default', eager: true }),
)

/** registry.json이 가리킬 수 있는 소스 전부 */
const sourceFiles = asRawMap(
  import.meta.glob('../../src/**/*.{ts,tsx,css}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
)

/** 구운 payload의 파일 한 칸. content가 없을 수 있는 것까지 타입으로 인정하고 아래에서 잡는다 */
type BuiltFile = { path?: string; content?: string }

describe('registry.ts와 registry.json', () => {
  it('모든 컴포넌트가 레지스트리 항목을 갖는다', () => {
    const missing = components.map((c) => c.id).filter((id) => !uiNames.has(id))
    expect(missing, '레지스트리에 빠진 컴포넌트').toEqual([])
  })

  it('모든 registry:ui 항목이 문서 컴포넌트를 갖는다', () => {
    const componentIds = new Set(components.map((c) => c.id))
    const orphaned = [...uiNames].filter((name) => !componentIds.has(name))
    expect(orphaned, 'registry.ts에 없는 registry:ui 항목').toEqual([])
  })

  it('묶음 항목이 모든 컴포넌트를 가리킨다', () => {
    const bundle = registryItems.find((i) => i.name === 'adminds')!
    const referenced = new Set((bundle.registryDependencies ?? []).map((u) => u.split('/').pop()!.replace('.json', '')))
    const missing = components.map((c) => c.id).filter((id) => !referenced.has(id))
    expect(missing, '묶음에서 빠진 컴포넌트').toEqual([])
  })
})

/**
 * 위의 셋은 '항목이 있는가'만 본다. 그것만으로는 구운 payload가 낡은 것을
 * 잡지 못한다 — registry.json에 항목이 그대로 있고 public/r/*.json도 그대로
 * 있는데, 그 안에 박힌 코드만 옛것인 상태가 얼마든지 가능하다.
 *
 * public/r/*.json은 npm run registry가 소스를 통째로 박아 구운 결과이고,
 * adminds.vercel.app/r/*.json으로 나가 다른 프로젝트가 shadcn add로 받아 가는
 * 것이 바로 그 파일이다. 소스만 고치고 다시 굽지 않으면 고친 적 없는 코드가
 * 계속 배포된다. 실제로 접근성 수정 네 건이 그렇게 새어 나갔다.
 *
 * 그래서 여기서는 payload에 박힌 내용을 디스크의 원본과 바이트로 견준다.
 * 견주지 못한 파일은 조용히 넘기지 않는다 — 원본이 없거나 content가 비었으면
 * 그 자체로 실패이고, 마지막에 '실제로 견준 수'가 registry.json이 선언한 수와
 * 같은지까지 확인한다. 해석이 어긋나 아무것도 견주지 못한 채 통과하는 일이
 * 이 테스트에서 가장 위험한 실패 방식이라서다.
 */
describe('public/r의 구운 payload', () => {
  const declaredFileCount = registryItems.reduce((n, item) => n + (item.files?.length ?? 0), 0)

  it('구운 payload가 소스와 바이트까지 같다', () => {
    const missingPayload: string[] = []
    const fileListMismatch: string[] = []
    const missingSource: string[] = []
    const missingContent: string[] = []
    const stale: string[] = []
    let compared = 0

    for (const item of registryItems) {
      const rawPayload = builtPayloads.get(`public/r/${item.name}.json`)
      if (rawPayload === undefined) {
        missingPayload.push(item.name)
        continue
      }

      const built = JSON.parse(rawPayload) as { files?: BuiltFile[] }
      const bakedFiles = built.files ?? []

      /*
       * 파일 목록부터 견준다. 항목에 파일을 새로 더하고 다시 굽지 않으면
       * 남아 있는 파일들은 멀쩡해서 내용 비교만으로는 통과해 버린다.
       * date-picker처럼 파일이 둘인 항목이 실제로 있다.
       */
      const declared = (item.files ?? []).map((f) => f.path).sort()
      const baked = bakedFiles.map((f) => f.path ?? '(경로 없음)').sort()
      if (declared.join('|') !== baked.join('|')) {
        fileListMismatch.push(`${item.name}: registry.json=[${declared}] payload=[${baked}]`)
        continue
      }

      for (const file of bakedFiles) {
        const label = `${item.name} :: ${file.path ?? '(경로 없음)'}`
        if (!file.path) {
          missingContent.push(label)
          continue
        }
        const onDisk = sourceFiles.get(file.path)
        if (onDisk === undefined) {
          missingSource.push(label)
          continue
        }
        if (typeof file.content !== 'string') {
          missingContent.push(label)
          continue
        }
        compared += 1
        if (file.content !== onDisk) stale.push(label)
      }
    }

    expect(missingPayload, 'public/r에 구운 payload가 없는 항목').toEqual([])
    expect(fileListMismatch, 'registry.json과 payload의 파일 목록이 어긋난 항목').toEqual([])
    expect(missingSource, 'payload가 가리키는 원본이 디스크에 없다').toEqual([])
    expect(missingContent, 'payload에 content가 박히지 않은 파일').toEqual([])
    expect(stale, '소스가 바뀌었는데 다시 굽지 않았다 — npm run registry').toEqual([])

    // 위가 모두 비어도 아무것도 견주지 않았다면 통과가 아니다.
    expect(compared, '실제로 바이트까지 견준 파일 수').toBe(declaredFileCount)
  })

  it('견줄 파일이 실제로 있다', () => {
    // declaredFileCount가 0이면 위 테스트는 아무것도 하지 않고 통과한다.
    expect(declaredFileCount).toBeGreaterThan(0)
  })

  /*
   * 위의 바이트 비교는 files[].content만 본다. 그래서 files가 없는 항목은
   * 루프를 지나가기만 하고 아무것도 지켜지지 않는다 — registry.json에서는
   * adminds(묶음) 하나가 그렇고, 그것이 하필 "이거 하나면 다 받는다"로
   * 안내하는 항목이라 실제로 가장 많이 나가는 payload다. 컴포넌트를 더하고
   * npm run registry를 잊으면 개별 컴포넌트는 바이트 비교에 걸리지만 묶음의
   * registryDependencies는 조용히 낡는다.
   *
   * 그래서 항목의 메타도 함께 견준다. 파일이 있든 없든 모든 항목이 이
   * 비교를 지난다. 여기서도 '아무것도 견주지 않고 통과'를 막으려고 실제로
   * 견준 칸 수를 마지막에 확인한다.
   */
  const META_KEYS = ['type', 'title', 'description', 'dependencies', 'registryDependencies', 'docs'] as const

  it('구운 payload의 항목 메타가 registry.json과 같다', () => {
    const missingPayload: string[] = []
    const mismatched: string[] = []
    let compared = 0

    for (const item of registryItems) {
      const rawPayload = builtPayloads.get(`public/r/${item.name}.json`)
      if (rawPayload === undefined) {
        missingPayload.push(item.name)
        continue
      }

      const built = JSON.parse(rawPayload) as Record<string, unknown>
      for (const key of META_KEYS) {
        // 없는 칸끼리도 같다고 봐야 한다 — description이 없는 항목이 실제로 있다.
        const declared = JSON.stringify(item[key] ?? null)
        const baked = JSON.stringify(built[key] ?? null)
        compared += 1
        if (declared !== baked) {
          mismatched.push(`${item.name}.${key}: registry.json=${declared} payload=${baked}`)
        }
      }
    }

    expect(missingPayload, 'public/r에 구운 payload가 없는 항목').toEqual([])
    expect(mismatched, '항목 메타가 어긋났다 — npm run registry').toEqual([])
    expect(compared, '실제로 견준 메타 칸 수').toBe(registryItems.length * META_KEYS.length)
  })

  it('견줄 항목이 실제로 있다', () => {
    // registryItems가 비면 위 테스트는 아무것도 하지 않고 통과한다.
    expect(registryItems.length).toBeGreaterThan(0)
  })
})

/**
 * 묶음 항목과 README는 "몇 개가 들어 있는가"를 손으로 적는다. 이 숫자는
 * v0.10.0에서 26개로, v0.11.0에서 32개로 두 번 낡았고 두 번 다 사후에 고쳤다.
 * 컴포넌트를 더하는 사람이 고칠 자리를 기억해야 하는 한 세 번째가 온다.
 *
 * 문장을 통째로 못 박지는 않는다 — 문구는 다시 쓸 수 있어야 한다. 문장에서
 * 숫자만 꺼내 components.length와 견준다.
 */
const readmeGlob = import.meta.glob('../../README.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const readme = Object.values(readmeGlob)[0] as string | undefined

/** 토박이말 수사(1~99)를 숫자로 되돌린다. 묶음 설명이 '서른여덟'처럼 적기 때문이다 */
const TENS: Record<string, number> = { 열: 10, 스물: 20, 서른: 30, 마흔: 40, 쉰: 50, 예순: 60, 일흔: 70, 여든: 80, 아흔: 90 }
const ONES: Record<string, number> = { 하나: 1, 한: 1, 둘: 2, 두: 2, 셋: 3, 세: 3, 넷: 4, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9 }

/** '…개' 앞에 붙은 수를 읽는다. 아라비아 숫자도 토박이말 수사도 받는다 */
function readCount(text: string, pattern: RegExp): number | null {
  const found = text.match(pattern)
  if (!found) return null
  const word = found[1]
  if (/^\d+$/.test(word)) return Number(word)
  for (const [tensWord, tens] of Object.entries(TENS)) {
    if (!word.startsWith(tensWord)) continue
    const rest = word.slice(tensWord.length)
    if (rest === '') return tens
    return rest in ONES ? tens + ONES[rest] : null
  }
  return word in ONES ? ONES[word] : null
}

describe('손으로 적은 컴포넌트 개수', () => {
  const bundle = registryItems.find((i) => i.name === 'adminds')!

  it('묶음 설명의 개수가 실제 컴포넌트 수와 같다', () => {
    const counted = readCount(bundle.description ?? '', /컴포넌트 (\S+?) 개/)
    expect(counted, `묶음 설명에서 개수를 읽지 못했다: ${bundle.description}`).not.toBeNull()
    expect(counted, 'adminds 설명의 개수').toBe(components.length)
  })

  it('README가 적는 개수가 실제 컴포넌트 수와 같다', () => {
    expect(readme, 'README.md를 읽지 못했다').toBeTypeOf('string')
    const counted = readCount(readme ?? '', /adminds\.json # 토큰과 (\S+?)개 전부/)
    expect(counted, 'README에서 개수를 읽지 못했다 — 문구가 바뀌었으면 이 테스트도 함께 고친다').not.toBeNull()
    expect(counted, 'README가 적는 개수').toBe(components.length)
  })
})
