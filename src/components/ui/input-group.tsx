import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * Input의 테두리 있는 껍데기(controlShellVariants)를 그대로 재사용하지
 * 않는다 — 그 껍데기는 :focus-visible로 테두리·고리를 켜는데, InputGroup은
 * 스스로 포커스를 받지 않고 안의 <input>이 받는다. 그래서 같은 시각
 * 언어(테두리·배경·그림자·hover)를 여기 다시 적되, 상태만 focus-within으로
 * 바꾼다. 안쪽 여백(px-3)과 항목 사이 간격(gap-2)을 컨테이너가 갖고
 * InputGroupInput·InputGroupAddon은 자기 몫의 여백을 두지 않는다 —
 * inline-start·inline-end 배치만 지원하는 만큼(block 배치·Textarea는
 * 다루지 않는다) 이 편이 훨씬 단순하다.
 */
const inputGroupVariants = cva(
  'group/input-group flex w-full min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs transition outline-none hover:border-ring/60 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2 has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 dark:has-[[aria-invalid=true]]:ring-destructive/40 dark:bg-input/30',
  {
    variants: {
      size: {
        sm: 'h-control-sm',
        default: 'h-control',
        lg: 'h-control-lg',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

type InputGroupProps = React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>

function InputGroup({ className, size, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(inputGroupVariants({ size, className }))}
      {...props}
    />
  )
}

/*
 * data-slot="input-group-control"이 InputGroup의 has-[]select터가 찾는
 * 표식이다 — disabled·aria-invalid를 컨테이너 테두리·고리에 반영하는
 * 유일한 연결 고리다.
 */
function InputGroupInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'size'>) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-w-0 flex-1 border-0 bg-transparent p-0 text-16 shadow-none outline-none',
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex shrink-0 items-center gap-1.5 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first',
        'inline-end': 'order-last',
      },
    },
    defaultVariants: { align: 'inline-start' },
  },
)

function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(inputGroupAddonVariants({ align, className }))}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="input-group-text" className={cn('text-muted-foreground text-14', className)} {...props} />
}

/*
 * Button의 크기 축(control-sm·control·control-lg)보다 한 단계 작다 —
 * InputGroupButton은 자기 자신의 높이가 아니라 InputGroup 안에 끼어드는
 * 부속물이라, InputGroup의 가장 작은 높이(control-sm=32px)보다도 작아야
 * 안과 위아래 여백이 남는다.
 */
const inputGroupButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm text-14 font-medium whitespace-nowrap outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 focus-visible:ring-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        xs: 'h-6 gap-1 px-2 has-[>svg]:px-1.5',
        'icon-xs': 'size-6',
        sm: 'h-7 gap-1.5 px-2.5 has-[>svg]:px-2',
        'icon-sm': 'size-7',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'xs' },
  },
)

type InputGroupButtonProps = React.ComponentProps<'button'> & VariantProps<typeof inputGroupButtonVariants>

function InputGroupButton({ className, variant, size, type = 'button', ...props }: InputGroupButtonProps) {
  return (
    <button
      type={type}
      data-slot="input-group-button"
      className={cn(inputGroupButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
  inputGroupVariants,
  inputGroupButtonVariants,
}
