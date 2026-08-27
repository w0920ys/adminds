import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * state는 인스턴스 하나의 열림 여부다. defaultOpen·disabled로만 옮긴다 —
 * focus는 PropertyBlock이 forcedStateClass로 감싼 칸이 스스로 만든다
 * (Accordion의 Playground와 같은 처리).
 */
function renderCollapsible(options: RenderOptions) {
  const state = options.state ?? 'collapsed'
  const expanded = state === 'expanded'
  const disabled = state === 'disabled'

  return (
    <Collapsible defaultOpen={expanded} disabled={disabled} className="w-full max-w-72">
      <CollapsibleTrigger>조건 3개 더</CollapsibleTrigger>
      <CollapsibleContent>가입일 · 최근 로그인 · 결제 상태로 좁힐 수 있습니다.</CollapsibleContent>
    </Collapsible>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Collapsible과
 * 시스템 유틸리티만으로 만든 어드민 화면의 한 조각이다. Usage 넷은
 * 설계 문서 4절이 정한 그대로다 — 고급 검색 조건에는 Field와 Input을,
 * 카드 안의 부가 정보에는 Card를, 표 행의 하위 내용에는 Table을 쓴다.
 * ------------------------------------------------------------------ */

const DEPLOY_LOG = `12:04:01 build started
12:04:03 installing dependencies
12:04:41 dependencies installed (139 packages)
12:04:41 running type check
12:04:58 type check passed
12:04:58 running test suite
12:05:22 233 passed, 0 failed
12:05:22 building assets
12:05:47 build complete (dist/assets/index.js 412kb)
12:05:48 uploading to edge
12:06:03 deploy complete`

const ORDERS = [
  {
    id: 'ORD-4821',
    status: '배송 중',
    detail: '결제 42,000원 · 카드 뒷자리 4242 · 배송지 서울시 강남구',
  },
  {
    id: 'ORD-4820',
    status: '결제 완료',
    detail: '결제 18,500원 · 무통장입금 · 배송지 부산시 해운대구',
  },
]

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'distinguish-from-accordion':
      /*
       * DO는 접히는 자리 하나뿐인 Collapsible이다. DON'T는 실제
       * Accordion을 그대로 띄운다 — assignHeadingIds(src/lib/heading-id.ts)는
       * [data-slot="accordion-trigger"]를 가진 h3에 id를 달지 않을 뿐,
       * h3 자체는 DOM에 그대로 남는다. 이 페이지에서 실제로 그 h3가
       * id 없이도 남는지 확인했다 — Accordion 문서 페이지에는 h3
       * 트리거가 34개 있고 그중 id를 받은 것은 0개, Contents 앵커는
       * 여전히 11개뿐이다(제목 목록에서는 섞여 들지 않는다). 하지만
       * 화면 낭독기의 '다음 제목' 탐색은 id가 아니라 h1~h6 태그 자체를
       * 훑으므로, id 없는 h3라도 접히는 자리 하나를 위한 가짜 절로
       * 걸린다 — 지침이 경고하는 결함 그 자체다. Task 4가 이름 없는
       * 아이콘 Toggle에 썼던 것과 같은 방법으로, inert를 얹어 생김새는
       * 그대로 두되 접근성 트리(그리고 그 h3)를 통째로 빼서 이 문서
       * 자신이 그 결함을 사용자에게 실어 나르지 않게 했다.
       */
      return kind === 'do' ? (
        <Collapsible className="w-full max-w-64">
          <CollapsibleTrigger>결제 상세</CollapsibleTrigger>
          <CollapsibleContent>카드 뒷자리 4242 · 승인번호 82931002</CollapsibleContent>
        </Collapsible>
      ) : (
        <Accordion inert type="single" collapsible className="w-full max-w-64">
          <AccordionItem variant="plain" value="payment">
            <AccordionTrigger>결제 상세</AccordionTrigger>
            <AccordionContent>카드 뒷자리 4242 · 승인번호 82931002</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case 'announce-hidden-content':
      return kind === 'do' ? (
        <Collapsible className="w-full max-w-64">
          <CollapsibleTrigger>조건 3개 더</CollapsibleTrigger>
          <CollapsibleContent>가입일 · 최근 로그인 · 결제 상태</CollapsibleContent>
        </Collapsible>
      ) : (
        <Collapsible className="w-full max-w-64">
          <CollapsibleTrigger>더 보기</CollapsibleTrigger>
          <CollapsibleContent>가입일 · 최근 로그인 · 결제 상태</CollapsibleContent>
        </Collapsible>
      )

    case 'dont-hide-important-content':
      return kind === 'do' ? (
        <div className="w-full max-w-64 rounded-lg border p-4">
          <p className="text-sm font-medium">결제가 거부되었습니다</p>
          <p className="text-muted-foreground mt-1 text-xs">
            카드 한도를 초과했습니다. 다른 카드를 사용해 주세요.
          </p>
        </div>
      ) : (
        <Collapsible className="w-full max-w-64">
          <CollapsibleTrigger>결제가 거부되었습니다</CollapsibleTrigger>
          <CollapsibleContent>카드 한도를 초과했습니다. 다른 카드를 사용해 주세요.</CollapsibleContent>
        </Collapsible>
      )

    case 'dont-make-whole-row-trigger':
      return kind === 'do' ? (
        <Table label="예시 표" className="w-full max-w-80">
          <TableBody>
            <TableRow>
              <TableCell>ORD-4821</TableCell>
              <TableCell>배송 중</TableCell>
              <TableCell>
                <Collapsible>
                  <CollapsibleTrigger className="justify-start gap-1 py-0 text-xs">
                    상세
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-xs">결제 42,000원</CollapsibleContent>
                </Collapsible>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="w-full max-w-80 rounded-md border">
          <div className="text-muted-foreground flex items-center justify-between px-3 py-3 text-sm">
            <span>ORD-4821 · 배송 중</span>
            <span className="text-2xs">행 전체가 눌린다</span>
          </div>
        </div>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'advanced-search':
      return (
        <div className="flex w-full max-w-72 flex-col gap-3">
          <Input placeholder="이름 또는 이메일로 검색" />
          <Collapsible>
            <CollapsibleTrigger>고급 검색 조건</CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-3">
                <Field layout="stacked">
                  <FieldLabel>가입일 이후</FieldLabel>
                  <FieldControl>
                    <Input placeholder="2026-01-01" />
                  </FieldControl>
                </Field>
                <Field layout="stacked">
                  <FieldLabel>결제 상태</FieldLabel>
                  <FieldControl>
                    <Input placeholder="완료" />
                  </FieldControl>
                </Field>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )

    case 'card-detail':
      return (
        <Card className="w-full max-w-72">
          <CardHeader>
            <CardTitle>결제 42,000원</CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible>
              <CollapsibleTrigger>결제 상세</CollapsibleTrigger>
              <CollapsibleContent>카드 뒷자리 4242 · 승인번호 82931002</CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )

    case 'long-log':
      return (
        <Collapsible className="w-full max-w-72">
          <CollapsibleTrigger>배포 로그 11줄</CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="bg-muted max-h-40 overflow-y-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
              {DEPLOY_LOG}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )

    case 'table-row-detail':
      return (
        <Table label="주문 목록" className="w-full max-w-96">
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Collapsible>
                    <CollapsibleTrigger className="justify-start gap-1 py-0 text-xs">
                      상세 보기
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-xs">{order.detail}</CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

    case 'long-content':
      return (
        <Collapsible defaultOpen className="w-full max-w-72">
          <CollapsibleTrigger>배포 로그 11줄</CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="bg-muted max-h-40 overflow-y-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
              {DEPLOY_LOG}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )

    case 'start-collapsed':
      return (
        <Collapsible className="w-full max-w-72">
          <CollapsibleTrigger>조건 3개 더</CollapsibleTrigger>
          <CollapsibleContent>가입일 · 최근 로그인 · 결제 상태로 좁힐 수 있습니다.</CollapsibleContent>
        </Collapsible>
      )

    case 'form-inside':
      return (
        <Collapsible className="w-full max-w-72">
          <CollapsibleTrigger>결제 수단 추가</CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-3">
              <Field layout="stacked">
                <FieldLabel>카드 번호</FieldLabel>
                <FieldControl>
                  <Input placeholder="0000-0000-0000-0000" />
                </FieldControl>
              </Field>
              <Field layout="stacked">
                <FieldLabel>유효기간</FieldLabel>
                <FieldControl>
                  <Input placeholder="MM/YY" />
                </FieldControl>
              </Field>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )

    case 'narrow-screen':
      return (
        <div className="w-48 rounded-md border border-dashed p-2">
          <Collapsible defaultOpen className="w-full">
            <CollapsibleTrigger>조건 3개 더</CollapsibleTrigger>
            <CollapsibleContent>가입일 · 최근 로그인 · 결제 상태로 좁힐 수 있습니다.</CollapsibleContent>
          </Collapsible>
        </div>
      )

    default:
      return null
  }
}

/*
 * Anatomy 미리보기는 인스턴스 하나다. Indicator는 Trigger 안에서 그려져
 * 소비자가 직접 닿을 수 없으므로 indicatorProps로 data-anatomy를 흘려
 * 보낸다 — Switch의 thumbProps와 같은 통로다.
 */
function AnatomyPreview() {
  return (
    <Collapsible defaultOpen className="w-80">
      <CollapsibleTrigger data-anatomy="trigger" indicatorProps={{ 'data-anatomy': 'indicator' }}>
        조건 3개 더
      </CollapsibleTrigger>
      <CollapsibleContent data-anatomy="content">
        가입일 · 최근 로그인 · 결제 상태로 좁힐 수 있습니다.
      </CollapsibleContent>
    </Collapsible>
  )
}

export function CollapsiblePage() {
  const meta = getComponent('collapsible')
  if (!meta) return <Placeholder title="Collapsible 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCollapsible}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
