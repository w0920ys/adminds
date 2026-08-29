import * as React from 'react'
import { Command, Menu, Moon, Search, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { findSection, sections } from '@/components/layout/nav-config'
import { SearchDialog } from '@/components/layout/SearchDialog'
import { currentRelease } from '@/data/releases'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function Gnb({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const active = findSection(pathname)
  const [searchOpen, setSearchOpen] = React.useState(false)

  /* ⌘K로 연다. 사용자가 이미 어딘가에 쓰고 있으면 가로채지 않는다 */
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) return
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return
      event.preventDefault()
      setSearchOpen(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="bg-surface/90 shrink-0 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </span>
          <span className="text-16 font-bold tracking-tight">서비스 대시보드</span>
          <span className="text-muted-foreground text-12 font-medium">{currentRelease.version}</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="전역 메뉴">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              aria-current={section.id === active.id ? 'page' : undefined}
              className={cn(
                'h-control flex items-center rounded-md px-3 text-16',
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
          /*
           * h-11(44px)을 모바일 기본값으로 둔다 — Apple HIG·Material 모두
           * 최소 터치 영역을 44px 안팎으로 잡는데, 예전 h-8(32px)은 그
           * 기준에 못 미쳤다. md 이상(마우스 입력이 흔한 화면)에서는
           * md:h-8로 되돌려 헤더가 다시 조밀해지게 한다.
           */
          className="text-muted-foreground hover:bg-accent hover:text-foreground ml-auto flex h-11 items-center gap-2 rounded-md border px-2.5 md:h-8"
          onClick={() => setSearchOpen(true)}
          aria-label="문서 검색"
        >
          <Search size={15} aria-hidden />
          <span className="hidden text-12 sm:inline">검색</span>
          {/* py-0.5→py-0 + text-12: text-11일 때의 높이(20px)를 그대로 지킨다(Badge와 같은 트릭) */}
          <kbd className="bg-muted hidden rounded px-1 py-0 text-12 font-medium sm:inline">
            ⌘K
          </kbd>
        </button>

        <button
          className="hover:bg-accent ml-1 grid size-11 place-items-center rounded-md md:size-8"
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/*
         * md:hidden이라 데스크톱 축소가 필요 없다 — 모바일에서만 보이는
         * 버튼이라 터치 영역(44px)을 그대로 둔다. 예전에는 크기 클래스가
         * 아예 없어 클릭 영역이 Menu 아이콘 자체의 20px뿐이었다.
         */}
        <button
          className="ml-1 grid size-11 place-items-center rounded-md md:hidden"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
