# 어드민 디자인 시스템 v0.12.0 설계 — 덮는 것, 묻는 것, 접는 것

## 배경

v0.11.0으로 GNB의 빈 자리가 사라졌습니다. 컴포넌트 32개, 패턴 다섯, 섹션 넷이 모두 자기 내용을 갖고 있습니다.

읽는 사람이 다음으로 요청한 것은 컴포넌트입니다. 그래서 이번 회차는 **어드민이 실제로 요구하는데 이 시스템에 아직 없는 것** 여섯을 봅니다.

지금 없는 것을 자리별로 세면 이렇습니다. 화면을 덮고 옆에서 열리는 표면이 없습니다 — `Dialog`는 가운데에만 뜹니다. 되돌릴 수 없는 동작을 물을 때 실수로 닫히지 않는 대화상자가 없습니다. 눌러서 켜지는 버튼과 그 묶음이 없습니다 — `Switch`는 설정을 켜고 끄는 것이지 보고 있는 것에 무엇을 거는 도구가 아닙니다. 한 자리만 접는 것이 없습니다 — `Accordion`은 여럿을 늘어놓는 물건입니다. 높이를 정해 두고 그 안에서만 굴리는 상자가 없습니다. 그리고 쳐서 찾아 곧장 가는 표면이 없습니다 — 이 작업대는 자기 것을 이미 갖고 있지만 제품으로 내보낼 수 있는 형태가 아닙니다.

이번 회차가 그 여섯을 더합니다. 32개가 38개가 됩니다.

## 이번 회차의 여섯 개

| 컴포넌트 | 카테고리 | 의존성 |
|---|---|---|
| `Sheet` | Feedback | `@radix-ui/react-dialog` (이미 있음) |
| `Alert Dialog` | Feedback | `@radix-ui/react-alert-dialog` (새로) |
| `Toggle` | Actions | `@radix-ui/react-toggle` · `@radix-ui/react-toggle-group` (새로) |
| `Collapsible` | Data Display | `@radix-ui/react-collapsible` (새로) |
| `Scroll Area` | Data Display | `@radix-ui/react-scroll-area` (새로) |
| `Command` | Navigation | 없음 (`Dialog` 재사용) |

### 들일 패키지와 그 판(2026-08-27, npm 확인)

| 패키지 | 판 |
|---|---|
| `@radix-ui/react-alert-dialog` | 1.1.23 |
| `@radix-ui/react-toggle` | 1.1.18 |
| `@radix-ui/react-toggle-group` | 1.1.19 |
| `@radix-ui/react-collapsible` | 1.1.20 |
| `@radix-ui/react-scroll-area` | 1.2.18 |

`@radix-ui/react-dialog`는 `^1.1.23`으로 이미 `package.json`에 있습니다. `Sheet`는 새 패키지를 들이지 않습니다.

`Toggle`과 `Toggle Group`은 **문서 하나**입니다. 두 파일(`toggle.tsx` · `toggle-group.tsx`)로 나뉘고 레지스트리 항목도 하나(`toggle`, 파일 둘)입니다 — `Date Picker`가 `date-picker.tsx`와 `calendar.tsx` 둘을 한 항목으로 담은 것과 같은 모양입니다. 묶는 이유는 아래 3절에 적었습니다.

---

## 이번 회차가 내리는 두 판단

### 판단 1. `Command`는 `cmdk`를 들이지 않고 이 저장소의 조각으로 세웁니다

shadcn의 `Command`는 `cmdk`를 감쌉니다. 이 시스템은 그렇게 하지 않습니다.

이미 같은 일을 두 번 해 봤고 두 번 다 라이브러리 없이 됐기 때문입니다. `Combobox`는 `Popover` 위에 검색 칸과 걸러진 목록을 손으로 세웠고, 거르는 일은 `src/lib/filter-options.ts`의 순수 함수로 빼서 테스트가 지킵니다. `src/components/layout/SearchDialog.tsx`는 204줄짜리 명령 표면으로 이미 돌아가고 있습니다 — `src/data/search-index.ts`에서 자료를 받아 묶음으로 나누고, 위아래 이동이 묶음 경계를 넘고, `aria-activedescendant`로 짚은 항목을 알립니다. 이 시스템은 이 물건을 **어떻게 만드는지 이미 압니다.**

그런데도 패키지를 들이면 두 가지가 따라옵니다. 첫째, `cmdk`의 자체 필터·점수 규칙이 `filterOptions`의 규칙(포함으로 맞추고, 대소문자를 가리지 않고, 원본 순서를 지킨다)과 갈립니다 — 같은 저장소 안에서 두 개의 검색이 서로 다르게 걸러집니다. 둘째, 이 저장소의 모든 컴포넌트는 Radix 아니면 손으로 만든 것인데, 필터링처럼 순수 함수로 떨어지는 일에 세 번째 종류의 의존을 더하는 것은 지금까지 지켜 온 방식과 어긋납니다.

그래서 `Command`는 **`Dialog` + 걸러진 목록 + 묶음**입니다. 거르고 묶는 일은 `src/lib/command-filter.ts`의 순수 함수 둘로 빼고, 이 저장소에서 테스트가 실제로 지킬 수 있는 종류의 코드로 둡니다.

### 판단 2. `Alert Dialog`는 `Dialog`의 변형이 아니라 자기 컴포넌트입니다

`Dialog`에 `variant="destructive"`를 더하는 것으로는 안 됩니다. 둘의 차이가 **보이는 것이 아니라 동작하는 것**이기 때문입니다.

- 바깥을 눌러도 닫히지 않습니다. `Dialog`의 `outside-click` 지침은 "잃을 것이 없을 때만 바깥 클릭으로 닫히게 둔다"고 말합니다. `Alert Dialog`는 잃을 것이 있는 자리 전용이므로 그 선택지 자체가 없어야 합니다.
- 접근성 트리에서 `alertdialog`로 읽힙니다. `dialog`와 다른 역할이고, 보조 기술이 본문을 먼저 읽도록 신호합니다.
- 동작이 항상 쌍입니다. 취소와 실행 둘이고, 닫기 X 아이콘을 두지 않습니다 — X는 취소인지 그냥 닫기인지 말하지 않습니다.

셋 다 `variant` 하나로는 표현할 수 없고, `Dialog`에 조건 분기로 넣으면 `Dialog`가 자기 것이 아닌 규칙을 알게 됩니다. Radix도 같은 이유로 패키지를 나눠 두었습니다.

### `Destructive confirm` 패턴은 **이번 회차에 옮깁니다**

`src/routes/patterns/DestructiveConfirmPatternPage.tsx`는 지금 `Dialog`로 그 흐름을 보입니다. 이번 회차에서 `Alert Dialog`로 옮깁니다. 다음 회차로 미루지 않습니다.

이유는 두 가지입니다.

첫째, **미루면 문서가 거짓말을 합니다.** `src/data/patterns.ts`의 `destructive-confirm` 항목은 `purpose`에 "Dialog로 묻고 Toast로 결과를 알린다"라고 적혀 있고, `structure`의 두 자리가 `components: ['dialog']`로 `Dialog` 문서를 가리킵니다. `Alert Dialog`가 실린 순간 그 문장은 이 시스템이 권하는 것과 다른 말이 됩니다. 화면에 보이는 링크가 잘못된 문서로 가는 종류의 거짓이라 눈으로 잡히지도 않습니다.

둘째, **옮기는 일이 기계적입니다.** 부위 이름이 일대일로 대응합니다 — `DialogHeader`/`Title`/`Description`/`Footer`는 이름만 바뀌고, `DialogClose` 안의 취소 버튼은 `AlertDialogCancel`이 되고, 실행 버튼은 `AlertDialogAction`이 됩니다. 새로 판단할 것이 없습니다.

다만 **옮기는 일은 `Alert Dialog`를 만드는 일과 다른 Task**로 둡니다. 검토하는 사람이 새 컴포넌트는 받고 패턴 이전은 되돌리는 선택을 할 수 있어야 하기 때문입니다.

`SearchDialog`는 이번 회차에 `Command` 위로 옮기지 않습니다 — 아래 「범위 밖」에 이유를 적었습니다.

---

## 1. `Sheet`

### 컴포넌트

`src/components/ui/sheet.tsx`. Radix의 `Dialog`를 감쌉니다 — **Sheet는 가장자리에 붙은 Dialog입니다.** 새 패키지가 필요 없는 것은 그래서입니다.

구성은 `Sheet` · `SheetTrigger` · `SheetClose` · `SheetContent` · `SheetHeader` · `SheetFooter` · `SheetTitle` · `SheetDescription`입니다. `dialog.tsx`를 고쳐 겸용하지 않고 파일을 따로 둡니다 — `DialogContent`는 덮개를 `grid place-items-center`로 쓰는 그릇이고, `SheetContent`는 그 그릇을 `items-stretch`로 바꿔 한쪽 변에 붙입니다. 한 파일에서 두 배치를 분기로 다루면 두 컴포넌트의 규칙이 서로 섞입니다.

`SheetContent`는 `side`(`right`·`left`·`top`·`bottom`)와 `size`(`sm`·`default`·`lg`)를 받습니다. 좌우는 `w-full max-w-*`로 너비를, 위아래는 `max-h-*`로 높이를 정합니다. 고정 폭을 쓰지 않으므로 좁은 화면에서 저절로 줄어듭니다.

### 축

두지 않습니다.

`side`의 네 값도 `size`의 세 값도 **닫힌 트리거에서는 완전히 같아 보입니다.** `Dialog`가 `size`를 축에서 뺀 것과 같은 이유입니다 — 격자의 칸마다 똑같은 버튼만 남습니다. `properties`를 빈 배열로 두면 `ComponentPage`가 그 절을 그리지 않습니다.

네 방향과 세 크기는 `usage`에서 실제로 눌러 엽니다. `side`와 `size`는 컴포넌트에 그대로 있습니다.

### 구조 (Anatomy)

Trigger 하나입니다.

열린 표면이 `document.body`로 포털되어 구조도의 무대 안에 없습니다. `Dialog` · `Popover` · `Tooltip` · `Dropdown Menu`가 모두 같은 처지에서 같은 결론에 이르렀습니다. **보일 수 없는 것을 부위로 적지 않습니다.** 열린 표면의 생김새는 Trigger의 `note`가 글로 적고, 실제 모습은 Usage에서 열어 봅니다.

### 지침

- **Dialog와 구별한다** — 묻고 답하고 원래 자리로 돌아가면 Dialog입니다. 목록을 곁에 둔 채로 이어서 일하면 Sheet입니다
- **한 제품 안에서 방향에 뜻을 준다** — 편집은 오른쪽, 이동은 왼쪽처럼 미리 정합니다. 화면마다 방향이 바뀌면 어디서 나올지 예측할 수 없습니다
- **Sheet 위에 Sheet를 열지 않는다** — 어느 것을 닫아야 뒤로 가는지 알 수 없게 됩니다. Popover에서 이미 같은 결론에 이르렀습니다
- **안에 입력 중인 폼이 있으면 바깥 클릭으로 닫지 않는다** — Dialog의 `outside-click` 지침이 그대로 적용됩니다
- **머리와 발을 고정하고 본문만 굴린다** — 내용이 세로로 길면 제목과 동작 버튼이 늘 보여야 합니다. 본문에 Scroll Area를 씁니다

### 사용 예 (Usage)

필터 패널 · 상세 편집 · 좁은 화면의 내비게이션 · 활동 기록

### 예외 상황 (Cases)

본문이 긴 경우 · 안에 폼이 있는 경우 · 위·아래에서 여는 경우 · 좁은 화면

---

## 2. `Alert Dialog`

### 컴포넌트

`src/components/ui/alert-dialog.tsx`. `@radix-ui/react-alert-dialog`를 감쌉니다.

구성은 `AlertDialog` · `AlertDialogTrigger` · `AlertDialogContent` · `AlertDialogHeader` · `AlertDialogFooter` · `AlertDialogTitle` · `AlertDialogDescription` · `AlertDialogCancel` · `AlertDialogAction`입니다.

`Dialog`와 세 가지가 다릅니다.

1. **닫기 X를 두지 않습니다.** `DialogContent`의 `showClose`에 해당하는 것이 없습니다. 나가는 길은 취소 버튼 하나입니다.
2. **바깥 클릭으로 닫히지 않습니다.** Radix가 `AlertDialog.Content`에서 바깥 상호작용을 막습니다 — 이 문장은 구현 전에 설치한 패키지의 소스로 확인하고, 확인한 뒤에만 문서에 적습니다.
3. **`role="alertdialog"`로 읽힙니다.** Radix가 붙입니다. 같은 방법으로 확인합니다.

Escape로 닫히는 것은 그대로 둡니다 — 취소와 같은 뜻이고, 이것도 소스로 확인합니다. **키보드 동작은 이 하네스가 검증할 수 없으므로 소스로 추론하고 문서에도 그렇게만 적습니다.**

`AlertDialogAction`은 `Button`의 `variant`를 그대로 받습니다. 되돌릴 수 없는 동작이면 `destructive`입니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `default` · `destructive` |

`Dialog`가 가진 축과 같은 축을 같은 이름으로 둡니다. 형제 컴포넌트가 나란히 놓이는 문서에서 같은 것을 다른 이름으로 부르지 않습니다. 실행 버튼의 색과 제목의 문구가 이 축으로 갈립니다.

`size`는 두지 않습니다 — 경고 대화상자는 짧아야 하고, 크기를 고를 수 있게 두면 긴 본문을 담게 됩니다.

### 구조 (Anatomy)

Trigger 하나입니다. `Dialog`와 같은 이유입니다.

### 지침

- **Dialog와 구별한다** — 잃을 것이 있으면 Alert Dialog입니다. 바깥을 눌러도 닫히지 않고, 나가는 길이 취소 하나뿐입니다
- **동작을 반드시 쌍으로 둔다** — 취소와 실행 둘입니다. 닫기 X를 두지 않습니다. X는 취소인지 그냥 닫기인지 말하지 않습니다
- **제목에 무엇이 일어나는지 적는다** — '정말 실행하시겠습니까'만으로는 무엇이 사라지는지 알 수 없습니다. 대상과 개수를 제목에 둡니다
- **되돌릴 수 있는 동작에는 쓰지 않는다** — 되돌릴 수 있으면 묻지 말고 실행한 뒤 Toast에 되돌리기를 둡니다. 묻는 단계와 되돌리는 단계를 둘 다 두면 확인이 소음이 됩니다

### 사용 예 (Usage)

삭제 확인 · 저장하지 않은 변경 버리기 · 권한 회수 · 대량 작업 확인

### 예외 상황 (Cases)

되돌릴 수 없는 경우 · 실행이 실패한 경우 · 본문이 긴 경우 · 좁은 화면

---

## 3. `Toggle`

### 컴포넌트

파일 둘입니다.

`src/components/ui/toggle.tsx` — `@radix-ui/react-toggle`을 감쌉니다. `toggleVariants`(cva)를 여기서 정의하고 **내보냅니다.**

`src/components/ui/toggle-group.tsx` — `@radix-ui/react-toggle-group`을 감쌉니다. 구성은 `ToggleGroup` · `ToggleGroupItem`이고, 항목의 생김새는 `toggle.tsx`가 내보낸 `toggleVariants`를 그대로 씁니다. 묶음이 컨텍스트로 `variant`와 `size`를 내려 주어 항목마다 다시 적지 않습니다.

**문서는 하나입니다.** 홀로 선 Toggle과 묶인 Toggle은 같은 생김새·같은 크기 축·같은 상태를 갖고, 다른 것은 값이 하나인지 여럿인지뿐입니다. 이것은 축 하나로 표현되는 차이입니다 — `Combobox`가 `single`과 `multiple`을 축으로 둔 것과 같습니다. 레지스트리 항목도 하나(`toggle`)이고 파일 둘을 함께 실어 갑니다.

### 축

| 축 | 값 |
|---|---|
| `variant` | `default` · `outline` |
| `size` | `sm` · `default` · `lg` |
| `state` | `default` · `hover` · `on` · `focus` · `disabled` |
| `layout` | `single` · `group-single` · `group-multiple` |

`on`은 눌려 있는 상태입니다. Radix가 `data-state="on"`을 붙이므로 상태 클래스로 강제해 격자에 보입니다.

`group-single`은 하나만 골라지는 묶음(보기 전환 같은 것), `group-multiple`은 여럿이 함께 켜지는 묶음(서식 도구 같은 것)입니다.

### 구조 (Anatomy)

Container · Icon(선택) · Label(선택) · Group container(선택)

아이콘만 두든 글자만 두든 둘 다 두든 되지만, **둘 다 없을 수는 없습니다.** 그 규칙은 지침이 말합니다.

### 지침

- **Switch와 구별한다** — Switch는 설정을 켜고 그 자리에서 저장됩니다. Toggle은 지금 보고 있는 것에 서식이나 필터를 겁니다. 저장 버튼이 따로 있는 설정 화면이면 Switch입니다
- **Toggle Group과 Tabs를 구별한다** — Tabs는 화면의 내용을 갈아 끼웁니다. Toggle Group은 같은 내용을 다르게 보이거나 걸러 냅니다
- **아이콘만 둘 때 이름을 준다** — `aria-label`이나 화면에서 감춘 글자를 함께 둡니다. 아이콘은 스크린 리더가 읽지 못합니다
- **하나만 골라지는 묶음이 빌 수 있는지 미리 정한다** — Radix는 켜진 항목을 다시 눌러 끄는 것을 막지 않습니다. 목록 보기처럼 반드시 하나여야 하는 자리에서는 값이 비지 않게 붙잡습니다

### 사용 예 (Usage)

목록·격자 보기 전환 · 서식 도구 · 기간 필터 · 표시할 열 고르기

### 예외 상황 (Cases)

아이콘만 있는 경우 · 값이 비는 경우 · 항목이 많은 경우 · 좁은 화면

---

## 4. `Collapsible`

### 컴포넌트

`src/components/ui/collapsible.tsx`. `@radix-ui/react-collapsible`을 감쌉니다. 구성은 `Collapsible` · `CollapsibleTrigger` · `CollapsibleContent`입니다.

**`Accordion`과 겹치지 않습니다.** 겹치는 것처럼 보이지만 둘의 차이가 코드에 이미 남아 있습니다. `Accordion`은 트리거를 `AccordionHeader`가 `h3`으로 감쌉니다 — 그래서 `src/lib/heading-id.ts`의 `assignHeadingIds`가 `[data-slot="accordion-trigger"]`를 가진 제목을 **일부러 걸러 냅니다.** 접히는 항목의 이름이 문서의 절인 척 목차에 섞여 들기 때문입니다.

`Collapsible`에는 그 머리글 요소가 없습니다. 트리거는 그냥 버튼입니다. 그래서 카드 안이든 표 행 안이든, 제목 층위를 새로 만들지 않고 놓을 수 있습니다. **접히는 자리가 하나뿐인데 `Accordion`을 쓰면 있지도 않은 제목이 하나 생깁니다.**

`CollapsibleContent`의 여닫는 높이는 Radix가 주는 `--radix-collapsible-content-height`로 다룹니다 — `Accordion`이 `--radix-accordion-content-height`를 쓰는 것과 같은 방법입니다.

### 축

| 축 | 값 |
|---|---|
| `state` | `collapsed` · `expanded` · `focus` · `disabled` |

`variant`는 두지 않습니다. 접히는 자리 하나에는 서로 구별할 항목이 없어서 `Accordion`의 `plain`·`bordered` 같은 경계 축이 성립하지 않습니다 — 경계는 이것을 담는 `Card`나 표가 이미 그립니다.

### 구조 (Anatomy)

Trigger · Indicator · Content

포털을 쓰지 않으므로 세 부위가 모두 구조도의 무대 안에 있습니다. `Accordion`이 그랬던 것과 같습니다.

### 지침

- **Accordion과 구별한다** — 접히는 자리가 하나면 Collapsible, 여럿을 늘어놓고 그중에서 고르면 Accordion입니다
- **접힌 채로 무엇이 있는지 알린다** — '더 보기'만으로는 무엇이 더 있는지 알 수 없습니다. '조건 3개 더'처럼 안에 든 것을 말합니다
- **중요한 내용을 접어 두지 않는다** — 접힌 것은 없는 것과 같습니다. 반드시 봐야 하는 내용은 펼쳐 둡니다
- **표 행 전체를 트리거로 만들지 않는다** — 행 안에 링크나 버튼이 함께 있으면 어디를 눌러야 펴지는지 알 수 없습니다. 펴는 자리를 따로 둡니다

### 사용 예 (Usage)

고급 검색 조건 · 카드 안의 부가 정보 · 긴 로그 한 덩이 · 표 행의 하위 내용

### 예외 상황 (Cases)

내용이 아주 긴 경우 · 접힌 채로 시작하는 경우 · 안에 폼이 있는 경우 · 좁은 화면

---

## 5. `Scroll Area`

### 컴포넌트

`src/components/ui/scroll-area.tsx`. `@radix-ui/react-scroll-area`를 감쌉니다. 구성은 `ScrollArea` · `ScrollBar`입니다.

브라우저의 기본 스크롤바는 운영체제마다 다르게 생겼고 다크 모드에서 색이 따라오지 않습니다. Radix가 그 자리에 자기 스크롤바를 그려 토큰으로 칠할 수 있게 합니다. 굴리는 일 자체는 브라우저가 그대로 합니다.

`ScrollArea`는 **자기 높이를 정하지 않습니다.** 부모가 준 크기 안에서만 동작합니다. 그 사실이 이 컴포넌트를 잘못 쓰는 가장 흔한 방식이라 지침의 첫 줄에 둡니다.

### 축

| 축 | 값 |
|---|---|
| `orientation` | `vertical` · `horizontal` · `both` |
| `visibility` | `hover` · `always` |

`visibility`는 Radix의 `type` prop(`hover`·`always`·`scroll`·`auto`) 중 이 시스템이 쓰는 두 값입니다. `scroll`과 `auto`는 축에 두지 않습니다 — 어드민에서 고를 일이 없고, 축에 늘어놓으면 네 칸 중 둘이 같아 보입니다. prop 자체는 Radix 것이 그대로 있습니다.

격자의 각 칸은 높이를 정한 상자 안에 넘치는 내용을 담습니다. 폭은 `w-full max-w-*`로 두어 좁은 화면에서 줄어듭니다.

### 구조 (Anatomy)

Viewport · Content · Scrollbar · Thumb

### 지침

- **높이나 너비를 정한 자리에만 쓴다** — 스크롤 영역은 자기 크기를 스스로 정하지 않습니다. 부모가 크기를 주지 않으면 아무것도 굴러가지 않고 내용이 그대로 늘어납니다
- **페이지 전체를 감싸지 않는다** — 브라우저의 스크롤을 대신하면 브라우저가 되돌려 주던 스크롤 위치가 사라집니다
- **가로로 잘린다는 것을 보인다** — 가로 스크롤은 세로보다 알아채기 어렵습니다. 오른쪽 끝에 그림자나 흐림을 두어 더 있다는 것을 알립니다
- **늘 보일 자리를 정한다** — `hover`로 두면 마우스가 없는 화면에서 '더 있다'는 신호가 사라집니다. 목록이 굴러간다는 사실 자체가 중요한 자리에는 `always`를 씁니다

### 사용 예 (Usage)

Sheet의 본문 · 긴 목록이 든 Popover · 넓은 표 · 로그 보기

### 예외 상황 (Cases)

내용이 짧은 경우 · 가로·세로 둘 다 넘치는 경우 · 스크롤바를 늘 보이는 경우 · 좁은 화면

---

## 6. `Command`

### 컴포넌트

파일 셋입니다.

**`src/lib/command-filter.ts`** — 거르고 묶는 순수 함수. 이 회차에서 테스트가 실제로 지킬 수 있는 코드가 여기입니다.

```ts
export type CommandEntry = {
  value: string
  label: string
  /** 이 항목이 속한 묶음의 이름. 없으면 이름표 없는 묶음에 담긴다 */
  group?: string
  /** 사람이 실제로 치는 다른 이름들. 이름과 함께 훑는다 */
  keywords?: string[]
  disabled?: boolean
}

export type CommandSection = { label: string; entries: CommandEntry[] }

export function filterCommandEntries(entries: CommandEntry[], query: string): CommandEntry[]
export function groupCommandEntries(entries: CommandEntry[]): CommandSection[]
```

거르는 규칙은 `filterOptions`와 같습니다 — 공백을 걷고 대소문자를 가리지 않고 **포함**으로 맞추고 원본 순서를 지킵니다. 다른 것은 훑는 자리입니다. `filterOptions`는 `label` 하나만 보는데, `Command`는 `keywords`까지 함께 봐야 합니다. 이 저장소가 그 별칭에 기대고 있다는 증거가 이미 있습니다 — `registry.ts`의 모든 컴포넌트가 `aliases`를 들고 있고, 그것이 없으면 '모달'로 `Dialog`가 찾히지 않습니다.

그래서 `filterOptions`를 넓히지 않고 함수를 따로 둡니다. 넓히면 `ComboboxOption`이 함께 넓어져 `Combobox`가 쓰지 않는 필드를 알게 되고, `filter-options.json` payload를 다시 구워 내보내야 합니다. 규칙이 같다는 것은 두 파일의 주석이 서로를 가리켜 말합니다.

묶는 규칙은 **처음 나온 순서**입니다. `group`이 없는 항목은 이름표가 빈 묶음(`label: ''`)에 담기고, 그 묶음은 첫 무묶음 항목이 있던 자리에 놓입니다. 이름표가 비면 화면에 머리글을 그리지 않습니다.

**`src/components/ui/command.tsx`** — 표면. 두 가지 모양을 내보냅니다.

- `Command` — 검색 칸과 걸러진 목록. 페이지 안에 그대로 놓습니다
- `CommandDialog` — `Dialog` 안에 놓인 같은 것. `showClose={false}`로 두고 `DialogTitle`을 화면에서 감춘 채로 둡니다(`Dialog`는 이름이 없으면 '이름 없는 대화상자'로 읽힙니다 — `Combobox`의 `PopoverContent`에서 이미 같은 결론에 이르렀습니다)

`Command`는 자료를 받는 컴포넌트입니다(`entries`). 조각을 조립하는 형태로 두지 않습니다 — 거르기·묶기·짚은 항목 옮기기가 한 주인 아래에 있어야 위아래 이동이 묶음 경계를 넘어 이어집니다. `Combobox`와 `SearchDialog`가 둘 다 같은 이유로 그 모양입니다.

키보드는 `Combobox`와 같은 방법으로 직접 다룹니다 — `activeIndex` 하나로 짚은 자리를 들고, 검색 입력의 `aria-activedescendant`가 그 항목의 id를 알립니다. 마우스 hover도 같은 `activeIndex`를 옮깁니다.

**묶음의 머리글은 제목 요소가 아닙니다.** `role="group"`과 `aria-labelledby`로 잇고 머리글 자체는 `div`로 그립니다. `h3`을 쓰면 `assignHeadingIds`가 그것을 문서의 절로 보고 목차에 올립니다 — `Command`는 포털을 쓰지 않고 `main` 안에 그대로 놓이기 때문입니다. `SearchDialog`가 `h3`을 쓰고도 멀쩡한 것은 Radix가 그 표면을 `document.body`로 포털해 `main` 바깥에 두기 때문이고, 그 사정이 `Command`에는 없습니다.

**`src/lib/command-filter.test.ts`** — 위 두 함수의 규칙.

### 축

| 축 | 값 |
|---|---|
| `state` | `default` · `filtered` · `empty` |

세 값 모두 격자 안에서 그대로 보입니다 — `Command`가 포털을 쓰지 않고, `defaultQuery`를 받아 질의가 있는 상태로 그릴 수 있기 때문입니다. `default`는 질의가 비어 전체가 보이는 모습, `filtered`는 질의로 좁혀진 모습, `empty`는 맞는 것이 없는 모습입니다.

`CommandDialog`는 축에 두지 않습니다. 열린 표면은 트리거의 변형이 아니라 다른 표면이고, `Dialog`가 이미 같은 결론에 이르렀습니다. Usage에서 눌러 엽니다.

### 구조 (Anatomy)

Search · List · Group label(선택) · Item · Empty message

### 지침

- **Combobox와 구별한다** — 값을 골라 폼에 담으면 Combobox입니다. 어딘가로 가거나 무언가를 실행하면 Command입니다
- **빈 화면이 무엇을 칠 수 있는지 가르친다** — 질의가 비었을 때 전체를 쏟지 않고 자주 쓰는 것이나 최근 것을 보입니다
- **묶음은 이름표지 칸막이가 아니다** — 위아래 이동은 묶음 경계를 넘어 이어집니다. 묶음마다 멈추면 아래쪽 묶음에 손이 닿지 않습니다
- **별칭을 항목에 함께 태운다** — 이름만으로는 사람이 치는 말에 닿지 않습니다. '모달'로 Dialog를 찾으려면 항목이 그 말을 들고 있어야 합니다

### 사용 예 (Usage)

빠른 이동 · 동작 실행 · 표에서 보일 열 고르기 · 전역 검색

### 예외 상황 (Cases)

결과가 없는 경우 · 항목이 아주 많은 경우 · 묶음이 하나뿐인 경우 · 좁은 화면

---

## 문서에 반영되는 것

`registry.ts`에 여섯 `ComponentMeta`를 더합니다. `addedIn`과 `changedIn`은 `v0.12.0`, `status`는 `stable`, `verified`는 `false`로 두었다가 브라우저로 확인한 뒤 올립니다.

카테고리 안의 자리는 이름순입니다. `nav-config.test.ts`의 「묶음 안의 문서는 이름순이다」가 그것을 지키고, 「각 묶음의 문서가 그 카테고리의 컴포넌트와 일대일로 맞물린다」가 `registry.ts`의 순서와 LNB의 순서를 함께 묶습니다. 그래서 **`registry.ts` 안에서도 같은 자리**여야 합니다.

| 카테고리 | 새 컴포넌트가 들어가는 자리 |
|---|---|
| Actions | `Dropdown Menu` 뒤 (`Toggle`) |
| Navigation | `Breadcrumb` 뒤, `Pagination` 앞 (`Command`) |
| Data Display | `Card` 뒤 (`Collapsible`), `Description List` 뒤·`Separator` 앞 (`Scroll Area`) |
| Feedback | `Alert` 뒤·`Dialog` 앞 (`Alert Dialog`), `Progress` 뒤·`Skeleton` 앞 (`Sheet`) |

`registry.json`에 여섯 `registry:ui` 항목과 순수 함수 하나(`command-filter`)를 더하고, `adminds` 묶음이 서른여덟을 모두 가리키게 합니다. `registry-parity.test.ts`가 양방향으로 지키고, 구운 payload를 소스와 바이트로 견주므로 **`npm run registry`를 돌려야 초록이 됩니다.**

`releases.ts`에 `v0.12.0` 항목을 더합니다.

숫자를 손으로 적어 둔 곳 둘을 함께 고칩니다 — `registry.json`의 `adminds` 항목 설명("토큰과 컴포넌트 서른두 개를 한 번에 가져온다")과 `README.md`의 받아 가는 명령 옆 주석("토큰과 32개 전부").

`patterns.ts`의 `destructive-confirm` 항목은 `purpose`와 `structure`가 `Alert Dialog`를 가리키게 고치고 `changedIn`을 올립니다.

## 범위 밖

- **`SearchDialog`를 `Command` 위로 옮기는 일.** 이 작업대의 검색 결과 한 줄은 제목·강조 표시·요약·경로·New 배지를 함께 그립니다. 그 그리는 방식을 `Command`가 알게 하면 제품 컴포넌트가 이 문서 사이트의 사정을 알게 되고, 반대로 `Command`에 맞추면 검색 결과가 납작해집니다. 둘이 나눠 갖는 것은 `Dialog`와 상호작용 규칙이지 항목의 생김새가 아닙니다. 다음 회차의 검토 항목으로 남깁니다
- `Data Table` · `Context Menu` · `Menubar` · `Resizable` — 다음 회차 이후
- 접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림) — 별도 회차
- `useMeasuredTokens` 중복 해소

## 전역 제약

- 작업 브랜치는 `v0.12.0`. `main`에 직접 커밋하지 않습니다
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- **언어 규칙** — 구조를 가리키는 이름은 영문, 설명은 한국어. 방향·순서를 가리키는 낱말과 제품 이름은 한국어
- 화면에 나오는 목록·순서·값·날짜를 손으로 적지 않습니다
- 전시 컴포넌트(`src/components/docs/*`)는 구체적 UI 컴포넌트를 import하지 않습니다. 제품 컴포넌트(`src/components/ui/*`)는 문서 시스템의 표시를 알지 않습니다
- **17px 이하 글자는 4.5:1을 넘어야 합니다.** 18px 이상 또는 14px 이상 굵은 글씨는 3:1. 재지 않고 어림잡지 않습니다
- **모달을 열린 채로 마운트하지 않습니다**
- 예시 안의 가짜 화면 제목은 `<h4>`를 씁니다. `<h3>`을 쓰지 않습니다 — `assignHeadingIds`(`src/lib/heading-id.ts`)가 `main` 아래의 모든 `h2`·`h3`을 고정 목차로 쓸어 담습니다
- 줄어들 수 없는 고정 폭을 두지 않습니다. `w-full max-w-*`를 씁니다
- 서식은 손으로 맞춥니다 — 작은따옴표, 세미콜론 없음. **`prettier --write`를 돌리지 않습니다.** 이 저장소에는 prettier 설정이 없습니다
- `public/r/*.json`을 손으로 고치지 않습니다. `npm run registry`를 돌립니다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않습니다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않습니다.** 이 프로젝트가 모든 회차에서 가장 자주 낸 결함입니다. 확인하지 않은 주장은 넣지 않습니다
- **이 하네스는 키보드 동작을 검증할 수 없습니다** — 실제 키 입력이 쓸 만한 `keydown`을 만들지 못하고(`Enter`가 `code: ""`·`keyCode: 0`으로 도착합니다), 합성한 `Escape`는 Radix 층을 닫지 못합니다. 키보드 동작은 소스로 추론하고 그렇게만 적습니다. **하네스를 보정하려고 제품 코드를 고치지 않습니다**
- 각 Task는 `npm run build`와 `npm test` 통과를 완료 조건에 포함합니다
