import * as React from 'react'
import { Component, FileText, Palette, Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { findSection, UPDATE_DOT_SECTION_IDS } from '@/components/layout/nav-config'
import { UpdateDot } from '@/components/layout/UpdateDot'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { currentRelease } from '@/data/releases'
import { recentDocs, searchIndex } from '@/data/search-index'
import { isUpdatedInRelease } from '@/lib/freshness'
import { search, tokenize, type SearchGroup, type SearchKind } from '@/lib/search'
import { cn } from '@/lib/utils'

/** 이 문서가 업데이트 점을 보일 자격이 있는가 — 세 섹션 소속이고, 이번 릴리스에서 바뀌었는가 */
function showsUpdateDot(to: string, updatedAt: string | undefined): boolean {
  if (!updatedAt) return false
  if (!UPDATE_DOT_SECTION_IDS.has(findSection(to).id)) return false
  return isUpdatedInRelease(updatedAt, currentRelease.publishedAt)
}

const KIND_ICON: Record<SearchKind, typeof Search> = {
  component: Component,
  doc: FileText,
  token: Palette,
}

/** 매치어만 강조한다. 첫 낱말 하나만 칠한다 — 여러 개를 칠하면 줄이 얼룩덜룩해진다 */
function Mark({ text, token }: { text: string; token: string }) {
  const at = token ? text.toLowerCase().indexOf(token) : -1
  if (at === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-info/20 text-info-on-tint rounded-xs bg-none font-semibold">
        {text.slice(at, at + token.length)}
      </mark>
      {text.slice(at + token.length)}
    </>
  )
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState('')
  /* 커서를 질의와 함께 들고 다닌다. 질의가 바뀌면 커서는 저절로 처음으로 돌아간다 */
  const [cursor, setCursor] = React.useState({ query: '', at: 0 })

  const token = tokenize(query)[0] ?? ''

  /* 빈 검색창은 "무엇을 칠 수 있는지" 가르치는 자리다. 전체 목록을 쏟는 대신 방금 바뀐 문서를 보인다 */
  const groups: SearchGroup[] = React.useMemo(() => {
    if (!query.trim()) {
      return recentDocs.length
        ? [{ kind: 'doc', label: '최근 갱신', hits: recentDocs.map((r) => ({ ...r, score: 0 })) }]
        : []
    }
    return search(query, searchIndex)
  }, [query])

  /* 위아래 이동은 묶음 경계를 넘어 이어진다 — 사용자에게 묶음은 칸막이가 아니라 이름표다 */
  const flat = React.useMemo(() => groups.flatMap((group) => group.hits), [groups])

  const active = cursor.query === query ? cursor.at : 0

  React.useEffect(() => {
    document.getElementById(`search-hit-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function moveTo(at: number) {
    setCursor({ query, at })
  }

  /* 닫힐 때 질의를 비운다 — Esc·덮개·이동 어느 쪽으로 닫히든 여기를 지난다 */
  function change(next: boolean) {
    if (!next) setQuery('')
    onOpenChange(next)
  }

  function go(index: number) {
    const hit = flat[index]
    if (!hit) return
    change(false)
    navigate(hit.to)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (flat.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveTo((active + 1) % flat.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveTo((active - 1 + flat.length) % flat.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      go(active)
    }
  }

  /* 묶음마다 평탄한 목록에서의 시작 번호. 위아래 이동이 묶음을 가로지르려면 번호가 이어져야 한다 */
  const offsets = groups.map((_, i) =>
    groups.slice(0, i).reduce((total, group) => total + group.hits.length, 0),
  )

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent
        size="lg"
        showClose={false}
        className="mt-16 max-w-xl gap-0 self-start p-0"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">문서 검색</DialogTitle>

        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Search size={16} className="text-muted-foreground shrink-0" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="컴포넌트·문서·토큰 검색"
            className="placeholder:text-muted-foreground h-full w-full bg-transparent text-16 outline-none"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-hits"
            aria-activedescendant={flat.length ? `search-hit-${active}` : undefined}
            aria-autocomplete="list"
          />
        </div>

        <div id="search-hits" role="listbox" aria-label="검색 결과" className="max-h-96 overflow-y-auto p-2">
          <p className="sr-only" aria-live="polite">
            {query.trim() ? `결과 ${flat.length}개` : ''}
          </p>

          {flat.length === 0 && (
            <p className="text-muted-foreground px-2 py-6 text-center text-16">
              ‘{query.trim()}’에 맞는 문서가 없습니다
            </p>
          )}

          {groups.map((group, groupIndex) => (
            <section key={group.kind + group.label} className="mb-2 last:mb-0">
              <h3 className="text-muted-foreground px-2 py-1 text-11 font-bold tracking-widest">
                {group.label.toUpperCase()}
              </h3>
              {group.hits.map((hit, i) => {
                const at = offsets[groupIndex] + i
                const Icon = KIND_ICON[hit.kind]
                return (
                  <button
                    key={hit.kind + hit.to + hit.title}
                    id={`search-hit-${at}`}
                    role="option"
                    aria-selected={at === active}
                    onMouseMove={() => moveTo(at)}
                    onClick={() => go(at)}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left',
                      at === active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Icon size={15} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-16 font-medium">
                          <Mark text={hit.title} token={token} />
                        </span>
                        {showsUpdateDot(hit.to, hit.updatedAt) && <UpdateDot />}
                      </span>
                      {hit.snippet && (
                        <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-12">
                          {hit.snippet[0]}
                          <mark className="bg-info/20 text-info-on-tint rounded-xs font-semibold">
                            {hit.snippet[1]}
                          </mark>
                          {hit.snippet[2]}
                        </span>
                      )}
                      {!hit.snippet && hit.summary && (
                        <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-12">
                          {hit.summary}
                        </span>
                      )}
                      <span className="text-muted-foreground mt-1 block text-11">
                        {hit.breadcrumb.join(' › ')}
                      </span>
                    </span>
                  </button>
                )
              })}
            </section>
          ))}
        </div>

        <div className="text-muted-foreground flex gap-3 border-t px-4 py-2 text-11">
          <span>↵ 이동</span>
          <span>↑↓ 선택</span>
          <span>esc 닫기</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
