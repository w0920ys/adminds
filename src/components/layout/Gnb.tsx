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

        {/*
         * 검색·테마 전환·메뉴 셋을 같은 모양(정사각형, 테두리 없음,
         * hover:bg-accent)으로 통일한다 — 검색만 테두리 있는 pill이고
         * "검색"·⌘K 글자가 붙어 있어 나머지 둘과 다른 버튼처럼 보였다.
         * ⌘K는 여전히 키보드 단축키로 동작한다(위 useEffect) — 여기서
         * 빠지는 건 그 힌트를 보여주던 글자뿐이다.
         *
         * 모바일에서는 control-lg(40px)로 터치 영역을 넉넉히 준다 — 데스크톱은
         * 마우스로 정확히 짚을 수 있어 지금 크기(32px)를 그대로 둔다. 이
         * 저장소가 이미 Button 등에서 쓰는 control 높이 스케일과 같은 값이다.
         */}
        <button
          className="hover:bg-accent size-control-lg ml-auto grid place-items-center rounded-md md:size-8"
          onClick={() => setSearchOpen(true)}
          aria-label="문서 검색 (⌘K)"
        >
          <Search size={17} aria-hidden />
        </button>

        <button
          className="hover:bg-accent size-control-lg ml-1 grid place-items-center rounded-md md:size-8"
          onClick={toggle}
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* 데스크톱에는 아예 없는 버튼이라 md:hidden 쪽 크기는 필요 없다 */}
        <button
          className="hover:bg-accent size-control-lg ml-1 grid place-items-center rounded-md md:hidden"
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
