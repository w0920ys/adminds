# Chart 컴포넌트 6종 이식 설계

## 배경

이전에 사용자가 로드맵 순서를 "새 컴포넌트 먼저, 차트는 그다음"으로 정해뒀고, 남은 로드맵 컴포넌트(Context Menu·Menubar·Resizable)가 v0.16.0으로 끝나면서 차례가 됐다.

"차트/다이어그램" 요청은 실제로는 서로 다른 기술 스택이 필요한 두 하위 시스템(데이터 차트=차팅 라이브러리, 다이어그램=노드·엣지 레이아웃 라이브러리)이라 분리했다 — **이 스펙은 데이터 차트만** 다룬다. 다이어그램은 다음 회차.

**결정적으로, 이번 작업은 새로 설계하는 게 아니라 이식이다.** 별도 저장소(`adminds-starter`)에 `momeokji-admin`(실제 서비스)이 만들어 쓰고 있는 검증된 소스가 `UPSTREAM-COMPONENTS.md`에 스펙과 함께 남아 있다. 그 문서가 적어 둔 10개 컴포넌트(차트 스캐폴드+5종, StatCard·TrendBadge·AppShell·PageHeader) 중 **차트 6개만** 이번 회차 범위로 확정했다 — 나머지 4개는 차트가 아닌 범용 대시보드 부품이라 다음 회차.

## 소스와 원칙

`adminds-starter`의 `src/components/ui/chart*.tsx` 6개 파일이 원본이다. 코드에는 이미 겪은 실패 모드 세 가지가 방어 로직과 주석으로 남아 있고, **그대로 보존한다**(리팩터링 중 되돌리지 말 것):

1. **ChartLine의 `xKey` 기본값 `'date'`** — `'x'`로 뒀다가 실제 데이터의 필드명과 안 맞아 축·범례는 그려지는데 곡선만 안 보이는(recharts가 도메인을 빈 것으로 계산) 버그를 겪었다.
2. **ChartFunnel의 단계 라벨이 `content` 렌더 함수** — recharts `LabelList`의 `formatter`는 값만 받고 인덱스를 안 줘서 "직전 단계 대비"를 계산할 수 없다. `formatter`로 되돌리면 이 컴포넌트의 존재 이유(단계-대-단계 비교)가 무너진다.
3. **ChartDonut의 범례가 라벨 한 줄 + 값·비율 보조 줄(2줄) 구조** — 한 줄에 다 넣으면 좁은 카드에서 라벨이 `flex-1`로 밀려 0px까지 찌그러져 사라지는 버그를 겪었다.

## 범위 — 6개

| 파일 | 등록 방식 | 문서 페이지 |
|---|---|---|
| `chart.tsx`(스캐폴드) | `registry:lib` | 없음 |
| `chart-line.tsx` | `registry:ui` | 있음 |
| `chart-bar-horizontal.tsx` | `registry:ui` | 있음 |
| `chart-bar-vertical.tsx` | `registry:ui` | 있음 |
| `chart-funnel.tsx` | `registry:ui` | 있음 |
| `chart-donut.tsx` | `registry:ui` | 있음 |

`chart.tsx`를 `registry:lib`로 등록하는 이유: `registry-parity.test.ts`가 `registry:ui` 항목만 `registry.ts`의 `ComponentMeta`와 양방향으로 맞춰야 한다고 강제한다(`src/lib/utils.ts`가 이미 이 자리에 있다 — 다른 컴포넌트가 딛고 서는 공유 기반이지 그 자체로 골라 쓰는 문서화 컴포넌트가 아니다). 5개 차트가 각자 `chart.json`을 `registryDependencies`에 걸어 두면 `adminds` 번들에도 자동으로 딸려 온다(지금 번들도 `tokens.json`/`utils.json`을 따로 top-level에 나열하지 않는 것과 같은 이유 — 이미 확인함).

StatCard·TrendBadge·AppShell·PageHeader — 이번 스펙 범위 밖. 다음 회차.

## 의존성·토큰

- **`recharts`**(`^3.10`, 신규 `dependency`) — 5개 `registry:ui` 항목 각자의 `dependencies`에 표시.
- **`tokens.css`** — `--chart-1..6`(범주형 6색, 라이트/다크 각각 값 다름) + `--chart-grid`(`var(--border)`) + `--chart-axis`(`var(--muted-foreground)`) 추가. **기존 `@theme inline` 블록에 합치지 않는다** — 안 쓰인 유틸리티 클래스 토큰(`bg-chart-2` 등)을 Tailwind v4가 최종 CSS에서 트리셰이킹해 버려 시리즈 절반이 무색으로 렌더되는 사고를 이미 겪었다(원본 주석에 기록됨). 별도 `@theme inline` 블록(`--color-chart-1..6`)을 두되, 지금 코드 경로에서는 아무 컴포넌트도 그 매핑을 쓰지 않는다 — 나중에 누군가 `bg-chart-N` 유틸리티 클래스를 직접 쓰고 싶을 때를 위한 자리만 남겨 둔다. 컴포넌트는 원시 `--chart-N`을 `var(--chart-N)`으로 직접 참조.
- **`src/lib/format.ts`**(신규) — `formatNumber`(ChartDonut이 씀)·`formatPercent`(ChartFunnel이 씀) 이식. `formatCompact`·`formatDelta`는 이번 회차가 안 쓰므로 넣지 않는다(StatCard·TrendBadge 회차에서 같은 파일에 추가) — YAGNI.

## registry.ts 항목 — 5개, `data-display` 카테고리

카테고리 안 이름순 삽입 위치: `Card`와 `Collapsible` 사이에 5개가 통째로 들어간다(`Chart`로 시작하는 이름끼리는 서로 이름순).

| id | name | 순서 |
|---|---|---|
| `chart-bar-horizontal` | Chart Bar Horizontal | 1 |
| `chart-bar-vertical` | Chart Bar Vertical | 2 |
| `chart-donut` | Chart Donut | 3 |
| `chart-funnel` | Chart Funnel | 4 |
| `chart-line` | Chart Line | 5 |

**purpose 초안** (플랜 작성 시 최종 확정):
- Chart Line — "시간에 따라 값이 어떻게 늘고 주는지 보인다. 여러 계열을 겹쳐 비교할 때도 쓴다."
- Chart Bar Horizontal — "항목을 순위로 비교한다. 이름이 길거나 항목 수가 적을 때 세로 막대보다 읽기 쉽다."
- Chart Bar Vertical — "짧은 카테고리의 분포를 보인다. 순서가 있는 구간을 좌에서 우로 읽을 때 쓴다."
- Chart Funnel — "여러 단계를 거치며 줄어드는 값을 보인다. 전체 대비가 아니라 바로 직전 단계 대비 전환율을 1차로 보인다."
- Chart Donut — "전체에서 각 항목이 차지하는 비율을 보인다. 조각 각도만으로 비교하게 두지 않고 값·비율을 범례에 함께 적는다."

## 문서 페이지 — Anatomy 생략, Properties는 거의 비움

- **Anatomy**: 5개 전부 빈 배열. recharts가 내부 SVG 마크업을 직접 소유해 우리 쪽 `data-anatomy` 속성을 박을 자리가 마땅치 않다. 이 프로젝트는 이미 Tooltip·Select에서 "정적으로 못 잡는 부위(포털·호버 전용)는 Anatomy에서 뺀다"는 선례가 있고, `ComponentPage`는 빈 섹션을 아예 렌더링하지 않는다(빈 섹션이 "미완성"으로 읽히지 않게 하는 기존 규칙) — 그러니 비워도 문서가 허전해 보이지 않는다.
- **Properties**: `ChartBarHorizontal`의 `perItemColor`(boolean)만 실제 축으로 문서화한다. 나머지 4개는 빈 배열 — Playground만 있는 형태로, 이미 Tooltip 페이지가 쓰는 패턴("Properties는 축이 없어 비어 있다")과 같다.
- **Playground 데이터**: `DataTablePage`처럼 `registry.ts`의 컴포넌트 목록을 재활용하지 않는다(숫자 데이터가 필요해 그 목록으로는 그럴듯한 예시가 안 나온다) — 각 페이지가 실제 대시보드에서 나올 법한 샘플 데이터를 지역 상수로 손수 만든다(예: ChartLine은 2주치 일별 유입, ChartBarHorizontal은 유입경로별 순위, ChartFunnel은 가입→활성화 단계).
- **Usage·Cases**: 실제 쓰임(추세·순위·분포·전환·비율)과 흔한 실수(예: ChartDonut을 좁은 카드에 넣을 때 범례가 안 찌그러지는지) 예시로 채운다 — 구체적인 항목은 플랜 작성 시 확정.
- **Guidelines**: 색 배정 규칙(등장 순서 고정, 절대 순환 안 함, 9번째부터는 호출부가 "기타"로 접음), 2개 이상 시리즈엔 항상 범례를 붙인다(색만으로 식별하게 두지 않음) 두 가지가 핵심 DO. DON'T는 상태색(info/success/warning/destructive)을 시리즈 색으로 재사용하지 않는다, `xKey`·`formatter` 관련 위 실패 모드 재현 금지.

## 영향받는 파일

- 신규: `src/components/ui/chart.tsx`, `chart-line.tsx`, `chart-bar-horizontal.tsx`, `chart-bar-vertical.tsx`, `chart-funnel.tsx`, `chart-donut.tsx`, `src/lib/format.ts`, `src/lib/format.test.ts`
- 신규: `src/routes/components/ChartLinePage.tsx` 외 4개
- 수정: `src/styles/tokens.css`(토큰 추가), `package.json`(recharts 의존성), `src/data/registry.ts`(5개 항목), `registry.json`(5개 `registry:ui` + 1개 `registry:lib` + `adminds` 번들 갱신), `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`, `README.md`(개수 문구)

## 테스트

기존 컴포넌트와 동일하게 렌더링 테스트는 없다(Vitest가 jsdom 없이 node 환경에서 돈다). `src/lib/format.ts`의 순수 함수(`formatNumber`/`formatPercent`)는 일반 유닛 테스트로 검증한다(이 저장소의 다른 `src/lib/*.test.ts`와 같은 패턴). 시각적 검증은 `npm run build` 통과와 개발 서버에서 실제 렌더링·다크 모드·좁은 화면(특히 ChartDonut 범례) 확인으로 한다. `registry-parity.test.ts`가 신규 항목 등록의 정합성(레지스트리 양방향 일치, `adminds` 번들 개수·의존성)을 지킨다.
