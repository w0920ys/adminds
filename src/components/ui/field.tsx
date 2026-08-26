import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

/*
 * Slot의 타입은 HTMLAttributes<HTMLElement>라 disabled를 모른다 —
 * disabled는 form 요소에만 있는 속성이라 범용 HTMLAttributes에는 없다.
 * FieldControl이 감싸는 자식은 항상 입력 계열(Input · SelectTrigger ·
 * Checkbox · Textarea 등)이므로 disabled를 더한 타입으로 넓혀 쓴다.
 */
const FieldControlSlot = Slot as React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLElement> & { disabled?: boolean } & React.RefAttributes<HTMLElement>
>

type FieldLayout = 'stacked' | 'horizontal'
type FieldState = 'default' | 'error' | 'disabled'

type FieldContextValue = {
  /** useId로 만든 뿌리 id. FieldLabel의 htmlFor와 FieldControl의 id가 이 값을 공유한다 */
  id: string
  layout: FieldLayout
  state: FieldState
  helpId: string
  errorId: string
  /** FieldHelp·FieldError가 실제로 마운트되어 있는지. FieldControl이 자식 개수를 세지 않고 이 값만 읽는다 */
  hasHelp: boolean
  hasError: boolean
  /** FieldHelp·FieldError가 마운트될 때 스스로 호출한다. 돌려주는 함수가 언마운트시 등록을 지운다 */
  registerHelp: () => () => void
  registerError: () => () => void
}

/*
 * id를 잇는 일이 이 컴포넌트의 존재 이유다. Field가 useId로 뿌리 id
 * 하나를 만들어 여기 담고, FieldLabel·FieldHelp·FieldError·FieldControl이
 * 각자 이 컨텍스트를 읽어 자기 몫의 id를 스스로 단다 — 손으로 htmlFor와
 * aria-describedby를 맞추는 일이 사라진다.
 *
 * hasHelp·hasError는 FieldControl이 도움말·오류의 존재를 직접 세지
 * 않도록 하는 장치다. FieldHelp·FieldError가 마운트될 때 스스로
 * registerHelp·registerError를 불러 등록하고, 언마운트되면 그 함수가
 * 돌려준 정리 함수로 스스로 등록을 지운다. Field는 그 결과값만 읽으므로
 * FieldControl의 자식이 무엇인지, 형제가 몇 개인지 몰라도 된다 — Steps가
 * 자식의 개수를 세지 않는 것과 같은 이유다.
 *
 * Provider 없이 쓰였을 때를 대비해 기본값을 둔다 — id가 비어 있으면
 * htmlFor·id가 그저 비게 되어 라벨과 컨트롤이 이어지지 않을 뿐, 예외를
 * 던지지 않는다. Steps·EmptyState·Card·DescriptionList·Table이 같은
 * 방식으로 기본 컨텍스트를 둔다.
 */
const FieldContext = React.createContext<FieldContextValue>({
  id: '',
  layout: 'stacked',
  state: 'default',
  helpId: '',
  errorId: '',
  hasHelp: false,
  hasError: false,
  registerHelp: () => () => {},
  registerError: () => () => {},
})

type FieldProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  layout?: FieldLayout
  state?: FieldState
  children: React.ReactNode
}

/*
 * horizontal은 grid grid-cols-[auto_1fr]로 바뀐다 — Steps의 vertical
 * orientation과 같은 얼개다. Field는 각 하위 컴포넌트의 타입이나 개수를
 * 들여다보지 않는다. FieldLabel은 col-start-1을, FieldHelp·FieldControl·
 * FieldError는 col-start-2만 스스로 표시한다 — 행은 지정하지 않는다.
 * 행이 없는 grid item은 CSS의 기본 auto-placement가 등장 순서대로
 * 다음 빈 칸에 채운다. 그래서 라벨 바로 다음에 오는 col-start-2 항목이
 * 라벨과 같은 첫 행에 나란히 서고 — 도움말이 없으면 그 자리가 바로
 * Control이라 라벨과 입력이 한 줄에 나란히 서는 가장 흔한 모양이 저절로
 * 나온다. 도움말이 있으면 그것이 첫 행에서 라벨과 나란히 서고 Control은
 * 다음 행으로, 그다음 Error가 그다음 행으로 내려간다. 어느 경우든 문서
 * 순서(라벨 → 도움말 → 입력 → 오류)와 화면에 보이는 순서가 어긋나지
 * 않는다 — 스크린 리더가 읽는 순서와 눈으로 보는 순서가 같다.
 */
function Field({ className, layout = 'stacked', state = 'default', children, ...props }: FieldProps) {
  const id = React.useId()
  const [hasHelp, setHasHelp] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const registerHelp = React.useCallback(() => {
    setHasHelp(true)
    return () => setHasHelp(false)
  }, [])
  const registerError = React.useCallback(() => {
    setHasError(true)
    return () => setHasError(false)
  }, [])

  const value = React.useMemo<FieldContextValue>(
    () => ({
      id,
      layout,
      state,
      helpId: `${id}-help`,
      errorId: `${id}-error`,
      hasHelp,
      hasError,
      registerHelp,
      registerError,
    }),
    [id, layout, state, hasHelp, hasError, registerHelp, registerError],
  )

  return (
    <FieldContext.Provider value={value}>
      <div
        data-slot="field"
        data-state={state}
        className={cn(
          layout === 'horizontal'
            ? 'grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1.5'
            : 'flex flex-col gap-1.5',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const { id, layout, state } = React.useContext(FieldContext)
  return (
    <label
      data-slot="field-label"
      htmlFor={id}
      className={cn(
        'text-sm font-medium',
        state === 'disabled' && 'text-muted-foreground',
        layout === 'horizontal' && 'col-start-1',
        className,
      )}
      {...props}
    />
  )
}

type FieldControlProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  /** id·aria-describedby·aria-invalid를 내려받을 자식 하나. Button의 asChild와 같은 얼개다 */
  children: React.ReactElement
}

/*
 * 자식의 존재를 세지 않는다 — hasHelp·hasError는 FieldHelp·FieldError가
 * 스스로 등록한 값을 읽을 뿐이다. 둘 다 있으면 공백으로 이어 붙이고,
 * 하나도 없으면 aria-describedby 자체를 내려주지 않는다 — 스크린
 * 리더가 가리킬 곳 없는 죽은 id를 읽지 않도록 한다.
 */
function FieldControl({ className, ...props }: FieldControlProps) {
  const { id, layout, state, helpId, errorId, hasHelp, hasError } = React.useContext(FieldContext)
  const describedBy = [hasHelp && helpId, hasError && errorId].filter(Boolean).join(' ')

  return (
    <FieldControlSlot
      data-slot="field-control"
      id={id}
      aria-invalid={state === 'error' || undefined}
      aria-describedby={describedBy || undefined}
      disabled={state === 'disabled' || undefined}
      className={cn(layout === 'horizontal' && 'col-start-2', className)}
      {...props}
    />
  )
}

function FieldHelp({ className, ...props }: React.ComponentProps<'p'>) {
  const { layout, helpId, registerHelp } = React.useContext(FieldContext)
  React.useLayoutEffect(() => registerHelp(), [registerHelp])

  return (
    <p
      id={helpId}
      data-slot="field-help"
      className={cn('text-muted-foreground text-xs', layout === 'horizontal' && 'col-start-2', className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: React.ComponentProps<'p'>) {
  const { layout, errorId, registerError } = React.useContext(FieldContext)
  React.useLayoutEffect(() => registerError(), [registerError])

  return (
    <p
      id={errorId}
      data-slot="field-error"
      className={cn('text-destructive text-xs', layout === 'horizontal' && 'col-start-2', className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldControl, FieldHelp, FieldError }
export type { FieldLayout, FieldState }
