import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { DocFooterNav } from '@/components/layout/DocFooterNav'
import { Gnb } from '@/components/layout/Gnb'
import { Lnb } from '@/components/layout/Lnb'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { scrollRoot } from '@/lib/scroll'

/*
 * 아이콘 전용 버튼이 많은 어드민에서, 지연이 없으면 마우스가 스쳐 지나갈
 * 때마다 말풍선이 소음처럼 뜬다. 반대로 너무 길면 아이콘의 뜻을 몰라
 * 헤매는 시간이 길어진다. Radix 기본값(700ms)보다 짧은 300ms로 잡아
 * 무심코 지나가는 호버는 걸러내면서도 답을 오래 기다리게 하지 않는다.
 */
const TOOLTIP_DELAY_MS = 300

/*
 * Toast 한 줄(대략 20자 안팎)을 읽고, 되돌리기가 있으면 그것까지 누를
 * 여유를 준다. Radix 기본값과 같은 5000ms를 그대로 쓴다 — 이 값을
 * 새로 정할 근거가 이 시스템에는 없고, 짧은 문장 하나를 읽기에
 * 부족하지도 넘치지도 않는다.
 */
const TOAST_DURATION_MS = 5000

export function AppShell() {
  const [lnbOpen, setLnbOpen] = useState(false)
  const { pathname } = useLocation()

  /*
   * 이 화면은 셸이 화면 높이에 고정되고 main만 스크롤한다. 문서는 스크롤 면이 아니다.
   * 주소에 해시가 있으면 브라우저가 제목에 id가 붙는 순간 뒤늦게 문서를 굴려
   * 헤더를 밀어내는데, 사용자 문서 스크롤은 막혀 있어 되돌아오지 못한다.
   * 시점을 맞추는 대신 규칙을 지킨다 — 문서가 굴러가면 되돌린다.
   *
   * main이 relative를 갖게 된 뒤로는 문서에 굴릴 여지 자체가 없다. 여덟 문서에서
   * html의 scrollHeight가 화면 높이와 같음을 확인했다. 그래도 이 감시는 남긴다 —
   * 잘리지 않고 새어 나가는 요소가 다시 생기면 그때 헤더가 밀려나기 때문이다.
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
      <ToastProvider duration={TOAST_DURATION_MS}>
        <div className="bg-background text-foreground flex h-dvh flex-col">
          <Gnb onMenuClick={() => setLnbOpen(true)} />
          <div className="flex min-h-0 flex-1">
            <Lnb open={lnbOpen} onClose={() => setLnbOpen(false)} />
            {/*
              * relative가 필요하다. sr-only는 position:absolute인데, 조상 중에
              * 위치를 잡은 것이 없으면 담는 상자가 문서 전체가 되어 main의
              * overflow에 잘리지 않는다. 그러면 화면 밖 문서 좌표에 놓인 채로
              * 문서에 스크롤 여지를 만든다 — Button 문서에서 재보니 html의
              * scrollHeight가 812이 아니라 7085였고, html·body에 overflow:hidden을
              * 걸어 뒀는데도 window.scrollTo(0, 600)이 실제로 먹었다.
              * main이 담는 상자가 되면 그 여지가 사라진다(재보니 812로 돌아온다).
              */}
            <main className="scrollbar-none relative min-w-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
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
          <ToastViewport />
        </div>
      </ToastProvider>
    </TooltipProvider>
  )
}
