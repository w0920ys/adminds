import { X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import type { DocLink } from '@/components/layout/nav-config'
import { findSection, isGroup, sections } from '@/components/layout/nav-config'
import { Badge } from '@/components/ui/badge'
import { currentRelease } from '@/data/releases'
import { isFresh } from '@/lib/freshness'
import { cn } from '@/lib/utils'

function LnbItem({
  doc,
  depth,
  now,
  onClose,
}: {
  doc: DocLink
  depth: number
  now: Date
  onClose: () => void
}) {
  return (
    <>
      <NavLink
        to={doc.to}
        end
        onClick={onClose}
        className={({ isActive }) =>
          cn(
            'flex h-control items-center gap-1.5 text-sm',
            depth === 0 ? 'rounded-md px-2' : 'ml-2 border-l pl-3',
            isActive
              ? 'bg-accent text-accent-foreground font-semibold'
              : 'text-muted-foreground hover:bg-accent/60',
          )
        }
      >
        <span className="truncate">{doc.label}</span>
        {isFresh(doc.updatedAt, now) && (
          <Badge variant="info" className="ml-auto shrink-0 px-1.5">
            New
          </Badge>
        )}
      </NavLink>
      {doc.children?.map((child) => (
        <LnbItem key={child.to} doc={child} depth={depth + 1} now={now} onClose={onClose} />
      ))}
    </>
  )
}

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const section = findSection(pathname)

  /*
   * 배지의 기준 시각. 문서를 옮길 때마다 다시 잡으므로 자정을 넘긴 뒤
   * 다른 문서로 이동하면 그때 배지가 떨어진다. 화면을 켜둔 채 자정을
   * 넘기는 경우까지 쫓지는 않는다 — 그 정확도를 위해 타이머를 두는 값은 없다.
   */
  const now = new Date()

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-drawer bg-foreground/20 md:hidden"
          onClick={onClose}
          aria-label="메뉴 닫기"
        />
      )}
      <aside
        className={cn(
          'bg-surface fixed inset-y-0 left-0 z-drawer flex w-60 flex-col border-r p-3 transition-transform',
          'md:static md:h-full md:shrink-0 md:translate-x-0 md:overflow-y-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-9 items-center px-2">
          <p className="text-muted-foreground text-2xs font-bold tracking-widest">
            {section.label.toUpperCase()}
          </p>
          <button
            className="text-muted-foreground ml-auto md:hidden"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-3 flex flex-col border-b pb-3 md:hidden">
          <p className="text-muted-foreground mb-1.5 px-2 text-2xs font-bold tracking-widest">
            Sections
          </p>
          {sections.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={onClose}
              aria-current={item.id === section.id ? 'page' : undefined}
              className={cn(
                'flex h-control items-center rounded-md px-2 text-sm',
                item.id === section.id
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <nav className="mt-2 flex flex-col" aria-label={`${section.label} 문서 목록`}>
          {section.items.map((item) =>
            isGroup(item) ? (
              /* 묶음은 이동하지 않으므로 링크가 아니라 목록의 머리글이다 */
              <section key={item.label} className="mt-4 flex flex-col first:mt-0">
                <h2 className="text-muted-foreground mb-1 px-2 text-2xs font-bold tracking-widest">
                  {item.label.toUpperCase()}
                </h2>
                {item.items.map((doc) => (
                  <LnbItem key={doc.to} doc={doc} depth={0} now={now} onClose={onClose} />
                ))}
              </section>
            ) : (
              <LnbItem key={item.to} doc={item} depth={0} now={now} onClose={onClose} />
            ),
          )}
        </nav>

        <div className="mt-auto rounded-md border p-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-success size-1.5 rounded-full" />
            <strong className="text-xs">{currentRelease.version}</strong>
          </div>
          <p className="text-muted-foreground mt-0.5 text-2xs">{currentRelease.title}</p>
        </div>
      </aside>
    </>
  )
}
