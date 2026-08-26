import type { ComponentProps, ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Step, StepDescription, StepIndicator, StepLabel, Steps } from '@/components/ui/steps'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

type StepsOrientation = NonNullable<ComponentProps<typeof Steps>['orientation']>
type StepState = NonNullable<ComponentProps<typeof Step>['state']>
type StepsLayout = 'label' | 'with-description'

/*
 * 결제 폼 하나를 예시 데이터로 공유한다. 화면에 나오는 단계 이름·순서는
 * 이 배열에서 파생한다 — 여러 자리에서 손으로 다시 적지 않는다.
 */
const DEMO_STEPS: { title: string; description: string }[] = [
  { title: '기본 정보', description: '이름과 연락처를 입력합니다' },
  { title: '배송지', description: '받으실 곳의 주소를 입력합니다' },
  { title: '결제', description: '결제 수단을 선택합니다' },
  { title: '완료', description: '주문 내용을 확인합니다' },
]

/* Properties의 state 격자가 가리키는 단계. 그 앞은 complete, 그 뒤는 pending으로 두어 격자 칸의 state가 나머지와 갈라져 읽힌다 */
const FOCAL_INDEX = 1

function stepStateAt(index: number, focal: StepState): StepState {
  if (index < FOCAL_INDEX) return 'complete'
  if (index === FOCAL_INDEX) return focal
  return 'pending'
}

function renderSteps(options: RenderOptions) {
  const orientation = (options.orientation ?? 'horizontal') as StepsOrientation
  const focal = (options.state ?? 'pending') as StepState
  const layout = (options.layout ?? 'label') as StepsLayout

  const list = (
    <Steps orientation={orientation} className={orientation === 'horizontal' ? 'w-full max-w-xl' : 'w-64'}>
      {DEMO_STEPS.map((step, index) => (
        <Step key={step.title} state={stepStateAt(index, focal)}>
          <StepIndicator>{index + 1}</StepIndicator>
          <StepLabel>{step.title}</StepLabel>
          {layout === 'with-description' && <StepDescription>{step.description}</StepDescription>}
        </Step>
      ))}
    </Steps>
  )

  /* vertical의 커넥터는 각 Step 자신의 높이 안에서 이어진다. 격자 칸의
     기본 높이(min-h-10)로는 네 단계가 눌려 보이므로 여유 높이를 준다 —
     SeparatorPage가 세로 변형에 h-24를 주는 것과 같은 이유다. */
  if (orientation === 'vertical') {
    return <div className="min-h-72">{list}</div>
  }
  return list
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Steps와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'color-and-shape':
      return (
        <Steps orientation="horizontal" className="w-64">
          <Step state="complete">
            <StepIndicator>1</StepIndicator>
            <StepLabel>정보 입력</StepLabel>
          </Step>
          <Step state={kind === 'do' ? 'current' : 'complete'}>
            <StepIndicator>2</StepIndicator>
            <StepLabel>결제</StepLabel>
          </Step>
          <Step state="pending">
            <StepIndicator>3</StepIndicator>
            <StepLabel>완료</StepLabel>
          </Step>
        </Steps>
      )

    case 'clickable-visited-only':
      return kind === 'do' ? (
        <div className="flex w-64 flex-col gap-2 text-xs">
          <Steps orientation="horizontal">
            <Step state="complete">
              <StepIndicator>1</StepIndicator>
              <StepLabel>정보 입력</StepLabel>
            </Step>
            <Step state="current">
              <StepIndicator>2</StepIndicator>
              <StepLabel>결제</StepLabel>
            </Step>
            <Step state="pending">
              <StepIndicator>3</StepIndicator>
              <StepLabel>완료</StepLabel>
            </Step>
          </Steps>
          <p className="text-muted-foreground">1단계만 눌러 되돌아갈 수 있습니다</p>
        </div>
      ) : (
        <div className="flex w-64 flex-col gap-2 text-xs">
          <Steps orientation="horizontal">
            <Step state="complete">
              <StepIndicator>1</StepIndicator>
              <StepLabel>정보 입력</StepLabel>
            </Step>
            <Step state="current">
              <StepIndicator>2</StepIndicator>
              <StepLabel>결제</StepLabel>
            </Step>
            <Step state="pending">
              <StepIndicator>3</StepIndicator>
              <StepLabel>완료</StepLabel>
            </Step>
          </Steps>
          <p className="text-muted-foreground">3단계까지 미리 눌러 건너뛸 수 있습니다</p>
        </div>
      )

    case 'step-count-range':
      return kind === 'do' ? (
        <Steps orientation="horizontal" className="w-64">
          {DEMO_STEPS.map((step, index) => (
            <Step key={step.title} state={stepStateAt(index, 'current')}>
              <StepIndicator>{index + 1}</StepIndicator>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Steps>
      ) : (
        <Steps orientation="horizontal" className="w-72">
          {['약관', '본인 확인', '정보 입력', '배송지', '결제', '검토', '완료'].map((title, index) => (
            <Step key={title} state={index === 1 ? 'current' : index < 1 ? 'complete' : 'pending'}>
              <StepIndicator>{index + 1}</StepIndicator>
              <StepLabel className="text-2xs">{title}</StepLabel>
            </Step>
          ))}
        </Steps>
      )

    case 'no-progress-bar':
      return kind === 'do' ? (
        <Steps orientation="horizontal" className="w-64">
          <Step state="complete">
            <StepIndicator>1</StepIndicator>
            <StepLabel>정보 입력</StepLabel>
          </Step>
          <Step state="current">
            <StepIndicator>2</StepIndicator>
            <StepLabel>결제</StepLabel>
          </Step>
          <Step state="pending">
            <StepIndicator>3</StepIndicator>
            <StepLabel>완료</StepLabel>
          </Step>
        </Steps>
      ) : (
        <div className="flex w-64 flex-col gap-3">
          <Steps orientation="horizontal">
            <Step state="complete">
              <StepIndicator>1</StepIndicator>
              <StepLabel>정보 입력</StepLabel>
            </Step>
            <Step state="current">
              <StepIndicator>2</StepIndicator>
              <StepLabel>결제</StepLabel>
            </Step>
            <Step state="pending">
              <StepIndicator>3</StepIndicator>
              <StepLabel>완료</StepLabel>
            </Step>
          </Steps>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div className="bg-primary h-full w-2/3" />
          </div>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'multi-step-form':
      return (
        <Steps orientation="horizontal" className="w-full max-w-md">
          {DEMO_STEPS.map((step, index) => (
            <Step key={step.title} state={stepStateAt(index, 'current')}>
              <StepIndicator>{index + 1}</StepIndicator>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Steps>
      )

    case 'approval-flow-position':
      return (
        <Steps orientation="horizontal" className="w-full max-w-md">
          <Step state="complete">
            <StepIndicator>1</StepIndicator>
            <StepLabel>기안</StepLabel>
          </Step>
          <Step state="current">
            <StepIndicator>2</StepIndicator>
            <StepLabel>1차 승인</StepLabel>
          </Step>
          <Step state="pending">
            <StepIndicator>3</StepIndicator>
            <StepLabel>2차 승인</StepLabel>
          </Step>
          <Step state="pending">
            <StepIndicator>4</StepIndicator>
            <StepLabel>완료</StepLabel>
          </Step>
        </Steps>
      )

    case 'processing-status':
      return (
        <div className="min-h-56 w-64">
          <Steps orientation="vertical">
            <Step state="complete">
              <StepIndicator>1</StepIndicator>
              <StepLabel>결제 완료</StepLabel>
              <StepDescription>8월 24일 오전 10시 12분</StepDescription>
            </Step>
            <Step state="current">
              <StepIndicator>2</StepIndicator>
              <StepLabel>상품 준비 중</StepLabel>
              <StepDescription>곧 배송을 시작합니다</StepDescription>
            </Step>
            <Step state="pending">
              <StepIndicator>3</StepIndicator>
              <StepLabel>배송 중</StepLabel>
            </Step>
            <Step state="pending">
              <StepIndicator>4</StepIndicator>
              <StepLabel>배송 완료</StepLabel>
            </Step>
          </Steps>
        </div>
      )

    case 'installation-guide':
      return (
        <Steps orientation="horizontal" className="w-full max-w-xl">
          {DEMO_STEPS.map((step, index) => (
            <Step key={step.title} state={stepStateAt(index, 'current')}>
              <StepIndicator>{index + 1}</StepIndicator>
              <StepLabel>{step.title}</StepLabel>
              <StepDescription>{step.description}</StepDescription>
            </Step>
          ))}
        </Steps>
      )

    case 'many-steps':
      return (
        <div className="flex flex-col gap-2">
          <Steps orientation="horizontal" className="w-full max-w-xl">
            {['약관', '본인 확인', '정보 입력', '배송지', '결제', '검토', '완료'].map((title, index) => (
              <Step key={title} state={index === 2 ? 'current' : index < 2 ? 'complete' : 'pending'}>
                <StepIndicator>{index + 1}</StepIndicator>
                <StepLabel className="text-2xs">{title}</StepLabel>
              </Step>
            ))}
          </Steps>
          <p className="text-muted-foreground text-2xs">
            일곱 단계다. 한 단계씩 좁아져 라벨을 읽기 어렵다.
          </p>
        </div>
      )

    case 'long-step-name':
      return (
        <Steps orientation="horizontal" className="w-full max-w-md">
          <Step state="complete">
            <StepIndicator>1</StepIndicator>
            <StepLabel>기본 정보</StepLabel>
          </Step>
          <Step state="current">
            <StepIndicator>2</StepIndicator>
            <StepLabel>본인 확인 서류 업로드</StepLabel>
          </Step>
          <Step state="pending">
            <StepIndicator>3</StepIndicator>
            <StepLabel>완료</StepLabel>
          </Step>
        </Steps>
      )

    case 'failed-step':
      return (
        <Steps orientation="horizontal" className="w-full max-w-md">
          <Step state="complete">
            <StepIndicator>1</StepIndicator>
            <StepLabel>정보 입력</StepLabel>
          </Step>
          <Step state="error">
            <StepIndicator>2</StepIndicator>
            <StepLabel>결제</StepLabel>
            <StepDescription>카드 승인에 실패했습니다</StepDescription>
          </Step>
          <Step state="pending">
            <StepIndicator>3</StepIndicator>
            <StepLabel>완료</StepLabel>
          </Step>
        </Steps>
      )

    case 'narrow-screen':
      return (
        <div className="w-40">
          <Steps orientation="horizontal">
            <Step state="complete">
              <StepIndicator>1</StepIndicator>
              <StepLabel>정보 입력</StepLabel>
            </Step>
            <Step state="current">
              <StepIndicator>2</StepIndicator>
              <StepLabel>배송지 확인</StepLabel>
            </Step>
            <Step state="pending">
              <StepIndicator>3</StepIndicator>
              <StepLabel>완료</StepLabel>
            </Step>
          </Steps>
        </div>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Description은 선택 부위이지만 다른
 * 부위와 함께 보일 수 있는 상태(상태가 아니라 있거나 없는 부위)이므로
 * 이 인스턴스에 포함해 둔다. 지시선은 커넥터가 남아 있는 두 번째 단계를
 * 가리킨다 — 마지막 단계는 커넥터가 없다.
 */
function AnatomyPreview() {
  return (
    <Steps data-anatomy="container" orientation="horizontal" className="w-full max-w-md">
      <Step state="complete">
        <StepIndicator>1</StepIndicator>
        <StepLabel>기본 정보</StepLabel>
      </Step>
      <Step data-anatomy="step" state="current" connectorProps={{ 'data-anatomy': 'connector' }}>
        <StepIndicator data-anatomy="indicator">2</StepIndicator>
        <StepLabel data-anatomy="label">배송지</StepLabel>
        <StepDescription data-anatomy="description">받으실 곳의 주소를 입력합니다</StepDescription>
      </Step>
      <Step state="pending">
        <StepIndicator>3</StepIndicator>
        <StepLabel>결제</StepLabel>
      </Step>
    </Steps>
  )
}

export function StepsPage() {
  const meta = getComponent('steps')
  if (!meta) return <Placeholder title="Steps 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSteps}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
