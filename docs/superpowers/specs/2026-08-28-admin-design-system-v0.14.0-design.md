# 어드민 디자인 시스템 v0.14.0 설계 — 본문을 읽을 수 있는 크기로 올린다

## 배경

모바일에서 이 시스템의 텍스트가 너무 작다는 지적에서 시작했다. 지금 본문·컨트롤 라벨의 기본값은 `text-sm`(14px)이다. 이 회차는 그 기본값을 `text-base`(16px)로 올리고, 그 파급이 닿는 전체 타이포그래피 스케일과 밀도 축을 다시 짠다.

v0.13.0 스펙은 남은 로드맵을 Context Menu · Menubar · Resizable 셋으로 적어 두었다. 이 회차는 그중 하나가 아니라 이 세션 중간에 새로 들어온 요청이고, 독립된 하위 시스템이라 별도 스펙·계획으로 간다.

## 이번 회차가 내리는 판단들

### 판단 1. 본문 기본값은 16px, KRDS의 17px 권장은 안 따른다

KRDS(국가 디자인 시스템)는 Pretendard GOV 전용으로 17px을 권장한다. 검토했지만 16px을 유지한다 — Tailwind의 `text-base` 기본값과 그대로 맞아떨어져 새 토큰을 안 만들어도 되고, 이미 여러 차례 확인한 결정이다.

### 판단 2. 스케일 전체를 다시 짜되, 절대값은 KRDS·Wanted·Gmarket을 참고만 하고 그대로 옮기지 않는다

세 레퍼런스를 확인했다:
- Gmarket: 헤딩을 22·24px 두 단계로 세분화 — 우리 헤딩류를 촘촘히 묶고 위(24 이상)에 여유를 두는 근거로 썼다
- Wanted: Title 2(28px)=상세 화면 제목, Title 3(24px)=목록/카드 화면 제목이라는 실제 화면 예시를 Figma에서 직접 확인해, 우리 `DetailPatternPage`·`ListPatternPage`의 가짜 제목 역할을 갈라 채웠다
- KRDS: 헤딩:본문 크기 비율 1.25~1.5배 원칙, "굵기도 위계를 만든다"는 계층 원칙, 목록은 크기 대신 들여쓰기·마커로 깊이를 표현한다는 규칙을 채택했다. 다만 KRDS의 실제 절대값(본문 17px, 헤딩 전부 bold, 150% 일괄 줄 간격)은 전부 기각했다 — 우리 코드의 실측 결과나 이 회차의 다른 결정과 부딪히기 때문이다

### 판단 3. 클래스명은 픽셀 숫자로 전면 통일한다

`text-lg`·`text-xl`·`text-2xl` 같은 이름 일부만 남기고 새 값에만 새 이름을 붙이면(`text-22` 등) 한 스케일 안에 두 명명 규칙이 섞여 오히려 헷갈린다. 그래서 전체 스케일을 `text-11`~`text-48`로 통일한다. 값이 그대로인 여덟 자리(2xs·xs·sm·base·lg·xl·2xl·5xl → 11·12·14·16·18·20·24·48)도 이름을 바꾼다. `text-16`이 Tailwind v4에서 실제로 안전하게 동작하는지 임시 토큰을 넣어 빌드+브라우저로 직접 확인했다 — 다른 유틸리티와 충돌 없이 `font-size:1rem;line-height:1.75rem`으로 정확히 컴파일된다.

### 판단 4. 굵기는 크기와 함께 위계를 만든다

KRDS의 계층 원칙("타이틀은 본문보다 눈에 띄어야 한다")은 따르되, "헤딩은 전부 bold"라는 KRDS의 세부 규칙은 안 따른다. 대신 지금 코드를 전수 실측했다: `DocPage`의 h1(페이지 제목)만 `font-bold`이고, h2(섹션 제목)·다이얼로그/시트/얼럿다이얼로그 제목·`GuidelineBlock`/`PropertyBlock`의 h3·`CardTitle`은 전부 `font-semibold`다. 이 실측을 그대로 스케일의 굵기 열로 삼는다. 18px(소제목)이 본문(16px) 대비 1.125배로 KRDS의 1.25배 최소치에 못 미치는데, 크기를 올리는 대신 굵기(semibold)로 위계를 보완한다.

### 판단 5. 밀도 축(`--spacing-control-*`, `--spacing-row*`) 값은 이번엔 안 건드린다

`control-sm`(32px)·`control`(36px)·`control-lg`(40px)가 새 본문(16px, 줄 간격 28px)을 담을 때 실제로 얼마나 빡빡한지는 계산만으로 확신할 수 없다. 값을 미리 바꾸지 않고, 구현 중 브라우저로 실측해서 정말 잘리거나 답답하면 그때 새 단계를 추가한다. 조밀 모드(`text-14`, 24px 줄 간격)는 계속 이 세 단계와 짝짓는다 — v0.13.0 계획서의 "이 값들은 의도된 어드민 밀도 축이다, shadcn 기본값 쪽으로 고치지 않는다"는 제약을 그대로 잇는다.

## 전체 타이포그래피 스케일 (ToBe, 큰 것부터)

| 크기(px) | 줄 간격(px) | 클래스 | 이전 이름 | 값 변경? | 굵기 | 역할 |
|---|---|---|---|---|---|---|
| 48 | 64 | `text-48` | `text-5xl` | 이름만 | bold | 강조 숫자·텍스트 대 |
| 40 | 52 | `text-40` | (없음) | 신규 | bold | 강조 숫자·텍스트 중 |
| 32 | 44 | `text-32` | (없음) | 신규 | bold | 페이지 제목(h1)·강조 숫자·텍스트 소 |
| 28 | 40 | `text-28` | (없음) | 신규 | semibold | 상세 화면 제목 (`DetailPatternPage`) |
| 24 | 32 | `text-24` | `text-2xl` | 이름만 | semibold | 목록·카드 화면 제목 (`ListPatternPage`) |
| 22 | 32 | `text-22` | (없음) | 신규 | semibold | 문서 섹션 제목(h2) |
| 20 | 28 | `text-20` | `text-xl` | 이름만 | semibold | 다이얼로그·시트·얼럿다이얼로그 제목 |
| 18 | 28 | `text-18` | `text-lg` | 이름만 | 제목 semibold / 문단 normal | 문서 소제목·카드 제목(semibold) · 설명 문단(normal) |
| **16** | 28 | `text-16` | `text-base` | 이름만 | 본문 normal / 컨트롤 라벨 medium | **본문(normal)·컨트롤 라벨(medium) — 새 기본값** |
| 14 | 24 | `text-14` | `text-sm` | 이름만(역할은 이동) | normal | 조밀 모드 전용 — 표 셀 등 |
| 12 | 20 | `text-12` | `text-xs` | 이름만 | normal | 설명·캡션·도움말 |
| 11 | 16 | `text-11` | `text-2xs` | 이름만 | bold | 배지·메뉴 그룹 라벨·요일 머리 |

`text-3xl`(30px, Tailwind 기본값)은 역할이 없어져 폐기한다 — `DocPage`의 h1이 `text-32`로 옮겨 가면서 쓰는 곳이 사라진다.

## `text-sm` 쓸어바꾸기

`src/lib` 밖에서 `text-sm`(현재 449곳, 92파일)을 쓰는 자리는 두 갈래로 갈린다:

- **본문·컨트롤 라벨 역할** — 문단, 폼 라벨, 카드 설명, 버튼/인풋 텍스트 등. `text-16`으로 옮긴다
- **조밀 모드 역할** — 표 셀 값처럼 정보 밀도를 지키려고 의도적으로 촘촘히 둔 자리. `text-14`로 이름만 바꾸고 크기는 그대로 둔다

이건 기계적 치환이 아니라 자리마다 판단이 필요하다. `Table`/`TableCell`은 이미 `text-sm`을 쓰고 있어 조밀 모드로 남는 대표 사례다(구현 단계에서 실측 확인).

나머지 여덟 자리(`2xs`·`xs`·`base`·`lg`·`xl`·`2xl`·`5xl`을 각각 `11`·`12`·`16`·`18`·`20`·`24`·`48`로)는 값이 그대로인 1:1 이름 치환이라 역할 판단 없이 기계적으로 끝난다.

## Typography 문서 페이지에 반영되는 것

`src/routes/foundations/TypographyPage.tsx`의 `SCALE` 상수를 위 표대로 다시 쓰고, 다음을 더한다:

1. **Scale 섹션에 굵기 열 추가** — 지금은 크기·역할 두 열뿐이다
2. **계층 원칙 문단** (표 위): "제목류(다이얼로그 제목 이상)는 굵기를 semibold 이상으로 씁니다. 본문은 normal이 기본이고 컨트롤 라벨만 한 단계 진한 medium을 씁니다. 크기 차이가 크지 않은 자리(소제목 18px과 본문 16px)는 굵기가 실제 위계를 만듭니다."
3. **크기 비율 검증 문단** (표 아래): "본문(16px) 대비 제목류 크기 비율은 소제목 1.125배부터 강조 텍스트 대 3배까지 걸쳐 있습니다. 대부분 1.25~1.5배 안에 들지만 소제목(18px)만 이 아래인데, 굵기(semibold)로 위계를 보완했습니다." 이어서 h4 헤딩 단계를 의도적으로 안 만들었다는 한 줄도 남긴다 — KRDS는 h1~h4 네 단계를 쓰지만, 이 시스템은 h1~h3까지만 실제로 쓰는 곳이 있다
4. **Guidelines 섹션에 목록·표 문단 추가**: "표와 목록은 본문보다 한 단계 낮은 조밀 모드를 씁니다. 머리 행은 그보다 작은 설명 크기에 굵기만 올려 구분합니다. 목록은 깊이가 있어도 크기를 줄이지 않고 들여쓰기·마커로만 구분합니다." + `/components/data-table` 링크
5. **DoDont `do` 목록에 밑줄 규칙 추가**: "밑줄은 텍스트 링크에만 쓰고 강조는 굵기·색으로 한다" — 지금 문서엔 이 규칙이 아예 없다
6. **Letter-spacing을 안 건드리는 이유 한 줄**: Pretendard는 한글 중심 폰트라 KRDS가 다루는 자간 미세조정(0~1px)만큼의 튜닝이 필요하지 않다는 것을 명시

기존 Guidelines 섹션의 예시 코드(`text-sm`·`text-2xl`·`text-lg`·`text-base` 등)도 새 클래스명으로 갈아 끼운다.

## 구현에서 갈라지는 실제 화면들

새 스케일을 실제로 적용하면서 크기가 바뀌는 자리:

- `DocPage.tsx` h1(페이지 제목): `text-3xl font-bold` → `text-32 font-bold`
- `DocPage.tsx` h2(DocSection 제목): `text-xl font-semibold` → `text-22 font-semibold`
- `dialog.tsx`/`sheet.tsx`/`alert-dialog.tsx` 제목: `text-lg font-semibold` → `text-20 font-semibold`
- `GuidelineBlock.tsx`/`PropertyBlock.tsx` h3: `text-base font-semibold` → `text-18 font-semibold`
- `card.tsx`의 `CardTitle`: 지금은 크기 지정이 아예 없다(주변 문맥에 따라 달라짐). `text-18 font-semibold`로 처음 명시한다
- `DetailPatternPage.tsx`의 가짜 화면 제목(h4, 6곳): `text-xl font-semibold` → `text-28 font-semibold`
- `ListPatternPage.tsx`의 가짜 화면 제목(h4, 2곳): `text-xl font-semibold` → `text-24 font-semibold`

## 범위 밖

- **ColorRolePage에 명암비 수치표 추가** — 이번에 확인해 보니 우리 시스템 어디에도 실제 명암비 숫자가 사용자에게 안 보인다는 걸 발견했다. 이 회차의 부수 발견이지만, Typography가 아니라 Color 담당 영역이라 별도로 처리한다
- **Badge 명암비 미달(라이트 테마 4.24~4.44:1)** — v0.13.0 최종 리뷰에서 발견해 이미 별도 백그라운드 작업으로 분리했다(`task_7d36a194`)
- **Context Menu · Menubar · Resizable** — v0.13.0 스펙이 남긴 나머지 컴포넌트. 이 회차와 무관한 독립 작업이다

## 전역 제약

- 작업 브랜치는 `v0.14.0`이다. `main`에 직접 커밋하지 않는다
- **Vitest는 `node` 환경에서 돈다. jsdom이 없다.** 컴포넌트를 렌더링하는 테스트를 쓰지 않는다
- **코드나 데이터에 대해 사실이 아닌 것을 주석·UI 문구·문서 문장에 쓰지 않는다.** 이 프로젝트가 매 회차 가장 많이 낸 결함이다
- `--spacing-control-sm`·`--spacing-control`·`--spacing-control-lg`·`--spacing-row`·`--spacing-row-compact` 값은 이번 회차에서 바꾸지 않는다(판단 5)
- 임의 값 대괄호 표기 금지 (셀렉터 변형은 허용)
- 언어 규칙 — 구조를 가리키는 이름은 영문, 설명은 한국어
- 화면에 나오는 숫자·값을 손으로 적지 않는다
- 서식은 손으로 맞춘다 — 작은따옴표, 세미콜론 없음. `prettier --write`를 돌리지 않는다
- `public/r/*.json`을 손으로 고치지 않는다. `npm run registry`를 돌린다
- 커밋 메시지는 한국어 본문, 제목은 Conventional Commits 접두사이고 em-dash를 쓰지 않는다
- **이 하네스는 키보드 동작을 검증할 수 없다** — 키보드 동작은 소스로 추론하고 그렇게만 적는다
- 각 작업은 `npm run build`와 `npm test` 통과를 완료 조건에 포함한다
