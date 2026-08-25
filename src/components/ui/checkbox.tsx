import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-sm border border-input shadow-xs outline-none transition-shadow',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
        /*
         * hover는 배경을 한 단계 옮겨 Input · Select 트리거와 같은 생각을 쓴다.
         * checked·indeterminate는 이미 bg-primary를 쓰므로 unchecked에서만 건다 —
         * 그렇지 않으면 켜진 상자 위에서 색이 뒤섞인다.
         */
        'data-[state=unchecked]:hover:bg-accent',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    >
      {/*
        표시자는 Radix가 내부적으로 관리하는 상태(data-state)로 고른다.
        비제어로 쓰일 때는 props.checked가 undefined라 값만으로는 중간 상태를
        가려낼 수 없다 — Check와 Minus를 함께 두고 data-state로 전환한다.
      */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group grid place-items-center text-current"
      >
        <Check className="size-3 group-data-[state=indeterminate]:hidden" />
        <Minus className="hidden size-3 group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
