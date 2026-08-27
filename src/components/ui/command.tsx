import * as React from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { inputVariants } from '@/components/ui/input'
import {
  filterCommandEntries,
  groupCommandEntries,
  type CommandEntry,
} from '@/lib/command-filter'
import { cn } from '@/lib/utils'

export type { CommandEntry }

type CommandDivProps = React.ComponentProps<'div'> & { [key: `data-${string}`]: string }

export type CommandProps = {
  entries: CommandEntry[]
  /** 검색 칸의 자리표시자 */
  placeholder?: string
  /** 걸러진 결과가 없을 때 목록 자리에 보이는 문구 */
  emptyMessage?: string
  /** 문서의 격자가 걸러진 모습을 그대로 보이려고 쓴다. 열릴 때의 첫 질의다 */
  defaultQuery?: string
  onSelect?: (entry: CommandEntry) => void
  className?: string
  /*
   * Anatomy가 검색 칸·목록·묶음 머리글·항목 안에 data-anatomy를 주입할 때 쓰는
   * 통로다 — Combobox의 valueProps와 같은 이유로 연다. Command 자신은 이 값이
   * 무엇에 쓰이는지 모른다. groupLabelProps·itemProps는 반복되는 모든 머리글·
   * 항목에 똑같이 붙는다 — Slider의 thumbProps가 두 손잡이 모두에 붙는 것과 같다.
   */
  searchProps?: CommandDivProps
  listProps?: CommandDivProps
  groupLabelProps?: CommandDivProps
  itemProps?: CommandDivProps
}

/*
 * 키보드는 Combobox와 같은 방법으로 직접 다룬다 — Radix가 대신해 주지 않는다.
 * 짚은 항목은 activeIndex 하나로 관리하고, 검색 입력의 aria-activedescendant가
 * 그 인덱스가 가리키는 항목의 id를 알린다. 마우스 hover도 같은 activeIndex를
 * 옮겨서 키보드로 짚은 것과 마우스로 짚은 것이 항상 같은 항목을 가리키게 한다.
 *
 * 위아래 이동은 걸러진 뒤 disabled를 뺀 평탄한 목록(reachable) 하나를 두고
 * 그 인덱스로 짚는다 — 묶음마다 번호를 다시 세지 않아 이동이 묶음 경계를
 * 넘어 이어지고, disabled 항목은 애초에 이 목록에 없어 짚히지 않는다.
 *
 * Escape는 여기서 다루지 않는다 — CommandDialog로 쓰일 때는 Dialog의
 * DismissableLayer가 이미 Escape로 닫는다. Command 혼자 페이지 안에
 * 놓일 때는 닫을 표면 자체가 없다.
 */
function Command({
  entries,
  placeholder = '검색',
  emptyMessage = '일치하는 항목이 없습니다',
  defaultQuery = '',
  onSelect,
  className,
  searchProps,
  listProps,
  groupLabelProps,
  itemProps,
}: CommandProps) {
  const [query, setQuery] = React.useState(defaultQuery)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const listId = React.useId()

  const filtered = React.useMemo(() => filterCommandEntries(entries, query), [entries, query])
  const sections = React.useMemo(() => groupCommandEntries(filtered), [filtered])
  const reachable = React.useMemo(() => filtered.filter((entry) => !entry.disabled), [filtered])
  const activeEntry = reachable[activeIndex]
  const activeId = activeEntry ? `${listId}-item-${activeEntry.value}` : undefined

  function select(entry: CommandEntry) {
    if (entry.disabled) return
    onSelect?.(entry)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(reachable.length - 1, 0)))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        event.preventDefault()
        if (activeEntry) select(activeEntry)
        break
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div {...searchProps} className={cn('relative border-b p-1.5', searchProps?.className)}>
        <Search
          aria-hidden
          size={14}
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={filtered.length > 0}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputVariants({ className: 'pl-7' })}
        />
      </div>

      <div
        {...listProps}
        role="listbox"
        id={listId}
        aria-label="명령 목록"
        className={cn('max-h-96 overflow-y-auto p-2', listProps?.className)}
      >
        {filtered.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">{emptyMessage}</p>
        ) : (
          sections.map((section) => {
            const headingId = section.label ? `${listId}-group-${section.label}` : undefined
            return (
              <div
                key={section.label}
                role={section.label ? 'group' : undefined}
                aria-labelledby={headingId}
                className="mb-2 last:mb-0"
              >
                {/*
                  묶음 머리글은 제목 요소가 아니다 — div로 그린다. h3을 쓰면
                  Command가 포털 없이 main 안에 그대로 놓이는 탓에
                  assignHeadingIds가 이것을 문서의 절로 보고 고정 목차에
                  올린다. SearchDialog가 h3을 쓰고도 멀쩡한 것은 Radix가
                  그 표면을 document.body로 포털해 main 바깥에 두기
                  때문이고, 그 사정이 여기에는 없다.
                */}
                {section.label && (
                  <div
                    id={headingId}
                    {...groupLabelProps}
                    className={cn(
                      'text-muted-foreground px-2 py-1 text-2xs font-bold tracking-widest',
                      groupLabelProps?.className,
                    )}
                  >
                    {section.label.toUpperCase()}
                  </div>
                )}
                {section.entries.map((entry) => {
                  const isActive = entry.value === activeEntry?.value
                  return (
                    <div
                      key={entry.value}
                      {...itemProps}
                      id={`${listId}-item-${entry.value}`}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={entry.disabled || undefined}
                      onMouseEnter={() => {
                        if (!entry.disabled) setActiveIndex(reachable.indexOf(entry))
                      }}
                      onClick={() => select(entry)}
                      className={cn(
                        'flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none',
                        isActive && 'bg-accent text-accent-foreground',
                        entry.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
                        itemProps?.className,
                      )}
                    >
                      {entry.label}
                    </div>
                  )
                })}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function CommandDialog({
  open,
  onOpenChange,
  ...props
}: CommandProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" showClose={false} className="mt-16 max-w-xl gap-0 self-start p-0">
        {/*
          이름을 감춘 채로라도 DialogTitle을 두는 이유는 Dialog가 이름이
          없으면 '이름 없는 대화상자'로 읽히기 때문이다 — Combobox의
          PopoverContent에서 이미 같은 결론에 이르렀고 SearchDialog가
          이미 같은 방법을 쓴다.
        */}
        <DialogTitle className="sr-only">명령 검색</DialogTitle>
        <Command {...props} />
      </DialogContent>
    </Dialog>
  )
}

export { Command, CommandDialog }
