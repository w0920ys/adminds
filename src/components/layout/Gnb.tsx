import { Command, Menu, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findSection, sections } from '@/components/layout/nav-config'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function Gnb({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const active = findSection(pathname)

  return (
    <header className="bg-surface/90 shrink-0 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6">
        <button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </span>
          <span className="text-sm font-bold tracking-tight">서비스 대시보드</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="전역 메뉴">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              aria-current={section.id === active.id ? 'page' : undefined}
              className={cn(
                'h-control flex items-center rounded-md px-3 text-sm',
                section.id === active.id
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent/60',
              )}
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <button
          className="hover:bg-accent ml-auto grid size-8 place-items-center rounded-md"
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}
