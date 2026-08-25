import type { ReactNode } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STATES = [
  {
    name: 'default',
    line: '아무 일도 일어나지 않은 평상시. 나머지 상태는 모두 여기서 벗어난 정도로 읽힌다',
  },
  {
    name: 'hover',
    line: '포인터가 위에 있다. 누를 수 있다는 예고일 뿐 아직 아무것도 일어나지 않았다',
  },
  {
    name: 'focus',
    line: '키보드가 지금 이 요소에 있다. 탭으로 이동하는 사람에게는 이것이 유일한 위치 표시다',
  },
  { name: 'active', line: '누르고 있는 중. 손을 떼면 끝난다' },
  {
    name: 'disabled',
    line: '지금은 쓸 수 없다. 조건이 갖춰지면 다시 쓸 수 있다는 뜻까지 담는다',
  },
  { name: 'loading', line: '요청이 진행 중이고 결과는 아직 없다' },
  { name: 'error', line: '입력이나 요청이 실패했다. 사용자가 고칠 것이 남아 있다' },
]

const DEMOS: { name: string; force?: string; node: ReactNode; note: string }[] = [
  { name: 'default', node: <Button>저장</Button>, note: '나머지를 재는 기준' },
  {
    name: 'hover',
    force: 'state-hover',
    node: <Button>저장</Button>,
    note: '배경이 한 단계 움직인다',
  },
  {
    name: 'focus',
    force: 'state-focus',
    node: <Button>저장</Button>,
    note: '테두리 바깥에 링이 생긴다',
  },
  {
    name: 'active',
    node: <Button>저장</Button>,
    note: '이 시스템은 눌림 효과를 따로 주지 않는다',
  },
  {
    name: 'disabled',
    node: <Button disabled>저장</Button>,
    note: '흐려지고 포인터 이벤트가 사라진다',
  },
  {
    name: 'loading',
    node: (
      <Button disabled>
        <Loader2 className="animate-spin" aria-hidden />
        저장 중
      </Button>
    ),
    note: 'disabled를 함께 걸어 두 번 눌리지 않게 한다',
  },
]

const RULES = [
  {
    title: '포커스는 언제나 보인다',
    body: '포커스 링을 지우는 것은 키보드로 쓰는 사람의 커서를 지우는 일과 같습니다. outline-none만 적고 끝내지 않습니다. 이 시스템의 Button에는 outline-none과 focus-visible:ring-2가 함께 걸려 있습니다 — 마우스로 누를 때는 링이 뜨지 않고 탭으로 옮겨올 때만 뜹니다. 커스텀 컨트롤을 새로 만들 때도 이 조합을 그대로 가져갑니다.',
  },
  {
    title: 'disabled는 이유를 함께 알린다',
    body: '흐리게만 해두면 사용자는 고장으로 읽습니다. 왜 못 쓰는지를 버튼 옆 문장이나 툴팁에 적습니다 — \'권한이 없어 수정할 수 없습니다.\', \'승인 대기 중에는 바꿀 수 없습니다.\' 이유를 한 줄로 적을 수 없다면 disabled로 막지 말고, 눌렀을 때 이유를 말하는 편이 낫습니다.',
  },
  {
    title: 'loading은 중복 실행을 막는다',
    body: '스피너만 돌리고 버튼을 살려두면 같은 요청이 두 번 나갑니다. loading이면 disabled도 함께 겁니다. 라벨은 \'저장\'에서 \'저장 중\'으로 바꾸되 길이를 크게 흔들지 않아 버튼 너비가 튀지 않게 합니다. 목록 전체를 다시 불러오는 동안에는 스피너 하나보다 자리를 지키는 스켈레톤이 낫습니다.',
  },
  {
    title: 'error는 색만으로 표시하지 않는다',
    body: '빨간 테두리 하나로는 색을 구분하지 못하는 사람에게 아무 정보도 주지 못합니다. 테두리·아이콘·문장 셋을 함께 둡니다. 문장은 필드 바로 아래에 두고 aria-describedby로 필드와 묶어, 스크린리더가 필드를 읽을 때 이유까지 읽게 합니다.',
  },
]

export function StatePage() {
  return (
    <DocPage
      title="State"
      description="상태는 컴포넌트마다 다시 정하지 않고 시스템 전체에서 같은 뜻으로 씁니다. 어드민은 같은 버튼을 하루에 수십 번 누르는 화면이라, 상태가 화면마다 다르게 보이면 매번 다시 확인하게 됩니다."
    >
      <DocSection title="상태 목록">
        <div className="divide-y rounded-lg border">
          {STATES.map((state) => (
            <div key={state.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <code className="w-20 shrink-0 text-xs font-medium">{state.name}</code>
              <span className="text-muted-foreground text-sm">{state.line}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="실물 비교">
        <p className="text-muted-foreground text-xs">
          hover와 focus는 실제 입력이 있어야 나타나므로 문서에서는 보이지 않습니다. tokens.css가 hover와
          focus-visible 변형을 .state-hover / .state-focus 컨테이너 안에서도 적용되도록 확장해 두었고, 아래
          카드가 그 클래스를 씁니다. 전시 도구를 시스템 안에 두면 문서에 그린 상태와 실제 스타일이 어긋날
          일이 없습니다. 대신 이 두 클래스는 문서 전시 외의 곳에서는 쓰지 않습니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((demo) => (
            <div key={demo.name} className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-3 text-2xs font-bold tracking-widest">
                {demo.name.toUpperCase()}
              </p>
              <div className={cn('flex min-h-10 items-center', demo.force)}>{demo.node}</div>
              <p className="text-muted-foreground mt-3 text-xs">{demo.note}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          active는 강제 클래스를 두지 않았습니다. 이 시스템은 누르는 순간에 별도 스타일을 주지 않기
          때문입니다 — 어드민은 같은 버튼을 연달아 누르는 화면이라 눌림 효과가 쌓이면 화면이 시끄러워집니다.
          누른 사실은 눌림 효과가 아니라 결과(토스트, 목록 갱신)로 알립니다.
        </p>
      </DocSection>

      <DocSection title="error 전시">
        <p className="text-muted-foreground text-xs">
          error는 버튼이 아니라 입력과 요청에 붙습니다. 버튼을 빨갛게 만드는 대신 실패한 필드와 실패한
          요청에 표시합니다.
        </p>
        <div className="rounded-lg border p-4">
          <div className="flex max-w-sm flex-col gap-1.5">
            <label htmlFor="state-error-demo" className="text-sm font-medium">
              이메일
            </label>
            <input
              id="state-error-demo"
              readOnly
              value="hong@"
              aria-invalid
              aria-describedby="state-error-demo-message"
              className="border-destructive bg-surface h-control rounded-md border px-3 text-sm"
            />
            <p
              id="state-error-demo-message"
              className="text-destructive flex items-start gap-1.5 text-xs"
            >
              <TriangleAlert size={13} className="mt-0.5 shrink-0" aria-hidden />
              이메일 형식이 아닙니다. example@company.com 형태로 입력하세요.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="규칙">
        <div className="flex flex-col gap-3">
          {RULES.map((rule) => (
            <div key={rule.title} className="rounded-lg border p-4">
              <p className="text-sm font-semibold">{rule.title}</p>
              <p className="text-muted-foreground mt-1.5 text-sm">{rule.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '포커스 링을 그대로 둔다',
            'disabled 옆에 못 쓰는 이유를 적는다',
            'loading에는 disabled를 함께 건다',
            'error는 테두리·아이콘·문장을 함께 쓴다',
          ]}
          dont={[
            'outline-none만 적고 대체 표시를 만들지 않는다',
            '이유를 말할 수 없는 곳에 disabled를 걸지 않는다',
            '요청 중에 같은 버튼을 다시 누를 수 있게 두지 않는다',
            '.state-hover / .state-focus를 문서 전시 밖에서 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
