import { Command, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { navGroups } from '@/components/layout/nav-config'
import { currentRelease } from '@/data/releases'
import { cn } from '@/lib/utils'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          'bg-surface fixed inset-y-0 left-0 z-drawer flex w-60 flex-col border-r p-3 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-9 items-center gap-2 px-2">
          <div className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </div>
          <span className="text-sm font-bold tracking-tight">서비스 대시보드</span>
          <button
            className="text-muted-foreground ml-auto md:hidden"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-6" aria-label="서비스 대시보드 메뉴">
          {navGroups.map((group) => (
            <section key={group.label}>
              <p className="text-muted-foreground mb-1.5 px-2 text-2xs font-bold tracking-widest">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex h-control items-center gap-2.5 rounded-md px-2 text-sm',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-accent/60',
                    )
                  }
                >
                  <item.icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <em className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-2xs not-italic">
                      {item.badge}
                    </em>
                  )}
                </NavLink>
              ))}
            </section>
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
