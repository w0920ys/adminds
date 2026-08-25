import { Outlet } from 'react-router'

export function AppShell() {
  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <Outlet />
    </main>
  )
}
