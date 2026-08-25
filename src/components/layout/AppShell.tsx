import { useState } from 'react'
import { Outlet } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Gnb onMenuClick={() => setLnbOpen(true)} />
      <div className="flex">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
            <DocFooterNav />
          </div>
        </main>
      </div>
    </div>
  )
}
