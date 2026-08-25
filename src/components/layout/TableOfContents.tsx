import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { cn } from '@/lib/utils'

type Heading = {
  id: string
  text: string
  /** 2 또는 3 */
  level: number
}

/** 제목 텍스트에서 id를 만든다. 한글을 그대로 두면 URL 조각이 길어지므로 순번을 섞는다 */
function makeId(text: string, index: number): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  return `section-${index}-${slug || 'x'}`
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
      const nodes = [...main.querySelectorAll('h2, h3')]
      const found = nodes.map((node, index) => {
        if (!node.id) node.id = makeId(node.textContent ?? '', index)
        return {
          id: node.id,
          text: node.textContent?.trim() ?? '',
          level: node.tagName === 'H2' ? 2 : 3,
        }
      })
      setHeadings(found)
      setActive(found[0]?.id ?? null)
      return nodes
    }

    const nodes = collect()
    if (nodes.length === 0) return

    /*
     * 교차 여부만 보면 관찰 시작 시의 초기 콜백에서 여러 제목이 한꺼번에 보고되어
     * 엉뚱한 항목이 잡힌다. 관찰은 '무언가 바뀌었다'는 신호로만 쓰고,
     * 현재 위치는 매번 제목들의 좌표를 재서 정한다 —
     * 무대 상단에서 1/3 지점 위에 있는 마지막 제목이 지금 읽고 있는 절이다.
     */
    const root = document.querySelector('main')
    const pick = () => {
      if (!root) return

      /*
       * 스크롤 양 끝은 판정선으로 정하지 않는다.
       * 첫 절이 짧으면 맨 위에서도 다음 제목이 판정선을 넘고,
       * 마지막 절이 짧으면 끝까지 내려도 그 제목이 판정선까지 올라오지 못한다.
       */
      const EDGE = 8
      if (root.scrollTop <= EDGE) {
        setActive(nodes[0]?.id ?? null)
        return
      }
      if (root.scrollHeight - root.scrollTop - root.clientHeight <= EDGE) {
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
      className="hidden w-56 shrink-0 overflow-y-auto py-8 pr-6 xl:block"
    >
      <p className="text-muted-foreground mb-3 text-sm font-semibold">목차</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? 'location' : undefined}
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
