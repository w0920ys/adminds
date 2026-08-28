import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Badge } from '@/components/ui/badge'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

/** variant마다 실제로 어울리는 라벨. Foundations의 Color Role이 정한 뜻을 그대로 따른다 */
const VARIANT_LABEL: Record<string, string> = {
  neutral: '초안',
  info: '점검 예정',
  success: '완료',
  warning: '만료 임박',
  destructive: '정지',
}

/** with-dot 레이아웃의 점. bg-current로 부모의 글자색을 그대로 물려받아 variant마다 새로 칠하지 않는다 */
function Dot() {
  return <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
}

function renderBadge(options: RenderOptions) {
  const { variant, layout } = options
  const label = VARIANT_LABEL[variant] ?? '상태'
  return (
    <Badge variant={variant as BadgeVariant}>
      {layout === 'with-dot' && <Dot />}
      {label}
    </Badge>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Badge와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'color-alone':
      return kind === 'do' ? (
        <Badge variant="success">
          <Dot />
          완료
        </Badge>
      ) : (
        <span aria-hidden className="bg-success inline-flex size-2.5 rounded-full" />
      )

    case 'no-hover':
      return kind === 'do' ? (
        <Badge variant="info">공지</Badge>
      ) : (
        <Badge variant="info" className="hover:bg-info/25 cursor-pointer">
          공지
        </Badge>
      )

    case 'no-single-char':
      return kind === 'do' ? (
        <Badge variant="neutral">신규</Badge>
      ) : (
        <Badge variant="neutral">신</Badge>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'table-status-column':
      return (
        <div className="bg-surface divide-y overflow-hidden rounded-md border">
          <div className="flex h-row-compact items-center gap-3 px-3">
            <span className="flex-1 truncate text-14">홍길동</span>
            <Badge variant="success">활성</Badge>
          </div>
          <div className="flex h-row-compact items-center gap-3 px-3">
            <span className="flex-1 truncate text-14">김서연</span>
            <Badge variant="warning">정지 예정</Badge>
          </div>
        </div>
      )

    case 'list-category':
      return (
        <div className="flex items-center gap-2">
          <span className="text-16 font-medium">1월 정기 점검 안내</span>
          <Badge variant="info">공지</Badge>
        </div>
      )

    case 'count':
      return (
        <div className="flex items-center gap-2 text-16">
          <span>승인 대기</span>
          <Badge variant="warning">12</Badge>
        </div>
      )

    case 'new-indicator':
      return (
        <div className="flex items-center gap-2">
          <span className="text-16 font-medium">대량 내보내기</span>
          <Badge variant="info">NEW</Badge>
        </div>
      )

    case 'long-label':
      return <Badge variant="warning">워크스페이스 소유자 권한 이전 대기</Badge>

    case 'many-in-row':
      return (
        <div className="flex max-w-64 flex-wrap gap-1.5">
          <Badge variant="info">결제</Badge>
          <Badge variant="success">정산</Badge>
          <Badge variant="warning">환불</Badge>
          <Badge variant="destructive">분쟁</Badge>
          <Badge variant="neutral">기타</Badge>
        </div>
      )

    case 'no-value':
      return (
        <div className="flex items-center gap-2 text-16">
          <span>등급</span>
          <span className="text-muted-foreground" aria-label="값 없음">
            —
          </span>
        </div>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="info">결제</Badge>
            <Badge variant="success">정산</Badge>
            <Badge variant="warning">환불</Badge>
          </div>
        </Bounds>
      )

    default:
      return null
  }
}

export function BadgePage() {
  const meta = getComponent('badge')
  if (!meta) return <Placeholder title="Badge 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderBadge}
      preview={
        <Badge data-anatomy="container" variant="success">
          <span data-anatomy="dot" aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
          <span data-anatomy="label">완료</span>
        </Badge>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
