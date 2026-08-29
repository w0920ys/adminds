# Foundations / Layout 설계

## 배경

사용자 요청: "foundation에 layout, grid system, breakpoint 등등도 추가해줘." 지금 Foundations는 Design Token·Color(+Color Role·Palette)·Typography·Spacing·Iconography·State·Voice and Tone·Writing 여덟 문서를 갖고 있고, 화면이 어떻게 나뉘는지(반응형 기준점, 콘텐츠 폭, 격자)를 다루는 문서는 없다.

이 작업은 v0.16.0 SDD 브랜치(Context Menu·Menubar·Resizable)와 무관한 별개 하위 시스템이라 독립된 스펙·플랜 사이클로 다룬다.

## 범위 — 문서화만

지금 `tokens.css`에는 breakpoint·grid·container 토큰이 전혀 없다(Tailwind v4 기본값을 그대로 쓴다). `AppShell.tsx`에 콘텐츠 폭이 `max-w-6xl`로 하드코딩돼 있을 뿐이다.

이번 작업은 **새 토큰이나 코드 변경 없이, 지금 이 저장소가 실제로 쓰는 값과 패턴을 정확히 문서화**하는 데 그친다. 없는 시스템을 있는 것처럼 꾸미지 않는다 — Voice and Tone·Writing처럼 토큰 없이 지침만 있는 페이지와 같은 성격이다. 토큰화(실제 CSS 커스텀 프로퍼티 신설, `AppShell.tsx` 등 하드코딩 교체)는 이번 범위 밖이며, 필요해지면 별도 스펙으로 다룬다.

## 페이지 구성 — Layout 하나로 통합

Foundations는 보통 하나의 주제 = 하나의 페이지다(Spacing·Iconography 등). Color만 서로 다른 관심사라 세 개로 나뉜 예외다. Breakpoint·Grid·Container width는 한 화면에서 같이 읽히는 게 자연스러워 **Layout 페이지 하나**로 묶는다.

**nav 순서:** Spacing 바로 뒤에 넣는다 — Spacing이 "간격의 크기", Layout이 "화면이 나뉘는 구조"로 둘 다 공간을 다루는 인접 주제다.
- 갱신 전: … Typography → Spacing → Iconography …
- 갱신 후: … Typography → Spacing → **Layout** → Iconography …

## 섹션 구성

1. **Overview** — 이 페이지가 반응형 기준점·콘텐츠 폭·격자를 다룬다는 것, 그리고 색·타이포·간격처럼 토큰 하나로 떨어지는 대신 지금 이 저장소가 실제로 쓰는 값을 그대로 보여준다는 것을 짚는다.

2. **Breakpoints** — Tailwind v4 기본 다섯 단계(`sm` 40rem·`md` 48rem·`lg` 64rem·`xl` 80rem·`2xl` 96rem) 표. 실측 결과(`grep -rEoh` 카운트) 이 저장소는 `md`(62곳)·`sm`(45곳)을 압도적으로 많이 쓰고, `lg`(12곳)는 드물게, `xl`(1곳)은 거의 안 쓴다 — 반응형은 `sm`/`md` 위주로 설계하라는 지침의 근거로 쓴다. 실제 예시: `Gnb.tsx`가 `md:hidden`/`md:flex`로 데스크톱 내비와 모바일 메뉴 버튼을 가르고, `Lnb.tsx`의 서랍 2뎁스 상태 기계 전체가 `md:hidden`을 기준으로 갈린다(v0.15.0에서 다룬 실제 결정).

3. **Content width** — `AppShell.tsx`의 `max-w-6xl`(본문+TOC 두 컬럼, 1152px)과 `DocPage.tsx`의 `max-w-2xl`(본문 줄 길이, 672px)을 실제 코드 인용과 함께 보이고, 왜 둘이 다른 값인지(화면 전체 폭 vs 문단 가독성을 위한 줄 길이) 설명한다. `AppShell.tsx`의 반응형 패딩 단계(`px-5 py-8` → `sm:px-8 py-10` → `md:px-10 py-12`)도 같은 자리에서 보인다.

4. **Grid** — 통일된 토큰이 없다는 사실을 숨기지 않는다. 대신 실측(`grep -rn grid-cols`)으로 확인한 반복 패턴을 실제 파일 인용과 함께 보인다:
   - 카드·예시 목록: `sm:grid-cols-2` 또는 `md:grid-cols-2`(`DoDont.tsx`, `ExampleList.tsx`, `PatternsOverview.tsx`, `DocFooterNav.tsx` 등 다수)
   - 라벨+값처럼 폭이 다른 두 칸: `grid-cols-[auto_1fr]`(`Steps.tsx`, `Field.tsx`)
   - 좁게 묶이는 3칸: `grid-cols-3`(`VoiceAndTonePage.tsx`, `IconographyPage.tsx`)
   지침: 카드·예시가 반복되는 목록은 `sm:grid-cols-2`나 `md:grid-cols-2`를 우선 고려하고, 폭이 고정된 두 칸은 `grid-cols-[auto_1fr]`을 쓴다. 한 줄짜리 배치는 grid 대신 flex로 충분하다.

5. **Guidelines** — `DoDont`로 마무리.
   - DO: 반응형은 `sm`/`md` 위주로 설계한다 · 페이지 콘텐츠 폭은 `max-w-6xl`을 벗어나지 않는다 · 카드·예시 목록은 `sm:grid-cols-2`/`md:grid-cols-2` 관례를 따른다
   - DON'T: 임의로 새 breakpoint 값을 만든다(`min-[...]` 같은 임의 값) · 임의 값 대괄호 표기(`[3px]`, `[#abc]`)를 쓴다 · 근거 없이 `lg`/`xl` 단계에 새 레이아웃을 얹는다(이 저장소는 아직 그 단계를 거의 안 쓴다)

## 데이터 출처

Spacing 페이지처럼 `tokens.css`에서 토큰을 읽어오는 방식이 아니다 — 다룰 토큰이 없다. Typography 페이지처럼 페이지 안에 지역 상수(breakpoint 표, grid 예시 목록)를 직접 정의한다. `registry.ts`는 건드리지 않는다(Foundations 문서는 컴포넌트 레지스트리 밖이라는 기존 구조를 그대로 따른다).

## 영향받는 파일

- 신규: `src/routes/foundations/LayoutPage.tsx`
- 수정: `src/routes/routes.tsx`(라우트 추가, Spacing 뒤) · `src/components/layout/nav-config.ts`(Foundations 묶음에 링크 추가, Spacing 뒤) · `src/routes/get-started/section-roles.ts`(Foundations 한 줄 설명에 레이아웃 언급 추가 여부는 플랜 작성 시 판단)

## 테스트

기존 Foundations 페이지들과 동일하게 렌더링 테스트는 없다(Vitest가 jsdom 없이 node 환경에서 돈다). `npm run build`(tsc+vite) 통과와 개발 서버에서 실제 렌더링·nav 순서·링크 동작을 눈으로 확인하는 것으로 검증한다. `registry-order.test.ts`류의 순서 테스트는 이 페이지엔 해당 없음(Foundations는 그 테스트가 보는 Components nav가 아니다) — 다만 플랜 작성 시 nav-config.ts 순서를 지키는 기존 테스트가 있는지 다시 확인한다.
