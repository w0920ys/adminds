// createBrowserRouter는 여기서 호출하지 않는다. 라우트 목록만 두어 테스트가 DOM 없이 import할 수 있게 한다.
import type { RouteObject } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'
import { AlertPage } from '@/routes/components/AlertPage'
import { AvatarPage } from '@/routes/components/AvatarPage'
import { BadgePage } from '@/routes/components/BadgePage'
import { BreadcrumbPage } from '@/routes/components/BreadcrumbPage'
import { ButtonPage } from '@/routes/components/ButtonPage'
import { CardPage } from '@/routes/components/CardPage'
import { CheckboxPage } from '@/routes/components/CheckboxPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'
import { DescriptionListPage } from '@/routes/components/DescriptionListPage'
import { DialogPage } from '@/routes/components/DialogPage'
import { DropdownMenuPage } from '@/routes/components/DropdownMenuPage'
import { EmptyStatePage } from '@/routes/components/EmptyStatePage'
import { InputPage } from '@/routes/components/InputPage'
import { PaginationPage } from '@/routes/components/PaginationPage'
import { RadioPage } from '@/routes/components/RadioPage'
import { SelectPage } from '@/routes/components/SelectPage'
import { SeparatorPage } from '@/routes/components/SeparatorPage'
import { SkeletonPage } from '@/routes/components/SkeletonPage'
import { StepsPage } from '@/routes/components/StepsPage'
import { SwitchPage } from '@/routes/components/SwitchPage'
import { TablePage } from '@/routes/components/TablePage'
import { TabsPage } from '@/routes/components/TabsPage'
import { TextareaPage } from '@/routes/components/TextareaPage'
import { ToastPage } from '@/routes/components/ToastPage'
import { TooltipPage } from '@/routes/components/TooltipPage'
import { ColorPage } from '@/routes/foundations/ColorPage'
import { ColorRolePage } from '@/routes/foundations/ColorRolePage'
import { DesignTokenPage } from '@/routes/foundations/DesignTokenPage'
import { FoundationsOverview } from '@/routes/foundations/FoundationsOverview'
import { IconographyPage } from '@/routes/foundations/IconographyPage'
import { PalettePage } from '@/routes/foundations/PalettePage'
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
      { path: 'get-started/install', element: <Placeholder title="Install" /> },
      { path: 'get-started/principles', element: <Placeholder title="Principles" /> },

      { path: 'foundations', element: <FoundationsOverview /> },
      { path: 'foundations/design-token', element: <DesignTokenPage /> },
      { path: 'foundations/color', element: <ColorPage /> },
      { path: 'foundations/color-role', element: <ColorRolePage /> },
      { path: 'foundations/palette', element: <PalettePage /> },
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
          { path: 'dropdown-menu', element: <DropdownMenuPage /> },
          { path: 'input', element: <InputPage /> },
          { path: 'select', element: <SelectPage /> },
          { path: 'checkbox', element: <CheckboxPage /> },
          { path: 'radio', element: <RadioPage /> },
          { path: 'switch', element: <SwitchPage /> },
          { path: 'textarea', element: <TextareaPage /> },
          { path: 'tabs', element: <TabsPage /> },
          { path: 'breadcrumb', element: <BreadcrumbPage /> },
          { path: 'pagination', element: <PaginationPage /> },
          { path: 'steps', element: <StepsPage /> },
          { path: 'alert', element: <AlertPage /> },
          { path: 'toast', element: <ToastPage /> },
          { path: 'tooltip', element: <TooltipPage /> },
          { path: 'dialog', element: <DialogPage /> },
          { path: 'skeleton', element: <SkeletonPage /> },
          { path: 'empty-state', element: <EmptyStatePage /> },
          { path: 'table', element: <TablePage /> },
          { path: 'badge', element: <BadgePage /> },
          { path: 'avatar', element: <AvatarPage /> },
          { path: 'card', element: <CardPage /> },
          { path: 'separator', element: <SeparatorPage /> },
          { path: 'description-list', element: <DescriptionListPage /> },
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
