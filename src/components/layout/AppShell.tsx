import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'
import { TableOfContents } from '@/components/layout/TableOfContents'

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)

  /*
   * 이 화면은 셸이 화면 높이에 고정되고 main만 스크롤한다. 문서는 스크롤 면이 아니다.
   * 주소에 해시가 있으면 브라우저가 제목에 id가 붙는 순간 뒤늦게 문서를 굴려
   * 헤더를 밀어내는데, 사용자 문서 스크롤은 막혀 있어 되돌아오지 못한다.
   * 시점을 맞추는 대신 규칙을 지킨다 — 문서가 굴러가면 되돌린다.
   */
  useEffect(() => {
    const keepDocumentStill = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0)
    }
    window.addEventListener('scroll', keepDocumentStill, { passive: true })
    return () => window.removeEventListener('scroll', keepDocumentStill)
  }, [])

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col">
      <Gnb onMenuClick={() => setLnbOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
        <main className="scrollbar-none min-w-0 flex-1 overflow-y-auto px-4 py-8 md:px-10">
          <div className="mx-auto flex max-w-6xl gap-10">
            <div className="min-w-0 flex-1">
              <Outlet />
              <DocFooterNav />
            </div>
            <TableOfContents />
          </div>
        </main>
      </div>
    </div>
  )
}
