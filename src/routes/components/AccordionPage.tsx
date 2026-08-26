import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionVariant,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 격자의 각 칸은 항목 둘을 넣는다. state는 항목 하나의 상태이지만, 접힌
 * 상태를 뜻대로 보이려면 옆에 다른 항목이 있어야 '접힌 채로도 나머지는
 * 그대로 있다'는 맥락이 성립한다 — Tabs가 활성 아닌 탭을 보이려고 탭을
 * 둘 두는 것과 같은 이유다. 두 번째 항목은 그 맥락을 위해서만 있다.
 */
function renderAccordion(options: RenderOptions) {
  const variant = (options.variant ?? 'plain') as AccordionVariant
  const state = options.state ?? 'collapsed'
  const expanded = state === 'expanded'
  const disabled = state === 'disabled'

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={expanded ? 'primary' : undefined}
      className="w-72"
    >
      <AccordionItem variant={variant} value="primary" disabled={disabled}>
        <AccordionTrigger>결제 정보</AccordionTrigger>
        <AccordionContent>카드 번호와 유효기간을 입력합니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem variant={variant} value="secondary">
        <AccordionTrigger>배송 정보</AccordionTrigger>
        <AccordionContent>받으실 주소와 연락처를 입력합니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Accordion과 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 *
 * 'decide-single-or-multiple' 지침에는 예시를 두지 않는다. type은 쉬고
 * 있는 모습에서 완전히 같아, 정적인 화면 하나로는 single과 multiple의
 * 차이를 보일 수 없다 — 두 번째 항목을 눌러야만 갈린다.
 * ------------------------------------------------------------------ */

const LONG_POLICY_TEXT =
  '환불은 결제일로부터 7일 이내에 신청할 수 있습니다. 배송이 시작된 이후에는 반송 절차를 먼저 거쳐야 하며, 반송 상품이 창고에 도착해 검수를 마친 뒤에 환불이 진행됩니다. 검수 중 상품에 손상이 확인되면 환불 금액에서 손상 정도에 따른 차감이 있을 수 있습니다. 정기 결제 상품은 다음 결제일 전에 해지해야 다음 회차 결제를 막을 수 있고, 이미 결제된 회차는 이 정책과 별도로 처리됩니다. 프로모션으로 받은 적립금이나 쿠폰은 환불 금액에 포함되지 않으며, 사용한 적립금은 환불 시 함께 회수됩니다.'

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'dont-hide-important-content':
      return kind === 'do' ? (
        <div className="w-64 rounded-lg border p-4">
          <p className="text-sm font-medium">결제가 거부되었습니다</p>
          <p className="text-muted-foreground mt-1 text-xs">
            카드 한도를 초과했습니다. 다른 카드를 사용해 주세요.
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-64">
          <AccordionItem variant="plain" value="reason">
            <AccordionTrigger>결제가 거부되었습니다</AccordionTrigger>
            <AccordionContent>카드 한도를 초과했습니다. 다른 카드를 사용해 주세요.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'dont-hide-page-length':
      return kind === 'do' ? (
        <Accordion type="single" collapsible defaultValue="refund" className="w-64">
          <AccordionItem variant="plain" value="refund">
            <AccordionTrigger>환불은 언제까지 가능한가요</AccordionTrigger>
            <AccordionContent>결제일로부터 7일 이내에 신청할 수 있습니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Accordion type="single" collapsible defaultValue="refund" className="w-64">
          <AccordionItem variant="plain" value="refund">
            <AccordionTrigger>환불 정책</AccordionTrigger>
            <AccordionContent>{LONG_POLICY_TEXT}</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'advanced-settings':
      return (
        <Accordion type="single" collapsible className="w-72">
          <AccordionItem variant="plain" value="advanced">
            <AccordionTrigger>고급 설정</AccordionTrigger>
            <AccordionContent>API 호출 빈도와 웹훅 주소를 설정합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'filter-groups':
      return (
        <Accordion type="multiple" defaultValue={['status']} className="w-72">
          <AccordionItem variant="bordered" value="status">
            <AccordionTrigger>상태</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked /> 진행 중
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox /> 완료
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem variant="bordered" value="period">
            <AccordionTrigger>기간</AccordionTrigger>
            <AccordionContent>지난 7일 · 지난 30일 · 직접 입력 중에서 고릅니다.</AccordionContent>
          </AccordionItem>
          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline">
              필터 적용
            </Button>
          </div>
        </Accordion>
      )

    case 'long-form-sections':
      return (
        <Accordion type="single" collapsible defaultValue="basic" className="w-72">
          <AccordionItem variant="bordered" value="basic">
            <AccordionTrigger>기본 정보</AccordionTrigger>
            <AccordionContent>이름과 연락처를 입력합니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="bordered" value="address">
            <AccordionTrigger>배송지</AccordionTrigger>
            <AccordionContent>받으실 곳의 주소를 입력합니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="bordered" value="payment">
            <AccordionTrigger>결제</AccordionTrigger>
            <AccordionContent>결제 수단을 선택합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'faq':
      return (
        <Accordion type="single" collapsible className="w-72">
          <AccordionItem variant="plain" value="q1">
            <AccordionTrigger>비밀번호를 잊어버렸어요</AccordionTrigger>
            <AccordionContent>로그인 화면의 '비밀번호 찾기'에서 새로 정할 수 있습니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="plain" value="q2">
            <AccordionTrigger>결제 수단을 바꿀 수 있나요</AccordionTrigger>
            <AccordionContent>설정의 결제 정보에서 언제든 바꿀 수 있습니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="plain" value="q3">
            <AccordionTrigger>탈퇴하면 데이터는 어떻게 되나요</AccordionTrigger>
            <AccordionContent>탈퇴 후 30일 동안 보관되며 그 뒤 완전히 삭제됩니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'single-item':
      return (
        <Accordion type="single" collapsible className="w-72">
          <AccordionItem variant="plain" value="only">
            <AccordionTrigger>배송 조회</AccordionTrigger>
            <AccordionContent>주문 상세에서 운송장 번호로 배송 상태를 확인합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'long-title':
      return (
        <Accordion type="single" collapsible className="w-64">
          <AccordionItem variant="plain" value="long">
            <AccordionTrigger>워크스페이스 청구서와 결제 수단을 함께 관리하는 방법</AccordionTrigger>
            <AccordionContent>설정의 결제 탭에서 청구서 내역과 결제 수단을 한 화면에서 관리합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'long-content':
      return (
        <Accordion type="single" collapsible defaultValue="policy" className="w-72">
          <AccordionItem variant="plain" value="policy">
            <AccordionTrigger>환불 정책</AccordionTrigger>
            <AccordionContent>{LONG_POLICY_TEXT}</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'all-expanded':
      return (
        <Accordion type="multiple" defaultValue={['q1', 'q2', 'q3']} className="w-72">
          <AccordionItem variant="plain" value="q1">
            <AccordionTrigger>비밀번호를 잊어버렸어요</AccordionTrigger>
            <AccordionContent>로그인 화면의 '비밀번호 찾기'에서 새로 정할 수 있습니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="plain" value="q2">
            <AccordionTrigger>결제 수단을 바꿀 수 있나요</AccordionTrigger>
            <AccordionContent>설정의 결제 정보에서 언제든 바꿀 수 있습니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem variant="plain" value="q3">
            <AccordionTrigger>탈퇴하면 데이터는 어떻게 되나요</AccordionTrigger>
            <AccordionContent>탈퇴 후 30일 동안 보관되며 그 뒤 완전히 삭제됩니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. 두 번째 항목은 '접힌 항목 옆에
 * 펼쳐진 항목이 있다'는 맥락을 위해서만 있고 지시선을 받지 않는다 —
 * Tabs·Steps의 문맥용 형제 요소와 같은 자리다.
 */
function AnatomyPreview() {
  return (
    <Accordion data-anatomy="container" type="single" collapsible defaultValue="primary" className="w-80">
      <AccordionItem data-anatomy="item" variant="plain" value="primary">
        <AccordionTrigger data-anatomy="trigger">결제 정보</AccordionTrigger>
        <AccordionContent data-anatomy="content">카드 번호와 유효기간을 입력합니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem variant="plain" value="secondary">
        <AccordionTrigger>배송 정보</AccordionTrigger>
        <AccordionContent>받으실 주소와 연락처를 입력합니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function AccordionPage() {
  const meta = getComponent('accordion')
  if (!meta) return <Placeholder title="Accordion 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderAccordion}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
