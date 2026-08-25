import type { ComponentProps, ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Input } from '@/components/ui/input'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type InputSize = ComponentProps<typeof Input>['size']

function renderInput(options: RenderOptions) {
  const { size, state, width } = options
  return (
    <Input
      size={size as InputSize}
      defaultValue={state === 'readonly' ? '읽기 전용 값' : undefined}
      placeholder="이름을 입력하세요"
      disabled={state === 'disabled'}
      readOnly={state === 'readonly'}
      aria-invalid={state === 'invalid' || undefined}
      className={cn(width === 'hug' && 'w-48')}
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Input과 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

/** 예시 안에서 공간의 경계를 보여줄 때 쓰는 점선 상자 */
function Bounds({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md border border-dashed p-2', className)}>{children}</div>
}

/** 라벨 + 입력 한 줄. 여러 예시가 이 조합을 공유한다 */
function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'placeholder-as-label':
      return kind === 'do' ? (
        <Field label="이름" htmlFor="pg-placeholder-do">
          <Input id="pg-placeholder-do" placeholder="홍길동" className="w-48" />
        </Field>
      ) : (
        <Input placeholder="이름을 입력하세요" className="w-48" />
      )

    case 'error-indication':
      return kind === 'do' ? (
        <div className="flex flex-col gap-1.5">
          <Input aria-invalid defaultValue="not-an-email" className="w-48" />
          <p className="text-destructive text-xs">올바른 이메일 형식이 아닙니다</p>
        </div>
      ) : (
        <Input aria-invalid defaultValue="not-an-email" className="w-48" />
      )

    case 'width':
      return kind === 'do' ? (
        <div className="flex flex-col gap-3">
          <Field label="우편번호" htmlFor="pg-width-do-zip">
            <Input id="pg-width-do-zip" placeholder="12345" className="w-24" />
          </Field>
          <Field label="이름" htmlFor="pg-width-do-name">
            <Input id="pg-width-do-name" placeholder="홍길동" className="w-48" />
          </Field>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Field label="우편번호" htmlFor="pg-width-dont-zip">
            <Input id="pg-width-dont-zip" placeholder="12345" className="w-48" />
          </Field>
          <Field label="이름" htmlFor="pg-width-dont-name">
            <Input id="pg-width-dont-name" placeholder="홍길동" className="w-48" />
          </Field>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'search-box':
      return (
        <div className="relative w-64">
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input aria-label="사용자 검색" placeholder="사용자 검색" className="pl-9" />
        </div>
      )

    case 'form-row':
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ex-email" className="text-sm font-medium">
            이메일
          </label>
          <Input id="ex-email" placeholder="name@company.com" className="w-64" />
          <p className="text-muted-foreground text-xs">초대 메일을 받을 주소</p>
        </div>
      )

    case 'table-filter':
      return (
        <div className="bg-surface flex items-center gap-2 rounded-md border p-2">
          <Search aria-hidden className="text-muted-foreground size-4" />
          <Input
            size="sm"
            aria-label="이름으로 필터"
            placeholder="이름으로 필터"
            className="w-40"
          />
        </div>
      )

    case 'amount-input':
      return (
        <div className="relative w-40">
          <Input defaultValue="50000" className="pr-9" />
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
            원
          </span>
        </div>
      )

    case 'overflow-value':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-40">
            <Input defaultValue="어드민-디자인시스템-워크스페이스-24" />
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 컨테이너 폭입니다. 줄바꿈하지 않고 칸 안에서 스크롤됩니다.
          </p>
        </div>
      )

    case 'readonly':
      return (
        <Field label="워크스페이스 ID" htmlFor="ex-readonly">
          <Input id="ex-readonly" readOnly defaultValue="ws_8f2c1a" className="w-48" />
        </Field>
      )

    case 'error-with-help':
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ex-phone" className="text-sm font-medium">
            전화번호
          </label>
          <Input id="ex-phone" aria-invalid defaultValue="010-12-34" className="w-48" />
          <p className="text-destructive text-xs">010-0000-0000 형식으로 입력하세요</p>
        </div>
      )

    case 'password':
      return <Input type="password" defaultValue="password123" className="w-48" />

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <Input placeholder="이름을 입력하세요" />
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 컨테이너 폭입니다. 너비를 지정하지 않으면 부모를 채웁니다.
          </p>
        </div>
      )

    default:
      return null
  }
}

export function InputPage() {
  const meta = getComponent('input')
  if (!meta) return <Placeholder title="Input 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderInput}
      preview={
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="relative" data-anatomy="container">
            <Search
              data-anatomy="prefix-icon"
              aria-hidden
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <X
              data-anatomy="suffix"
              aria-hidden
              className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
            />
            <Input data-anatomy="value" defaultValue="김민준" className="w-48 pr-9 pl-9" />
          </div>
          <Input data-anatomy="placeholder" placeholder="이름을 입력하세요" className="w-48" />
        </div>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
