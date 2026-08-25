// createBrowserRouter는 여기서 호출하지 않는다. 라우트 목록만 두어 테스트가 DOM 없이 import할 수 있게 한다.
import type { RouteObject } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'
import { ButtonPage } from '@/routes/components/ButtonPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'
import { ColorPage } from '@/routes/foundations/ColorPage'
import { FoundationsOverview } from '@/routes/foundations/FoundationsOverview'
import { IconographyPage } from '@/routes/foundations/IconographyPage'
import { SpacingPage } from '@/routes/foundations/SpacingPage'
import { StatePage } from '@/routes/foundations/StatePage'
import { TypographyPage } from '@/routes/foundations/TypographyPage'
import { VoiceAndTonePage } from '@/routes/foundations/VoiceAndTonePage'
import { WritingPage } from '@/routes/foundations/WritingPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Get started" /> },
      { path: 'get-started/install', element: <Placeholder title="설치" /> },
      { path: 'get-started/principles', element: <Placeholder title="원칙" /> },

      { path: 'foundations', element: <FoundationsOverview /> },
      { path: 'foundations/design-token', element: <Placeholder title="Design Token" /> },
      { path: 'foundations/color', element: <ColorPage /> },
      { path: 'foundations/color-role', element: <Placeholder title="Color Role" /> },
      { path: 'foundations/palette', element: <Placeholder title="Palette" /> },
      { path: 'foundations/typography', element: <TypographyPage /> },
      { path: 'foundations/spacing', element: <SpacingPage /> },
      { path: 'foundations/iconography', element: <IconographyPage /> },
      { path: 'foundations/state', element: <StatePage /> },
      { path: 'foundations/voice-and-tone', element: <VoiceAndTonePage /> },
      { path: 'foundations/writing', element: <WritingPage /> },

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
 * 등록된 문서 경로 목록. 404 캐치올은 문서가 아니므로 제외한다.
 * nav-config의 docOrder와 일치하는지 테스트가 검사한다 —
 * 두 목록이 조용히 어긋나는 것을 막기 위한 장치다.
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
