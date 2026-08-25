import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type TextareaResize = ComponentProps<typeof Textarea>['resize']

function renderTextarea(options: RenderOptions) {
  const { state, resize } = options
  return (
    <Textarea
      resize={resize as TextareaResize}
      defaultValue={state === 'readonly' ? '읽기 전용 값입니다' : undefined}
      placeholder="메모를 입력하세요"
      disabled={state === 'disabled'}
      readOnly={state === 'readonly'}
      aria-invalid={state === 'invalid' || undefined}
      className="w-64"
    />
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Textarea와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

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
    case 'no-horizontal-resize':
      return (
        <div className="flex flex-col gap-3">
          <Field label="이름" htmlFor={`pg-resize-${kind}-name`}>
            <Input id={`pg-resize-${kind}-name`} defaultValue="홍길동" className="w-64" />
          </Field>
          <Field label="메모" htmlFor={`pg-resize-${kind}-memo`}>
            <Textarea
              id={`pg-resize-${kind}-memo`}
              resize="vertical"
              defaultValue="다음 주 화요일까지 승인 부탁드립니다"
              className={cn('w-64', kind === 'dont' && 'resize-x')}
            />
          </Field>
        </div>
      )

    case 'min-height':
      return (
        <Field label="공지 본문" htmlFor={`pg-minheight-${kind}`}>
          <Textarea
            id={`pg-minheight-${kind}`}
            placeholder="공지 내용을 입력하세요"
            className={cn('w-64', kind === 'do' && 'min-h-32')}
          />
        </Field>
      )

    case 'character-limit':
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <label htmlFor={`pg-charlimit-${kind}`} className="text-sm font-medium">
            소개
          </label>
          <Textarea id={`pg-charlimit-${kind}`} defaultValue="워크스페이스 관리자입니다" />
          {kind === 'do' && (
            <span className="text-muted-foreground self-end text-2xs">12/50</span>
          )}
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'memo':
      return (
        <Field label="메모" htmlFor="ex-memo">
          <Textarea id="ex-memo" placeholder="이 사용자에 대한 메모를 남기세요" className="w-64" />
        </Field>
      )

    case 'rejection-reason':
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <label htmlFor="ex-rejection" className="text-sm font-medium">
            반려 사유
          </label>
          <Textarea id="ex-rejection" placeholder="반려 사유를 구체적으로 적어주세요" />
          <p className="text-muted-foreground text-xs">신청자가 그대로 확인하는 문구입니다</p>
        </div>
      )

    case 'notice-body':
      return (
        <Field label="공지 본문" htmlFor="ex-notice">
          <Textarea
            id="ex-notice"
            placeholder="공지 내용을 입력하세요"
            className="min-h-32 w-64"
          />
        </Field>
      )

    case 'address-supplement':
      return (
        <Field label="상세 주소" htmlFor="ex-address">
          <Textarea
            id="ex-address"
            resize="none"
            placeholder="동, 호수 등 상세 주소"
            className="min-h-12 w-64"
          />
        </Field>
      )

    case 'very-long-text':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-64">
            <Textarea
              resize="none"
              defaultValue="1문단. 이 텍스트는 아주 깁니다. 2문단. 상자보다 내용이 많으면 가로가 아니라 세로로 스크롤됩니다. 3문단. 폭은 그대로 유지됩니다. 4문단. 옆 요소와의 정렬도 유지됩니다."
              className="h-24 min-h-0 w-full"
            />
          </Bounds>
          <p className="text-muted-foreground text-2xs">
            점선은 컨테이너 폭입니다. 내용이 상자보다 많으면 세로로 스크롤됩니다.
          </p>
        </div>
      )

    case 'over-limit':
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <label htmlFor="ex-overlimit" className="text-sm font-medium">
            소개
          </label>
          <Textarea id="ex-overlimit" aria-invalid defaultValue="아주 긴 자기소개 문구가 여기 들어갑니다" />
          <span className="text-destructive self-end text-2xs">-12/50</span>
        </div>
      )

    case 'readonly':
      return (
        <Field label="메모" htmlFor="ex-readonly">
          <Textarea id="ex-readonly" readOnly defaultValue="2026-08-01 가입" className="w-64" />
        </Field>
      )

    case 'narrow-screen':
      return (
        <div className="flex flex-col gap-2">
          <Bounds className="w-48">
            <Textarea placeholder="메모를 입력하세요" />
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

export function TextareaPage() {
  const meta = getComponent('textarea')
  if (!meta) return <Placeholder title="Textarea 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderTextarea}
      preview={
        <div className="flex w-64 flex-col gap-1" data-anatomy="container">
          <Textarea
            data-anatomy="value"
            defaultValue="다음 주 화요일까지 승인 부탁드립니다"
            resize="vertical"
          />
          <span data-anatomy="char-count" className="text-muted-foreground self-end text-2xs">
            24/200
          </span>
        </div>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
