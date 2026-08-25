# 어드민 디자인 시스템 설계 — Get started (보류)

> **이 설계는 아직 진행하지 않습니다.** 사용자가 다음 단계로 컴포넌트 확장을 선택했습니다.
> 내용은 그대로 두되, 착수할 때 날짜와 버전을 다시 붙입니다.

## 배경

사이트의 첫 화면이 비어 있습니다. `/`가 `<Placeholder title="Get started" />`를 렌더해 "이 문서는 아직 준비 중입니다"를 보여줍니다. 하위 두 문서(`Install`, `Principles`)도 같습니다.

v0.3.0에서 사용자가 `Get started`를 GNB 최상단에 두자고 요청했고 구조는 그때 만들어졌습니다. 그 뒤 세 회차 동안 Foundations를 채우느라 내용은 비어 있었습니다.

지금 상태는 이 프로젝트가 스스로 세운 원칙과 어긋납니다. 다른 문서들이 "문서가 코드에 대해 거짓을 말하지 않는다"를 지키려 여러 번 고쳐졌는데, 정작 방문자가 처음 보는 화면이 준비 중입니다.

이 회차는 그 세 페이지를 채웁니다. 새 기능은 없습니다.

## 원칙

**없는 것을 있다고 적지 않습니다.** Components에는 컴포넌트가 하나뿐이고 Patterns와 Updates는 자리표시자입니다. Get started는 그 사실을 그대로 적습니다.

**숫자와 목록은 파생합니다.** 섹션 목록은 `nav-config`의 `sections`에서, 컴포넌트 수는 `registry`의 `componentStats()`에서 가져옵니다. 손으로 적지 않습니다.

**이미 있는 문서를 다시 쓰지 않습니다.** 각 원칙은 그것을 자세히 다루는 문서를 가리킵니다. Get started는 색인이지 사본이 아닙니다.

---

## 1. Overview (`/`)

사이트의 첫 화면입니다. 처음 온 사람이 여기가 무엇이고 무엇부터 보면 되는지 알 수 있어야 합니다.

### Overview

이곳이 무엇인지 적습니다 — 어드민 화면을 만들 때 쓰는 디자인 시스템이자, 그 시스템이 제대로 서 있는지 눈으로 확인하는 작업대입니다. 제품이 아니라 작업대라는 점을 분명히 합니다.

한 사람이 만들고 한 사람이 씁니다. 그래서 합의를 위한 절차나 기여 안내가 없습니다.

### Sections

GNB의 네 섹션이 각각 무엇을 맡는지 늘어놓습니다. `sections`에서 파생하고, 각 항목에 한 줄 설명을 붙입니다.

준비 중인 섹션은 준비 중이라고 적습니다.

### Reading order

무엇부터 보면 되는지 적습니다. Foundations가 바닥이고 Components가 그 위에 서므로 순서가 있습니다.

### Status

지금까지 무엇이 만들어졌고 무엇이 아직인지 적습니다. 컴포넌트 수는 `componentStats()`에서 파생합니다.

---

## 2. Install (`/get-started/install`)

이 저장소를 내려받아 돌리는 법과, 여기서 정한 토큰을 다른 프로젝트에 가져가는 법을 다룹니다.

### Overview

두 가지 쓰임이 있다고 적습니다 — 작업대를 로컬에서 띄우는 것과, 토큰을 제품에 가져가는 것.

### Run locally

`npm install` · `npm run dev` · `npm run build` · `npm test` 네 명령을 적습니다. 각 명령이 무엇을 하는지 한 줄씩 붙입니다.

명령은 `package.json`의 `scripts`와 어긋나면 안 됩니다.

### Use the tokens

토큰을 다른 프로젝트에서 쓰는 방법을 적습니다.

- `src/styles/tokens.css`가 토큰의 단일 출처입니다
- Tailwind v4의 `@theme`에 얹혀 있으므로 `@import "tailwindcss"` 뒤에 이 파일을 들여옵니다
- 폰트는 Pretendard를 씁니다 — 자세한 스택은 Typography에서 다루므로 여기서는 가리키기만 합니다

### Guidelines

토큰을 가져갈 때 지킬 것을 do/don't로 적습니다. 원시값을 직접 쓰지 않는다, 토큰 이름을 바꾸지 않는다 같은 것들입니다.

---

## 3. Principles (`/get-started/principles`)

이 시스템이 따르는 원칙을 모읍니다. **새로 만드는 원칙이 아니라, 이미 문서 곳곳에서 지키고 있는 것을 한자리에 모아 이름을 붙이는 것입니다.** 각 원칙은 그것을 자세히 다루는 문서를 가리킵니다.

### Overview

원칙이 규칙과 어떻게 다른지 적습니다. 규칙은 각 문서가 자기 자리에서 정하고, 원칙은 규칙들이 왜 그 모양인지를 설명합니다.

### Principles

여섯 가지를 다룹니다. 각각 한 문단과, 그것을 지키는 문서로 가는 링크를 답니다.

| 원칙 | 근거 문서 |
|---|---|
| 역할로 색을 고른다 — 원시값을 직접 쓰지 않는다 | Color Role |
| 밀도를 지킨다 — 어드민은 한 화면에 많은 것을 담는다 | Spacing |
| 한 화면에 주요 동작은 하나다 | Button (Hierarchy) |
| 색만으로 뜻을 전하지 않는다 | State |
| 되돌리기 어려운 동작에는 확인 단계를 둔다 | Button (Destructive actions) |
| 문서가 코드에 대해 사실이 아닌 것을 말하지 않는다 | Writing |

마지막 원칙은 이 작업대 자체의 원칙입니다. 나머지 다섯이 제품 화면에 대한 것이라면 이것은 문서에 대한 것이므로, 그 차이를 적습니다.

### Guidelines

원칙을 쓸 때의 do/don't를 적습니다.

---

## 라우팅

`routes.tsx`에서 세 자리의 `Placeholder`를 실제 컴포넌트로 바꿉니다.

- `{ index: true }` → `GetStartedOverview`
- `get-started/install` → `InstallPage`
- `get-started/principles` → `PrinciplesPage`

`Placeholder`는 `Patterns`·`Updates`·404가 계속 쓰므로 남깁니다.

`nav-config`의 세 항목 `updatedAt`을 갱신합니다.

## 범위 밖

- Patterns · Updates 채우기
- 컴포넌트 추가
- `useMeasuredTokens` 5벌 중복 해소
- 기여 안내 · 라이선스 문서 — 한 사람이 쓰는 작업대라 필요 없습니다

## 전역 제약

v0.6.0의 제약을 그대로 잇습니다.

- 작업 브랜치는 `v0.7.0`. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 이미 영문인 용어는 유지. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않습니다
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다
- 문구는 Writing 규칙을 따릅니다
- 테스트 대상은 순수 로직에 한정합니다
- `tsconfig`에 `baseUrl`을 추가하지 않습니다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사
