import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { TooltipProvider } from '@/components/ui/tooltip'
import { scrollRoot } from '@/lib/scroll'

/*
 * 아이콘 전용 버튼이 많은 어드민에서, 지연이 없으면 마우스가 스쳐 지나갈
 * 때마다 말풍선이 소음처럼 뜬다. 반대로 너무 길면 아이콘의 뜻을 몰라
 * 헤매는 시간이 길어진다. Radix 기본값(700ms)보다 짧은 300ms로 잡아
 * 무심코 지나가는 호버는 걸러내면서도 답을 오래 기다리게 하지 않는다.
 */
const TOOLTIP_DELAY_MS = 300

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)
  const { pathname } = useLocation()

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

  useEffect(() => {
    /*
     * 다른 문서로 옮겨도 앞 문서에서 내려간 만큼이 남아 중간에서 시작한다.
     * 주소가 절을 가리키면 목차가 그 자리로 옮기므로 여기서는 손대지 않는다.
     */
    if (window.location.hash) return
    const root = scrollRoot()
    if (root) root.scrollTop = 0
  }, [pathname])

  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAY_MS}>
      <div className="bg-background text-foreground flex h-dvh flex-col">
        <Gnb onMenuClick={() => setLnbOpen(true)} />
        <div className="flex min-h-0 flex-1">
          <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
          <main className="scrollbar-none min-w-0 flex-1 overflow-y-auto px-4 py-8 md:px-10">
            <div className="mx-auto flex max-w-6xl gap-10">
              <div className="min-w-0 flex-1">
                <Outlet />
                <DocFooterNav />
                <SiteFooter />
              </div>
              <TableOfContents />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
