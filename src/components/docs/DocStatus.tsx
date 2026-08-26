import type { ComponentStatus } from '@/data/registry'
import { cn } from '@/lib/utils'

/*
 * Badge와 같은, 15% 탄 배경 위에 글자를 얹는 칩 패턴이라 같은
 * on-tint 토큰을 쓴다 — text-2xs font-bold(11px)는 WCAG 4.5:1
 * 대상이고, 탄 배경 위에 원래 색을 그대로 쓰면 라이트에서 기준에
 * 못 미친다(review 1.91 · stable 3.06 · deprecated 3.64 · draft
 * 4.34였다).
 */
const STATUS_STYLE: Record<ComponentStatus, string> = {
  draft: 'bg-muted text-neutral-on-tint',
  review: 'bg-warning/15 text-warning-on-tint',
  stable: 'bg-success/15 text-success-on-tint',
  deprecated: 'bg-destructive/15 text-destructive-on-tint',
}

/** 문서 제목 아래에 붙는 표시. 컴포넌트 문서와 패턴 문서가 같은 줄을 쓴다 */
export function DocStatus({
  status,
  addedIn,
  changedIn,
  verified,
}: {
  status: ComponentStatus
  addedIn: string
  changedIn: string
  verified: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn('rounded px-2 py-0.5 text-2xs font-bold', STATUS_STYLE[status])}>
        {status}
      </span>
      <span className="text-muted-foreground text-2xs">
        {addedIn}에 추가 · {changedIn}에서 마지막 변경
        {verified ? ' · 검증 완료' : ' · 검증 필요'}
      </span>
    </div>
  )
}
