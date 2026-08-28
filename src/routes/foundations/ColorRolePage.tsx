import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import tokensCss from '@/styles/tokens.css?raw'
import { CopyValue } from '@/components/docs/CopyValue'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { toHex } from '@/lib/color'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'
import { cn } from '@/lib/utils'

const COLOR_NAMES = parseTokenNames(tokensCss, '--color-')

/**
 * 토큰이 어느 갈래에 속하는지 이름만 보고 정한다.
 * 위에서부터 먼저 맞는 곳에서 멈춘다 — 'accent-foreground'는 Emphasis가 아니라 Foreground이므로
 * '-foreground' 검사가 나머지보다 앞에 있어야 한다.
 *
 * Color 페이지도 이 함수로 견본을 묶는다 — 분류 로직이 두 곳에 따로 있으면
 * 같은 토큰을 두고 두 문서가 다른 말을 하게 된다.
 */
export function classify(name: string): string {
  if (name.startsWith('annotation')) return 'doc'
  if (name.endsWith('foreground')) return 'foreground'
  if (/^(border|input|ring)$/.test(name)) return 'line'
  if (/^(destructive|success|warning|info)$/.test(name)) return 'status'
  if (/^(primary|secondary|accent)$/.test(name)) return 'emphasis'
  return 'surface'
}

/** 화면에 보이는 순서. classify의 판단 순서와는 다르다.
 * Color 페이지도 같은 순서로 갈래를 늘어놓는다. */
export const BRANCHES: { id: string; title: string; lead: string }[] = [
  {
    id: 'surface',
    title: 'Surface',
    lead: '무언가를 담는 바닥입니다. 이 갈래끼리는 색조를 바꾸지 않고 밝기 차이만으로 층을 만듭니다. 새 면이 필요하면 새 토큰을 만들기 전에 아래 Hierarchy에서 그 높이를 이미 맡은 토큰이 있는지 봅니다.',
  },
  {
    id: 'foreground',
    title: 'Foreground',
    lead: '면 위에 얹히는 글자와 아이콘입니다. 이름이 배경 이름에 \'-foreground\'를 붙인 형태면 그 배경 위에서 쓰라는 뜻입니다. \'foreground\'는 짝 없이 \'background\' 위에서 쓰는 기본 글자색입니다. \'muted-foreground\'는 이름상 \'muted\'의 짝이지만 \'background\' 위에서 중요도가 낮은 글자에도 씁니다 — 이 하나가 예외이고 나머지는 짝을 지킵니다.',
  },
  {
    id: 'emphasis',
    title: 'Emphasis',
    lead: '사용자가 다음에 할 일을 가리킵니다. 한 화면에서 \'primary\'는 하나입니다. \'secondary\'는 같은 자리에 나란히 놓이는 보조 동작이고, \'accent\'는 hover나 선택처럼 잠깐 도드라지는 배경입니다.',
  },
  {
    id: 'status',
    title: 'Status',
    lead: '시스템이 알리는 결과입니다. 디자이너가 고르는 색이 아니라 사건이 정하는 색이라는 점에서 Emphasis와 다릅니다. 같은 버튼이라도 삭제라는 사건이 붙으면 \'destructive\'가 됩니다.',
  },
  {
    id: 'line',
    title: 'Line',
    lead: '면을 가르고 입력의 범위를 알립니다. \'border\'는 면과 면 사이, \'input\'은 입력 컨트롤의 테두리, \'ring\'은 지금 키보드가 어디에 있는지 알리는 포커스 링입니다.',
  },
  {
    id: 'doc',
    title: 'Doc only',
    lead: '이 문서 사이트에서 주석을 그릴 때만 씁니다. 제품 UI의 어떤 역할도 맡지 않으므로 앞의 갈래들과 나란히 놓고 고르지 않고, 컴포넌트에서는 쓰지 않습니다.',
  },
]

/** 위에서부터 답이 나오는 곳에서 멈춘다 */
const DECISION = [
  '다른 색 위에 올라가는 글자나 아이콘인가 — Foreground',
  '면과 면을 가르는 선이거나 포커스를 알리는 링인가 — Line',
  '시스템이 알리는 결과(성공·경고·안내·위험)를 뜻하는가 — Status',
  '사용자가 다음에 할 일을 가리키는가 — Emphasis',
  '무언가를 담는 바닥인가 — Surface',
]

/** 위에서 아래로 갈수록 바닥에서 멀어진다. 클래스는 Tailwind가 찾을 수 있게 그대로 적는다 */
const LAYERS: { name: string; className: string; note: string }[] = [
  { name: 'background', className: 'bg-background', note: '화면 전체의 바닥' },
  { name: 'surface', className: 'bg-surface', note: '바닥 위에 놓인 카드와 패널' },
  { name: 'surface-raised', className: 'bg-surface-raised', note: '면 안에서 한 단계 더 뜬 영역' },
  { name: 'popover', className: 'bg-popover', note: '흐름 위에 잠깐 떠오르는 면' },
]

const STATUS_MEANING: Record<string, { when: string; not: string }> = {
  success: {
    when: '요청이 끝났고 사용자가 더 할 일이 없습니다. 저장 완료, 승인 완료.',
    not: '좋은 숫자를 돋보이게 하려고 쓰지 않습니다.',
  },
  warning: {
    when: '지금 막지는 않지만 그대로 두면 문제가 됩니다. 만료 임박, 한도 근접.',
    not: '단순히 눈에 띄어야 하는 곳에 쓰지 않습니다.',
  },
  info: {
    when: '사용자의 행동과 무관하게 알아두어야 할 사실입니다. 점검 예정, 새 기능 안내.',
    not: '사용자가 지금 대응해야 하는 일에는 쓰지 않습니다.',
  },
  destructive: {
    when: '되돌릴 수 없는 동작이거나 실패한 요청입니다. 삭제, 권한 회수, 요청 오류.',
    not: '되돌릴 수 있는 동작에는 쓰지 않습니다.',
  },
}

/** 테마가 바뀌면 실측값도 바뀌므로 .dark 클래스 변화를 지켜본다. */
function useMeasuredTokens(names: string[]): TokenRow[] {
  const [rows, setRows] = useState<TokenRow[]>([])

  useEffect(() => {
    const measure = () => setRows(readTokens(names, '--color-'))
    measure()
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [names])

  return rows
}

/** 실측값을 hex로 바꾼 표. toHex는 document를 쓰므로 렌더 중이 아니라 여기서 부른다 */
function useHexMap(rows: TokenRow[]): Record<string, string> {
  const [hexes, setHexes] = useState<Record<string, string>>({})

  useEffect(() => {
    const next: Record<string, string> = {}
    for (const row of rows) next[row.name] = toHex(row.value)
    setHexes(next)
  }, [rows])

  return hexes
}

function TokenChip({ row, hex, partner }: { row: TokenRow; hex: string; partner?: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border p-2">
      <span
        className="mt-0.5 size-6 shrink-0 rounded border"
        style={{ background: `var(${row.cssVar})` }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <CopyValue value={row.name} className="text-12 font-medium" />
        {hex && <CopyValue value={hex} className="text-muted-foreground text-11" />}
        {partner && (
          <p className="text-muted-foreground truncate px-1.5 text-11">짝 {partner}</p>
        )}
      </div>
    </div>
  )
}

function Layer({ index, hexes }: { index: number; hexes: Record<string, string> }) {
  const layer = LAYERS[index]
  if (!layer) return null

  return (
    <div className={cn('rounded-lg border p-3', layer.className)}>
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <code className="text-12 font-medium">{layer.name}</code>
        <span className="text-muted-foreground text-11">{hexes[layer.name]}</span>
        <span className="text-muted-foreground text-11">{layer.note}</span>
      </div>
      <Layer index={index + 1} hexes={hexes} />
    </div>
  )
}

export function ColorRolePage() {
  const rows = useMeasuredTokens(COLOR_NAMES)
  const hexes = useHexMap(rows)
  const names = new Set(rows.map((row) => row.name))

  /* 짝은 이름으로 찾는다 — 배경 이름 뒤에 '-foreground'가 붙은 토큰이 있으면 그것이 짝이다 */
  const pairOf = (name: string) =>
    names.has(`${name}-foreground`) ? `${name}-foreground` : undefined
  const pairs = rows.filter((row) => pairOf(row.name))

  /* Foreground 쪽에서는 반대 방향으로도 찾는다 — 'primary-foreground'의 짝은 'primary'다 */
  const partnerOf = (name: string) => {
    const pair = pairOf(name)
    if (pair) return pair
    const base = name.replace(/-foreground$/, '')
    return base !== name && names.has(base) ? base : undefined
  }

  return (
    <DocPage
      title="Color Role"
      description={`색 토큰을 ${BRANCHES.length}개 갈래로 나누고 갈래 사이의 위계를 정합니다. 어느 색을 쓸지 고민하기 전에, 그 색이 무슨 역할을 맡는지부터 정합니다.`}
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          역할 사이의 위계와 짝 규칙을 정합니다. 개별 색상값의 원본과 시맨틱 토큰이 어느 원시
          값을 가리키는지는{' '}
          <Link to="/foundations/palette" className="underline underline-offset-2">
            Palette
          </Link>
          에서, 역할 이름으로 색을 쓴다는 규칙과 전체 토큰 목록은{' '}
          <Link to="/foundations/color" className="underline underline-offset-2">
            Color
          </Link>
          에서 다룹니다. 새 색이 필요하다고 느낄 때 그것을 어느 갈래에 넣을지, 이미 있는
          토큰으로 대신할 수 있는지 이 문서에서 판단합니다. 아래 값은 지금 적용된 테마에서
          실측한 것입니다.
        </p>
      </DocSection>

      <DocSection title="Branches">
        <p className="text-muted-foreground text-sm">
          새 색을 어느 갈래에 넣을지는 아래 질문을 위에서부터 던져 답이 나오는 곳에서 멈추면
          정해집니다. 순서가 중요합니다 — 삭제 버튼의 글자색은 Status이기 전에 Foreground이고,
          그래서 새 이름을 만들지 않고 이미 있는 짝을 씁니다.
        </p>
        <ol className="flex list-decimal flex-col gap-1 rounded-lg border p-4 pl-8">
          {DECISION.map((line) => (
            <li key={line} className="text-sm">
              {line}
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground text-sm">
          이 절차는 제품 UI에 쓰는 색만 가릅니다. 마지막 갈래인 Doc only는 절차에 걸리지 않는
          예외이고, 이 문서 사이트에서 주석을 그릴 때만 씁니다. 목록에 함께 두는 이유는 그
          토큰이 조용히 사라지지 않게 하기 위해서입니다.
        </p>
        <div className="flex flex-col gap-3">
          {BRANCHES.map((branch) => {
            const members = rows.filter((row) => classify(row.name) === branch.id)
            return (
              <div key={branch.id} className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{branch.title}</p>
                <p className="text-muted-foreground mt-1.5 text-sm">{branch.lead}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {members.map((row) => (
                    <TokenChip
                      key={row.cssVar}
                      row={row}
                      hex={hexes[row.name] ?? ''}
                      partner={partnerOf(row.name)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </DocSection>

      <DocSection title="Hierarchy">
        <p className="text-muted-foreground text-sm">
          표면은 바닥에서 위로 네 층입니다. 층이 올라갈수록 바닥에서 멀어지고, 같은 높이에
          값이 둘이면 층이 무너집니다. 새 면을 만들 때는 새 토큰을 만들기 전에 이 순서에서
          자기 높이를 찾습니다. <code>card</code>는 <code>surface</code>와 같은 높이에 있으면서
          짝이 되는 전경을 따로 가진 이름입니다.
        </p>
        <div className="rounded-lg border p-3">
          <Layer index={0} hexes={hexes} />
        </div>
        <p className="text-muted-foreground text-sm">
          위 상자는 실제 토큰으로 칠한 것이라 지금 테마의 층 차이를 그대로 보여줍니다. 라이트에서는
          네 층의 hex가 같아 선으로만 갈리고, 다크로 바꾸면 밝기로 갈립니다. 라이트에서 층을 색으로
          구분해야 한다면 면을 더 밝히는 대신 선과 그림자로 나눕니다.
        </p>
      </DocSection>

      <DocSection title="Pairing">
        <p className="text-muted-foreground text-sm">
          배경 토큰을 쓰면 글자색은 그 배경의 짝을 씁니다. 짝은 이름으로 찾습니다 —
          배경 이름 뒤에 <code>-foreground</code>를 붙인 토큰이 있으면 그것이 짝입니다.
          아래 목록은 지금 정의된 토큰 이름에서 그렇게 찾아낸 것입니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted-foreground text-11 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">Background</th>
                <th scope="col" className="px-3 py-2 font-bold">Foreground</th>
                <th scope="col" className="px-3 py-2 font-bold">Background HEX</th>
                <th scope="col" className="px-3 py-2 font-bold">Foreground HEX</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((row) => {
                const pair = pairOf(row.name)!
                return (
                  <tr key={row.cssVar}>
                    <th scope="row" className="border-t px-3 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-4 shrink-0 rounded-sm border"
                          style={{ background: `var(${row.cssVar})` }}
                          aria-hidden
                        />
                        {row.name}
                      </span>
                    </th>
                    <td className="text-muted-foreground border-t px-3 py-2">{pair}</td>
                    <td className="text-muted-foreground border-t px-1.5 py-1">
                      {hexes[row.name] && <CopyValue value={hexes[row.name]} className="text-11" />}
                    </td>
                    <td className="text-muted-foreground border-t px-1.5 py-1">
                      {hexes[pair] && <CopyValue value={hexes[pair]} className="text-11" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm">
          짝을 어기면 대비가 무너집니다. 아래 두 예시의 배경은 같고 글자색만 다릅니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <ExampleFrame kind="do">
            <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm">
              변경 사항 저장
            </div>
            <p className="text-muted-foreground mt-2 text-12">
              bg-primary 위에 text-primary-foreground
            </p>
          </ExampleFrame>
          <ExampleFrame kind="dont">
            <div className="bg-primary text-muted-foreground rounded-md px-3 py-2 text-sm">
              변경 사항 저장
            </div>
            <p className="text-muted-foreground mt-2 text-12">
              bg-primary 위에 text-muted-foreground
            </p>
          </ExampleFrame>
        </div>
        <p className="text-muted-foreground text-sm">
          <code>muted-foreground</code>는 <code>background</code> 위에서 대비를 맞춘 색이라
          다른 배경 위로 옮기면 그 대비가 그대로 따라오지 않습니다. 배경을 바꾸면 글자색도
          함께 바꿉니다.
        </p>
      </DocSection>

      <DocSection title="Status colors">
        <p className="text-muted-foreground text-sm">
          상태 색은 뜻이 정해져 있습니다. 뜻과 다르게 쓰면 그 색이 나올 때마다 사용자가 뜻을
          다시 확인해야 하고, 결국 색을 읽지 않게 됩니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rows
            .filter((row) => classify(row.name) === 'status')
            .map((row) => {
              const meaning = STATUS_MEANING[row.name]
              return (
                <div key={row.cssVar} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-5 shrink-0 rounded border"
                      style={{ background: `var(${row.cssVar})` }}
                      aria-hidden
                    />
                    <code className="text-12 font-medium">{row.name}</code>
                    <span className="text-muted-foreground text-11">{hexes[row.name]}</span>
                  </div>
                  {meaning && (
                    <>
                      <p className="text-muted-foreground mt-2.5 text-sm">{meaning.when}</p>
                      <p className="text-muted-foreground mt-1.5 text-12">{meaning.not}</p>
                    </>
                  )}
                </div>
              )
            })}
        </div>
        <p className="text-muted-foreground text-sm">
          상태 색을 장식으로 쓰지 않습니다. 숫자를 돋보이게 하려고 <code>success</code>를 얹으면
          그 숫자가 성공을 뜻하는 것으로 읽힙니다. 색이 뜻을 잃으면 진짜 성공을 알려야 할 때
          아무도 알아채지 못합니다. 상태는 색만으로 알리지 않고 문장이나 아이콘을 함께 둡니다.
        </p>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '배경 토큰을 쓰면 그 짝이 되는 Foreground를 함께 쓴다',
            '새 면은 Hierarchy에서 자기 높이를 먼저 찾는다',
            '상태 색은 사건이 그 뜻을 정할 때만 쓴다',
            '한 화면의 주 동작은 primary 하나로 유지한다',
          ]}
          dont={[
            '배경과 Foreground를 다른 짝에서 가져와 섞지 않는다',
            '이미 층이 있는 높이에 새 Surface 토큰을 만들지 않는다',
            'success나 warning을 장식으로 쓰지 않는다',
            'annotation을 제품 UI에 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
