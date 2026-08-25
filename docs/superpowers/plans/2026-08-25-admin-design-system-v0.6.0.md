# 어드민 디자인 시스템 v0.6.0 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v0.5.0 피드백 여덟 가지를 반영한다 — 언어 규칙을 영문 중심으로 뒤집고, Anatomy 지시선 겹침을 없애고, 제목 앵커 복사·sticky 목차·간격 위계·Overview 개요·Footer를 더한다.

**Architecture:** 기존 구조를 유지한다. `main`이 스크롤 컨테이너로 남고, 목차만 그 안으로 들어가 sticky가 된다. 제목 `id`는 지금 `TableOfContents`가 몰래 붙이고 있는데, 앵커 복사가 같은 `id`에 기대므로 순수 함수로 뽑아 양쪽이 함께 쓴다.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS v4, react-router 8, Vitest, lucide-react

## Global Constraints

- 작업 브랜치는 `v0.6.0`. `main`이나 `v0.5.0`에 직접 커밋하지 않는다.
- 색·간격·radius·shadow 값을 하드코딩하지 않는다. **임의 값 대괄호 표기(`[3px]`, `[#abc]`, `[calc(...)]`) 금지** — `[&_svg]:size-4` 같은 임의 **셀렉터** 변형은 허용. 각 Task 완료 전 확인하고 출력이 없어야 한다:

  ```bash
  grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
  ```

- **언어 규칙(v0.5.0에서 뒤집힌 새 규칙)** — 구조를 가리키는 이름은 **영문**, 설명은 **한국어**.
  - 영문: 섹션 제목(= 목차 항목), 페이지 이름, UI 라벨(버튼·배지·범례), 속성 이름, 코드 식별자
  - 한국어: 설명문, 표 안의 서술, 지침의 규칙 문장, 주석
  - 이미 영문인 용어는 그대로 둔다. 새로 한국어로 바꾸지 않는다.
- **화면에 나오는 목록·순서·값·날짜를 손으로 적지 않는다.** 네비게이션·목차·footer 메뉴는 파생이어야 한다.
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않는다.
- **문구는 Foundations의 Writing 규칙을 따른다** — `~합니다`체(요청만 `~하세요`), 느낌표·물음표 안 씀, 항목 이름과 값에 작은따옴표(TS 델리미터는 예외), 완전한 문장에만 마침표(라벨·표 셀·제목에는 안 찍음), 번역투 회피.
- 테스트 대상은 순수 로직(`data/`, `lib/`, `nav-config`)에 한정한다. React 컴포넌트의 렌더링 결과는 단위 테스트하지 않는다.
- `tsconfig`에 `baseUrl`을 추가하지 않는다 (TypeScript 6의 `TS5101` 하드에러).
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다.
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사. 끝에 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## File Structure

**새로 만드는 파일**

- `src/lib/heading-id.ts` — 제목 `id`를 만드는 순수 함수와 DOM에 붙이는 함수. `TableOfContents`와 `HeadingAnchor`가 같은 규칙을 쓰게 하는 단일 출처
- `src/lib/heading-id.test.ts` — 위 순수 함수의 단위 테스트
- `src/components/docs/HeadingAnchor.tsx` — 제목 옆 link 아이콘. 누르면 그 절의 URL을 복사하고 check로 바뀜
- `src/components/layout/SiteFooter.tsx` — 저작권·GNB 메뉴·LinkedIn·이메일

**고치는 파일**

- `src/components/docs/ComponentPage.tsx` — 섹션 제목 6개 영문화, 블록 간격
- `src/routes/foundations/*.tsx` (11개) — 섹션 제목 영문화. `WritingPage`는 `Language` 섹션 본문도 다시 씀
- `src/components/layout/nav-config.ts` — `설치`·`원칙` 라벨 영문화
- `src/components/layout/DocFooterNav.tsx` — `최종 수정` → `Last updated`
- `src/components/docs/Playground.tsx` — `조합` → `Options`, `초기값으로` → `Reset`
- `src/components/layout/TableOfContents.tsx` — 제목 `Contents`, `heading-id` 사용, `main` 안으로 이동
- `src/components/docs/Anatomy.tsx` — 지시선 레인 분리
- `src/components/docs/DocPage.tsx` — 간격, `DocSection`에 앵커 삽입
- `src/components/docs/PropertyBlock.tsx`, `src/components/docs/GuidelineBlock.tsx` — `h3`에 앵커 삽입
- `src/components/layout/AppShell.tsx` — 목차 위치, 스크롤바 감춤, footer
- `src/components/layout/Lnb.tsx` — 하위 항목 모서리 제거
- `src/routes/foundations/FoundationsOverview.tsx`, `src/routes/components/*Overview*.tsx` — 개요 섹션
- `src/styles/tokens.css` — 스크롤바 감추는 유틸리티

---

## Task 1: 언어 규칙 뒤집기

**Files:**
- Modify: `src/components/docs/ComponentPage.tsx`
- Modify: `src/routes/foundations/` 아래 11개 페이지
- Modify: `src/components/layout/nav-config.ts`
- Modify: `src/components/layout/DocFooterNav.tsx`
- Modify: `src/components/docs/Playground.tsx`
- Modify: `src/components/layout/TableOfContents.tsx`

**Interfaces:**
- Consumes: 없음 (첫 Task)
- Produces: 섹션 제목이 전부 영문이 된다. 이후 Task는 이 이름을 전제로 한다

- [ ] **Step 1: 컴포넌트 문서의 섹션 제목 6개를 바꾼다**

`ComponentPage.tsx`에서 `DocSection title` 값만 바꾼다. 다른 것은 건드리지 않는다.

| 지금 | 바꿀 이름 |
|---|---|
| 구조 | Anatomy |
| 조합해보기 | Playground |
| 속성 | Properties |
| 지침 | Guidelines |
| 사용 예 | Usage |
| 예외 상황 | Cases |

- [ ] **Step 2: Foundations 11개 페이지의 섹션 제목을 바꾼다**

`DocSection title="..."`의 값만 바꾼다. 본문·설명·표 내용은 한국어 그대로 둔다.

공통:

| 지금 | 바꿀 이름 |
|---|---|
| 개요 | Overview |
| 사용 규칙 | Guidelines |
| 전체 토큰 | All tokens |

페이지별:

| 파일 | 지금 | 바꿀 이름 |
|---|---|---|
| `DesignTokenPage` | 세 개의 층 | Layers |
| `DesignTokenPage` | 이름 규칙 | Naming |
| `ColorRolePage` | 위계 | Hierarchy |
| `ColorRolePage` | 짝 규칙 | Pairing |
| `ColorRolePage` | 상태 색의 뜻 | Status colors |
| `PalettePage` | 스케일 | Scale |
| `PalettePage` | 시맨틱 연결 | Semantic mapping |
| `TypographyPage` | 폰트 | Font |
| `TypographyPage` | 크기 스케일 | Scale |
| `TypographyPage` | 굵기 | Weight |
| `TypographyPage` | 줄바꿈 | Line breaking |
| `TypographyPage` | 사용 가이드라인 | Guidelines |
| `SpacingPage` | 기본 스케일 | Scale |
| `SpacingPage` | 밀도 축 | Density |
| `SpacingPage` | 모서리 | Radius |
| `IconographyPage` | 크기 | Size |
| `IconographyPage` | 스트로크 | Stroke |
| `IconographyPage` | 의미의 일관성 | Consistency |
| `IconographyPage` | 접근성 | Accessibility |
| `StatePage` | 상태 목록 | States |
| `StatePage` | 실물 비교 | Comparison |
| `StatePage` | 오류 전시 | Error |
| `StatePage` | 규칙 | Rules |
| `VoiceAndTonePage` | 원칙 | Principles |
| `VoiceAndTonePage` | 상황별 톤 | Tone by situation |
| `VoiceAndTonePage` | 좋은 예와 나쁜 예 | Do and Don't |
| `WritingPage` | 버튼 라벨 | Button labels |
| `WritingPage` | 폼 라벨과 도움말 | Form labels |
| `WritingPage` | 오류 메시지 | Error messages |
| `WritingPage` | 빈 상태 | Empty states |
| `WritingPage` | 한국어와 영어 | Language |
| `WritingPage` | 표기 규칙 | Notation |

`StatePage`에는 `규칙`과 `사용 규칙`이 함께 있다. 앞은 상태별 원칙 목록이므로 `Rules`, 뒤는 do/don't이므로 `Guidelines`다. 둘을 헷갈리지 않는다.

- [ ] **Step 3: LNB 라벨 두 개를 바꾼다**

`nav-config.ts`에서 `설치` → `Install`, `원칙` → `Principles`. `updatedAt`은 건드리지 않는다. 나머지 라벨은 이미 영문이므로 그대로 둔다.

- [ ] **Step 4: UI 라벨을 바꾼다**

`DocFooterNav.tsx`:

```tsx
        <time className="text-muted-foreground text-2xs" dateTime={doc.updatedAt}>
          Last updated {doc.updatedAt}
        </time>
```

`이전 문서`와 `다음 문서`는 설명 문구이므로 한국어로 둔다.

`Playground.tsx`에서 `조합` → `Options`, `초기값으로` → `Reset`:

```tsx
          <p className="text-muted-foreground text-2xs font-bold tracking-widest">Options</p>
```

```tsx
            <RotateCcw size={12} aria-hidden /> Reset
```

`TableOfContents.tsx`의 제목:

```tsx
      <p className="text-muted-foreground mb-3 text-sm font-semibold">Contents</p>
```

- [ ] **Step 5: `WritingPage`의 `Language` 섹션 본문을 새 규칙으로 다시 쓴다**

이 섹션은 옛 규칙("문서의 구조와 설명은 한국어로 씁니다")을 명문화한 자리다. 제목만 바꾸고 본문을 두면 문서가 스스로와 어긋난다.

본문을 이렇게 바꾼다.

```tsx
      <DocSection title="Language">
        <p className="text-muted-foreground text-xs">
          구조를 가리키는 이름은 영문으로, 설명은 한국어로 씁니다.
        </p>
        <ul className="text-muted-foreground flex list-disc flex-col gap-1.5 pl-5 text-xs">
          <li>
            영문으로 두는 것 — 섹션 제목, 페이지 이름, 버튼과 배지 같은 UI 라벨, 속성 이름,
            코드 식별자
          </li>
          <li>한국어로 두는 것 — 설명문, 표 안의 서술, 지침의 규칙 문장</li>
          <li>이미 영문으로 굳은 용어는 그대로 둡니다. 그 용어를 살린 채 나머지를 한국어로 풉니다</li>
        </ul>
      </DocSection>
```

- [ ] **Step 6: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -rn 'DocSection title="[가-힣]' src/
```

빌드 성공, 58/58 통과, 두 grep 모두 출력이 없어야 한다. 실제 출력을 보고서에 붙인다.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 구조를 가리키는 이름을 영문으로 통일

v0.5.0에서 한국어로 통일했던 방향을 뒤집는다. 섹션 제목과 UI 라벨은
영문으로 두고 설명만 한국어로 남긴다. Writing 문서의 Language 절도
새 규칙으로 다시 썼다 — 옛 규칙을 명문화한 자리였다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Anatomy 지시선을 겹치지 않게 한다

**Files:**
- Modify: `src/components/docs/Anatomy.tsx`

**Interfaces:**
- Consumes: 없음
- Produces: 없음 (내부 변경)

**문제:** 지금 꺾임점은 `bendX = (anchorX + edgeX) / 2`다. 같은 쪽 부위들의 `edgeX`가 비슷하면 `bendX`도 비슷해져 세로 구간이 겹친다. Button에서는 Container와 Prefix Icon의 꺾임점이 7px 차이라 한 선처럼 보인다.

**해결:** 같은 쪽 안에서 세로 순서대로 꺾임점을 어긋나게 둔다. 라벨은 이미 부위의 세로 중심 순으로 정렬되어 있으므로, 그 순서대로 레인을 배정하면 선끼리 교차하지도 않는다.

- [ ] **Step 1: 레인 상수를 더한다**

`MIN_WIDTH_FOR_LINES` 아래에 붙인다.

```tsx
/** 라벨에서 첫 꺾임점까지의 거리 */
const LANE_START = 24
/** 같은 쪽 지시선끼리 벌리는 간격. 세로 구간이 서로 다른 선 위에 놓이게 한다 */
const LANE_GAP = 14
```

- [ ] **Step 2: `Placed`에 레인 번호를 더한다**

```tsx
type Placed = {
  part: AnatomyPart
  index: number
  side: 'left' | 'right'
  /** 무대 기준 좌표계의 부위 사각형 */
  box: { x: number; y: number; width: number; height: number }
  /** 라벨의 세로 중심 */
  labelY: number
  /** 같은 쪽에서 위에서부터 몇 번째인가. 꺾임점을 어긋나게 하는 데 쓴다 */
  lane: number
}
```

- [ ] **Step 3: 배치할 때 레인을 매긴다**

`measure()` 안의 두 곳을 고친다. 좁은 화면 분기:

```tsx
    if (isNarrow) {
      /** 좁은 화면에서는 지시선 대신 부위 위에 번호 배지를 올린다 */
      setPlaced(found.map((item) => ({ ...item, side: 'left' as const, labelY: 0, lane: 0 })))
      return
    }
```

라벨 배치 반복문:

```tsx
      group.forEach((item, i) =>
        next.push({ ...item, labelY: start + i * LABEL_SLOT, lane: i }),
      )
```

- [ ] **Step 4: 꺾임점을 레인에서 구한다**

`polyline`을 그리는 자리에서 `bendX` 계산을 바꾼다.

```tsx
                const cy = item.box.y + item.box.height / 2
                const edgeX = item.side === 'left' ? item.box.x : item.box.x + item.box.width
                const anchorX = item.side === 'left' ? GUTTER + 140 : size.width - GUTTER - 140
                /*
                 * 꺾임점을 레인마다 어긋나게 둔다. 같은 쪽 선들이 한 세로선 위에
                 * 겹치면 어느 선이 어느 라벨의 것인지 분간되지 않는다.
                 * 위에서부터 순서대로 라벨에서 멀어지므로 선끼리 교차하지도 않는다.
                 */
                const lane = LANE_START + item.lane * LANE_GAP
                const bendX =
                  item.side === 'left'
                    ? Math.min(anchorX + lane, edgeX - 8)
                    : Math.max(anchorX - lane, edgeX + 8)
                const isActive = active === item.index
```

`Math.min`과 `Math.max`는 부위가 라벨에 바싹 붙은 경우에 꺾임점이 부위를 지나쳐 선이 되돌아가는 것을 막는다.

- [ ] **Step 5: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```

빌드 성공, 58/58 통과, grep 출력 없음.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: Anatomy 지시선이 서로 겹치지 않게 한다

같은 쪽 부위들의 가장자리 x가 비슷하면 꺾임점도 비슷해져 세로 구간이
한 선처럼 뭉쳤다. 위에서부터 순서대로 꺾임점을 어긋나게 두어 각 선이
자기 세로선을 갖게 한다. 라벨이 이미 세로 순으로 정렬되어 있어
이 순서대로 배정하면 선끼리 교차하지도 않는다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: 제목에서 URL을 복사한다

**Files:**
- Create: `src/lib/heading-id.ts`
- Create: `src/lib/heading-id.test.ts`
- Create: `src/components/docs/HeadingAnchor.tsx`
- Modify: `src/components/layout/TableOfContents.tsx`
- Modify: `src/components/docs/DocPage.tsx`
- Modify: `src/components/docs/PropertyBlock.tsx`
- Modify: `src/components/docs/GuidelineBlock.tsx`

**Interfaces:**
- Consumes: 없음
- Produces: `makeHeadingId(text, index)`, `assignHeadingIds(root)`, `<HeadingAnchor />`

지금 제목 `id`는 `TableOfContents`가 자기 `useEffect` 안에서 몰래 붙인다. 앵커 복사가 같은 `id`에 기대므로, 규칙을 순수 함수로 뽑아 단일 출처로 만든다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/lib/heading-id.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { makeHeadingId } from '@/lib/heading-id'

describe('makeHeadingId', () => {
  it('한글 제목을 그대로 담고 순번을 앞에 붙인다', () => {
    expect(makeHeadingId('사용 규칙', 3)).toBe('section-3-사용-규칙')
  })

  it('영문 제목을 소문자로 바꾼다', () => {
    expect(makeHeadingId('Status colors', 0)).toBe('section-0-status-colors')
  })

  it('한글도 영문도 아닌 글자를 하이픈으로 바꾸고 양끝에서 떼어낸다', () => {
    expect(makeHeadingId('  --color-*  ', 1)).toBe('section-1-color')
  })

  it('남는 글자가 없으면 자리를 채워 빈 id를 만들지 않는다', () => {
    expect(makeHeadingId('!!!', 2)).toBe('section-2-x')
  })

  it('같은 제목이라도 순번이 다르면 id가 다르다', () => {
    expect(makeHeadingId('Scale', 1)).not.toBe(makeHeadingId('Scale', 2))
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 본다**

```bash
npx vitest run src/lib/heading-id.test.ts
```

`Cannot find module '@/lib/heading-id'`로 실패해야 한다.

- [ ] **Step 3: `heading-id.ts`를 만든다**

`makeId`의 규칙을 `TableOfContents.tsx`에서 그대로 옮긴다. 동작을 바꾸지 않는다.

```ts
/**
 * 제목 텍스트에서 id를 만든다. 한글을 그대로 두면 URL 조각이 길어지므로 순번을 섞는다.
 * 목차와 제목 앵커가 같은 id를 가리켜야 하므로 규칙은 여기 한 곳에만 둔다.
 */
export function makeHeadingId(text: string, index: number): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  return `section-${index}-${slug || 'x'}`
}

/** 아직 id가 없는 제목에만 붙인다. 이미 있는 id는 링크가 깨지므로 덮어쓰지 않는다 */
export function assignHeadingIds(root: ParentNode): HTMLHeadingElement[] {
  const nodes = [...root.querySelectorAll('h2, h3')] as HTMLHeadingElement[]
  nodes.forEach((node, index) => {
    if (!node.id) node.id = makeHeadingId(node.textContent ?? '', index)
  })
  return nodes
}
```

- [ ] **Step 4: 테스트가 통과하는지 본다**

```bash
npx vitest run src/lib/heading-id.test.ts
```

5개 통과해야 한다.

- [ ] **Step 5: `TableOfContents`가 이 함수를 쓰게 한다**

`makeId` 함수 정의를 지우고 import로 바꾼다.

```tsx
import { assignHeadingIds, makeHeadingId } from '@/lib/heading-id'
```

파일 위쪽의 `makeId` 함수 정의를 통째로 지우고 import를 더한다. `makeHeadingId`는 `assignHeadingIds` 안에서 쓰이므로 여기서 직접 부르지 않는다.

```tsx
import { assignHeadingIds } from '@/lib/heading-id'
```

`collect()`를 이렇게 바꾼다.

```tsx
    const collect = () => {
      const nodes = assignHeadingIds(main)
      const found = nodes.map((node): Heading => ({
        id: node.id,
        text: node.textContent?.trim() ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      }))
      setHeadings(found)
      setActive(found[0]?.id ?? null)
      return nodes
    }
```

- [ ] **Step 6: `HeadingAnchor`를 만든다**

`CopyValue`의 상태 기계를 그대로 따른다 — `idle` / `copied` / `failed`, 2초 뒤 복귀.

`src/components/docs/HeadingAnchor.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Check, Link2, X } from 'lucide-react'

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * 제목 옆에 놓여 그 절의 URL을 복사한다.
 * id는 렌더 시점에 아직 없을 수 있으므로 누를 때 DOM에서 읽는다 —
 * 목차가 마운트 뒤에 붙이기 때문이다.
 */
export function HeadingAnchor() {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const heading = event.currentTarget.closest('h2, h3')
    if (!heading?.id) {
      setState('failed')
      return
    }
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${heading.id}`)
      setState('copied')
    } catch {
      /* 클립보드를 쓸 수 없는 환경이 있다. 조용히 넘기지 않고 실패를 보여준다 */
      setState('failed')
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="이 절의 주소 복사"
      className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:opacity-100 ml-2 inline-grid size-6 shrink-0 place-items-center rounded align-middle opacity-0 group-hover:opacity-100"
    >
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? '복사했습니다' : state === 'failed' ? '복사하지 못했습니다' : ''}
      </span>
      {state === 'copied' ? (
        <Check size={14} className="text-success" aria-hidden />
      ) : state === 'failed' ? (
        <X size={14} className="text-destructive" aria-hidden />
      ) : (
        <Link2 size={14} aria-hidden />
      )}
    </button>
  )
}
```

`opacity-0 group-hover:opacity-100`은 마우스를 올렸을 때만 보이게 한다. `focus-visible:opacity-100`은 키보드로 왔을 때 보이게 한다 — 없으면 보이지 않는 버튼에 포커스가 머문다.

- [ ] **Step 7: 세 제목 자리에 앵커를 넣는다**

`DocPage.tsx`의 `DocSection`:

```tsx
export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="group text-xl font-semibold tracking-tight">
        {title}
        <HeadingAnchor />
      </h2>
      {children}
    </section>
  )
}
```

`import { HeadingAnchor } from '@/components/docs/HeadingAnchor'`를 더한다.

`PropertyBlock.tsx`의 `h3` (38행):

```tsx
        <h3 className="group text-base font-semibold">
          {property.title}
          <HeadingAnchor />
        </h3>
```

`GuidelineBlock.tsx`의 `h3` (55행):

```tsx
        <h3 className="group text-base font-semibold">
          {guideline.title}
          <HeadingAnchor />
        </h3>
```

두 파일 모두 import를 더한다. `PropertyBlock`의 표 헤더(48행)에 있는 `property.title`은 제목이 아니므로 건드리지 않는다.

- [ ] **Step 8: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
grep -rn "makeId" src/
```

빌드 성공, 63/63 통과(기존 58 + 새 5), 첫 grep 출력 없음, 마지막 grep 출력 없음(옛 함수가 남지 않았는지 확인).

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 제목에서 그 절의 주소를 복사한다

제목에 마우스를 올리면 link 아이콘이 나오고, 누르면 주소가 복사되며
아이콘이 check로 바뀐다. 목차가 몰래 붙이던 id 규칙을 순수 함수로
뽑아 목차와 앵커가 같은 출처를 쓰게 했다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 목차를 컨테이너 안 sticky로 옮기고 스크롤바를 감춘다

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/layout/TableOfContents.tsx`

**Interfaces:**
- Consumes: Task 3의 `assignHeadingIds`
- Produces: 없음

- [ ] **Step 1: 스크롤바를 감추는 유틸리티를 더한다**

`src/styles/tokens.css` 맨 아래에 붙인다.

```css
/*
 * 스크롤 막대만 감춘다. 스크롤 자체는 막지 않는다.
 * 두 줄이 필요하다 — 앞은 Firefox, 뒤는 WebKit이다.
 */
@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 2: `AppShell`에서 목차를 `main` 안으로 옮긴다**

```tsx
      <div className="flex min-h-0 flex-1">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="scrollbar-none min-w-0 flex-1 overflow-y-auto px-4 py-8 md:px-10">
          <div className="mx-auto flex max-w-6xl gap-10">
            <div className="min-w-0 flex-1">
              <Outlet />
              <DocFooterNav />
            </div>
            <TableOfContents />
          </div>
        </main>
      </div>
```

본문 폭은 `max-w-4xl`에서 `max-w-6xl`로 넓힌다 — 목차가 같은 상자 안으로 들어와 자리를 나눠 쓰기 때문이다.

- [ ] **Step 3: 목차를 sticky로 바꾼다**

`TableOfContents.tsx`의 `nav` className을 바꾼다.

```tsx
      className="sticky top-8 hidden h-fit w-56 shrink-0 self-start xl:block"
```

`overflow-y-auto`와 `py-8 pr-6`을 뺀다. `main`이 이미 위아래 여백을 갖고 있고, sticky 요소에 자기 스크롤을 주면 문서가 짧을 때 빈 스크롤 영역이 생긴다.

`top-0`이 아니라 `top-8`이다. sticky는 스크롤 상자의 위 끝을 기준으로 붙으므로 `top-0`이면 목차가 `main`의 위 여백을 무시하고 GNB에 닿는다.

- [ ] **Step 4: 목차 자신의 제목이 수집되지 않는지 확인한다**

목차가 `main` 안으로 들어갔으므로 `assignHeadingIds(main)`이 목차 안의 요소까지 훑는다. 목차의 제목은 `p`이므로 `h2, h3` 선택자에 걸리지 않는다. 브라우저에서 항목 수가 늘지 않았는지 확인한다.

늘었다면 선택자를 본문으로 좁힌다. 이 경우에만 고친다.

- [ ] **Step 5: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```

빌드 성공, 63/63 통과, grep 출력 없음.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 목차를 컨테이너 안 sticky로 옮기고 스크롤바를 감춘다

목차가 스크롤 컨테이너의 형제로 떨어져 있어 컨테이너 위에 얹힌 느낌이
나지 않았다. main 안으로 넣어 sticky로 붙이고, main의 스크롤 막대는
감춘다. 스크롤 자체는 그대로다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: 간격 위계를 넓히고 LNB 하위 모서리를 없앤다

**Files:**
- Modify: `src/components/docs/DocPage.tsx`
- Modify: `src/components/docs/ComponentPage.tsx`
- Modify: `src/components/layout/Lnb.tsx`

**Interfaces:**
- Consumes: Task 3의 `HeadingAnchor` (같은 `DocSection`을 고친다)
- Produces: 없음

- [ ] **Step 1: `gap-30`이 실제로 120px인지 먼저 확인한다**

`DocPage`의 `article`에 `gap-30`을 넣고 빌드한 뒤, Tailwind가 그 클래스를 실제로 만들어냈는지 결과물에서 확인한다. 브라우저를 쓰지 않는다.

```bash
npm run build && grep -o '\.gap-30{[^}]*}' dist/assets/*.css
```

`.gap-30{gap:calc(var(--spacing) * 30)}`처럼 나와야 한다. 이 저장소는 `--spacing`을 재정의하지 않으므로 기본값 `0.25rem`이 곱해져 `7.5rem = 120px`이 된다.

출력이 비어 있으면 Tailwind가 이 배수를 만들지 못한 것이다. 그때만 `tokens.css`의 `@theme` 안에 `--spacing-section: 7.5rem`을 더하고 `gap-section`을 쓴다. 어느 쪽이든 대괄호 표기는 쓰지 않는다.

실제 출력을 보고서에 붙인다.

- [ ] **Step 2: 간격을 바꾼다**

`DocPage.tsx`:

```tsx
    <article className="flex flex-col gap-30">
      <header className="flex flex-col gap-4">
```

`DocSection`:

```tsx
    <section className="flex flex-col gap-6">
```

`ComponentPage.tsx`의 `Properties`와 `Guidelines` 안 블록 묶음 두 곳:

```tsx
        <div className="flex flex-col gap-12">
```

- [ ] **Step 3: LNB 하위 항목의 모서리를 없앤다**

`Lnb.tsx`의 `LnbItem`에서 `rounded-md`를 깊이에 따라 나눈다.

```tsx
            'flex h-control items-center text-sm',
            depth === 0 ? 'rounded-md px-2' : 'ml-2 border-l pl-3',
```

`Lnb`의 다른 `rounded-md`(86행 GNB 링크, 103행 상태 상자)는 하위 항목이 아니므로 그대로 둔다.

- [ ] **Step 4: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```

빌드 성공, 63/63 통과, grep 출력 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 섹션 간격을 넓히고 LNB 하위 항목의 모서리를 없앤다

섹션 사이를 120px로 벌리고 그 아래 위계도 비율에 맞춰 조정했다.
LNB 하위 항목은 모서리를 없애 들여쓰기 선과 만나 관계가 드러난다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Overview 페이지에 개요를 싣는다

**Files:**
- Modify: `src/routes/foundations/FoundationsOverview.tsx`
- Modify: Components의 Overview 페이지 (경로는 `src/routes/routes.tsx`의 `components` 항목에서 찾는다)

**Interfaces:**
- Consumes: Task 5의 `DocSection` 간격
- Produces: 없음

지금은 하위 문서 카드 목록뿐이라 그 섹션이 무엇인지 설명하지 않는다.

- [ ] **Step 1: `FoundationsOverview`에 두 섹션을 둔다**

카드 목록을 `Pages` 섹션으로 감싸고 그 위에 `Overview`를 둔다. 카드의 높이 균일(`h-full`)은 그대로 유지한다.

```tsx
    <DocPage
      title="Foundations"
      description="컴포넌트보다 먼저 합의해야 하는 것들입니다. 색·타이포·간격 같은 토큰과, 말투·문구처럼 코드에 담기지 않는 원칙을 함께 다룹니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          Foundations는 컴포넌트가 기대는 바닥입니다. 여기서 정한 색과 간격과 말투가
          모든 컴포넌트에 그대로 실리므로, 컴포넌트를 고치기 전에 이 층을 먼저 봅니다.
        </p>
        <p className="text-muted-foreground text-sm">
          읽는 순서는 위에서 아래입니다. Design Token이 이름 규칙을 정하고, Color와
          Typography와 Spacing이 그 규칙으로 값을 싣고, State가 상호작용의 표현을 맞추고,
          Voice and Tone과 Writing이 화면에 나가는 말을 다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          여기서 정하지 않는 것도 있습니다. 개별 컴포넌트의 구조와 속성은 Components에서,
          여러 컴포넌트를 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
        </p>
      </DocSection>

      <DocSection title="Pages">
        <ul className="grid gap-3 sm:grid-cols-2">
          {pages.map((page) => (
            <li key={page.to} className="h-full">
              <Link
                to={page.to}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-sm">{page.label}</strong>
                <p className="text-muted-foreground mt-1 text-xs">{NOTES[page.to]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
```

`import { DocPage, DocSection } from '@/components/docs/DocPage'`로 바꾼다.

- [ ] **Step 2: `ComponentsIndex`에 `Overview` 섹션을 앞에 붙인다**

파일은 `src/routes/components/ComponentsIndex.tsx`다. 이 페이지는 이미 카테고리별 `DocSection`으로 목록을 나누고 있으므로 `Pages`로 감싸지 않는다. 카테고리 목록 앞에 `Overview`만 둔다.

`categories.map(...)` 바로 위에 넣는다.

```tsx
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          Components는 화면을 이루는 낱개의 부품입니다. 각 문서는 그 부품의 구조와 속성,
          언제 쓰고 언제 쓰지 않는지를 다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          문서는 같은 순서로 읽습니다. Anatomy가 부품의 뼈대를 보이고, Playground에서
          조합을 만져보고, Properties가 축마다 무엇을 정하는지 늘어놓고, Guidelines가
          판단이 갈리는 자리를 짚고, Usage와 Cases가 실제 화면과 예외를 보입니다.
        </p>
        <p className="text-muted-foreground text-sm">
          여기서 정하지 않는 것도 있습니다. 색과 간격 같은 값은 Foundations에서,
          여러 부품을 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
        </p>
      </DocSection>
```

- [ ] **Step 3: `ComponentsIndex`의 카드 높이를 같은 줄에서 맞춘다**

v0.4.0에서 정한 규칙인데 이 페이지에만 빠져 있다. 지금은 등록된 컴포넌트가 하나라 드러나지 않지만, 늘어나면 어긋난다. `FoundationsOverview`와 같은 방식으로 맞춘다.

```tsx
                <li key={meta.id} className="h-full">
                  <Link
                    to={`/components/${meta.id}`}
                    className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
                  >
```

- [ ] **Step 4: 이전/다음 버튼이 여전히 없는지 코드로 확인한다**

`DocFooterNav`는 `pathname === section.to`일 때 `null`을 반환한다. 두 Overview는 섹션 진입 경로(`/foundations`, `/components`)와 같으므로 그대로 없어야 한다. 이 Task에서 `DocFooterNav`를 건드리지 않았는지 확인한다.

```bash
git diff --name-only | grep DocFooterNav
```

출력이 없어야 한다. 눈으로 보는 확인은 컨트롤러가 한다.

- [ ] **Step 5: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```

빌드 성공, 63/63 통과, grep 출력 없음.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: Overview 페이지에 그 섹션의 개요를 싣는다

이동 경로만 있고 그 섹션이 무엇인지 설명하지 않았다. 카드 목록 위에
무엇을 다루고 어떤 순서로 읽고 무엇을 다루지 않는지 적었다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Footer를 넣는다

**Files:**
- Create: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/layout/AppShell.tsx`

**Interfaces:**
- Consumes: `sections` (`nav-config`), Task 4의 `AppShell` 구조
- Produces: 없음

- [ ] **Step 1: `SiteFooter`를 만든다**

GNB 메뉴는 `sections`에서 파생한다. 손으로 적지 않는다.

`src/components/layout/SiteFooter.tsx`:

```tsx
import { Link } from 'react-router'
import { sections } from '@/components/layout/nav-config'

const LINKEDIN = 'https://www.linkedin.com/in/yoon-sunwoo-649956204/'
const EMAIL = 'w0920ys@gmail.com'

export function SiteFooter() {
  return (
    <footer className="mt-24 flex flex-col gap-6 border-t pt-8">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <nav aria-label="섹션 이동" className="flex flex-wrap gap-x-4 gap-y-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="연락처" className="flex flex-wrap gap-x-4 gap-y-2">
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            {EMAIL}
          </a>
        </nav>
      </div>
      <p className="text-muted-foreground text-2xs">
        © 2026 sunwooyoon. All rights reserved.
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: `AppShell`에 붙인다**

`DocFooterNav` 아래에 둔다 — 이전/다음 버튼보다 아래다.

```tsx
            <div className="min-w-0 flex-1">
              <Outlet />
              <DocFooterNav />
              <SiteFooter />
            </div>
```

import를 더한다.

```tsx
import { SiteFooter } from '@/components/layout/SiteFooter'
```

- [ ] **Step 3: 빌드·테스트와 검사**

```bash
npm run build && npm test
grep -rnE '\[calc\(|\[[0-9]+(px|rem|vh|vw)\]|\[#' src/
```

빌드 성공, 63/63 통과, grep 출력 없음.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: 사이트 footer를 넣는다

저작권과 GNB 메뉴, LinkedIn, 이메일을 모든 페이지 최하단에 둔다.
메뉴는 nav-config에서 파생하므로 섹션이 늘면 따라 늘어난다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: 컨트롤러 브라우저 검증**

여기서 멈춘다. 구현자는 이 단계를 수행하지 않는다. 컨트롤러가 다음을 확인한다.

1. 섹션 제목과 목차 항목이 전부 영문이고, 설명은 한국어다
2. `Last updated`와 `Reset`이 영문으로 나온다
3. Anatomy에서 지시선이 서로 겹치지 않고, 어느 선이 어느 라벨의 것인지 분간된다
4. 부위를 선택하면 나머지 선이 사라지는 동작이 그대로다
5. 제목에 마우스를 올리면 link 아이콘이 나오고, 누르면 주소가 복사되며 check로 바뀐다
6. 복사된 주소로 들어가면 그 절로 이동한다
7. 목차가 컨테이너 안에서 sticky로 붙고, 스크롤 막대가 보이지 않는다
8. 목차의 항목 수가 늘지 않았다 (목차 자신의 제목이 수집되지 않았다)
9. 목차의 활성 추종이 맨 위·중간·맨 아래에서 정확하다
10. LNB 하위 항목의 모서리가 각지다
11. 섹션 사이 간격이 120px이다
12. Foundations와 Components의 Overview에 개요가 있고, 이전/다음 버튼은 없다
13. Footer가 모든 페이지에 있고 링크가 동작한다
14. 다크 모드와 720px에서 모든 페이지가 읽힌다

## v0.6.0 완료 기준

- [ ] 위 14개 항목을 모두 통과한다
- [ ] `grep -rn 'DocSection title="[가-힣]' src/`가 비어 있다
- [ ] Writing 문서의 `Language` 절이 새 규칙을 적고 있다
- [ ] 임의 값 대괄호 표기가 없다
- [ ] `npm test`와 `npm run build`가 통과한다

## v0.6.0 범위 밖

- v0.5.0 커밋 되돌리기 — 방향만 바꾼다
- 창 전체 스크롤로의 전환
- `useMeasuredTokens` 5벌 중복 해소
- 프리미티브 확장 · History 섹션 · 알림 벨 · Updates 실제 Changelog · 어드민 패턴 · ⌘K 검색
