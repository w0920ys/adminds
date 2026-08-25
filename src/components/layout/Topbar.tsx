import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="bg-surface/90 sticky top-0 z-sticky flex h-14 items-center gap-3 border-b px-4 backdrop-blur md:px-8">
      <button className="md:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
        <Menu size={20} />
      </button>
      <div className="text-muted-foreground text-sm">Admin Design System</div>
      <button
        className="hover:bg-accent ml-auto grid size-8 place-items-center rounded-md"
        onClick={toggle}
        aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </header>
  )
}
