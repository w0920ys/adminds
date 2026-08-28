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
  /** FieldLabel 자신이 달 id. FieldControl의 aria-labelledby가 이 값을 가리킨다 */
  labelId: string
  helpId: string
  errorId: string
  /** FieldLabel·FieldHelp·FieldError가 실제로 마운트되어 있는지. FieldControl이 자식 개수를 세지 않고 이 값만 읽는다 */
  hasLabel: boolean
  hasHelp: boolean
  hasError: boolean
  /** FieldLabel·FieldHelp·FieldError가 마운트될 때 스스로 호출한다. 돌려주는 함수가 언마운트시 등록을 지운다 */
  registerLabel: () => () => void
  registerHelp: () => () => void
  registerError: () => () => void
}

/*
 * id를 잇는 일이 이 컴포넌트의 존재 이유다. Field가 useId로 뿌리 id
 * 하나를 만들어 여기 담고, FieldLabel·FieldHelp·FieldError·FieldControl이
 * 각자 이 컨텍스트를 읽어 자기 몫의 id를 스스로 단다 — 손으로 htmlFor와
 * aria-describedby를 맞추는 일이 사라진다.
 *
 * htmlFor 하나로는 부족하다. <label for>는 labelable 요소(button·input·
 * select·textarea·output·meter·progress 등)에만 걸린다 — Combobox·DatePicker의
 * 트리거는 role="button"을 단 div고 Slider의 Root는 역할 없는 span이라
 * 라벨과 이어지지 않는다. 그래서 FieldLabel은 자기 id(labelId)도 달고
 * FieldControl은 그 id를 aria-labelledby로 내려준다 — labelable이든
 * 아니든 같은 방식으로 이름이 붙는다. Field는 자식이 어떤 컴포넌트인지
 * 여전히 모른다.
 *
 * hasLabel·hasHelp·hasError는 FieldControl이 라벨·도움말·오류의 존재를
 * 직접 세지 않도록 하는 장치다. FieldLabel·FieldHelp·FieldError가
 * 마운트될 때 스스로 registerLabel·registerHelp·registerError를 불러
 * 등록하고, 언마운트되면 그 함수가
 * 돌려준 정리 함수로 스스로 등록을 지운다. Field는 그 결과값만 읽으므로
 * FieldControl의 자식이 무엇인지, 형제가 몇 개인지 몰라도 된다 — Steps가
 * 자식의 개수를 세지 않는 것과 같은 이유다. 라벨이 없는 Field(스스로
 * aria-label을 단 컨트롤을 감싼 경우)에서 aria-labelledby를 내려주지
 * 않는 것도 이 값 덕분이다 — 가리킬 곳 없는 죽은 id가 컨트롤의 제
 * 이름을 덮지 않는다.
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
  labelId: '',
  helpId: '',
  errorId: '',
  hasLabel: false,
  hasHelp: false,
  hasError: false,
  registerLabel: () => () => {},
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
 * 들여다보지 않는다 — 각자 컨텍스트의 layout만 읽어 자기 grid-column·
 * grid-row를 스스로 표시한다.
 *
 * 열만 지정하고 행은 auto-placement에 맡기는 첫 시도는 도움말이 있을
 * 때 라벨이 도움말과 한 행에 붙고 Control이 짝 없이 다음 행으로
 * 밀려나는 결함이 있었다 — horizontal이 존재하는 이유(짧은 라벨이
 * Control과 나란히 서는 것) 자체가 깨졌다. 그래서 행도 부위별로
 * 고정한다: Label과 Control은 항상 1행에 나란히 선다(도움말이 있든
 * 없든 이 짝은 흔들리지 않는다). Help는 항상 2행이다. Error는 Help가
 * 있으면 3행, 없으면 2행이다 — Help가 없는데도 Error를 3행에 고정하면
 * 비어 있는 2행의 gap이 위아래로 두 번 잡혀 간격이 두 배(6px 대신
 * 12px)로 벌어진다. FieldError가 hasHelp를 읽어 자기 행을 스스로
 * 고르는 이유다.
 *
 * 이 배치는 화면에 보이는 순서(Label+Control → Help → Error)를
 * DOM 순서보다 우선한다 — DOM에 Help가 Control보다 앞서 있어도 grid가
 * 명시적으로 자리를 정하므로 시각 순서와 DOM 순서가 갈라진다. 그래도
 * 문제가 되지 않는 것은 Help·Error가 FieldControl의 aria-describedby로
 * 이어지기 때문이다 — 스크린 리더는 Control에 포커스가 갈 때 그 값을
 * DOM 위치와 무관하게 읽어 주므로, 폼을 채우는 상호작용에서는 시각
 * 순서가 곧 실제로 전달되는 순서다.
 */
function Field({ className, layout = 'stacked', state = 'default', children, ...props }: FieldProps) {
  const id = React.useId()
  const [hasLabel, setHasLabel] = React.useState(false)
  const [hasHelp, setHasHelp] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const registerLabel = React.useCallback(() => {
    setHasLabel(true)
    return () => setHasLabel(false)
  }, [])
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
      labelId: `${id}-label`,
      helpId: `${id}-help`,
      errorId: `${id}-error`,
      hasLabel,
      hasHelp,
      hasError,
      registerLabel,
      registerHelp,
      registerError,
    }),
    [id, layout, state, hasLabel, hasHelp, hasError, registerLabel, registerHelp, registerError],
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

/*
 * htmlFor는 그대로 둔다 — labelable 컨트롤(Input·Textarea·Select 트리거·
 * Checkbox·Switch·File Upload 버튼)에서는 브라우저가 이 속성으로 라벨과
 * 컨트롤을 스스로 이어(label.control이 그 컨트롤을 가리킨다) 라벨 클릭도
 * 브라우저 몫으로 남는다. labelable이 아닌 컨트롤에서는 그 잇기 자체가
 * 일어나지 않아(label.control이 null이다) 라벨을 눌러도 포커스가 옮겨
 * 가지 않는다 — 그래서 onClick에서 직접 옮긴다. 어떤 컴포넌트인지
 * 이름으로 가르지 않고 label.control이 비었는지만 본다.
 *
 * id가 가리키는 요소가 늘 포커스를 받는 것은 아니다. Slider는 그 자리가
 * 역할 없는 Radix Root span이고 포커스를 받는 것은 그 안의 손잡이다.
 * 그래서 먼저 그 요소를 시도하고, 받지 못하면 안쪽의 포커스 가능한
 * 첫 요소로 넘긴다. 이것도 이름이 아니라 요소의 성질만 본다.
 */
/**
 * 라벨이 가리키는 요소로 포커스를 옮긴다. 그 요소가 포커스를 받지 못하면
 * 안쪽의 포커스 가능한 첫 요소로 넘긴다.
 */
function focusControl(target: HTMLElement | null): void {
  if (!target) return
  target.focus()
  if (document.activeElement === target) return
  target.querySelector<HTMLElement>('[tabindex]:not([tabindex="-1"]), button, input, select, textarea, a[href]')?.focus()
}

function FieldLabel({ className, onClick, ...props }: React.ComponentProps<'label'>) {
  const { id, layout, state, labelId, registerLabel } = React.useContext(FieldContext)
  React.useLayoutEffect(() => registerLabel(), [registerLabel])

  return (
    <label
      data-slot="field-label"
      id={labelId}
      htmlFor={id}
      onClick={(event) => {
        onClick?.(event)
        if (event.currentTarget.control) return
        focusControl(document.getElementById(id))
      }}
      className={cn(
        'text-16 font-medium',
        state === 'disabled' && 'text-muted-foreground',
        layout === 'horizontal' && 'col-start-1 row-start-1',
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
 * 자식의 존재를 세지 않는다 — hasLabel·hasHelp·hasError는 FieldLabel·
 * FieldHelp·FieldError가 스스로 등록한 값을 읽을 뿐이다. 둘 다 있으면
 * 공백으로 이어 붙이고, 하나도 없으면 aria-describedby 자체를 내려주지
 * 않는다 — 스크린 리더가 가리킬 곳 없는 죽은 id를 읽지 않도록 한다.
 * aria-labelledby도 같은 규칙을 따른다.
 */
function FieldControl({ className, ...props }: FieldControlProps) {
  const { id, layout, state, labelId, helpId, errorId, hasLabel, hasHelp, hasError } =
    React.useContext(FieldContext)
  const describedBy = [hasHelp && helpId, hasError && errorId].filter(Boolean).join(' ')

  return (
    <FieldControlSlot
      id={id}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-invalid={state === 'error' || undefined}
      aria-describedby={describedBy || undefined}
      disabled={state === 'disabled' || undefined}
      className={cn(layout === 'horizontal' && 'col-start-2 row-start-1', className)}
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
      className={cn('text-muted-foreground text-12', layout === 'horizontal' && 'col-start-2 row-start-2', className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: React.ComponentProps<'p'>) {
  const { layout, errorId, hasHelp, registerError } = React.useContext(FieldContext)
  React.useLayoutEffect(() => registerError(), [registerError])

  return (
    <p
      id={errorId}
      data-slot="field-error"
      className={cn(
        'text-destructive text-12',
        layout === 'horizontal' && (hasHelp ? 'col-start-2 row-start-3' : 'col-start-2 row-start-2'),
        className,
      )}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldControl, FieldHelp, FieldError }
export type { FieldLayout, FieldState }
