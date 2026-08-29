import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsVariant } from '@/components/ui/tabs'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/**
 * 격자의 각 칸은 탭 둘을 넣는다. state는 탭 하나의 상태이지만, 활성이
 * 아닌 탭을 보이려면 활성인 다른 탭이 함께 있어야 값이 성립한다 —
 * Tabs가 하나뿐이면 Radix가 그 하나를 무조건 활성으로 만든다. 두 번째
 * 탭은 그 맥락을 위해서만 있다.
 *
 * value(제어)만 주고 onValueChange를 주지 않으면 Radix가 클릭을 받아도
 * 부모 state가 바뀌지 않아 활성 표시가 그대로 있다 — Playground 위쪽의
 * 실제 탭이 눌러도 반응하지 않는 것처럼 보였다. defaultValue(비제어)로
 * 바꿔 실제로 눌러 바뀌게 하고, state 쪽 옵션 버튼을 눌렀을 때는
 * key={state}로 다시 마운트시켜 그 프리셋이 여전히 미리보기에 반영되게
 * 한다 — Slider의 key={layout}과 같은 이유다.
 */
function renderTabs(options: RenderOptions) {
  const { variant, state } = options
  const v = variant as TabsVariant
  const active = state === 'active'
  const disabled = state === 'disabled'

  return (
    <Tabs key={state} defaultValue={active ? 'primary' : 'secondary'}>
      <TabsList variant={v}>
        <TabsTrigger variant={v} value="primary" disabled={disabled}>
          개요
        </TabsTrigger>
        <TabsTrigger variant={v} value="secondary">
          로그
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Tabs와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다.
 *
 * url-sync 지침에는 예시를 두지 않는다. '탭을 오가면 주소가 바뀐다'는
 * 이 저장소의 라우터 밖에서 일어나는 일이라 실제로 지킬 수 없고,
 * 흉내만 내면 문서가 스스로 어기는 규칙을 지키는 척하게 된다.
 * ------------------------------------------------------------------ */

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'noun-naming':
      return kind === 'do' ? (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요 보기</TabsTrigger>
            <TabsTrigger value="members">멤버 관리</TabsTrigger>
            <TabsTrigger value="settings">설정 변경</TabsTrigger>
          </TabsList>
        </Tabs>
      )

    case 'tab-count-limit':
      return kind === 'do' ? (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
            <TabsTrigger value="billing">결제</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <Tabs defaultValue="a">
          <TabsList>
            {['일반', '멤버', '결제', '보안', '알림', '연동', '로그', '설정'].map((label, i) => (
              <TabsTrigger key={label} value={i === 0 ? 'a' : label}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'detail-sections':
      return (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
            <TabsTrigger value="activity">활동 로그</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">워크스페이스의 이름, 소유자, 생성일을 보입니다.</TabsContent>
          <TabsContent value="members">워크스페이스에 속한 구성원 목록을 보입니다.</TabsContent>
          <TabsContent value="activity">최근 30일의 변경 이력을 보입니다.</TabsContent>
        </Tabs>
      )

    case 'settings-groups':
      return (
        <Tabs defaultValue="general">
          <TabsList variant="enclosed">
            <TabsTrigger variant="enclosed" value="general">
              일반
            </TabsTrigger>
            <TabsTrigger variant="enclosed" value="security">
              보안
            </TabsTrigger>
            <TabsTrigger variant="enclosed" value="notification">
              알림
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">워크스페이스 이름과 기본 언어를 정합니다.</TabsContent>
          <TabsContent value="security">2단계 인증과 접속 기록을 관리합니다.</TabsContent>
          <TabsContent value="notification">이메일과 알림 수신 여부를 정합니다.</TabsContent>
        </Tabs>
      )

    case 'log-types':
      return (
        <Tabs defaultValue="access">
          <TabsList>
            <TabsTrigger value="access">접속 로그</TabsTrigger>
            <TabsTrigger value="payment">결제 로그</TabsTrigger>
            <TabsTrigger value="error">오류 로그</TabsTrigger>
          </TabsList>
        </Tabs>
      )

    case 'period-stats':
      return (
        <Tabs defaultValue="daily">
          <TabsList variant="enclosed">
            <TabsTrigger variant="enclosed" value="daily">
              일간
            </TabsTrigger>
            <TabsTrigger variant="enclosed" value="weekly">
              주간
            </TabsTrigger>
            <TabsTrigger variant="enclosed" value="monthly">
              월간
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">어제 대비 방문자 수를 보입니다.</TabsContent>
          <TabsContent value="weekly">지난주 대비 방문자 수를 보입니다.</TabsContent>
          <TabsContent value="monthly">지난달 대비 방문자 수를 보입니다.</TabsContent>
        </Tabs>
      )

    case 'long-tab-name':
      return (
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">개요</TabsTrigger>
            <TabsTrigger value="b">워크스페이스 청구서와 결제 수단</TabsTrigger>
            <TabsTrigger value="c">설정</TabsTrigger>
          </TabsList>
        </Tabs>
      )

    case 'overflow-tabs':
      return (
        <Bounds className="w-64">
          <Tabs defaultValue="a">
            <TabsList>
              {['일반', '멤버', '결제', '보안', '알림', '연동', '로그', '설정'].map((label, i) => (
                <TabsTrigger key={label} value={i === 0 ? 'a' : label}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Bounds>
      )

    case 'tab-with-badge':
      return (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5">
              멤버
              <Badge variant="info">12</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">개요</TabsTrigger>
              <TabsTrigger value="b">멤버</TabsTrigger>
              <TabsTrigger value="c">설정</TabsTrigger>
            </TabsList>
          </Tabs>
        </Bounds>
      )

    default:
      return null
  }
}

/**
 * Tabs는 목록에 탭이 여럿 있어야 뜻이 성립한다(하나뿐이면 그 하나가
 * 무조건 활성이 되어 '활성 표시'를 보일 수 없다). 무대에는 Tabs
 * 인스턴스 하나에 탭 셋과 패널 하나를 둔다 — 세 번째 탭은 목록이
 * 여럿이라는 맥락을 위해서만 있고 지시선을 받지 않는다.
 */
function AnatomyPreview() {
  return (
    <Tabs value="overview" className="w-64">
      <TabsList data-anatomy="list" variant="line">
        <TabsTrigger
          data-anatomy="tab"
          variant="line"
          value="overview"
          indicatorProps={{ 'data-anatomy': 'active-indicator' }}
        >
          개요
        </TabsTrigger>
        <TabsTrigger variant="line" value="members">
          멤버
        </TabsTrigger>
        <TabsTrigger variant="line" value="settings">
          설정
        </TabsTrigger>
      </TabsList>
      <TabsContent data-anatomy="panel" value="overview">
        워크스페이스의 이름, 소유자, 생성일을 보입니다.
      </TabsContent>
    </Tabs>
  )
}

export function TabsPage() {
  const meta = getComponent('tabs')
  if (!meta) return <Placeholder title="Tabs 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderTabs}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
