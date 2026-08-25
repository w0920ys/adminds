import type { ReactNode } from 'react'
import type { ComponentMeta } from '@/data/registry'
import { cn } from '@/lib/utils'

/**
 * hover와 focus는 실제 입력 없이는 나타나지 않는다.
 * tokens.css에서 hover / focus-visible 변형을 .state-hover / .state-focus
 * 컨테이너 안에서도 적용되도록 확장했으므로, 여기서 그 클래스를 씌워
 * 정적으로 전시한다.
 */
const FORCE_CLASS: Record<string, string> = {
  hover: 'state-hover',
  focus: 'state-focus',
}

export function StateGrid({
  meta,
  render,
}: {
  meta: ComponentMeta
  render: (option: { state: string }) => ReactNode
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {meta.states.map((state) => (
        <div key={state} className="rounded-lg border p-4">
          <p className="text-muted-foreground mb-3 text-2xs font-bold tracking-widest">
            {state.toUpperCase()}
          </p>
          <div className={cn('flex min-h-10 items-center', FORCE_CLASS[state])}>
            {render({ state })}
          </div>
        </div>
      ))}
    </div>
  )
}
