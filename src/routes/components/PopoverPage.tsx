import type { ReactNode } from 'react'
import { CalendarDays, Info, Search } from 'lucide-react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/** 여러 예시가 공유하는 상태 필터 선택지 */
const STATUS_OPTIONS = [
  { id: 'active', label: '활성' },
  { id: 'suspended', label: '정지' },
  { id: 'withdrawn', label: '탈퇴' },
]

/** Playground 전용(Properties는 축이 없어 비어 있다) — 트리거를 눌러 여는 인스턴스 하나 */
function renderPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          필터
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1 pb-3">
          <p className="text-sm font-medium">상태로 거르기</p>
          <p className="text-muted-foreground text-xs">조건에 맞는 항목만 남깁니다</p>
        </div>
        <div className="flex flex-col gap-2 pb-3">
          {STATUS_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked={option.id === 'active'} />
              {option.label}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            초기화
          </Button>
          <Button size="sm">적용</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'dialog-vs-popover':
      return kind === 'do' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              필터
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              활성 사용자만
            </label>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive" size="sm">
              사용자 삭제
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">'홍길동'을 삭제하시겠습니까</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  취소
                </Button>
                <Button variant="destructive" size="sm">
                  삭제
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'tooltip-vs-popover':
      return kind === 'do' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="정보">
              <Info aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <p className="text-sm">전환율은 방문자 중 결제까지 이어진 비율입니다</p>
              <Button variant="link" size="sm" className="h-auto justify-start px-0">
                자세히 보기
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="정보">
              <Info aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <p className="text-sm">전환율은 방문자 중 결제까지 이어진 비율입니다</p>
          </PopoverContent>
        </Popover>
      )

    case 'no-nested-popover':
      return kind === 'do' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              공유
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">링크로 공유</p>
              <Input readOnly value="https://admin.example.com/s/8f2c" />
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              공유
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">링크로 공유</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    권한 설정
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <p className="text-sm">읽기 전용</p>
                </PopoverContent>
              </Popover>
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'edge-reposition':
      return kind === 'do' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              더보기
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">화면 안에서 자리를 스스로 찾습니다</PopoverContent>
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              더보기
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" side="right" avoidCollisions={false}>
            자리를 고정값으로 강제하면 가장자리에서 잘립니다
          </PopoverContent>
        </Popover>
      )

    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'filter-group':
      return (
        <div className="bg-surface flex items-center gap-2 rounded-md border p-2">
          <span className="text-muted-foreground text-xs">상태</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                상태
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2 pb-3">
                {STATUS_OPTIONS.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm">
                    <Checkbox defaultChecked={option.id === 'active'} />
                    {option.label}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  초기화
                </Button>
                <Button size="sm">적용</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )

    case 'date-picker':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarDays aria-hidden />
              2026-08-26
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex flex-col gap-1">
              {['오늘', '어제', '지난 7일', '이번 달'].map((label) => (
                <Button key={label} variant="ghost" size="sm" className="justify-start">
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'item-search':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              담당자 배정
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search
                  aria-hidden
                  size={14}
                  className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
                />
                <Input placeholder="이름으로 찾기" className="pl-7" />
              </div>
              <div className="flex flex-col">
                {['홍길동', '김철수', '이영희'].map((name) => (
                  <Button key={name} variant="ghost" size="sm" className="justify-start">
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'short-description-with-link':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="전환율 설명">
              <Info aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <p className="text-sm">전환율은 방문자 중 결제까지 이어진 비율입니다</p>
              <Button variant="link" size="sm" className="h-auto justify-start px-0">
                도움말 문서 보기
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'screen-edge':
      return (
        <Bounds className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                더보기
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-48">
              자리가 없으면 반대쪽으로 뒤집힙니다
            </PopoverContent>
          </Popover>
        </Bounds>
      )

    case 'long-content':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              변경 이력
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-h-48 w-56 overflow-y-auto">
            <ul className="flex flex-col gap-2 text-sm">
              {Array.from({ length: 8 }, (_, i) => (
                <li key={i} className="border-b pb-2 last:border-0">
                  <p>상태가 '활성'으로 바뀜</p>
                  <p className="text-muted-foreground text-xs">2026-08-{String(20 - i).padStart(2, '0')}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )

    case 'with-form':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              메모 추가
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pop-memo" className="text-sm font-medium">
                  메모
                </label>
                <Input id="pop-memo" placeholder="내용을 입력하세요" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  취소
                </Button>
                <Button size="sm">저장</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-40">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                담당자 배정
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">좁은 화면에서도 collisionPadding만큼 여백이 남습니다</PopoverContent>
          </Popover>
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * Content는 Portal로 document.body에 렌더링되어 Anatomy 무대(stage)
 * 안의 DOM이 아니다 — stage.querySelector가 찾지 못해 지시선을 그릴
 * 수 없다. Dialog·Tooltip·Dropdown Menu와 같은 이유로 부위는 Trigger
 * 하나뿐이라, 열어 둔들 진단할 것이 더 늘지 않는다. Select가 실제로
 * 클릭해서 열어 보게 한 것과 같은 인스턴스 하나를 그대로 둔다 —
 * 강제로 열지 않는다.
 */
function AnatomyPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button data-anatomy="trigger" variant="outline" size="sm">
          필터
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1 pb-3">
          <p className="text-sm font-medium">상태로 거르기</p>
          <p className="text-muted-foreground text-xs">조건에 맞는 항목만 남깁니다</p>
        </div>
        <div className="flex flex-col gap-2 pb-3">
          {STATUS_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked={option.id === 'active'} />
              {option.label}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            초기화
          </Button>
          <Button size="sm">적용</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function PopoverPage() {
  const meta = getComponent('popover')
  if (!meta) return <Placeholder title="Popover 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderPopover}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
