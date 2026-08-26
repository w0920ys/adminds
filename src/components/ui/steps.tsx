import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type StepsOrientation = 'horizontal' | 'vertical'
type StepState = 'pending' | 'current' | 'complete' | 'error'

/*
 * orientation은 Steps가 정하고 Step·StepIndicator가 Context로 읽는다 —
 * EmptyState의 variant·size가 EmptyStateIcon으로 내려가는 것과 같은 구조다.
 *
 * state는 Step 하나의 상태라서 Steps가 계산하지 않는다 — 현재 단계
 * 번호로 자식들의 상태를 계산하면 error를 표현할 자리가 없어진다. 각
 * Step이 자기 state를 직접 받고, 그 값만 StepIndicator에게 Context로
 * 내려준다.
 */
const StepsOrientationContext = React.createContext<StepsOrientation>('horizontal')
const StepStateContext = React.createContext<StepState>('pending')

const stepsVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

type StepsProps = React.ComponentProps<'ol'> & {
  orientation?: StepsOrientation
}

function Steps({ className, orientation = 'horizontal', ...props }: StepsProps) {
  return (
    <StepsOrientationContext.Provider value={orientation}>
      <ol
        data-slot="steps"
        className={cn(stepsVariants({ orientation, className }))}
        {...props}
      />
    </StepsOrientationContext.Provider>
  )
}

/*
 * 네 상태 모두 배경을 불투명하게 채운다 — pending도 bg-background를
 * 깔아 둔다. 그래야 Connector가 원 뒤로 지나가도 원이 선을 가린다.
 */
const stepIndicatorVariants = cva(
  'bg-background relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
  {
    variants: {
      state: {
        pending: 'border text-muted-foreground',
        current: 'bg-primary text-primary-foreground border-transparent',
        complete: 'bg-primary text-primary-foreground border-transparent',
        error: 'bg-destructive text-destructive-foreground border-transparent',
      },
    },
    defaultVariants: { state: 'pending' },
  },
)

/*
 * 숫자는 호출하는 쪽이 children으로 넣는다. complete·error는 그
 * children을 각각 Check·X 아이콘으로 대신한다 — 상태가 바뀌면 숫자
 * 대신 아이콘이 나타난다.
 */
function StepIndicator({ className, children, ...props }: React.ComponentProps<'span'>) {
  const state = React.useContext(StepStateContext)
  return (
    <span
      data-slot="step-indicator"
      className={cn(stepIndicatorVariants({ state }), className)}
      {...props}
    >
      {state === 'complete' && <Check className="size-4" aria-hidden />}
      {state === 'error' && <X className="size-4" aria-hidden />}
      {state !== 'complete' && state !== 'error' && children}
    </span>
  )
}

function StepLabel({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="step-label" className={cn('text-sm font-medium', className)} {...props} />
}

function StepDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="step-description"
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  )
}

type StepProps = React.ComponentProps<'li'> & {
  state?: StepState
  /*
   * Connector(span)는 Step 안에 있어 소비자가 직접 닿을 수 없다. 임의의
   * 속성을 그대로 전달하는 통로만 열어 둔다 — TabsTrigger의
   * indicatorProps와 같은 자리다.
   */
  connectorProps?: React.ComponentProps<'span'> & { [dataAttr: `data-${string}`]: string }
}

/*
 * 마지막 단계 뒤에는 선이 없다. Steps가 자식 수를 세어 마지막을 판단하지
 * 않는다 — Step 자신이 :last-child일 때만 커넥터를 감추는 CSS(last:)만으로
 * 처리한다. 그래서 Step 하나는 자기가 몇 번째인지, 전체가 몇 개인지 몰라도
 * 된다.
 *
 * Indicator는 Label·Description과 다른 자리(원 하나만, 커넥터의 기준점)를
 * 차지하므로 children 중 StepIndicator만 앞세워 둔다 — TabsTrigger가
 * variant로 자기 안의 밑줄 자리를 정하는 것과 같은 종류의 결정이다.
 */
function Step({ className, state = 'pending', children, connectorProps, ...props }: StepProps) {
  const orientation = React.useContext(StepsOrientationContext)
  const items = React.Children.toArray(children)
  const indicator = items.find(
    (child) => React.isValidElement(child) && child.type === StepIndicator,
  )
  const rest = items.filter((child) => child !== indicator)

  return (
    <StepStateContext.Provider value={state}>
      <li
        data-slot="step"
        data-state={state}
        aria-current={state === 'current' ? 'step' : undefined}
        className={cn(
          'group/step relative flex',
          orientation === 'horizontal'
            ? 'flex-1 flex-col items-center gap-2 text-center'
            : 'flex-row items-start gap-3 pb-8 last:pb-0',
          className,
        )}
        {...props}
      >
        {indicator}
        <div
          className={cn(
            'flex min-w-0 flex-col gap-0.5',
            orientation === 'horizontal' ? 'items-center' : 'pt-1',
          )}
        >
          {rest}
        </div>
        <span
          data-slot="steps-connector"
          aria-hidden
          {...connectorProps}
          className={cn(
            'bg-border absolute -z-10 group-last/step:hidden',
            orientation === 'horizontal' ? 'top-4 left-1/2 h-px w-full' : 'top-8 bottom-0 left-4 w-px',
            connectorProps?.className,
          )}
        />
      </li>
    </StepStateContext.Provider>
  )
}

export { Steps, Step, StepIndicator, StepLabel, StepDescription }
export type { StepsOrientation, StepState }
