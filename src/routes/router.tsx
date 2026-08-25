import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'
import { ButtonPage } from '@/routes/components/ButtonPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Get started" /> },
      { path: 'get-started/install', element: <Placeholder title="설치" /> },
      { path: 'get-started/principles', element: <Placeholder title="원칙" /> },

      { path: 'foundations', element: <Placeholder title="Foundations" /> },
      { path: 'foundations/color', element: <Placeholder title="Color" /> },
      { path: 'foundations/typography', element: <Placeholder title="Typography" /> },
      { path: 'foundations/spacing', element: <Placeholder title="Spacing" /> },
      { path: 'foundations/iconography', element: <Placeholder title="Iconography" /> },
      { path: 'foundations/state', element: <Placeholder title="State" /> },
      { path: 'foundations/voice-and-tone', element: <Placeholder title="Voice and Tone" /> },
      { path: 'foundations/writing', element: <Placeholder title="Writing" /> },

      {
        path: 'components',
        children: [
          { index: true, element: <ComponentsIndex /> },
          { path: 'button', element: <ButtonPage /> },
        ],
      },

      { path: 'patterns', element: <Placeholder title="Patterns" /> },
      { path: 'updates', element: <Placeholder title="Updates" /> },

      { path: '*', element: <Placeholder title="페이지를 찾을 수 없습니다" /> },
    ],
  },
]

/**
 * createBrowserRouter는 브라우저 history API(document)를 요구해 Node 테스트 환경(vitest, environment: 'node')에서
 * 즉시 예외를 던진다. registeredPaths를 검사하는 테스트가 이 모듈을 import할 수 있어야 하므로,
 * DOM이 없는 환경에서는 동일한 라우트 트리로 createMemoryRouter를 대신 쓴다.
 * 두 함수 모두 같은 Router 타입을 반환하므로 router의 실제 동작(children 구조)에는 차이가 없다.
 */
export const router =
  typeof document !== 'undefined' ? createBrowserRouter(routes) : createMemoryRouter(routes)

/**
 * 등록된 문서 경로 목록. 404 캐치올은 문서가 아니므로 제외한다.
 * nav-config의 docOrder와 일치하는지 테스트가 검사한다 —
 * 두 목록이 조용히 어긋나는 것을 막기 위한 장치다.
 * router.routes가 아니라 위의 routes 상수에서 직접 계산한다 — router 인스턴스에 기대지 않는 편이 더 견고하다.
 */
export const registeredPaths: string[] = (() => {
  const children = routes[0].children ?? []
  return children
    .filter((route) => route.path !== '*')
    .flatMap((route) => {
      const base = route.index ? '/' : `/${route.path}`
      if (!route.children) return [base]
      return route.children.map((child) => (child.index ? base : `${base}/${child.path}`))
    })
})()
