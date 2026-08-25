# 어드민 디자인 시스템 워크벤치 v0.2.0 설계

작성일: 2026-08-25
저장소: https://github.com/w0920ys/adminds
기준 커밋: `93da538` (v0.1.0 baseline)

## 1. 배경과 목적

이 프로젝트는 운영용 관리자 화면이 아니라, 개인용 **어드민 디자인 시스템 워크벤치**다.
대시보드 이름은 **서비스 대시보드**이며, 사용자는 1명(본인)이다.

워크벤치가 답해야 하는 질문:

1. 지금 디자인 시스템이 잘 구성되어 있는가
2. 버전 업데이트에서 내가 요청한 사항이 반영됐는가
3. variant / state / edge case / 사용 패턴이 어디까지 쌓였는가

이 시스템은 이후 실제 플랫폼 어드민 화면을 만들 때의 기준점이 된다.

## 2. v0.1.0 현황과 문제

Vite + React 19 + lucide-react로 Overview 화면 하나가 구현되어 있다.
앱 셸, 다크모드, 720/1050px 반응형, 버전 알림 UI, Button anatomy 시각화,
디바이스 미리보기 전환까지 "겉모습"은 갖췄다.

그러나 아래가 비어 있어 디자인 시스템으로 기능하지 못한다.

- **재사용 컴포넌트 0개.** `components/` 디렉터리 자체가 없고 전부 일회성 CSS 클래스다.
- **토큰 미구축.** CSS 변수 8개(`--bg --panel --text --muted --border --purple --purple-soft --shadow`)뿐이고
  나머지 색·간격은 하드코딩 hex다. spacing / radius / typography 스케일이 없다.
- **라우팅 없음.** 사이드바 항목이 전부 동작하지 않는 빈 버튼이다. 실재하는 페이지는 Overview 하나.
- **패턴이 목업.** 목록 미리보기는 하드코딩된 2행짜리 그림이며 DataTable / FilterBar 컴포넌트가 아니다.
- **알림·Changelog 미연결.** 알림 배지가 항상 켜져 있고 버전 히스토리 배열이 없다.

원인은 화면부터 만들고 부품을 역추출하려 한 순서에 있다. v0.2.0은 순서를 뒤집는다.

## 3. 확정된 결정

| 항목 | 결정 | 근거 |
|---|---|---|
| 스타일 | Tailwind v4 (`@theme` CSS-first) | 설정 파일 없이 CSS에서 토큰을 선언 — "디자인 토큰 = CSS 변수" 목표와 구조가 일치. shadcn CLI가 v4 지원 |
| 컴포넌트 | shadcn/ui (CLI로 소스 복사) | 스타일 주권을 유지하면서 Radix 기반 접근성·포커스 트랩을 직접 구현하지 않아도 됨 |
| 라우팅 | react-router v7 (declarative) | IA가 4단 깊이(Components > Actions > Button). 특정 컴포넌트 페이지로 바로 가는 것이 워크벤치의 핵심 사용법 |
| 아이콘 | lucide-react (유지) | shadcn 기본 아이콘셋과 동일 |
| 비주얼 | **shadcn 기본 톤으로 리셋** | 초반 속도를 우선. 브랜딩은 이후 토큰 교체로 입힌다 |
| 기존 코드 | `src/App.tsx`, `src/App.css` **삭제** | 비주얼을 리셋하므로 부분 이식은 손해. `src/data/releases.ts`는 스키마를 확장해 존속 |

## 4. 폴더 구조

```
src/
  components/
    ui/          # shadcn primitive (Button, Input, Badge, ...)
    patterns/    # DataTable, FilterBar, PageHeader, EmptyState
    layout/      # AppShell, Sidebar, Topbar
    docs/        # 워크벤치 전용: Anatomy, VariantGrid, StateGrid, SpecTable
  routes/
    overview/  foundations/  components/  patterns/  templates/  changelog/
  styles/
    tokens.css   # @theme — 색·타이포·간격·radius·shadow·z-index·density
    globals.css
  data/
    releases.ts  # 버전 히스토리
    registry.ts  # 컴포넌트 메타(status/addedIn/changedIn/verified)
  lib/utils.ts
```

`components/docs/`와 `data/registry.ts`가 일반 shadcn 프로젝트에 없는 이 워크벤치의 핵심이다.
Anatomy / Variations / States를 컴포넌트마다 손으로 그리지 않고 **선언한 메타데이터로 자동 렌더링**한다.
이것이 있어야 컴포넌트를 늘릴 때 전시 페이지 비용이 선형으로 늘지 않는다.

### 추가 시맨틱 토큰

shadcn 기본(`primary/secondary/muted/accent/destructive`)은 어드민에 부족하다. 다음을 추가한다.

- `--success` `--warning` `--info` — 상태 표현
- `--surface-raised` — 정보 밀도가 높은 화면의 레이어 구분
- `--density-*` — 테이블 행 높이·컨트롤 높이 축

## 5. 진행 순서

관통 슬라이스(walking skeleton) 방식. 토큰 → 컴포넌트 → 전시 → 버전기록의 전 구간 배관을
Button 하나로 먼저 뚫고, 이후 옆으로 복제하며 확장한다.

### 1단계 · 재스캐폴드
Tailwind v4 설치 → `shadcn init` → react-router 설치 → `App.tsx`/`App.css` 제거, 폴더 골격 생성.
**완료 기준**: 빈 화면이 뜨고 `npm run build` 통과. 이전 코드가 남아 있지 않음.

### 2단계 · 토큰 (`styles/tokens.css`)
색, 타이포 스케일, 간격, radius, shadow, z-index 레이어, density 축을 `@theme`에 선언. 라이트/다크 두 벌.
**완료 기준**: 이후 화면에 등장할 색·간격 값 중 하드코딩된 것이 없다는 규칙이 성립.

### 3단계 · 앱셸 + 라우팅
`AppShell` / `Sidebar` / `Topbar`. 사이드바에 IA 전체(Overview·Foundations·Components·Patterns·Templates·Changelog)를 넣되,
아직 없는 라우트는 "준비 중" placeholder 페이지로 연결.
**완료 기준**: 사이드바의 모든 항목이 실제로 이동한다. 동작하지 않는 버튼이 하나도 없다.
다크모드 토글이 토큰만으로 동작한다.

### 4단계 ★ 검증 지점 · 검증 장치 + Button 관통
- `data/registry.ts` — 컴포넌트 메타 스키마 정의
- `components/docs/` — `Anatomy`, `VariantGrid`, `StateGrid` 3종. 메타를 받아 자동 렌더링
- `components/ui/button.tsx` — shadcn Button 도입 + 토큰 매핑
- `routes/components/button.tsx` — 위 3종을 조립한 전시 페이지

**완료 기준**: Button 페이지에서 모든 variant × size 조합과
default / hover / focus / disabled / loading 상태가 한 화면에 보이고, anatomy가 registry 데이터에서 나온다.

**여기서 멈추고 함께 확인한다.** 포맷이 어색하면 이 시점에 고친다. 이후 단계에서는 12배로 번진다.

### 5단계 · 프리미티브 확장
4단계 틀을 복제. Badge → Input → Label → Card → Select → Checkbox → Switch → Dialog → Toast 순.
각각 registry 등록 + 전시 페이지.
**완료 기준**: 새 컴포넌트 1개 추가가 "shadcn add → registry 한 항목 → 페이지 파일 복사" 세 스텝으로 고정된다.

### 6단계 · Foundations 페이지 (v0.3.0)
Colors / Typography / Spacing / Icons를 `tokens.css`에서 **읽어서** 표시.
**완료 기준**: 토큰 값을 수동으로 두 곳에 적는 곳이 없다.

### 7단계 · Overview 재구축 + 알림 연결 (v0.3.0)
스탯 숫자는 registry에서 계산하고, 변경 목록·검증 큐는 releases에서 온다.
**완료 기준**: `releases.ts`에 버전 하나를 추가하면 Overview·Changelog·알림이 동시에 갱신된다.

### 8단계 · 어드민 패턴 (v0.4.0)
PageHeader → FilterBar → DataTable → EmptyState → ConfirmDialog.
사용자 관리 목업 데이터로 "목록 → 검색 → 선택 → 상세 → 상태 변경 → 성공 피드백" 흐름 하나를 Templates에서 완주.

### 마일스톤 경계

**v0.2.0의 범위는 1~5단계.** 6~8단계는 이후 버전으로 미룬다.
각 버전이 워크벤치에서 실제로 검증 가능한 덩어리가 되도록 자른다.

## 6. 데이터 모델

워크벤치의 목적이 "요청이 잘 반영됐는지 확인"이므로 이 두 파일이 단일 진실 원천이다.
화면은 전부 여기서 파생된다.

### `data/registry.ts`

```ts
type ComponentMeta = {
  id: string                  // 'button'
  name: string                // 'Button'
  category: 'actions' | 'inputs' | 'navigation' | 'feedback' | 'data-display'
  status: 'draft' | 'review' | 'stable' | 'deprecated'
  addedIn: string             // 'v0.2.0'
  changedIn: string           // 'v0.2.0'
  purpose: string             // 언제 쓰는가
  guidelines: { do: string[]; dont: string[] }
  anatomy: { part: string; note: string }[]   // Anatomy 컴포넌트가 읽어 그린다
  variants: string[]          // VariantGrid가 조합 전개
  sizes: string[]
  states: string[]            // StateGrid
  verified: boolean           // 눈으로 확인했는가
}
```

`variants` / `sizes` / `states`를 선언하면 전시 화면이 자동으로 나온다.
Button에 variant를 하나 추가하면 전시 페이지 수정 없이 그리드에 칸이 늘어난다.

Overview의 스탯 카드(컴포넌트 수, 검증 완료 수)도 이 배열을 세어 만든다. 숫자를 손으로 적지 않는다.

### `data/releases.ts`

현재의 `currentRelease` 단일 객체를 배열로 바꾼다.

```ts
type Release = {
  version: string                   // 'v0.2.0'
  publishedAt: string               // '2026-08-25'
  title: string
  purpose: string                   // 이 버전의 목적
  changes: { target: string; type: 'New' | 'Updated' | 'Fixed'; note: string }[]
  requests: { label: string; done: boolean }[]      // 내가 요청한 것 / 반영 여부
  reviewItems: { label: string; category: string; completed: boolean }[]
  impact: string[]                  // 영향 범위
}

export const releases: Release[] = [ /* 최신이 앞 */ ]
export const currentRelease = releases[0]
```

`requests`가 "내가 요청한 사항들이 잘 반영됐는지 확인"에 직접 대응한다.
Overview에 `2 / 3 반영` 형태로 표시된다.

### 알림 동작

```
localStorage['lastSeenVersion'] !== currentRelease.version
  → 벨에 배지 + 릴리스 배너 노출
  → "업데이트 보기" 클릭 → Changelog 이동 + lastSeenVersion 갱신 → 배지 사라짐
```

사용자가 1명이므로 서버 없이 localStorage로 충분하다.

## 7. 확장 규칙

새 UI가 시스템에 들어오는 판단 기준을 컴포넌트를 늘리기 전에 고정한다.

```
새 UI가 필요하다
 ├ 기존 컴포넌트 조합으로 되나? ─ 예 → patterns/ 에 조합으로 추가
 ├ 두 곳 이상에서 반복되나? ──── 아니오 → 제품 레이어에 두고 시스템에 넣지 않는다
 └ 예 → 같은 컴포넌트의 축인가?
        ├ 예 → variant 또는 size 추가 (registry에 선언만 하면 전시 자동 반영)
        └ 아니오 → components/ui 에 새 컴포넌트 + registry 등록 + 전시 페이지
```

**변경 시 함께 갱신해야 하는 것**: registry 메타(`changedIn`, `status`, `verified`) + releases의 해당 버전 항목.
이 둘을 갱신하지 않으면 Overview의 숫자와 실제가 어긋나고 워크벤치가 거짓 정보를 표시하게 된다.

## 8. 완료 기준

### 컴포넌트 하나 — `status: 'stable'` 조건

- 키보드만으로 조작 가능하고 포커스 상태가 명확한가
- disabled / loading / error 상태가 있는가
- 720px에서 깨지지 않는가
- 라이트·다크 양쪽이 자연스러운가
- 하드코딩된 색·간격 값이 없는가
- 전시 페이지에서 위 항목을 눈으로 확인했는가 (`verified: true`)

### v0.2.0 전체

> `releases.ts`에 버전을 하나 추가하고 registry에 컴포넌트를 하나 등록하면,
> 사이드바·Overview·Changelog·알림·전시 페이지가 코드 수정 없이 따라온다.

이것이 성립하면 이후 확장은 데이터 추가 작업이 된다.

## 9. 리스크

**① 재작성 중 화면이 오래 비어 있다.**
1~3단계 동안 볼 것이 없다. 완화책으로 3단계(앱셸)를 앞에 배치했다.
껍데기와 다크모드가 먼저 동작하면 진행 상황이 눈에 보인다.

**② 전시 자동화의 과설계 가능성.**
registry 기반 자동 렌더링은 컴포넌트가 3~4개를 넘어야 이득이 난다.
Button 하나에서는 손으로 짜는 것보다 번거로워 보일 수 있다.
4단계 검증 지점에서 과하다고 판단되면 수동 전시로 내려가는 것도 유효한 선택이다.
4단계에서 멈춰 확인하는 이유가 이것이다.

## 10. 범위 밖

- Storybook 도입 — 컴포넌트 수와 사용 팀이 늘어난 이후에 판단
- 패키지화(monorepo, `packages/ui`) — 재사용 수요가 확인된 이후
- 다국어 — 현재 한국어 단일
- 실제 백엔드 연동 — 목업 데이터로 충분
