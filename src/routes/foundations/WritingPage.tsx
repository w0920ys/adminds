import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { CopyPairs, type CopyExample } from '@/components/docs/CopyPair'

const BUTTON_EXAMPLES: CopyExample[] = [
  {
    situation: '삭제 확인 다이얼로그',
    dont: '확인 / 취소',
    do: '삭제 / 취소',
    why: '버튼만 보고 누르는 사람이 많습니다. 라벨이 결과를 말하면 제목을 다시 읽지 않아도 됩니다.',
  },
  {
    situation: '초대 다이얼로그',
    dont: '예 / 아니오',
    do: '초대 보내기 / 취소',
    why: '예와 아니오는 질문 문장이 있어야 뜻이 생깁니다. 행동 이름은 혼자서도 뜻이 통합니다.',
  },
  {
    situation: '설정 화면 하단',
    dont: '제출',
    do: '변경 사항 저장',
    why: '어디로 무엇이 가는지 알 수 없는 낱말입니다. 저장인지 발행인지 라벨이 말해야 합니다.',
  },
]

const FORM_EXAMPLES: CopyExample[] = [
  {
    situation: '폼 라벨',
    dont: '이메일을 입력해 주세요',
    do: '이메일',
    why: '라벨은 명사입니다. 요청은 도움말과 오류 메시지가 합니다.',
  },
  {
    situation: '도움말',
    dont: '올바른 값을 입력하세요',
    do: '영문 소문자, 숫자, 하이픈만 씁니다. 만든 뒤에는 바꿀 수 없습니다.',
    why: '도움말은 입력하기 전에 알아야 할 것만 적습니다. 입력한 뒤에 알려줄 것은 오류 메시지의 몫입니다.',
  },
  {
    situation: 'placeholder',
    dont: "라벨 없이 placeholder에 '이름'",
    do: "라벨은 '이름', placeholder는 '홍길동'",
    why: 'placeholder는 입력을 시작하면 사라집니다. 라벨을 대신할 수 없고, 형식 규칙도 담을 수 없습니다.',
  },
]

const ERROR_EXAMPLES: CopyExample[] = [
  {
    situation: '입력 형식 오류',
    dont: 'ValidationError: email is invalid',
    do: '이메일 형식이 아닙니다. example@company.com 형태로 입력하세요.',
    why: '예외 이름은 사용자가 할 수 있는 일을 알려주지 않습니다. 고칠 방법을 예시 형태로 보여줍니다.',
  },
  {
    situation: '요청 실패',
    dont: '요청 시간이 초과되었습니다. (TimeoutError)',
    do: '서버 응답이 늦어 저장하지 못했습니다. 다시 시도하세요. 계속 실패하면 요청 ID 8f2c1a를 전달하세요.',
    why: '코드를 숨기라는 뜻은 아닙니다. 문장으로 상황을 말한 뒤, 지원에 필요한 식별자만 뒤에 붙입니다.',
  },
]

const EMPTY_EXAMPLES: CopyExample[] = [
  {
    situation: '첫 진입',
    dont: '데이터가 없습니다',
    do: '아직 만든 API 키가 없습니다. 키를 만들면 이 목록에 표시됩니다. [API 키 만들기]',
    why: '빈 상태는 없다는 사실, 채우는 방법, 버튼 하나로 세 줄을 채웁니다. 버튼을 둘 이상 두지 않습니다.',
  },
  {
    situation: '검색 결과 0건',
    dont: '결과 없음',
    do: "'홍길동'과 일치하는 사용자가 없습니다. 철자를 확인하거나 필터를 지우세요. [필터 지우기]",
    why: '검색 결과가 빈 것은 데이터가 없는 것과 다릅니다. 만들기 버튼이 아니라 조건을 되돌리는 버튼을 둡니다.',
  },
]

const NOTATION = [
  { item: '문체', rule: '~합니다체. 행동을 요청할 때만 ~하세요', avoid: '~해 주세요, ~하십시오, ~해요' },
  { item: '숫자', rule: '아라비아 숫자, 천 단위 쉼표 — 12,400', avoid: '1.2만, 일만 이천' },
  { item: '단위', rule: '숫자에 붙여 쓴다 — 12MB, 3초, 45%, 3명', avoid: '12 MB, 3 명' },
  { item: '날짜', rule: 'YYYY-MM-DD — 2026-08-25', avoid: '2026년 8월 25일, 08/25/26' },
  { item: '시각', rule: '24시간제 — 2026-08-25 14:30. 초는 로그에만', avoid: '오후 2시 30분' },
  { item: '상대 시간', rule: '1시간 안쪽만 3분 전. 그보다 오래됐으면 절대 시각', avoid: '3일 전, 지난주' },
  { item: '기간', rule: '물결 앞뒤로 공백 — 2026-08-01 ~ 2026-08-25', avoid: '2026-08-01~2026-08-25' },
  { item: '마침표', rule: '완전한 문장에만. 라벨·버튼·표 셀·제목에는 찍지 않는다', avoid: '저장.' },
  { item: '느낌표', rule: '쓰지 않는다', avoid: '저장했습니다!' },
  {
    item: '물음표',
    rule: "쓰지 않는다. 확인 다이얼로그 제목은 명사구로 — '사용자 3명 삭제'",
    avoid: '정말 삭제하시겠습니까?',
  },
  { item: '인용', rule: "사용자가 넣은 값과 항목 이름에 작은따옴표 — '홍길동'", avoid: '"홍길동", 「홍길동」' },
  { item: '말줄임표', rule: '누르면 추가 입력을 받는 창이 열릴 때만 — 내보내기…', avoid: '내보내기...' },
  { item: '영문', rule: '기술 고유명사는 원문 그대로 — API, Webhook, OAuth', avoid: '에이피아이, 웹훅' },
  { item: '필수 표시', rule: '필수가 기본. 선택 항목에만 (선택)을 붙인다', avoid: '필수 라벨마다 별표' },
  { item: '오류', rule: '오류', avoid: '에러' },
  { item: '문서 구조', rule: '영문 — Anatomy, Properties, Guidelines', avoid: '구조, 속성, 지침' },
]

export function WritingPage() {
  return (
    <DocPage
      title="Writing"
      description="화면에 들어가는 문구를 매번 새로 고민하지 않기 위한 규칙입니다. 판단이 갈릴 만한 자리에서는 이 시스템의 표기를 하나로 정해 두었으니, 고민이 생기면 아래 Notation을 먼저 봅니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          버튼 라벨, 오류 메시지 같은 실제 문구의 표기 규칙을 정합니다. 어떤 태도와 톤으로
          말할지는 Voice and Tone에서 다루고, 이 문서는 그 톤을 구체적 문장으로 옮기는 표기만
          다룹니다. 화면에 넣을 문구의 정확한 표현이 궁금할 때 이 문서를 찾습니다.
        </p>
      </DocSection>

      <DocSection title="Button labels">
        <p className="text-muted-foreground text-xs">
          동사로 시작하고 누른 뒤의 결과를 말합니다. 다이얼로그의 확인 버튼은 제목에 쓴 동사와 같은 낱말을
          씁니다. 길이는 두 자에서 여섯 자 사이로 두고, 아이콘 전용 버튼의 aria-label에는 같은 문구를
          넣습니다. 취소는 언제나 '취소'로 고정하되, 아무것도 하지 않고 창만 닫을 때는 '닫기'를 씁니다.
        </p>
        <CopyPairs items={BUTTON_EXAMPLES} />
      </DocSection>

      <DocSection title="Form labels">
        <p className="text-muted-foreground text-xs">
          라벨은 조사 없는 명사입니다. 도움말은 입력 전에 필요한 정보만 담고, 한 줄을 넘기지 않습니다. 어드민
          폼은 대부분 필수이므로 별표를 다는 대신 선택 항목에만 (선택)을 붙입니다.
        </p>
        <CopyPairs items={FORM_EXAMPLES} />
      </DocSection>

      <DocSection title="Error messages">
        <p className="text-muted-foreground text-xs">
          무엇이 잘못됐는지와 어떻게 고치는지를 한 문장씩 씁니다. 필드 오류는 필드 바로 아래에, 요청 오류는
          토스트나 화면 상단 배너에 둡니다. 예외 이름과 스택은 화면에 노출하지 않습니다 — 지원 요청에 필요한
          요청 ID만 문장 뒤에 붙입니다.
        </p>
        <CopyPairs items={ERROR_EXAMPLES} />
      </DocSection>

      <DocSection title="Empty states">
        <p className="text-muted-foreground text-xs">
          제목은 없다는 사실, 설명은 채우는 방법, 버튼은 다음 행동 하나. 이 세 줄 구조를 모든 빈 상태에서
          지킵니다. 검색이나 필터로 비워진 목록에는 만들기 버튼 대신 조건을 되돌리는 버튼을 둡니다.
        </p>
        <CopyPairs items={EMPTY_EXAMPLES} />
      </DocSection>

      <DocSection title="Language">
        <p className="text-muted-foreground text-xs">
          구조를 가리키는 이름은 영문으로, 설명은 한국어로 씁니다.
        </p>
        <ul className="text-muted-foreground flex list-disc flex-col gap-1.5 pl-5 text-xs">
          <li>
            영문으로 두는 것 — 섹션 제목, 페이지 이름, 버튼과 배지 같은 UI 라벨, 속성 이름,
            코드 식별자
          </li>
          <li>한국어로 두는 것 — 설명문, 표 안의 서술, 지침의 규칙 문장</li>
          <li>이미 영문으로 굳은 용어는 그대로 둡니다. 그 용어를 살린 채 나머지를 한국어로 풉니다</li>
        </ul>
      </DocSection>

      <DocSection title="Notation">
        <p className="text-muted-foreground text-xs">
          아래는 이 시스템에서 하나로 정한 표기입니다. 취향 문제로 보이더라도 화면마다 다르게 쓰면 같은
          데이터가 다른 것처럼 보입니다.
        </p>
        <div className="divide-y rounded-lg border">
          <div className="text-muted-foreground bg-surface-raised flex gap-4 px-4 py-2 text-2xs font-bold tracking-widest">
            <span className="w-20 shrink-0">항목</span>
            <span className="flex-1">이 시스템의 표기</span>
            <span className="hidden w-56 shrink-0 md:block">쓰지 않는 표기</span>
          </div>
          {NOTATION.map((row) => (
            <div key={row.item} className="flex flex-wrap gap-x-4 gap-y-1 p-4 md:flex-nowrap">
              <span className="w-20 shrink-0 text-sm font-medium">{row.item}</span>
              <span className="flex-1 text-sm">{row.rule}</span>
              <span className="text-muted-foreground w-full text-xs md:w-56 md:shrink-0">
                {row.avoid}
              </span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '버튼 라벨은 동사로 시작하고 결과를 말한다',
            '라벨은 명사, 도움말은 입력 전에 필요한 정보만 쓴다',
            '오류는 무엇이 잘못됐는지와 고치는 방법을 함께 쓴다',
            '숫자·날짜·단위는 표기 규칙을 그대로 따른다',
          ]}
          dont={[
            "'확인', '제출', '예/아니오'를 버튼 라벨로 쓰지 않는다",
            'placeholder로 라벨을 대신하지 않는다',
            '예외 이름과 스택을 사용자 화면에 노출하지 않는다',
            '한 화면에서 날짜 표기를 두 가지로 섞지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
