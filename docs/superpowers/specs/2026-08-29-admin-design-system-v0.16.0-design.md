# 어드민 디자인 시스템 v0.16.0 — 남은 로드맵 컴포넌트 설계

**Context:** v0.15.0(레이아웃/네비게이션 재구성)이 `main`에 배포됐다. v0.13.0 스펙이 처음부터 이 셋을 한 묶음으로 남겨 뒀다 — "무게가 다르다: 셋은 Radix 원시를 감싸는 일이고, Data Table은 어드민의 중심 화면이다." 사용자가 지정한 순서(레이아웃·네비게이션 → 남은 로드맵 컴포넌트 → 마무리 항목)의 두 번째 갈래다.

**동기:** `Context Menu`·`Menubar`·`Resizable` 셋 다 아직 완전 미착수다 — 대응하는 Radix/외부 패키지조차 설치돼 있지 않다. 사용자 확인을 거쳐 셋을 하나의 스펙·계획으로 묶는다.

**범위:** `src/components/ui/`에 새 파일 셋(`context-menu.tsx`·`menubar.tsx`·`resizable.tsx`)과 `src/routes/components/`에 문서 페이지 셋(`ContextMenuPage.tsx`·`MenubarPage.tsx`·`ResizablePage.tsx`), 그리고 등록에 필요한 기존 파일들(`registry.ts`·`registry.json`·`ComponentsIndex.tsx`·`nav-config.ts`) 수정. `DataTable`에 `Resizable`을 실제로 연결하는 일(열 너비 조절)은 범위 밖이다 — 지금 `DataTable`엔 너비 관련 코드가 전혀 없고, v0.13.0 스펙이 이미 "이후 회차" 몫으로 남겨 뒀다.

---

## 1. 아키텍처

세 컴포넌트 다 이번 회차에서는 **독립 데모**다 — 서로 데이터나 상태를 공유하지 않고, `DataTable` 등 기존 컴포넌트에 실제로 연결되지도 않는다.

- **Context Menu**·**Menubar**는 기존 `src/components/ui/dropdown-menu.tsx`(Radix 메뉴 계열의 스타일 기준)의 Content/Item/Separator/CheckboxItem/RadioGroup/Sub 스타일을 그대로 옮겨, 각각 `@radix-ui/react-context-menu`·`@radix-ui/react-menubar`를 감싼다. 우클릭으로 여는지(Context Menu) 클릭으로 여는지(Menubar)만 다르고 시각 스타일은 Dropdown과 동일하다.
- **Resizable**은 Radix 계열이 아니라 shadcn 생태계의 사실상 표준인 `react-resizable-panels`(새 의존성)를 쓴다. `Panel`/`PanelGroup`/`PanelResizeHandle`을 감싸고, 핸들 스타일(가운데 그립 아이콘, 호버·드래그 상태)을 새로 짠다.

새 npm 의존성 셋: `@radix-ui/react-context-menu`, `@radix-ui/react-menubar`, `react-resizable-panels`.

---

## 2. Context Menu

`@radix-ui/react-context-menu`를 감싼다. `dropdown-menu.tsx`와 API 모양이 거의 같다(Root/Trigger/Content/Item/Separator/CheckboxItem/RadioGroup/Sub) — 스타일 클래스를 그대로 옮겨 적용한다. `destructive` prop(위험 항목 표시, `dropdown-menu.tsx`의 관례 그대로)도 옮긴다.

**실사례**: DataTable 행을 우클릭하면 나오는 빠른 작업 메뉴(수정·복제·삭제 — 삭제는 `destructive`)로 보여준다. 실제 `DataTable`에 연결하지 않고(범위 밖), 문서 페이지 안에서 그 상황을 흉내 낸 정적 예시 표를 하나 그린다 — 이 시스템의 다른 컴포넌트 문서(예: `RadioPage`)가 실제 화면을 흉내 낸 정적 예시를 쓰는 것과 같은 방식이다.

---

## 3. Menubar

`@radix-ui/react-menubar`를 감싼다. Content/Item 스타일은 Dropdown과 거의 같되, Menubar 자체(가로로 늘어선 트리거 묶음)의 트리거 스타일은 새로 짠다(포커스/열림 상태 배경).

**실사례**: 일반적인 File/Edit/View 메뉴바 예시로 보여준다 — 파일(새로 만들기·열기·저장), 편집(실행 취소·다시 실행·잘라내기/복사/붙여넣기), 보기(확대/축소를 CheckboxItem으로 하나 포함해 그 변형도 함께 보여준다). 이 시스템이 실제로 쓰는 곳이 없어도, 컴포넌트 자체의 API를 보여주는 문서라는 점을 명시한다(shadcn 기본 예시와 같은 성격).

---

## 4. Resizable

`react-resizable-panels`의 `Panel`/`PanelGroup`/`PanelResizeHandle`을 감싼다.

**실사례**: 문서 페이지에 두 데모를 둔다 — 좌우 분할(왼쪽 목록·오른쪽 상세, 전형적인 마스터-디테일 배치)과 세로 분할 하나.

---

## 5. 등록

셋 다 기존 패턴을 그대로 따른다:
- `src/data/registry.ts`에 항목 추가(Anatomy·Properties 설명, `changedIn: 'v0.16.0'`)
- `registry.json`에 `registry:ui` 항목 추가, `npm run registry`로 `public/r/*.json` 굽기
- `ComponentsIndex.tsx`에 카드 추가
- `nav-config.ts`의 Components 섹션에 링크 추가(알파벳 순서 자리 확인), `updatedAt`은 오늘 실제 날짜

---

## 범위 밖

- `DataTable` 열 너비 조절 통합(Resizable을 실제로 연결하는 일) — 지금 `DataTable`엔 너비 관련 코드가 전혀 없다. 이후 회차 몫.
- Menubar의 메뉴 항목이 가리키는 실제 동작 배선(파일 저장 등) — 이 시스템에 그런 동작이 없다. Radix가 시각적 상호작용(열기/닫기/키보드 탐색)은 전부 처리한다.
- 세 컴포넌트 사이의 상호작용(예: Context Menu 안에 Resizable을 넣는 등) — 요청되지 않았다.

## 테스트 전략

이 시스템의 다른 UI 컴포넌트(`dropdown-menu.tsx` 등)와 동일하게 새 Vitest 테스트가 없다 — Vitest가 `node` 환경(jsdom 없음)이라 컴포넌트 렌더링 테스트를 쓰지 않는다. 검증은 `npm run build`(tsc+vite) 통과와 개발 서버에서 실제로 우클릭·메뉴 열기·키보드 탐색·패널 드래그까지 눌러 보는 것으로 한다.

## 자체 검토

**플레이스홀더 스캔:** 없음.
**내부 일관성:** 세 컴포넌트가 서로 다른 파일을 다루고 상태·데이터를 공유하지 않는다 — 충돌 없음.
**범위 점검:** 셋 다 "새 UI 원시 하나 + 문서 페이지 하나 + 등록"이라는 같은 모양의 작업이라 하나의 계획으로 묶기에 적절하다.
**모호성 점검:** Menubar의 실사례(일반 예시로), Resizable의 라이브러리 선택(`react-resizable-panels`), DataTable 통합 여부(범위 밖) — 전부 사용자 확인을 거쳐 하나의 해석으로 고정했다.
