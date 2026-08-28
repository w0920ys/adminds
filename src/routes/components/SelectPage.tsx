import type { ComponentProps, ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'
import { cn } from '@/lib/utils'

type SelectSize = ComponentProps<typeof SelectTrigger>['size']

/** 실제 어드민에서 자주 쓰는 상태 필터. 예시 대부분이 이 선택지를 공유한다 */
const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'suspended', label: '정지' },
  { value: 'withdrawn', label: '탈퇴' },
]

function StatusItems() {
  return (
    <>
      {STATUS_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </>
  )
}

function renderSelect(options: RenderOptions) {
  const { size, state, width } = options
  return (
    <Select disabled={state === 'disabled'}>
      <SelectTrigger
        size={size as SelectSize}
        aria-invalid={state === 'invalid' || undefined}
        className={cn(width === 'hug' && 'w-40')}
      >
        <SelectValue placeholder="상태 선택" />
      </SelectTrigger>
      <SelectContent>
        <StatusItems />
      </SelectContent>
    </Select>
  )
}

/* ------------------------------------------------------------------ *
 * 예시 조합
 *
 * 목업 상자를 그리지 않는다. 아래 조각은 모두 실제 Select와 시스템
 * 유틸리티만으로 만든 어드민 화면의 한 조각이다. 토큰이 바뀌면 예시도
 * 따라 바뀌므로 문서가 실제와 어긋나지 않는다.
 * ------------------------------------------------------------------ */

/** 라벨 + 트리거 한 줄. 여러 예시가 이 조합을 공유한다 */
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
    case 'radio-vs-select':
      return kind === 'do' ? (
        <Select defaultValue="recent">
          <SelectTrigger id="pg-radio-do" className="w-40">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최근 가입순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="activity">최근 활동순</SelectItem>
            <SelectItem value="payment">결제액순</SelectItem>
            <SelectItem value="status">상태순</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select defaultValue="male">
          <SelectTrigger id="pg-radio-dont" className="w-40">
            <SelectValue placeholder="성별" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
      )

    case 'placeholder-vs-default':
      return kind === 'do' ? (
        <Select defaultValue="recent">
          <SelectTrigger id="pg-placeholder-do" className="w-40">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최근 가입순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select>
          <SelectTrigger id="pg-placeholder-dont" className="w-40">
            <SelectValue placeholder="최근 가입순" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최근 가입순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
          </SelectContent>
        </Select>
      )

    case 'item-order':
      return kind === 'do' ? (
        <Select defaultValue="low">
          <SelectTrigger id="pg-order-do" className="w-32">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">낮음</SelectItem>
            <SelectItem value="normal">보통</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="urgent">긴급</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select defaultValue="urgent">
          <SelectTrigger id="pg-order-dont" className="w-32">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">긴급</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="normal">보통</SelectItem>
          </SelectContent>
        </Select>
      )

    case 'select-vs-dropdown-menu':
      return kind === 'do' ? (
        <Select defaultValue="active">
          <SelectTrigger id="pg-dropdown-do" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <StatusItems />
          </SelectContent>
        </Select>
      ) : (
        <Select>
          <SelectTrigger id="pg-dropdown-dont" className="w-32">
            <SelectValue placeholder="동작 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="edit">수정</SelectItem>
            <SelectItem value="duplicate">복제</SelectItem>
            <SelectItem value="delete">삭제</SelectItem>
          </SelectContent>
        </Select>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'table-filter':
      return (
        <div className="bg-surface flex items-center gap-2 rounded-md border p-2">
          <span className="text-muted-foreground text-12">상태</span>
          <Select defaultValue="all">
            <SelectTrigger size="sm" aria-label="상태로 필터" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <StatusItems />
            </SelectContent>
          </Select>
        </div>
      )

    case 'form-category':
      return (
        <Field label="분류" htmlFor="ex-category">
          <Select>
            <SelectTrigger id="ex-category" className="w-48">
              <SelectValue placeholder="분류를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notice">공지</SelectItem>
              <SelectItem value="event">이벤트</SelectItem>
              <SelectItem value="news">뉴스</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      )

    case 'page-size':
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-12">페이지당 행 수</span>
          <Select defaultValue="25">
            <SelectTrigger size="sm" aria-label="페이지당 행 수" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case 'status-change':
      return (
        <div className="bg-surface flex h-row-compact items-center gap-3 rounded-md border px-3">
          <span className="flex-1 truncate text-sm">홍길동</span>
          <Select defaultValue="active">
            <SelectTrigger size="sm" aria-label="'홍길동' 상태 변경" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <StatusItems />
            </SelectContent>
          </Select>
        </div>
      )

    case 'many-items':
      return (
        <Select defaultValue="kr">
          <SelectTrigger id="ex-many-items" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            {[
              ['kr', '대한민국'],
              ['jp', '일본'],
              ['cn', '중국'],
              ['us', '미국'],
              ['ca', '캐나다'],
              ['mx', '멕시코'],
              ['br', '브라질'],
              ['gb', '영국'],
              ['fr', '프랑스'],
              ['de', '독일'],
              ['it', '이탈리아'],
              ['es', '스페인'],
              ['nl', '네덜란드'],
              ['se', '스웨덴'],
              ['au', '호주'],
              ['nz', '뉴질랜드'],
              ['in', '인도'],
              ['sg', '싱가포르'],
              ['vn', '베트남'],
              ['th', '태국'],
            ].map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'long-item-text':
      return (
        <Bounds className="w-40">
          <Select defaultValue="b">
            <SelectTrigger id="ex-long-item" className="w-full">
              <SelectValue className="truncate" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="a" className="truncate">
                일반 회원
              </SelectItem>
              <SelectItem value="b" className="truncate">
                워크스페이스 전체 관리 권한을 가진 최고 관리자
              </SelectItem>
            </SelectContent>
          </Select>
        </Bounds>
      )

    case 'single-option':
      return (
        <Select defaultValue="krw">
          <SelectTrigger id="ex-single-option" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="krw">원 (KRW)</SelectItem>
          </SelectContent>
        </Select>
      )

    case 'empty-list':
      return (
        <Select>
          <SelectTrigger id="ex-empty-list" className="w-40">
            <SelectValue placeholder="담당자 선택" />
          </SelectTrigger>
          <SelectContent>
            <p className="text-muted-foreground px-2 py-1.5 text-sm">담당자가 없습니다</p>
          </SelectContent>
        </Select>
      )

    default:
      return null
  }
}

/**
 * Anatomy 무대에는 trigger와 value만 남는다. list·item은 열렸을 때만
 * 존재하는 상태이지 항상 있는 부위가 아니라서 Anatomy에 지시선을 그리지
 * 않는다 — 독자는 실제 컴포넌트처럼 클릭해서 열린 목록을 본다.
 */
function AnatomyPreview() {
  return (
    <div className="relative w-52 self-start">
      <Select defaultValue="active">
        <SelectTrigger data-anatomy="trigger" className="w-52">
          <SelectValue data-anatomy="value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="active">활성</SelectItem>
          <SelectItem value="suspended">정지</SelectItem>
          <SelectItem value="withdrawn">탈퇴</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function SelectPage() {
  const meta = getComponent('select')
  if (!meta) return <Placeholder title="Select 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderSelect}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
