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
    docs/     # 전시 페이지를 구성하는 문서용 컴포넌트 (PropertyBlock, Anatomy, ComponentPage 등)
    layout/   # 앱 셸, GNB·LNB 등 레이아웃
  data/       # registry.ts(컴포넌트 메타), releases.ts(버전별 changelog)
  routes/     # 라우트별 페이지. 섹션마다 폴더가 하나씩입니다
              #   get-started/  Overview·Install·Principles
              #   foundations/  Design Token·Color·Typography 등 토큰과 원칙 문서
              #   components/   컴포넌트 문서 (ButtonPage.tsx 등)
              #   patterns/     화면 단위 문서 (List·Detail·Form·Empty and error·Destructive confirm)
              #   UpdatesPage.tsx — releases.ts를 펼쳐 보이는 변경 기록
  styles/     # tokens.css — 색·간격·radius·shadow 등 전역 디자인 토큰
  lib/        # 유틸리티
```

## 새 컴포넌트를 추가하는 법

1. `src/components/ui/`에 컴포넌트를 직접 작성합니다 (shadcn CLI로 생성한 것과 같은 형태를 손으로 맞춰 넣습니다).
2. `src/data/registry.ts`에 컴포넌트 메타(설명, variants, sizes, anatomy, guidelines 등)를 등록합니다.
3. `src/routes/components/`에 전시 페이지를 만듭니다 (`PropertyBlock`, `Anatomy` 등 `components/docs`의 도구를 사용).
4. `src/routes/routes.tsx`에 라우트를 한 줄 추가합니다.
5. `src/components/layout/nav-config.ts`의 Components 목록에 같은 자리로 넣습니다. `registry.ts`와 순서까지 같아야 하고, 어긋나면 `registry-order.test.ts`가 실패합니다.
6. `registry.json`에도 항목을 더합니다. `registry.ts`와 어긋나면 `registry-parity.test.ts`가 실패합니다.
7. `npm run registry`로 `public/r/`을 다시 만듭니다 — 새 컴포넌트가 다른 프로젝트에 닿는 통로입니다.

## 다른 프로젝트에서 가져다 쓰기

이 저장소는 문서 사이트인 동시에 **shadcn 레지스트리**입니다. 다른 프로젝트에서 필요한 것만 받아 갑니다.

```bash
npx shadcn@latest add https://adminds.vercel.app/r/table.json   # 하나만
npx shadcn@latest add https://adminds.vercel.app/r/adminds.json # 토큰과 46개 전부
```

소스가 그쪽 `src/components/ui/`에 들어가므로 받은 쪽이 고쳐 씁니다. 나중에 같은 명령을 다시 돌리면 갱신되지만, 고쳐 둔 것은 덮어써집니다.

받는 쪽에 필요한 것:

- **Tailwind v4.** 토큰이 `@theme inline` 문법이라 v3에서는 동작하지 않습니다.
- **`globals.css`의 들이는 순서** — `tailwindcss` → `tw-animate-css` → `tokens.css`. `tokens.css`가 먼저 오면 다크 변형과 색 토큰이 풀리지 않습니다.
- **`tsconfig.json`의 `paths`** — `"paths": { "@/*": ["./src/*"] }`가 `tsconfig.json`에도 있어야 합니다. Vite 템플릿은 이것을 `tsconfig.app.json`에만 두는데, 그러면 파일이 `@/`라는 이름의 폴더에 통째로 떨어집니다. `baseUrl`은 넣지 않습니다 — TypeScript 6에서 하드 에러입니다.

레지스트리는 `registry.json`이 원본이고 `npm run registry`가 `public/r/`을 다시 만듭니다. 컴포넌트를 더하거나 고친 뒤에는 이 명령을 돌려야 바깥에 닿습니다.


## 제약

- 색·간격·radius·shadow 값을 하드코딩하지 않습니다. 항상 `tokens.css`에 정의된 토큰을 통해서만 사용합니다.
- Tailwind 임의 값 대괄호 표기(`[3px]`, `[#abc]`)는 금지합니다. 값이 아닌 임의 셀렉터 변형(`[&_svg]:size-4`)은 허용됩니다.
