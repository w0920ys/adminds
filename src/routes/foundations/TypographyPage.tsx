import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'

const SCALE = [
  { className: 'text-2xs', role: '보조 라벨 · 배지', sample: '컴포넌트 12개' },
  { className: 'text-xs', role: '설명 · 캡션', sample: '전체 사용자와 상태를 관리합니다' },
  { className: 'text-sm', role: '본문 · 컨트롤 라벨', sample: '사용자 관리' },
  { className: 'text-base', role: '강조 본문', sample: '사용자 관리' },
  { className: 'text-lg', role: '섹션 제목', sample: '사용자 관리' },
  { className: 'text-2xl', role: '페이지 제목', sample: '사용자 관리' },
]

const WEIGHTS = [
  { className: 'font-normal', role: '본문' },
  { className: 'font-medium', role: '컨트롤 라벨' },
  { className: 'font-semibold', role: '활성 항목 · 강조' },
  { className: 'font-bold', role: '제목' },
]

export function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      description="어드민은 한 화면에 많은 정보를 담습니다. 크기를 늘리기보다 굵기와 색으로 위계를 만드는 편이 밀도를 지키면서 읽히게 합니다."
    >
      <DocSection title="크기 스케일">
        <div className="divide-y rounded-lg border">
          {SCALE.map((item) => (
            <div key={item.className} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <code className="text-muted-foreground w-24 shrink-0 text-xs">{item.className}</code>
              <span className={item.className}>{item.sample}</span>
              <span className="text-muted-foreground ml-auto text-2xs">{item.role}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="굵기">
        <div className="divide-y rounded-lg border">
          {WEIGHTS.map((item) => (
            <div key={item.className} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <code className="text-muted-foreground w-28 shrink-0 text-xs">{item.className}</code>
              <span className={`text-sm ${item.className}`}>사용자 관리</span>
              <span className="text-muted-foreground ml-auto text-2xs">{item.role}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '위계는 크기보다 굵기와 색으로 만든다',
            '한 화면에서 크기 단계를 4개 이하로 유지한다',
            '숫자 데이터는 정렬을 위해 같은 크기로 맞춘다',
          ]}
          dont={[
            '강조를 위해 크기를 계속 키우지 않는다',
            '스케일에 없는 임의 크기를 만들지 않는다',
            '본문에 font-bold를 남발하지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
