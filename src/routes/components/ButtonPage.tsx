import { ChevronRight, Loader2, Plus } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type ButtonSize = React.ComponentProps<typeof Button>['size']

const LABEL = '버튼'

function renderButton(options: RenderOptions) {
  const { variant, size, layout, width, state } = options
  const isIconOnly = layout === 'icon-only' || size === 'icon'
  const isLoading = state === 'loading'
  const isDisabled = state === 'disabled' || isLoading

  return (
    <Button
      variant={variant as ButtonVariant}
      size={(isIconOnly ? 'icon' : size) as ButtonSize}
      disabled={isDisabled}
      aria-label={isIconOnly ? `${variant} ${LABEL}` : undefined}
      className={cn(width === 'fill' && !isIconOnly && 'w-full')}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && (layout === 'icon-leading' || isIconOnly) && <Plus />}
      {!isIconOnly && (isLoading ? '저장 중' : LABEL)}
      {!isLoading && !isIconOnly && layout === 'icon-trailing' && <ChevronRight />}
    </Button>
  )
}

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderButton}
      preview={
        <Button data-anatomy="container">
          <Plus data-anatomy="prefix-icon" />
          <span data-anatomy="label">새 사용자</span>
          <ChevronRight data-anatomy="suffix-icon" />
        </Button>
      }
    />
  )
}
