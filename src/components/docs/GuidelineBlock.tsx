import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { docProse } from '@/components/docs/DocPage'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'
import type { Guideline } from '@/data/registry'
import { cn } from '@/lib/utils'

function Side({
  kind,
  example,
  rules,
}: {
  kind: 'do' | 'dont'
  example?: ReactNode
  rules: string[]
}) {
  if (!example && rules.length === 0) return null

  return (
    /*
     * min-w-0이 필요하다 — 이 div는 부모 grid의 칸이다. 칸은 기본이
     * min-width:auto라, 안에 든 내용(Tabs의 TabsList처럼 폭이 정해지지
     * 않은 부모 안에서 overflow-x-auto가 무력해지는 inline-flex 등)이
     * 자기 min-content 폭만큼 칸을 벌린다 - Tabs 문서의 "tab-count-limit"
     * DON'T 예시(폭 제한 없이 탭 8개)가 모바일 한 칸짜리 grid에서 이
     * div를 벌려 main 전체가 가로로 스크롤됐다(실제로 재현·확인함).
     * ExampleList.tsx·PropertyBlock.tsx가 같은 이유로 이미 쓰는 처방과
     * 같다.
     */
    <div className="flex h-full min-w-0 flex-col gap-4 rounded-lg border p-4 md:p-5">
      {/*
       * DO 글자는 success-on-tint를 쓴다 — 원래 success 색은 흰 바탕
       * 위에서도 3.67:1로 4.5:1에 못 미친다. destructive는 4.76:1로
       * 이미 넘어 그대로 둔다.
       */}
      <p
        className={cn(
          'flex items-center gap-1.5 text-12 font-bold tracking-widest',
          kind === 'do' ? 'text-success-on-tint' : 'text-destructive',
        )}
      >
        {kind === 'do' ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
        {kind === 'do' ? 'DO' : "DON'T"}
      </p>

      {example && <ExampleFrame>{example}</ExampleFrame>}

      {rules.length > 0 && (
        <ul className="flex flex-col gap-3">
          {rules.map((line) => (
            <li key={line} className="text-16">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function GuidelineBlock({
  guideline,
  renderExample,
}: {
  guideline: Guideline
  renderExample?: (guidelineId: string, kind: 'do' | 'dont') => ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 md:gap-5">
      <div>
        <div className="group flex items-center">
          <h3 className="text-18 font-semibold">{guideline.title}</h3>
          <HeadingAnchor />
        </div>
        <p className={cn('text-muted-foreground mt-2 text-16', docProse)}>{guideline.body}</p>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-2 md:gap-4">
        <Side
          kind="do"
          example={renderExample?.(guideline.id, 'do')}
          rules={guideline.do ?? []}
        />
        <Side
          kind="dont"
          example={renderExample?.(guideline.id, 'dont')}
          rules={guideline.dont ?? []}
        />
      </div>
    </section>
  )
}
