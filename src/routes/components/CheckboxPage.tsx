import type { ReactNode } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Checkbox } from '@/components/ui/checkbox'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

function renderCheckbox(options: RenderOptions) {
  const { state, layout } = options
  const checked: CheckedState = state === 'indeterminate' ? 'indeterminate' : state === 'checked'
  const disabled = state === 'disabled'

  const box = (
    <Checkbox
      checked={checked}
      disabled={disabled}
      aria-label={layout === 'standalone' ? '선택' : undefined}
    />
  )

  if (layout === 'with-description') {
    return (
      <label className="flex items-start gap-2">
        <span className="pt-0.5">{box}</span>
        <span className="flex flex-col">
          <span className="text-sm">자동 백업</span>
          <span className="text-muted-foreground text-xs">매일 오전 3시에 백업을 실행합니다</span>
        </span>
      </label>
    )
  }

  if (layout === 'with-label') {
    return (
      <label className="flex items-center gap-2 text-sm">
        {box}
        마케팅 이메일 수신 동의
      </label>
    )
  }

  return box
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Checkbox와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

/** 예시 안에서 공간의 경계를 보여줄 때 쓰는 점선 상자 */
function Bounds({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md border border-dashed p-2', className)}>{children}</div>
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'label-click-target':
      return kind === 'do' ? (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked />
          마케팅 이메일 수신 동의
        </label>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked />
          <span>마케팅 이메일 수신 동의</span>
        </div>
      )

    case 'indeterminate-meaning':
      return kind === 'do' ? (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked="indeterminate" />
            전체 선택
          </label>
          <p className="text-muted-foreground text-xs">5개 항목 중 2개 선택됨</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked="indeterminate" />
            국적 선택 안 함
          </label>
          <p className="text-muted-foreground text-xs">
            아무것도 고르지 않았을 뿐 일부가 선택된 것이 아니다
          </p>
        </div>
      )

    case 'checkbox-vs-radio':
      return kind === 'do' ? (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">관심 분야</legend>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            결제
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            정산
          </label>
        </fieldset>
      ) : (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium">결제 수단</legend>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            카드
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            계좌 이체
          </label>
        </fieldset>
      )

    default:
      return null
  }
}

/** row-select · nested-selection이 공유하는 들여쓰기 행 */
function IndentedRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 pl-6">{children}</div>
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'row-select':
      return (
        <div className="bg-surface divide-y overflow-hidden rounded-md border">
          <div className="flex h-row-compact items-center gap-3 px-3">
            <Checkbox aria-label="'홍길동' 선택" defaultChecked />
            <span className="flex-1 truncate text-sm">홍길동</span>
            <span className="text-muted-foreground text-xs">관리자</span>
          </div>
          <div className="flex h-row-compact items-center gap-3 px-3">
            <Checkbox aria-label="'김서연' 선택" />
            <span className="flex-1 truncate text-sm">김서연</span>
            <span className="text-muted-foreground text-xs">편집자</span>
          </div>
        </div>
      )

    case 'select-all':
      return (
        <div className="bg-surface divide-y overflow-hidden rounded-md border">
          <div className="flex h-row-compact items-center gap-3 px-3">
            <Checkbox aria-label="전체 선택" checked="indeterminate" />
            <span className="text-muted-foreground flex-1 text-xs font-bold">이름</span>
          </div>
          <div className="flex h-row-compact items-center gap-3 px-3">
            <Checkbox aria-label="'홍길동' 선택" defaultChecked />
            <span className="flex-1 truncate text-sm">홍길동</span>
          </div>
          <div className="flex h-row-compact items-center gap-3 px-3">
            <Checkbox aria-label="'김서연' 선택" />
            <span className="flex-1 truncate text-sm">김서연</span>
          </div>
        </div>
      )

    case 'terms-agreement':
      return (
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox />
            이용약관과 개인정보 처리방침에 동의합니다
          </label>
        </div>
      )

    case 'setting-toggle':
      return (
        <label className="flex items-start gap-2">
          <span className="pt-0.5">
            <Checkbox defaultChecked />
          </span>
          <span className="flex flex-col">
            <span className="text-sm">2단계 인증</span>
            <span className="text-muted-foreground text-xs">
              로그인할 때마다 인증 코드를 요구합니다
            </span>
          </span>
        </label>
      )

    case 'multiline-label':
      return (
        <Bounds className="w-56">
          <label className="flex items-start gap-2 text-sm">
            <span className="pt-0.5">
              <Checkbox />
            </span>
            워크스페이스의 모든 청구서와 결제 수단을 볼 수 있는 권한을 부여합니다
          </label>
        </Bounds>
      )

    case 'disabled-checked':
      return (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked disabled />
          워크스페이스 소유자 권한
        </label>
      )

    case 'nested-selection':
      return (
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked="indeterminate" />
            알림 전체
          </label>
          <IndentedRow>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              이메일 알림
            </label>
          </IndentedRow>
          <IndentedRow>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox />
              SMS 알림
            </label>
          </IndentedRow>
        </div>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <label className="flex items-start gap-2 text-sm">
            <span className="pt-0.5">
              <Checkbox />
            </span>
            마케팅 이메일 수신 동의
          </label>
        </Bounds>
      )

    default:
      return null
  }
}

export function CheckboxPage() {
  const meta = getComponent('checkbox')
  if (!meta) return <Placeholder title="Checkbox 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCheckbox}
      preview={
        <label className="flex items-start gap-2">
          <span className="pt-0.5">
            <Checkbox data-anatomy="box" defaultChecked />
          </span>
          <span className="flex flex-col">
            <span data-anatomy="label" className="text-sm">
              자동 백업
            </span>
            <span data-anatomy="description" className="text-muted-foreground text-xs">
              매일 오전 3시에 백업을 실행합니다
            </span>
          </span>
        </label>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
