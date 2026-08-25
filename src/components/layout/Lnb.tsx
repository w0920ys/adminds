import { X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { findSection } from '@/components/layout/nav-config'
import { currentRelease } from '@/data/releases'
import { cn } from '@/lib/utils'

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const section = findSection(pathname)

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
          'md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0',
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

        <nav className="mt-2 flex flex-col" aria-label={`${section.label} 문서 목록`}>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex h-control items-center rounded-md px-2 text-sm',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/60',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
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
