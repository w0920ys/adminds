# 어드민 디자인 시스템 워크벤치 v0.3.0 설계

작성일: 2026-08-25
저장소: https://github.com/w0920ys/adminds
선행: v0.2.0 (토큰 · 앱셸 · Button 관통 슬라이스)
참고: [seed-design.io](https://seed-design.io), [Montage Button](https://montage.wanted.co.kr/docs/components/actions/button/design)

## 1. 이번 버전이 바꾸는 것

v0.2.0에서 "메타데이터 → 전시 페이지" 배관이 작동하는 것을 확인했다.
v0.3.0은 그 위에 **문서 사이트로서의 구조**를 얹는다. 두 축을 바꾼다.

1. **네비게이션**: 사이드바 1단 → GNB(상단) + LNB(좌측) 2단
2. **컴포넌트 페이지 포맷**: 평면 조합 격자 → property별 분리 + Playground/Usage/Cases

그리고 **Foundations를 Components보다 먼저 완성한다.**

## 2. 정보 구조

### GNB (상단)

```
Get started | Foundations | Components | Patterns | Updates
```

각 GNB 항목은 자기 섹션의 Overview로 이동한다.

### LNB (좌측) — 현재 GNB 섹션의 하위만 표시

| 섹션 | LNB 항목 |
|---|---|
| Get started | Overview, 설치, 원칙 |
| Foundations | Overview, Color, Typography, Spacing, Iconography, State, Voice and Tone, Writing |
| Components | Overview, Actions(Button), Inputs, Navigation, Feedback, Data Display |
| Patterns | Overview (v0.3.0에서는 준비 중) |
| Updates | Overview(= Changelog) |

**규칙:** 모든 GNB 섹션은 Overview를 가진다. LNB의 첫 항목은 항상 Overview다.

### 라우트

```
/                                → Get started Overview
/foundations                     → Foundations Overview
/foundations/color               → 개별 Foundation
/components                      → Components Overview
/components/button               → 개별 Component
/patterns                        → Patterns Overview
/updates                         → Updates Overview (Changelog)
```

### 페이지 하단 네비게이션

모든 문서 페이지 하단에 이전/다음 링크를 둔다.

```
← 이전 문서              다음 문서 →
   State                    Writing
```

순서는 **LNB 순서를 평탄화한 하나의 선형 목록**에서 온다. 섹션 경계를 넘어간다 —
Foundations의 마지막 문서(Writing)의 다음은 Components Overview다.
이 목록은 네비게이션 설정 한 곳에서 파생되며, 페이지마다 손으로 적지 않는다.

## 3. Foundations (8개)

| 페이지 | 내용 | 데이터 출처 |
|---|---|---|
| Overview | Foundations가 무엇이고 무엇을 다루는지, 8개 카드 링크 | nav 설정 |
| Color | 시맨틱 토큰 전체를 라이트/다크 병렬로. 대비비 표기 | `tokens.css` 실측 |
| Typography | 크기 스케일, 행간, 굵기 | `tokens.css` 실측 |
| Spacing | 4px 기반 스케일, density 축(control/row 높이) | `tokens.css` 실측 |
| Iconography | lucide 사용 규칙, 크기(16/20/24), 스트로크 | 직접 작성 |
| State | default/hover/focus/active/disabled/loading/error의 표현 규칙 | 직접 작성 + 실물 예시 |
| Voice and Tone | 어드민의 말투 원칙 | 직접 작성 |
| Writing | 버튼 라벨, 에러 메시지, 빈 상태 문구 작성 규칙 | 직접 작성 |

앞 3개(Color·Typography·Spacing)는 **`tokens.css`에서 실제 계산된 값을 읽어 표시한다.**
토큰을 바꾸면 문서가 저절로 따라와야 하며, 값을 두 곳에 적지 않는다.
구현 수단은 `getComputedStyle`로 런타임 실측 — 빌드 시점 파싱보다 단순하고, 라이트/다크 양쪽 값을 그대로 얻는다.

Voice and Tone / Writing은 산문 문서다. 이 둘을 위해 `DocPage` 틀(제목·본문·Do/Don't 블록·하단 네비)을 만든다.

## 4. 컴포넌트 페이지 포맷

Montage의 Button 문서 구조를 기준으로 삼되, 이 워크벤치의 자동 생성 원칙을 지킨다.

```
헤더 (이름 · status · 검증 여부 · purpose · 버전)
Anatomy          ← 지시선 자동 생성 + 번호 클릭 하이라이트
Playground       ← property를 조합해 즉시 확인
Properties       ← size / layout / variant / state / width 각각 별도 블록
Guidelines       ← Hierarchy 등 이름 붙은 지침 + Do/Don't
Usage            ← 실제 어드민 화면에서의 배치 예시
Cases            ← 긴 텍스트, 좁은 화면, 아이콘 단독, 권한 없음 등 edge case
하단 이전/다음 네비게이션
```

History 섹션은 이번 버전에 넣지 않는다 (v0.4.0의 Updates 연동 시 함께).

### Anatomy — 지시선 자동 생성

보내진 레퍼런스 이미지처럼 부위마다 지시선과 라벨이 붙되, 좌표를 손으로 잡지 않는다.

1. 컴포넌트 미리보기의 각 부위에 `data-anatomy="<part-id>"` 속성을 붙인다
2. `Anatomy`가 마운트 후 `getBoundingClientRect()`로 각 부위의 위치를 측정한다
3. 측정값으로 SVG 지시선과 라벨을 그린다
4. 번호를 클릭하면 해당 부위에 강조 링이 들어가고, 나머지는 흐려진다
5. `ResizeObserver`로 크기 변화 시 다시 측정한다

라벨을 좌/우 어느 쪽에 둘지는 부위의 중심 x좌표가 컨테이너 중앙보다 왼쪽인지로 정한다.
메타데이터에는 좌표가 아니라 `part`(id) · `label` · `note` · `optional` 만 선언한다.

측정 실패나 지시선이 겹치는 경우를 대비해, 지시선 없이 번호 목록만 보이는 것을 기본 상태로 두고
측정에 성공하면 지시선을 얹는다. 지시선이 없어도 문서로서 성립해야 한다.

### Properties — 축별 분리

`ComponentMeta`의 평면 배열(`variants` / `sizes` / `states`)을 축(property) 목록으로 바꾼다.

```ts
type PropertyOption = {
  value: string          // 'default'
  label?: string         // 표시용 (없으면 value)
  note?: string          // 이 옵션을 언제 쓰는가
}

type ComponentProperty = {
  name: string           // 'variant'
  title: string          // 'Variant'
  description: string    // 이 축이 무엇을 정하는가
  options: PropertyOption[]
  /** 전시 배치. grid = 옵션을 격자로, row = 한 줄로, matrix = 다른 축과 교차 */
  display: 'grid' | 'row' | 'matrix'
  /** display가 matrix일 때 교차할 축 이름 */
  crossWith?: string
}
```

축은 컴포넌트마다 다르다. Button은 `variant / size / layout / width / state` 다섯 개를 갖고,
Badge는 `variant` 하나만 갖는다. **선언한 축만 렌더링되므로 축이 하나인 컴포넌트에서 빈 표가 나오지 않는다.**

`layout`과 `width`는 Button에 새로 추가되는 축이다.
- `layout`: `icon-leading` / `icon-trailing` / `icon-only` / `label-only`
- `width`: `hug` / `fill`

### Playground

선언된 축에서 각각 하나씩 골라 조합한 결과를 즉시 보여준다.
컨트롤은 축 목록에서 자동 생성되므로 컴포넌트마다 새로 만들지 않는다.

### Guidelines

이름 붙은 지침 블록의 배열로 바꾼다. Montage의 Hierarchy처럼 그림이 필요한 지침이 있기 때문이다.

```ts
type Guideline = {
  title: string          // 'Hierarchy'
  body: string
  do?: string[]
  dont?: string[]
}
```

## 5. 데이터 모델 변경

`ComponentMeta`를 다음으로 교체한다.

```ts
type ComponentMeta = {
  id: string
  name: string
  category: ComponentCategory
  status: ComponentStatus
  addedIn: string
  changedIn: string
  purpose: string
  anatomy: AnatomyPart[]        // { part, label, note, optional? }
  properties: ComponentProperty[]
  guidelines: Guideline[]
  usage: UsageExample[]         // { title, note }
  cases: CaseExample[]          // { title, note }
  verified: boolean
}
```

`variants` / `sizes` / `states` 필드는 사라진다. `guidelines`의 `{do, dont}` 형태도 바뀐다.
`VariantGrid` / `StateGrid`는 `PropertyBlock` 하나로 대체된다.

`usage`와 `cases`는 **메타데이터에 설명을 두고 렌더링은 페이지가 콜백으로 주입**한다.
전시 컴포넌트가 여전히 어떤 컴포넌트인지 몰라야 하기 때문이다.

## 6. 파일 구조 변경

### 신규

```
src/components/layout/Gnb.tsx          # 상단 전역 네비게이션
src/components/layout/Lnb.tsx          # 좌측 섹션 네비게이션
src/components/layout/DocFooterNav.tsx # 이전/다음 문서
src/components/docs/Playground.tsx
src/components/docs/PropertyBlock.tsx
src/components/docs/GuidelineBlock.tsx
src/components/docs/DocPage.tsx        # 산문 문서용 틀
src/components/docs/TokenTable.tsx     # tokens.css 실측 표시
src/lib/tokens.ts                      # getComputedStyle 기반 토큰 읽기
src/routes/foundations/*.tsx           # 8개
src/routes/get-started/*.tsx
src/routes/updates/*.tsx
```

### 교체

- `src/components/layout/nav-config.ts` → GNB/LNB 2단 구조 + 선형 순서 파생
- `src/components/layout/Sidebar.tsx` → `Lnb.tsx`
- `src/components/layout/AppShell.tsx` → GNB + LNB + 콘텐츠 + 하단 네비
- `src/components/docs/ComponentPage.tsx` → 새 섹션 구성
- `src/components/docs/Anatomy.tsx` → 지시선 + 하이라이트
- `src/data/registry.ts` → 새 `ComponentMeta`

### 삭제

- `src/components/docs/VariantGrid.tsx`, `StateGrid.tsx` → `PropertyBlock.tsx`로 통합

## 7. 진행 순서

1. **네비게이션 개편** — nav 설정, GNB, LNB, 하단 네비, 라우트 재배치. 새 페이지는 준비 중으로 연결
2. **토큰 실측 유틸 + TokenTable** — `getComputedStyle` 기반
3. **Foundations 8개** — Overview → Color → Typography → Spacing → Iconography → State → Voice and Tone → Writing
4. **컴포넌트 데이터 모델 교체** — `ComponentMeta` 재설계, Button 메타를 새 구조로
5. **Anatomy 지시선 + 하이라이트**
6. **PropertyBlock + Playground**
7. **Guidelines / Usage / Cases**
8. **Button 페이지 재조립 — 검증 지점**

1~3이 Foundations, 4~8이 Components다. 8단계에서 멈추고 포맷을 확정한 뒤,
이후 버전에서 프리미티브를 확장한다.

## 8. 완료 기준

- GNB에서 섹션을 바꾸면 LNB가 따라 바뀌고, 모든 항목이 실제로 이동한다
- 모든 문서 페이지 하단에 이전/다음이 있고, 순서가 nav 설정 한 곳에서 파생된다
- `tokens.css`의 값을 바꾸면 Foundations의 Color/Typography/Spacing이 따라 바뀐다
- Anatomy의 번호를 클릭하면 해당 부위가 강조된다. 지시선이 실제 위치를 가리킨다
- `ComponentMeta`에 축을 하나 추가하면 Properties에 블록이 하나 늘고 Playground에 컨트롤이 하나 늘어난다
- 축이 하나뿐인 컴포넌트에서 빈 표가 나오지 않는다
- 다크 모드와 720px에서 모든 페이지가 읽힌다
- `npm test`와 `npm run build`가 통과한다

## 9. 범위 밖

- 프리미티브 확장 (Badge~Toast) — v0.4.0
- 컴포넌트 페이지의 History 섹션 — Updates 연동과 함께 v0.4.0
- 알림 벨 UI — 훅은 v0.2.0에 있으나 UI는 v0.4.0
- 어드민 패턴 (DataTable / FilterBar 등) — v0.5.0
- Patterns / Get started의 상세 문서 — 이번엔 Overview만
- 빠른 검색(⌘K)
