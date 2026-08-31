import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { cn } from '@/lib/utils'

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

/*
 * 위 GRID_PATTERNS과는 대상이 다르다 — 저건 이 문서 사이트 자신의
 * 레이아웃(DoDont, Steps 같은 문서용 UI)이고, 이 상수는 App Shell(설치형
 * ui/app-shell.tsx)로 만든 어드민 화면의 카드 그리드다. spans의 합은
 * 항상 12 — RecipeBar가 그 비율 그대로 막대를 그린다.
 */
const GRID_RECIPES = [
  {
    name: 'Full',
    classes: 'col-span-1 sm:col-span-2 lg:col-span-12',
    spans: [12],
    usage: '표, 긴 카드 — 늘 한 줄 전체',
  },
  {
    name: 'Half',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-6',
    spans: [6, 6],
    usage: '설정 카드 2개처럼 sm부터 2-up',
  },
  {
    name: 'Third',
    classes: 'col-span-1 sm:col-span-2 lg:col-span-4',
    spans: [4, 4, 4],
    usage: '3-up 카드 목록 — lg 전까지 풀와이드로 쌓인다',
  },
  {
    name: 'Quarter',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-3',
    spans: [3, 3, 3, 3],
    usage: '차트·설명이 딸린 요약 카드 — 정보량이 있는 4-up',
  },
  {
    name: 'Sixth',
    classes: 'col-span-1 sm:col-span-1 lg:col-span-2',
    spans: [2, 2, 2, 2, 2, 2],
    usage: '숫자만 있는 저정보량 카드 — KPI 타일처럼 6-up',
  },
  {
    name: 'Two-thirds + One-third',
    classes: 'lg:col-span-8 그리고 lg:col-span-4 (둘 다 col-span-1 sm:col-span-2)',
    spans: [8, 4],
    usage: '차트+도넛처럼 무게가 다른 카드 2개를 짝짓는다',
  },
] as const

/** 12칸 중 recipe가 차지하는 비율을 실제 grid로 그린 막대. 표의 텍스트
 * 설명을 눈으로 한 번 더 확인하는 용도다. */
function RecipeBar({ spans }: { spans: readonly number[] }) {
  return (
    <div className="grid grid-cols-12 gap-1" aria-hidden>
      {spans.map((span, i) => (
        <div
          key={i}
          className={cn('h-6 rounded', i % 2 === 0 ? 'bg-primary/70' : 'bg-primary/35')}
          style={{ gridColumn: `span ${span} / span ${span}` }}
        />
      ))}
    </div>
  )
}

/*
 * md에 별도 단계를 두지 않는 이유(LNB가 이미 224px를 먹는다)를 표만으로
 * 설명하면 와닿지 않는다 — 세 폭을 나란히 그려 콘텐츠 실폭이 얼마나
 * 남는지 눈으로 비교한다. 실제 픽셀로 그리지 않고 비율만 맞춘 정적
 * 도해다(라이브 리사이즈는 이 문서 페이지의 몫이 아니다).
 */
const BREAKPOINT_SCENARIOS = [
  { label: 'Mobile', sub: '<640px · LNB 숨김', frame: 'w-24', lnb: null, cols: 'grid-cols-1', tiles: 1 },
  { label: 'md', sub: '≥768px · LNB 224px', frame: 'w-40', lnb: 'w-8', cols: 'grid-cols-2', tiles: 2 },
  { label: 'lg', sub: '≥1024px · LNB 224px', frame: 'w-64', lnb: 'w-10', cols: 'grid-cols-6', tiles: 6 },
] as const

function BreakpointStrip() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {BREAKPOINT_SCENARIOS.map((s) => (
        <div key={s.label} className="flex flex-col gap-2">
          <div className={cn('bg-surface flex h-20 gap-1 rounded-md border p-1.5', s.frame)}>
            {s.lnb && <div className={cn('bg-foreground/80 shrink-0 rounded-sm', s.lnb)} aria-hidden />}
            <div className={cn('grid flex-1 content-start gap-1', s.cols)} aria-hidden>
              {Array.from({ length: s.tiles }, (_, i) => (
                <div key={i} className="bg-primary/50 h-3 rounded-sm" />
              ))}
            </div>
          </div>
          <div>
            <div className="text-14 font-semibold">{s.label}</div>
            <div className="text-muted-foreground text-12">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

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
                  <th scope="row" className="border-t px-3 py-3 font-medium whitespace-nowrap">
                    <code className="text-12">{bp.prefix}</code>
                  </th>
                  <td className="text-muted-foreground border-t px-3 py-3 whitespace-nowrap">{bp.minWidth}</td>
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

      <DocSection title="Container Grid System">
        <p className="text-muted-foreground text-16">
          위 Grid 패턴은 이 문서 사이트 자신의 레이아웃이었습니다. 이 절은 다릅니다 —{' '}
          <code className="text-12">App Shell</code>(설치형 <code className="text-12">ui/app-shell.tsx</code>)로
          지은 어드민 화면에서 카드를 얼마나 넓게, 몇 개씩 늘어놓을지 정하는 시스템입니다.
          컨테이너 하나 · 그리드 행 하나 · span recipe 여섯 개로 끝납니다.
        </p>

        <p className="text-muted-foreground text-16 font-semibold">페이지 컨테이너</p>
        <div className="rounded-lg border p-4">
          <code className="text-12">{'<div className="flex flex-col gap-10 px-6 py-8">'}</code>
        </div>
        <p className="text-muted-foreground text-16">
          <code className="text-12">px-6</code>(24px)은 <code className="text-12">PageHeader</code>가
          이미 쓰는 값이고, <code className="text-12">gap-10</code>(40px)은 섹션(카드 묶음) 사이 세로
          간격입니다. 최대폭은 두지 않습니다 — 표·차트가 중심인 화면은 넓게 쓸수록 유리합니다.
        </p>

        <p className="text-muted-foreground mt-4 text-16 font-semibold">그리드 행</p>
        <div className="rounded-lg border p-4">
          <code className="text-12">
            {'<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">'}
          </code>
        </div>
        <p className="text-muted-foreground text-16">
          모바일은 1칸, <code className="text-12">sm</code>(640px)은 2칸, <code className="text-12">lg</code>
          (1024px)은 진짜 12칸입니다. <code className="text-12">md</code>(768px)에 별도 단계를 두지
          않는 이유는 <code className="text-12">App Shell</code>의 LNB가 md부터 224px를 항상 고정으로
          가져가기 때문입니다 — 뷰포트가 넓어져도 콘텐츠 실폭은 그만큼 못 늘어납니다:
        </p>
        <BreakpointStrip />

        <p className="text-muted-foreground mt-4 text-16">
          카드마다 아래 여섯 recipe 중 하나를 이름으로 고릅니다. 전부 모바일→sm→lg 세 단계를
          이미 포함한 완성형 클래스이고, 간격은 여섯 개 모두 <code className="text-12">gap-4</code>
          (16px) 하나로 고정입니다 — recipe는 폭(span)만 정합니다.
        </p>
        <div className="divide-y rounded-lg border">
          {GRID_RECIPES.map((recipe) => (
            <div key={recipe.name} className="flex flex-col gap-2 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-16 font-semibold">{recipe.name}</span>
                <span className="text-muted-foreground text-12">lg {recipe.spans.join('+')}/12</span>
              </div>
              <RecipeBar spans={recipe.spans} />
              <code className="text-12">{recipe.classes}</code>
              <span className="text-muted-foreground text-14">{recipe.usage}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-16">
          이 규칙에 안 맞는 특이 케이스(라벨+값 2칸처럼 폭이 고정된 사이드 레이아웃)는 위
          <code className="text-12">grid-cols-[auto_1fr]</code> 패턴을 그대로 씁니다 —
          카드 나열이 아닌 다른 문제라 recipe의 대상이 아닙니다.
        </p>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '반응형은 sm과 md 위주로 설계한다',
            '페이지 콘텐츠 폭은 max-w-6xl을 벗어나지 않는다',
            '카드·예시가 반복되는 목록은 sm:grid-cols-2나 md:grid-cols-2 관례를 따른다',
            'App Shell 화면의 카드 그리드는 페이지 컨테이너 + 그리드 행 + 여섯 recipe 중 하나로 짓는다',
          ]}
          dont={[
            '임의로 새 breakpoint 값을 만든다',
            '임의 값 대괄호 표기([3px] · [#abc])를 쓴다',
            '근거 없이 lg·xl 단계에 새 레이아웃을 얹는다',
            '카드 폭을 계산해서 col-span 숫자를 직접 고른다 — 여섯 recipe 중 하나를 그대로 쓴다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
