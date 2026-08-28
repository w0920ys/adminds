import { ChevronLeft, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
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
            'flex h-control items-center gap-1.5 text-16',
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

/*
 * 모바일 서랍은 두 화면을 오간다 — 'sections'(1depth, 전역 섹션 목록)와
 * 'section'(2depth, 한 섹션의 문서 목록). 어느 섹션을 2depth에서 보여줄지는
 * 경로가 아니라 이 상태가 정한다 — 1depth에서 섹션을 탭해도 아직 이동한
 * 게 아니므로(문서를 탭하기 전까지는), 실제 경로가 속한 섹션과 다를 수
 * 있다. 데스크톱 정적 사이드바는 이 상태를 쓰지 않는다 — 항상 2depth만
 * 보여주고 뒤로가기가 없다.
 */
type LnbView = { kind: 'sections' } | { kind: 'section'; sectionId: string }

export function Lnb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const routeSection = findSection(pathname)

  const [view, setView] = useState<LnbView>({ kind: 'section', sectionId: routeSection.id })

  /*
   * 서랍을 새로 열 때마다 현재 경로의 섹션 2depth부터 다시 시작한다 —
   * 마지막으로 보던 화면(1depth였든 다른 섹션이었든)을 기억하지 않는다.
   * useEffect로 "prop이 바뀌면 state를 리셋"하지 않는다 — 렌더 중에
   * 이전 open 값과 비교해 바로 맞춘다(React가 권하는 패턴이고, 이
   * 프로젝트의 oxlint가 effect 안 setState를 이미 경고로 잡는다).
   */
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setView({ kind: 'section', sectionId: routeSection.id })
  }

  const browsedSection =
    view.kind === 'section'
      ? (sections.find((item) => item.id === view.sectionId) ?? routeSection)
      : routeSection

  /* 업데이트 점은 세 섹션(foundations·components·patterns)에서만 보인다 */
  const showDots = UPDATE_DOT_SECTION_IDS.has(browsedSection.id)

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
          'bg-surface fixed inset-y-0 right-0 z-drawer flex w-60 flex-col overflow-y-auto border-l p-3 transition-transform',
          'md:static md:h-full md:shrink-0 md:translate-x-0',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/*
         * 헤더 행은 1depth와 2depth가 다르다 — 1depth는 "Sections" 라벨만,
         * 2depth는 뒤로가기+섹션 이름. 뒤로가기는 md:hidden이다(데스크톱
         * 정적 사이드바는 1depth 자체가 없다).
         */}
        {view.kind === 'sections' ? (
          <div className="flex h-9 items-center px-2">
            <p className="text-muted-foreground text-11 font-bold tracking-widest">Sections</p>
            <button
              className="text-muted-foreground ml-auto md:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex h-9 items-center gap-1 px-2">
            <button
              className="text-muted-foreground -ml-1 md:hidden"
              onClick={() => setView({ kind: 'sections' })}
              aria-label="섹션 목록으로 돌아가기"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-muted-foreground text-11 font-bold tracking-widest">
              {browsedSection.label.toUpperCase()}
            </p>
            <button
              className="text-muted-foreground ml-auto md:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/*
         * 1depth: 전역 섹션 목록. 탭해도 이동하지 않는다 — 2depth 미리보기로
         * 전환할 뿐이다(그래서 Link가 아니라 button이다). 데스크톱에는 없다.
         */}
        {view.kind === 'sections' && (
          <nav className="mt-2 flex flex-col md:hidden" aria-label="섹션 목록">
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView({ kind: 'section', sectionId: item.id })}
                aria-current={item.id === routeSection.id ? 'page' : undefined}
                className={cn(
                  'flex h-control items-center rounded-md px-2 text-left text-16',
                  item.id === routeSection.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent/60',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/*
         * 2depth: 한 섹션의 문서 목록. 데스크톱에서는 항상 이것만 보인다 —
         * view.kind가 'sections'여도 md 이상에서는 md:flex가 hidden을 덮는다
         * (모바일 폭에서 뒤로가기를 누른 채로 창을 넓히는 드문 경우까지 desktop
         * 정적 사이드바가 항상 문서 목록을 보여주게 한다).
         */}
        <nav
          className={cn('mt-2 flex flex-col', view.kind === 'sections' && 'hidden md:flex')}
          aria-label={`${browsedSection.label} 문서 목록`}
        >
          {browsedSection.items.map((item) =>
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
