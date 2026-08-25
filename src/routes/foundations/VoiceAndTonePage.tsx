import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { CopyPairs, type CopyExample } from '@/components/docs/CopyPair'

const PRINCIPLES = [
  {
    title: '사실을 먼저 말한다',
    body: "무슨 일이 일어났는지를 첫 문장에 둡니다. 사과와 인사는 앞자리를 차지하지 않습니다. '죄송합니다. 요청을 처리하는 중 문제가 발생했습니다'가 아니라 '저장하지 못했습니다'로 시작합니다. 운영 화면에서 첫 줄은 대개 유일하게 읽히는 줄입니다.",
  },
  {
    title: '사용자를 탓하지 않는다',
    body: "주어를 사용자로 두지 않습니다. '잘못된 값을 입력했습니다'는 사람을 가리키고, '이메일 형식이 아닙니다'는 값을 가리킵니다. 같은 사실을 말하지만 뒤쪽만 고칠 곳을 알려줍니다.",
  },
  {
    title: '다음 행동을 알려준다',
    body: '상태만 알리고 끝내지 않습니다. 지금 할 수 있는 일을 한 문장 더 붙입니다. 사용자가 직접 할 수 있는 일이 없다면 누구에게 무엇을 요청해야 하는지 적습니다.',
  },
]

const TONES = [
  { situation: '성공', tone: '담백하게', must: '무엇이 끝났는지. 그것뿐' },
  { situation: '경고', tone: '구체적으로', must: '무엇이 어떻게 되는지, 영향받는 대상과 수' },
  { situation: '오류', tone: '원인과 복구', must: '왜 실패했는지, 다음에 무엇을 하면 되는지' },
  { situation: '빈 상태', tone: '안내하듯', must: '비어 있다는 사실, 채우는 방법 하나' },
  { situation: '위험한 확인', tone: '사무적으로', must: '되돌릴 수 없다는 사실, 영향 범위' },
]

const EXAMPLES: CopyExample[] = [
  {
    situation: '성공 · 저장 토스트',
    dont: '저장이 성공적으로 완료되었습니다!',
    do: '저장했습니다.',
    why: '성공은 사용자가 기대한 결과입니다. 축하할 일이 아니라 확인만 하면 됩니다. 느낌표를 붙이면 다음에 진짜 중요한 알림이 왔을 때 구별되지 않습니다.',
  },
  {
    situation: '경고 · 역할 권한 축소',
    dont: '주의: 설정을 변경하면 문제가 생길 수 있습니다.',
    do: "이 역할에서 '사용자 편집'을 빼면 배정된 12명이 사용자 목록을 열 수 없게 됩니다.",
    why: '위험은 대상과 수로 말해야 판단이 섭니다. 무엇이 어떻게 되는지 적을 수 없다면 경고할 근거도 없는 것입니다.',
  },
  {
    situation: '오류 · 권한 부족',
    dont: '알 수 없는 오류가 발생했습니다.',
    do: "권한이 없어 저장하지 못했습니다. 관리자에게 '사용자 편집' 권한을 요청하세요.",
    why: "'알 수 없는'은 사용자가 아니라 개발자의 사정입니다. 실패 이유를 아는 경우에는 이유를 적고, 사용자가 직접 풀 수 없으면 누구에게 무엇을 요청할지 적습니다.",
  },
  {
    situation: '오류 · 서버 무응답',
    dont: '문제가 발생했습니다. 나중에 다시 시도하세요.',
    do: '서버가 응답하지 않아 사용자 목록을 불러오지 못했습니다. 다시 시도하세요.',
    why: "무엇을 하다 실패했는지를 밝힙니다. '나중에'처럼 시점을 미루는 말 대신 지금 누를 수 있는 다시 시도 버튼을 문장 옆에 둡니다.",
  },
  {
    situation: '빈 상태 · 감사 로그',
    dont: '표시할 항목이 없습니다.',
    do: '최근 30일 안에 기록된 감사 로그가 없습니다. 기간을 넓히면 이전 기록을 볼 수 있습니다.',
    why: '비어 있는 이유는 대개 조건에 있습니다. 조건을 밝히면 사용자가 화면을 의심하는 대신 조건을 바꿉니다.',
  },
  {
    situation: '위험한 확인 · 사용자 삭제',
    dont: '정말 삭제하시겠습니까?',
    do: '사용자 3명을 삭제합니다. 계정과 함께 로그인 기록도 지워지고 되돌릴 수 없습니다.',
    why: "'정말'은 겁만 주고 정보를 주지 않습니다. 몇 개가 사라지는지, 무엇까지 함께 사라지는지, 되돌릴 수 있는지를 적습니다. 제목은 물음표 없이 '사용자 3명 삭제'로 두고 버튼이 질문을 대신합니다.",
  },
]

export function VoiceAndTonePage() {
  return (
    <DocPage
      title="Voice and Tone"
      description="이 어드민은 운영 도구입니다. 사용자는 무언가를 하러 왔고, 문장은 그 일을 방해하지 않는 선에서 필요한 것만 말합니다. 목소리는 어느 화면에서나 같고, 톤만 상황에 따라 조절합니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          이 시스템이 사용자에게 말하는 태도와 상황별 톤의 원칙을 정합니다. 문장 부호나 종결
          어미 같은 실제 표기 규칙은 Writing에서 다룹니다. 새 문구를 쓰기 전에 어떤 태도로
          말할지 정하고 싶을 때 이 문서를 봅니다.
        </p>
      </DocSection>

      <DocSection title="Principles">
        <div className="grid gap-3 md:grid-cols-3">
          {PRINCIPLES.map((principle, index) => (
            <div key={principle.title} className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="bg-primary text-primary-foreground grid size-5 place-items-center rounded-full text-2xs font-bold">
                {index + 1}
              </span>
              <p className="text-sm font-semibold">{principle.title}</p>
              <p className="text-muted-foreground text-xs">{principle.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Tone by situation">
        <div className="divide-y rounded-lg border">
          {TONES.map((row) => (
            <div key={row.situation} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
              <span className="w-20 shrink-0 text-sm font-medium">{row.situation}</span>
              <span className="text-muted-foreground w-24 shrink-0 text-xs">{row.tone}</span>
              <span className="text-sm">{row.must}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          톤이 바뀌어도 문체는 바뀌지 않습니다. 경고라고 문장을 길게 늘이거나 오류라고 사과를 덧붙이지
          않습니다. 표기 규칙은 Writing에 정리해 두었습니다.
        </p>
      </DocSection>

      <DocSection title="Do and Don't">
        <CopyPairs items={EXAMPLES} />
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '무슨 일이 일어났는지를 첫 문장에 쓴다',
            '실패한 이유를 아는 만큼 적는다',
            '문장 끝에 사용자가 지금 할 수 있는 일을 붙인다',
            '위험한 동작에는 영향 범위를 수로 적는다',
          ]}
          dont={[
            "'알 수 없는 오류'로 원인을 덮지 않는다",
            '사과를 문장 맨 앞에 두지 않는다',
            '사용자를 주어로 삼아 잘못을 지목하지 않는다',
            '성공에 느낌표나 축하를 붙이지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
