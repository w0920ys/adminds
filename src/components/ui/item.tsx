import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/*
 * 표가 아니라 자유 형식 목록이 필요한 자리를 위한 상자다 — 알림
 * 목록·설정 행·검색 결과처럼 행마다 media·title·description·actions
 * 조합이 달라지는 곳. 표는 열이 고정된 데이터에, Item은 이런 자리에
 * 쓴다. hover는 TableRow와 같은 생각이다 — 항상 켜 두고, 눌러도 아무
 * 일도 없는 순수 표시 전용 행에서만 쓰는 쪽이 hover:bg-transparent로
 * 끈다.
 */
const itemVariants = cva(
  'group/item relative flex items-center rounded-md border border-transparent text-16 outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border bg-card shadow-xs',
        muted: 'bg-muted',
      },
      size: {
        default: 'gap-4 p-4',
        sm: 'gap-3 px-3 py-2.5',
        xs: 'gap-2 px-2 py-1.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ItemProps = React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & {
    /** a·button 등 다른 태그로 그릴 때 켠다 — Button의 asChild와 같은 자리다 */
    asChild?: boolean
  }

function Item({ className, variant, size, asChild = false, ...props }: ItemProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

/*
 * role="list"를 스스로 단다 — 안의 Item은 div라 role 없이는 목록으로
 * 읽히지 않는다. ItemSeparator가 목록 사이에 끼어도 role="none"이라
 * 목록 항목 수를 부풀리지 않는다(Separator의 decorative 기본값).
 */
function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-group" role="list" className={cn('flex flex-col', className)} {...props} />
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="item-separator" className={cn('my-0', className)} {...props} />
}

const itemMediaVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: 'text-muted-foreground [&_svg:not([class*="size-"])]:size-4',
      icon: "bg-muted text-muted-foreground size-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
      avatar: 'size-8 overflow-hidden rounded-full',
      image: 'size-10 overflow-hidden rounded-md [&_img]:size-full [&_img]:object-cover',
    },
  },
  defaultVariants: { variant: 'default' },
})

function ItemMedia({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="item-content" className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)} {...props} />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-title" className={cn('truncate font-medium', className)} {...props} />
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="item-description" className={cn('text-muted-foreground truncate text-14', className)} {...props} />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-actions" className={cn('flex shrink-0 items-center gap-2', className)} {...props} />
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
  itemVariants,
}
