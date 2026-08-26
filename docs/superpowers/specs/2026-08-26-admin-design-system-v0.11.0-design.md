# 어드민 디자인 시스템 v0.11.0 설계 — Get started와 Patterns

## 배경

컴포넌트 32개로 다섯 카테고리가 찼습니다. 남은 빈 곳은 둘입니다 — `Get started`와 `Patterns`.

`Updates`는 v0.10.0에서 이미 채웠습니다. `releases.ts`의 기록을 Accordion으로 늘어놓는 `UpdatesPage`가 그 자리에 있습니다. 이번 회차는 남은 둘을 채웁니다.

**`Patterns`는 지금이 만들 수 있는 첫 시점입니다.** 패턴은 여러 컴포넌트를 엮어 화면을 이루는 규칙인데, 엮을 부품이 없으면 만들 수 없습니다. 컴포넌트가 하나였을 때 이 섹션이 비어 있던 것은 게을러서가 아니라 순서 때문이었습니다.

`Get started`는 사이트의 첫 화면인데 세 회차 동안 "이 문서는 아직 준비 중입니다"였습니다. 다른 문서들이 "코드에 대해 거짓을 말하지 않는다"를 지키려 여러 번 고쳐지는 동안 방문자가 처음 보는 화면이 비어 있었습니다.

---

## 1부. Get started

### 1.1 Overview (`/`)

사이트의 첫 화면입니다. 처음 온 사람이 여기가 무엇이고 무엇부터 보면 되는지 알 수 있어야 합니다.

**Overview** — 어드민 화면을 만들 때 쓰는 디자인 시스템이자, 그 시스템이 제대로 서 있는지 눈으로 확인하는 작업대입니다. 제품이 아니라 작업대라는 점을 분명히 합니다. 한 사람이 만들고 한 사람이 쓰므로 기여 안내나 합의 절차가 없습니다.

**Sections** — GNB의 다섯 섹션이 각각 무엇을 맡는지 늘어놓습니다. `nav-config`의 `sections`에서 파생합니다. 섹션마다 몇 개의 문서를 갖는지도 같은 데이터에서 셉니다.

**Reading order** — Foundations가 바닥이고 Components가 그 위에 서고 Patterns가 그것들을 엮으므로 순서가 있습니다.

**Status** — 지금까지 무엇이 만들어졌는지 적습니다. 컴포넌트 수는 `componentStats()`에서, 패턴 수는 패턴 데이터에서 파생합니다.

### 1.2 Install (`/get-started/install`)

**Overview** — 두 가지 쓰임이 있습니다. 작업대를 로컬에서 띄우는 것과, 토큰을 제품에 가져가는 것.

**Run locally** — `npm install` · `npm run dev` · `npm run build` · `npm test`. 각 명령이 무엇을 하는지 한 줄씩 붙입니다. `package.json`의 `scripts`와 어긋나면 안 됩니다.

**Use the tokens** — `src/styles/tokens.css`가 토큰의 단일 출처입니다. Tailwind v4의 `@theme`에 얹혀 있으므로 `@import "tailwindcss"` 뒤에 들여옵니다. 폰트는 Pretendard이고 자세한 스택은 Typography에서 다루므로 가리키기만 합니다.

**Guidelines** — 원시값을 직접 쓰지 않는다 · 토큰 이름을 바꾸지 않는다 · 컨트롤 높이는 `--spacing-control` 계열을 쓴다.

### 1.3 Principles (`/get-started/principles`)

이미 문서 곳곳에서 지키고 있는 것을 한자리에 모아 이름을 붙입니다. **새 원칙을 만들지 않습니다.** 각 원칙은 그것을 자세히 다루는 문서를 가리킵니다.

| 원칙 | 근거 문서 |
|---|---|
| 역할로 색을 고른다 | Color Role |
| 밀도를 지킨다 | Spacing |
| 한 화면에 주요 동작은 하나다 | Button |
| 색만으로 뜻을 전하지 않는다 | State |
| 되돌리기 어려운 동작에는 확인 단계를 둔다 | Dialog |
| 상태는 코드와 문서가 함께 말한다 | Writing |

마지막 원칙은 성격이 다릅니다. 앞의 다섯은 **제품 화면**에 대한 것이고 이것은 **이 작업대 자체**에 대한 것입니다. 그 차이를 문단이 분명히 말합니다 — 이 시스템은 문서가 곧 제품이므로, 문서가 코드에 대해 사실이 아닌 것을 말하면 그것이 곧 결함입니다.

---

## 2부. Patterns

### 2.1 패턴은 컴포넌트와 다릅니다

컴포넌트 문서는 부품 하나를 다룹니다 — 구조·속성·상태. 패턴 문서는 **여러 부품이 모여 이루는 화면의 규칙**을 다룹니다. 축도 상태도 없습니다.

그래서 문서의 뼈대가 다릅니다.

| 컴포넌트 문서 | 패턴 문서 |
|---|---|
| Anatomy | Structure — 어떤 컴포넌트가 어떤 자리에 오는가 |
| Playground | (없음) |
| Properties | (없음) |
| Guidelines | Guidelines |
| Usage | Example — 화면 하나를 통째로 |
| Cases | Cases |

`ComponentPage`를 재사용하지 않고 `PatternPage`를 새로 만듭니다. 축이 없는 것에 축을 위한 자리를 두면 빈 절이 생기고, 그건 v0.8.0에서 이미 없앤 결함입니다.

데이터도 `registry.ts`가 아니라 `src/data/patterns.ts`에 둡니다. 모양이 다른 것을 같은 타입에 욱여넣지 않습니다.

### 2.2 다루는 패턴

다섯 개입니다. 어드민 화면의 대부분이 이 다섯의 조합입니다.

#### List (`/patterns/list`)

목록 화면. 어드민에서 가장 많이 보는 화면입니다.

**Structure** — Breadcrumb · 제목 · 주요 동작 · 필터 줄(Input · Select) · Table(Checkbox 선택 · Badge 상태 · Avatar 담당자) · 대량 작업 줄 · Pagination

**Guidelines** — 필터는 표 위에 두고 결과 수를 함께 보인다 · 선택이 있으면 대량 작업 줄이 그 자리에 나타난다 · 주요 동작은 제목 줄 오른쪽에 하나만 둔다

**Cases** — 결과 없음 · 필터 결과 없음 · 불러오는 중 · 선택 상태에서 페이지 이동 · 좁은 화면

#### Detail (`/patterns/detail`)

상세 화면. 목록에서 항목 하나로 들어간 뒤의 화면입니다.

**Structure** — Breadcrumb · 제목과 Badge · 동작(Button · Dropdown Menu) · Tabs · 각 탭의 내용

**Guidelines** — 어디서 왔는지 Breadcrumb으로 보인다 · 위험한 동작은 Dropdown Menu 안쪽에 둔다 · 탭을 바꿔도 제목과 동작은 남는다

**Cases** — 제목이 긴 경우 · 탭이 많은 경우 · 권한이 없어 일부 탭이 잠긴 경우 · 좁은 화면

#### Form (`/patterns/form`)

입력 화면. 라벨·도움말·오류의 배치를 정합니다.

**Structure** — Field(라벨 · 컨트롤 · 도움말 · 오류) · 입력(Input · Select · Textarea · Checkbox · Radio · Switch) · 저장과 취소

라벨·도움말·오류를 컨트롤에 잇는 일은 v0.10.0에서 들어온 `Field`가 맡습니다. `htmlFor`와 `aria-describedby`를 손으로 맞추지 않습니다.

**Guidelines** — 라벨은 입력 위에 둔다 · 도움말은 입력 전에, 오류는 입력 후에 보인다 · 저장은 오른쪽, 취소는 왼쪽 · 즉시 반영되는 것에는 Switch를, 저장이 필요한 것에는 Checkbox를 쓴다

**Cases** — 오류가 여럿인 경우 · 저장 중 · 나가려 할 때 저장하지 않은 변경이 있는 경우 · 좁은 화면

#### Empty and error (`/patterns/empty-and-error`)

비어 있을 때와 실패했을 때. 어드민에서 자주 나오는데 자주 빠뜨리는 자리입니다.

**Structure** — 아이콘이나 삽화 · 무슨 일인지 · 무엇을 할 수 있는지 · 동작

**Guidelines** — 빈 것과 실패한 것을 구별한다 · 사용자가 할 수 있는 일이 있으면 동작을 둔다 · 첫 방문의 빈 상태는 안내이지 오류가 아니다

**Cases** — 아직 아무것도 없음 · 검색 결과 없음 · 권한 없음 · 불러오기 실패

#### Destructive confirm (`/patterns/destructive-confirm`)

되돌릴 수 없는 동작. Dialog와 Toast가 함께 쓰이는 자리입니다.

**Structure** — 위험 동작 Button · Dialog(제목에 대상 · 본문에 영향 범위 · 취소와 실행) · 실행 뒤 Toast

**Guidelines** — 제목에 무엇이 지워지는지 적는다 · 영향 범위가 넓으면 개수를 보인다 · 되돌릴 수 있으면 Toast에 되돌리기를 둔다 · 되돌릴 수 없으면 그 사실을 본문에 적는다

**Cases** — 하나 삭제 · 여럿 삭제 · 되돌릴 수 없는 삭제 · 실행 실패

### 2.3 Patterns Overview (`/patterns`)

다른 섹션의 Overview와 같은 형태입니다 — 이 섹션이 무엇을 다루고, 어떤 순서로 읽고, 무엇을 다루지 않는지. 그리고 패턴 목록 카드.

패턴 목록은 `patterns.ts`에서 파생합니다.

### 2.4 예시는 실물이어야 합니다

컴포넌트 문서에 걸린 규칙이 여기도 걸립니다 — **목업을 그리지 않습니다.** 각 패턴의 `Example`은 실제 컴포넌트로 만든 화면 한 조각입니다.

패턴은 화면 단위라 예시가 큽니다. 그래도 그리는 게 아니라 조립합니다. 토큰이 바뀌면 예시도 따라 바뀌어야 문서가 실제와 어긋나지 않습니다.

조립에 쓸 수 있는 것은 등록된 32개 전부입니다. v0.10.0에서 들어온 `Field` · `Popover` · `Slider` · `Combobox` · `Date Picker` · `File Upload`도 포함합니다.

---

## 라우팅

`routes.tsx`의 자리표시자를 실제 컴포넌트로 바꿉니다.

- `{ index: true }` → `GetStartedOverview`
- `get-started/install` → `InstallPage`
- `get-started/principles` → `PrinciplesPage`
- `patterns` → `PatternsOverview`
- `patterns/list` 외 넷 → 각 패턴 페이지

`Placeholder`는 404와 각 컴포넌트 문서의 "메타를 찾을 수 없습니다" 대비가 계속 쓰므로 남깁니다.

`nav-config`의 Patterns 섹션에 다섯 문서를 더합니다.

## 범위 밖

- 접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림) — 별도 회차
- 새 컴포넌트 — 이번 회차는 이미 있는 32개를 엮기만 합니다
- `useMeasuredTokens` 5벌 중복 해소

## 전역 제약

v0.10.0의 제약을 그대로 잇습니다.

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
