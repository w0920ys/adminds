import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findAdjacent } from '@/components/layout/nav-config'

export function DocFooterNav() {
  const { pathname } = useLocation()
  const { prev, next } = findAdjacent(pathname)
  if (!prev && !next) return null

  return (
    <nav className="mt-16 grid gap-3 border-t pt-6 sm:grid-cols-2" aria-label="문서 이동">
      {prev ? (
        <Link
          to={prev.to}
          className="hover:bg-accent/50 flex flex-col gap-1 rounded-lg border p-4"
        >
          <span className="text-muted-foreground flex items-center gap-1 text-2xs">
            <ChevronLeft size={12} /> 이전 문서
          </span>
          <strong className="text-sm">{prev.label}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={next.to}
          className="hover:bg-accent/50 flex flex-col items-end gap-1 rounded-lg border p-4 sm:text-right"
        >
          <span className="text-muted-foreground flex items-center gap-1 text-2xs">
            다음 문서 <ChevronRight size={12} />
          </span>
          <strong className="text-sm">{next.label}</strong>
        </Link>
      )}
    </nav>
  )
}
