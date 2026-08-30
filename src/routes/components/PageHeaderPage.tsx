import type { ReactNode } from 'react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function PeriodTabs() {
  return (
    <Tabs defaultValue="7d">
      <TabsList>
        <TabsTrigger value="7d">7일</TabsTrigger>
        <TabsTrigger value="30d">30일</TabsTrigger>
        <TabsTrigger value="90d">90일</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

function render(options: RenderOptions) {
  const showDescription = options.description === 'shown'
  const showActions = options.actions === 'shown'

  return (
    <PageHeader
      title="주문 관리"
      description={showDescription ? '전체 주문을 상태별로 확인합니다' : undefined}
      actions={showActions ? <PeriodTabs /> : undefined}
    />
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'list-page-title':
      return <PageHeader title="주문 관리" description="전체 주문을 상태별로 확인합니다" actions={<PeriodTabs />} />

    case 'detail-page-title':
      return <PageHeader title="주문 #20394" description="2026년 8월 29일에 접수됨" />

    case 'no-description':
      return <PageHeader title="설정" />

    /*
     * flex-col sm:flex-row는 뷰포트 폭 기준 미디어쿼리다 — App Shell의
     * md:h-svh와 같은 이유로 Bounds처럼 부모 폭만 좁히는 방식으로는
     * 실제 데스크톱 브라우저에서 세로 쌓임을 재현할 수 없다. 라이브
     * 데모 대신 note 설명글로 남기고(narrow-screen), 실제 동작은 브라우저
     * 폭을 좁혀 별도로 확인했다.
     */
    case 'narrow-screen':
      return null

    default:
      return null
  }
}

export function PageHeaderPage() {
  const meta = getComponent('page-header')
  if (!meta) return <Placeholder title="Page Header 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={render}
      preview={render({ description: 'hidden', actions: 'hidden' })}
      renderExample={renderExample}
    />
  )
}
