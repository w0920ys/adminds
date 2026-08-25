import { useState } from 'react'
import { Outlet } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'
import { TableOfContents } from '@/components/layout/TableOfContents'

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col">
      <Gnb onMenuClick={() => setLnbOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
            <DocFooterNav />
          </div>
        </main>
        <TableOfContents />
      </div>
    </div>
  )
}
