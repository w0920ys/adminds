import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { assignHeadingIds } from '@/lib/heading-id'
import { cn } from '@/lib/utils'

type Heading = {
  id: string
  text: string
  /** 2 또는 3 */
  level: 2 | 3
}

/*
 * 브라우저의 기본 앵커 이동은 어느 조상을 굴릴지 스스로 정해 문서까지 함께 굴린다.
 * 그러면 GNB가 화면 밖으로 밀리고, 문서 스크롤은 막혀 있어 되돌아오지도 않는다.
 * 스크롤 컨테이너가 main이므로 이동도 우리가 맡는다.
 */
function scrollToHeading(id: string) {
  const root = document.querySelector('main')
  const target = document.getElementById(id)
  if (!root || !target) return
  root.scrollTop += target.getBoundingClientRect().top - root.getBoundingClientRect().top
}

export function TableOfContents() {
  const { pathname } = useLocation()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    /* 렌더가 끝난 뒤 훑는다. 측정이 아니라 목록 수집이므로 한 프레임 뒤로 미뤄도 된다 */
    const collect = () => {
      const nodes = assignHeadingIds(main)
      const found = nodes.map((node): Heading => ({
        id: node.id,
        text: node.textContent?.trim() ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      }))
      setHeadings(found)
      setActive(found[0]?.id ?? null)
      return nodes
    }

    const nodes = collect()
    if (nodes.length === 0) return

    /*
     * 복사해 둔 주소로 들어온 경우. id는 방금 collect()가 붙였으므로
     * 그 전에는 대상을 찾을 수 없다 — 이 순서가 중요하다.
     * id에 한글이 들어가므로(예: 사용-규칙) 주소창에서는 퍼센트 인코딩된 형태로
     * 돌아와 decodeURIComponent가 필요하다.
     */
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash) scrollToHeading(hash)

    /*
     * 교차 여부만 보면 관찰 시작 시의 초기 콜백에서 여러 제목이 한꺼번에 보고되어
     * 엉뚱한 항목이 잡힌다. 관찰은 '무언가 바뀌었다'는 신호로만 쓰고,
     * 현재 위치는 매번 제목들의 좌표를 재서 정한다 —
     * 무대 상단에서 1/3 지점 위에 있는 마지막 제목이 지금 읽고 있는 절이다.
     */
    const root = main
    const pick = () => {
      if (!root) return

      const EDGE = 8
      const maxScroll = root.scrollHeight - root.clientHeight

      /*
       * 스크롤할 곳이 없는 문서는 전체가 한눈에 들어오므로 첫 제목이 현재 위치다.
       * 이 갈래를 먼저 두지 않으면 아래 두 조건이 동시에 참이 되어
       * 순서가 우연히 승자를 정한다.
       */
      if (maxScroll <= EDGE) {
        setActive(nodes[0]?.id ?? null)
        return
      }

      /*
       * 스크롤 양 끝은 판정선으로 정하지 않는다.
       * 첫 절이 짧으면 맨 위에서도 다음 제목이 판정선을 넘고,
       * 마지막 절이 짧으면 끝까지 내려도 그 제목이 판정선까지 올라오지 못한다.
       */
      if (root.scrollTop <= EDGE) {
        setActive(nodes[0]?.id ?? null)
        return
      }
      if (maxScroll - root.scrollTop <= EDGE) {
        setActive(nodes[nodes.length - 1]?.id ?? null)
        return
      }

      const line = root.getBoundingClientRect().top + root.clientHeight / 3
      let current = nodes[0]?.id ?? null
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id
      }
      setActive(current)
    }

    pick()
    const observer = new IntersectionObserver(pick, { root, threshold: 0 })
    nodes.forEach((node) => observer.observe(node))
    root?.addEventListener('scroll', pick, { passive: true })
    return () => {
      observer.disconnect()
      root?.removeEventListener('scroll', pick)
    }
  }, [pathname])

  if (headings.length < 2) return null

  return (
    <nav
      aria-label="이 문서의 목차"
      className="sticky top-8 hidden h-fit w-56 shrink-0 self-start xl:block"
    >
      <p className="text-muted-foreground mb-3 text-sm font-semibold">Contents</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault()
                scrollToHeading(heading.id)
                /* 라우터가 이 항목의 state에 자기 장부를 넣어 둔다. null로 덮으면 지워진다 */
                history.replaceState(history.state, '', `#${heading.id}`)
              }}
              className={cn(
                'block border-l py-1.5 text-sm',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                active === heading.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
