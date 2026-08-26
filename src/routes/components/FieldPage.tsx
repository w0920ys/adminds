import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldControl, FieldError, FieldHelp, FieldLabel } from '@/components/ui/field'
import type { FieldLayout, FieldState } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

function renderField(options: RenderOptions) {
  const layout = (options.layout as FieldLayout | undefined) ?? 'stacked'
  const state = (options.state as FieldState | undefined) ?? 'default'
  const label = options.label ?? 'plain'

  return (
    <Field layout={layout} state={state} className={layout === 'horizontal' ? 'w-72' : undefined}>
      <FieldLabel>
        이름
        {label === 'required' && (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        )}
        {label === 'optional' && <span className="text-muted-foreground font-normal"> (선택)</span>}
      </FieldLabel>
      <FieldControl>
        <Input placeholder="홍길동" className={layout === 'stacked' ? 'w-48' : undefined} />
      </FieldControl>
      {state === 'error' && <FieldError>이름을 입력하세요</FieldError>}
    </Field>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Field와 Input ·
 * Select · Textarea · Checkbox · Radio · Switch만으로 만든 어드민
 * 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'label-above-input':
      return kind === 'do' ? (
        <Field className="w-48">
          <FieldLabel>이름</FieldLabel>
          <FieldControl>
            <Input placeholder="홍길동" />
          </FieldControl>
        </Field>
      ) : (
        <Field className="w-48">
          <FieldControl>
            <Input placeholder="홍길동" />
          </FieldControl>
          <FieldLabel>이름</FieldLabel>
        </Field>
      )

    case 'help-before-error-after':
      return kind === 'do' ? (
        <Field state="error" className="w-56">
          <FieldLabel>비밀번호</FieldLabel>
          <FieldHelp>영문·숫자·특수문자를 조합해 8자 이상 입력합니다</FieldHelp>
          <FieldControl>
            <Input type="password" defaultValue="1234" />
          </FieldControl>
          <FieldError>8자 이상 입력하세요</FieldError>
        </Field>
      ) : (
        <Field state="error" className="w-56">
          <FieldLabel>비밀번호</FieldLabel>
          <FieldError>8자 이상 입력하세요</FieldError>
          <FieldControl>
            <Input type="password" defaultValue="1234" />
          </FieldControl>
          <FieldHelp>영문·숫자·특수문자를 조합해 8자 이상 입력합니다</FieldHelp>
        </Field>
      )

    case 'single-requirement-mark':
      return kind === 'do' ? (
        <div className="flex flex-col gap-3">
          <Field className="w-48">
            <FieldLabel>
              이름
              <span className="text-destructive ml-0.5" aria-hidden>
                *
              </span>
            </FieldLabel>
            <FieldControl>
              <Input placeholder="홍길동" />
            </FieldControl>
          </Field>
          <Field className="w-48">
            <FieldLabel>
              이메일
              <span className="text-destructive ml-0.5" aria-hidden>
                *
              </span>
            </FieldLabel>
            <FieldControl>
              <Input placeholder="name@company.com" />
            </FieldControl>
          </Field>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Field className="w-48">
            <FieldLabel>
              이름
              <span className="text-destructive ml-0.5" aria-hidden>
                *
              </span>
            </FieldLabel>
            <FieldControl>
              <Input placeholder="홍길동" />
            </FieldControl>
          </Field>
          <Field className="w-48">
            <FieldLabel>
              회사 <span className="text-muted-foreground font-normal">(선택)</span>
            </FieldLabel>
            <FieldControl>
              <Input placeholder="어드민랩" />
            </FieldControl>
          </Field>
        </div>
      )

    case 'keep-help-with-error':
      return kind === 'do' ? (
        <Field state="error" className="w-56">
          <FieldLabel>전화번호</FieldLabel>
          <FieldHelp>010-0000-0000 형식으로 입력합니다</FieldHelp>
          <FieldControl>
            <Input defaultValue="010-12-34" />
          </FieldControl>
          <FieldError>형식이 올바르지 않습니다</FieldError>
        </Field>
      ) : (
        <Field state="error" className="w-56">
          <FieldLabel>전화번호</FieldLabel>
          <FieldControl>
            <Input defaultValue="010-12-34" />
          </FieldControl>
          <FieldError>형식이 올바르지 않습니다</FieldError>
        </Field>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'form-row':
      return (
        <Field className="w-56">
          <FieldLabel>이름</FieldLabel>
          <FieldControl>
            <Input placeholder="홍길동" />
          </FieldControl>
        </Field>
      )

    case 'setting-item':
      return (
        <Field layout="horizontal" className="w-72">
          <FieldLabel className="w-32">마케팅 수신</FieldLabel>
          <FieldControl>
            <Checkbox defaultChecked />
          </FieldControl>
        </Field>
      )

    case 'table-filter':
      return (
        <div className="bg-surface flex items-center gap-2 rounded-md border p-2">
          <Field>
            <FieldLabel className="sr-only">상태</FieldLabel>
            <FieldControl>
              <Select defaultValue="active">
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </Field>
        </div>
      )

    case 'grouped-inputs':
      return (
        <Field>
          <fieldset className="contents">
            <legend className="text-sm font-medium">배포 범위</legend>
            <RadioGroup defaultValue="canary" className="gap-1.5 pt-1.5">
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="all" />
                전체 배포
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="canary" />
                단계적 배포
              </label>
            </RadioGroup>
          </fieldset>
        </Field>
      )

    case 'error-with-help':
      return (
        <Field state="error" className="w-64">
          <FieldLabel>자기소개</FieldLabel>
          <FieldHelp>다른 사용자에게 보이는 소개 문구입니다</FieldHelp>
          <FieldControl>
            <Textarea defaultValue={'x'.repeat(210)} className="w-64" />
          </FieldControl>
          <FieldError>200자를 넘을 수 없습니다</FieldError>
        </Field>
      )

    case 'long-label':
      return (
        <Field layout="horizontal" className="w-80">
          <FieldLabel className="w-28">워크스페이스의 모든 구성원에게 알림</FieldLabel>
          <FieldControl>
            <Switch />
          </FieldControl>
        </Field>
      )

    case 'no-label':
      return (
        <Field>
          <FieldControl>
            <Input aria-label="사용자 검색" placeholder="사용자 검색" className="w-48" />
          </FieldControl>
        </Field>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-48">
          <Field layout="horizontal">
            <FieldLabel className="w-16">상태</FieldLabel>
            <FieldControl>
              <Select defaultValue="active">
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </Field>
        </Bounds>
      )

    default:
      return null
  }
}

export function FieldPage() {
  const meta = getComponent('field')
  if (!meta) return <Placeholder title="Field 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderField}
      preview={
        <Field data-anatomy="container" className={cn('w-64')} state="error">
          <FieldLabel data-anatomy="label">
            이메일
            <span data-anatomy="requirement-mark" className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          </FieldLabel>
          <FieldHelp data-anatomy="help">회사 이메일 주소를 입력합니다</FieldHelp>
          <FieldControl data-anatomy="control">
            <Input placeholder="name@company.com" defaultValue="not-an-email" />
          </FieldControl>
          <FieldError data-anatomy="error">올바른 이메일 형식이 아닙니다</FieldError>
        </Field>
      }
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
