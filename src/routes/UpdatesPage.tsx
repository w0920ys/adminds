import type { VariantProps } from 'class-variance-authority'
import { DocPage, DocSection, docProse } from '@/components/docs/DocPage'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge, type badgeVariants } from '@/components/ui/badge'
import { releases, type ReleaseChange } from '@/data/releases'
import { cn } from '@/lib/utils'

/**
 * 변경 종류를 배지 색으로 잇는다. New는 Lnb의 New 배지와 같은 info를 쓰고,
 * Fixed는 문제가 해소됐다는 뜻으로 success를, Updated는 둘 중 어느 쪽도
 * 아니므로 Badge의 기본값인 neutral을 쓴다.
 */
const CHANGE_BADGE_VARIANT: Record<ReleaseChange['type'], VariantProps<typeof badgeVariants>['variant']> = {
  New: 'info',
  Updated: 'neutral',
  Fixed: 'success',
}

export function UpdatesPage() {
  return (
    <DocPage
      title="Updates"
      description="버전마다 무엇을 새로 넣고 무엇을 고쳤는지 모은 기록입니다. 최신 버전이 맨 위에 옵니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          이 디자인 시스템은 releases.ts 한 곳에 버전 기록을 두고, Updates는 그 기록을
          최신순으로 펼쳐 보여줍니다. 화면 위쪽 제목 옆에 붙는 버전 번호도 같은
          기록에서 가장 최신 것을 가져옵니다.
        </p>
        <p className="text-muted-foreground text-16">
          버전을 열면 그 버전에서 바뀐 항목을 대상과 종류로 나눠 보여줍니다. 종류는
          새로 생긴 것(New), 기존 것이 바뀐 것(Updated), 문제를 고친 것(Fixed) 셋입니다.
        </p>
      </DocSection>

      <DocSection title="Releases">
        {/*
         * type="multiple" — 버전끼리 나란히 열어 비교해야 하는 자리다.
         * 순서대로 하나씩 읽는 글이 아니라, 궁금한 버전 몇 개를 동시에
         * 펼쳐 두고 무엇이 바뀌었는지 견주는 용도라 여럿을 동시에 열 수
         * 있어야 한다.
         */}
        <Accordion type="multiple">
          {releases.map((release) => (
            <AccordionItem key={release.version} value={release.version}>
              <AccordionTrigger>
                <span className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 text-left">
                  <Badge variant="neutral">{release.version}</Badge>
                  <span className="font-medium">{release.title}</span>
                  <time
                    className="text-muted-foreground ml-auto shrink-0 text-12 font-normal"
                    dateTime={release.publishedAt}
                  >
                    {release.publishedAt}
                  </time>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {/* 아코디언 안이라 DocSection의 직계 <p> 규칙이 닿지 않는다. 한 줄 길이를 여기서 직접 제한한다 */}
                <p className={cn('text-16', docProse)}>{release.purpose}</p>
                <ul className="mt-5 flex flex-col gap-4">
                  {release.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Badge variant={CHANGE_BADGE_VARIANT[change.type]} className="mt-0.5 shrink-0">
                        {change.type}
                      </Badge>
                      <div>
                        <strong className="text-foreground text-16">{change.target}</strong>
                        <p className={cn('mt-1 text-16', docProse)}>{change.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DocSection>
    </DocPage>
  )
}
