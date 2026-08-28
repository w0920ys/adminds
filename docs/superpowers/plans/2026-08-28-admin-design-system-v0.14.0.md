# 어드민 디자인 시스템 v0.14.0 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 본문·컨트롤 라벨 기본값을 14px에서 16px로 올리고, 그 파급이 닿는 전체 타이포그래피 스케일(11~48px, 12단계)을 클래스명·굵기까지 다시 짠다.

**Architecture:** `src/styles/tokens.css`의 `--text-*` 토큰 12개를 픽셀 숫자 이름(`text-11`~`text-48`)으로 재정의하는 것이 출발점이다. 그 위에서 두 갈래 소비 작업이 갈린다 — (1) 역할이 다른 크기로 옮겨 가는 자리(제목류, 통계 숫자, 패턴 예시 가짜 제목)는 파일이 적고 정확한 목적지가 정해져 있어 직접 나열해 옮긴다. (2) `text-sm`(옛 본문)을 쓰던 449곳(92파일)은 "본문·컨트롤 라벨 역할이면 `text-16`, 조밀 모드(표 셀 등)면 `text-14`"라는 규칙 하나로 자리마다 판단해 스윕한다. 마지막에 문서 페이지(`TypographyPage.tsx`) 자체를 새 스케일에 맞춰 다시 쓴다.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v4(`@theme inline`), Vitest(node 환경, jsdom 없음).

## Global Constraints

- 작업 브랜치는 `v0.14.0`이다. `main`에 직접 커밋하지 않는다
- **Vitest는 `node` 환경에서 돈다. jsdom이 없다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않는다. 이 계획의 모든 작업은 UI 컴포넌트의 클래스명·문서 문장을 바꾸는 일이라 새 Vitest 테스트가 거의 없다 — 검증은 `npm run build`(tsc+vite) 통과와 개발 서버(`http://localhost:5204`)에서 `getComputedStyle`로 실측하는 것으로 한다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않는다.** 이 프로젝트가 매 회차 가장 많이 낸 결함이다. 특히 이번 회차는 클래스명 자체가 바뀌므로, 주석에 옛 클래스명이나 옛 역할을 그대로 남기지 않는다(예: `DocPage.tsx:38`의 "본문(text-sm)보다 한 단계 큰 text-base라..." 주석)
- **`text-sm`을 쓰던 자리를 옮길 때 클래스명만 보고 기계적으로 바꾸지 않는다.** `text-base`·`text-lg`·`text-xl`·`text-2xl`도 마찬가지다 — 이 네 클래스는 옛 역할이 새 스케일에서 **다른 픽셀 값**으로 옮겨 갔다(예: 옛 `text-base`의 역할 "문서 소제목"은 새 스케일에서 18px이지 16px이 아니다). 각 Task가 정확한 목적지를 명시한다
- `--spacing-control-sm`(32px)·`--spacing-control`(36px)·`--spacing-control-lg`(40px)·`--spacing-row`(48px)·`--spacing-row-compact`(40px) 값은 Task 10 전까지 건드리지 않는다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- 언어 규칙 — 구조를 가리키는 이름은 영문, 설명은 한국어
- 화면에 나오는 숫자·값을 손으로 적지 않는다
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다
- `public/r/*.json`을 손으로 고치지 않는다. `npm run registry`를 돌린다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않는다
- **이 하네스는 키보드 동작을 검증할 수 없다** — 키보드 동작은 소스로 추론하고 그렇게만 적는다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다
- `releases.ts`에 새로 쓰는 항목은 **간결한 한 줄 요약**으로만 쓴다(사용자 지시, v0.13.0 이후 규칙)

---

## 전체 타이포그래피 스케일 (모든 Task가 이 표를 기준으로 한다)

| 크기(px) | 줄 간격(px) | 클래스 | 이전 이름(값 참고용, 치환 대상 아님) | 굵기 | 역할 |
|---|---|---|---|---|---|
| 48 | 64 | `text-48` | `text-5xl` | bold | 강조 숫자·텍스트 대 |
| 40 | 52 | `text-40` | (없음) | bold | 강조 숫자·텍스트 중 |
| 32 | 44 | `text-32` | (없음) | bold | 페이지 제목(h1)·강조 숫자·텍스트 소 |
| 28 | 40 | `text-28` | (없음) | semibold | 상세 화면 제목 |
| 24 | 32 | `text-24` | `text-2xl` | semibold | 목록·카드 화면 제목 |
| 22 | 32 | `text-22` | (없음) | semibold | 문서 섹션 제목(h2) |
| 20 | 28 | `text-20` | `text-lg` | semibold | 다이얼로그·시트·얼럿다이얼로그 제목 |
| 18 | 28 | `text-18` | `text-base` | 제목 semibold / 문단 normal | 문서 소제목·카드 제목(semibold) · 설명 문단(normal) |
| **16** | 28 | `text-16` | `text-sm`(역할 일부) | 본문 normal / 컨트롤 라벨 medium | **본문·컨트롤 라벨 — 새 기본값** |
| 14 | 24 | `text-14` | `text-sm`(역할 일부) | normal | 조밀 모드 전용 — 표 셀 등 |
| 12 | 20 | `text-12` | `text-xs` | normal | 설명·캡션·도움말 |
| 11 | 16 | `text-11` | `text-2xs` | bold | 배지·메뉴 그룹 라벨·요일 머리 |

**"이전 이름" 열을 그대로 찾아 바꾸지 마라.** 예를 들어 지금 `text-xl`을 쓰는 자리는 셋으로 갈린다 — `DocPage.tsx`의 h2(섹션 제목)는 `text-22`로, `DetailPatternPage.tsx`의 가짜 제목은 `text-28`로, `ListPatternPage.tsx`의 가짜 제목은 `text-24`로. 위 표의 "이전 이름"은 그 픽셀 값이 예전에 어느 Tailwind 기본 클래스였는지 알려줄 뿐이다. 실제 목적지는 각 Task가 파일별로 명시한다.

---

## Task 1: 타이포그래피 토큰 재정의

**Files:**
- Modify: `src/styles/tokens.css:196-219`(지금 `--text-2xs`·`--text-2xs--line-height`·`--text-xs--line-height`·`--text-sm--line-height`·`--text-base--line-height`가 있는 블록)
- Modify: `src/components/ui/badge.tsx`(text-2xs 사용처, grep으로 확인)
- Modify: `src/components/docs/*.tsx` 중 `text-2xs`·`text-xs`를 쓰는 파일(뒤 Task가 다루는 sm 스윕과 겹치지 않게, 2xs·xs만)

**Interfaces:**
- Produces: `text-11`~`text-48` 12개 Tailwind 유틸리티 클래스. 이후 모든 Task가 이 이름을 쓴다

- [ ] **Step 1: `tokens.css`의 타이포 블록을 전부 다시 쓴다**

`src/styles/tokens.css:196-219`을 지금 읽고, 그 블록 전체(2xs부터 base까지, 관련 주석 포함)를 아래로 바꿔라:

```css
  --text-11: 0.6875rem;
  --text-11--line-height: 1rem;

  --text-12: 0.75rem;
  --text-12--line-height: 1.25rem;

  --text-14: 0.875rem;
  --text-14--line-height: 1.5rem;

  --text-16: 1rem;
  --text-16--line-height: 1.75rem;

  --text-18: 1.125rem;
  --text-18--line-height: 1.75rem;

  --text-20: 1.25rem;
  --text-20--line-height: 1.75rem;

  --text-22: 1.375rem;
  --text-22--line-height: 2rem;

  --text-24: 1.5rem;
  --text-24--line-height: 2rem;

  --text-28: 1.75rem;
  --text-28--line-height: 2.5rem;

  --text-32: 2rem;
  --text-32--line-height: 2.75rem;

  --text-40: 2.5rem;
  --text-40--line-height: 3.25rem;

  --text-48: 3rem;
  --text-48--line-height: 4rem;
```

기존 주석(4px 배수 규칙, 한글 밀도 이유)은 지우지 말고 위 선언 앞에 그대로 남겨라 — 내용이 여전히 맞다. `text-lg`·`text-xl`·`text-2xl`·`text-3xl`·`text-5xl`처럼 지금 tokens.css에 없던(Tailwind 기본값을 그대로 쓰던) 클래스에 대한 재정의는 필요 없다 — 새 이름(`text-18`·`text-20`·`text-24`·`text-48`)이 위 선언으로 대체한다.

- [ ] **Step 2: `text-2xs`를 `text-11`로 바꾼다**

`grep -rln "text-2xs" src --include="*.tsx"`로 찾은 모든 파일에서 `text-2xs`를 `text-11`로 바꿔라. 역할이 그대로(배지·메뉴 그룹 라벨·요일 머리)이므로 판단 없이 문자열만 바꾸면 된다.

- [ ] **Step 3: `text-xs`를 `text-12`로 바꾼다**

`grep -rln "text-xs\b" src --include="*.tsx"`로 찾은 모든 파일에서 `text-xs`를 `text-12`로 바꿔라. 역할이 그대로(설명·캡션·도움말)이므로 판단 없이 바꾼다. `text-xs`가 `text-2xs`의 부분 문자열이 아니므로 Step 2와 겹치지 않는다 — 다만 `text-2xs`를 먼저 바꿔 놨는지 확인하고 나서 이 Step을 해라(순서를 반대로 하면 `text-2xs`가 `text-212`처럼 깨진다).

- [ ] **Step 4: 빌드가 되는지 확인한다**

Run: `npx tsc -b && npm run build`
Expected: 에러 없음

- [ ] **Step 5: 새 토큰이 실제로 의도한 값으로 컴파일되는지 브라우저로 확인한다**

개발 서버를 `.claude/launch.json`의 `adminds-v0.14.0`(포트 5204)로 띄우고, `/foundations/badge`나 `text-11`을 쓰는 실제 화면에서 `getComputedStyle`로 `font-size`가 11px인지 확인해라. `text-12`도 캡션이 쓰이는 화면(예: `/foundations/typography`의 캡션 예시, 이번 Task에서는 아직 안 바뀐 이전 클래스 구조라 다른 화면에서 확인해도 된다)에서 같은 방식으로 확인해라.

- [ ] **Step 6: 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/styles/tokens.css
git add -u
git commit -m "feat(typography): 스케일 열두 단계를 픽셀 이름으로 다시 정의한다

본문 기본값을 14에서 16으로 올리는 회차의 토큰 계층이다. text-2xs와
text-xs는 역할이 그대로라 text-11, text-12로 문자열만 바꿨다. 나머지
열 단계는 뒤따르는 작업들이 자리마다 옮겨 채운다."
```

---

## Task 2: 제목류 재배치 — 소제목·다이얼로그 제목·페이지 제목·섹션 제목

**Files:**
- Modify: `src/components/docs/GuidelineBlock.tsx:63`
- Modify: `src/components/docs/PropertyBlock.tsx:50`
- Modify: `src/routes/get-started/PrinciplesPage.tsx:13`
- Modify: `src/components/ui/dialog.tsx:93`
- Modify: `src/components/ui/sheet.tsx:124`
- Modify: `src/components/ui/alert-dialog.tsx:74`
- Modify: `src/routes/Placeholder.tsx:19`
- Modify: `src/components/docs/DocPage.tsx:36,38,42,67`
- Modify: `src/components/ui/card.tsx:77-83`(`CardTitle`)

**Interfaces:**
- Consumes: Task 1의 `text-18`·`text-20`·`text-22`·`text-32`
- Produces: 없음(리프 소비자)

- [ ] **Step 1: `text-base` 소제목류를 `text-18`로 옮긴다**

`GuidelineBlock.tsx:63`과 `PropertyBlock.tsx:50`은 지금 둘 다 `<h3 className="text-base font-semibold">`다. `text-18 font-semibold`로 바꿔라(굵기는 이미 semibold라 그대로 둔다).

`PrinciplesPage.tsx:13`은 `<strong className="text-base font-semibold">{principle.title}</strong>`다. 같은 이유로 `text-18 font-semibold`로 바꿔라.

- [ ] **Step 2: `text-lg` 다이얼로그류 제목을 `text-20`로 옮긴다**

`dialog.tsx:93`, `sheet.tsx:124`, `alert-dialog.tsx:74` 셋 다 `className={cn('text-lg font-semibold', className)}` 형태다. `text-20 font-semibold`로 바꿔라.

`Placeholder.tsx:19`는 `<h1 className="text-lg font-semibold">{title}</h1>`다. 이 페이지는 아직 안 만든 라우트의 자리표시자 제목이라 다이얼로그류는 아니지만, 지금 크기가 `text-lg`였다는 것은 "본문보다 한 단계 큰 소제목급"이라는 뜻이었다. `text-18 font-semibold`(소제목류)로 옮겨라 — 다이얼로그 제목(`text-20`)이 아니라 소제목(`text-18`) 쪽이 맞다. `h1` 태그를 쓰고 있지만 실제 페이지의 유일한 제목이므로 태그는 그대로 둔다.

- [ ] **Step 3: `DocPage.tsx`의 h1·h2·설명 문단·주석을 옮긴다**

`DocPage.tsx:36`의 `<h1 className="text-3xl font-bold tracking-tight">{title}</h1>`을 `<h1 className="text-32 font-bold tracking-tight">{title}</h1>`로 바꿔라.

`DocPage.tsx:67`의 `<h2 className="text-xl font-semibold tracking-tight">{title}</h2>`를 `<h2 className="text-22 font-semibold tracking-tight">{title}</h2>`로 바꿔라.

`DocPage.tsx:42`의 `{description && <p className="text-muted-foreground max-w-2xl text-base">{description}</p>}`를 `<p className="text-muted-foreground max-w-2xl text-18">{description}</p>`로 바꿔라 — 이 자리는 "역할: 문서 소제목·카드 제목(semibold) · 설명 문단(normal)"에서 설명 문단 쪽이라 굵기를 추가하지 않는다(지금도 굵기 클래스가 없다. 그대로 둔다).

`DocPage.tsx:38` 근방의 주석("* 문서 설명은 이미 본문(text-sm)보다 한 단계 큰 text-base라 좁은 화면에서" 로 시작하는 문장)을 지금 코드가 실제로 하는 일에 맞게 고쳐라 — 옛 관계(본문 14px보다 소제목 16px이 큼)가 아니라 새 관계(본문 16px보다 설명 문단 18px이 큼)를 적어라. 주석의 나머지 내용(좁은 화면에서의 줄바꿈 이유)이 여전히 유효한지 확인하고, 유효하면 그 부분은 남겨라.

- [ ] **Step 4: `CardTitle`에 처음으로 크기를 명시한다**

`card.tsx:77-83`의 `CardTitle` 함수를 읽어라. 지금 `className={cn('leading-none font-semibold', className)}`처럼 크기 클래스가 없다. `text-18`을 더해 `cn('text-18 leading-none font-semibold', className)`로 만들어라 — `leading-none`이 이미 있으므로 Task 1에서 정의한 `--text-18--line-height`는 여기서 적용되지 않는다(의도된 것이다, `CardTitle`은 한 줄 제목이라 leading-none이 계속 맞다). 순서는 tailwind-merge가 나중 클래스를 우선하므로 `text-18`을 `leading-none` 앞에 두면 될 값이다(크기와 줄 간격은 서로 다른 유틸리티라 순서가 결과에 영향 없다는 것을 확인해라).

- [ ] **Step 5: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 6: 브라우저로 확인**

개발 서버(5204)에서 `/components/dialog`, `/components/sheet`, `/components/alert-dialog`, `/components/card`, `/get-started/principles`, 아무 Foundations/Components 문서 페이지(h1·h2 확인용), 그리고 아직 라우트가 없다면 `Placeholder`가 실제로 쓰이는 경로를 찾아 각각 `getComputedStyle`로 `font-size`가 의도한 값(20px·18px·32px·22px)인지 확인해라.

- [ ] **Step 7: 커밋**

```bash
git add src/components/docs/GuidelineBlock.tsx src/components/docs/PropertyBlock.tsx \
  src/routes/get-started/PrinciplesPage.tsx src/components/ui/dialog.tsx \
  src/components/ui/sheet.tsx src/components/ui/alert-dialog.tsx \
  src/routes/Placeholder.tsx src/components/docs/DocPage.tsx src/components/ui/card.tsx
git commit -m "feat(typography): 제목류를 소제목 18, 다이얼로그 제목 20, 페이지 제목 32, 섹션 제목 22로 옮긴다

CardTitle은 이번에 처음 크기를 명시적으로 받는다. DocPage 주석의 옛
크기 관계도 새 값에 맞게 고쳤다."
```

---

## Task 3: 패턴 예시 가짜 제목 분리 — 상세 화면 vs 목록 화면

**Files:**
- Modify: `src/routes/patterns/DetailPatternPage.tsx:115,215,232,249,315,378`
- Modify: `src/routes/patterns/ListPatternPage.tsx:112,301`

**Interfaces:**
- Consumes: Task 1의 `text-24`·`text-28`
- Produces: 없음

- [ ] **Step 1: `DetailPatternPage.tsx`의 가짜 제목 여섯 곳을 `text-28`로 옮긴다**

`grep -n "text-xl" src/routes/patterns/DetailPatternPage.tsx`로 여섯 자리를 확인해라(`115`·`215`·`232`·`249`·`315`·`378`). 전부 `<h4 className="text-xl font-semibold tracking-tight">`(또는 `315`행처럼 다른 클래스와 섞인 형태) 패턴이다. `text-xl`을 `text-28`로 바꿔라. 굵기(`font-semibold`)와 `tracking-tight`는 그대로 둔다.

- [ ] **Step 2: `ListPatternPage.tsx`의 가짜 제목 두 곳을 `text-24`로 옮긴다**

`112`행과 `301`행의 `<h4 className="text-xl font-semibold tracking-tight">컴포넌트</h4>`에서 `text-xl`을 `text-24`로 바꿔라.

- [ ] **Step 3: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 4: 브라우저로 확인**

개발 서버(5204)에서 `/patterns/detail`과 `/patterns/list`를 열어 가짜 제목의 `font-size`가 각각 28px·24px인지 `getComputedStyle`로 확인해라. 두 페이지의 가짜 제목이 서로 다른 크기라는 것도 화면에서 눈으로 대조해라.

- [ ] **Step 5: 커밋**

```bash
git add src/routes/patterns/DetailPatternPage.tsx src/routes/patterns/ListPatternPage.tsx
git commit -m "feat(patterns): 상세·목록 예시 가짜 제목을 28과 24로 갈라 둔다

지금까지 둘 다 text-xl(20px)을 같이 썼다. Wanted 참고 자료의 Title 2
(상세 화면 제목)와 Title 3(목록/카드 화면 제목) 구분을 따른다."
```

---

## Task 4: 강조 숫자·디스플레이 티어 소비 — 통계 카드와 개수 표시

**Files:**
- Modify: `src/routes/components/CardPage.tsx:65,174,323`
- Modify: `src/routes/get-started/GetStartedOverview.tsx:65,71,77`

**Interfaces:**
- Consumes: Task 1의 `text-32`·`text-40`·`text-48`
- Produces: 없음

- [ ] **Step 1: 세 크기(32·40·48) 중 어느 것을 쓸지 실제로 재서 정한다**

`text-2xl`(24px)이 이번 회차에서 "목록·카드 화면 제목" 역할로 넘어가므로, 통계·개수를 보여주던 지금의 `text-2xl` 자리는 새 강조 숫자 티어(32·40·48) 중 하나를 받아야 한다. 어느 것을 받을지는 자리마다 다르다 — 옆에 놓인 다른 요소(라벨, 카드 크기)와 비교해서 시각적으로 균형이 맞는 단계를 골라라.

개발 서버(5204)에서 지금(Task 4 착수 전) `/components/card`와 `/get-started`를 열어 각 통계 숫자가 카드 안에서 차지하는 비중을 눈으로 본 뒤, 다음 기준으로 배정해라:
- `CardPage.tsx:65`("128 / 200")와 `:323`(같은 값, 다른 예시)은 카드 안 보조 지표라 **`text-32`**
- `CardPage.tsx:174`("₩12,480,000")는 자릿수가 많아 더 큰 존재감이 필요하다고 판단되면 **`text-40`**, 아니면 `text-32`로 통일해도 된다 — 실제로 두 값을 나란히 렌더링해 보고 자릿수 때문에 줄바꿈이 일어나지 않는 쪽으로 정해라
- `GetStartedOverview.tsx:65,71,77`(컴포넌트/패턴 총개수)은 페이지 전체의 핵심 지표라 **`text-40`**

이 배정은 예시이고 강제가 아니다 — 실제로 브라우저에서 보고 다르게 판단했다면 그 판단과 근거를 보고서에 적어라. 다만 셋 다 `text-32`로 뭉뚱그리지는 마라 — 이 티어가 소·중·대 세 단계로 나뉘어야 한다는 게 이 Task의 존재 이유다.

- [ ] **Step 2: 클래스를 바꾼다**

각 자리의 `text-2xl`을 Step 1에서 정한 새 클래스로 바꿔라. 굵기(`font-semibold`·`font-bold`)는 스케일 표대로 전부 **bold**로 통일해라 — 지금 `GetStartedOverview.tsx`는 이미 `font-bold`고 `CardPage.tsx`는 `font-semibold`인데, 이 티어(32/40/48)의 역할은 굵기가 bold다고 스케일 표에 정해져 있으니 `CardPage.tsx` 세 곳도 `font-bold`로 올려라.

- [ ] **Step 3: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 4: 브라우저로 확인**

`/components/card`와 `/get-started`에서 각 숫자의 `font-size`·`font-weight`가 의도한 값인지 확인하고, 카드 레이아웃이 깨지지 않았는지(줄바꿈, 넘침) 눈으로 봐라.

- [ ] **Step 5: 커밋**

```bash
git add src/routes/components/CardPage.tsx src/routes/get-started/GetStartedOverview.tsx
git commit -m "feat(typography): 통계·개수 표시를 강조 숫자 티어(32/40/48)로 옮기고 굵기를 bold로 맞춘다"
```

---

## Task 5: `text-sm` 쓸어바꾸기 — 제품 컴포넌트와 레이아웃

**Files:**
- Modify: `src/components/ui/*.tsx` 중 `text-sm`을 쓰는 파일(25개 파일, 38곳)
- Modify: `src/components/layout/*.tsx` 중 `text-sm`을 쓰는 파일(5개 파일, 11곳)

**Interfaces:**
- Consumes: Task 1의 `text-16`·`text-14`
- Produces: 없음

- [ ] **Step 1: 규칙을 확인한다**

`grep -rn "text-sm\b" src/components/ui src/components/layout --include="*.tsx"`로 전체 목록을 뽑아라. 각 자리를 다음 규칙으로 판단해라:
- **본문·컨트롤 라벨 역할**(버튼 텍스트, 인풋 텍스트, 폼 라벨, 카드 설명, 토스트 메시지, 일반 문단) → `text-16`
- **조밀 모드 역할**(표 셀 값처럼 정보 밀도를 지키려고 의도적으로 촘촘히 둔 자리) → `text-14`(이름만 바뀌고 크기는 그대로)

이미 확인된 예시: `src/components/ui/table.tsx:43`(`<table>` 자체)와 `:186`(`TableCell`)은 조밀 모드라 `text-14`로 이름만 바꾼다. `src/components/ui/table.tsx:129`(`TableHead`)는 이미 `text-xs`였으니 이 Task 범위가 아니다(Task 1의 Step 3에서 이미 `text-12`로 바뀌어 있어야 한다 — 아직이면 지금 확인해서 바꿔라).

- [ ] **Step 2: 컨트롤 라벨 역할은 굵기도 확인한다**

스케일 표에 "본문 normal / 컨트롤 라벨 medium"이라고 되어 있다. 버튼·인풋·체크박스·라디오 등 컨트롤 자체의 라벨 텍스트로 쓰이는 자리는 `text-16`으로 바꾸면서 `font-medium`도 같이 있는지 확인해라(`button.tsx`는 이미 `font-medium`을 갖고 있을 것이다 — 없다면 추가할지는 그 컴포넌트의 기존 굵기 관례를 따라라, 이 Task에서 새로 굵기를 발명하지 마라. 원래 굵기가 없었다면 없는 채로 둔다).

- [ ] **Step 3: 파일마다 판단해 바꾼다**

25+5=30개 파일을 하나씩 열어 위 규칙을 적용해라. 애매한 자리(본문인지 조밀 모드인지 판단이 안 서는 곳)는 보고서에 파일:줄 번호와 함께 판단 근거를 적어라.

- [ ] **Step 4: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 5: 브라우저로 확인**

개발 서버(5204)에서 `/components/table`, `/components/button`, `/components/input`, `/components/card` 등 이번에 바꾼 컴포넌트가 실제로 쓰이는 문서 페이지 몇 곳을 열어 표 셀은 14px, 나머지 본문류는 16px로 렌더되는지 `getComputedStyle`로 확인해라.

- [ ] **Step 6: 커밋**

```bash
git add src/components/ui src/components/layout
git commit -m "feat(typography): 제품 컴포넌트와 레이아웃의 본문을 16으로 올리고 조밀 자리는 14로 남긴다"
```

---

## Task 6: `text-sm` 쓸어바꾸기 — 전시 시스템(docs)

**Files:**
- Modify: `src/components/docs/*.tsx` 중 `text-sm`을 쓰는 파일(10개 파일, 17곳)

**Interfaces:**
- Consumes: Task 1의 `text-16`·`text-14`
- Produces: 없음

- [ ] **Step 1~6**

Task 5와 같은 방식(규칙·굵기·판단·검사·브라우저 확인·커밋)을 `src/components/docs`(`GuidelineBlock.tsx`·`PropertyBlock.tsx`는 Task 2에서 이미 h3만 바뀌었다 — 그 파일들에 남은 다른 `text-sm` 자리가 있는지 다시 grep해서 확인해라)에 적용해라. 이 디렉터리는 전시 컴포넌트(문서 화면을 그리는 도구)라 대부분 "본문" 역할일 가능성이 높다 — 표 형태를 그리는 컴포넌트(`CopyPair.tsx` 등)가 있다면 조밀 모드 여부를 확인해라.

커밋 메시지: `"feat(typography): 전시 시스템(docs)의 본문을 16으로 올린다"`

---

## Task 7: `text-sm` 쓸어바꾸기 — Foundations와 Get Started

**Files:**
- Modify: `src/routes/foundations/*.tsx` 중 `text-sm`을 쓰는 파일(11개 파일, 108곳)
- Modify: `src/routes/get-started/*.tsx` 중 `text-sm`을 쓰는 파일(3개 파일, 21곳)

**Interfaces:**
- Consumes: Task 1의 `text-16`·`text-14`
- Produces: 없음

- [ ] **Step 1~6**

Task 5와 같은 방식을 적용해라. **`src/routes/foundations/TypographyPage.tsx`는 이 Task에서 건드리지 마라** — Task 11이 그 파일을 통째로 다시 쓴다(SCALE·WEIGHTS 상수와 예시 코드가 전부 바뀌므로 여기서 부분적으로 손대면 Task 11과 충돌한다). 나머지 10개 Foundations 파일과 3개 Get Started 파일만 다뤄라.

108곳이 몰려 있는 이유는 각 Foundations 페이지(Color·Spacing·Elevation 등)의 설명 문단이 많기 때문이다 — 대부분 "본문" 역할일 것이다. 표나 토큰 나열처럼 조밀하게 둬야 하는 자리가 있는지 각 파일에서 확인해라.

커밋 메시지: `"feat(typography): Foundations와 Get Started의 본문을 16으로 올린다"`

---

## Task 8: `text-sm` 쓸어바꾸기 — 컴포넌트 문서(routes/components)

**Files:**
- Modify: `src/routes/components/*.tsx` 중 `text-sm`을 쓰는 파일(32개 파일, 237곳)

**Interfaces:**
- Consumes: Task 1의 `text-16`·`text-14`
- Produces: 없음

- [ ] **Step 1: 이 디렉터리의 성격을 이해한다**

이 디렉터리는 개별 컴포넌트(Button·Dialog·Table 등)마다 하나씩 있는 문서 페이지다. 237곳 중 대부분은 "예시 코드 안에서 그 컴포넌트가 실제로 렌더할 본문 텍스트"다 — 즉 실제 제품 화면에서 그 컴포넌트를 쓸 때 어떤 크기가 되어야 하는지를 보여주는 자리라, Task 5(제품 컴포넌트 자체)와 같은 규칙을 적용하면 된다.

`TablePage.tsx`·`DataTablePage.tsx`는 표 셀 예시가 많아 조밀 모드(`text-14`) 비중이 클 것이다. 나머지 대부분의 컴포넌트 문서(`ButtonPage.tsx`·`InputPage.tsx`·`CardPage.tsx` 등)는 본문(`text-16`) 비중이 클 것이다 — 다만 짐작하지 말고 파일마다 실제로 봐라.

- [ ] **Step 2: 32개 파일을 규모로 나눠 처리한다**

`grep -c "text-sm\b" src/routes/components/*.tsx | sort -t: -k2 -rn`으로 파일별 개수를 세어, 많은 파일부터 순서대로 처리해라(진행 상황을 보고서에 몇 파일째인지 적어 두면 중간에 끊겨도 재개하기 쉽다).

- [ ] **Step 3: Task 5와 같은 규칙으로 판단해 바꾼다**

본문·컨트롤 라벨 역할 → `text-16`(컨트롤 라벨은 `font-medium` 확인). 조밀 모드 역할 → `text-14`.

- [ ] **Step 4: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 5: 브라우저로 확인**

개발 서버(5204)에서 최소 5개 컴포넌트 문서 페이지(`/components/table`, `/components/data-table`, `/components/button`, `/components/dialog`, `/components/card`)를 열어 본문·조밀 자리가 의도대로 렌더되는지 확인해라.

- [ ] **Step 6: 커밋**

```bash
git add src/routes/components
git commit -m "feat(typography): 컴포넌트 문서 페이지 서른두 개의 본문을 16으로 올린다"
```

---

## Task 9: `text-sm` 쓸어바꾸기 — Patterns와 나머지

**Files:**
- Modify: `src/routes/patterns/*.tsx` 중 `text-sm`을 쓰는 파일(4개 파일, 11곳 — `ListPatternPage.tsx`·`DetailPatternPage.tsx`는 Task 3에서 이미 h4만 바뀌었다, 남은 `text-sm` 자리를 다시 grep해서 확인해라)
- Modify: `src/routes/UpdatesPage.tsx`
- Modify: `src/routes/Placeholder.tsx`(Task 2에서 `text-lg`만 바뀌었다, 남은 `text-sm` 자리가 있는지 확인해라)

**Interfaces:**
- Consumes: Task 1의 `text-16`·`text-14`
- Produces: 없음

- [ ] **Step 1~6**

Task 5와 같은 방식을 적용해라. `ListPatternPage.tsx`는 `DataTable`을 조립하는 페이지라 표 셀 관련 조밀 모드 자리가 있는지 특히 확인해라(v0.13.0에서 이미 `DataTable`이 `text-sm`을 쓰기로 정해져 있었다 — `data-table.tsx` 자체는 Task 5 범위였다).

커밋 메시지: `"feat(typography): Patterns와 나머지 화면의 본문을 16으로 올린다"`

- [ ] **Step 7: 전체 스윕이 끝났는지 확인한다**

Run: `grep -rn "text-sm\b\|text-base\b\|text-lg\b\|text-xl\b\|text-2xl\b\|text-3xl\b\|text-5xl\b\|text-2xs\b" src --include="*.tsx"`

Expected: 결과 없음(전부 새 이름으로 바뀌어 있어야 한다). 남은 게 있으면 그 파일이 Task 1~9 중 어디에도 안 걸린 것이니 지금 바로 잡아 바꾸고, 보고서에 "계획이 놓친 파일"로 기록해라.

---

## Task 10: 밀도 축 실측 검증

**Files:**
- Modify(필요시): `src/styles/tokens.css`의 `--spacing-control-*` 블록
- Test: 없음(브라우저 실측만)

**Interfaces:**
- Consumes: Task 1~9가 끝난 뒤의 실제 화면(본문이 16px로 렌더되는 상태)
- Produces: 밀도 축 값을 바꿨다면 그 새 값. 뒤 Task는 이 결과를 몰라도 된다

- [ ] **Step 1: 세 컨트롤 높이에서 본문 텍스트가 실제로 얼마나 빡빡한지 잰다**

개발 서버(5204)에서 `size="sm"`(`h-control-sm`, 32px)·기본(`h-control`, 36px)·`size="lg"`(`h-control-lg`, 40px) 버튼이나 인풋이 있는 문서 페이지(`/components/button`, `/components/input`)를 열어라. 각 크기의 컨트롤 안 텍스트가 `text-16`(줄 간격 28px)일 때, 컨트롤 높이에서 줄 간격을 뺀 여백이 한쪽당 몇 px인지 계산해라(예: 32px 컨트롤 − 28px 줄 간격 = 4px, 양쪽 2px씩).

- [ ] **Step 2: 실제로 잘리거나 답답해 보이는지 스크린샷으로 확인한다**

`computer` 도구의 `screenshot`으로 세 크기를 확대해 캡처해라. 텍스트가 위아래로 눌려 보이거나 컨트롤 테두리에 닿을 듯 보이면 문제가 있는 것이다.

- [ ] **Step 3: 판단**

- 여백이 충분해 보이면(대략 4px 이상) **아무것도 바꾸지 않는다.** 보고서에 "실측 결과 문제 없음"이라고 적고 이 Task를 마친다
- 정말 답답해 보이면, `--spacing-control-sm`을 4px 단위로 올려라(예: 32px → 36px). 이때 **`control`(36px)·`control-lg`(40px)와 값이 겹치지 않게 세 단계 전체를 다시 4px 간격으로 재배열해라**(예: 36/40/44). 조밀 모드(`text-14`, 24px 줄 간격)와 짝지어 쓰는 곳은 값을 바꾸면 그쪽 여백도 함께 달라지니, 조밀 모드 화면(표 셀 등)도 같이 확인해서 너무 헐렁해지지 않았는지 봐라

- [ ] **Step 4: (값을 바꿨다면) 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/styles/tokens.css
git commit -m "fix(density): 밀도 축을 새 본문 크기에 맞춰 다시 잰다

<실측 결과와 새 값을 여기 적는다>"
```

값을 안 바꿨다면 커밋 없이 다음 Task로 넘어간다.

---

## Task 11: Typography 문서 페이지 재작성

**Files:**
- Modify: `src/routes/foundations/TypographyPage.tsx`(전체)

**Interfaces:**
- Consumes: 이 계획의 모든 스케일·굵기·역할 결정(위 표)
- Produces: 없음(최종 소비자)

- [ ] **Step 1: `SCALE`과 `WEIGHTS` 상수를 새 스케일로 다시 쓴다**

`TypographyPage.tsx:17-25`의 `SCALE` 배열을 이 계획 상단의 스케일 표와 똑같이 12줄로 다시 써라. 각 항목은 `{ className, role }`뿐 아니라 굵기 정보도 화면에 보여줘야 하므로, 타입을 `{ className: string; role: string; weight: string }`로 넓히고 렌더링 부분(표를 그리는 JSX, 지금 `:254-286` 근방)에 굵기 열을 추가해라. `role` 문자열도 위 표의 "역할" 열 그대로 옮겨라(18px과 16px처럼 역할이 둘로 갈리는 자리는 "문서 소제목·카드 제목(semibold) · 설명 문단(normal)"처럼 그대로 적는다).

`WEIGHTS` 배열(`:28-33`)은 그대로 둔다 — 이번 회차가 굵기 자체의 종류(medium/bold/normal/semibold)를 바꾸지 않는다.

- [ ] **Step 2: 계층 원칙 문단을 Scale 섹션 서두에 넣는다**

`<DocSection title="Scale">`(`:246` 근방) 안, 표가 나오기 전에 다음 문단을 추가해라:

```tsx
<p className="text-muted-foreground text-16">
  제목류(다이얼로그 제목 이상)는 굵기를 semibold 이상으로 씁니다. 본문은
  normal이 기본이고 컨트롤 라벨만 한 단계 진한 medium을 씁니다. 크기
  차이가 크지 않은 자리(소제목 18px과 본문 16px)는 굵기가 실제 위계를
  만듭니다.
</p>
```

- [ ] **Step 3: 크기 비율 검증 문단을 표 아래에 넣는다**

표 바로 아래에 다음 문단을 추가해라:

```tsx
<p className="text-muted-foreground text-16">
  본문(16px) 대비 제목류 크기 비율은 소제목 1.125배부터 강조 텍스트 대
  3배까지 걸쳐 있습니다. 대부분 1.25~1.5배 안에 들지만 소제목(18px)만
  이 아래인데, 굵기(semibold)로 위계를 보완했습니다. 헤딩을 h1~h4까지
  네 단계로 나누는 참고 사례도 있지만, 이 시스템은 h1~h3까지만 실제로
  쓰는 곳이 있어 세 단계로 둡니다.
</p>
```

이 문단의 숫자(1.125배, 3배, 1.25~1.5배)를 그대로 베끼지 말고, Step 1에서 다시 쓴 `SCALE` 배열의 실제 px 값으로 직접 나눠 계산해서 맞는지 확인해라(16px 기준 18/16=1.125, 48/16=3, 이건 이미 맞다 — 다른 숫자를 조정했다면 다시 계산해라).

- [ ] **Step 4: Guidelines 섹션에 목록·표 문단을 추가한다**

`<DocSection title="Guidelines">`(`:376` 근방) 안에 다음 문단과 링크를 추가해라:

```tsx
<p className="text-muted-foreground text-16">
  표와 목록은 본문보다 한 단계 낮은 조밀 모드(<code>text-14</code>)를
  씁니다. 머리 행은 그보다 작은 설명 크기(<code>text-12</code>)에
  굵기만 올려 구분합니다. 목록은 깊이가 있어도 크기를 줄이지 않고
  들여쓰기·마커로만 구분합니다. 자세한 값은{' '}
  <Link to="/components/data-table" className="underline underline-offset-2">
    Data Table
  </Link>
  에서 확인할 수 있습니다.
</p>
```

이 문단을 넣기 전에 `src/components/ui/table.tsx`를 다시 읽어 `TableCell`이 정말 `text-14`이고 `TableHead`가 정말 `text-12 font-bold`인지 확인해라(Task 1·5가 이미 그렇게 바꿔 놨어야 한다) — 문서 문장이 코드와 어긋나면 안 된다.

- [ ] **Step 5: DoDont의 `do` 목록에 밑줄 규칙을 추가한다**

`<DoDont do={[...]} dont={[...]} />`(`:451` 근방)의 `do` 배열 마지막에 `'밑줄은 텍스트 링크에만 쓰고 강조는 굵기·색으로 한다'`를 추가해라.

- [ ] **Step 6: Letter-spacing을 안 건드리는 이유를 한 줄 남긴다**

Font 섹션(`:206` 근방, Pretendard를 설명하는 문단 근처)에 다음 문장을 자연스러운 자리에 추가해라: "자간(letter-spacing)은 이 스케일에서 건드리지 않습니다 — Pretendard는 한글 중심 폰트라 다국어 대응 폰트만큼의 자간 미세조정이 필요하지 않습니다."

- [ ] **Step 7: 기존 Guidelines 예시 코드를 새 클래스명으로 갈아 끼운다**

`:405-448` 근방의 DO/DONT 예시 두 쌍(결제 실패 카드, STATS 통계)에 남아 있는 옛 클래스명(`text-sm`·`text-2xl`·`text-lg`·`text-base` 등)을 이 계획의 스케일에 맞게 바꿔라. DO 예시는 실제로 권장하는 조합(본문 `text-16`, 통계는 `text-32` 등)을 쓰고, DONT 예시는 "크기가 제각각인 나쁜 예"라는 취지를 유지하되 스케일 안에 실재하는 클래스만 써라(`MIXED_STAT_SIZES` 상수도 새 이름으로 바꿔라).

- [ ] **Step 8: 검사**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

- [ ] **Step 9: 브라우저로 전체 페이지를 확인한다**

개발 서버(5204)에서 `/foundations/typography`를 열어 Scale 표(굵기 열 포함), 새 문단 넷, DoDont, 예시 코드가 전부 의도대로 렌더되는지 확인해라. 표의 정렬(큰 것부터, `SCALE` 배열이 실측한 font-size 내림차순으로 자동 정렬된다는 기존 로직이 12단계에서도 깨지지 않는지)도 확인해라.

- [ ] **Step 10: 커밋**

```bash
git add src/routes/foundations/TypographyPage.tsx
git commit -m "docs(typography): 문서 페이지를 새 열두 단계 스케일로 다시 쓴다

굵기 열, 계층 원칙, 크기 비율 검증, 목록/표 안내, 밑줄 규칙,
letter-spacing 미적용 이유를 더했다."
```

---

## Task 12: 회차 기록과 문장 점검

**Files:**
- Modify: `src/data/releases.ts`
- Modify: `package.json`(버전, 필요시)

**Interfaces:**
- Consumes: Task 1~11의 커밋 전부
- Produces: 없음

- [ ] **Step 1: 이 브랜치가 실제로 무엇을 했는지 센다**

Run:
```bash
git log --oneline main..HEAD
git diff --stat main..HEAD
```

**본 것만 적는다.** 커밋 메시지가 아니라 실제 diff를 봐라.

- [ ] **Step 2: `releases.ts`에 v0.14.0을 더한다**

**한 줄 요약 규칙**(사용자 지시)을 따른다 — 핵심만, 나머지는 안 적는다. `purpose`는 한두 문장으로: 본문 기본값이 14에서 16으로 올랐고 전체 스케일이 12단계로 다시 짜였다는 것. `changes` 배열에는 실제로 바뀐 항목만 넣어라(예: `{ target: 'Typography', type: 'Updated', note: '...' }`) — 이번 회차가 건드린 화면이 아주 많으므로 `Typography` 하나로 뭉뚱그리지 말고, `src/routes/UpdatesPage.tsx:32`("그 버전에서 바뀐 항목을 대상과 종류로 나눠 보여줍니다")가 지키는 약속을 이번에도 지켜라 — Data Table 회차(v0.13.0)에서 이 약속을 한 번 어겨서 수정 회차가 따로 붙었던 전례가 있다. `updatedAt`이 오르는 화면(Foundations/Typography, 그리고 이번에 실제로 크기가 바뀐 컴포넌트 문서들)을 각각 `changes` 항목으로 적어라.

- [ ] **Step 3: 낡은 문장을 훑는다**

```bash
grep -rn "text-sm\|text-base\|text-lg\|text-xl\|text-2xl\|text-3xl\|text-5xl\|text-2xs" src/data/registry.ts src/data/patterns.ts docs/
```

registry나 patterns 데이터에 옛 클래스명을 언급하는 문장이 있으면(예: 컴포넌트 설명에서 "text-sm을 쓴다"처럼 적어 둔 자리) 새 이름으로 고쳐라.

- [ ] **Step 4: 검사와 커밋**

Run: `npm test && npx tsc -b && npm run build && npx oxlint src`

```bash
git add src/data/releases.ts package.json
git commit -m "chore: v0.14.0 기록을 남긴다"
```

---

## 자체 검토 기록

**스펙 커버리지 확인:**
- 판단 1(본문 16px, KRDS 17px 기각) — Task 1이 `text-16`을 1rem으로 정의해 반영
- 판단 2(스케일 재설계, 레퍼런스 셋 참고만) — 스케일 표 자체가 이 판단의 결과, Task 1~4가 소비
- 판단 3(클래스명 픽셀 숫자 전면 통일) — Task 1~9가 전부 이 규칙을 따름
- 판단 4(굵기가 크기와 함께 위계) — Task 2·4·11이 굵기를 명시적으로 다룸
- 판단 5(밀도 축 안 건드림, 실측 후 판단) — Task 10
- text-sm 쓸어바꾸기 — Task 5~9
- 문서 페이지 반영 사항 여섯 개 — Task 11의 Step 2~7
- 구현에서 갈라지는 화면 일곱 곳 — Task 2·3에서 전부 다룸
- 범위 밖 셋(Color 대비표, Badge 명암비, 나머지 컴포넌트) — 이 계획에 포함하지 않음(스펙이 명시적으로 범위 밖으로 뒀다)

**타입 일관성:** `SCALE` 배열의 새 필드 `weight`는 Task 11의 Step 1에서 처음 정의되고 같은 Task 안에서만 쓰인다. 다른 Task와 이름 충돌 없음.

**플레이스홀더 스캔:** 없음. Task 10의 Step 4 커밋 메시지에 `<실측 결과와 새 값을 여기 적는다>`가 있는데, 이건 Task 10이 값을 바꾸는 경우에만 실행되는 조건부 Step이고 실측 결과가 그 시점에 나와야 채울 수 있는 자리라 미리 못 박을 수 없다 — 구현자가 실제 실측값으로 채워야 한다는 걸 Step 3이 이미 지시하고 있다.
