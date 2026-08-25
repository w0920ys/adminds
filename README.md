# 어드민 디자인 시스템 워크벤치

개인용 "서비스 대시보드" 어드민 프로젝트에서 쓸 컴포넌트·패턴을 미리 만들어보고 검증하는 전시 워크벤치입니다. 실제 서비스 화면이 아니라, 컴포넌트를 변형·상태·해부도 단위로 늘어놓고 눈으로 확인하는 카탈로그입니다.

## 왜 만드는가

- 컴포넌트를 실제 화면에 붙이기 전에 variant·size·상태 조합을 한 번에 훑어보고 검증하기 위해서입니다.
- 버전(v0.1.0, v0.2.0, ...)마다 들어온 요청이 실제로 반영됐는지 changelog와 함께 확인하기 위해서입니다.
- 프로젝트마다 매번 새로 만들지 않도록, 검증을 마친 컴포넌트와 패턴을 이 저장소에 축적하기 위해서입니다.

## 기술 스택

- React 19 + TypeScript
- Tailwind CSS v4 (`@theme inline` 토큰 기반, 임의 값 하드코딩 금지)
- shadcn/ui 패턴 (Radix + `class-variance-authority`)
- react-router v8 (client-side routing)
- Vite (빌드), Vitest (테스트)

## 실행 방법

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 타입 체크(tsc -b) + 프로덕션 빌드
npm test          # vitest run
```

## 폴더 구조

```
src/
  components/
    ui/       # shadcn 스타일 원자 컴포넌트 (Button 등)
    docs/     # 전시 페이지를 구성하는 문서용 컴포넌트 (VariantGrid, StateGrid, ComponentPage 등)
    layout/   # 앱 셸, 사이드바 등 레이아웃
  data/       # registry.ts(컴포넌트 메타), releases.ts(버전별 changelog)
  routes/     # 라우트별 페이지 (routes/components/ButtonPage.tsx 등)
  styles/     # tokens.css — 색·간격·radius·shadow 등 전역 디자인 토큰
  lib/        # 유틸리티
```

## 새 컴포넌트를 추가하는 법

1. `src/components/ui/`에 컴포넌트를 직접 작성합니다 (shadcn CLI로 생성한 것과 같은 형태를 손으로 맞춰 넣습니다).
2. `src/data/registry.ts`에 컴포넌트 메타(설명, variants, sizes, anatomy, guidelines 등)를 등록합니다.
3. `src/routes/components/`에 전시 페이지를 만듭니다 (`VariantGrid`, `StateGrid` 등 `components/docs`의 도구를 사용).
4. `src/routes/router.tsx`에 라우트를 한 줄 추가합니다.

## 제약

- 색·간격·radius·shadow 값을 하드코딩하지 않습니다. 항상 `tokens.css`에 정의된 토큰을 통해서만 사용합니다.
- Tailwind 임의 값 대괄호 표기(`[3px]`, `[#abc]`)는 금지합니다. 값이 아닌 임의 셀렉터 변형(`[&_svg]:size-4`)은 허용됩니다.
