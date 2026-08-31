import {
  Check,
  Info,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Trash2,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { Button } from '@/components/ui/button'

const SIZES = [
  { size: 12, where: '배지 안', note: 'text-12 옆에 놓을 때만' },
  { size: 14, where: '보조 텍스트 옆', note: '테이블 셀 설명, 도움말 문장 앞' },
  { size: 16, where: '버튼과 컨트롤', note: '기본값. 정하기 어려우면 16을 쓴다' },
  { size: 20, where: '툴바', note: '라벨 없이 아이콘만 클릭 대상일 때' },
  { size: 24, where: '빈 상태와 안내', note: '화면당 한두 개까지' },
]

const STROKES = [
  { width: 1.5, role: '완화', note: '24 이상에서 선이 굵어 보일 때. 빈 상태 안내 아이콘' },
  { width: 2, role: '기본', note: 'lucide 기본값이자 이 시스템의 기본값. 코드에 적지 않는다' },
  { width: 2.4, role: '강조', note: '12~14에서 선이 흐릴 때. 활성 탭처럼 하나만 도드라져야 할 때' },
]

const MAPPING: { icon: LucideIcon; name: string; meaning: string; where: string }[] = [
  { icon: Plus, name: 'Plus', meaning: '추가', where: "'사용자 추가' 버튼, 빈 상태의 첫 행동" },
  { icon: Search, name: 'Search', meaning: '검색', where: '검색 입력 앞. 결과를 거르는 필터에는 쓰지 않는다' },
  { icon: Trash2, name: 'Trash2', meaning: '삭제', where: '데이터가 사라지는 동작. 화면에서 치우는 것은 삭제가 아니다' },
  { icon: Settings2, name: 'Settings2', meaning: '설정', where: '테이블 열 설정, 화면 설정' },
  { icon: X, name: 'X', meaning: '닫기', where: '다이얼로그·드로어·토스트 닫기, 필터 칩 제거' },
  { icon: MoreHorizontal, name: 'MoreHorizontal', meaning: '더보기', where: '테이블 행 끝의 동작 메뉴' },
  { icon: Check, name: 'Check', meaning: '성공', where: '완료 토스트, 선택된 항목 표시' },
  { icon: TriangleAlert, name: 'TriangleAlert', meaning: '경고', where: '되돌릴 수 없는 동작 확인, 만료 임박' },
  { icon: Info, name: 'Info', meaning: '정보', where: '보조 설명 툴팁, 안내 배너' },
]

export function IconographyPage() {
  return (
    <DocPage
      title="Iconography"
      description="아이콘은 글자를 대신하지 않습니다. 이미 읽은 라벨을 다음에 더 빨리 찾게 해주는 표시입니다. 그래서 같은 뜻에 화면마다 다른 아이콘을 쓰면 읽는 속도가 오히려 느려집니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          아이콘의 크기와 스트로크, 뜻과 아이콘을 짝짓는 규칙을 정합니다. 아이콘 옆에 붙는
          문구의 표기는 Writing에서, 아이콘 주변 여백은 Spacing에서 다룹니다. 새 아이콘을
          고르거나 기존 아이콘의 뜻이 화면마다 다르게 읽힐 때 이 문서를 봅니다.
        </p>
      </DocSection>

      <DocSection title="Size">
        <p className="text-muted-foreground text-16">
          크기는 아이콘이 아니라 옆에 붙는 글자가 정합니다. 아래 다섯 단계 밖의 값은 쓰지 않습니다.
        </p>
        <div className="divide-y rounded-lg border">
          {SIZES.map((item) => (
            <div key={item.size} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
              <code className="text-muted-foreground w-8 shrink-0 text-12">{item.size}</code>
              <div className="flex w-24 shrink-0 items-center justify-start gap-3">
                <Plus size={item.size} aria-hidden />
                <Search size={item.size} aria-hidden />
                <Trash2 size={item.size} aria-hidden />
              </div>
              <span className="text-14 font-medium">{item.where}</span>
              <span className="text-muted-foreground ml-auto text-12">{item.note}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Stroke">
        <p className="text-muted-foreground text-16">
          기본은 2입니다. strokeWidth를 코드에 적었다면 왜 적었는지 한 줄로 말할 수 있어야 하고, 말할 수
          없으면 지웁니다.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {STROKES.map((item) => (
            <div key={item.width} className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="bg-surface-raised grid min-h-20 place-items-center rounded-md">
                <Settings2 size={24} strokeWidth={item.width} aria-hidden />
              </div>
              <div>
                <p className="text-16 font-medium">
                  {item.width} · {item.role}
                </p>
                <p className="text-muted-foreground mt-1 text-12">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Consistency">
        <p className="text-muted-foreground text-16">
          아래 매핑은 고정입니다. 새 화면에서 뜻이 겹치면 새 아이콘을 고르지 말고 이 표에서 찾습니다. 표에
          없는 뜻이 생기면 아이콘부터 고르지 말고 이 표에 한 줄을 먼저 추가합니다.
        </p>
        <div className="divide-y rounded-lg border">
          {MAPPING.map((row) => {
            const Icon = row.icon
            return (
              <div key={row.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4">
                <Icon size={16} className="shrink-0" aria-hidden />
                <span className="w-14 shrink-0 text-14 font-medium">{row.meaning}</span>
                <code className="text-muted-foreground w-36 shrink-0 text-12">{row.name}</code>
                <span className="text-muted-foreground text-12">{row.where}</span>
              </div>
            )
          })}
        </div>
        <p className="text-muted-foreground text-16">
          반대 방향도 고정합니다. X는 닫기이지 삭제가 아니고, Check는 성공이지 '선택할 수 있음'이 아닙니다.
          한 아이콘에 뜻을 둘 이상 얹는 순간 둘 다 흐려집니다.
        </p>
      </DocSection>

      <DocSection title="Accessibility">
        <p className="text-muted-foreground text-16">
          아이콘은 스크린리더에 아무 이름도 주지 않습니다. 둘 중 하나는 반드시 붙습니다 — 아이콘이 유일한
          라벨이면 <code className="text-12">aria-label</code>, 옆에 글자가 있으면{' '}
          <code className="text-12">aria-hidden</code>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="bg-surface-raised grid min-h-20 place-items-center rounded-md">
              <Button size="icon" variant="outline" aria-label="사용자 추가">
                <Plus />
              </Button>
            </div>
            <div>
              <p className="text-16 font-medium">아이콘만 있는 버튼 · aria-label</p>
              <p className="text-muted-foreground mt-1 text-12">
                스크린리더가 '사용자 추가, 버튼'으로 읽습니다. 라벨이 없으면 '버튼'까지만 읽혀 무엇을 하는
                버튼인지 알 수 없습니다. 문구는 툴팁에 쓰는 말과 같게 맞춥니다.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="bg-surface-raised grid min-h-20 place-items-center rounded-md">
              <Button>
                <Plus aria-hidden />
                사용자 추가
              </Button>
            </div>
            <div>
              <p className="text-16 font-medium">라벨 옆 아이콘 · aria-hidden</p>
              <p className="text-muted-foreground mt-1 text-12">
                옆의 글자가 이미 라벨입니다. 아이콘을 숨기지 않으면 같은 말이 두 번 읽힙니다. 장식으로 붙인
                아이콘은 예외 없이 숨깁니다.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '같은 뜻에는 매핑 표의 아이콘을 그대로 쓴다',
            '크기는 12·14·16·20·24 다섯 단계에서 고른다',
            '아이콘 전용 버튼에는 aria-label을, 라벨 옆 아이콘에는 aria-hidden을 붙인다',
            '뜻이 헷갈릴 자리에는 아이콘 대신 글자를 쓴다',
          ]}
          dont={[
            '같은 화면에서 한 뜻에 두 아이콘을 쓰지 않는다',
            '이유 없이 strokeWidth를 바꾸지 않는다',
            '아이콘만으로 삭제 같은 위험한 동작을 표시하지 않는다',
            '아이콘에 색을 넣어 새 뜻을 만들지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
