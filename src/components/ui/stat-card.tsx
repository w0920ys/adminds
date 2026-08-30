import { Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TrendBadge } from '@/components/ui/trend-badge'

/*
 * KPI 타일. 어느 관리자 대시보드에나 있는 "라벨 + 큰 숫자 + 증감" 조합을
 * Card 위에 고정 배치한 것 — Card 자체는 범용이라 이 조합을 반복해서
 * 손으로 짜지 않도록 별도 컴포넌트로 승격했다.
 *
 * value는 이미 포맷된 문자열을 받는다 — 단위(₩, %, 만 단위 축약 등)는
 * 서비스마다 다른 포맷 규칙이라 이 컴포넌트가 알 필요가 없다(소비자의
 * format 유틸이 책임진다).
 *
 * hint(Info 아이콘)가 있으면 호출부가 트리를 TooltipProvider로 감싸야
 * 한다 — 안 감싸면 Tooltip이 런타임 에러를 던진다. 이 저장소는
 * AppShell이 최상단에서 감싸므로 문서·실제 화면 모두 안전하다.
 */
export function StatCard({
  label,
  value,
  deltaPct,
  higherIsBetter = true,
  hint,
}: {
  label: string
  value: string
  deltaPct?: number
  higherIsBetter?: boolean
  hint?: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-12 font-medium">{label}</span>
          {hint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground/70 hover:text-foreground -m-1 p-1"
                  aria-label={`${label} 설명`}
                >
                  <Info className="size-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{hint}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          {/*
           * whitespace-nowrap을 원본에 더한다 — 좁은 그리드 칸(대시보드 KPI
           * 타일을 grid-cols-2 이상으로 두는 흔한 배치)에서 줄바꿈 없는 이
           * span이 flex 폭에 눌리면 "1,204명" 같은 값이 "1,204"/"명"으로
           * 글자 중간이 아니라 숫자와 단위 사이에서 줄이 바뀌었다 — 숫자는
           * 절대 줄바꿈되면 안 된다. 폭이 정말 부족하면 줄바꿈 대신 카드
           * 밖으로 넘치는 쪽을 택한다.
           */}
          <span className="text-24 font-semibold tracking-tight tabular-nums whitespace-nowrap">
            {value}
          </span>
          {deltaPct != null && (
            <span className="mb-0.5 shrink-0">
              <TrendBadge deltaPct={deltaPct} higherIsBetter={higherIsBetter} />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
