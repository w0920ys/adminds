# 어드민 디자인 시스템 v0.11.0 — Get started와 Patterns 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GNB에서 마지막으로 비어 있는 두 섹션 — `Get started`(Overview·Install·Principles)와 `Patterns`(Overview + 패턴 문서 다섯) — 을 실제 컴포넌트로 조립한 문서로 채운다.

**Architecture:** 패턴은 컴포넌트와 모양이 다르므로 `ComponentMeta`를 재사용하지 않는다. 새 데이터 모듈 `src/data/patterns.ts`가 축(properties)도 상태(state)도 없는 `PatternMeta`를 정의하고, 새 전시 컴포넌트 `src/components/docs/PatternPage.tsx`가 Structure · Guidelines · Example · Cases 네 절만 그린다. `GuidelineBlock` · `ExampleList` · `ExampleFrame` · `DocPage` · `DocSection`은 그대로 재사용하고, `ComponentPage` 안에 박혀 있던 상태 배지 줄만 `DocStatus`로 뽑아 두 페이지가 함께 쓴다. 모든 예시는 `components/ui/*`의 실제 컴포넌트로 조립한다 — 목업 마크업을 그리지 않는다.

**Tech Stack:** React 19 · TypeScript 6 · Tailwind CSS v4(`@theme` 토큰) · react-router v8 · Radix UI · Vite 8 · Vitest 4(node 환경)

## Global Constraints

*(아래 열두 줄은 스펙의 「전역 제약」을 그대로 옮긴 것이다. 그 뒤 세 줄은 스펙이 알 수 없었던 이번 회차의 제약이다.)*

- 작업 브랜치는 `v0.11.0`. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않습니다
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다
- 제품 컴포넌트(`components/ui/*`)는 문서 시스템의 표시를 알지 않습니다
- **17px 이하 글자는 4.5:1을 넘어야 합니다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1
- **모달을 열린 채로 마운트하지 않습니다**
- 문구는 Writing 규칙을 따릅니다
- 테스트 대상은 순수 로직에 한정합니다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사

- **이 작업장의 개발 서버는 `.claude/launch.json`의 `adminds-v0.11.0` 항목(포트 5201)이다.** 반드시 `preview_start`에 그 이름을 넘겨 띄운다. Bash로 `npm run dev`를 돌리지 않는다. `adminds` 항목(포트 5199)은 **다른 체크아웃**을 띄운다 — 거기서 잰 값은 전부 무효다. v0.10.0에서 한 에이전트가 정확히 이 실수로 한 판의 측정을 통째로 버렸다(커밋 `452f5a8`).
- **이 하네스는 키보드 동작을 검증할 수 없다.** 여기서 실제 키 입력은 쓸 만한 `keydown`을 만들지 못한다 — `Enter`가 `code: ""` · `keyCode: 0`으로 도착하거나 아예 도착하지 않는다. 키보드 동작은 소스를 읽어 추론하고, 문서에도 "소스로 확인했다"라고만 적는다. **하네스를 보정하려고 제품 코드를 고치지 않는다** — v0.10.0에서 그 실수를 했다가 되돌렸다.
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않는다.** 이 프로젝트가 모든 회차에서 가장 자주 낸 결함이다. 확인하지 않은 주장은 넣지 않는다. 이번 회차에서 특히: "Patterns는 아직 준비 중입니다"라고 적힌 기존 문장 두 곳이 Task 7에서 거짓이 된다.

## 파일 구조

**새로 만드는 파일**

| 경로 | 책임 |
|---|---|
| `src/data/patterns.ts` | `PatternMeta` 타입과 패턴 다섯의 데이터, `getPattern` · `patternStats` |
| `src/data/patterns.test.ts` | 패턴 데이터의 순수 규칙(id 중복·kebab-case·registry 참조 무결성) |
| `src/components/docs/DocStatus.tsx` | 상태 배지 + 추가/변경 버전 줄. `ComponentPage`와 `PatternPage`가 함께 쓴다 |
| `src/components/docs/PatternPage.tsx` | 패턴 문서의 뼈대. Structure · Guidelines · Example · Cases |
| `src/routes/patterns/PatternsOverview.tsx` | `/patterns` |
| `src/routes/patterns/ListPatternPage.tsx` | `/patterns/list` |
| `src/routes/patterns/DetailPatternPage.tsx` | `/patterns/detail` |
| `src/routes/patterns/FormPatternPage.tsx` | `/patterns/form` |
| `src/routes/patterns/EmptyAndErrorPatternPage.tsx` | `/patterns/empty-and-error` |
| `src/routes/patterns/DestructiveConfirmPatternPage.tsx` | `/patterns/destructive-confirm` |
| `src/routes/get-started/GetStartedOverview.tsx` | `/` |
| `src/routes/get-started/section-roles.ts` | 섹션 id → 그 섹션이 맡는 일 한 줄 |
| `src/routes/get-started/section-roles.test.ts` | 그 표의 키가 `nav-config`의 섹션과 정확히 일치하는지 |
| `src/routes/get-started/InstallPage.tsx` | `/get-started/install` |
| `src/routes/get-started/install-commands.ts` | 화면에 보일 npm 스크립트 이름과 설명 |
| `src/routes/get-started/install-commands.test.ts` | 그 이름들이 `package.json`의 `scripts`에 실재하는지 |
| `src/routes/get-started/PrinciplesPage.tsx` | `/get-started/principles` |
| `src/routes/get-started/principles.ts` | 원칙 여섯과 각 원칙의 근거 문서 경로 |
| `src/routes/get-started/principles.test.ts` | 근거 문서 경로가 `docOrder`에 실재하는지 |

**고치는 파일**

| 경로 | 무엇을 |
|---|---|
| `.claude/launch.json` | Task 1에서 `adminds-v0.11.0` 항목을 더하고, Task 11에서 도로 뺀다 |
| `src/components/docs/ComponentPage.tsx` | 상태 배지 줄을 `DocStatus`로 대체 |
| `src/components/layout/nav-config.ts` | Patterns 섹션에 문서 다섯, Get started 세 문서의 `summary`·`updatedAt` 갱신 |
| `src/components/layout/nav-config.test.ts` | Patterns 목록이 `patterns.ts`와 맞물리는지, summary가 비어 있지 않은지 |
| `src/routes/routes.tsx` | 자리표시자 여섯을 실제 페이지로 교체, `patterns`를 중첩 라우트로 |
| `src/routes/foundations/FoundationsOverview.tsx` | "Patterns … 아직 준비 중입니다" 문장 교체 |
| `src/routes/components/ComponentsIndex.tsx` | 같은 문장 교체 |
| `src/data/releases.ts` | v0.11.0 항목 |
| `src/data/releases.test.ts` | 최신 릴리스 버전과 `package.json`의 버전이 같은지 |
| `package.json` · `package-lock.json` | 버전 `0.11.0` |
| `README.md` | "토큰과 26개 전부" → 실제 개수 |

**작업 순서의 근거.** 스펙은 `Get started`를 1부로 두지만 구현은 `Patterns`가 먼저다 — Get started Overview의 Status 절이 패턴 수를 `patterns.ts`에서 파생하기 때문이다. 없는 데이터를 셀 수는 없다.

---

## Task 1: 패턴 데이터의 뼈대

컴포넌트와 다른 모양의 데이터 타입을 세우고, 첫 패턴(List)의 데이터를 넣는다. 화면은 아직 없다. 이 Task가 끝나면 `npm test`가 패턴 데이터의 규칙을 지킨다.

`patterns.ts`는 다섯을 한꺼번에 담지 않는다. 패턴 하나가 들어올 때마다 LNB·라우트·페이지가 함께 들어와야 `nav-config.test.ts`의 라우트-네비게이션 일치 검사가 매 Task마다 초록이기 때문이다.

**Files:**
- Modify: `.claude/launch.json`
- Create: `src/data/patterns.ts`
- Test: `src/data/patterns.test.ts`

**Interfaces:**
- Consumes: `@/data/registry`의 `ComponentStatus` · `Guideline` · `Example` 타입과 `getComponent` 함수
- Produces:
  - `type PatternStructureStep = { slot: string; note: string; components?: string[]; optional?: boolean }`
  - `type PatternStatus = ComponentStatus` (`'draft' | 'review' | 'stable' | 'deprecated'`)
  - `type PatternMeta = { id, name, aliases, status, addedIn, changedIn, purpose, structure, guidelines, example, cases, verified }`
  - `const patterns: PatternMeta[]`
  - `function getPattern(id: string): PatternMeta | undefined`
  - `function patternStats(): { total: number; verified: number }`

- [ ] **Step 1: 이 작업장의 미리보기 항목을 더한다**

`.claude/launch.json`의 `configurations` 배열에 두 번째 항목으로 넣는다. `adminds`(5199) 항목은 그대로 둔다 — 그것은 다른 체크아웃이다.

```json
    {
      "name": "adminds-v0.11.0",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "--prefix",
        "/Users/yoon/Desktop/데스크탑/바이브코딩/어드민 디자인시스템/.claude/worktrees/v0.11.0",
        "run",
        "dev",
        "--",
        "--port",
        "5201",
        "--strictPort"
      ],
      "port": 5201
    }
```

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`src/data/patterns.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getPattern, patternStats, patterns } from '@/data/patterns'
import { getComponent } from '@/data/registry'

describe('patterns', () => {
  it('id로 패턴을 찾는다', () => {
    expect(getPattern('list')?.name).toBe('List')
  })

  it('없는 id는 undefined를 돌려준다', () => {
    expect(getPattern('nope')).toBeUndefined()
  })

  it('id가 중복되지 않는다', () => {
    const ids = patterns.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('집계 숫자를 배열에서 센다', () => {
    const stats = patternStats()
    expect(stats.total).toBe(patterns.length)
    expect(stats.verified).toBe(patterns.filter((p) => p.verified).length)
  })
})

describe('structure', () => {
  it('모든 패턴이 자리를 하나 이상 갖는다', () => {
    for (const pattern of patterns) {
      expect(pattern.structure.length, pattern.id).toBeGreaterThan(0)
    }
  })

  it('자리 이름이 패턴 안에서 중복되지 않는다', () => {
    for (const pattern of patterns) {
      const slots = pattern.structure.map((s) => s.slot)
      expect(new Set(slots).size, pattern.id).toBe(slots.length)
    }
  })

  /*
   * 자리가 가리키는 컴포넌트가 registry에 없으면 Structure의 링크가
   * 죽은 곳으로 간다. 화면에서 눈으로 잡을 수 없는 종류의 거짓이라
   * 여기서 막는다.
   */
  it('자리가 가리키는 컴포넌트가 registry에 있다', () => {
    for (const pattern of patterns) {
      for (const step of pattern.structure) {
        for (const id of step.components ?? []) {
          expect(getComponent(id), `${pattern.id}: ${id}`).toBeDefined()
        }
      }
    }
  })
})

describe('예시 식별자', () => {
  it('guideline과 case의 id가 서로 겹치지 않는다', () => {
    for (const pattern of patterns) {
      const ids = [...pattern.guidelines.map((g) => g.id), ...pattern.cases.map((c) => c.id)]
      expect(new Set(ids).size, pattern.id).toBe(ids.length)
    }
  })

  it('모든 id가 kebab-case다', () => {
    for (const pattern of patterns) {
      const ids = [pattern.id, ...pattern.guidelines.map((g) => g.id), ...pattern.cases.map((c) => c.id)]
      for (const id of ids) {
        expect(id, `${pattern.id}: ${id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      }
    }
  })
})
```

- [ ] **Step 3: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/data/patterns.test.ts`
Expected: FAIL — `Failed to resolve import "@/data/patterns"`

- [ ] **Step 4: `src/data/patterns.ts`를 쓴다**

```ts
import type { ComponentStatus, Example, Guideline } from '@/data/registry'

/**
 * 패턴 문서의 한 자리. 화면 위에서 어떤 컴포넌트가 어디에 오는가를 적는다.
 * 컴포넌트 문서의 AnatomyPart와 다르다 — 저쪽은 실제로 그려진 미리보기의
 * DOM을 재서 지시선을 긋지만, 패턴은 화면 하나가 통째로 예시라 잴 대상이
 * 정해지지 않는다. 그래서 좌표가 아니라 순서만 갖는다.
 */
export type PatternStructureStep = {
  /** 이 자리의 이름. 컴포넌트 이름이거나 자리 이름이다 */
  slot: string
  /** 이 자리가 무엇을 맡는가 */
  note: string
  /** 이 자리가 쓰는 컴포넌트의 registry id. 그 문서로 잇는다 */
  components?: string[]
  /** 없어도 화면이 성립하는 자리인지 */
  optional?: boolean
}

/** 문서의 성숙도. 컴포넌트와 같은 눈금을 쓴다 — 같은 배지가 같은 뜻으로 읽혀야 한다 */
export type PatternStatus = ComponentStatus

/**
 * 패턴 문서의 메타.
 *
 * ComponentMeta를 재사용하지 않는다. 패턴에는 축(properties)도 상태도
 * 없는데, 그 자리를 빈 배열로 두면 문서에 빈 절이 생긴다 — "이것에는
 * 축이 없다"가 아니라 "문서가 덜 채워졌다"로 읽히는 결함이고,
 * v0.8.0에서 이미 한 번 걷어냈다.
 *
 * Guideline과 Example은 registry에서 가져다 쓴다. 이 둘은 컴포넌트의
 * 성질이 아니라 '문서의 한 절'의 모양이고, GuidelineBlock·ExampleList가
 * 이미 그 타입을 받는다.
 */
export type PatternMeta = {
  id: string
  name: string
  /** 검색에서 이 패턴을 부르는 다른 이름들 */
  aliases: string[]
  status: PatternStatus
  addedIn: string
  changedIn: string
  purpose: string
  structure: PatternStructureStep[]
  guidelines: Guideline[]
  /** 화면 하나를 통째로 보이는 예시. 화면은 페이지가 조립하고 여기에는 제목과 설명만 둔다 */
  example: { title: string; note: string }
  cases: Example[]
  verified: boolean
}

/** LNB에 놓이는 순서다. nav-config의 Patterns 목록이 이 순서와 맞물린다. */
export const patterns: PatternMeta[] = [
  {
    id: 'list',
    name: 'List',
    aliases: ['목록', '리스트', '목록 화면', '테이블 화면'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '여러 항목을 한 화면에서 훑고 걸러 하나를 고르는 화면이다. 어드민에서 가장 자주 열린다.',
    structure: [
      { slot: 'Breadcrumb', note: '지금 보는 목록이 어느 갈래에 있는지 보인다', components: ['breadcrumb'] },
      { slot: '제목과 주요 동작', note: '제목은 왼쪽, 주요 동작은 오른쪽 끝. 주요 동작은 하나만 둔다', components: ['button'] },
      { slot: '필터 줄', note: '검색어와 좁히는 조건을 표 위에 둔다. 결과 수를 함께 보인다', components: ['input', 'select'] },
      { slot: 'Table', note: '선택은 Checkbox, 상태는 Badge, 담당자는 Avatar로 보인다', components: ['table', 'checkbox', 'badge', 'avatar'] },
      { slot: '대량 작업 줄', note: '선택이 있을 때만 필터 줄 자리에 나타난다. 선택 개수와 그 선택에 걸리는 동작을 담는다', components: ['button'], optional: true },
      { slot: 'Pagination', note: '표 아래에 전체 개수와 페이지 이동을 둔다', components: ['pagination'] },
    ],
    guidelines: [
      {
        id: 'filter-above-table',
        title: '필터는 표 위에 두고 결과 수를 함께 보인다',
        body: '거른 뒤에 몇 건이 남았는지 보이지 않으면 조건이 먹혔는지 알 수 없다. 조건과 결과 수를 같은 줄에서 읽게 한다.',
        do: ['검색·조건을 표 바로 위에 모은다', '결과 수를 조건 옆이나 표 아래 Pagination에 보인다'],
        dont: ['조건을 표 아래에 둔다', '조건만 바뀌고 결과 수는 그대로 둔다'],
      },
      {
        id: 'bulk-bar-in-place',
        title: '선택이 있으면 대량 작업 줄이 그 자리에 나타난다',
        body: '대량 작업 줄은 필터 줄 자리를 그대로 쓴다. 새 줄을 밀어 넣으면 표가 아래로 밀려 방금 고른 행이 화면 밖으로 나간다.',
        do: ['필터 줄 자리에 선택 개수와 동작을 대신 보인다', '선택을 풀면 필터 줄로 돌아온다'],
        dont: ['표 위에 줄을 하나 더 끼워 넣는다', '선택이 없는데도 대량 작업 줄을 비활성으로 남긴다'],
      },
      {
        id: 'single-primary-action',
        title: '주요 동작은 제목 줄 오른쪽에 하나만 둔다',
        body: '이 화면에서 가장 자주 하는 일 하나만 채운 버튼으로 둔다. 나머지는 outline이나 Dropdown Menu 안으로 내린다.',
        do: ['채운 버튼 하나 + 보조 동작은 outline'],
        dont: ['채운 버튼을 둘 이상 나란히 둔다'],
      },
    ],
    example: {
      title: '사용자 목록',
      note: 'Breadcrumb부터 Pagination까지, 목록 화면 하나를 실제 컴포넌트로 조립한 것이다.',
    },
    cases: [
      { id: 'empty', title: '결과 없음', note: '아직 아무것도 없는 목록. 표의 머리는 남기고 몸에 안내를 둔다.' },
      { id: 'no-filter-results', title: '필터 결과 없음', note: '조건이 너무 좁을 때. 조건을 지우는 길을 함께 준다.' },
      { id: 'loading', title: '불러오는 중', note: '행 자리를 Skeleton으로 잡아 표가 튀지 않게 한다.' },
      { id: 'selection-across-pages', title: '선택 상태에서 페이지 이동', note: '선택이 몇 건인지 페이지를 넘어가도 보인다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '표는 가로로 구르고 제목 줄과 필터 줄은 세로로 쌓인다.' },
    ],
    verified: false,
  },
]

export function getPattern(id: string): PatternMeta | undefined {
  return patterns.find((p) => p.id === id)
}

export function patternStats(): { total: number; verified: number } {
  return {
    total: patterns.length,
    verified: patterns.filter((p) => p.verified).length,
  }
}
```

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/data/patterns.test.ts`
Expected: PASS

- [ ] **Step 6: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과. 출력을 눈으로 확인한 뒤에만 다음으로 간다.

- [ ] **Step 7: 커밋**

```bash
git add .claude/launch.json src/data/patterns.ts src/data/patterns.test.ts
git commit -m "feat(patterns): 패턴 데이터의 타입과 첫 항목을 세운다

컴포넌트와 모양이 달라 ComponentMeta를 재사용하지 않는다. 축도 상태도
없는데 그 자리를 빈 배열로 두면 빈 절이 생기고, 그건 v0.8.0에서 이미
걷어낸 결함이다. Guideline과 Example만 registry에서 가져다 쓴다 —
GuidelineBlock과 ExampleList가 이미 그 타입을 받는다.

Structure가 가리키는 컴포넌트 id가 registry에 실재하는지 테스트로
지킨다. 죽은 링크는 화면을 봐도 잡히지 않는다.

이 작업장(포트 5201)을 띄우는 미리보기 항목도 함께 넣는다."
```

---

## Task 2: `PatternPage` 뼈대와 List 문서

전시 컴포넌트를 만들고 첫 패턴 문서를 실제로 그린다. `ComponentPage`에 박혀 있던 상태 배지 줄을 `DocStatus`로 뽑아 둘이 함께 쓴다.

**재사용하는 것** — `DocPage` · `DocSection`(제목과 절, `HeadingAnchor`가 딸려 온다) · `GuidelineBlock`(do/dont 두 칸) · `ExampleList`(Cases 격자) · `ExampleFrame`(Example 액자).
**쓰지 않는 것** — `Anatomy`(잴 대상이 정해지지 않는다) · `Playground` · `PropertyBlock`(축이 없다) · `TokenTable` · `CopyPair` · `Swatch`.
**새로 만드는 것** — `DocStatus`(둘이 나눠 쓰는 배지 줄) · `PatternPage`(Structure 목록을 품는다).

**Files:**
- Create: `src/components/docs/DocStatus.tsx`
- Create: `src/components/docs/PatternPage.tsx`
- Create: `src/routes/patterns/ListPatternPage.tsx`
- Modify: `src/components/docs/ComponentPage.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/components/layout/nav-config.test.ts`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: Task 1의 `PatternMeta` · `PatternStructureStep` · `getPattern` · `patterns`
- Produces:
  - `function DocStatus(props: { status: ComponentStatus; addedIn: string; changedIn: string; verified: boolean }): ReactNode`
  - `type PatternPageProps = { meta: PatternMeta; example: ReactNode; renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode; renderCase?: (caseId: string) => ReactNode; extraSections?: { title: string; node: ReactNode }[] }`
  - `function PatternPage(props: PatternPageProps): ReactNode`
  - `function ListPatternPage(): ReactNode`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/components/layout/nav-config.test.ts` 끝에 붙인다:

```ts
describe('Patterns 목록', () => {
  it('Overview 다음 문서가 patterns.ts와 같은 순서로 맞물린다', async () => {
    const { patterns } = await import('@/data/patterns')
    const section = sections.find((s) => s.id === 'patterns')!
    const docs = topLevelDocs(section.items).filter((doc) => doc.to !== section.to)
    expect(docs.map((d) => d.to)).toEqual(patterns.map((p) => `/patterns/${p.id}`))
    expect(docs.map((d) => d.label)).toEqual(patterns.map((p) => p.name))
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: FAIL — `expected [] to deeply equal [ '/patterns/list' ]`

- [ ] **Step 3: `DocStatus`를 뽑아낸다**

`src/components/docs/DocStatus.tsx`를 만든다. 주석은 `ComponentPage`에 있던 것을 그대로 옮긴다 — 실제로 잰 값이 적혀 있으므로 지우지 않는다.

```tsx
import type { ComponentStatus } from '@/data/registry'
import { cn } from '@/lib/utils'

/*
 * Badge와 같은, 15% 탄 배경 위에 글자를 얹는 칩 패턴이라 같은
 * on-tint 토큰을 쓴다 — text-2xs font-bold(11px)는 WCAG 4.5:1
 * 대상이고, 탄 배경 위에 원래 색을 그대로 쓰면 라이트에서 기준에
 * 못 미친다(review 1.91 · stable 3.06 · deprecated 3.64 · draft
 * 4.34였다).
 */
const STATUS_STYLE: Record<ComponentStatus, string> = {
  draft: 'bg-muted text-neutral-on-tint',
  review: 'bg-warning/15 text-warning-on-tint',
  stable: 'bg-success/15 text-success-on-tint',
  deprecated: 'bg-destructive/15 text-destructive-on-tint',
}

/** 문서 제목 아래에 붙는 표시. 컴포넌트 문서와 패턴 문서가 같은 줄을 쓴다 */
export function DocStatus({
  status,
  addedIn,
  changedIn,
  verified,
}: {
  status: ComponentStatus
  addedIn: string
  changedIn: string
  verified: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[status])}>
        {status}
      </span>
      <span className="text-muted-foreground text-2xs">
        {addedIn}에 추가 · {changedIn}에서 마지막 변경
        {verified ? ' · 검증 완료' : ' · 검증 필요'}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: `ComponentPage`가 그것을 쓰게 한다**

`src/components/docs/ComponentPage.tsx`에서 `STATUS_STYLE` 상수와 그 위 주석 블록, `cn` import, `ComponentStatus` 타입 import를 지우고, `meta={...}` 안의 `<div className="flex flex-wrap items-center gap-2">…</div>` 전체를 아래로 바꾼다. 나머지 절은 손대지 않는다.

```tsx
      meta={
        <DocStatus
          status={meta.status}
          addedIn={meta.addedIn}
          changedIn={meta.changedIn}
          verified={meta.verified}
        />
      }
```

import 줄에 `import { DocStatus } from '@/components/docs/DocStatus'`를 더한다.

- [ ] **Step 5: `PatternPage`를 쓴다**

`src/components/docs/PatternPage.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DocStatus } from '@/components/docs/DocStatus'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { ExampleList } from '@/components/docs/ExampleList'
import { GuidelineBlock } from '@/components/docs/GuidelineBlock'
import type { PatternMeta, PatternStructureStep } from '@/data/patterns'
import { getComponent } from '@/data/registry'

/**
 * 자리를 순서대로 늘어놓는다. Anatomy처럼 지시선을 긋지 않는 이유는
 * 패턴의 예시가 화면 하나라서다 — 부위 하나를 가리키는 좌표가 없다.
 * 대신 각 자리가 어떤 컴포넌트를 쓰는지 그 문서로 잇는다.
 */
function StructureList({ steps }: { steps: PatternStructureStep[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <li key={step.slot} className="flex items-start gap-2.5 rounded-md p-2">
          <span className="bg-muted text-neutral-on-tint mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold">
            {index + 1}
          </span>
          <span className="min-w-0">
            <strong className="text-sm">
              {step.slot}
              {step.optional && (
                <span className="text-muted-foreground font-normal"> (Optional)</span>
              )}
            </strong>
            <span className="text-muted-foreground block text-xs">{step.note}</span>
            {step.components && step.components.length > 0 && (
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {step.components.map((id) => (
                  <Link
                    key={id}
                    to={`/components/${id}`}
                    className="hover:bg-accent text-muted-foreground rounded border px-1.5 py-0.5 text-2xs"
                  >
                    {/* id가 registry에 실재하는지는 patterns.test.ts가 지킨다 */}
                    {getComponent(id)?.name ?? id}
                  </Link>
                ))}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  )
}

export type PatternPageProps = {
  meta: PatternMeta
  /** 실제 컴포넌트로 조립한 화면 한 조각. 목업을 그리지 않는다 */
  example: ReactNode
  /** guideline의 do/don't 예시를 주입한다 */
  renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
  /** cases 항목의 예시를 주입한다 */
  renderCase?: (caseId: string) => ReactNode
  /** 이 패턴에만 필요한 절 */
  extraSections?: { title: string; node: ReactNode }[]
}

export function PatternPage({
  meta,
  example,
  renderGuidelineExample,
  renderCase,
  extraSections = [],
}: PatternPageProps) {
  return (
    <DocPage
      title={meta.name}
      description={meta.purpose}
      meta={
        <DocStatus
          status={meta.status}
          addedIn={meta.addedIn}
          changedIn={meta.changedIn}
          verified={meta.verified}
        />
      }
    >
      {/* 빈 절은 그리지 않는다. ComponentPage와 같은 규칙이다 */}
      {meta.structure.length > 0 && (
        <DocSection title="Structure">
          <StructureList steps={meta.structure} />
        </DocSection>
      )}

      {meta.guidelines.length > 0 && (
        <DocSection title="Guidelines">
          <div className="flex flex-col gap-12">
            {meta.guidelines.map((guideline) => (
              <GuidelineBlock
                key={guideline.id}
                guideline={guideline}
                renderExample={renderGuidelineExample}
              />
            ))}
          </div>
        </DocSection>
      )}

      <DocSection title="Example">
        <div className="flex flex-col gap-2">
          <div>
            <strong className="text-sm">{meta.example.title}</strong>
            <p className="text-muted-foreground mt-1 text-xs">{meta.example.note}</p>
          </div>
          <ExampleFrame>{example}</ExampleFrame>
        </div>
      </DocSection>

      {meta.cases.length > 0 && (
        <DocSection title="Cases">
          <ExampleList examples={meta.cases} renderExample={renderCase} />
        </DocSection>
      )}

      {extraSections.map((section) => (
        <DocSection key={section.title} title={section.title}>
          {section.node}
        </DocSection>
      ))}
    </DocPage>
  )
}
```

- [ ] **Step 6: List 문서를 조립한다**

`src/routes/patterns/ListPatternPage.tsx`를 만든다. 아래는 뼈대와 Example이다. `renderGuidelineExample`과 `renderCase`는 Task 1에서 정한 id 여덟 개(`filter-above-table` · `bulk-bar-in-place` · `single-primary-action` · `empty` · `no-filter-results` · `loading` · `selection-across-pages` · `narrow-screen`)를 모두 덮어야 한다. 상자를 그리지 않는다 — `Table` · `Badge` · `Avatar` · `Checkbox` · `Input` · `Select` · `Button` · `Breadcrumb` · `Pagination` · `Skeleton` · `EmptyState`만 쓴다.

```tsx
import type { ReactNode } from 'react'
import { Plus, Search } from 'lucide-react'
import { PatternPage } from '@/components/docs/PatternPage'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationInfo, PaginationItem } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

type Row = { name: string; email: string; status: '활성' | '정지'; owner: string; joinedAt: string }

const ROWS: Row[] = [
  { name: '홍길동', email: 'hong@example.com', status: '활성', owner: '김서연', joinedAt: '2024-03-02' },
  { name: '김민수', email: 'kim@example.com', status: '활성', owner: '김서연', joinedAt: '2024-03-11' },
  { name: '이수진', email: 'lee@example.com', status: '정지', owner: '박지호', joinedAt: '2024-04-08' },
]

function ScreenHeader() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">회원</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>사용자</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-lg font-semibold tracking-tight">사용자</h4>
        <Button size="sm">
          <Plus aria-hidden />
          사용자 추가
        </Button>
      </div>
    </div>
  )
}

function FilterRow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input size="sm" className="w-48" placeholder="이름이나 이메일" aria-label="사용자 검색" />
      <Select>
        <SelectTrigger size="sm" className="w-32" aria-label="상태로 거르기">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="active">활성</SelectItem>
          <SelectItem value="suspended">정지</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-muted-foreground ml-auto text-sm">{ROWS.length}건</p>
    </div>
  )
}

function UserTable() {
  return (
    <Table label="사용자 목록">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox aria-label="모두 선택" />
          </TableHead>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>담당자</TableHead>
          <TableHead>가입일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.email}>
            <TableCell>
              <Checkbox aria-label={`${row.name} 선택`} />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Badge variant={row.status === '활성' ? 'success' : 'neutral'}>{row.status}</Badge>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{row.owner.slice(0, 1)}</AvatarFallback>
                </Avatar>
                {row.owner}
              </span>
            </TableCell>
            <TableCell>{row.joinedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ListExample() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader />
      <FilterRow />
      <UserTable />
      <Pagination>
        <PaginationInfo>전체 {ROWS.length}건 · 20건씩</PaginationInfo>
        <PaginationContent>
          <PaginationItem>
            <Button variant="ghost" size="sm" disabled>
              이전
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="outline" size="sm" aria-current="page">
              1
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" size="sm">
              다음
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'filter-above-table':
      // do: 필터와 결과 수가 표 위 한 줄에. dont: 결과 수 없이 필터만.
      return kind === 'do' ? <FilterRow /> : <FilterRowWithoutCount />
    case 'bulk-bar-in-place':
      // do: 필터 줄 자리를 대량 작업 줄이 대신 차지한다. dont: 줄을 하나 더 끼워 넣는다.
      return kind === 'do' ? <BulkBarInPlace /> : <BulkBarStacked />
    case 'single-primary-action':
      // do: 채운 버튼 하나 + outline 하나. dont: 채운 버튼 둘.
      return <ActionRow filled={kind === 'do' ? 1 : 2} />
    default:
      return null
  }
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'empty':
      return <EmptyTable variant="empty" />
    case 'no-filter-results':
      return <EmptyTable variant="no-results" />
    case 'loading':
      return <LoadingTable />
    case 'selection-across-pages':
      return <SelectionAcrossPages />
    case 'narrow-screen':
      return <NarrowScreen />
    default:
      return null
  }
}

export function ListPatternPage() {
  const meta = getPattern('list')
  if (!meta) return <Placeholder title="List 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<ListExample />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
```

`FilterRowWithoutCount` · `BulkBarInPlace` · `BulkBarStacked` · `ActionRow` · `EmptyTable` · `LoadingTable` · `SelectionAcrossPages` · `NarrowScreen`은 위 조각들을 조합해 같은 파일 안에 만든다. 규칙 셋:
1. 새 컴포넌트를 만들지 않는다. `EmptyTable`은 `EmptyState`(+`EmptyStateIcon`·`EmptyStateTitle`·`EmptyStateDescription`·`EmptyStateAction`)를 `TableCell colSpan`으로 감싼 것이고, `LoadingTable`은 `Skeleton`을 셀에 넣은 것이다.
2. `EmptyState`의 `variant`는 `'empty' | 'no-results' | 'error' | 'no-permission'` 넷 중에서 고른다.
3. `NarrowScreen`은 좁은 폭을 흉내내는 상자 안에 같은 조각을 넣는다 — 폭은 `max-w-xs` 같은 유틸리티로 잡고 대괄호 표기를 쓰지 않는다.

- [ ] **Step 7: 라우트와 LNB를 잇는다**

`src/routes/routes.tsx`에서 `{ path: 'patterns', element: <Placeholder title="Patterns" /> }` 한 줄을 중첩 라우트로 바꾼다. `/patterns` 자체는 아직 자리표시자다 — Patterns Overview는 Task 7에서 온다.

```tsx
      {
        path: 'patterns',
        children: [
          { index: true, element: <Placeholder title="Patterns" /> },
          { path: 'list', element: <ListPatternPage /> },
        ],
      },
```

import를 더한다: `import { ListPatternPage } from '@/routes/patterns/ListPatternPage'`

`src/components/layout/nav-config.ts`의 Patterns 섹션 `items`에 두 번째 항목을 넣는다:

```ts
      { to: '/patterns/list', label: 'List', summary: '여러 항목을 훑고 걸러 하나를 고르는 화면', updatedAt: '2026-08-27' },
```

- [ ] **Step 8: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS. 특히 "LNB의 모든 경로가 라우터에 등록되어 있다"와 "라우터에 LNB에 없는 문서 경로가 있지 않다"가 함께 초록이어야 한다.

- [ ] **Step 9: 화면으로 확인한다**

`preview_start`에 `adminds-v0.11.0`을 넘겨 띄운 뒤(`npm run dev`를 Bash로 돌리지 않는다) `http://localhost:5201/patterns/list`로 간다. 확인할 것:
- 절이 Structure · Guidelines · Example · Cases 넷뿐이다. Playground나 Properties가 없다.
- Structure의 컴포넌트 칩을 누르면 그 컴포넌트 문서로 간다.
- 라이트·다크 양쪽에서 상태 배지와 본문이 읽힌다.

- [ ] **Step 10: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 11: 커밋**

```bash
git add src/components/docs src/routes/patterns src/components/layout src/routes/routes.tsx
git commit -m "feat(patterns): PatternPage 뼈대와 List 문서를 싣는다

ComponentPage를 재사용하지 않는다. 축과 상태를 위한 자리를 두면 빈 절이
생긴다. Structure·Guidelines·Example·Cases 넷만 그리고, GuidelineBlock과
ExampleList와 ExampleFrame은 그대로 가져다 쓴다.

상태 배지 줄은 ComponentPage 안에 있던 것을 DocStatus로 뽑아 둘이 나눠
쓴다 — 잰 대비값이 적힌 주석도 함께 옮겼다.

Example은 목업이 아니다. Breadcrumb·Button·Input·Select·Table·Checkbox·
Badge·Avatar·Pagination을 실제로 조립했으므로 토큰이 바뀌면 예시도
따라 바뀐다."
```

---

## Task 3: Detail 패턴

목록에서 항목 하나로 들어간 뒤의 화면. Tabs가 바뀌어도 제목과 동작이 남는 것이 이 패턴의 핵심이다.

**Files:**
- Modify: `src/data/patterns.ts`
- Create: `src/routes/patterns/DetailPatternPage.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `PatternPage` · `PatternPageProps`(Task 2), `getPattern`(Task 1)
- Produces: `function DetailPatternPage(): ReactNode`, `patterns`에 `id: 'detail'` 항목

- [ ] **Step 1: 데이터를 넣고 테스트가 여전히 초록인지 본다**

`src/data/patterns.ts`의 `patterns` 배열에서 `list` 다음에 넣는다.

```ts
  {
    id: 'detail',
    name: 'Detail',
    aliases: ['상세', '상세 화면', '단건 조회'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '목록에서 항목 하나로 들어간 뒤의 화면이다. 한 대상의 정보를 갈래로 나눠 보이고 그 대상에 걸리는 동작을 한자리에 모은다.',
    structure: [
      { slot: 'Breadcrumb', note: '어느 목록에서 들어왔는지 보인다', components: ['breadcrumb'] },
      { slot: '제목과 Badge', note: '대상의 이름과 그 상태를 한 줄에 둔다', components: ['badge'] },
      { slot: '동작', note: '자주 쓰는 동작은 버튼으로, 위험하거나 드문 동작은 Dropdown Menu 안쪽에 둔다', components: ['button', 'dropdown-menu'] },
      { slot: 'Tabs', note: '정보를 갈래로 나눈다. 탭을 바꿔도 위의 제목과 동작은 남는다', components: ['tabs'] },
      { slot: '탭 내용', note: '읽기 위주 정보는 Description List로, 딸린 목록은 Table로 보인다', components: ['description-list', 'table'] },
    ],
    guidelines: [
      {
        id: 'breadcrumb-shows-origin',
        title: '어디서 왔는지 Breadcrumb으로 보인다',
        body: '상세 화면은 늘 어딘가의 아래에 있다. 돌아갈 길이 보이지 않으면 뒤로 가기 말고는 방법이 없다.',
        do: ['목록 → 대상 이름 순으로 잇는다', '마지막 칸은 링크가 아니라 현재 위치로 둔다'],
        dont: ['제목만 두고 상위 갈래를 지운다'],
      },
      {
        id: 'danger-in-menu',
        title: '위험한 동작은 Dropdown Menu 안쪽에 둔다',
        body: '삭제·정지처럼 되돌리기 어려운 동작은 한 번 더 열어야 닿게 한다. 자주 쓰는 동작 옆에 나란히 두면 손이 미끄러진다.',
        do: ['수정은 버튼으로, 삭제는 메뉴 안에'],
        dont: ['삭제를 제목 줄에 채운 버튼으로 둔다'],
      },
      {
        id: 'header-persists-across-tabs',
        title: '탭을 바꿔도 제목과 동작은 남는다',
        body: '탭은 한 대상의 정보를 나누는 것이지 다른 화면으로 가는 것이 아니다. 머리가 함께 바뀌면 같은 대상을 보고 있다는 감각이 끊어진다.',
        do: ['Tabs를 제목과 동작 아래에 둔다'],
        dont: ['탭마다 제목 줄을 다시 그린다'],
      },
    ],
    example: {
      title: '사용자 상세',
      note: '제목과 상태, 동작, 그리고 세 갈래의 탭까지 상세 화면 하나를 조립한 것이다.',
    },
    cases: [
      { id: 'long-title', title: '제목이 긴 경우', note: '제목은 줄바꿈하고 동작은 오른쪽 끝에 남는다.' },
      { id: 'many-tabs', title: '탭이 많은 경우', note: '탭 줄이 가로로 구른다. 탭을 접어 숨기지 않는다.' },
      { id: 'locked-tab', title: '권한이 없어 일부 탭이 잠긴 경우', note: '탭은 남기고 비활성으로 둔다. 왜 잠겼는지 내용에 적는다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '제목과 동작이 세로로 쌓이고 Description List가 한 줄씩 놓인다.' },
    ],
    verified: false,
  },
```

Run: `npm test -- src/data/patterns.test.ts`
Expected: PASS — 구조 규칙은 이미 지켜진다.

- [ ] **Step 2: nav-config 테스트가 실패하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: FAIL — `expected [ '/patterns/list' ] to deeply equal [ '/patterns/list', '/patterns/detail' ]`

- [ ] **Step 3: 문서를 조립한다**

`src/routes/patterns/DetailPatternPage.tsx`. `ListPatternPage`와 같은 얼개다 — `getPattern('detail')`, 없으면 `Placeholder`, 있으면 `PatternPage`.

Example은 아래 다섯을 실제 컴포넌트로 세운다.
1. `Breadcrumb`: 회원 → 사용자 → 홍길동(마지막은 `BreadcrumbPage`).
2. 제목 줄: `<h4>`에 이름, 옆에 `<Badge variant="success">활성</Badge>`. `h3`을 쓰면 안 된다 — assignHeadingIds가 main 아래의 h2·h3을 전부 목차로 쓸어 담아, 예시 속 가짜 화면 제목이 문서의 절인 것처럼 오른쪽 목차에 뜬다. ButtonPage가 같은 이유로 h4를 쓴다.
3. 동작: `<Button variant="outline" size="sm">수정</Button>`과 `DropdownMenu`(트리거는 `<Button variant="ghost" size="icon">`에 `MoreHorizontal` 아이콘 + `aria-label`). 메뉴 안에 `DropdownMenuItem` 정지·삭제.
4. `Tabs`: `defaultValue="info"`, 트리거 셋(정보·주문·활동). 값은 `info` · `orders` · `activity`.
5. 탭 내용: `info`는 `DescriptionList`, `orders`는 작은 `Table`, `activity`는 목록.

`renderGuidelineExample`은 세 id를 모두 덮는다. `breadcrumb-shows-origin`의 dont는 Breadcrumb 없이 제목만, `danger-in-menu`의 dont는 삭제를 `variant="destructive"` 버튼으로 제목 줄에 둔 것, `header-persists-across-tabs`의 dont는 탭 아래에 제목을 다시 그린 것이다.

`renderCase`는 네 id를 모두 덮는다. `locked-tab`은 `TabsTrigger`에 `disabled`를 걸고 그 옆에 왜 잠겼는지 한 줄을 둔다.

**아이콘 전용 버튼에는 반드시 `aria-label`을, 그 안의 아이콘에는 `aria-hidden`을 단다** — v0.10.0에서 여섯 곳이 빠져 있어 고쳤던 자리다.

- [ ] **Step 4: 라우트와 LNB를 잇는다**

`routes.tsx`의 `patterns.children`에 `{ path: 'detail', element: <DetailPatternPage /> }`를 `list` 다음에 더하고 import를 넣는다.

`nav-config.ts`의 Patterns `items`에 `list` 다음으로 더한다:

```ts
      { to: '/patterns/detail', label: 'Detail', summary: '항목 하나를 갈래로 나눠 보이는 화면', updatedAt: '2026-08-27' },
```

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS

- [ ] **Step 6: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/patterns/detail`. 탭을 눌러 바꿔도 제목 줄과 동작이 그대로인지, Dropdown Menu가 열리는지 본다. **키보드 이동은 이 하네스에서 검증할 수 없다** — Tabs의 화살표 이동은 Radix의 `TabsPrimitive.List` 소스로만 확인하고, 그 사실을 확인했다고 적는다.

- [ ] **Step 7: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 8: 커밋**

```bash
git add src/data/patterns.ts src/routes/patterns/DetailPatternPage.tsx src/components/layout/nav-config.ts src/routes/routes.tsx
git commit -m "feat(patterns): Detail 문서를 싣는다

탭은 한 대상의 정보를 나누는 것이지 다른 화면으로 가는 것이 아니다.
그래서 제목과 동작을 Tabs 위에 두고, 탭을 바꿔도 그 줄이 남는다는 것을
Example과 Guidelines 양쪽에서 보인다.

위험한 동작은 Dropdown Menu 안쪽에 둔다. 아이콘 전용 트리거에는
aria-label을, 그 안의 아이콘에는 aria-hidden을 달았다."
```

---

## Task 4: Form 패턴

입력 화면. 라벨·도움말·오류를 컨트롤에 잇는 일은 `Field`가 맡는다 — `htmlFor`나 `aria-describedby`를 손으로 쓰지 않는다.

**Files:**
- Modify: `src/data/patterns.ts`
- Create: `src/routes/patterns/FormPatternPage.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `PatternPage`(Task 2), `getPattern`(Task 1), `Field` · `FieldLabel` · `FieldControl` · `FieldHelp` · `FieldError`(`@/components/ui/field`)
- Produces: `function FormPatternPage(): ReactNode`, `patterns`에 `id: 'form'` 항목

**`Field`의 계약(소스에서 확인한 것).** `Field`가 `useId`로 뿌리 id를 만들고 컨텍스트에 담는다. `FieldLabel`은 그 id를 `htmlFor`로 걸고 자기 `labelId`도 단다. `FieldControl`은 자식 하나에게 `id` · `aria-labelledby` · `aria-invalid` · `aria-describedby` · `disabled`를 내려준다. `FieldHelp`와 `FieldError`는 각자 마운트될 때 스스로 등록하므로, 있는 것만 `aria-describedby`에 이어진다. `state`는 `'default' | 'error' | 'disabled'`, `layout`은 `'stacked' | 'horizontal'`.

- [ ] **Step 1: 데이터를 넣는다**

`patterns` 배열에서 `detail` 다음:

```ts
  {
    id: 'form',
    name: 'Form',
    aliases: ['폼', '입력 화면', '등록 화면', '수정 화면'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '값을 입력받아 저장하는 화면이다. 라벨·도움말·오류가 컨트롤과 어떻게 이어지는지를 정한다.',
    structure: [
      { slot: 'Field', note: '라벨·컨트롤·도움말·오류를 하나의 id 계약으로 묶는다. htmlFor와 aria-describedby를 손으로 맞추지 않는다', components: ['field'] },
      { slot: '컨트롤', note: '값의 모양에 따라 고른다 — 짧은 글은 Input, 고르는 값은 Select, 긴 글은 Textarea', components: ['input', 'select', 'textarea'] },
      { slot: '켜고 끄는 값', note: '저장을 눌러야 반영되면 Checkbox, 누르는 순간 반영되면 Switch', components: ['checkbox', 'radio', 'switch'] },
      { slot: '도움말', note: '입력하기 전에 알아야 할 것. 컨트롤 아래 첫 줄에 둔다', components: ['field'] },
      { slot: '오류 문구', note: '입력한 뒤에 알게 되는 것. 도움말 아래에 둔다', components: ['field'], optional: true },
      { slot: '저장과 취소', note: '저장은 오른쪽, 취소는 왼쪽. Dialog의 동작 순서와 같다', components: ['button'] },
    ],
    guidelines: [
      {
        id: 'label-above-control',
        title: '라벨은 입력 위에 둔다',
        body: '어드민 폼은 길다. 라벨이 왼쪽에 있으면 라벨 열과 입력 열의 폭을 둘 다 맞춰야 하고, 긴 라벨 하나가 모든 행의 폭을 정한다.',
        do: ['Field의 stacked 배치를 기본으로 쓴다'],
        dont: ['긴 라벨이 섞인 폼에 horizontal을 쓴다'],
      },
      {
        id: 'help-before-error-after',
        title: '도움말은 입력 전에, 오류는 입력 후에 보인다',
        body: '도움말은 늘 있고 오류는 틀렸을 때만 나온다. 둘을 같은 자리에서 갈아 끼우면 도움말이 사라져 무엇을 고쳐야 하는지 알 수 없다.',
        do: ['도움말을 남긴 채 그 아래에 오류를 더한다'],
        dont: ['오류가 나면 도움말을 지운다'],
      },
      {
        id: 'save-right-cancel-left',
        title: '저장은 오른쪽, 취소는 왼쪽',
        body: '읽는 방향의 끝에 확정하는 동작을 둔다. Dialog의 취소·실행 순서와 같아야 손이 헷갈리지 않는다.',
        do: ['취소는 outline, 저장은 채운 버튼'],
        dont: ['저장을 왼쪽에 둔다'],
      },
      {
        id: 'switch-vs-checkbox',
        title: '즉시 반영되는 것에는 Switch를, 저장이 필요한 것에는 Checkbox를 쓴다',
        body: '두 컨트롤은 모양이 아니라 시점이 다르다. Switch는 누르는 순간 값이 바뀌고, Checkbox는 저장을 눌러야 바뀐다.',
        do: ['폼 안의 동의·선택은 Checkbox로', '설정 화면의 켜고 끄기는 Switch로'],
        dont: ['저장 버튼이 있는 폼 안에 Switch를 둔다'],
      },
    ],
    example: {
      title: '사용자 등록',
      note: 'Field로 묶은 컨트롤 다섯과 저장·취소까지, 입력 화면 하나를 조립한 것이다.',
    },
    cases: [
      { id: 'multiple-errors', title: '오류가 여럿인 경우', note: '각 Field가 자기 오류를 갖고, 폼 위에 몇 건인지 Alert로 한 번 더 보인다.' },
      { id: 'saving', title: '저장 중', note: '저장 버튼을 비활성으로 두고 무엇이 진행 중인지 적는다.' },
      { id: 'unsaved-changes', title: '나가려 할 때 저장하지 않은 변경이 있는 경우', note: 'Dialog로 묻는다. 되돌릴 수 없는 것이 아니므로 문구는 삭제 확인과 다르다.' },
      { id: 'narrow-screen', title: '좁은 화면', note: '컨트롤이 한 열로 쌓이고 저장·취소가 가로폭을 채운다.' },
    ],
    verified: false,
  },
```

Run: `npm test -- src/data/patterns.test.ts`
Expected: PASS

- [ ] **Step 2: nav-config 테스트가 실패하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: FAIL — `/patterns/form`이 없다고 한다.

- [ ] **Step 3: 문서를 조립한다**

`src/routes/patterns/FormPatternPage.tsx`. 라벨·도움말·오류는 전부 `Field`로 묶는다. `<label htmlFor=...>`를 직접 쓰지 않는다.

Example의 뼈대:

```tsx
function FormExample() {
  return (
    <form className="flex max-w-md flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
      <Field>
        <FieldLabel>이름</FieldLabel>
        <FieldControl>
          <Input placeholder="홍길동" />
        </FieldControl>
        <FieldHelp>실명을 씁니다. 목록과 알림에 이 이름이 나옵니다.</FieldHelp>
      </Field>

      <Field state="error">
        <FieldLabel>이메일</FieldLabel>
        <FieldControl>
          <Input type="email" defaultValue="hong@" />
        </FieldControl>
        <FieldHelp>로그인에 쓰는 주소입니다.</FieldHelp>
        <FieldError>이메일 형식이 아닙니다.</FieldError>
      </Field>

      <Field>
        <FieldLabel>권한</FieldLabel>
        <FieldControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="권한을 고르세요" />
          </SelectTrigger>
        </FieldControl>
        <FieldHelp>나중에 상세 화면에서 바꿀 수 있습니다.</FieldHelp>
      </Field>

      <Field>
        <FieldLabel>메모</FieldLabel>
        <FieldControl>
          <Textarea rows={3} />
        </FieldControl>
      </Field>

      <div className="flex items-center gap-2">
        <Checkbox id="notify" />
        <label htmlFor="notify" className="text-sm">가입 안내 메일을 보냅니다</label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">취소</Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  )
}
```

세 가지를 지킨다.
1. `SelectTrigger`를 `FieldControl`의 자식으로 둘 때는 `Select` 루트가 그 바깥을 감싸야 한다 — `<Select><Field>…<FieldControl><SelectTrigger/></FieldControl>…</Field></Select>` 순으로 세운다. `FieldControl`은 자식 하나만 받는다.
2. 마지막 Checkbox 줄은 `Field` 없이 쓴 유일한 자리다. 이유를 주석으로 남긴다 — 라벨이 컨트롤 오른쪽에 오는 배치라 `Field`의 stacked·horizontal 어느 쪽도 아니기 때문이다. `htmlFor`와 `id`를 짝지어 직접 잇는다.
3. `renderGuidelineExample`은 네 id를 모두 덮고, `renderCase`는 네 id를 모두 덮는다. `unsaved-changes`는 `DialogTrigger`가 있는 닫힌 Dialog다 — **열린 채로 마운트하지 않는다.**

- [ ] **Step 4: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ path: 'form', element: <FormPatternPage /> }`
`nav-config.ts`:

```ts
      { to: '/patterns/form', label: 'Form', summary: '라벨·도움말·오류의 배치를 정하는 입력 화면', updatedAt: '2026-08-27' },
```

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS

- [ ] **Step 6: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/patterns/form`. 라벨을 눌렀을 때 그 컨트롤로 포커스가 가는지 마우스로 확인한다(`FieldLabel`의 `onClick`이 `label.control`이 비면 직접 옮긴다). 오류가 붙은 Field에서 컨트롤에 `aria-invalid`와 `aria-describedby`가 붙었는지는 `javascript_tool`로 DOM을 읽어 확인한다 — 눈으로는 보이지 않는다.

- [ ] **Step 7: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 8: 커밋**

```bash
git add src/data/patterns.ts src/routes/patterns/FormPatternPage.tsx src/components/layout/nav-config.ts src/routes/routes.tsx
git commit -m "feat(patterns): Form 문서를 싣는다

라벨·도움말·오류를 컨트롤에 잇는 일은 v0.10.0에서 들어온 Field가 맡는다.
htmlFor도 aria-describedby도 손으로 쓰지 않았다. 라벨이 컨트롤 오른쪽에
오는 Checkbox 한 줄만 예외이고, 그 이유를 주석으로 남겼다.

Switch와 Checkbox의 차이는 모양이 아니라 시점이다 — 저장을 눌러야
반영되는 폼 안에는 Switch를 두지 않는다는 것을 지침으로 적었다.

저장하지 않은 변경을 묻는 Dialog는 트리거로 연다. 열린 채로 마운트하지
않는다."
```

---

## Task 5: Empty and error 패턴

비어 있을 때와 실패했을 때. `EmptyState`의 네 `variant`가 그대로 이 패턴의 네 경우다.

**Files:**
- Modify: `src/data/patterns.ts`
- Create: `src/routes/patterns/EmptyAndErrorPatternPage.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `PatternPage`(Task 2), `getPattern`(Task 1), `EmptyState` · `EmptyStateIcon` · `EmptyStateTitle` · `EmptyStateDescription` · `EmptyStateAction`(`@/components/ui/empty-state`)
- Produces: `function EmptyAndErrorPatternPage(): ReactNode`, `patterns`에 `id: 'empty-and-error'` 항목

`EmptyStateVariant`는 `'empty' | 'no-results' | 'error' | 'no-permission'`이고 `EmptyStateSize`는 `'default' | 'compact'`다(소스에서 확인).

- [ ] **Step 1: 데이터를 넣는다**

`patterns` 배열에서 `form` 다음:

```ts
  {
    id: 'empty-and-error',
    name: 'Empty and error',
    aliases: ['빈 상태', '빈 화면', '오류 화면', 'empty state', 'error state'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '보여줄 것이 없거나 불러오지 못했을 때의 화면이다. 어드민에서 자주 나오는데 자주 빠뜨린다.',
    structure: [
      { slot: '아이콘', note: '무슨 종류의 자리인지 한눈에 가른다. 뜻은 아이콘이 아니라 글이 전한다', components: ['empty-state'] },
      { slot: '무슨 일인지', note: '한 줄로 상황을 적는다. 원인을 아는 경우에만 원인을 적는다', components: ['empty-state'] },
      { slot: '무엇을 할 수 있는지', note: '다음에 할 일을 적는다. 할 일이 없으면 이 줄을 비운다', components: ['empty-state'], optional: true },
      { slot: '동작', note: '사용자가 할 수 있는 일이 있을 때만 둔다', components: ['button'], optional: true },
    ],
    guidelines: [
      {
        id: 'empty-is-not-error',
        title: '빈 것과 실패한 것을 구별한다',
        body: '아직 아무것도 없는 것은 정상이고, 불러오지 못한 것은 사고다. 같은 화면으로 보이면 사용자가 없는 문제를 고치려 든다.',
        do: ['빈 상태는 안내하는 말로, 실패는 무엇이 잘못됐는지로'],
        dont: ['둘 다 "데이터가 없습니다"로 적는다'],
      },
      {
        id: 'give-an-action',
        title: '사용자가 할 수 있는 일이 있으면 동작을 둔다',
        body: '빈 화면에서 다음에 무엇을 눌러야 하는지 알려 주는 것이 이 자리의 값이다. 할 일이 없으면 억지로 버튼을 만들지 않는다.',
        do: ['첫 항목 만들기 · 조건 지우기 · 다시 시도'],
        dont: ['할 일이 없는데 "확인" 버튼을 둔다'],
      },
      {
        id: 'first-visit-is-guidance',
        title: '첫 방문의 빈 상태는 안내이지 오류가 아니다',
        body: '아직 만들지 않은 것은 잘못이 아니다. 붉은 색과 경고 아이콘을 쓰면 처음 온 사람이 자기가 무언가 망가뜨렸다고 읽는다.',
        do: ['중립 색으로, 무엇을 만들 수 있는지 적는다'],
        dont: ['destructive 색이나 경고 아이콘을 쓴다'],
      },
    ],
    example: {
      title: '네 가지 빈 자리',
      note: '아직 없음 · 검색 결과 없음 · 권한 없음 · 불러오기 실패를 나란히 놓아 문구와 색이 어떻게 갈리는지 본다.',
    },
    cases: [
      { id: 'nothing-yet', title: '아직 아무것도 없음', note: '첫 항목을 만드는 길을 준다. 경고가 아니다.' },
      { id: 'no-search-results', title: '검색 결과 없음', note: '무엇으로 걸렀는지 되짚고 조건을 지우는 길을 준다.' },
      { id: 'no-permission', title: '권한 없음', note: '누구에게 요청해야 하는지 적는다. 다시 시도는 두지 않는다.' },
      { id: 'load-failed', title: '불러오기 실패', note: '다시 시도를 둔다. 원인을 모르면 원인을 지어내지 않는다.' },
    ],
    verified: false,
  },
```

Run: `npm test -- src/data/patterns.test.ts`
Expected: PASS

- [ ] **Step 2: nav-config 테스트가 실패하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: FAIL — `/patterns/empty-and-error`가 없다.

- [ ] **Step 3: 문서를 조립한다**

`src/routes/patterns/EmptyAndErrorPatternPage.tsx`. 네 `variant`를 실제로 렌더링하는 작은 조각 하나를 만들어 Example과 Cases가 나눠 쓴다.

```tsx
function Slot({
  variant,
  icon,
  title,
  description,
  action,
}: {
  variant: EmptyStateVariant
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <EmptyState variant={variant} size="compact">
      <EmptyStateIcon>{icon}</EmptyStateIcon>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {action && <EmptyStateAction>{action}</EmptyStateAction>}
    </EmptyState>
  )
}
```

아이콘은 `lucide-react`에서 가져오고 모두 `aria-hidden`을 단다. 문구는 Writing 규칙을 따른다 — 무엇이 없는지와 다음에 할 일을 적고, 원인을 모르면 원인을 적지 않는다.

`renderGuidelineExample`은 세 id를 덮는다. `first-visit-is-guidance`의 dont는 같은 상황을 `variant="error"`로 그린 것이다 — 같은 문구를 색만 바꿔 두면 차이가 색뿐인 것으로 읽히므로, 문구도 함께 사고처럼 바꾼다.

- [ ] **Step 4: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ path: 'empty-and-error', element: <EmptyAndErrorPatternPage /> }`
`nav-config.ts`:

```ts
      { to: '/patterns/empty-and-error', label: 'Empty and error', summary: '비어 있을 때와 실패했을 때의 화면', updatedAt: '2026-08-27' },
```

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS

- [ ] **Step 6: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/patterns/empty-and-error`. 네 자리가 색만이 아니라 문구로도 갈리는지 본다 — "색만으로 뜻을 전하지 않는다"가 이 문서에서 스스로 지켜져야 한다. 라이트·다크 양쪽에서 확인한다.

- [ ] **Step 7: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 8: 커밋**

```bash
git add src/data/patterns.ts src/routes/patterns/EmptyAndErrorPatternPage.tsx src/components/layout/nav-config.ts src/routes/routes.tsx
git commit -m "feat(patterns): Empty and error 문서를 싣는다

아직 아무것도 없는 것은 정상이고 불러오지 못한 것은 사고다. 같은
화면으로 보이면 사용자가 없는 문제를 고치려 든다. EmptyState의 네
variant가 그대로 이 패턴의 네 경우여서, 네 자리를 나란히 놓아 문구와
색이 어떻게 갈리는지 보인다.

색만으로 갈리지 않게 문구도 함께 바꿨다."
```

---

## Task 6: Destructive confirm 패턴

되돌릴 수 없는 동작. Dialog로 묻고 Toast로 알린다. 이 패턴에만 상태가 필요하다 — 확인을 누른 뒤에 Toast가 뜨는 흐름을 보여야 하기 때문이다.

**Files:**
- Modify: `src/data/patterns.ts`
- Create: `src/routes/patterns/DestructiveConfirmPatternPage.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `PatternPage`(Task 2), `getPattern`(Task 1), `Dialog` 계열과 `Toast` 계열
- Produces: `function DestructiveConfirmPatternPage(): ReactNode`, `patterns`에 `id: 'destructive-confirm'` 항목

**Toast를 문서 안에서 보이는 방법(ToastPage에서 이미 쓰는 것).** 화면 오른쪽 아래로 날아가면 예시 액자 안에서 보이지 않는다. 문서 안에서는 지역 `ToastProvider`를 열고 `ToastViewport`에 `className="static right-auto bottom-auto w-auto max-w-none flex-none"`을 걸어 그 자리에 세운다. 사라지지 않게 하려면 `duration={Infinity}`를 준다.

- [ ] **Step 1: 데이터를 넣는다**

`patterns` 배열에서 `empty-and-error` 다음:

```ts
  {
    id: 'destructive-confirm',
    name: 'Destructive confirm',
    aliases: ['삭제 확인', '위험 동작', '확인 대화상자', '되돌릴 수 없는 동작'],
    status: 'draft',
    addedIn: 'v0.11.0',
    changedIn: 'v0.11.0',
    purpose:
      '되돌릴 수 없는 동작을 실행하기 전에 한 번 멈추는 흐름이다. Dialog로 묻고 Toast로 결과를 알린다.',
    structure: [
      { slot: '위험 동작 Button', note: 'destructive 버튼이거나 Dropdown Menu 안의 항목이다', components: ['button', 'dropdown-menu'] },
      { slot: 'Dialog 제목', note: '무엇이 지워지는지 적는다. "삭제하시겠습니까"만으로는 대상을 알 수 없다', components: ['dialog'] },
      { slot: 'Dialog 본문', note: '영향 범위를 적는다. 되돌릴 수 없으면 그 사실을 여기에 적는다', components: ['dialog'] },
      { slot: '취소와 실행', note: '취소는 왼쪽 outline, 실행은 오른쪽 destructive', components: ['button'] },
      { slot: 'Toast', note: '실행한 뒤에 결과를 알린다. 되돌릴 수 있으면 여기에 되돌리기를 둔다', components: ['toast'] },
    ],
    guidelines: [
      {
        id: 'name-the-target',
        title: '제목에 무엇이 지워지는지 적는다',
        body: '대화상자는 목록에서 멀리 떨어져 뜬다. 방금 무엇을 눌렀는지 제목이 다시 말해 주지 않으면 확인이 확인이 아니다.',
        do: ["'홍길동'을 삭제하시겠습니까"],
        dont: ['삭제하시겠습니까'],
      },
      {
        id: 'show-the-count',
        title: '영향 범위가 넓으면 개수를 보인다',
        body: '여럿을 한꺼번에 지울 때 몇 건인지가 판단의 전부다. 목록을 다 늘어놓을 수 없으면 개수라도 적는다.',
        do: ['선택한 12건을 삭제합니다'],
        dont: ['선택한 항목을 삭제합니다'],
      },
      {
        id: 'undo-in-toast',
        title: '되돌릴 수 있으면 Toast에 되돌리기를 둔다',
        body: '되돌릴 수 있는 동작에는 확인 단계를 줄이고 되돌리기를 준다. 묻는 단계와 되돌리는 단계를 둘 다 두면 확인이 소음이 된다.',
        do: ['ToastAction으로 되돌리기를 둔다'],
        dont: ['되돌릴 수 있는데도 대화상자로 한 번 더 묻는다'],
      },
      {
        id: 'say-when-irreversible',
        title: '되돌릴 수 없으면 그 사실을 본문에 적는다',
        body: '되돌릴 수 없다는 말은 제목이 아니라 본문에 둔다. 제목은 대상을 말하는 자리다.',
        do: ['삭제하면 되돌릴 수 없습니다.'],
        dont: ['본문 없이 제목만 두고 실행 버튼을 붉게 칠한다'],
      },
    ],
    example: {
      title: '사용자 삭제',
      note: '버튼을 눌러 Dialog를 열고, 삭제를 누르면 그 자리에 Toast가 뜨는 흐름 전체다.',
    },
    cases: [
      { id: 'delete-one', title: '하나 삭제', note: '제목에 대상의 이름을 적는다.' },
      { id: 'delete-many', title: '여럿 삭제', note: '제목에 개수를 적고 본문에 무엇이 함께 지워지는지 적는다.' },
      { id: 'irreversible', title: '되돌릴 수 없는 삭제', note: '본문에 되돌릴 수 없다고 적고 Toast에 되돌리기를 두지 않는다.' },
      { id: 'failed', title: '실행 실패', note: 'destructive Toast로 알린다. 대화상자는 닫지 않고 다시 시도할 수 있게 둔다.' },
    ],
    verified: false,
  },
```

Run: `npm test -- src/data/patterns.test.ts`
Expected: PASS

- [ ] **Step 2: nav-config 테스트가 실패하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: FAIL — `/patterns/destructive-confirm`이 없다.

- [ ] **Step 3: 문서를 조립한다**

`src/routes/patterns/DestructiveConfirmPatternPage.tsx`. Example은 흐름 전체를 한 조각에 담는다.

```tsx
function DestructiveFlow() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <ToastProvider duration={Infinity}>
      <div className="flex flex-col items-start gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>'홍길동'을 삭제하시겠습니까</DialogTitle>
              <DialogDescription>
                이 사용자의 주문 12건도 함께 지워집니다. 삭제하면 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(false)
                  setDone(true)
                }}
              >
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {done && (
          <Toast className="w-72" onOpenChange={(next) => !next && setDone(false)}>
            <ToastTitle>'홍길동'을 삭제했습니다</ToastTitle>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport className="static right-auto bottom-auto w-auto max-w-none flex-none" />
      </div>
    </ToastProvider>
  )
}
```

세 가지를 지킨다.
1. **Dialog는 닫힌 채로 마운트된다.** `open`의 초기값은 `false`다.
2. 이 Example의 Toast에는 되돌리기가 없다 — 본문이 "되돌릴 수 없습니다"라고 말하기 때문이다. 되돌리기가 있는 쪽은 `undo-in-toast` 지침의 do 예시에서 `ToastAction`으로 보인다. **문구와 화면이 서로 어긋나면 안 된다.**
3. `renderCase`의 `failed`는 `variant="destructive"` Toast를 쓴다.

- [ ] **Step 4: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ path: 'destructive-confirm', element: <DestructiveConfirmPatternPage /> }`
`nav-config.ts`:

```ts
      { to: '/patterns/destructive-confirm', label: 'Destructive confirm', summary: '되돌릴 수 없는 동작을 묻고 알리는 흐름', updatedAt: '2026-08-27' },
```

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS

- [ ] **Step 6: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/patterns/destructive-confirm`. 버튼을 눌러 대화상자를 열고 삭제를 눌러 Toast가 예시 액자 안에 뜨는지 본다. 화면을 처음 열었을 때 대화상자가 떠 있지 않은지도 확인한다. **Esc로 닫히는 동작은 이 하네스에서 검증할 수 없다** — Radix `DialogPrimitive.Content`의 `onEscapeKeyDown` 처리로만 확인하고 그렇게 적는다.

- [ ] **Step 7: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 8: 커밋**

```bash
git add src/data/patterns.ts src/routes/patterns/DestructiveConfirmPatternPage.tsx src/components/layout/nav-config.ts src/routes/routes.tsx
git commit -m "feat(patterns): Destructive confirm 문서를 싣는다

제목은 대상을 말하는 자리이고 되돌릴 수 없다는 말은 본문에 둔다.
Example의 Toast에 되돌리기를 두지 않은 것은 본문이 되돌릴 수 없다고
말하기 때문이다 — 문구와 화면이 어긋나지 않게 맞췄다.

Toast는 ToastPage와 같은 방법으로 예시 안에 세운다. 지역 ToastProvider와
static ToastViewport다. 대화상자는 닫힌 채로 마운트한다."
```

---

## Task 7: Patterns Overview와 낡은 문장 걷어내기

다섯 문서가 다 들어왔으므로 섹션 입구를 만든다. 그리고 이 회차가 거짓으로 만드는 문장 둘을 함께 고친다 — 이것을 뒤로 미루면 배포된 사이트가 "Patterns는 준비 중"이라고 말하면서 Patterns를 보여준다.

**Files:**
- Create: `src/routes/patterns/PatternsOverview.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/routes/foundations/FoundationsOverview.tsx`
- Modify: `src/routes/components/ComponentsIndex.tsx`
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/components/layout/nav-config.test.ts`

**Interfaces:**
- Consumes: `patterns` · `patternStats`(Task 1), `sections`(nav-config)
- Produces: `function PatternsOverview(): ReactNode`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

패턴 문서의 LNB 항목에는 `summary`가 있어야 한다 — 검색 결과의 한 줄 설명이 그 값에서 온다(`search-index.ts`의 `docRecords`). 비어 있으면 검색 결과가 제목만 남는다.

`src/components/layout/nav-config.test.ts`의 `describe('Patterns 목록', …)` 안에 더한다:

```ts
  it('모든 패턴 문서에 한 줄 설명이 있다', () => {
    const section = sections.find((s) => s.id === 'patterns')!
    for (const doc of topLevelDocs(section.items)) {
      expect(doc.summary, doc.to).toBeTruthy()
    }
  })
```

- [ ] **Step 2: 테스트를 돌린다**

Run: `npm test -- src/components/layout/nav-config.test.ts`
Expected: PASS — Task 2~6에서 모든 항목에 `summary`를 넣었으므로 이미 초록이다. 초록이 아니면 빠진 `summary`를 채운다.

- [ ] **Step 3: Patterns Overview를 만든다**

`src/routes/patterns/PatternsOverview.tsx`. 다른 섹션의 Overview와 같은 형태로 만든다 — `FoundationsOverview`와 `ComponentsIndex`가 본이다. 카드는 `nav-config`가 아니라 `patterns.ts`에서 파생한다.

```tsx
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { patternStats, patterns } from '@/data/patterns'

export function PatternsOverview() {
  const stats = patternStats()

  return (
    <DocPage
      title="Patterns"
      description={`등록된 패턴 ${stats.total}개 중 ${stats.verified}개를 눈으로 확인했습니다.`}
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          Patterns는 여러 부품이 모여 이루는 화면의 규칙입니다. 컴포넌트 문서가 부품 하나의
          구조와 속성을 다룬다면, 여기서는 그 부품들이 어떤 자리에 놓여 하나의 화면이 되는지를
          다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          문서는 같은 순서로 읽습니다. Structure가 어떤 컴포넌트가 어떤 자리에 오는지 늘어놓고,
          Guidelines가 판단이 갈리는 자리를 짚고, Example이 화면 하나를 통째로 보이고, Cases가
          비었을 때·실패했을 때·좁을 때를 보입니다.
        </p>
        <p className="text-muted-foreground text-sm">
          여기서 정하지 않는 것도 있습니다. 색과 간격 같은 값은 Foundations에서, 부품 하나의
          구조와 속성은 Components에서 다룹니다. 패턴 문서에는 축도 상태도 없습니다 — 화면의
          규칙에는 고를 수 있는 축이 없기 때문입니다.
        </p>
      </DocSection>

      <DocSection title="Pages">
        <ul className="grid gap-3 sm:grid-cols-2">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="h-full">
              <Link
                to={`/patterns/${pattern.id}`}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-sm">{pattern.name}</strong>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{pattern.purpose}</p>
                <span className="text-muted-foreground mt-2 block text-2xs">
                  {pattern.status} · {pattern.changedIn}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  )
}
```

- [ ] **Step 4: 라우트를 바꾼다**

`routes.tsx`의 `patterns` 중첩 라우트에서 `{ index: true, element: <Placeholder title="Patterns" /> }`를 `{ index: true, element: <PatternsOverview /> }`로 바꾸고 import를 더한다.

`nav-config.ts`의 Patterns Overview 항목 `updatedAt`을 `'2026-08-27'`로 올린다 — 문서 내용이 바뀌었기 때문이다.

- [ ] **Step 5: 거짓이 된 문장 둘을 고친다**

`src/routes/foundations/FoundationsOverview.tsx`:

```tsx
          여기서 정하지 않는 것도 있습니다. 개별 컴포넌트의 구조와 속성은 Components에서,
          여러 컴포넌트를 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
```

`src/routes/components/ComponentsIndex.tsx`:

```tsx
          여기서 정하지 않는 것도 있습니다. 색과 간격 같은 값은 Foundations에서,
          여러 부품을 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
```

두 문서의 `nav-config` 항목(`/foundations`, `/components`) `updatedAt`도 `'2026-08-27'`로 올린다.

`src/` 전체에서 `준비 중`을 다시 찾아 남은 것이 정당한지 확인한다. 남아도 되는 것은 `Placeholder.tsx`의 문구(404가 쓴다)와 `StepsPage.tsx`의 예시 데이터('상품 준비 중')와 `releases.ts`의 v0.10.0 기록(그때는 사실이었다)뿐이다.

Run: `grep -rn "준비 중" src/`

- [ ] **Step 6: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/patterns`. 카드 다섯이 `patterns.ts` 순서대로 놓이고 각 카드가 자기 문서로 가는지 본다. `/foundations`와 `/components`에서 고친 문장도 확인한다.

- [ ] **Step 7: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 8: 커밋**

```bash
git add src/routes/patterns/PatternsOverview.tsx src/routes/routes.tsx src/routes/foundations/FoundationsOverview.tsx src/routes/components/ComponentsIndex.tsx src/components/layout/nav-config.ts src/components/layout/nav-config.test.ts
git commit -m "feat(patterns): Patterns Overview를 만들고 낡은 문장을 걷어낸다

카드 목록은 nav-config가 아니라 patterns.ts에서 파생한다. 패턴이 늘면
카드도 함께 늘고, 손으로 적은 목록이 남지 않는다.

Foundations와 Components의 Overview가 'Patterns는 아직 준비 중입니다'라고
말하고 있었다. 이 회차로 거짓이 되므로 같은 커밋에서 고친다 — 문서가
코드에 대해 사실이 아닌 것을 말하면 그것이 곧 결함이다.

LNB의 패턴 항목마다 한 줄 설명이 있는지 테스트로 지킨다. 검색 결과의
설명이 그 값에서 온다."
```

---

## Task 8: Get started — Overview (`/`)

사이트의 첫 화면. 세 회차 동안 "이 문서는 아직 준비 중입니다"였던 자리다. 화면에 나오는 목록과 숫자는 전부 데이터에서 파생한다.

**Files:**
- Create: `src/routes/get-started/section-roles.ts`
- Test: `src/routes/get-started/section-roles.test.ts`
- Create: `src/routes/get-started/GetStartedOverview.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/nav-config.ts`

**Interfaces:**
- Consumes: `sections` · `flattenDocs`(nav-config), `componentStats`(registry), `patternStats`(Task 1)
- Produces:
  - `const sectionRole: Record<string, string>`
  - `function GetStartedOverview(): ReactNode`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/routes/get-started/section-roles.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { sections } from '@/components/layout/nav-config'
import { sectionRole } from '@/routes/get-started/section-roles'

describe('sectionRole', () => {
  /*
   * 섹션이 늘거나 이름이 바뀌면 첫 화면이 조용히 그 섹션을 빠뜨린다.
   * 화면을 봐도 '없는 것'은 보이지 않으므로 여기서 막는다.
   */
  it('nav-config의 섹션과 키가 정확히 같다', () => {
    expect(Object.keys(sectionRole).sort()).toEqual(sections.map((s) => s.id).sort())
  })

  it('모든 설명이 비어 있지 않다', () => {
    for (const [id, role] of Object.entries(sectionRole)) {
      expect(role, id).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/routes/get-started/section-roles.test.ts`
Expected: FAIL — `Failed to resolve import "@/routes/get-started/section-roles"`

- [ ] **Step 3: `section-roles.ts`를 쓴다**

```ts
/**
 * 섹션마다 그 섹션이 맡는 일 한 줄.
 *
 * 첫 화면이 GNB의 다섯 섹션을 늘어놓을 때 쓴다. 섹션 목록 자체는
 * nav-config에서 파생하고 여기에는 설명만 둔다 — 두 곳에 목록이
 * 있으면 갈라진다. 키가 섹션과 정확히 맞물리는지는 테스트가 지킨다.
 */
export const sectionRole: Record<string, string> = {
  'get-started': '여기가 무엇이고 어디서부터 읽는지, 어떻게 띄우고 어떤 원칙을 따르는지 다룹니다.',
  foundations: '색·타이포·간격 같은 토큰과, 말투와 문구처럼 코드에 담기지 않는 원칙을 다룹니다.',
  components: '화면을 이루는 낱개의 부품을 다룹니다. 구조와 속성, 언제 쓰고 언제 쓰지 않는지.',
  patterns: '여러 부품이 모여 이루는 화면의 규칙을 다룹니다. 목록·상세·입력·빈 자리·확인.',
  updates: '버전마다 무엇이 바뀌었는지 기록합니다.',
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/routes/get-started/section-roles.test.ts`
Expected: PASS

- [ ] **Step 5: 첫 화면을 만든다**

`src/routes/get-started/GetStartedOverview.tsx`. 네 절이다 — Overview · Sections · Reading order · Status.

```tsx
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { flattenDocs, sections } from '@/components/layout/nav-config'
import { patternStats } from '@/data/patterns'
import { componentStats } from '@/data/registry'
import { sectionRole } from '@/routes/get-started/section-roles'

export function GetStartedOverview() {
  const components = componentStats()
  const patterns = patternStats()

  return (
    <DocPage
      title="어드민 디자인 시스템"
      description="어드민 화면을 만들 때 쓰는 디자인 시스템이자, 그 시스템이 제대로 서 있는지 눈으로 확인하는 작업대입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          제품이 아니라 작업대입니다. 컴포넌트를 실제 화면에 붙이기 전에 변형과 상태를 한자리에
          늘어놓고 눈으로 확인하는 곳이고, 확인을 마친 것을 다음 프로젝트로 가져가는 곳입니다.
        </p>
        <p className="text-muted-foreground text-sm">
          한 사람이 만들고 한 사람이 씁니다. 그래서 기여 안내도 합의 절차도 없습니다. 대신
          문서가 코드에 대해 사실만 말하는지를 계속 확인합니다 — 여기서는 문서가 곧 제품입니다.
        </p>
      </DocSection>

      <DocSection title="Sections">
        <ul className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id} className="h-full">
              <Link
                to={section.to}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-sm">{section.label}</strong>
                <p className="text-muted-foreground mt-1 text-xs">{sectionRole[section.id]}</p>
                <span className="text-muted-foreground mt-2 block text-2xs">
                  문서 {flattenDocs(section.items).length}개
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Reading order">
        <p className="text-muted-foreground text-sm">
          순서가 있습니다. Foundations가 바닥입니다 — 색과 간격과 말투를 여기서 정하고, 그
          값이 모든 컴포넌트에 그대로 실립니다.
        </p>
        <p className="text-muted-foreground text-sm">
          그 위에 Components가 섭니다. 부품 하나하나의 구조와 속성을 다루고, 값은 Foundations에서
          가져다 씁니다.
        </p>
        <p className="text-muted-foreground text-sm">
          Patterns가 그것들을 엮습니다. 목록·상세·입력처럼 화면 단위의 규칙이라, 엮을 부품이
          없으면 쓸 수 없습니다. 그래서 이 섹션이 가장 늦게 채워졌습니다.
        </p>
      </DocSection>

      <DocSection title="Status">
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-lg border p-4">
            <strong className="text-2xl font-bold tracking-tight">{components.total}</strong>
            <p className="text-muted-foreground mt-1 text-xs">
              컴포넌트 · 그중 {components.verified}개를 눈으로 확인했습니다
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <strong className="text-2xl font-bold tracking-tight">{patterns.total}</strong>
            <p className="text-muted-foreground mt-1 text-xs">
              패턴 · 그중 {patterns.verified}개를 눈으로 확인했습니다
            </p>
          </li>
          <li className="rounded-lg border p-4">
            <strong className="text-2xl font-bold tracking-tight">
              {sections.reduce((n, s) => n + flattenDocs(s.items).length, 0)}
            </strong>
            <p className="text-muted-foreground mt-1 text-xs">문서</p>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  )
}
```

**숫자를 손으로 적지 않는다.** 세 숫자 모두 `componentStats()` · `patternStats()` · `flattenDocs()`에서 나온다.

- [ ] **Step 6: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ index: true, element: <Placeholder title="Get started" /> }` → `{ index: true, element: <GetStartedOverview /> }`. import를 더한다.

`nav-config.ts`의 `/` 항목 `updatedAt`을 `'2026-08-27'`로 올린다.

- [ ] **Step 7: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/`. 카드 다섯의 문서 개수가 LNB의 실제 항목 수와 맞는지 세어 본다. Status의 세 숫자가 각각 32 · 5 · (전체 문서 수)인지 확인한다 — 숫자가 다르면 데이터를 고치는 것이 아니라 왜 다른지를 먼저 본다.

- [ ] **Step 8: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 9: 커밋**

```bash
git add src/routes/get-started src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(get-started): 첫 화면을 채운다

세 회차 동안 방문자가 처음 보는 화면이 '준비 중'이었다.

섹션 목록도 문서 개수도 컴포넌트·패턴 수도 전부 데이터에서 파생한다.
손으로 적은 숫자가 하나도 없다. 섹션이 늘었는데 설명이 빠지는 일을
막으려고, 설명 표의 키가 nav-config의 섹션과 정확히 같은지 테스트로
지킨다."
```

---

## Task 9: Get started — Install

작업대를 로컬에서 띄우는 법과 토큰을 제품에 가져가는 법. 명령 이름은 `package.json`의 `scripts`와 어긋날 수 없어야 한다.

**Files:**
- Create: `src/routes/get-started/install-commands.ts`
- Test: `src/routes/get-started/install-commands.test.ts`
- Create: `src/routes/get-started/InstallPage.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/nav-config.ts`

**Interfaces:**
- Consumes: `DocPage` · `DocSection` · `DoDont` · `CopyValue`(`@/components/docs/*`)
- Produces:
  - `type InstallCommand = { script: string; note: string }`
  - `const installCommands: InstallCommand[]`
  - `function InstallPage(): ReactNode`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/routes/get-started/install-commands.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../../../package.json'
import { installCommands } from '@/routes/get-started/install-commands'

describe('installCommands', () => {
  /*
   * 화면에 'npm run dev'라고 적어 두고 package.json에서 그 스크립트가
   * 사라지면 문서가 없는 명령을 시킨다. 테스트에서만 package.json을
   * 읽는다 — 앱 번들에 넣지 않는다.
   */
  it('모든 명령이 package.json의 scripts에 실재한다', () => {
    const scripts = Object.keys(pkg.scripts)
    for (const command of installCommands) {
      expect(scripts, command.script).toContain(command.script)
    }
  })

  it('명령이 중복되지 않는다', () => {
    const names = installCommands.map((c) => c.script)
    expect(new Set(names).size).toBe(names.length)
  })

  it('모든 명령에 설명이 있다', () => {
    for (const command of installCommands) {
      expect(command.note, command.script).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/routes/get-started/install-commands.test.ts`
Expected: FAIL — `Failed to resolve import "@/routes/get-started/install-commands"`

- [ ] **Step 3: `install-commands.ts`를 쓴다**

```ts
/**
 * Install 문서가 보이는 npm 스크립트.
 *
 * 명령 문자열을 화면에 적는 대신 스크립트 이름만 두고 'npm run {script}'로
 * 조립한다. 그 이름이 package.json에 실재하는지는 테스트가 지킨다 —
 * package.json 자체를 앱에 들이지 않으면서 문서가 없는 명령을 시키는 일을
 * 막는 방법이다.
 */
export type InstallCommand = {
  script: string
  note: string
}

export const installCommands: InstallCommand[] = [
  { script: 'dev', note: '개발 서버를 띄웁니다. 이 작업대를 브라우저에서 보는 방법입니다.' },
  { script: 'build', note: '타입을 검사하고(tsc -b) 프로덕션 번들을 만듭니다. 타입이 깨지면 여기서 멈춥니다.' },
  { script: 'test', note: 'vitest를 한 번 돌립니다. DOM 없이 도는 순수 로직만 덮습니다.' },
  { script: 'registry', note: 'registry.json에서 public/r/을 다시 만듭니다. 컴포넌트를 고친 뒤 이 명령을 돌려야 바깥에 닿습니다.' },
]
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/routes/get-started/install-commands.test.ts`
Expected: PASS

- [ ] **Step 5: Install 문서를 만든다**

`src/routes/get-started/InstallPage.tsx`. 네 절이다.

1. **Overview** — 쓰임이 둘이라는 것. 작업대를 로컬에서 띄우는 것과, 토큰을 제품에 가져가는 것.
2. **Run locally** — `npm install`을 먼저 적고(이것은 스크립트가 아니라 npm 자체의 명령이므로 `installCommands`에 없다는 것을 주석으로 남긴다), 그 아래에 `installCommands`를 돌려 `npm run {script}`와 설명을 늘어놓는다. 명령 문자열은 `CopyValue`로 감싸 눌러 복사할 수 있게 한다.
3. **Use the tokens** — `src/styles/tokens.css`가 토큰의 단일 출처라는 것. Tailwind v4의 `@theme`에 얹혀 있으므로 `globals.css`에서 `@import "tailwindcss"` 뒤에 들여온다는 것. 실제 순서는 `tailwindcss` → `tw-animate-css` → `tokens.css`다(`src/styles/globals.css`에서 확인). 폰트는 Pretendard이고 **자세한 스택은 Typography 문서를 가리키기만 한다** — 여기에 다시 적지 않는다.
4. **Guidelines** — `DoDont`를 쓴다.
   - do: 색·간격·radius·shadow는 `tokens.css`의 토큰을 통해서만 쓴다 / 컨트롤 높이는 `--spacing-control` 계열(`--spacing-control-sm` · `--spacing-control` · `--spacing-control-lg`)을 쓴다 / 값이 아닌 임의 셀렉터 변형(`[&_svg]:size-4`)은 써도 된다
   - dont: 원시값을 직접 쓴다 / 토큰 이름을 바꾼다 / 임의 값 대괄호 표기(`[3px]` · `[#abc]`)를 쓴다

토큰 이름 셋은 `src/styles/tokens.css`의 189~191줄에서 확인한 값이다. 옮겨 적기 전에 다시 확인한다.

- [ ] **Step 6: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ path: 'get-started/install', element: <InstallPage /> }`. import를 더한다.
`nav-config.ts`의 `/get-started/install` 항목 `updatedAt`을 `'2026-08-27'`로 올린다.

- [ ] **Step 7: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/get-started/install`. 명령 넷이 나오고 복사가 되는지 본다.

- [ ] **Step 8: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 9: 커밋**

```bash
git add src/routes/get-started src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(get-started): Install 문서를 채운다

명령을 통째로 적지 않고 스크립트 이름만 두어 'npm run {script}'로
조립한다. 그 이름이 package.json에 실재하는지는 테스트가 지킨다 —
package.json을 앱 번들에 들이지 않으면서 문서가 없는 명령을 시키는 일을
막는다.

폰트 스택은 여기 적지 않고 Typography를 가리킨다. 같은 값을 두 곳에
적으면 한쪽이 낡는다."
```

---

## Task 10: Get started — Principles

이미 문서 곳곳에서 지키고 있는 것에 이름을 붙인다. **새 원칙을 만들지 않는다.** 각 원칙은 그것을 자세히 다루는 문서를 가리킨다.

**Files:**
- Create: `src/routes/get-started/principles.ts`
- Test: `src/routes/get-started/principles.test.ts`
- Create: `src/routes/get-started/PrinciplesPage.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/nav-config.ts`

**Interfaces:**
- Consumes: `docOrder` · `findDoc`(nav-config), `DocPage` · `DocSection`
- Produces:
  - `type Principle = { id: string; title: string; body: string; scope: 'product' | 'workbench'; source: string }`
  - `const principles: Principle[]`
  - `function PrinciplesPage(): ReactNode`

`source`는 근거 문서의 경로다(`/foundations/color-role` 같은).

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/routes/get-started/principles.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { findDoc } from '@/components/layout/nav-config'
import { principles } from '@/routes/get-started/principles'

describe('principles', () => {
  it('id가 중복되지 않는다', () => {
    const ids = principles.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  /*
   * 근거 문서가 없으면 원칙이 죽은 곳을 가리킨다. 원칙은 새로 만드는
   * 것이 아니라 이미 지키고 있는 것에 이름을 붙이는 것이므로, 가리킬
   * 문서가 없다는 것은 그 원칙이 근거 없이 지어졌다는 뜻이다.
   */
  it('모든 원칙의 근거 문서가 LNB에 실재한다', () => {
    for (const principle of principles) {
      expect(findDoc(principle.source), principle.id).toBeDefined()
    }
  })

  it('작업대 자체를 다루는 원칙이 마지막에 하나 있다', () => {
    const scopes = principles.map((p) => p.scope)
    expect(scopes.filter((s) => s === 'workbench')).toHaveLength(1)
    expect(scopes[scopes.length - 1]).toBe('workbench')
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/routes/get-started/principles.test.ts`
Expected: FAIL — `Failed to resolve import "@/routes/get-started/principles"`

- [ ] **Step 3: `principles.ts`를 쓴다**

```ts
/**
 * 원칙 여섯.
 *
 * 새로 만든 것이 하나도 없다. 전부 이미 다른 문서에서 지키고 있는
 * 것이고, 여기서는 이름을 붙이고 그 문서를 가리킬 뿐이다. source가
 * 실재하는 문서를 가리키는지는 테스트가 지킨다.
 *
 * scope가 갈린다. 앞의 다섯은 제품 화면에 대한 것이고 마지막 하나는
 * 이 작업대 자체에 대한 것이다.
 */
export type Principle = {
  id: string
  title: string
  body: string
  /** product = 제품 화면에 거는 규칙, workbench = 이 작업대에 거는 규칙 */
  scope: 'product' | 'workbench'
  /** 이 원칙을 자세히 다루는 문서의 경로 */
  source: string
}

export const principles: Principle[] = [
  {
    id: 'color-by-role',
    title: '역할로 색을 고른다',
    body: '파란색이라서 고르는 것이 아니라 주요 동작이라서 primary를 고릅니다. 역할로 고른 색은 다크 모드에서 저절로 따라오고, 값으로 고른 색은 따라오지 않습니다.',
    scope: 'product',
    source: '/foundations/color-role',
  },
  {
    id: 'keep-density',
    title: '밀도를 지킨다',
    body: '어드민은 한 화면에서 읽는 양이 많습니다. 간격은 4px 배수로만 쓰고, 컨트롤 높이는 정해진 세 단을 벗어나지 않습니다. 임의 값이 하나 섞이면 정렬이 눈에 띄게 어긋납니다.',
    scope: 'product',
    source: '/foundations/spacing',
  },
  {
    id: 'one-primary-action',
    title: '한 화면에 주요 동작은 하나다',
    body: '가장 자주 하는 일 하나만 채운 버튼으로 둡니다. 채운 버튼이 둘이면 어느 쪽이 주인지 알 수 없고, 그러면 둘 다 주가 아닙니다.',
    scope: 'product',
    source: '/components/button',
  },
  {
    id: 'not-color-alone',
    title: '색만으로 뜻을 전하지 않는다',
    body: '상태는 색과 함께 글이나 아이콘으로도 말합니다. 색을 구별하지 못하는 사람에게도, 색이 죽은 화면에서도 뜻이 남아야 합니다.',
    scope: 'product',
    source: '/foundations/state',
  },
  {
    id: 'confirm-the-irreversible',
    title: '되돌리기 어려운 동작에는 확인 단계를 둔다',
    body: '되돌릴 수 있으면 되돌리기를 주고, 되돌릴 수 없으면 묻습니다. 둘 다 두면 확인이 소음이 되어 아무도 읽지 않습니다.',
    scope: 'product',
    source: '/components/dialog',
  },
  {
    id: 'docs-tell-the-truth',
    title: '상태는 코드와 문서가 함께 말한다',
    body: '이 시스템은 문서가 곧 제품입니다. 그래서 문서가 코드에 대해 사실이 아닌 것을 말하면 그것이 곧 결함입니다. 화면에 나오는 목록과 숫자를 손으로 적지 않는 것도, 확인하지 않은 것을 적지 않는 것도 같은 이유입니다.',
    scope: 'workbench',
    source: '/foundations/writing',
  },
]
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/routes/get-started/principles.test.ts`
Expected: PASS

- [ ] **Step 5: Principles 문서를 만든다**

`src/routes/get-started/PrinciplesPage.tsx`. 세 절이다.

1. **Overview** — 새 원칙을 만들지 않았다는 것. 이미 지키고 있는 것에 이름을 붙였을 뿐이라는 것.
2. **Principles** — `principles.filter((p) => p.scope === 'product')`를 늘어놓는다. 각 항목은 제목·본문·근거 문서 링크다. 링크 이름은 `findDoc(principle.source)?.label`에서 가져온다 — 문서 이름을 손으로 적지 않는다.
3. **About this workbench** — `scope === 'workbench'`인 하나를 따로 둔다. 앞의 다섯과 성격이 다르다는 것을 한 문단으로 말한다: 앞의 다섯은 **제품 화면**에 거는 규칙이고 이것은 **이 작업대 자체**에 거는 규칙이다. 이 시스템은 문서가 곧 제품이므로, 문서가 코드에 대해 사실이 아닌 것을 말하면 그것이 곧 결함이다.

렌더링 뼈대:

```tsx
function PrincipleCard({ principle }: { principle: Principle }) {
  const doc = findDoc(principle.source)
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-4">
      <strong className="text-base font-semibold">{principle.title}</strong>
      <p className="text-muted-foreground text-sm">{principle.body}</p>
      {doc && (
        <Link to={doc.to} className="text-primary text-xs underline-offset-4 hover:underline">
          {doc.label}에서 자세히
        </Link>
      )}
    </li>
  )
}
```

- [ ] **Step 6: 라우트와 LNB를 잇는다**

`routes.tsx`: `{ path: 'get-started/principles', element: <PrinciplesPage /> }`. import를 더한다.
`nav-config.ts`의 `/get-started/principles` 항목 `updatedAt`을 `'2026-08-27'`로 올린다.

이 줄로 `Placeholder`를 쓰는 문서 라우트가 모두 사라진다. `routes.tsx`에서 `Placeholder`는 404(`path: '*'`) 하나만 쓴다 — import는 남는다.

- [ ] **Step 7: 화면으로 확인한다**

`preview_start`로 `adminds-v0.11.0`을 띄우고 `http://localhost:5201/get-started/principles`. 링크 여섯이 모두 실제 문서로 가는지 하나씩 눌러 본다. LNB를 훑어 "준비 중" 화면이 하나도 남지 않았는지 확인한다.

- [ ] **Step 8: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과.

- [ ] **Step 9: 커밋**

```bash
git add src/routes/get-started src/routes/routes.tsx src/components/layout/nav-config.ts
git commit -m "feat(get-started): Principles 문서를 채운다

새 원칙을 만들지 않았다. 여섯 모두 이미 다른 문서에서 지키고 있는
것이고, 여기서는 이름을 붙이고 그 문서를 가리킨다. 근거 문서가 LNB에
실재하는지 테스트가 지킨다 — 가리킬 문서가 없는 원칙은 근거 없이
지어진 것이다.

마지막 하나만 성격이 다르다. 앞의 다섯은 제품 화면에 거는 규칙이고
이것은 이 작업대 자체에 거는 규칙이라, 절을 나눠 그 차이를 말한다.

이로써 문서 라우트에서 자리표시자가 사라진다. Placeholder는 404와
컴포넌트 문서의 메타 없음 대비만 쓴다."
```

---

## Task 11: 릴리스 기록과 낡은 숫자 정리

`Updates` 화면이 `releases.ts`에서 파생하고, GNB의 버전 번호도 `currentRelease.version`에서 나온다. 기록을 남기지 않으면 v0.11.0을 배포하고도 화면은 v0.10.0이라고 말한다.

**Files:**
- Modify: `src/data/releases.ts`
- Modify: `src/data/releases.test.ts`
- Modify: `package.json` · `package-lock.json`
- Modify: `README.md`
- Modify: `.claude/launch.json`

**Interfaces:**
- Consumes: `Release` 타입(`@/data/releases`), `patternStats`(Task 1), `componentStats`(registry)
- Produces: `releases[0].version === 'v0.11.0'`

- [ ] **Step 1: 버전을 올린다**

`package.json`의 `"version": "0.10.0"`을 `"0.11.0"`으로 바꾼다. `package-lock.json`의 최상위 `"version"`과 `"packages": { "": { "version": ... } }` 두 곳도 같은 값으로 맞춘다(v0.10.0의 커밋 `38ef3fa`가 같은 일을 했다).

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`src/data/releases.test.ts`의 `describe('releases', …)` 안에 더한다:

```ts
  /*
   * GNB의 버전 번호는 currentRelease.version에서 나온다. 기록을 남기지
   * 않고 배포하면 화면이 지난 버전이라고 말한다.
   */
  it('최신 기록의 버전이 package.json의 버전과 같다', async () => {
    const pkg = (await import('../../package.json')).default
    expect(currentRelease.version).toBe(`v${pkg.version}`)
  })
```

- [ ] **Step 3: 테스트가 실패하는지 확인한다**

Run: `npm test -- src/data/releases.test.ts`
Expected: FAIL — `expected 'v0.10.0' to be 'v0.11.0'`

- [ ] **Step 4: 릴리스 기록을 쓴다**

`src/data/releases.ts`의 `releases` 배열 맨 앞에 넣는다. **`changes`의 각 줄은 실제로 한 일만 적는다.** 지어낸 항목이 하나라도 있으면 이 회차의 마지막 결함이 된다.

```ts
  {
    version: 'v0.11.0',
    publishedAt: '2026-08-27',
    title: '첫 화면과 Patterns를 채웠어요',
    purpose:
      'GNB에서 마지막까지 비어 있던 두 섹션을 채웠어요. Get started는 여기가 무엇이고 어디서부터 읽는지, 어떻게 띄우고 어떤 원칙을 따르는지 세 문서로 나눴어요. Patterns는 목록·상세·입력·빈 자리·확인 다섯을 다루는데, 전부 이미 있는 컴포넌트로 화면을 실제로 조립했어요 — 그려 넣은 목업이 하나도 없어요.',
    changes: [
      { target: 'Get started', type: 'New', note: '세 회차 동안 준비 중이던 첫 화면을 채웠어요. 섹션 목록도 문서 개수도 컴포넌트·패턴 수도 전부 데이터에서 세어 보여줘요.' },
      { target: 'Install', type: 'New', note: '작업대를 띄우는 법과 토큰을 가져가는 법을 나눴어요. 명령은 스크립트 이름만 두고 조립하고, 그 이름이 package.json에 실재하는지 테스트가 지켜요.' },
      { target: 'Principles', type: 'New', note: '원칙 여섯에 이름을 붙였어요. 새로 만든 건 하나도 없고 전부 이미 다른 문서에서 지키던 것이라, 각 원칙이 그 문서를 가리켜요.' },
      { target: 'Patterns', type: 'New', note: '패턴 문서의 뼈대 PatternPage와 데이터 patterns.ts를 새로 만들었어요. 패턴에는 축도 상태도 없어서 ComponentPage를 재사용하지 않았어요 — 빈 절이 생기는 걸 막으려고요.' },
      { target: 'List', type: 'New', note: '목록 화면이에요. 필터와 결과 수, 선택과 대량 작업 줄, 페이지 이동까지 실제 Table·Badge·Avatar·Checkbox·Pagination으로 조립했어요.' },
      { target: 'Detail', type: 'New', note: '상세 화면이에요. 탭을 바꿔도 제목과 동작이 남고, 위험한 동작은 Dropdown Menu 안쪽에 둬요.' },
      { target: 'Form', type: 'New', note: '입력 화면이에요. 라벨·도움말·오류를 잇는 일은 v0.10.0에서 들어온 Field가 맡아서, htmlFor를 손으로 쓴 곳이 없어요.' },
      { target: 'Empty and error', type: 'New', note: '비어 있을 때와 실패했을 때예요. EmptyState의 네 variant가 그대로 네 경우여서, 문구가 색만이 아니라 말로도 갈리게 했어요.' },
      { target: 'Destructive confirm', type: 'New', note: '되돌릴 수 없는 동작이에요. Dialog로 묻고 Toast로 알리는 흐름을 그 자리에서 눌러 볼 수 있어요.' },
      { target: 'DocStatus', type: 'New', note: 'ComponentPage 안에 있던 상태 배지 줄을 뽑아 PatternPage와 나눠 써요.' },
      { target: 'Foundations / Components', type: 'Fixed', note: '두 Overview가 "Patterns는 아직 준비 중입니다"라고 말하고 있었어요. 이번 회차로 거짓이 되므로 함께 고쳤어요.' },
      { target: 'README', type: 'Fixed', note: '레지스트리 묶음을 "26개 전부"라고 적어 둔 게 낡아 있었어요. 실제 개수로 고쳤어요.' },
    ],
    requests: [],
    reviewItems: [
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '패턴 문서의 Example이 커서 한 파일이 길어진다 — 조각을 나눌 자리가 어디인가', category: 'Patterns', completed: false },
    ],
    impact: [],
  },
```

`requests`와 `impact`는 이 계획이 알 수 없는 값이다. **비워 두거나, 사용자에게 실제로 들어온 요청이 있으면 그것만 적는다. 지어내지 않는다.** `reviewItems`의 앞 두 줄은 v0.10.0에서 이월된 것으로 실제로 아직 열려 있다(`releases.ts`에서 확인).

- [ ] **Step 5: 테스트가 통과하는지 확인한다**

Run: `npm test -- src/data/releases.test.ts`
Expected: PASS

- [ ] **Step 6: README의 낡은 숫자를 고친다**

`README.md`의 아래 줄에서 개수를 실제 값으로 고친다. `src/data/registry.ts`의 `components` 길이와 `registry.json`의 `adminds` 묶음이 가리키는 개수를 직접 세어 확인한 뒤에 적는다.

```
npx shadcn@latest add https://adminds.vercel.app/r/adminds.json # 토큰과 26개 전부
```

"새 컴포넌트를 추가하는 법" 절과 "폴더 구조" 절도 훑어 사실과 어긋나는 곳이 없는지 본다 — `src/routes/`의 설명에 패턴 페이지가 빠져 있다면 함께 고친다.

- [ ] **Step 7: 사라질 작업장을 가리키는 미리보기 항목을 뺀다**

`.claude/launch.json`에서 Task 1에서 넣은 `adminds-v0.11.0` 항목을 지운다. 이 항목은 절대 경로로 이 작업장을 `--prefix` 하고 있어서, 병합하면 그 작업장이 없어진다. v0.10.0에서 같은 항목을 남겨 둔 탓에 한 에이전트가 낡은 체크아웃을 보고 측정했다(커밋 `452f5a8`). `adminds`(5199) 하나만 남긴다.

**이 단계 뒤로는 `preview_start`로 이 작업장을 띄울 수 없다.** 화면 확인이 더 필요하면 Step 7을 마지막으로 미룬다.

- [ ] **Step 8: 전체 검사**

Run: `npm run build && npm test`
Expected: 둘 다 통과. 출력을 눈으로 읽고, 실패가 없다는 것을 확인한 뒤에만 커밋한다.

- [ ] **Step 9: 커밋**

```bash
git add src/data/releases.ts src/data/releases.test.ts package.json package-lock.json README.md .claude/launch.json
git commit -m "chore: v0.11.0 기록을 남기고 낡은 숫자를 고친다

Updates 화면과 GNB의 버전 번호가 모두 releases.ts에서 파생한다. 기록을
남기지 않으면 v0.11.0을 배포하고도 화면은 v0.10.0이라고 말한다. 두
버전이 어긋나면 실패하는 테스트를 붙였다.

README가 레지스트리 묶음을 26개라고 적어 두고 있었다. 실제 개수로
고쳤다.

이 작업장을 절대 경로로 가리키는 미리보기 항목도 걷어낸다. 병합하면
작업장이 사라져 낡은 체크아웃을 띄우거나 아예 뜨지 않는다."
```

---

## 자기 점검

**스펙 대응.**

| 스펙 | Task |
|---|---|
| 1.1 Overview (`/`) | 8 |
| 1.2 Install | 9 |
| 1.3 Principles | 10 |
| 2.1 `PatternPage`와 `patterns.ts` | 1, 2 |
| 2.2 List | 1, 2 |
| 2.2 Detail | 3 |
| 2.2 Form | 4 |
| 2.2 Empty and error | 5 |
| 2.2 Destructive confirm | 6 |
| 2.3 Patterns Overview | 7 |
| 2.4 예시는 실물 | 2~6의 조립 규칙 |
| 라우팅 | 2~10에 나눠 실림 |

스펙에 없지만 이 회차가 만들어 내는 것 둘을 더 실었다 — Task 7의 "준비 중" 문장 두 곳(이 회차가 거짓으로 만든다)과 Task 11의 릴리스 기록(`Updates`가 v0.10.0에서 지어졌으므로 이제 매 회차 남겨야 한다).

**타입 일관성.** `PatternMeta` · `PatternStructureStep` · `PatternStatus` · `getPattern` · `patternStats`는 Task 1에서 정의하고 Task 2~8이 그 이름 그대로 쓴다. `DocStatus`는 Task 2에서 정의하고 `ComponentPage` · `PatternPage`가 함께 쓴다. `PatternPageProps`의 네 필드(`meta` · `example` · `renderGuidelineExample` · `renderCase`)는 Task 3~6에서 같은 이름으로 넘긴다. `guidelines`와 `cases`의 id는 각 Task의 데이터 단계에서 정하고 같은 Task의 `render*` 함수가 그것을 모두 덮는다.

**사람이 정해야 할 것.** 아래 둘은 이 계획이 정하지 않는다.
- Task 11의 `requests`(사용자가 이번 회차에 넣은 요청)와 `impact`. 실제로 들어온 것이 없으면 빈 배열로 둔다.
- 다섯 패턴의 `status`를 전부 `'draft'`로 두었다. 눈으로 확인을 마친 뒤 `verified`와 함께 올릴지는 사람이 정한다.
