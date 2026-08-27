import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

/*
 * 묶음이 정하고 항목이 따른다. 항목이 variant·size를 각자 받으면 한
 * 묶음 안에서 크기가 갈릴 수 있는데, 그것은 이 컴포넌트가 있는 이유와
 * 반대다. 항목이 직접 넘긴 값이 있으면 그것을 우선한다 — 예외를 아예
 * 막지는 않는다.
 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  variant: 'default',
  size: 'default',
})

/*
 * flex-wrap은 w-fit과 짝이다. w-fit(= fit-content)이라 넓은 자리에서는
 * 항목 전부가 한 줄에 그대로 서고, 부모가 좁으면 fit-content가 부모까지만
 * 줄어들면서 넘치는 항목이 다음 줄로 넘어간다. 표의 열 고르기·서식 도구는
 * 항목이 많은 게 정상인 자리라, 이것이 없으면 묶음이 부모를 넘쳐 흐른다.
 */
function ToggleGroup({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn('flex w-fit flex-wrap items-center gap-1', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: variant ?? context.variant, size: size ?? context.size }),
        className,
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
