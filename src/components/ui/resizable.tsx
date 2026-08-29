import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

/*
 * react-resizable-panels 4.x는 방향을 가리키는 data 속성을 DOM에 스스로
 * 심어 주지 않는다(Group의 orientation prop으로만 있다). Handle의 CSS가
 * 방향에 따라 갈리므로(가로 분할=세로선, 세로 분할=가로선), Group이 받은
 * orientation을 Context로 내려 Handle이 다시 읽는다 — 호출부가 Group과
 * Handle 양쪽에 orientation을 따로 넘기다 값이 어긋나는 실수를 막는다.
 */
const OrientationContext = React.createContext<'horizontal' | 'vertical'>('horizontal')

function ResizablePanelGroup({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <OrientationContext.Provider value={orientation}>
      <Group
        data-slot="resizable-panel-group"
        orientation={orientation}
        className={cn('flex h-full w-full', orientation === 'vertical' && 'flex-col', className)}
        {...props}
      />
    </OrientationContext.Provider>
  )
}

const ResizablePanel = Panel

/*
 * withHandle이 켜지면 가운데 그립(점 여섯 개 아이콘)이 뜬다 — 드래그할
 * 수 있다는 것을 시각적으로 알려준다. orientation은 부모 Group이
 * Context로 내린 값을 읽는다(prop으로 따로 안 받는다).
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  const orientation = React.useContext(OrientationContext)
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        'bg-border relative flex items-center justify-center',
        orientation === 'vertical' ? 'h-px w-full' : 'w-px',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        orientation === 'vertical' &&
          'after:inset-x-0 after:left-0 after:h-1 after:w-full after:translate-x-0 after:-translate-y-1/2',
        'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
          <GripVertical className="size-2.5" />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
