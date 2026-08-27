import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn('fixed inset-0 z-overlay bg-black/50', className)}
      {...props}
    />
  )
}

/*
 * Dialog와 껍데기는 같고 나가는 길이 다르다. 닫기 X를 두지 않는다 —
 * X는 취소인지 그냥 닫기인지 말하지 않는다. 나가는 길은 Cancel 하나다.
 * 바깥 클릭이 막히는 것과 role이 alertdialog인 것은 Radix가 맡는다.
 * size 축도 두지 않는다. 경고는 짧아야 하고, 크기를 고를 수 있게 두면
 * 긴 본문을 담게 된다.
 */
function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay />
      <div className="fixed inset-0 z-overlay grid place-items-center p-4">
        <AlertDialogPrimitive.Content
          data-slot="alert-dialog-content"
          className={cn(
            'relative flex w-full max-w-md flex-col gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </div>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/*
 * 두 동작은 Button을 감싸지 않고 buttonVariants를 직접 쓴다. Radix가
 * Cancel과 Action에 닫는 동작을 붙여 주는데, 그 자리에 asChild로 Button을
 * 끼우면 버튼이 하나 더 겹쳐 보이거나 포커스가 두 겹이 된다.
 */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: 'default' | 'destructive'
}) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
}
