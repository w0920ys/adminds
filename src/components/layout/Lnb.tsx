import { X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import type { DocLink } from '@/components/layout/nav-config'
import { findSection, isGroup, sections, UPDATE_DOT_SECTION_IDS } from '@/components/layout/nav-config'
import { UpdateDot } from '@/components/layout/UpdateDot'
import { currentRelease } from '@/data/releases'
import { isUpdatedInRelease } from '@/lib/freshness'
import { cn } from '@/lib/utils'

function LnbItem({
  doc,
  depth,
  showDots,
  onClose,
}: {
  doc: DocLink
  depth: number
  showDots: boolean
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
        {showDots && isUpdatedInRelease(doc.updatedAt, currentRelease.publishedAt) && (
          <UpdateDot className="ml-auto" />
        )}
      </NavLink>
      {doc.children?.map((child) => (
        <LnbItem key={child.to} doc={child} depth={depth + 1} showDots={showDots} onClose={onClose} />
      ))}
    </>
  )
}

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const section = findSection(pathname)

  /* 업데이트 점은 세 섹션(foundations·components·patterns)에서만 보인다 */
  const showDots = UPDATE_DOT_SECTION_IDS.has(section.id)

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-drawer bg-foreground/20 md:hidden"
          onClick={onClose}
          aria-label="메뉴 닫기"
        />
      )}
      {/*
       * overflow-y-auto는 md 밑에서도 켠다. 서랍은 fixed inset-y-0이라 높이가
       * 화면에 묶이는데 목록은 그보다 길다 — 모바일에서 목록이 1368px까지 자라
       * 아래쪽 항목에 손이 닿지 않았다. 게다가 잘리지 않은 만큼이 문서 높이로
       * 새어 나가 html의 scrollHeight가 화면의 여덟 배가 됐다.
       */}
      <aside
        className={cn(
          'bg-surface fixed inset-y-0 left-0 z-drawer flex w-60 flex-col overflow-y-auto border-r p-3 transition-transform',
          'md:static md:h-full md:shrink-0 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-9 items-center px-2">
          <p className="text-muted-foreground text-11 font-bold tracking-widest">
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
          <p className="text-muted-foreground mb-1.5 px-2 text-11 font-bold tracking-widest">
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
              <section key={item.label} className="mt-8 flex flex-col first:mt-0">
                <h2 className="text-muted-foreground mb-2 px-2 text-11 font-bold tracking-widest">
                  {item.label.toUpperCase()}
                </h2>
                {item.items.map((doc) => (
                  <LnbItem key={doc.to} doc={doc} depth={0} showDots={showDots} onClose={onClose} />
                ))}
              </section>
            ) : (
              <LnbItem key={item.to} doc={item} depth={0} showDots={showDots} onClose={onClose} />
            ),
          )}
        </nav>
      </aside>
    </>
  )
}
