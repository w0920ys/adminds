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
  registryDependencies?: string[]
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
})
