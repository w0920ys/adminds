# 어드민 디자인 시스템 워크벤치 v0.5.0 설계

작성일: 2026-08-25
선행: v0.4.0 (지시선 개선 · 예시 화면 · Design Token · Color Role · Palette · Typography)

## 1. 이번 버전이 하는 일

읽는 경험을 손봅니다. 문서가 늘어나면서 드러난 것들입니다.

1. **용어가 한글과 영어로 섞여 있다** — 한 페이지 안에서 `개요`와 `ANATOMY`가 나란히 나온다
2. **섹션 제목이 본문보다 작다** — `text-2xs`(11px) 대문자 라벨이라 위계가 뒤집혀 있다
3. **긴 문서에서 현재 위치를 알 수 없다** — 목차가 없다
4. **지침의 do와 don't가 별개 가이드처럼 보인다** — 각각 카드로 나뉘어 있다
5. **Color Role과 Palette가 Color와 같은 층에 있다** — 실제로는 Color의 하위 문서다

## 2. 확정된 결정

### 2.1 언어 — 한글로 통일

**문서의 구조와 설명은 한국어로 씁니다.** 근거는 셋입니다.

- 본문이 전부 한국어다
- Foundations 8개 페이지가 이미 한글 섹션 제목을 쓰고 있어 다수다
- 참고로 삼은 seed-design의 목차가 전부 한글이다

**두 가지는 영어로 남깁니다.**

| 남기는 것 | 예 | 이유 |
|---|---|---|
| 페이지 이름 | `Button`, `Color`, `Design Token` | LNB·GNB·URL과 한 벌로 움직인다 |
| 코드 식별자 | `variant`, `--color-primary`, `text-2xs` | 코드와 1:1로 대응해야 찾을 수 있다 |

바꾸는 섹션 제목:

| 지금 | 바꿀 것 |
|---|---|
| ANATOMY | 구조 |
| PLAYGROUND | 조합해보기 |
| PROPERTIES | 속성 |
| GUIDELINES | 지침 |
| USAGE | 사용 예 |
| CASES | 예외 상황 |

**이 규칙을 Writing 문서에 명문화합니다.** 다음에 문서를 쓸 때 다시 고민하지 않기 위함입니다.

### 2.2 제목 위계

지금 `DocSection`의 `h2`가 `text-2xs font-bold tracking-widest` 대문자입니다. 11px이라 본문(14px)보다 작아 위계가 뒤집혀 있습니다.

| 층 | 지금 | 바꿀 것 |
|---|---|---|
| 페이지 제목 (`h1`) | `text-2xl` | `text-3xl` |
| 페이지 설명 | `text-sm` | `text-base` |
| 섹션 제목 (`h2`) | `text-2xs` 대문자 | `text-xl font-semibold` |
| 하위 제목 (`h3`) | `text-sm font-semibold` | `text-base font-semibold` |

대문자 변환(`toUpperCase()`)을 없앱니다 — 한글에는 대문자가 없어 영어 제목에만 걸리던 처리이고, 한글로 통일하면 의미가 없습니다.

### 2.3 목차 (PC 전용)

콘텐츠 오른쪽에 sticky 목차를 둡니다. 현재 읽고 있는 위치를 강조합니다.

- `h2`는 첫 단계, `h3`는 들여쓴 둘째 단계
- 좁은 화면에서는 숨깁니다 — 자리가 없습니다
- **목차는 DOM을 훑어 만듭니다.** 각 전시 컴포넌트가 목차용 데이터를 따로 내보내게 하면, 컴포넌트를 추가할 때마다 목차 배선을 함께 해야 합니다. 이미 렌더된 제목을 읽는 편이 한 곳에 갇히고 빠뜨릴 일이 없습니다
- id가 없는 제목에는 목차가 id를 부여합니다. 각 컴포넌트가 id를 관리하지 않아도 됩니다
- 현재 위치 강조는 `IntersectionObserver`로 합니다

### 2.4 지침의 do/don't 그룹화

지금은 예시 프레임 두 개가 한 줄, 그 아래 `DoDont`가 또 두 카드로 나와 **네 덩어리**입니다. 하나의 지침이 네 조각으로 흩어져 별개 가이드처럼 읽힙니다.

**한 열이 하나의 입장**이 되게 바꿉니다.

```
┌─ Hierarchy ─────────────────────────────────┐
│ 설명 문단                                     │
│ ┌── DO ──────────┐  ┌── DON'T ────────────┐ │
│ │ [예시 화면]      │  │ [예시 화면]          │ │
│ │ · 규칙 1         │  │ · 규칙 1             │ │
│ │ · 규칙 2         │  │ · 규칙 2             │ │
│ └────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────┘
```

같은 줄의 두 열은 높이를 맞춥니다. 예시 화면 영역도 서로 같은 높이여야 합니다 — 한쪽 예시가 길면 다른 쪽이 위로 붙어 비교가 어긋납니다.

`DoDont` 컴포넌트는 Foundations 페이지들이 계속 쓰므로 남깁니다. `GuidelineBlock`이 그것을 쓰지 않게 될 뿐입니다.

### 2.5 Color 하위 문서

LNB에서 Color Role과 Palette를 Color 아래로 들여씁니다. 실제로 Color의 하위 문서이고, `ColorPage`의 개요가 이미 두 문서를 자기 하위로 설명하고 있습니다.

`DocLink`에 `children`을 더합니다. 순서가 필요한 곳(`docOrder`, 이전/다음)에서는 부모 → 자식 순으로 평탄화합니다. 라우트 경로는 그대로입니다 — 중첩은 표시와 순서의 문제이지 주소의 문제가 아닙니다.

## 3. 파일 구조 변경

### 신규

| 파일 | 책임 |
|---|---|
| `src/components/layout/TableOfContents.tsx` | 제목을 훑어 목차를 만들고 현재 위치를 강조 |

### 수정

| 파일 | 변경 |
|---|---|
| `src/components/docs/DocPage.tsx` | 제목 크기 위계, 대문자 변환 제거 |
| `src/components/docs/ComponentPage.tsx` | 섹션 제목 한글화 |
| `src/components/docs/GuidelineBlock.tsx` | do/don't를 열 단위로 묶고 높이 균일 |
| `src/components/docs/PropertyBlock.tsx` | 하위 제목 크기 |
| `src/components/layout/nav-config.ts` | `DocLink.children`, 평탄화 |
| `src/components/layout/Lnb.tsx` | 중첩 렌더링 |
| `src/components/layout/AppShell.tsx` | 목차 배치 |
| `src/routes/foundations/WritingPage.tsx` | 언어 규칙 명문화 |
| `src/routes/foundations/*.tsx` | 남은 영어 섹션 제목 정리 |

## 4. 완료 기준

- 섹션 제목이 전부 한국어다. 페이지 이름과 코드 식별자만 영어로 남는다
- Writing 문서에 언어 규칙이 적혀 있다
- 섹션 제목이 본문보다 크다. 제목 층이 크기로 구분된다
- PC에서 오른쪽에 목차가 보이고, 스크롤하면 현재 위치가 따라 강조된다
- 좁은 화면에서는 목차가 숨는다
- 지침의 do와 don't가 각각 하나의 열로 묶이고, 같은 줄의 두 열 높이가 같다
- LNB에서 Color Role과 Palette가 Color 아래 들여쓰기로 보인다
- 이전/다음 이동 순서가 Color → Color Role → Palette → Typography다
- `npm test`와 `npm run build`가 통과한다

## 5. 범위 밖

- 나머지 Foundations 피드백 (사용자가 이후 전달 예정)
- 프리미티브 확장, History 섹션, 알림 벨, Updates 실제 Changelog, 어드민 패턴, ⌘K 검색
- `useMeasuredTokens` 5벌 중복 해소 — v0.4.0 최종 리뷰가 다음 작업의 첫 단계로 지목했으나, 이번 피드백과 겹치지 않아 미룬다
