# 어드민 디자인 시스템 v0.9.0 설계 — 화면의 구조와 상태

## 배경

컴포넌트 열여덟 개로 다섯 카테고리가 모두 열렸습니다. 그런데 채워진 것은 **낱개의 컨트롤**입니다 — 누르는 것, 고르는 것, 적는 것.

어드민 화면을 실제로 그려 보면 그 사이를 잇는 것이 없습니다. 구획을 나눌 것이 없고, 불러오는 중을 보일 것이 없고, 아무것도 없을 때 보일 것이 없습니다. `Patterns`가 필요로 하는 부품이 바로 그것들입니다 — 목록 화면의 빈 상태, 상세 화면의 키와 값, 폼의 단계.

이번 회차는 그 여덟 개를 더합니다. 다음 회차(v0.10.0)가 폼 심화 여섯 개를 더하고, 그 뒤에야 `Get started`와 `Patterns`를 씁니다.

## 이번 회차의 여덟 개

| 컴포넌트 | 카테고리 | 의존성 |
|---|---|---|
| `Card` | Data Display | 없음 |
| `Separator` | Data Display | 없음 |
| `Description List` | Data Display | 없음 |
| `Accordion` | Data Display | `@radix-ui/react-accordion` |
| `Skeleton` | Feedback | 없음 |
| `Progress` | Feedback | `@radix-ui/react-progress` |
| `Empty State` | Feedback | 없음 |
| `Steps` | Navigation | 없음 |

`Separator`는 Radix에도 있지만 쓰지 않습니다. 이 컴포넌트가 하는 일은 방향에 따라 선을 긋고, 장식이면 접근성 트리에서 빼는 것 — 두 줄입니다. 의존성 하나를 두 줄과 바꾸지 않습니다. 반대로 `Accordion`은 열고 닫는 상태·키보드 이동·`aria-expanded` 연결을 Radix가 맡으므로 씁니다.

---

## 1. `Card`

### 컴포넌트

`src/components/ui/card.tsx`. shadcn 구성(`Card` · `CardHeader` · `CardTitle` · `CardDescription` · `CardAction` · `CardContent` · `CardFooter`)을 따릅니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `outlined` · `elevated` |
| `padding` | `default` · `none` |

`outlined`가 기본입니다. 어드민 화면은 카드가 여럿 나란히 놓이는 일이 많고, 그림자가 여럿이면 화면이 들뜹니다. `elevated`는 배경 위에 떠 있어야 하는 하나짜리 카드에 씁니다.

`padding`의 `none`은 카드가 표를 통째로 담을 때입니다. 표에는 자기 여백이 있어 카드 여백이 겹치면 두 겹이 됩니다.

`layout`은 축으로 두지 않습니다. 머리·바닥이 있고 없고는 어떤 하위 컴포넌트를 넣었는지의 결과이지 카드가 고르는 값이 아닙니다. 구조도가 그것을 보입니다.

### 구조 (Anatomy)

Container · Header(선택) · Title · Description(선택) · Action(선택) · Content · Footer(선택)

### 지침

- **카드를 카드 안에 넣지 않는다** — 테두리가 겹치면 위계가 아니라 잡음이 됩니다. 안쪽 구획은 `Separator`로 나눕니다
- **카드 전체를 링크로 만들지 않는다** — 카드 안에 누를 수 있는 것이 둘 이상이면 어디를 눌러야 하는지 흐려집니다. 제목만 링크로 둡니다
- **표를 담을 때는 여백을 없앤다** — `padding`을 `none`으로 두고 표의 여백을 씁니다

### 사용 예 (Usage)

대시보드의 지표 · 상세 화면의 구획 · 설정 묶음 · 표를 담는 틀

### 예외 상황 (Cases)

제목만 있고 내용이 없는 경우 · 내용이 아주 긴 경우 · 카드가 나란히 놓여 높이가 다른 경우 · 좁은 화면

---

## 2. `Separator`

### 컴포넌트

`src/components/ui/separator.tsx`. Radix를 쓰지 않고 직접 씁니다.

`decorative`가 참이면 `role="none"`, 거짓이면 `role="separator"`와 `aria-orientation`을 답니다. 기본은 참입니다 — 구분선 대부분은 눈으로만 나누는 장식이고, 뜻이 있는 경계는 드뭅니다.

### 축

| 축 | 값 |
|---|---|
| `orientation` | `horizontal` · `vertical` |

`decorative`는 축으로 두지 않습니다. 두 값이 화면에서 완전히 같은 모습이라 격자에 나란히 놓으면 같은 것이 둘 있는 것으로 보입니다. 지침이 그 구별을 다룹니다.

### 구조 (Anatomy)

두지 않습니다. 부위가 하나뿐인 것에 지시선을 그리면 구조를 설명하는 것이 아니라 화살표만 남습니다. `anatomy`를 빈 배열로 두면 `ComponentPage`가 절 자체를 그리지 않습니다.

### 지침

- **뜻이 있는 경계와 장식을 구별한다** — 메뉴에서 성격이 다른 묶음을 가르는 선은 뜻이 있고, 카드 안 구획을 나누는 선은 장식입니다. 스크린 리더가 읽어야 하는 것은 앞의 것뿐입니다
- **여백으로 충분하면 선을 긋지 않는다** — 간격이 이미 묶음을 말하고 있으면 선은 잡음입니다
- **목록의 모든 항목 사이에 긋지 않는다** — 선이 많아지면 각각의 뜻이 사라집니다

### 사용 예 (Usage)

카드 안의 구획 · 메뉴 항목 묶음 사이 · 툴바의 동작 묶음 사이 · 폼의 구획

### 예외 상황 (Cases)

세로 구분선의 높이 · 여백만으로 충분한 경우 · 양옆 여백이 다른 경우

---

## 3. `Description List`

### 컴포넌트

`src/components/ui/description-list.tsx`. `<dl>` · `<dt>` · `<dd>`를 씁니다 — 키와 값이라는 뜻이 마크업에 이미 있습니다.

구성은 `DescriptionList` · `DescriptionItem` · `DescriptionTerm` · `DescriptionDetail`입니다.

### 축

| 축 | 값 |
|---|---|
| `layout` | `stacked` · `horizontal` |
| `columns` | `one` · `two` · `three` |

`stacked`는 라벨이 위, 값이 아래입니다. 값이 길거나 폭이 좁을 때 씁니다. `horizontal`은 라벨이 왼쪽 고정 폭, 값이 오른쪽입니다. 값이 짧을 때 훑어보기 좋습니다.

`density`는 두지 않습니다. 조밀함은 `Foundations`의 `Spacing`이 정하는 것이고, 컴포넌트마다 다시 정하면 그 문서가 힘을 잃습니다.

### 구조 (Anatomy)

Container · Item · Term · Detail

### 지침

- **라벨을 짧게 적는다** — 라벨이 값보다 길면 훑어보는 눈이 값을 찾지 못합니다
- **값이 없으면 자리를 비우지 않는다** — 항목을 지우거나 `—`를 넣습니다. 빈칸은 불러오는 중인지 값이 없는 것인지 알려주지 않습니다
- **순서에 뜻을 담는다** — 자주 보는 것을 위에 둡니다. 데이터베이스의 열 순서를 그대로 옮기지 않습니다

### 사용 예 (Usage)

상세 화면의 기본 정보 · Dialog 안의 확인 정보 · 카드 안 요약 · 표의 펼친 행

### 예외 상황 (Cases)

값이 아주 긴 경우 · 값이 없는 경우 · 값이 `Badge`인 경우 · 좁은 화면

---

## 4. `Accordion`

### 컴포넌트

`src/components/ui/accordion.tsx`. Radix의 `Accordion`을 감쌉니다. 구성은 `Accordion` · `AccordionItem` · `AccordionTrigger` · `AccordionContent`입니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `bordered` · `plain` |
| `state` | `collapsed` · `expanded` · `disabled` · `focus` |

`type`(`single`·`multiple`)은 축으로 두지 않습니다. 두 값이 쉬고 있는 모습에서 완전히 같습니다 — 차이는 두 번째 항목을 눌렀을 때에만 나타납니다. 격자의 칸에 정직하게 담기지 않으므로 지침이 다룹니다.

`expanded`는 `defaultValue`로 보입니다. Accordion은 포털을 쓰지 않고 페이지를 잠그지 않으므로 열린 채로 놓아도 안전합니다.

### 구조 (Anatomy)

Container · Item · Trigger · Content

화살표는 부위로 두지 않습니다. `AccordionTrigger` 안쪽에서 그려지므로 밖에서 표를 붙일 수 없고, 붙이려면 제품 컴포넌트가 문서 시스템을 알아야 합니다 — `Select`의 화살표와 같은 처리입니다. Trigger의 설명이 화살표를 함께 다룹니다.

### 지침

- **한 번에 하나만 열지 여럿 열지 미리 정한다** — 항목끼리 비교해야 하면 여럿, 한 줄기로 읽어야 하면 하나입니다
- **중요한 내용을 접어 두지 않는다** — 접힌 것은 없는 것과 같습니다. 반드시 봐야 하는 내용은 펼쳐 둡니다
- **접었다 펴는 것으로 화면 길이를 숨기지 않는다** — 내용이 너무 많으면 접을 것이 아니라 나눌 곳입니다

### 사용 예 (Usage)

설정의 고급 항목 · 필터 묶음 · 긴 폼의 구획 · 자주 묻는 질문

### 예외 상황 (Cases)

항목이 하나뿐인 경우 · 제목이 긴 경우 · 내용이 아주 긴 경우 · 모두 펼친 경우

---

## 5. `Skeleton`

### 컴포넌트

`src/components/ui/skeleton.tsx`. 상자 하나에 `animate-pulse`와 `bg-muted`를 씁니다.

`aria-hidden`을 답니다. 뼈대는 눈으로 보는 자리 표시일 뿐이고, 스크린 리더에는 불러오는 중이라는 사실을 `role="status"`를 가진 문구가 따로 알립니다.

### 축

| 축 | 값 |
|---|---|
| `shape` | `text` · `title` · `block` · `circle` |

### 구조 (Anatomy)

두지 않습니다. 도형 하나입니다.

### 지침

- **실제 내용의 모양을 닮게 만든다** — 뼈대가 실제와 다르면 내용이 도착하는 순간 화면이 튑니다. 줄 수와 폭을 맞춥니다
- **짧게 끝나는 것에는 쓰지 않는다** — 곧 사라질 뼈대는 깜빡임으로만 보입니다
- **뼈대와 스피너를 한 화면에 섞지 않는다** — 무엇을 기다리는지 두 가지로 말하면 둘 다 흐려집니다
- **스크린 리더에는 문구로 알린다** — 뼈대 자체는 `aria-hidden`이고, 상태는 문구가 전합니다

### 사용 예 (Usage)

표의 행 · 카드 목록 · 상세 화면의 기본 정보 · 아바타와 이름

### 예외 상황 (Cases)

실제 내용보다 짧거나 긴 경우 · 일부만 도착한 경우 · 반복 횟수를 정하는 경우 · 다크 테마

---

## 6. `Progress`

### 컴포넌트

`src/components/ui/progress.tsx`. Radix의 `Progress`를 감쌉니다 — `role="progressbar"`와 `aria-valuenow`를 맡깁니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `default` · `success` · `warning` · `destructive` |
| `size` | `sm` · `default` |
| `state` | `determinate` · `indeterminate` |

`indeterminate`는 `value`를 주지 않은 상태입니다. Radix가 `data-state="indeterminate"`를 달아 주므로 그 표시로 움직이는 막대를 그립니다.

### 구조 (Anatomy)

Track · Indicator · Label(선택) · Value(선택)

### 지침

- **끝을 알 수 있으면 값을 준다** — 남은 양을 아는데도 `indeterminate`로 두면 기다리는 사람이 얼마나 남았는지 짐작할 수 없습니다
- **숫자를 함께 보인다** — 막대 길이만으로는 87%인지 92%인지 읽히지 않습니다
- **색만으로 실패를 알리지 않는다** — 빨간 막대 옆에 무엇이 실패했는지 문구를 답니다
- **되돌아가지 않는다** — 값이 줄어들면 진행이 아니라 오작동으로 읽힙니다. 다시 시작한다면 0부터 새로 그립니다

### 사용 예 (Usage)

파일 업로드 · 대량 작업 진행 · 한도 대비 사용량 · 여러 단계의 진척

### 예외 상황 (Cases)

0%와 100% · 값을 알 수 없는 경우 · 실패한 경우 · 아주 좁은 폭

---

## 7. `Empty State`

### 컴포넌트

`src/components/ui/empty-state.tsx`. 구성은 `EmptyState` · `EmptyStateIcon` · `EmptyStateTitle` · `EmptyStateDescription` · `EmptyStateAction`입니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `empty` · `no-results` · `error` · `no-permission` |
| `size` | `default` · `compact` |

`compact`는 표 안이나 카드 안처럼 자리가 좁은 곳입니다. 아이콘이 작아지고 위아래 여백이 줄어듭니다.

### 구조 (Anatomy)

Container · Icon · Title · Description · Action(선택)

### 지침

- **비어 있는 것과 실패한 것을 구별한다** — 아직 만든 것이 없는 것과 불러오지 못한 것은 사용자가 할 일이 다릅니다
- **할 수 있는 일이 있으면 동작을 둔다** — 필터를 지우거나, 새로 만들거나, 다시 시도하는 것. 없다면 두지 않습니다
- **첫 방문의 빈 상태는 안내이지 오류가 아니다** — 경고 색을 쓰지 않고 무엇을 할 수 있는지 알립니다
- **무엇이 · 왜 · 무엇을 할 수 있는지 순서로 적는다** — `Foundations`의 `Writing`이 정한 순서입니다

### 사용 예 (Usage)

표에 행이 없을 때 · 검색 결과가 없을 때 · 권한이 없을 때 · 불러오기에 실패했을 때

### 예외 상황 (Cases)

동작이 없는 경우 · 표 안에 놓이는 경우 · 동작이 둘인 경우 · 좁은 화면

---

## 8. `Steps`

### 컴포넌트

`src/components/ui/steps.tsx`. 구성은 `Steps` · `Step` · `StepIndicator` · `StepLabel` · `StepDescription`입니다. `<ol>`을 씁니다 — 순서가 있다는 뜻이 마크업에 이미 있습니다.

현재 단계에는 `aria-current="step"`을 답니다.

### 축

| 축 | 값 |
|---|---|
| `orientation` | `horizontal` · `vertical` |
| `state` | `pending` · `current` · `complete` · `error` |
| `layout` | `label` · `with-description` |

`state`는 단계 하나의 상태입니다. 격자의 칸마다 그 상태인 단계 하나를 보입니다.

### 구조 (Anatomy)

Container · Step · Indicator · Label · Description(선택) · Connector

### 지침

- **현재 단계를 색과 모양 둘로 알린다** — 색만 다르면 색을 구별하지 못하는 사람에게는 어디까지 왔는지 보이지 않습니다. 끝난 단계는 체크 표시로, 지금 단계는 채운 원으로 갈라 보입니다
- **되돌아갈 수 있는 단계만 누를 수 있게 한다** — 아직 지나지 않은 단계를 누를 수 있게 두면 건너뛸 수 있다고 오해합니다
- **단계를 셋에서 다섯 사이로 둔다** — 둘이면 나눌 이유가 없고, 여섯을 넘으면 어디까지 왔는지 세어야 합니다
- **진행률 막대와 함께 쓰지 않는다** — 같은 것을 두 번 말합니다

### 사용 예 (Usage)

여러 단계 폼 · 승인 흐름의 현재 위치 · 처리 단계 표시 · 설치 안내

### 예외 상황 (Cases)

단계가 많은 경우 · 단계 이름이 긴 경우 · 실패한 단계 · 좁은 화면

---

## 문서에 반영되는 것

`registry.ts`에 여덟 `ComponentMeta`를 더합니다. `addedIn`과 `changedIn`은 `v0.9.0`, `status`는 `stable`, `verified`는 `false`로 두었다가 브라우저로 확인한 뒤 올립니다.

`ComponentsIndex`가 `components`에서 파생하므로 카테고리 구역과 개수는 저절로 따라옵니다.

`nav-config`의 Components 섹션에 여덟 문서를 더합니다. 자리는 카테고리 순서를 따라 — `Steps`는 `Pagination` 뒤, `Skeleton` · `Progress` · `Empty State`는 `Dialog` 뒤, `Card` · `Separator` · `Description List` · `Accordion`은 `Avatar` 뒤입니다.

`releases.ts`에 `v0.9.0` 항목을 더합니다. v0.7.0에서 멈춰 있던 것을 이번에 v0.8.0과 함께 잇습니다.

## 범위 밖

- `Popover` · `Field` · `Slider` · `Combobox` · `Date Picker` · `File Upload` — v0.10.0
- `Get started` · `Patterns` 채우기 — v0.11.0
- 접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림) — 별도 회차
- `useMeasuredTokens` 5벌 중복 해소

## 전역 제약

v0.8.0의 제약을 그대로 잇습니다.

- 작업 브랜치는 `v0.9.0`. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않습니다
- 전시 컴포넌트(`components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다
- 제품 컴포넌트(`components/ui/*`)는 문서 시스템의 표시를 알지 않습니다
- **17px 이하 글자는 4.5:1을 넘어야 합니다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1
- **모달을 열린 채로 마운트하지 않습니다**
- 문구는 Writing 규칙을 따릅니다
- **테스트 대상은 순수 함수입니다.** 어느 디렉터리에 있는지가 아니라 부수 효과가 없고 반환값으로만 판정되는지로 정합니다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사
