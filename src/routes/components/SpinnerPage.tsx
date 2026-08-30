import type { ComponentProps, ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type SpinnerSize = NonNullable<ComponentProps<typeof Spinner>['size']>

function renderSpinner(options: RenderOptions) {
  const size = (options.size ?? 'default') as SpinnerSize
  return <Spinner size={size} />
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Button·Badge·Table로
 * 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'pair-with-text':
      return kind === 'do' ? (
        <div className="text-muted-foreground flex items-center gap-2 text-16">
          <Spinner size="sm" aria-hidden />
          <span>불러오는 중</span>
        </div>
      ) : (
        <Spinner />
      )

    case 'progress-or-skeleton-for-long-waits':
      return kind === 'do' ? (
        <div className="text-muted-foreground flex items-center gap-2 text-16">
          <Spinner size="sm" aria-hidden />
          <span>잠깐 기다려 주세요</span>
        </div>
      ) : (
        <div className="text-muted-foreground flex items-center gap-2 text-16">
          <Spinner size="lg" aria-hidden />
          <span>대용량 파일을 업로드하는 중 (3분 이상 걸릴 수 있음)</span>
        </div>
      )

    case 'size-matches-context':
      return kind === 'do' ? (
        <Button disabled>
          <Spinner size="sm" aria-hidden />
          저장 중
        </Button>
      ) : (
        <Button disabled>
          <Spinner size="lg" aria-hidden />
          저장 중
        </Button>
      )

    case 'inherit-color':
      return kind === 'do' ? (
        <Button disabled>
          <Spinner size="sm" aria-hidden />
          저장 중
        </Button>
      ) : (
        <Button disabled>
          <Spinner size="sm" className="text-destructive" aria-hidden />
          저장 중
        </Button>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'button-loading':
      return (
        <Button disabled>
          <Spinner size="sm" aria-hidden />
          저장 중
        </Button>
      )

    case 'table-cell-loading':
      return (
        <Table label="동기화 상태">
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>동기화</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell>결제 내역</TableCell>
              <TableCell>
                <span className="text-muted-foreground flex items-center gap-1.5 text-14">
                  <Spinner size="sm" aria-hidden />
                  동기화 중
                </span>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell>사용자 목록</TableCell>
              <TableCell>
                <span className="text-success text-14">완료</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

    case 'full-page-loading':
      return (
        <div className="flex w-64 flex-col items-center gap-3 rounded-md border py-12">
          <Spinner size="lg" aria-hidden />
          <p className="text-muted-foreground text-14">화면을 불러오는 중입니다</p>
        </div>
      )

    case 'icon-only-button':
      return (
        <Button size="icon" variant="outline" disabled aria-label="저장 중">
          <Spinner size="sm" aria-hidden />
        </Button>
      )

    case 'on-colored-background':
      return (
        <div className="flex items-center gap-3">
          <Button disabled>
            <Spinner size="sm" aria-hidden />
            저장 중
          </Button>
          <Button variant="destructive" disabled>
            <Spinner size="sm" aria-hidden />
            삭제 중
          </Button>
        </div>
      )

    case 'inline-with-text':
      return (
        <div className="text-muted-foreground flex items-center gap-2 text-16">
          <Spinner size="sm" aria-hidden />
          <span>결제를 확인하는 중이에요</span>
        </div>
      )

    default:
      return null
  }
}

export function SpinnerPage() {
  const meta = getComponent('spinner')
  if (!meta) return <Placeholder title="Spinner 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSpinner}
      preview={<Spinner />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
