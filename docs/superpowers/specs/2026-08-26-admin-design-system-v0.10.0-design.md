# 어드민 디자인 시스템 v0.10.0 설계 — 폼 심화

## 배경

v0.9.0까지 스물여섯 개가 모였습니다. 남은 것은 **폼이 실제로 요구하는 것들**입니다.

지금 `Input`·`Select`·`Checkbox`는 각각 홀로 서 있습니다. 라벨을 붙이고 도움말을 달고 오류를 아래에 놓는 일은 문서마다 손으로 반복하고 있습니다. 그리고 어드민 폼에서 반드시 나오는 세 가지가 아직 없습니다 — 날짜를 고르는 것, 많은 항목에서 찾아 고르는 것, 파일을 올리는 것.

이번 회차가 그 여섯을 더하고 컴포넌트를 닫습니다.

## 이번 회차의 여섯 개

| 컴포넌트 | 카테고리 | 의존성 |
|---|---|---|
| `Popover` | Feedback | `@radix-ui/react-popover` |
| `Field` | Inputs | 없음 (`@radix-ui/react-slot` 재사용) |
| `Slider` | Inputs | `@radix-ui/react-slider` |
| `Combobox` | Inputs | `Popover` |
| `Date Picker` | Inputs | `Popover` |
| `File Upload` | Inputs | 없음 |

`Popover`를 맨 앞에 둡니다. `Combobox`와 `Date Picker`가 그 위에 섭니다.

`Date Picker`에 달력 라이브러리를 들이지 않습니다. 한 달의 격자를 만드는 것은 날짜 계산이고 그것은 **순수 함수**입니다 — `src/lib/calendar.ts`에 두면 테스트로 검증됩니다. 라이브러리를 들이면 그 라이브러리의 클래스 이름 체계와 이 저장소의 토큰을 맞추는 일이 새로 생기고, 그쪽이 오히려 큽니다.

---

## 1. `Popover`

### 컴포넌트

`src/components/ui/popover.tsx`. Radix의 `Popover`를 감쌉니다. 구성은 `Popover` · `PopoverTrigger` · `PopoverContent`입니다.

`modal`은 켜지 않습니다. 팝오버는 화면을 잠글 만큼 무거운 것이 아니고, 잠그면 `Select`에서 겪은 것과 같은 문제가 생깁니다 — 바깥이 `pointer-events: none`이 되고 GNB가 `aria-hidden`이 됩니다.

### 축

두지 않습니다.

열린 표면은 트리거의 변형이 아니라 다른 표면입니다. 포털된 고정 위치 요소는 행 높이에 계산되지 않아 격자의 아래 칸을 덮습니다 — `Tooltip`에서 이미 같은 결론에 이르렀습니다. `properties`를 빈 배열로 두면 `ComponentPage`가 절을 그리지 않습니다.

Playground는 트리거를 눌러 여는 인스턴스 하나를 놓습니다. 만져 볼 수 있는 것이 열고 닫는 일뿐이라도 그것이 이 컴포넌트의 전부입니다.

### 구조 (Anatomy)

Trigger 하나입니다.

처음에는 Content와 그 안의 Header·Body·Footer까지 부위로 두려 했습니다. 그런데 Radix가 그 표면을 `document.body`로 포털하므로 구조도의 무대 안에서 찾을 수 없습니다 — 지시선을 그릴 자리가 없습니다.

이 저장소는 같은 처지의 컴포넌트를 이미 셋 갖고 있고 모두 같은 결론에 이르렀습니다. `Dialog` · `Tooltip` · `Dropdown Menu`가 Trigger 하나만 부위로 둡니다. `Select`는 Trigger와 Value 둘인데, 그 둘이 무대 안에 남는 부위이기 때문입니다.

열린 표면의 구조는 지침과 사용 예가 다룹니다. **보일 수 없는 것을 부위로 적지 않습니다.**

### 지침

- **Dialog와 구별한다** — 하던 일을 멈추고 답해야 하면 Dialog입니다. 곁들여 보는 것이면 Popover입니다
- **Tooltip과 구별한다** — 안에 누를 수 있는 것이 하나라도 있으면 Popover입니다. Tooltip은 마우스를 치우면 사라지므로 누를 수 없습니다
- **팝오버 안에서 또 팝오버를 열지 않는다** — 어느 것을 닫아야 뒤로 가는지 알 수 없게 됩니다
- **화면 가장자리에서 자리를 옮긴다** — 잘리기 전에 반대편으로 뒤집습니다. Radix가 맡는 일이므로 `collisionPadding`만 정합니다

### 사용 예 (Usage)

필터 묶음 · 날짜 선택 · 항목 검색 · 짧은 설명과 링크

### 예외 상황 (Cases)

화면 가장자리 · 내용이 긴 경우 · 안에 폼이 있는 경우 · 좁은 화면

---

## 2. `Field`

### 컴포넌트

`src/components/ui/field.tsx`. 라벨·도움말·오류를 입력 하나에 묶습니다. 구성은 `Field` · `FieldLabel` · `FieldControl` · `FieldHelp` · `FieldError`입니다.

**id를 잇는 일이 이 컴포넌트의 존재 이유입니다.** `Field`가 `useId`로 id 하나를 만들고 컨텍스트에 담습니다. `FieldLabel`은 `htmlFor`에, `FieldHelp`와 `FieldError`는 자기 id를 컨텍스트에 등록하고, `FieldControl`이 `Slot`으로 자식에게 `id` · `aria-describedby` · `aria-invalid`를 내려 줍니다. 손으로 id를 적는 일이 사라집니다.

### 축

| 축 | 값 |
|---|---|
| `layout` | `stacked` · `horizontal` |
| `state` | `default` · `error` · `disabled` |
| `label` | `plain` · `required` · `optional` |

`horizontal`은 라벨이 왼쪽 고정 폭입니다. 설정 화면처럼 라벨이 짧고 항목이 많을 때 씁니다.

`required`와 `optional`은 표시가 반대 방향입니다 — 필수가 드물면 필수를 표시하고, 선택이 드물면 선택을 표시합니다. 축이 둘을 나란히 보이는 것은 한 폼 안에서 하나만 골라 쓰라는 지침과 짝을 이룹니다.

### 구조 (Anatomy)

Container · Label · Requirement mark(선택) · Control · Help(선택) · Error(선택)

### 지침

- **라벨을 입력 위에 둔다** — 시선이 아래로 내려가는 흐름과 맞고, 번역으로 라벨이 길어져도 자리가 흔들리지 않습니다
- **도움말은 입력 앞에, 오류는 입력 뒤에 둔다** — 도움말은 적기 전에 읽어야 하고 오류는 적은 뒤에 나옵니다
- **필수 표시와 선택 표시 중 하나만 쓴다** — 한 폼에서 둘을 섞으면 표시가 없는 항목이 무엇인지 알 수 없습니다
- **오류가 나오면 도움말을 지우지 않는다** — 무엇이 틀렸는지와 무엇을 넣어야 하는지는 둘 다 필요합니다

### 사용 예 (Usage)

폼 한 줄 · 설정 항목 · 표 위의 필터 · 여러 입력을 한 라벨로 묶는 경우

### 예외 상황 (Cases)

오류와 도움말이 함께 있는 경우 · 라벨이 긴 경우 · 라벨이 필요 없는 입력 · 좁은 화면

---

## 3. `Slider`

### 컴포넌트

`src/components/ui/slider.tsx`. Radix의 `Slider`를 감쌉니다.

### 축

| 축 | 값 |
|---|---|
| `size` | `sm` · `default` |
| `state` | `default` · `focus` · `disabled` |
| `layout` | `single` · `range` |

`range`는 값이 둘인 슬라이더입니다. 손잡이가 둘이고 그 사이가 채워집니다.

`with-value`는 축으로 두지 않습니다. 값을 함께 보이는 것은 늘 그래야 하는 일이라 고를 값이 아니고, 지침이 그것을 말합니다.

### 구조 (Anatomy)

Track · Range · Thumb · Value(선택)

### 지침

- **값을 숫자로 함께 보인다** — 손잡이 위치만으로는 지금 값이 얼마인지 읽히지 않습니다
- **정확한 값이 필요하면 입력 칸을 곁에 둔다** — 슬라이더는 어림잡는 도구입니다. 37을 정확히 맞춰야 하는 자리에는 맞지 않습니다
- **눈금 간격을 값의 단위에 맞춘다** — 0.01씩 움직이는 슬라이더는 손으로 맞출 수 없습니다
- **선택지가 다섯 개 이하면 슬라이더를 쓰지 않는다** — Radio가 더 빠르고 정확합니다

### 사용 예 (Usage)

가격 범위 필터 · 임계값 설정 · 이미지 품질 · 표시 개수

### 예외 상황 (Cases)

범위가 아주 넓은 경우 · 두 손잡이가 같은 값이 된 경우 · 값이 없는 경우 · 좁은 화면

---

## 4. `Combobox`

### 컴포넌트

`src/components/ui/combobox.tsx`. `Popover` 위에 세웁니다 — 트리거는 `Select`의 트리거와 같은 모양이고, 열린 표면 안에 검색 칸과 걸러진 목록이 있습니다.

거르는 일은 순수 함수입니다. `src/lib/filter-options.ts`에 두고 테스트합니다 — 대소문자를 가리지 않고, 앞글자만이 아니라 **포함**으로 맞춥니다.

키보드는 직접 다룹니다 — 위아래로 옮기고, Enter로 고르고, Escape로 닫습니다. `aria-activedescendant`로 지금 짚은 항목을 알립니다.

### 축

| 축 | 값 |
|---|---|
| `size` | `sm` · `default` · `lg` |
| `state` | `default` · `hover` · `focus` · `disabled` · `invalid` |
| `layout` | `single` · `multiple` |

`multiple`은 고른 항목이 트리거 안에 `Badge`로 쌓이는 모습입니다.

`open`은 두지 않습니다 — `Select`와 같은 이유입니다.

### 구조 (Anatomy)

Trigger · Value · Search · List · Item · Empty message

### 지침

- **항목이 열 개를 넘으면 Select 대신 쓴다** — 그 아래에서는 검색 칸이 오히려 한 단계를 더합니다
- **포함으로 거른다** — 앞글자만 맞추면 '김하나'를 '하나'로 찾을 수 없습니다
- **결과가 없을 때 할 일을 알린다** — 빈 목록만 남기지 않고 무엇을 할 수 있는지 적습니다
- **고른 것을 되돌릴 수 있게 한다** — 여럿 고르는 경우 각 항목에 지우는 자리를 둡니다

### 사용 예 (Usage)

담당자 지정 · 태그 선택 · 상품 검색 · 소속 조직 선택

### 예외 상황 (Cases)

결과가 없는 경우 · 항목이 아주 많은 경우 · 고른 것이 많은 경우 · 좁은 화면

---

## 5. `Date Picker`

### 컴포넌트

두 파일입니다.

`src/lib/calendar.ts` — 한 달의 격자를 만드는 순수 함수. `buildMonthGrid(year, month)`가 여섯 주 × 일곱 날의 배열을 돌려주고, 각 칸은 날짜와 그 달에 속하는지 여부를 담습니다. 윤년과 월요일 시작 여부가 여기서 결정되고 테스트가 지킵니다.

`src/components/ui/date-picker.tsx` — `Popover` 위에 `Calendar`를 놓습니다. 트리거는 `Select`와 같은 모양이고 값 자리에 날짜가, 오른쪽에 달력 아이콘이 옵니다.

### 축

| 축 | 값 |
|---|---|
| `size` | `sm` · `default` · `lg` |
| `state` | `default` · `hover` · `focus` · `disabled` · `invalid` |
| `layout` | `single` · `range` |

### 구조 (Anatomy)

Trigger · Value · Month header · Weekday row · Day grid · Day

### 지침

- **형식을 자리표시자로 알린다** — `YYYY-MM-DD`처럼 어떤 모양으로 적는지 미리 보입니다
- **오늘과 고른 날을 다르게 표시한다** — 둘이 같은 모양이면 오늘을 이미 고른 것으로 읽습니다
- **고를 수 없는 날은 이유를 알린다** — 흐리게만 두면 왜 안 되는지 알 수 없습니다
- **범위는 시작과 끝을 함께 보인다** — 하나만 고른 중간 상태에서 무엇을 더 골라야 하는지 알립니다

### 사용 예 (Usage)

기간 필터 · 만료일 설정 · 예약일 · 조회 기준일

### 예외 상황 (Cases)

오늘 이전을 막는 경우 · 범위가 한 달을 넘는 경우 · 값이 없는 경우 · 좁은 화면

---

## 6. `File Upload`

### 컴포넌트

`src/components/ui/file-upload.tsx`. 네이티브 `<input type="file">`을 숨기고 그 위에 떨어뜨리는 영역이나 버튼을 그립니다.

구성은 `FileUpload` · `FileUploadDropzone` · `FileUploadList` · `FileUploadItem`입니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `dropzone` · `button` |
| `state` | `default` · `hover` · `dragging` · `disabled` · `invalid` |
| `layout` | `single` · `multiple` |

`dragging`은 파일을 끌고 영역 위에 왔을 때입니다. 상태 클래스로 강제해 격자에 보입니다.

### 구조 (Anatomy)

Dropzone · Icon · Instruction · Constraint · File list(선택) · File item · Remove

### 지침

- **끌어다 놓기만으로는 부족하다** — 누를 수 있는 버튼을 함께 둡니다. 끌어다 놓기는 키보드로 할 수 없습니다
- **허용 형식과 최대 크기를 미리 적는다** — 올린 뒤에 알리면 그 시간이 버려집니다
- **진행률을 보인다** — 큰 파일은 `Progress`를 함께 씁니다
- **실패한 파일을 목록에서 지우지 않는다** — 왜 실패했는지와 함께 남겨 다시 시도할 수 있게 합니다

### 사용 예 (Usage)

프로필 이미지 · 대량 등록 파일 · 첨부 파일 · 로고 교체

### 예외 상황 (Cases)

형식이 맞지 않는 경우 · 크기를 넘는 경우 · 올리는 중 · 여러 파일

---

## 문서에 반영되는 것

`registry.ts`에 여섯 `ComponentMeta`를 더합니다. `addedIn`과 `changedIn`은 `v0.10.0`, `status`는 `stable`, `verified`는 `false`로 두었다가 브라우저로 확인한 뒤 올립니다.

`nav-config`의 Components 섹션에 여섯 문서를 더합니다. 자리는 카테고리 순서를 따릅니다.

`releases.ts`에 `v0.10.0` 항목을 더합니다.

## 범위 밖

- `Get started` · `Patterns` 채우기 — v0.11.0
- 접근성 후속 묶음 — 별도 회차
- `useMeasuredTokens` 5벌 중복 해소

## 전역 제약

v0.9.0의 제약을 그대로 잇습니다.

- 작업 브랜치는 `v0.10.0`. `main`에 직접 커밋하지 않습니다
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
