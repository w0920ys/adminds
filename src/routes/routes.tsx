// createBrowserRouter는 여기서 호출하지 않는다. 라우트 목록만 두어 테스트가 DOM 없이 import할 수 있게 한다.
import type { RouteObject } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'
import { UpdatesPage } from '@/routes/UpdatesPage'
import { AccordionPage } from '@/routes/components/AccordionPage'
import { AlertDialogPage } from '@/routes/components/AlertDialogPage'
import { AlertPage } from '@/routes/components/AlertPage'
import { AvatarPage } from '@/routes/components/AvatarPage'
import { BadgePage } from '@/routes/components/BadgePage'
import { BreadcrumbPage } from '@/routes/components/BreadcrumbPage'
import { ButtonPage } from '@/routes/components/ButtonPage'
import { CardPage } from '@/routes/components/CardPage'
import { ContextMenuPage } from '@/routes/components/ContextMenuPage'
import { CheckboxPage } from '@/routes/components/CheckboxPage'
import { CollapsiblePage } from '@/routes/components/CollapsiblePage'
import { ComboboxPage } from '@/routes/components/ComboboxPage'
import { CommandPage } from '@/routes/components/CommandPage'
import { ComponentsIndex } from '@/routes/components/ComponentsIndex'
import { DataTablePage } from '@/routes/components/DataTablePage'
import { DatePickerPage } from '@/routes/components/DatePickerPage'
import { DescriptionListPage } from '@/routes/components/DescriptionListPage'
import { DialogPage } from '@/routes/components/DialogPage'
import { DropdownMenuPage } from '@/routes/components/DropdownMenuPage'
import { EmptyStatePage } from '@/routes/components/EmptyStatePage'
import { FieldPage } from '@/routes/components/FieldPage'
import { FileUploadPage } from '@/routes/components/FileUploadPage'
import { InputPage } from '@/routes/components/InputPage'
import { MenubarPage } from '@/routes/components/MenubarPage'
import { PaginationPage } from '@/routes/components/PaginationPage'
import { PopoverPage } from '@/routes/components/PopoverPage'
import { ProgressPage } from '@/routes/components/ProgressPage'
import { RadioPage } from '@/routes/components/RadioPage'
import { ResizablePage } from '@/routes/components/ResizablePage'
import { ScrollAreaPage } from '@/routes/components/ScrollAreaPage'
import { SelectPage } from '@/routes/components/SelectPage'
import { SeparatorPage } from '@/routes/components/SeparatorPage'
import { SheetPage } from '@/routes/components/SheetPage'
import { SkeletonPage } from '@/routes/components/SkeletonPage'
import { SliderPage } from '@/routes/components/SliderPage'
import { StepsPage } from '@/routes/components/StepsPage'
import { SwitchPage } from '@/routes/components/SwitchPage'
import { TablePage } from '@/routes/components/TablePage'
import { TabsPage } from '@/routes/components/TabsPage'
import { TextareaPage } from '@/routes/components/TextareaPage'
import { ToastPage } from '@/routes/components/ToastPage'
import { TogglePage } from '@/routes/components/TogglePage'
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
import { GetStartedOverview } from '@/routes/get-started/GetStartedOverview'
import { InstallPage } from '@/routes/get-started/InstallPage'
import { PrinciplesPage } from '@/routes/get-started/PrinciplesPage'
import { DestructiveConfirmPatternPage } from '@/routes/patterns/DestructiveConfirmPatternPage'
import { DetailPatternPage } from '@/routes/patterns/DetailPatternPage'
import { EmptyAndErrorPatternPage } from '@/routes/patterns/EmptyAndErrorPatternPage'
import { FormPatternPage } from '@/routes/patterns/FormPatternPage'
import { ListPatternPage } from '@/routes/patterns/ListPatternPage'
import { PatternsOverview } from '@/routes/patterns/PatternsOverview'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <GetStartedOverview /> },
      { path: 'get-started/install', element: <InstallPage /> },
      { path: 'get-started/principles', element: <PrinciplesPage /> },

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
          { path: 'toggle', element: <TogglePage /> },
          { path: 'input', element: <InputPage /> },
          { path: 'field', element: <FieldPage /> },
          { path: 'file-upload', element: <FileUploadPage /> },
          { path: 'select', element: <SelectPage /> },
          { path: 'slider', element: <SliderPage /> },
          { path: 'checkbox', element: <CheckboxPage /> },
          { path: 'combobox', element: <ComboboxPage /> },
          { path: 'date-picker', element: <DatePickerPage /> },
          { path: 'radio', element: <RadioPage /> },
          { path: 'switch', element: <SwitchPage /> },
          { path: 'textarea', element: <TextareaPage /> },
          { path: 'tabs', element: <TabsPage /> },
          { path: 'breadcrumb', element: <BreadcrumbPage /> },
          { path: 'command', element: <CommandPage /> },
          { path: 'pagination', element: <PaginationPage /> },
          { path: 'steps', element: <StepsPage /> },
          { path: 'alert', element: <AlertPage /> },
          { path: 'toast', element: <ToastPage /> },
          { path: 'tooltip', element: <TooltipPage /> },
          { path: 'popover', element: <PopoverPage /> },
          { path: 'dialog', element: <DialogPage /> },
          { path: 'alert-dialog', element: <AlertDialogPage /> },
          { path: 'skeleton', element: <SkeletonPage /> },
          { path: 'sheet', element: <SheetPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'empty-state', element: <EmptyStatePage /> },
          { path: 'table', element: <TablePage /> },
          { path: 'data-table', element: <DataTablePage /> },
          { path: 'badge', element: <BadgePage /> },
          { path: 'avatar', element: <AvatarPage /> },
          { path: 'card', element: <CardPage /> },
          { path: 'collapsible', element: <CollapsiblePage /> },
          { path: 'scroll-area', element: <ScrollAreaPage /> },
          { path: 'separator', element: <SeparatorPage /> },
          { path: 'description-list', element: <DescriptionListPage /> },
          { path: 'accordion', element: <AccordionPage /> },
          { path: 'context-menu', element: <ContextMenuPage /> },
          { path: 'menubar', element: <MenubarPage /> },
          { path: 'resizable', element: <ResizablePage /> },
        ],
      },

      {
        path: 'patterns',
        children: [
          { index: true, element: <PatternsOverview /> },
          { path: 'list', element: <ListPatternPage /> },
          { path: 'detail', element: <DetailPatternPage /> },
          { path: 'form', element: <FormPatternPage /> },
          { path: 'empty-and-error', element: <EmptyAndErrorPatternPage /> },
          { path: 'destructive-confirm', element: <DestructiveConfirmPatternPage /> },
        ],
      },
      { path: 'updates', element: <UpdatesPage /> },

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
