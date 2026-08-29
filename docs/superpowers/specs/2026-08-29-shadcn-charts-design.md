# shadcn 차트 갤러리 기반 Chart 컴포넌트 설계

## 배경

이전 스펙(`2026-08-29-chart-components-design.md`, 폐기)은 `adminds-starter`(momeokji-admin에서 실전 검증된 소스)를 원본 삼아 알맹이 컴포넌트 5종을 이식하는 방향이었다. 사용자가 방향을 바꿨다 — shadcn 공식 차트 갤러리(`ui.shadcn.com/charts`)를 원본으로 삼고, shadcn의 실제 코드 스타일(Card로 감싼 완성형 블록)을 그대로 따르며, LNB에 Chart라는 별도 카테고리를 새로 만들어 그 아래 순차적으로 넣는다.

## 실측 — shadcn 차트 갤러리 전체

`ui.shadcn.com`의 각 차트 계열 페이지를 브라우저로 열어 iframe `src`에서 실제 레지스트리 이름을 직접 긁어 확인했다(마케팅 페이지의 표시 이름은 전부 "Bar Chart" 등으로 뭉뚱그려져 있어 페이지 텍스트만으로는 구별이 안 된다):

| 계열 | 개수 | 실제 항목 |
|---|---|---|
| Bar | 10 | default·horizontal·multiple·stacked·label·label-custom·mixed·active·negative·interactive |
| Line | 10 | default·linear·step·multiple·dots·dots-custom·dots-colors·label·label-custom·interactive |
| Area | 10 | default·linear·step·legend·stacked·stacked-expand·icons·gradient·axes·interactive |
| Pie | 11 | simple·separator-none·label·label-custom·label-list·legend·donut·donut-active·donut-text·stacked·interactive |
| Radar | 12 | default·dots·lines-only·label-custom·grid-custom·grid-none·grid-circle·grid-circle-no-lines·grid-circle-fill·grid-fill·multiple·legend |
| Radial | 6 | simple·label·grid·text·shape·stacked |
| Tooltip | 9 | default·indicator-line·indicator-none·label-custom·label-formatter·label-none·formatter·icons·advanced |

**합계 68개.** shadcn 소스 몇 개를 직접 읽어 확인한 공통 골격: `Card`(`CardHeader`에 `CardTitle`+`CardDescription`, `CardContent`에 `ChartContainer`, `CardFooter`에 추세 한 줄 + 설명 한 줄) 안에 recharts 차트(`BarChart`/`LineChart`/`AreaChart`/`PieChart`/`RadarChart`/`RadialBarChart`)를 얹는다. `chartConfig`(`ChartConfig` 타입, 키마다 `label`+`color`)로 시리즈를 정의하고, `var(--color-<key>)`가 `ChartStyle`이 심는 CSS 변수를 가리킨다 — 이 부분은 이미 Task 1이 그대로 이식해 뒀다.

## 결정 1 — Card로 감싼 완성형 블록 (기존 관례의 의도적 예외)

지금 adminds의 42개 컴포넌트는 전부 "알맹이만 제공, 조합은 호출부 몫"이다(Button은 버튼만, Table은 표만). **차트는 이 관례의 의도적 예외다** — 사용자가 명시적으로 "shadcn처럼 Card 통채로"를 골랐다. shadcn 자신도 차트를 `registry:ui`(원시 부품)가 아니라 데모 그대로 갖다 쓰는 완성형 블록으로 다룬다 — 제목·설명·추세 표시까지 포함된 하나의 화면 조각이 차트라는 물건의 실제 쓰임에 더 맞다는 판단이다. 이 예외는 Chart 카테고리에만 적용되고 다른 41개 컴포넌트의 관례를 바꾸지 않는다.

## 결정 2 — 68개가 아니라 계열당 1개 + Properties 축

68개를 전부 독립 컴포�넨트로 만들면 유사 변형끼리 중복이 심하다 — 예를 들어 Radar의 grid 6종은 `PolarGrid`의 `gridType`/`className` 조합 하나만 다르다. adminds는 이미 이런 변형을 "컴포넌트 하나 + Properties 축"으로 다루는 체계가 있다(Badge의 `variant`, Card의 `padding` 등). 그래서:

- **계열당 컴포넌트 1개, 총 6개**: Chart Bar · Chart Line · Chart Area · Chart Pie · Chart Radar · Chart Radial.
- **Tooltip 9종은 별도 7번째 컴포넌트로 만들지 않는다** — 툴팁 커스터마이징은 특정 차트 유형에 속한 게 아니라 모든 계열에 걸쳐 있는 축이다. `indicator`(dot/line/dashed), `hideLabel`, 커스텀 `formatter` 같은 실제 옵션들은 각 계열 컴포넌트의 Properties 축이나 Guidelines로 흡수한다.
- **68개 전부를 토글 가능한 옵션으로 재현하지는 않는다.** 각 계열마다 실제로 자주 쓰이고 서로 뚜렷이 구별되는 변형만 Properties 축으로 넣고(계열당 2~4개 축), 나머지 — 특히 폭이 좁은 grid 스타일 변형들이나 날짜 범위 선택 UI가 딸린 "interactive" 계열 — 는 Usage·Cases의 정적 예시로 한두 개만 보이거나 아예 이번 범위에서 뺀다. 이건 축소가 아니라 정직한 스코프다 — 이 프로젝트의 YAGNI 원칙과 같다.

## 결정 3 — 새 카테고리 `chart`

`src/data/registry.ts`의 `ComponentCategory`에 `'chart'`를 추가한다. `categoryOrder`에서 `'data-display'` 바로 뒤, `'feedback'` 앞에 놓는다(차트도 데이터를 보이는 방법 중 하나라는 점에서 인접). `categoryLabel.chart = 'Chart'`. LNB의 Components 섹션에 Actions·Inputs·Navigation·Data Display·**Chart**·Feedback 여섯 번째 묶음이 새로 생긴다.

## 결정 4 — `chart.tsx` 스캐폴드를 shadcn 공식 버전으로 올린다

Task 1이 이미 이식한 `chart.tsx`는 momeokji-admin이 다시 줄인 버전이라 `nameKey`·`labelKey`·`formatter`·`labelFormatter`·`hideIndicator`·아이콘 지원이 빠져 있다. shadcn 공식 소스를 직접 읽어 확인했고(`ui.shadcn.com/r/styles/new-york-v4/chart.json`), 68개 예시 다수가 이 기능들을 실제로 쓴다. **`chart.tsx`를 공식 버전으로 다시 이식한다** — 이번에도 이 저장소의 두 규칙을 적용해 옮긴다: `text-xs`→`text-12`, 색 스와치의 `rounded-[2px]`→`rounded-sm`(Task 1 리뷰가 이미 잡은 것과 같은 두 규칙). `min-w-[8rem]`도 임의 값이라 `min-w-32`(정확히 같은 값, 8rem)로 옮긴다. `border-(--color-border) bg-(--color-bg)` 같은 Tailwind v4 파렌 문법 대신, 지금 코드가 이미 쓰는 `style={{ backgroundColor: color }}` 방식을 그대로 유지한다(같은 목적, 이 저장소에 이미 있는 패턴).

## 6개 컴포넌트 설계

각 컴포넌트는 `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`(이미 있는 `@/components/ui/card`)와 Task 1의 `ChartContainer` 등을 그대로 쓴다. `data`+`config`(`ChartConfig`, shadcn과 같은 모양)를 받는 제네릭 API로 짓는다 — momeokji-admin판처럼 `HBarDatum` 같은 계열 전용 타입을 새로 만들지 않는다.

### Chart Bar
- 다룸: default·multiple·stacked·negative(데이터가 음수를 포함하면 자동)·horizontal·label
- Properties: `orientation`(세로 막대 기본 / 가로 막대), `stacked`(켬/끔, 계열이 2개 이상일 때만 뜻이 있음), `showValueLabels`(켬/끔)
- Usage: 월별 방문자(단일 계열), 플랫폼별 방문자(2계열 스택)
- Cases: 순위 비교(가로 막대), 증감 포함(음수 값)
- 범위 밖: mixed(막대+선 혼합), active(막대 하나 강조), interactive(헤더의 기간 선택 버튼)

### Chart Line
- 다룸: default·multiple·dots·step·label
- Properties: `curveType`(monotone 기본 / step), `showDots`(켬/끔)
- Usage: 2주 추세(단일), 유료·무료 비교(2계열)
- Cases: 라벨 표시(포인트마다 값 라벨)
- 범위 밖: dots-custom/dots-colors(점 스타일 세부 변형), interactive

### Chart Area
- 다룸: default·linear·stacked·legend·gradient
- Properties: `stacked`(켬/끔), `gradient`(채움을 단색/그라데이션)
- Usage: 방문자 추이(단일), 유입경로별 누적(스택)
- Cases: 범례 포함
- 범위 밖: step, stacked-expand(100% 스택), icons, axes, interactive

### Chart Pie
- 다룸: simple·donut·legend·label
- Properties: `variant`(pie 기본 / donut), `showLegend`(켬/끔)
- Usage: 브라우저 점유율(도넛+범례)
- Cases: 라벨 포함
- 범위 밖: separator-none·label-custom·label-list·donut-active·donut-text·stacked·interactive(세부 변형 다수라 대표만 남김)

### Chart Radar
- 다룸: default·multiple·grid 스타일 하나(원)·legend
- Properties: `gridType`(polygon 기본 / circle), `showLegend`(켬/끔)
- Usage: 역량 비교(단일), 두 그룹 비교(2계열)
- 범위 밖: dots·lines-only·label-custom·grid-none·grid-circle 세부 변형(no-lines·fill 등, 6종 중 1종만 대표로 남김)

### Chart Radial
- 다룸: simple·label·stacked
- Properties: `showLabel`(켬/끔)
- Usage: 목표 달성률(단일)
- Cases: 여러 항목 스택
- 범위 밖: grid·text·shape(세부 변형)

## 영향받는 파일 (개요, 정확한 목록은 플랜에서)

- 신규: `src/components/ui/chart-bar.tsx`·`chart-line.tsx`·`chart-area.tsx`·`chart-pie.tsx`·`chart-radar.tsx`·`chart-radial.tsx`, 각 문서 페이지 6개
- 수정: `src/components/ui/chart.tsx`(shadcn 공식 버전으로 교체), `src/data/registry.ts`(새 카테고리 `chart` + 컴포넌트 6개), `registry.json`, `src/routes/routes.tsx`, `src/components/layout/nav-config.ts`(새 Chart 묶음), `README.md`
- 되돌림: Task 2에서 지었던 momeokji-admin 스타일 `chart-bar-horizontal.tsx`(이미 브랜치에서 리셋함)

## 테스트

기존 컴포넌트와 동일하게 렌더링 테스트는 없다. `registry-order.test.ts`가 새 카테고리를 포함한 `categoryOrder`와 `nav-config.ts`의 묶음 순서 일치를 이미 자동으로 검증한다(카테고리를 추가하는 것만으로 테스트가 새 요구를 자동으로 얹는다 — 손으로 새 테스트를 만들 필요 없음). `registry-parity.test.ts`가 `adminds` 번들 갱신을 강제한다. 시각 검증은 `npm run build` + 개발 서버 확인.
