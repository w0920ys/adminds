import type { ComponentProps, ReactNode } from 'react'
import { Copy, Filter, Search } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type GroupSize = ComponentProps<typeof InputGroup>['size']

function renderInputGroup(options: RenderOptions) {
  const size = (options.size ?? 'default') as GroupSize

  return (
    <InputGroup size={size} className="w-64">
      <InputGroupInput placeholder="검색" />
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
    </InputGroup>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 InputGroup으로
 * 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'addon-after-input-in-dom':
      return kind === 'do' ? (
        <div className="flex flex-col gap-2">
          <InputGroup className="w-56">
            <InputGroupInput placeholder="검색" />
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
          </InputGroup>
          <p className="text-muted-foreground text-12">JSX에서도 Input을 먼저 적는다 — Tab이 입력 → addon 순서로 간다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <InputGroup className="w-56">
            <InputGroupInput placeholder="검색" />
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
          </InputGroup>
          <p className="text-muted-foreground text-12">겉모습은 같지만 addon을 Input보다 앞서 적으면 Tab 순서가 뒤집힌다</p>
        </div>
      )

    case 'one-action-per-addon':
      return kind === 'do' ? (
        <InputGroup className="w-56">
          <InputGroupInput placeholder="검색" />
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <InputGroup className="w-56">
          <InputGroupInput placeholder="검색" />
          <InputGroupAddon>
            <Search aria-hidden />
            <Filter aria-hidden />
          </InputGroupAddon>
        </InputGroup>
      )

    case 'icon-only-addon-needs-label':
      return kind === 'do' ? (
        <InputGroup className="w-56">
          <InputGroupInput readOnly value="https://adminds.vercel.app" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="복사">
              <Copy aria-hidden />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <InputGroup className="w-56">
          <InputGroupInput readOnly value="https://adminds.vercel.app" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs">
              <Copy aria-hidden />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'search-input':
      return (
        <InputGroup className="w-64">
          <InputGroupInput placeholder="사용자 검색" />
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
        </InputGroup>
      )

    case 'amount-input':
      return (
        <InputGroup className="w-40">
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="0.00" defaultValue="120" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )

    case 'copyable-value':
      return (
        <InputGroup className="w-64">
          <InputGroupInput readOnly value="sk_live_51H8f2sK...adminds" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="복사">
              <Copy aria-hidden />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )

    case 'domain-input':
      return (
        <InputGroup className="w-64">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="adminds" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )

    case 'both-ends':
      return (
        <InputGroup className="w-64">
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
          <InputGroupInput placeholder="검색" />
          <InputGroupAddon align="inline-end">
            <InputGroupText className="bg-muted rounded px-1.5 py-0.5">⌘K</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )

    case 'disabled':
      return (
        <InputGroup className="w-56">
          <InputGroupInput placeholder="검색" disabled />
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
        </InputGroup>
      )

    case 'invalid':
      return (
        <InputGroup className="w-56">
          <InputGroupInput defaultValue="not-an-email" aria-invalid />
          <InputGroupAddon align="inline-end">
            <InputGroupText className="text-destructive">형식 오류</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <InputGroup>
            <InputGroupInput placeholder="검색" />
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
          </InputGroup>
        </Bounds>
      )

    default:
      return null
  }
}

/** Container·Input·Addon 셋 다 무대 안에 그대로 있다 — data-anatomy를
 * 직접 얹어 지시선이 실제 DOM 경계를 가리키게 한다. */
function AnatomyPreview() {
  return (
    <InputGroup className="w-64" data-anatomy="container">
      <InputGroupInput placeholder="검색" data-anatomy="input" />
      <InputGroupAddon data-anatomy="addon">
        <Search aria-hidden />
      </InputGroupAddon>
    </InputGroup>
  )
}

export function InputGroupPage() {
  const meta = getComponent('input-group')
  if (!meta) return <Placeholder title="Input Group 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderInputGroup}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
