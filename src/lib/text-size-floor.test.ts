import { describe, expect, it } from 'vitest'

/**
 * text-11의 자격 조건 — ① 그 글자가 유일한 정보원이 아니고(옆의 아이콘·색·
 * 더 큰 글자가 같은 뜻을 이미 전달해, 이 글자가 안 읽혀도 과업을 끝낼 수
 * 있다), ② 한두 글자 수준으로 극히 짧고, ③ 담는 그릇의 크기가 이 시스템의
 * 다른 규칙(아이콘 지름, 그리드 칸 폭 등)에 못 박혀 있다 — 를 모두
 * 만족하는 자리는 지금 코드베이스 어디에도 없다(tokens.css와
 * TypographyPage의 Scale이 근거를 적는다). "좁아 보여서"는 조건이 아니다 —
 * 실측해 보니 Badge·넘버 서클·요일 머리 모두 ③이 거짓이었다(text-12로
 * 올려도 안 깨졌다).
 *
 * 그런데도 이 문자열은 계속 새로 생겼다. v0.14.0에서 "새 코드는 text-12부터"
 * 라 정했지만 그 뒤에도 Toggle·Collapsible·DataTable 페이지가 다시
 * text-11을 썼다. 용도를 나열하던 예전 tokens.css 주석은 안 자랐지만
 * grep은 자랐다.
 *
 * 그래서 파일마다 'text-11'이 몇 번 나오는지 손으로 세어 둔다
 * (registry-parity.test.ts의 '손으로 적은 컴포넌트 개수'와 같은 방식).
 * 이 규칙을 설명하는 자리(주석·문서·이 파일 자체)에서도 그 이름은 언급해야
 * 하므로 전부 0으로 만들 수는 없다 — 대신 개수가 하나라도 어긋나면(늘어도
 * 줄어도) 실패하게 해서, 늘었으면 왜 늘었는지 사람이 보게 하고 줄었으면
 * 이 목록도 함께 줄이게 한다. 아래에 없는 파일은 하나도 허용하지 않는다.
 */
/*
 * 이 파일 자체는 목록에 넣지 않는다 — Vite의 import.meta.glob은 그 glob을
 * 호출한 모듈 자신은 매칭 결과에서 빼므로(자기 참조 순환을 막는 처리로
 * 보인다), 아래 sourceFiles에는 애초에 이 파일이 나타나지 않는다.
 */
const MENTIONS: Record<string, number> = {
  /* 규칙을 설명하는 자리. 문구를 다시 쓰지 않는 한 이 수는 안 줄어든다. */
  'src/styles/tokens.css': 4,
  'src/lib/tokens.ts': 1,
  'src/lib/utils.ts': 4,
  'src/lib/utils.test.ts': 4,
  'src/data/releases.ts': 1,
  'src/components/docs/DocPage.tsx': 1,
  'src/components/docs/DocStatus.tsx': 1,
  'src/components/layout/Gnb.tsx': 1,
  'src/components/ui/badge.tsx': 1,
  'src/components/ui/calendar.tsx': 1,
  'src/components/ui/tooltip.tsx': 1,
  /*
   * TypographyPage는 규칙 설명과 미처리 사용처가 섞여 있다 — SCALE 정의와
   * 새로 쓴 설명 문단은 규칙을 설명하는 자리, 나머지 넷(FONT STACK 라벨·
   * 표 머리 둘·wrap 데모 제목)은 아직 못 옮긴 실제 사용처다. Task 3이 그
   * 넷을 옮기면 이 수는 2로 줄어든다.
   */
  'src/routes/foundations/TypographyPage.tsx': 6,

  /* 아직 text-12로 못 옮긴 실제 사용처(pending) — Task 3~5가 하나씩 줄인다 */
  'src/routes/UpdatesPage.tsx': 1,
  'src/routes/components/BreadcrumbPage.tsx': 2,
  'src/routes/components/ButtonPage.tsx': 4,
  'src/routes/components/CollapsiblePage.tsx': 1,
  'src/routes/components/ComponentsIndex.tsx': 1,
  'src/routes/components/DataTablePage.tsx': 4,
  'src/routes/components/DatePickerPage.tsx': 1,
  'src/routes/components/InputPage.tsx': 2,
  'src/routes/components/PaginationPage.tsx': 1,
  'src/routes/components/SheetPage.tsx': 1,
  'src/routes/components/SkeletonPage.tsx': 3,
  'src/routes/components/StepsPage.tsx': 3,
  'src/routes/components/TablePage.tsx': 1,
  'src/routes/components/TextareaPage.tsx': 5,
  'src/routes/components/ToastPage.tsx': 1,
  'src/routes/components/TogglePage.tsx': 5,
  'src/routes/foundations/ColorRolePage.tsx': 8,
  'src/routes/foundations/DesignTokenPage.tsx': 4,
  'src/routes/foundations/IconographyPage.tsx': 1,
  'src/routes/foundations/LayoutPage.tsx': 2,
  'src/routes/foundations/PalettePage.tsx': 5,
  'src/routes/foundations/SpacingPage.tsx': 1,
  'src/routes/foundations/StatePage.tsx': 1,
  'src/routes/foundations/VoiceAndTonePage.tsx': 1,
  'src/routes/foundations/WritingPage.tsx': 1,
  'src/routes/get-started/GetStartedOverview.tsx': 1,
  'src/routes/patterns/DetailPatternPage.tsx': 1,
  'src/routes/patterns/EmptyAndErrorPatternPage.tsx': 1,
  'src/routes/patterns/FormPatternPage.tsx': 1,
  'src/routes/patterns/ListPatternPage.tsx': 1,
  'src/routes/patterns/PatternsOverview.tsx': 1,
}

/*
 * 파일을 node:fs가 아니라 Vite의 ?raw glob으로 읽는다 — registry-parity.test.ts와
 * 같은 이유다. 이 파일은 src 아래라 tsconfig.app.json이 타입을 검사하는데
 * 거기에는 node 타입이 없다. glob의 키는 이 모듈 기준 상대 경로라 실제로
 * 걸어서 저장소 뿌리 기준 경로(src/lib/x.ts)로 되돌린다.
 */
const THIS_DIR = 'src/lib'

function toRepoPath(globKey: string) {
  const segments = THIS_DIR.split('/')
  for (const part of globKey.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }
  return segments.join('/')
}

const sourceFiles = new Map(
  Object.entries(
    import.meta.glob('../../src/**/*.{ts,tsx,css}', {
      query: '?raw',
      import: 'default',
      eager: true,
    }),
  ).map(([key, value]) => [toRepoPath(key), value as string]),
)

describe('text-11 사용처', () => {
  it('목록에 적은 개수와 실제 개수가 정확히 같다', () => {
    const mismatched: string[] = []
    const seen = new Set<string>()

    for (const [path, content] of sourceFiles) {
      const actual = (content.match(/\btext-11\b/g) ?? []).length
      const expected = MENTIONS[path] ?? 0
      if (actual !== expected) {
        mismatched.push(`${path}: 목록=${expected} 실제=${actual}`)
      }
      if (path in MENTIONS) seen.add(path)
    }

    const stale = Object.keys(MENTIONS).filter((path) => !seen.has(path))
    expect(stale, '목록에는 있는데 소스에서 찾지 못한 파일 — 옮겼거나 지웠다면 이 줄을 뺀다').toEqual([])
    expect(
      mismatched,
      "text-11 개수가 어긋났다 — 늘었으면 왜인지 보고, 줄었으면 이 목록도 함께 고친다(src/lib/text-size-floor.test.ts)",
    ).toEqual([])
  })

  it('견줄 파일이 실제로 있다', () => {
    // sourceFiles가 비면 위 테스트는 아무것도 하지 않고 통과한다.
    expect(sourceFiles.size).toBeGreaterThan(0)
  })
})
