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
     * 화면 위쪽 1/3 안에 들어온 제목 중 가장 아래 것을 현재 위치로 본다.
     * 스크롤 방향과 무관하게 "지금 읽고 있는 절"이 잡힌다.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id)
        if (visible.length > 0) setActive(visible[visible.length - 1])
      },
      { root: document.querySelector('main'), rootMargin: '0px 0px -67% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
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
