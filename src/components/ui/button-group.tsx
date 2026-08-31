import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/*
 * 여기 담기는 Button들은 액션을 실행한다 — Toggle Group과 다른
 * 자리다(Toggle Group은 상태를 켜고 끈다). 직접 자식(Button·Input·
 * ButtonGroupText 무엇이든)의 테두리를 이어 붙여 한 덩어리로 보이게
 * 한다. variant는 강제하지 않는다 — outline 버튼끼리는 테두리가
 * 겹쳐 저절로 하나로 보이고, 다른 variant를 섞어 쓰는 것도 쓰는 쪽의
 * 선택이다.
 */
const buttonGroupVariants = cva('flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:relative', {
  variants: {
    orientation: {
      horizontal:
        'flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
      vertical:
        'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

type ButtonGroupProps = React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>

function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ orientation, className }))}
      {...props}
    />
  )
}

/*
 * outline 버튼끼리는 이미 테두리가 있어 굳이 필요 없다 — 배경만 있는
 * variant(default·secondary·ghost)를 섞어 쓸 때 경계를 보이려고 둔다.
 * orientation 기본값이 Separator와 반대다: 가로로 늘어선 묶음에는
 * 세로 선이 어울린다.
 */
function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      decorative
      className={cn('self-stretch', className)}
      {...props}
    />
  )
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        'bg-muted flex items-center gap-2 rounded-md border px-3 text-14 font-medium',
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
