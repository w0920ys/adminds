import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { categoryLabel, components, getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 넘치는 목록·표는 손으로 적지 않는다. 이 저장소에 이미 있는
 * components(@/data/registry)를 그대로 늘어놓아 목록을 만든다 — 길이도
 * 내용도 데이터에서 그대로 파생된다.
 */
function ComponentList({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {components.map((component) => (
        <li key={component.id} className="border-b py-2 last:border-b-0">
          {component.name}
        </li>
      ))}
    </ul>
  )
}

function WideTable({ rows = components }: { rows?: typeof components }) {
  return (
    <table className="text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>구분</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>다른 이름</TableHead>
          <TableHead>도입 버전</TableHead>
          <TableHead>변경 버전</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((component) => (
          <TableRow key={component.id}>
            <TableCell>{component.name}</TableCell>
            <TableCell>{categoryLabel[component.category]}</TableCell>
            <TableCell>{component.status}</TableCell>
            <TableCell>{component.aliases.join(' · ')}</TableCell>
            <TableCell>{component.addedIn}</TableCell>
            <TableCell>{component.changedIn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </table>
  )
}

/*
 * render가 받는 축은 두 개뿐이다 — orientation·visibility. visibility는
 * ScrollArea의 type으로 그대로 넘긴다(hover 그대로, always 그대로).
 * 격자의 각 칸은 높이를 정한 상자다 — w-full max-w-sm으로 두어 좁은
 * 화면에서 줄어든다.
 */
function renderScrollArea(options: RenderOptions) {
  const orientation = (options.orientation ?? 'vertical') as 'vertical' | 'horizontal' | 'both'
  const type = options.visibility === 'always' ? 'always' : 'hover'

  if (orientation === 'horizontal') {
    return (
      <ScrollArea type={type} orientation="horizontal" className="h-40 w-full max-w-sm rounded-lg border">
        <div className="flex gap-2 p-4">
          {components.map((component) => (
            <Badge key={component.id} className="shrink-0">
              {component.name}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    )
  }

  if (orientation === 'both') {
    return (
      <ScrollArea type={type} orientation="both" className="h-40 w-full max-w-sm rounded-lg border">
        <WideTable />
      </ScrollArea>
    )
  }

  return (
    <ScrollArea type={type} orientation="vertical" className="h-40 w-full max-w-sm rounded-lg border">
      <ComponentList className="px-4 text-sm" />
    </ScrollArea>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    /*
     * DO는 높이를 정한 상자 안의 ScrollArea다. DON'T는 실제로 크기를
     * 주지 않은 ScrollArea를 렌더링하지 않는다 — 그러면 내용이 문서
     * 페이지 안에서 그대로 늘어나 이 예시 칸 자체가 깨진다. 대신 그
     * 결과만 글로 짚는다.
     */
    case 'fixed-size-only':
      return kind === 'do' ? (
        <ScrollArea className="h-40 w-full max-w-64 rounded-lg border">
          <ComponentList className="px-3 text-sm" />
        </ScrollArea>
      ) : (
        <div className="text-muted-foreground w-full max-w-64 rounded-lg border border-dashed p-4 text-12">
          h-40처럼 높이를 주지 않으면 아무것도 굴러가지 않고, 안의 목록
          37개가 그대로 늘어나 이 카드 밖까지 밀려납니다.
        </div>
      )

    case 'dont-wrap-whole-page':
      return kind === 'do' ? (
        <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border p-3">
          <p className="text-sm font-semibold">최근 활동</p>
          <ScrollArea className="h-32 w-full">
            <ComponentList className="pr-3 text-12" />
          </ScrollArea>
        </div>
      ) : (
        <div className="text-muted-foreground w-full max-w-64 rounded-lg border border-dashed p-4 text-12">
          main이나 페이지 전체를 ScrollArea로 감싸면, 브라우저가
          되돌려 주던 스크롤 위치가 사라집니다.
        </div>
      )

    case 'show-horizontal-cutoff':
      return (
        <div className="relative w-full max-w-64">
          <ScrollArea orientation="horizontal" className="h-24 w-full rounded-lg border">
            <div className="flex gap-2 p-3">
              {components.slice(0, 12).map((component) => (
                <Badge key={component.id} className="shrink-0">
                  {component.name}
                </Badge>
              ))}
            </div>
          </ScrollArea>
          {kind === 'do' && (
            <div
              aria-hidden
              className="from-surface-raised pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent"
            />
          )}
        </div>
      )

    case 'set-always-visible-when-it-matters':
      return (
        <ScrollArea type={kind === 'do' ? 'always' : 'hover'} className="h-32 w-full max-w-64 rounded-lg border">
          <ComponentList className="px-3 text-12" />
        </ScrollArea>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'sheet-body':
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              컴포넌트 목록
            </Button>
          </SheetTrigger>
          <SheetContent size="sm">
            <SheetHeader>
              <SheetTitle>컴포넌트 {components.length}개</SheetTitle>
            </SheetHeader>
            <ScrollArea className="min-h-0 w-full flex-1">
              <ComponentList className="pr-3 text-sm" />
            </ScrollArea>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">닫기</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

    case 'popover-list':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              컴포넌트 고르기
            </Button>
          </PopoverTrigger>
          <PopoverContent aria-label="컴포넌트 목록" className="w-56">
            <ScrollArea className="h-48 w-full">
              <ComponentList className="pr-3 text-sm" />
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )

    case 'wide-table':
      return (
        <ScrollArea orientation="horizontal" className="h-32 w-full max-w-96 rounded-lg border">
          <WideTable rows={components.slice(0, 6)} />
        </ScrollArea>
      )

    case 'log-viewer':
      return (
        <ScrollArea type="always" className="h-40 w-full max-w-96 rounded-lg border">
          <pre className="p-3 font-mono text-12 whitespace-pre-wrap">
            {components
              .map((component) => `${component.addedIn}  ${component.id} 추가됨 (${component.status})`)
              .join('\n')}
          </pre>
        </ScrollArea>
      )

    case 'short-content':
      return (
        <ScrollArea className="h-40 w-full max-w-64 rounded-lg border">
          <ComponentList className="px-3 text-sm" />
        </ScrollArea>
      )

    case 'both-directions':
      return (
        <ScrollArea orientation="both" className="h-40 w-full max-w-64 rounded-lg border">
          <WideTable />
        </ScrollArea>
      )

    case 'always-visible':
      return (
        <ScrollArea type="always" className="h-40 w-full max-w-64 rounded-lg border">
          <ComponentList className="px-3 text-sm" />
        </ScrollArea>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <ScrollArea className="h-32 w-full max-w-sm rounded-lg border">
            <ComponentList className="px-2 text-12" />
          </ScrollArea>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * data-anatomy는 ScrollArea의 ...props를 통해 Root에 놓인다. Root는
 * position: relative일 뿐 자기 크기가 없고, Viewport가 size-full로 그
 * 크기를 그대로 채운다 — 스크롤바는 absolute라 레이아웃 크기에
 * 관여하지 않는다. 그래서 Root의 사각형은 실제 Viewport의 사각형과
 * 같다. Content는 children으로 넘긴 자리를 그대로 표시한다.
 *
 * Scrollbar·Thumb는 이 페이지에서 지시선을 그리지 않는다 —
 * ScrollArea·ScrollBar 두 export 중 어느 쪽도 그 둘에 개별 속성을
 * 전달할 통로를 열어 두지 않았고(Switch의 thumbProps와 다르다),
 * 기본값인 hover 상태에서는 실제로 마우스가 올라오기 전까지 DOM에
 * 있지도 않다. 아래 번호 목록에서 둘의 역할은 그대로 설명한다.
 */
function AnatomyPreview() {
  return (
    <ScrollArea data-anatomy="viewport" className="h-40 w-72 rounded-lg border">
      <ul data-anatomy="content" className="px-4 text-sm">
        {components.map((component) => (
          <li key={component.id} className="border-b py-2 last:border-b-0">
            {component.name}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

export function ScrollAreaPage() {
  const meta = getComponent('scroll-area')
  if (!meta) return <Placeholder title="Scroll Area 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderScrollArea}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
