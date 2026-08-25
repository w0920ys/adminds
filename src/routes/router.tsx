import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Placeholder } from '@/routes/Placeholder'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Overview" /> },
      { path: 'foundations', element: <Placeholder title="Foundations" /> },
      { path: 'components', element: <Placeholder title="Components" /> },
      { path: 'patterns', element: <Placeholder title="Patterns" /> },
      { path: 'templates', element: <Placeholder title="Templates" /> },
      { path: 'changelog', element: <Placeholder title="Changelog" /> },
      { path: '*', element: <Placeholder title="페이지를 찾을 수 없습니다" /> },
    ],
  },
])
