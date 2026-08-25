import type { ComponentProps, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type SkeletonShape = NonNullable<ComponentProps<typeof Skeleton>['shape']>

function renderSkeleton(options: RenderOptions) {
  const shape = (options.shape ?? 'text') as SkeletonShape
  if (shape === 'circle') return <Skeleton shape="circle" />
  return <Skeleton shape={shape} className="w-64" />
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. Card는 아직 없으므로(이 회차의 다른
 * Task가 만든다) 카드가 필요한 자리는 테두리 있는 상자로 대신한다 —
 * Separator의 SeparatorPage와 같은 이유다. 나머지는 모두 이미 있는
 * Table·Avatar와 Skeleton 자체로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'match-real-content':
      return kind === 'do' ? (
        <div className="flex w-48 flex-col gap-2">
          <Skeleton shape="title" />
          <Skeleton shape="text" className="w-3/4" />
        </div>
      ) : (
        <div className="w-48">
          <Skeleton shape="block" className="h-16" />
        </div>
      )

    case 'not-for-brief-loads':
      return kind === 'do' ? (
        <div className="flex items-center gap-2 text-sm">
          <Avatar size="sm">
            <AvatarFallback>홍</AvatarFallback>
          </Avatar>
          <span>홍길동</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Skeleton shape="circle" />
          <Skeleton shape="text" className="w-24" />
        </div>
      )

    case 'no-mixing-with-spinner':
      return kind === 'do' ? (
        <div className="flex w-48 flex-col gap-2">
          <Skeleton shape="title" />
          <Skeleton shape="text" className="w-3/4" />
        </div>
      ) : (
        <div className="flex w-48 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Loader2 className="text-muted-foreground size-4 animate-spin" aria-hidden />
            <span className="text-muted-foreground text-xs">불러오는 중</span>
          </div>
          <Skeleton shape="text" />
        </div>
      )

    case 'announce-via-text':
      return kind === 'do' ? (
        <div className="flex w-48 flex-col gap-2">
          <div role="status">
            <span className="sr-only">불러오는 중입니다</span>
          </div>
          <Skeleton shape="title" />
          <Skeleton shape="text" className="w-3/4" />
        </div>
      ) : (
        <div className="flex w-48 flex-col gap-2">
          <Skeleton shape="title" />
          <Skeleton shape="text" className="w-3/4" />
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'table-row':
      return (
        <Table label="불러오는 중인 사용자 목록">
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }, (_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell>
                  <Skeleton shape="text" className="w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton shape="text" className="w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton shape="text" className="w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    case 'card-list':
      return (
        <div className="flex w-56 flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-md border p-4">
              <Skeleton shape="title" />
              <Skeleton shape="text" />
              <Skeleton shape="text" />
            </div>
          ))}
        </div>
      )

    case 'detail-basic-info':
      return (
        <div className="flex w-64 flex-col gap-4 rounded-md border p-4">
          <Skeleton shape="title" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} shape="text" />
            ))}
          </div>
        </div>
      )

    case 'avatar-with-name':
      return (
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" />
          <div className="flex w-32 flex-col gap-2">
            <Skeleton shape="title" />
            <Skeleton shape="text" />
          </div>
        </div>
      )

    case 'shorter-or-longer-content':
      return (
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-2xs">짧은 경우</p>
            <div className="flex items-center gap-2">
              <Skeleton shape="text" className="w-32" />
              <span aria-hidden>→</span>
              <span>김</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-2xs">긴 경우</p>
            <div className="flex items-center gap-2">
              <Skeleton shape="text" className="w-32" />
              <span aria-hidden>→</span>
              <span>제니퍼 알렉산드라 김</span>
            </div>
          </div>
        </div>
      )

    case 'partial-arrival':
      return (
        <Table label="일부 항목만 도착한 사용자 목록">
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell>홍길동</TableCell>
              <TableCell>
                <Skeleton shape="text" className="w-28" />
              </TableCell>
              <TableCell>
                <Skeleton shape="text" className="w-12" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'repeat-count':
      return (
        <div className="flex w-56 flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="circle" />
              <Skeleton shape="text" className="flex-1" />
            </div>
          ))}
        </div>
      )

    case 'dark-theme':
      return (
        <div className="dark bg-background flex w-56 flex-col gap-2 rounded-md p-4">
          <Skeleton shape="title" />
          <Skeleton shape="text" />
          <Skeleton shape="text" className="w-2/3" />
        </div>
      )

    default:
      return null
  }
}

export function SkeletonPage() {
  const meta = getComponent('skeleton')
  if (!meta) return <Placeholder title="Skeleton 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSkeleton}
      preview={<Skeleton />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
