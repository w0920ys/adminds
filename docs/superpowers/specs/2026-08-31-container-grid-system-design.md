# Container Grid System 설계

## 배경

사용자 요청: "지금 adminds을 적용시킨 모먹지 어드민에서는 container가 column별로 잘 나뉘어있지 않아서 카드가 일관성 있게 나열되고 있지 않음. app shell (lnb)가 있는 상태에서 container는 어떤 grid로 나눌지 계획해서 시각화해줘."

`momeokji-admin/src/App.tsx`를 실측한 결과, 섹션마다 grid 관련 값을 손으로 따로 짓고 있었다:

```
grep -o "grid-cols-[a-z0-9\[\]_]*|gap-[0-9]*|px-[0-9]* py-[0-9]*" 결과
33  gap-4
12  grid-cols-1
 9  grid-cols-3
 9  grid-cols-2
 3  px-6 py-8
 3  grid-cols-4
 3  gap-6
 3  gap-10
 2  gap-3
 1  grid-cols-[280px_1fr]
 1  grid-cols-6
```

`grid-cols` 6가지, `gap` 5가지가 근거 없이 섞여 있고, 섹션마다 카드 폭이 화면마다 다르게 보인다. `AppShell`의 `main`은 의도적으로 padding·max-width·grid를 정하지 않는 빈 상자다(`min-h-0 min-w-0 flex-1 md:overflow-y-auto`) — 콘텐츠 레이아웃은 전적으로 소비하는 쪽(momeokji-admin)의 몫으로 남아 있고, 지금까지 그 몫이 일관되게 채워지지 않았다.

기존 `2026-08-29-foundations-layout-design.md`는 "통일된 grid 시스템이나 breakpoint 토큰은 아직 없다"는 사실을 있는 그대로 문서화하는 데 그쳤고, 토큰화·시스템화는 명시적으로 별도 스펙으로 미뤄뒀다("필요해지면 별도 스펙으로 다룬다"). 이 스펙이 그 후속이다.

이 작업은 v0.25.0까지의 컴포넌트 이식 작업과 무관한 별개 하위 시스템이라 독립된 스펙·플랜 사이클로 다룬다.

## 범위

**adminds**: `src/routes/foundations/LayoutPage.tsx`의 "Content width"·"Grid" 두 섹션을 이 시스템으로 교체한다. 새 컴포넌트는 만들지 않는다 — 사용자가 명시적으로 "컴포넌트로 만들지 않고 container의 column방식을 도입할 수 있도록 layout > grid system을 도입해"라고 정했다. 결과물은 그대로 복사해 쓸 수 있는 **Tailwind 클래스 문자열**이지 JSX 컴포넌트가 아니다. `tokens.css`에 새 CSS 커스텀 프로퍼티도 추가하지 않는다 — Tailwind가 이미 `grid-cols-1~12`·`col-span-1~12`를 기본으로 제공해 토큰화할 값 자체가 없다.

**momeokji-admin**: 같은 라운드에서 `src/App.tsx`(그리고 필요하면 `src/pages/*.tsx`)의 기존 grid 조합을 아래 recipe로 교체한다. 데이터·로직은 건드리지 않는다.

## 핵심 구조 — 컨테이너 하나 · 행 하나 · span 다섯 가지

사용자가 시각화(Artifact)를 검토하고 "진행"으로 승인한 안이다.

### 1. 페이지 컨테이너 (세로 리듬)

```
<div className="flex flex-col gap-10 px-6 py-8">
```

- `px-6`(24px): `PageHeader`가 이미 쓰는 값과 momeokji의 기존 다수 사례(3곳)에서 그대로 가져왔다.
- `gap-10`(40px): 섹션(카드 묶음) 사이 세로 간격. 기존 다수 값(3곳)과 일치한다.
- `py-8`(32px)
- **최대폭을 두지 않는다.** `LayoutPage`가 문서 사이트 본문에 쓰는 `max-w-2xl`/`max-w-6xl`은 줄글 가독성용이다 — 표·차트가 중심인 어드민 대시보드는 폭을 넓게 쓸수록 유리해 의도적으로 상한을 두지 않는다.

### 2. 그리드 행 (카드가 들어가는 자리)

```
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
```

- `gap-4`(16px): 기존 최다 값(33곳)을 그대로 표준화했다. 모든 breakpoint·모든 recipe에서 공통이다 — recipe는 폭(span)만 바꾸고 간격은 건드리지 않는다.
- **모바일(&lt;640px)**: `grid-cols-1` — 항상 1칸.
- **sm(≥640px)**: `grid-cols-2` — 2칸.
- **lg(≥1024px)**: `grid-cols-12` — 진짜 12칸 그리드.
- **md(≥768px)에서 별도 단계를 두지 않는다.** `AppShell`의 LNB(`md:w-56` = 224px)가 md부터 항상 고정으로 뜬다 — 뷰포트가 768px여도 콘텐츠 실폭은 544px 남짓이라 sm의 2칸을 유지하는 편이 더 붐비지 않는다. lg(1024px)에 가서야 콘텐츠 실폭이 800px 근처로 넉넉해져 12칸이 의미를 가진다. 이 판단은 새 breakpoint를 만들지 않고 기존 sm·lg 중 어느 쪽에 각 전환을 배정할지만 고른 것이다(`LayoutPage`의 "임의로 새 breakpoint 값을 만들지 않는다" 원칙을 그대로 지킨다).

### 3. 카드 span 다섯 가지

카드마다 아래 중 하나를 이름으로 고른다. 다섯 개 다 모바일→sm→lg 세 단계를 이미 포함한 완성형 클래스이고, 소비하는 쪽은 값을 계산하지 않고 이름만 고르면 된다.

| Recipe | 클래스 | lg 기준 폭 | 실제 매핑 |
|---|---|---|---|
| **Full** | `col-span-1 sm:col-span-2 lg:col-span-12` | 12/12 | 표, 긴 카드 — 늘 한 줄 전체 |
| **Half** | `col-span-1 sm:col-span-1 lg:col-span-6` | 6/12 | 설정 카드 2개처럼 sm부터 2-up |
| **Third** | `col-span-1 sm:col-span-2 lg:col-span-4` | 4/12 | 3-up 카드 목록 — lg 전까지 풀와이드로 쌓임 |
| **Quarter** | `col-span-1 sm:col-span-1 lg:col-span-3` | 3/12 | KPI 타일 — 기존 `grid-cols-2 → lg:grid-cols-4` 스켈레톤과 정확히 일치 |
| **Two-thirds + One-third** (짝) | `lg:col-span-8` + `lg:col-span-4` (둘 다 `col-span-1 sm:col-span-2`) | 8+4/12 | 유입 섹션의 차트+도넛 — 기존 `lg:col-span-2`(3칸 중 2칸) 관례를 12칸 기준으로 formalize |

Half·Quarter는 sm에서부터 2-up이 되고, Third·Two-thirds/One-third는 lg 전까지 풀와이드로 쌓인다 — 콘텐츠가 무거울수록(차트·표) 좁은 화면에서 억지로 나누지 않는다는 원칙을 다섯 개가 공유한다.

### momeokji-admin 실제 화면 매핑

Artifact에서 사용자가 검토한 표를 그대로 옮긴다.

| 화면 | 추천 recipe | 기존 코드 |
|---|---|---|
| 홈 KPI 타일 8개 (`HomeSection`) | Quarter | `grid-cols-2 gap-4 lg:grid-cols-4` (이미 일치) |
| 유입 — 추세 차트 + 도넛 (`acquisition`) | Two-thirds / One-third | `grid-cols-1 gap-4 lg:grid-cols-3` + `lg:col-span-2` |
| 유입 — UTM 표 (`acquisition`) | Full | `Card` 단독 |
| 설정 카드 2개 (`settings`) | Half | `grid-cols-1 gap-4 lg:grid-cols-2` |
| 디자인 시스템 컴포넌트 목록 (`design-system`) | Third | `grid-cols-3` 계열 |

App.tsx·pages/*.tsx의 나머지 grid 사용처(설정 섹션 스켈레톤의 `lg:grid-cols-2`, 이벤트 카탈로그 등)는 구현 단계에서 하나씩 다섯 recipe 중 가장 가까운 것으로 옮긴다. 정확히 대응되지 않는 특이 케이스(`grid-cols-[280px_1fr]`처럼 라벨+값 2칸 패턴)는 이 시스템의 대상이 아니다 — `LayoutPage`가 이미 별도로 다루는 `grid-cols-[auto_1fr]` 패턴 그대로 둔다.

## 영향받는 파일

**adminds**
- 수정: `src/routes/foundations/LayoutPage.tsx` — "Content width"·"Grid" 섹션을 위 표·클래스로 교체. "통일된 grid 시스템이나 breakpoint 토큰은 아직 없다"는 기존 문구를 이 시스템 설명으로 바꾼다. Breakpoints·Guidelines 섹션은 원칙(새 breakpoint 금지, 임의 값 대괄호 금지)이 그대로 유효하므로 손대지 않는다.

**momeokji-admin**
- 수정: `src/App.tsx` — 위 매핑표의 5개 지점(홈 KPI 타일, 유입 차트+도넛, 유입 UTM 표, 설정 카드 2개, 디자인 시스템 컴포넌트 목록)과 각 섹션의 페이지 컨테이너(`flex flex-col gap-10 px-6 py-8`)를 교체.
- 조사 필요: `src/pages/*.tsx`에 남은 grid 사용처(HomeSection.tsx·SettingsSection.tsx·DesignSystemSection.tsx·EventCatalogSection.tsx·UsersSection.tsx) — 플랜 작성 시 각 파일을 열어 실제 grid 지점을 다시 실측한다(이 스펙의 grep 결과는 App.tsx 기준이라 pages/ 하위는 아직 세지 않았다).

## 테스트

- adminds: `npm test`(registry-parity 등 기존 스위트, Layout 페이지는 별도 테스트 없음) · `npm run build`(tsc+vite) · 개발 서버에서 Breakpoints 표·새 Grid 섹션이 깨지지 않고 렌더링되는지 눈으로 확인.
- momeokji-admin: 이 저장소에 어떤 테스트 스위트가 있는지 플랜 작성 시 momeokji-admin의 `package.json`을 열어 확인한다(현재 세션은 adminds 기준으로 구성돼 있어 momeokji-admin의 테스트 커맨드를 확정하지 않았다). 최소한 `npm run build` 통과와, 다섯 recipe를 적용한 각 섹션을 실제 브라우저(모바일·sm·lg 폭)에서 눈으로 확인하는 절차는 플랜에 반드시 포함한다.

## 명시적으로 다루지 않는 것

- 새 `Container`/`Grid` React 컴포넌트 — 사용자가 명시적으로 배제했다.
- `tokens.css`에 breakpoint·grid 커스텀 프로퍼티 신설 — Tailwind 기본 유틸리티로 충분해 토큰화할 대상이 없다.
- `grid-cols-[auto_1fr]`류 라벨+값 2칸 패턴, `grid-cols-[280px_1fr]`류 고정폭 사이드 레이아웃 — 카드 나열이 아닌 다른 문제라 이 시스템의 대상이 아니다.
- md(768px) 전용 별도 grid 단계 — LNB를 고려해 의도적으로 만들지 않았다.
