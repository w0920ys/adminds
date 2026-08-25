# 어드민 디자인 시스템 워크벤치 v0.4.0 설계

작성일: 2026-08-25
선행: v0.3.0 (GNB/LNB · Foundations 8개 · property 축 구조 · Anatomy 지시선)
참고: [seed-design Color Role](https://seed-design.io/foundations/color/color-role), [Palette](https://seed-design.io/foundations/color/palette)

## 1. 이번 버전이 하는 일

v0.3.0의 골격 위에 **밀도와 정확도**를 올린다. 사용자 피드백 두 묶음을 반영한다.

1. **컴포넌트 문서** — 지시선이 안 보이는 문제, 표 분리, Playground 리셋, 예시 화면 신설, 하단 네비게이션 규칙
2. **Foundations** — 페이지마다 개요, Design Token 신설, Color 확장(Role·Palette·복사), Typography 확장(Pretendard·표·복사)

## 2. 확정된 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| Palette 원본 | **Tailwind v4 기본 팔레트를 계층화** | 새 색을 지어내지 않고, 시맨틱 토큰이 어느 원시 값을 가리키는지 연결해 보여준다. Palette → Role → 시맨틱의 위계가 바로 생긴다 |
| 좁은 화면 Anatomy | **번호 배지만** | 지시선을 그릴 여백이 없다. 부위 위에 ①②③ 배지를 올려 아래 번호 목록과 잇는다 |
| 예시 화면 | **실제 시스템 컴포넌트로 조합한 미니 UI** | 목업은 실제와 어긋나기 시작하면 문서가 거짓말을 한다. 실물이면 토큰을 바꿀 때 예시도 따라온다 |
| Color 하위 | **LNB의 평평한 항목으로 분리** (Color / Color Role / Palette) | seed-design과 같은 구조를 LNB 중첩 없이 얻는다 |

## 3. 컴포넌트 문서 변경

### 3.1 Anatomy

현재 지시선이 `text-muted-foreground`라 미리보기 배경과 구분되지 않는다. 다음을 바꾼다.

- **전용 주석 색 토큰 신설** — `--color-annotation` / `--color-annotation-muted`. 문서 주석 전용이며 제품 UI에 쓰지 않는다. 레퍼런스처럼 보라 계열로 두어 컴포넌트 색과 절대 겹치지 않게 한다
- **선을 얇게** — `strokeWidth` 1 → 0.75, 활성 시 1.25
- **선택 시 나머지 비노출** — 지금은 `opacity-20`으로 흐려지는데, 완전히 숨긴다. 선택된 부위 하나만 남아야 무엇을 가리키는지 분명해진다
- **반응형** — 640px 미만에서 지시선 대신 **부위 위 번호 배지**를 띄운다. 배지는 실측 좌표에 절대배치하며, 아래 번호 목록의 숫자와 대응한다

### 3.2 Properties

`variant`가 `size`와 교차한 24칸 표였다. **두 축을 각각 독립된 표로 분리한다** — `variant`의 `display`를 `matrix`에서 `row`로 바꾸고 `crossWith`를 제거한다. 축 순서(Variant → Size → Layout → Width → State)는 유지한다.

### 3.3 Playground

**초기값 리셋 버튼**을 둔다. 각 축의 첫 옵션으로 되돌린다. 현재 값이 초기값과 같으면 비활성.

### 3.4 Guidelines / Usage / Cases 예시 화면

지금은 텍스트뿐이다. 각 항목에 **실제 컴포넌트로 조합한 예시**를 붙인다.

예시는 JSX이므로 `registry.ts`(데이터)에 담을 수 없다. 데이터에는 식별자만 두고, 렌더링은 컴포넌트 페이지가 콜백으로 주입한다 — 전시 컴포넌트가 어떤 컴포넌트인지 몰라야 한다는 원칙을 유지하기 위함이다.

```ts
type Guideline = { id: string; title: string; body: string; do?: string[]; dont?: string[] }
type Example   = { id: string; title: string; note: string }
```

```ts
type ComponentPageProps = {
  // ...
  renderGuidelineExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
  renderExample?: (exampleId: string) => ReactNode
}
```

예시를 감싸는 `ExampleFrame`을 새로 만든다. 어드민 화면의 한 조각처럼 보이도록 표면·테두리를 두고, Do/Don't일 때는 그 라벨을 함께 단다.

### 3.5 하단 네비게이션

- **문서 최종 수정일**을 이전/다음 위에 표시한다. 날짜는 `nav-config`의 `DocLink.updatedAt`에서 온다 (표기는 Writing 규칙대로 `YYYY-MM-DD`)
- **같은 GNB 섹션 안에서만 이동한다.** 섹션 경계를 넘지 않는다 — v0.3.0에서는 넘어갔으나, 섹션이 바뀌면 맥락도 바뀌므로 되돌린다
- **각 섹션의 Overview 페이지에는 이전/다음을 두지 않는다.** Overview는 그 섹션의 입구이지 순서상의 한 문서가 아니다
- 버튼을 outline에서 **연한 secondary filled**로 바꾼다

## 4. Foundations 변경

### 4.1 공통

**Overview를 제외한 모든 Foundations 페이지 첫 섹션에 개요를 둔다.** 이 문서가 무엇을 정하고 무엇을 정하지 않는지 2~3문장.

### 4.2 Foundations Overview

- 같은 행의 카드는 **높이를 맞춘다** (`grid` + `h-full`)
- **이전/다음 네비게이션을 두지 않는다** (3.5의 규칙이 적용됨)

### 4.3 Design Token (신설, Overview와 Color 사이)

- 토큰이 어떤 층으로 구성되는지 — 원시 팔레트 → 시맨틱 역할 → 컴포넌트 사용
- 네이밍 규칙 — `--color-<역할>` / `--color-<역할>-foreground` / `--spacing-<축>` / `--radius-<크기>` 등이 무엇을 뜻하는지
- **전체 토큰 테이블** — `tokens.css`에서 모든 접두사를 파싱해 실측값과 함께 나열

### 4.4 Color

세 페이지로 나눈다.

| 페이지 | 내용 |
|---|---|
| Color | 개요, 시맨틱 토큰 견본, 사용 규칙 |
| Color Role | 역할의 위계 — 표면 / 전경 / 강조 / 상태 / 선. 각 역할이 언제 쓰이고 어떤 짝(`-foreground`)을 갖는지 |
| Palette | Tailwind 원시 스케일을 계층으로 나열하고, 각 시맨틱 토큰이 어느 값을 가리키는지 연결 |

**값 복사** — 모든 토큰 값은 연결된 토큰 이름과 hex를 함께 보여준다. 마우스를 올리면 복사 아이콘이 나타나고, 누르면 아이콘이 체크로 바뀌며 클립보드에 복사된다. 2초 뒤 원래대로 돌아온다. 이 동작을 `CopyValue` 컴포넌트로 만들어 Color·Palette·Design Token이 공유한다.

oklch로 저장된 값을 hex로 보여줘야 하므로, 실측한 계산값을 hex로 변환하는 유틸이 필요하다. 브라우저가 이미 색을 계산하므로 canvas 2D 컨텍스트에 칠해 읽는 방식을 쓴다 — 색 공간 변환을 직접 구현하지 않는다.

### 4.5 Typography

- **Pretendard를 기본 폰트로 한다.** CDN에서 가변 폰트를 불러오고, 시스템 폰트 스택을 폴백으로 둔다
- **폰트 스택 복사 영역** — 웹에서 즉시 적용할 수 있는 `font-family` 선언을 텍스트 영역에 두고 복사할 수 있게 한다
- **스타일 표** — 각 스타일의 크기·행간·자간을 표로 정리하고, **큰 것에서 작은 것 순**으로 위에서 아래로 나열한다
- **줄바꿈 규칙** — 한글 텍스트는 음절 단위로 줄바꿈한다 (`word-break: normal`). 어절 단위로 묶으면 좁은 화면에서 한 줄이 크게 비는 구간이 생긴다
- **사용 가이드라인** — 위계를 크기보다 굵기와 색으로 만드는 규칙 등

## 5. 파일 구조 변경

### 신규

```
src/components/docs/ExampleFrame.tsx    # 예시 화면 틀
src/components/docs/CopyValue.tsx       # hover 복사
src/lib/color.ts                        # 계산값 → hex 변환
src/routes/foundations/DesignTokenPage.tsx
src/routes/foundations/ColorRolePage.tsx
src/routes/foundations/PalettePage.tsx
```

### 교체·수정

- `nav-config.ts` — `DocLink.updatedAt` 추가, `findAdjacent`를 섹션 내로 한정, Foundations에 3개 항목 추가
- `DocFooterNav.tsx` — 최종 수정일, 섹션 내 한정, secondary filled, Overview에서 숨김
- `Anatomy.tsx` — 주석 색, 얇은 선, 선택 시 나머지 숨김, 좁은 화면 번호 배지
- `Playground.tsx` — 리셋 버튼
- `ComponentPage.tsx` — 예시 렌더 콜백
- `GuidelineBlock.tsx` / `ExampleList.tsx` — 예시 슬롯
- `registry.ts` — `variant`를 `row`로, `Guideline`·`Example`에 `id`
- `ButtonPage.tsx` — 예시 조합 주입
- `tokens.css` — `--color-annotation` 계열, Pretendard 폰트 스택, `word-break`
- `ColorPage.tsx` / `TypographyPage.tsx` / 나머지 Foundations — 개요 섹션
- `FoundationsOverview.tsx` — 카드 높이 균일

## 6. 완료 기준

- Anatomy 지시선이 컴포넌트와 구분되는 색으로 보이고, 선택하면 그 부위 하나만 남는다
- 375px에서 부위 위 번호 배지가 보이고 아래 목록과 대응한다
- Variant와 Size가 각각 독립된 표다
- Playground 리셋 버튼이 초기값으로 되돌리고, 초기 상태에서는 비활성이다
- Guidelines의 각 do/don't와 Usage·Cases의 각 항목에 실제 컴포넌트로 만든 예시가 붙는다
- 모든 문서 하단에 최종 수정일이 있고, 이전/다음이 같은 섹션 안에서만 이동한다
- Overview 페이지에는 이전/다음이 없다
- Foundations의 Overview를 제외한 모든 페이지에 개요 섹션이 있다
- Design Token·Color Role·Palette 페이지가 있고 LNB에서 이동된다
- 토큰 값에 마우스를 올리면 복사 아이콘이 나오고, 누르면 체크로 바뀌며 복사된다
- Typography가 Pretendard로 렌더되고, 폰트 스택을 복사할 수 있다
- 다크 모드와 720px에서 모든 페이지가 읽힌다
- `npm test`와 `npm run build`가 통과한다

## 7. 범위 밖

- 나머지 Foundations 피드백 (사용자가 이후 전달 예정)
- 프리미티브 확장 (Badge · Input · … · Toast)
- 컴포넌트 페이지의 History 섹션
- 알림 벨 UI
- 어드민 패턴
- 빠른 검색(⌘K)
