import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { sections } from '@/components/layout/nav-config'

const NOTES: Record<string, string> = {
  '/foundations/design-token': '토큰의 층과 이름 규칙, 전체 목록',
  '/foundations/color': '역할 기반 시맨틱 색 토큰과 라이트·다크 대응',
  '/foundations/color-role': '역할 사이의 위계와 짝',
  '/foundations/palette': '원시 색 스케일과 시맨틱 연결',
  '/foundations/typography': '크기 스케일과 굵기, 정보 위계',
  '/foundations/spacing': '4px 기반 간격과 어드민 밀도 축',
  '/foundations/iconography': '아이콘 크기·스트로크·사용 규칙',
  '/foundations/state': '상호작용 상태의 표현 규칙',
  '/foundations/voice-and-tone': '어드민이 사용자에게 말하는 방식',
  '/foundations/writing': '라벨·문구·오류 메시지 작성 규칙',
}

export function FoundationsOverview() {
  const section = sections.find((s) => s.id === 'foundations')!
  const pages = section.items.filter((item) => item.to !== section.to)

  return (
    <DocPage
      title="Foundations"
      description="컴포넌트보다 먼저 합의해야 하는 것들입니다. 색·타이포·간격 같은 토큰과, 말투·문구처럼 코드에 담기지 않는 원칙을 함께 다룹니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          Foundations는 컴포넌트가 기대는 바닥입니다. 여기서 정한 색과 간격과 말투가
          모든 컴포넌트에 그대로 실리므로, 컴포넌트를 고치기 전에 이 층을 먼저 봅니다.
        </p>
        <p className="text-muted-foreground text-sm">
          읽는 순서는 위에서 아래입니다. Design Token이 이름 규칙을 정하고, Color와
          Typography와 Spacing과 Iconography가 그 규칙으로 값을 싣고, State가 상호작용의
          표현을 맞추고, Voice and Tone과 Writing이 화면에 나가는 말을 다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          여기서 정하지 않는 것도 있습니다. 개별 컴포넌트의 구조와 속성은 Components에서,
          여러 컴포넌트를 엮는 화면 단위의 규칙은 Patterns에서 다룹니다.
        </p>
      </DocSection>

      <DocSection title="Pages">
        <ul className="grid gap-3 sm:grid-cols-2">
          {pages.map((page) => (
            <li key={page.to} className="h-full">
              <Link
                to={page.to}
                className="hover:bg-accent/50 flex h-full flex-col rounded-lg border p-4"
              >
                <strong className="text-sm">{page.label}</strong>
                <p className="text-muted-foreground mt-1 text-xs">{NOTES[page.to]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  )
}
