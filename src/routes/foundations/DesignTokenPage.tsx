import { useEffect, useState } from 'react'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { TokenTable } from '@/components/docs/TokenTable'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'

/**
 * 접두사별 토큰 묶음. 이름은 tokens.css에서 파싱하고 값은 실측하므로
 * 토큰을 더하거나 지우면 아래 표가 저절로 따라온다.
 */
type TokenGroup = {
  prefix: string
  /** 이 접두사가 무엇을 담는지 한 줄 */
  note: string
  /** 표를 읽을 때 오해할 만한 점이 있으면 덧붙인다 */
  caution?: string
  names: string[]
}

const GROUPS: TokenGroup[] = [
  {
    prefix: '--color-',
    note: '배경, 글자, 선, 상태의 역할별 색입니다. 라이트와 다크가 같은 이름을 쓰고 값만 다릅니다.',
    caution: '이름에 annotation이 들어간 토큰은 이 문서 사이트의 주석 전용입니다. 표에 함께 나오지만 제품 UI에는 쓰지 않습니다.',
    names: parseTokenNames(tokensCss, '--color-'),
  },
  {
    prefix: '--radius-',
    note: '모서리 둥글기 단계입니다. 모두 기준값 --radius 하나에서 파생되므로 기준을 바꾸면 함께 움직입니다.',
    names: parseTokenNames(tokensCss, '--radius-'),
  },
  {
    prefix: '--spacing-',
    note: '컨트롤과 테이블 행의 고정 높이입니다. 어드민의 정보 밀도를 이 축 하나에서 통제합니다.',
    names: parseTokenNames(tokensCss, '--spacing-'),
  },
  {
    prefix: '--shadow-',
    note: '떠 있는 면의 그림자입니다. 장식이 아니라 표면이 어느 층에 있는지를 나타내는 데 씁니다.',
    names: parseTokenNames(tokensCss, '--shadow-'),
  },
  {
    prefix: '--z-index-',
    note: '겹치는 요소의 쌓임 순서입니다. 값이 컴포넌트마다 흩어지지 않게 한곳에 모아 둡니다.',
    names: parseTokenNames(tokensCss, '--z-index-'),
  },
  {
    prefix: '--text-',
    note: '글자 크기와 줄 간격입니다. Tailwind 기본 스케일 대신 픽셀 값을 이름으로 쓰는 열두 단계(text-11~text-48)를 전부 새로 정의했고, 크기마다 줄 간격을 하나씩 함께 선언해 아래 표에는 스물네 줄(크기 열둘 + 줄 간격 열둘)이 뜹니다.',
    names: parseTokenNames(tokensCss, '--text-'),
  },
]

const ALL_NAMES = GROUPS.flatMap((group) => group.names)

const LAYERS = [
  {
    step: '1',
    name: '원시값',
    where: ':root와 .dark',
    body: '좌표와 수치가 직접 적히는 유일한 자리입니다. 테마에 따라 달라지는 값은 두 블록에 같은 이름으로 한 벌씩 둡니다.',
  },
  {
    step: '2',
    name: '시맨틱 역할',
    where: '@theme inline',
    body: '1층의 값을 var()로 받아 접두사가 붙은 이름으로 올립니다. 이름이 값이 아니라 쓰임을 말하는 층입니다.',
  },
  {
    step: '3',
    name: '컴포넌트 사용',
    where: '유틸리티 클래스',
    body: '2층 이름에서 만들어진 bg-primary, rounded-md, h-control, z-drawer 같은 클래스만 씁니다.',
  },
]

/**
 * 예로 든 이름이 tokens.css에 실제로 있는지 확인한 규칙만 남긴다.
 * 토큰이 사라지면 규칙 행도 함께 사라져, 없는 이름을 가리키는 일이 없다.
 */
const NAMING_RULES = [
  { shape: '--color-<역할>', meaning: '그 역할의 배경 또는 주색', example: '--color-primary' },
  {
    shape: '--color-<역할>-foreground',
    meaning: '그 배경 위에 놓이는 글자색',
    example: '--color-primary-foreground',
  },
  {
    shape: '--spacing-<축>[-<크기>]',
    meaning: '밀도 축의 고정 높이, 크기 접미사는 선택',
    example: '--spacing-control',
  },
  { shape: '--radius-<크기>', meaning: '모서리 단계', example: '--radius-md' },
  { shape: '--shadow-<용도>', meaning: '그림자 단계', example: '--shadow-card' },
  { shape: '--z-index-<레이어>', meaning: '쌓임 순서', example: '--z-index-drawer' },
  { shape: '--text-<크기>', meaning: '글자 크기', example: '--text-11' },
  {
    /* Tailwind가 정한 짝 이름이다. text-<크기> 유틸리티가 이 이름을 줄 간격으로 읽는다 */
    shape: '--text-<크기>--line-height',
    meaning: '그 크기의 줄 간격',
    example: '--text-16--line-height',
  },
].filter((rule) => ALL_NAMES.includes(rule.example))

/** 테마가 바뀌면 실측값도 바뀌므로 루트의 클래스 변화를 지켜본다. */
function useMeasuredGroups(): TokenRow[][] {
  const [rows, setRows] = useState<TokenRow[][]>(() => GROUPS.map(() => []))

  useEffect(() => {
    const measure = () =>
      setRows(GROUPS.map((group) => readTokens(group.names, group.prefix, tokensCss)))
    measure()
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return rows
}

export function DesignTokenPage() {
  const measured = useMeasuredGroups()

  return (
    <DocPage
      title="Design Token"
      description="토큰은 원시값에서 시작해 역할 이름을 거쳐 유틸리티 클래스로 내려옵니다. 이 문서는 그 층과 이름 규칙, 지금 정의된 토큰 전체를 담습니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          토큰이 어떤 층으로 나뉘고 이름의 각 부분이 무엇을 뜻하는지 정합니다. 개별 색을 무엇으로
          할지는 Color와 Palette에서 다루고, 이 문서는 그 값이 어떤 이름으로 어디에 적히는지만
          다룹니다. 새 토큰을 만들거나 쓸 토큰을 찾을 때 이 문서를 먼저 봅니다.
        </p>
      </DocSection>

      <DocSection title="Layers">
        <div className="divide-y rounded-lg border">
          {LAYERS.map((layer) => (
            <div key={layer.step} className="flex flex-wrap gap-x-4 gap-y-1 p-4 md:flex-nowrap">
              <span className="text-muted-foreground w-6 shrink-0 text-16">{layer.step}</span>
              <span className="w-28 shrink-0 text-16 font-medium">{layer.name}</span>
              <span className="flex-1 text-16">{layer.body}</span>
              <span className="text-muted-foreground w-full text-12 md:w-32 md:shrink-0">
                {layer.where}
              </span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-16">
          컴포넌트가 1층 값이나 임의 수치를 직접 적으면 그 자리만 시스템에서 떨어져 나옵니다. 다크
          테마에서 그 색만 바뀌지 않고, 밀도를 조정할 때 그 높이만 남고, 무엇을 고쳐야 하는지
          찾으려면 파일을 전부 뒤져야 합니다. 컴포넌트가 2층 이름만 쓰면 바꿀 곳이 tokens.css 한
          곳으로 모입니다.
        </p>
        <p className="text-muted-foreground text-16">
          새 토큰을 더할 때는 테마에 따라 값이 달라지는지를 먼저 봅니다. 달라지면{' '}
          <code className="text-12">:root</code>와 <code className="text-12">.dark</code> 양쪽에 값을
          적고 <code className="text-12">@theme inline</code>에서 접두사가 붙은 이름으로 이어줍니다.
          달라지지 않으면 <code className="text-12">@theme inline</code>에 값을 바로 적습니다 — 지금
          간격, 그림자, 쌓임 순서, 글자 크기가 그렇습니다. 어느 쪽이든 컴포넌트가 만지는 것은
          유틸리티 클래스뿐입니다.
        </p>
      </DocSection>

      <DocSection title="Naming">
        <p className="text-muted-foreground text-16">
          이름은 접두사와 역할로 이루어집니다. 접두사가 그 값이 어떤 종류인지를, 뒤에 붙는 낱말이
          어디에 쓰이는지를 말합니다. 값을 가리키는 낱말은 이름에 넣지 않습니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">형태</th>
                <th scope="col" className="px-3 py-2 font-bold">뜻</th>
                <th scope="col" className="px-3 py-2 font-bold">예</th>
              </tr>
            </thead>
            <tbody>
              {NAMING_RULES.map((rule) => (
                <tr key={rule.shape}>
                  <th scope="row" className="border-t px-3 py-2 font-medium whitespace-nowrap">
                    <code className="text-12">{rule.shape}</code>
                  </th>
                  <td className="border-t px-3 py-2">{rule.meaning}</td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    <code className="text-12">{rule.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-16">
          짝 규칙이 하나 있습니다. 배경으로 쓰는 색 토큰에는 같은 이름에{' '}
          <code className="text-12">-foreground</code>를 붙인 짝이 있고, 그 배경을 쓰면 글자색은 반드시
          그 짝을 씁니다 — <code className="text-12">bg-primary</code> 위의 글자는{' '}
          <code className="text-12">text-primary-foreground</code>입니다. 짝을 지키면 라이트와 다크
          어느 쪽에서도 글자가 배경에 묻히지 않습니다.
        </p>
      </DocSection>

      <DocSection title="All tokens">
        <p className="text-muted-foreground text-16">
          아래 목록은 tokens.css를 읽어 만들고, 값은 지금 적용된 테마에서 실측한 것입니다. 테마를
          바꾸면 색 값도 함께 바뀝니다. 값이나 변수 이름에 마우스를 올린 뒤 누르면 복사됩니다.
        </p>
        {GROUPS.map((group, index) => (
          <div key={group.prefix} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-16 font-medium">
                <code>{group.prefix}</code>
              </h3>
              <span className="text-muted-foreground text-12">{group.names.length}개</span>
            </div>
            <p className="text-muted-foreground text-12">{group.note}</p>
            {group.caution && <p className="text-annotation text-12">{group.caution}</p>}
            <TokenTable rows={measured[index]} />
          </div>
        ))}
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '컴포넌트에서는 역할 이름에서 나온 유틸리티만 쓴다',
            '배경 토큰을 쓰면 짝이 되는 -foreground를 글자색으로 쓴다',
            '테마에 따라 달라지는 값은 라이트와 다크에 같은 이름으로 한 벌씩 둔다',
            '새 토큰의 이름은 위 Naming의 형태에 맞춰 짓는다',
          ]}
          dont={[
            '컴포넌트에 색·간격·모서리 값을 직접 적지 않는다',
            '역할이 아니라 값을 가리키는 이름을 만들지 않는다',
            '한 토큰의 값을 특정 화면에서만 다르게 덮어쓰지 않는다',
            '문서 주석 전용 토큰을 제품 UI에 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
