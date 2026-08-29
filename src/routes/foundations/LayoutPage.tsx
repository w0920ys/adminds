import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'

/**
 * Tailwind v4 기본값 그대로다 — 이 저장소는 breakpoint를 커스텀하지
 * 않는다(tokens.css에 --breakpoint-* 없음, tailwind.config 파일 자체가
 * 없음). 표의 순서는 작은 것부터다.
 */
const BREAKPOINTS = [
  { prefix: 'sm', minWidth: '40rem (640px)' },
  { prefix: 'md', minWidth: '48rem (768px)' },
  { prefix: 'lg', minWidth: '64rem (1024px)' },
  { prefix: 'xl', minWidth: '80rem (1280px)' },
  { prefix: '2xl', minWidth: '96rem (1536px)' },
]

const GRID_PATTERNS = [
  {
    pattern: 'sm:grid-cols-2 · md:grid-cols-2',
    usage: '카드·예시가 반복되는 목록',
    example: 'DoDont · ExampleList · PatternsOverview',
  },
  {
    pattern: 'grid-cols-[auto_1fr]',
    usage: '라벨과 값처럼 폭이 다른 두 칸',
    example: 'Steps · Field',
  },
  {
    pattern: 'grid-cols-3',
    usage: '좁게 묶이는 세 칸',
    example: 'Voice and Tone · Iconography',
  },
]

export function LayoutPage() {
  return (
    <DocPage
      title="Layout"
      description="화면이 큰 틀에서 어떻게 나뉘는지 — 반응형 기준점, 콘텐츠 폭, 반복되는 격자 패턴입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          색·타이포·간격처럼 값 하나가 토큰으로 떨어지는 대신, 이 문서는 지금 이 저장소가
          실제로 쓰는 반응형 기준점과 폭, 격자 패턴을 있는 그대로 보입니다. 통일된 grid
          시스템이나 breakpoint 토큰은 아직 없습니다 — 새로 만들지 않고, 지금 화면들이
          실제로 어떻게 나뉘는지부터 정확히 적습니다.
        </p>
      </DocSection>

      <DocSection title="Breakpoints">
        <p className="text-muted-foreground text-16">
          Tailwind v4 기본 다섯 단계를 그대로 씁니다. 이 저장소는 반응형 분기 대부분을{' '}
          <code className="text-12">sm</code>과 <code className="text-12">md</code>에서
          만듭니다 — 예를 들어 GNB의 데스크톱 메뉴와 모바일 메뉴 버튼, LNB 서랍의 2뎁스
          전환이 모두 <code className="text-12">md</code> 기준입니다.{' '}
          <code className="text-12">lg</code>는 드물게 쓰고,{' '}
          <code className="text-12">xl</code>과 <code className="text-12">2xl</code>은
          아직 쓰지 않습니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">PREFIX</th>
                <th scope="col" className="px-3 py-2 font-bold">MIN-WIDTH</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp) => (
                <tr key={bp.prefix}>
                  <th scope="row" className="border-t px-3 py-3 font-medium">
                    <code className="text-12">{bp.prefix}</code>
                  </th>
                  <td className="text-muted-foreground border-t px-3 py-3">{bp.minWidth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Content width">
        <p className="text-muted-foreground text-16">
          페이지 콘텐츠 영역의 폭과 본문 줄 길이는 서로 다른 값을 씁니다. 화면 전체를 쓰는
          콘텐츠 영역은 <code className="text-12">AppShell</code>이 정합니다.
        </p>
        <div className="rounded-lg border p-4">
          <code className="text-12">
            {'<div className="mx-auto flex max-w-6xl gap-10">'}
          </code>
        </div>
        <p className="text-muted-foreground text-16">
          본문+TOC 두 컬럼을 합쳐 <code className="text-12">max-w-6xl</code>(1152px)입니다.
          같은 자리에서 안쪽 여백도 화면 폭에 따라{' '}
          <code className="text-12">px-5 py-8</code> → <code className="text-12">sm:px-8 py-10</code> →{' '}
          <code className="text-12">md:px-10 py-12</code>로 늘어납니다.
        </p>
        <p className="text-muted-foreground text-16">
          반면 문단처럼 줄글을 읽는 자리는 화면 폭과 무관하게 줄 길이 자체가
          가독성을 정합니다. 문서 본문은{' '}
          <code className="text-12">max-w-2xl</code>(672px)로 고정합니다 — 화면이 넓다고
          한 줄이 한없이 길어지면 오히려 읽기 어려워집니다.
        </p>
      </DocSection>

      <DocSection title="Grid">
        <p className="text-muted-foreground text-16">
          통일된 grid 토큰은 없습니다. 대신 이 저장소 곳곳에서 반복되는 패턴 세 가지가
          있습니다.
        </p>
        <div className="divide-y rounded-lg border">
          {GRID_PATTERNS.map((row) => (
            <div key={row.pattern} className="flex flex-col gap-1 p-4">
              <code className="text-12">{row.pattern}</code>
              <span className="text-muted-foreground text-14">{row.usage}</span>
              <span className="text-muted-foreground text-12">{row.example}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-16">
          한 줄짜리 배치는 grid 대신 flex로 충분합니다 — grid는 칸이 둘 이상으로 갈릴 때만
          씁니다.
        </p>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '반응형은 sm과 md 위주로 설계한다',
            '페이지 콘텐츠 폭은 max-w-6xl을 벗어나지 않는다',
            '카드·예시가 반복되는 목록은 sm:grid-cols-2나 md:grid-cols-2 관례를 따른다',
          ]}
          dont={[
            '임의로 새 breakpoint 값을 만든다',
            '임의 값 대괄호 표기([3px] · [#abc])를 쓴다',
            '근거 없이 lg·xl 단계에 새 레이아웃을 얹는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
