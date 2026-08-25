import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Switch } from '@/components/ui/switch'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderSwitch(options: RenderOptions) {
  const { state, layout } = options
  const checked = state === 'on' || state === 'pending'
  const disabled = state === 'disabled'
  const pending = state === 'pending'

  const control = (
    <Switch
      checked={checked}
      disabled={disabled}
      pending={pending}
      aria-label={layout === 'standalone' ? '알림 받기' : undefined}
    />
  )

  if (layout === 'with-description') {
    return (
      <label className="flex items-start gap-2">
        <span className="pt-0.5">{control}</span>
        <span className="flex flex-col">
          <span className="text-sm">자동 갱신</span>
          <span className="text-muted-foreground text-xs">만료일에 자동으로 결제하고 연장합니다</span>
        </span>
      </label>
    )
  }

  if (layout === 'with-label') {
    return (
      <label className="flex items-center gap-2 text-sm">
        {control}
        알림 받기
      </label>
    )
  }

  return control
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Switch와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'form-with-save':
      return kind === 'do' ? (
        <form className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="size-4 rounded-sm border-input" />
            마케팅 이메일 수신 동의
          </label>
          <button
            type="button"
            className="bg-primary text-primary-foreground w-fit rounded-md px-3 py-1.5 text-sm"
          >
            저장
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked />
            마케팅 이메일 수신 동의
          </label>
          <button
            type="button"
            className="bg-primary text-primary-foreground w-fit rounded-md px-3 py-1.5 text-sm"
          >
            저장
          </button>
        </form>
      )

    case 'irreversible':
      return kind === 'do' ? (
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          검색 결과에 노출
        </label>
      ) : (
        <label className="flex items-center gap-2 text-sm">
          <Switch />
          워크스페이스 영구 삭제
        </label>
      )

    case 'label-wording':
      return kind === 'do' ? (
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          알림 받기
        </label>
      ) : (
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          알림 끄기
        </label>
      )

    case 'pending-feedback':
      return kind === 'do' ? (
        <Switch checked pending />
      ) : (
        <Switch checked disabled className="opacity-100" />
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'notification-toggle':
      return (
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          알림 받기
        </label>
      )

    case 'visibility':
      return (
        <label className="flex items-start gap-2">
          <span className="pt-0.5">
            <Switch />
          </span>
          <span className="flex flex-col">
            <span className="text-sm">프로필 공개</span>
            <span className="text-muted-foreground text-xs">
              다른 사용자가 내 프로필을 볼 수 있습니다
            </span>
          </span>
        </label>
      )

    case 'auto-renew':
      return (
        <label className="flex items-start gap-2">
          <span className="pt-0.5">
            <Switch defaultChecked />
          </span>
          <span className="flex flex-col">
            <span className="text-sm">자동 갱신</span>
            <span className="text-muted-foreground text-xs">
              만료일에 자동으로 결제하고 연장합니다
            </span>
          </span>
        </label>
      )

    case 'row-toggle':
      return (
        <div className="bg-surface flex h-row-compact items-center gap-3 rounded-md border px-3">
          <span className="flex-1 truncate text-sm">홍길동</span>
          <span className="text-muted-foreground text-xs">활성</span>
          <Switch defaultChecked aria-label="'홍길동' 활성 여부" />
        </div>
      )

    case 'update-failed':
      return (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <Switch />
            자동 갱신
          </label>
          <p className="text-destructive text-xs">반영에 실패했습니다. 다시 시도해 주세요.</p>
        </div>
      )

    case 'locked':
      return (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <Switch disabled />
            <span className="text-muted-foreground">2단계 인증 강제</span>
          </label>
          <p className="text-muted-foreground text-xs">관리자만 바꿀 수 있습니다</p>
        </div>
      )

    case 'long-label':
      return (
        <Bounds className="w-56">
          <label className="flex items-start gap-2 text-sm">
            <span className="pt-0.5">
              <Switch defaultChecked />
            </span>
            워크스페이스의 모든 구성원에게 이 알림을 한 번에 전달합니다
          </label>
        </Bounds>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <label className="flex items-start gap-2 text-sm">
            <span className="pt-0.5">
              <Switch />
            </span>
            알림 받기
          </label>
        </Bounds>
      )

    default:
      return null
  }
}

export function SwitchPage() {
  const meta = getComponent('switch')
  if (!meta) return <Placeholder title="Switch 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSwitch}
      preview={
        <label className="flex items-start gap-2">
          <span className="pt-0.5">
            <Switch data-anatomy="track" defaultChecked thumbProps={{ 'data-anatomy': 'thumb' }} />
          </span>
          <span className="flex flex-col">
            <span data-anatomy="label" className="text-sm">
              자동 갱신
            </span>
            <span data-anatomy="description" className="text-muted-foreground text-xs">
              만료일에 자동으로 결제하고 연장합니다
            </span>
          </span>
        </label>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
