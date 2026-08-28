# 어드민 디자인 시스템 v0.13.0 설계 — 표가 약속한 것을 지킨다

## 배경

v0.12.0으로 컴포넌트가 38개가 됐습니다. 덮는 것, 묻는 것, 접는 것, 굴리는 것, 쳐서 찾는 것이 모두 생겼습니다.

남은 것을 로드맵은 넷으로 적어 두었습니다 — `Data Table` · `Context Menu` · `Menubar` · `Resizable`. 이번 회차는 그중 **`Data Table` 하나만** 봅니다. 나머지 셋은 v0.14.0으로 미룹니다. 무게가 다르기 때문입니다: 셋은 Radix 원시를 감싸는 일이고, `Data Table`은 이 시스템에서 **어드민의 중심 화면**입니다.

그리고 이번 회차는 새 기능을 더하는 일이라기보다, **`Table`이 이미 화면에서 약속해 놓고 안 지킨 것을 지키는 일**입니다.

### 지금 `Table`이 하는 거짓말

`src/data/registry.ts`의 `table` 항목은 `sort-indicator`를 구조(anatomy)의 한 부위로 두고 이렇게 적습니다.

> 정렬 가능한 열 이름 옆의 방향 아이콘. 누르면 정렬 방향이 바뀐다

같은 항목의 `purpose`는 이렇게 적습니다.

> 여러 행의 데이터를 칸으로 나누어 보이고, **고르거나 정렬하게 한다**

실제로 있는 것은 다릅니다.

- `src/components/ui/table.tsx`는 141줄이고, `TableHead`가 받는 prop은 `numeric`과 `sticky` 둘뿐입니다. 정렬과 관련된 prop이 없습니다.
- `src/routes/components/TablePage.tsx`의 Anatomy 무대가 그리는 `sort-indicator`는 `data-anatomy` 속성이 붙은 맨 `<ChevronDown size={12} aria-hidden />`입니다. 버튼이 아니고, 누를 수 없고, 눌러도 아무 일도 일어나지 않습니다.
- `aria-sort`는 이 저장소 어디에도 없습니다.
- 선택도 마찬가지입니다. `TableRow`는 `selected` prop으로 **보이기만** 하고, 무엇이 골라졌는지 세는 코드는 없습니다.

**코드나 데이터에 대해 사실이 아닌 것을 화면 문구에 쓰지 않는다** — 이 저장소가 모든 회차에서 가장 자주 낸 결함이고, 지금 `Table` 문서에 살아 있는 것이 정확히 그것입니다. 이번 회차는 문장을 지우는 쪽이 아니라 **코드가 그 문장을 참으로 만드는 쪽**으로 갚습니다.

38개가 39개가 됩니다.

---

## 이번 회차가 내리는 네 판단

### 판단 1. `Table`은 원시로 두고 `Data Table`을 그 위에 올립니다

`Table`에 `columns`와 `data`를 달아 한 컴포넌트로 만들지 않습니다.

표 하나를 손으로 그리려는 사람이 있습니다. 이 저장소 안에도 아홉 자리가 있습니다 — `TablePage` · `CardPage` · `CollapsiblePage` · `DescriptionListPage` · `EmptyStatePage` · `ScrollAreaPage` · `SkeletonPage` · `DetailPatternPage` · `ListPatternPage`가 `TableRow`와 `TableCell`을 직접 씁니다. `Table`이 `columns`를 요구하기 시작하면 그 자리들이 전부 자료 배열을 지어내야 합니다.

그리고 `Table`은 이미 배포되고 있습니다. `public/r/table.json`을 받아 간 쪽에 정렬 상태와 선택 상태가 딸려 가는 것은 받는 쪽이 요청한 것이 아닙니다.

그래서 **`Table`은 순수하게 보여주는 원시**로 남고, `DataTable`은 그것을 조립하는 별도 파일(`src/components/ui/data-table.tsx`)이 됩니다. shadcn도 Table(원시)과 DataTable(조립)을 나눠 두었고, 나눈 이유가 같습니다.

### 판단 2. 로직은 전부 `src/lib/data-table.ts`의 순수 함수로 뺍니다

이 저장소의 Vitest는 **`node` 환경에서 돕니다. jsdom이 없습니다.** 컴포넌트를 렌더링해서 검사할 길이 없습니다.

그러므로 정렬·페이지 나눔·선택 세기를 컴포넌트 안의 `useState` 사이에 두면 **테스트가 닿지 못합니다.** 그 자리는 이 회차에서 가장 틀리기 쉬운 자리이기도 합니다 — 페이지를 넘나드는 선택, 부분 선택의 중간 상태, 값이 없는 칸의 정렬 순서는 모두 눈으로 보아서는 틀린 줄 모르는 종류입니다.

선례가 둘 있습니다. `src/lib/filter-options.ts`는 `Combobox`가 쓰는 거르기를 순수 함수로 빼 두었고, `src/lib/command-filter.ts`는 `Command`가 쓰는 거르기와 묶기를 그렇게 두었습니다. v0.12.0에서 `Command`의 키보드 이동 버그가 잡힌 것도 로직이 그 파일에 있어서였습니다 — 화면 없이 재현하고 테스트를 먼저 쓸 수 있었습니다.

`src/lib/data-table.ts`가 내보내는 것:

| 함수 | 하는 일 |
|---|---|
| `sortRows` | 행 배열과 정렬 상태를 받아 정렬된 **새 배열**을 돌려준다. 입력을 바꾸지 않는다 |
| `nextSortState` | 열을 눌렀을 때 다음 정렬 상태를 돌려준다 (없음 → 오름 → 내림 → 없음) |
| `paginate` | 행 배열·페이지·쪽당 개수를 받아 그 페이지의 행과 전체 페이지 수를 돌려준다 |
| `toggleRow` | 선택 집합에서 행 id 하나를 넣거나 뺀다 |
| `toggleAllOnPage` | 지금 페이지의 행 전부를 넣거나 뺀다 |
| `pageSelectionState` | 지금 페이지가 `'none'`·`'some'`·`'all'` 중 무엇인지 돌려준다 |

### 판단 3. `cell`과 `sortValue`를 나눕니다

열 정의는 이렇습니다.

```ts
type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number | null
  numeric?: boolean
  sticky?: boolean
}
```

`cell`은 `React.ReactNode`를 돌려줍니다 — 어드민 표의 칸에는 `Badge`가 들어가고 `Avatar`가 들어갑니다. **그것으로는 대소를 가릴 수 없습니다.** 상태 칸을 정렬하려면 화면에 그리는 `<Badge>활성</Badge>`이 아니라 그 뒤의 `'활성'`이 필요합니다.

그래서 정렬은 `sortValue`가 있는 열에서만 됩니다. `sortable: true` 같은 별도 스위치를 두지 않습니다 — 두면 `sortable`은 켜 놓고 `sortValue`를 안 준 열이 생기고, 그때 무엇으로 비교할지 정할 방법이 없습니다. **정렬 가능함은 비교할 값을 준 것과 같은 뜻**입니다.

`sortValue`가 `null`을 돌려줄 수 있는 것은 값이 없는 칸 때문입니다. `Table`의 예외 상황에 이미 "값이 없는 칸 — 빈칸으로 두지 않고 —로 값이 없음을 밝힌다"가 있습니다. 그 칸이 정렬에서 어디로 가는지 정해야 하고, 이 스펙은 **방향과 무관하게 항상 끝**으로 둡니다. 오름차순에서 맨 뒤, 내림차순에서도 맨 뒤입니다 — 값이 없는 것은 작은 값이 아니라 값이 아니기 때문입니다.

### 판단 4. 선택은 행 번호가 아니라 행 id로 셉니다

`src/data/patterns.ts`의 `list` 패턴에 이미 예외 상황이 걸려 있습니다.

> 선택 상태에서 페이지 이동 — 선택이 몇 건인지 페이지를 넘어가도 보인다

인덱스로 세면 이 문장이 거짓이 됩니다. 2페이지의 0번은 1페이지의 0번과 다른 행인데 같은 번호이기 때문입니다.

그래서 `DataTable`은 `getRowId: (row: T) => string`를 요구하고, 선택은 `Set<string>`으로 답니다. 전체 선택 체크박스의 중간 상태도 이 결정에 딸려 옵니다 — **`pageSelectionState`는 지금 페이지만 봅니다.** 머리의 체크박스는 "이 페이지 전부"를 뜻하고, 전체 선택은 화면에 없습니다. 표가 아직 안 받아 온 행까지 고르는 일은 서버가 알아야 하는 일이고, 이 회차는 서버를 모릅니다.

---

## `Data Table` 컴포넌트

### 파일

`src/components/ui/data-table.tsx` · `src/lib/data-table.ts`. 레지스트리 항목은 하나(`data-table`, 파일 둘)입니다 — `Date Picker`가 `date-picker.tsx`와 `calendar.tsx`를 한 항목에 담은 것과 같은 모양입니다.

`registryDependencies`는 `table` · `checkbox` · `pagination` · `button`입니다. 새 npm 패키지를 들이지 않습니다.

### 상태를 누가 쥐는가

정렬·페이지·선택 셋 다 **비제어가 기본이고 제어할 수 있습니다.** 이 저장소가 이미 쓰는 모양입니다.

```
sort / onSortChange
page / onPageChange
selected / onSelectedChange
```

제어를 열어 두는 이유는 실제 어드민이 서버에서 정렬하고 페이지를 나누기 때문입니다. 그 자리에서는 `DataTable`이 상태를 쥐면 안 되고, 무엇이 눌렸는지만 알려 주어야 합니다. 다만 **서버 연동 자체는 이 회차의 범위 밖**이고, 문서는 "이렇게 들어 올릴 수 있다"까지만 보입니다.

### 축 (Properties)

| 축 | 값 |
|---|---|
| `density` | `compact` · `default` — `Table`의 축을 그대로 물려받는다. 새로 정하지 않는다 |
| `selection` | `none` · `multiple` — 선택 칸이 있는지 |
| `state` | `default` · `loading` · `empty` |

`state`가 여기에는 있고 `Table`에는 없는 것이 어긋나 보일 수 있어 적어 둡니다. `Table`의 `state`는 **행 하나**의 상호작용 상태(default·selected·hover)였고, loading·empty는 행이 아니라 표 전체의 문제라 그 축에서 뺐다는 판단이 `registry.ts`에 주석으로 남아 있습니다. `DataTable`은 표 전체를 그리는 컴포넌트라 그 판단이 뒤집힙니다 — 여기서는 loading과 empty가 **한 축의 값으로 나란히 볼 수 있는 것**이 맞습니다.

### 구조 (Anatomy)

`toolbar`(선택) · `select-all-cell`(선택) · `sortable-header` · `sort-indicator` · `row` · `select-cell`(선택) · `footer`.

`toolbar`는 표 위에 선택 개수와 대량 작업이 나타나는 줄입니다. `list` 패턴의 "선택이 있으면 대량 작업 줄이 그 자리에 나타난다"를 컴포넌트가 자기 부위로 갖습니다.

`footer`는 `Pagination`을 담는 자리입니다. `Pagination`이 내보내는 것은 `Pagination` · `PaginationContent` · `PaginationItem` · `PaginationInfo` 넷뿐이고 페이지 번호 버튼은 `Button`으로 조립하는 물건이므로, `DataTable`의 footer도 같은 방식으로 조립합니다.

### 지침

- **정렬 상태는 아이콘만으로 말하지 않는다.** `aria-sort`를 `th`에 실어 보조 기술에도 같은 사실을 전한다. 정렬 머리는 `th` 안의 `button`이어야 누를 수 있다는 것이 드러난다
- **선택 개수는 페이지가 아니라 전체를 센다.** 페이지를 넘어가도 몇 건인지 남는다
- **정렬해도 행 높이가 바뀌지 않는다.** 방향 아이콘 자리는 정렬 안 된 열에도 남겨 두어 표가 튀지 않게 한다
- **값이 없는 칸은 어느 방향으로 정렬해도 끝에 둔다**

### 사용 예 (Usage)

사용자 목록 · 주문 내역 · 로그 · 선택과 대량 작업.

### 예외 상황 (Cases)

| 경우 | 무엇을 보이는가 |
|---|---|
| 빈 목록 | 머리는 남기고 몸에 `EmptyState`를 둔다 |
| 필터 결과 없음 | 조건을 지우는 길을 함께 준다 |
| 불러오는 중 | 행 자리를 `Skeleton`으로 잡아 표가 튀지 않게 한다 |
| 선택 상태에서 페이지 이동 | 선택 개수가 남는다 |
| 값이 없는 칸 | `—`로 밝히고, 정렬에서는 끝으로 간다 |
| 좁은 화면 | 표가 가로로 구르고 첫 열은 `sticky`로 남는다 |

---

## `Table`이 지키게 되는 약속

**별개 Task로 둡니다.** 검토하는 사람이 `DataTable`은 받고 `Table` 변경은 되돌리는 선택을 할 수 있어야 하기 때문입니다 — v0.12.0에서 `Destructive confirm` 패턴 이전을 컴포넌트 추가와 다른 Task로 뗀 것과 같은 이유입니다.

`TableHead`가 `sortable`과 `sortDirection`(`'asc'` · `'desc'` · `false`)을 받고, 받으면 `aria-sort`를 내보내고 이름을 `button`으로 감쌉니다.

`TableHead`에는 `sortable`이 있고 `DataTableColumn`에는 없는 것이 어긋나 보일 수 있어 적어 둡니다. 둘은 아는 것이 다릅니다. `DataTable`은 열 정의를 손에 쥐고 있으므로 `sortValue`가 있는지 보면 정렬 가능한지 알 수 있습니다. `TableHead`는 자기 자식이 무엇인지밖에 모르는 원시라 누가 말해 주어야 합니다. `DataTable`은 `sortValue`의 유무를 보고 `TableHead`에 `sortable`을 넘깁니다. 그러면 `registry.ts`의 "누르면 정렬 방향이 바뀐다"가 참이 되고, `TablePage`의 Anatomy 무대도 죽은 아이콘 대신 진짜 정렬 머리를 그립니다.

`Table`의 `purpose`에 있는 "고르거나 정렬하게 한다"도 이때 다시 봅니다. 선택은 `Table`이 하는 일이 아니라 `DataTable`이 하는 일이므로, 그 문장은 **고쳐야 할 가능성이 높습니다.** 어느 쪽으로 고칠지는 코드가 정해진 뒤에 코드를 보고 정합니다.

## `list` 패턴이 `DataTable`로 옮겨 갑니다

**이것도 별개 Task입니다.**

`src/routes/patterns/ListPatternPage.tsx`는 지금 `Table`·`Checkbox`·`Pagination`을 손으로 조립하고 `ROWS` 상수를 씁니다. `DataTable`이 생긴 뒤에도 그대로 두면 **이 시스템이 권하는 것과 시연하는 것이 달라집니다.** 목록 패턴을 보러 온 사람이 보게 되는 것은 이 시스템이 목록을 만들라고 내놓은 컴포넌트가 아닌 것이 됩니다.

`src/data/patterns.ts`의 `list` 항목이 `structure`에서 가리키는 컴포넌트 목록도 함께 봅니다 — `Command`가 실렸을 때 `destructive-confirm`의 링크가 낡았던 것과 같은 자리입니다.

---

## 문서에 반영되는 것

- `src/data/registry.ts`에 `data-table` 항목 하나. 카테고리는 `data-display`
- `src/routes/components/DataTablePage.tsx`와 라우트 등록
- 검색 색인(`src/data/search-index.ts`)과 LNB
- `registry.json` → `npm run registry` → `public/r/data-table.json`. `adminds` 묶음의 개수와 README의 개수 문구도 함께 (테스트가 지키므로 손으로 세지 않습니다)
- `src/data/releases.ts`에 v0.13.0 회차

## 범위 밖

- **열 너비 조절** — `Resizable`의 몫입니다. v0.14.0
- **열 보이기/숨기기** — `Dropdown Menu`로 조립하는 일이고, 열 정의에 상태를 하나 더 얹습니다. 정렬과 선택이 먼저 자리를 잡은 뒤에 봅니다
- **가상 스크롤** — 행이 수천일 때의 문제입니다. 이 작업대의 예시는 그만큼 크지 않고, 넣으면 표가 자기 높이를 알아야 해서 `ScrollArea`와 규칙이 섞입니다
- **서버 데이터 페칭** — 이 저장소에는 서버가 없습니다. 상태를 들어 올릴 수 있게 열어 두는 데까지만 합니다
- **행 드래그로 순서 바꾸기 · 행 펼치기 · 칸 안에서 고치기**
- **TanStack Table** — 들이지 않습니다. 이 작업대는 소스를 그대로 배포하는 것이 요점이고, 정렬과 페이지 나눔은 순수 함수로 떨어지는 일입니다. `Command`에서 `cmdk`를 들이지 않은 것과 같은 판단입니다
- `Context Menu` · `Menubar` · `Resizable` — v0.14.0

## 전역 제약

- 작업 브랜치는 `v0.13.0`이고 `v0.12.0` 위에서 땄습니다. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않습니다
- 전시 컴포넌트(`src/components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다. 제품 컴포넌트(`src/components/ui/*`)는 문서 시스템의 표시를 알지 않습니다
- **17px 이하 글자는 4.5:1을 넘어야 합니다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. 재지 않고 어림잡지 않습니다
- **`--spacing-control-sm`·`--spacing-control`·`--spacing-control-lg`(2·2.25·2.5rem)와 `--spacing-row` 계열은 의도된 어드민 밀도 축입니다.** shadcn 기본값 쪽으로 "고치지" 않습니다
- 예시 안의 가짜 화면 제목은 `<h4>`를 씁니다. `<h3>`을 쓰지 않습니다 — `assignHeadingIds`(`src/lib/heading-id.ts`)가 `main` 아래의 모든 `h2`·`h3`을 고정 목차로 쓸어 담습니다
- 줄어들 수 없는 고정 폭을 두지 않습니다. `w-full max-w-*`를 씁니다
- 서식은 손으로 맞춥니다 — 작은따옴표, 세미콜론 없음. **`prettier --write`를 돌리지 않습니다.** 이 저장소에는 prettier 설정이 없습니다
- `public/r/*.json`을 손으로 고치지 않습니다. `npm run registry`를 돌립니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않습니다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않습니다.** 이 프로젝트가 모든 회차에서 가장 자주 낸 결함이고, 이번 회차는 그 결함 하나를 갚는 회차입니다
- **이 하네스는 키보드 동작을 검증할 수 없습니다** — 실제 키 입력이 쓸 만한 `keydown`을 만들지 못하고(`Enter`가 `code: ""`·`keyCode: 0`으로 도착합니다), 합성한 `Escape`는 Radix 층을 닫지 못합니다. 키보드 동작은 소스로 추론하고 그렇게만 적습니다. **하네스를 보정하려고 제품 코드를 고치지 않습니다**
- **Vitest는 `node` 환경에서 돕니다. jsdom이 없습니다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않습니다 — 검사할 값은 `src/lib`의 순수 함수로 뺍니다
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다
