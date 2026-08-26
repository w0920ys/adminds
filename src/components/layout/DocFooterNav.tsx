import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findAdjacent, findDoc, findSection } from '@/components/layout/nav-config'

export function DocFooterNav() {
  const { pathname } = useLocation()
  const section = findSection(pathname)
  const doc = findDoc(pathname)
  const { prev, next } = findAdjacent(pathname)

  /** Overview는 섹션의 입구이므로 순서상의 이동을 두지 않는다 */
  const isOverview = pathname === section.to
  if (isOverview) return null
  if (!doc && !prev && !next) return null

  return (
    <footer className="mt-16 flex flex-col gap-4 border-t pt-6">
      {doc && (
        <time className="text-muted-foreground text-2xs" dateTime={doc.updatedAt}>
          Last updated {doc.updatedAt}
        </time>
      )}
      {(prev || next) && (
        <nav className="grid gap-3 sm:grid-cols-2" aria-label="문서 이동">
          {prev ? (
            <Link
              to={prev.to}
              className="bg-secondary/60 hover:bg-secondary flex flex-col gap-1.5 rounded-lg p-4 md:p-5"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-2xs">
                <ChevronLeft size={12} aria-hidden /> 이전 문서
              </span>
              <strong className="text-sm">{prev.label}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={next.to}
              className="bg-secondary/60 hover:bg-secondary flex flex-col items-end gap-1.5 rounded-lg p-4 sm:text-right md:p-5"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-2xs">
                다음 문서 <ChevronRight size={12} aria-hidden />
              </span>
              <strong className="text-sm">{next.label}</strong>
            </Link>
          )}
        </nav>
      )}
    </footer>
  )
}
