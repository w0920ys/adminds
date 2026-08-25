import type * as React from 'react'
import { Loader2, Plus } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Button } from '@/components/ui/button'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type ButtonSize = React.ComponentProps<typeof Button>['size']

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      preview={
        <Button>
          <Plus /> 새 사용자
        </Button>
      }
      renderVariant={({ variant, size }) => (
        <Button
          variant={variant as ButtonVariant}
          size={size as ButtonSize}
          aria-label={size === 'icon' ? `${variant} icon 버튼` : undefined}
        >
          {size === 'icon' ? <Plus /> : '버튼'}
        </Button>
      )}
      renderState={({ state }) => {
        if (state === 'disabled') return <Button disabled>버튼</Button>
        if (state === 'loading') {
          return (
            <Button disabled>
              <Loader2 className="animate-spin" /> 저장 중
            </Button>
          )
        }
        return <Button>버튼</Button>
      }}
    />
  )
}
