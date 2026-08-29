import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import tokensCss from '@/styles/tokens.css?raw'
import { CopyValue } from '@/components/docs/CopyValue'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { toHex } from '@/lib/color'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'
import { cn } from '@/lib/utils'

const COLOR_NAMES = parseTokenNames(tokensCss, '--color-')

/**
 * Tailwind는 소스에 그대로 등장한 클래스만 생성한다. 동적 조합은 만들어지지 않으므로
 * 클래스 이름을 문자열로 붙이지 않고 전체를 적어 둔다.
 * 색상값은 여기에 적지 않는다 — 아래에서 이 클래스로 칠한 칸을 실측한다.
 */
const PALETTE: { hue: string; note: string; steps: { step: string; className: string }[] }[] = [
  {
    hue: 'neutral',
    note: '면과 글자',
    steps: [
      { step: '50', className: 'bg-neutral-50' },
      { step: '100', className: 'bg-neutral-100' },
      { step: '200', className: 'bg-neutral-200' },
      { step: '300', className: 'bg-neutral-300' },
      { step: '400', className: 'bg-neutral-400' },
      { step: '500', className: 'bg-neutral-500' },
      { step: '600', className: 'bg-neutral-600' },
      { step: '700', className: 'bg-neutral-700' },
      { step: '800', className: 'bg-neutral-800' },
      { step: '900', className: 'bg-neutral-900' },
      { step: '950', className: 'bg-neutral-950' },
    ],
  },
  {
    hue: 'red',
    note: '위험',
    steps: [
      { step: '50', className: 'bg-red-50' },
      { step: '100', className: 'bg-red-100' },
      { step: '200', className: 'bg-red-200' },
      { step: '300', className: 'bg-red-300' },
      { step: '400', className: 'bg-red-400' },
      { step: '500', className: 'bg-red-500' },
      { step: '600', className: 'bg-red-600' },
      { step: '700', className: 'bg-red-700' },
      { step: '800', className: 'bg-red-800' },
      { step: '900', className: 'bg-red-900' },
      { step: '950', className: 'bg-red-950' },
    ],
  },
  {
    hue: 'amber',
    note: '경고',
    steps: [
      { step: '50', className: 'bg-amber-50' },
      { step: '100', className: 'bg-amber-100' },
      { step: '200', className: 'bg-amber-200' },
      { step: '300', className: 'bg-amber-300' },
      { step: '400', className: 'bg-amber-400' },
      { step: '500', className: 'bg-amber-500' },
      { step: '600', className: 'bg-amber-600' },
      { step: '700', className: 'bg-amber-700' },
      { step: '800', className: 'bg-amber-800' },
      { step: '900', className: 'bg-amber-900' },
      { step: '950', className: 'bg-amber-950' },
    ],
  },
  {
    hue: 'emerald',
    note: '성공',
    steps: [
      { step: '50', className: 'bg-emerald-50' },
      { step: '100', className: 'bg-emerald-100' },
      { step: '200', className: 'bg-emerald-200' },
      { step: '300', className: 'bg-emerald-300' },
      { step: '400', className: 'bg-emerald-400' },
      { step: '500', className: 'bg-emerald-500' },
      { step: '600', className: 'bg-emerald-600' },
      { step: '700', className: 'bg-emerald-700' },
      { step: '800', className: 'bg-emerald-800' },
      { step: '900', className: 'bg-emerald-900' },
      { step: '950', className: 'bg-emerald-950' },
    ],
  },
  {
    hue: 'blue',
    note: '안내',
    steps: [
      { step: '50', className: 'bg-blue-50' },
      { step: '100', className: 'bg-blue-100' },
      { step: '200', className: 'bg-blue-200' },
      { step: '300', className: 'bg-blue-300' },
      { step: '400', className: 'bg-blue-400' },
      { step: '500', className: 'bg-blue-500' },
      { step: '600', className: 'bg-blue-600' },
      { step: '700', className: 'bg-blue-700' },
      { step: '800', className: 'bg-blue-800' },
      { step: '900', className: 'bg-blue-900' },
      { step: '950', className: 'bg-blue-950' },
    ],
  },
]

/** 단계 목록은 팔레트에서 그대로 가져온다 */
const STEPS = PALETTE[0].steps.map((entry) => entry.step)

/** '#rrggbb'를 채널 셋으로 되돌린다. 형식이 아니면 null */
function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) return null
  const n = Number.parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** 두 색의 RGB 거리. 0이면 같은 색이다 */
function distance(a: string, b: string): number | null {
  const left = hexToRgb(a)
  const right = hexToRgb(b)
  if (!left || !right) return null
  const [dr, dg, db] = [left[0] - right[0], left[1] - right[1], left[2] - right[2]]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * 실측 hex끼리 비교해 가장 가까운 원시 색을 찾는다.
 * 이 계산은 이 페이지에서만 쓰므로 lib에 두지 않는다.
 */
function nearest(
  hex: string,
  palette: Record<string, string>,
): { key: string; hex: string; gap: number } | null {
  let best: { key: string; hex: string; gap: number } | null = null
  for (const [key, value] of Object.entries(palette)) {
    const gap = distance(hex, value)
    if (gap === null) continue
    if (!best || gap < best.gap) best = { key, hex: value, gap }
  }
  return best
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

export function PalettePage() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [paletteHex, setPaletteHex] = useState<Record<string, string>>({})
  const rows = useMeasuredTokens(COLOR_NAMES)
  const [tokenHex, setTokenHex] = useState<Record<string, string>>({})

  /* 원시 색은 팔레트 클래스로 칠한 칸에서 읽는다. 테마와 무관하므로 한 번만 잰다 */
  useEffect(() => {
    const root = gridRef.current
    if (!root) return
    const next: Record<string, string> = {}
    for (const cell of root.querySelectorAll<HTMLElement>('[data-swatch]')) {
      const key = cell.dataset.swatch
      if (!key) continue
      next[key] = toHex(getComputedStyle(cell).backgroundColor)
    }
    setPaletteHex(next)
  }, [])

  /* toHex는 document를 쓰므로 렌더 중이 아니라 여기서 부른다 */
  useEffect(() => {
    const next: Record<string, string> = {}
    for (const row of rows) next[row.name] = toHex(row.value)
    setTokenHex(next)
  }, [rows])

  return (
    <DocPage
      title="Palette"
      description="시맨틱 토큰이 가리키는 원시 색의 원본입니다. Tailwind v4의 기본 팔레트에서 이 시스템이 쓰는 색상만 골라 단계별로 늘어놓았습니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          개별 색상값이 어디서 왔는지 확인하는 곳입니다. 여기 있는 색은 원시 값이고 역할이
          없습니다. 컴포넌트는 이 값을 직접 쓰지 않고 시맨틱 토큰을 거칩니다 — 원시 값을 화면에
          직접 적으면 라이트·다크 전환과 브랜드 교체가 그 자리에서 멈춥니다. 역할 이름으로 색을
          쓰는 규칙은{' '}
          <Link to="/foundations/color" className="underline underline-offset-2">
            Color
          </Link>
          에서, 역할 사이의 위계는{' '}
          <Link to="/foundations/color-role" className="underline underline-offset-2">
            Color Role
          </Link>
          에서 다룹니다.
        </p>
        <p className="text-muted-foreground text-16">
          색상은 다섯 갈래입니다. <code>neutral</code>은 면과 글자 전체를 맡고, 나머지 넷은 상태
          토큰이 뜻하는 것과 하나씩 짝을 이룹니다 — <code>red</code>는 위험, <code>amber</code>는
          경고, <code>emerald</code>는 성공, <code>blue</code>는 안내입니다. 갈래를 늘리면 늘어난
          색이 무슨 뜻인지부터 정해야 하므로, 새 색상은 새 뜻이 생길 때만 추가합니다.
        </p>
      </DocSection>

      <DocSection title="Scale">
        <p className="text-muted-foreground text-16">
          세로는 단계, 가로는 색상입니다. 단계는 밝기 계층이고 숫자가 커질수록 어두워집니다.
          같은 단계끼리는 밝기가 비슷해 색상을 바꿔 놓아도 화면의 명암 구조가 흔들리지 않습니다.
          아래 hex는 팔레트 클래스로 칠한 칸을 실측해 변환한 값이라 Tailwind가 실제로 내보내는
          색과 어긋나지 않습니다.
        </p>
        <div ref={gridRef} className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">STEP</th>
                {PALETTE.map((column) => (
                  <th key={column.hue} scope="col" className="px-3 py-2 font-bold">
                    {column.hue.toUpperCase()}
                    <span className="text-muted-foreground ml-1.5 font-normal tracking-normal">
                      {column.note}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STEPS.map((step, index) => (
                <tr key={step}>
                  <th scope="row" className="border-t px-3 py-2 font-medium">
                    {step}
                  </th>
                  {PALETTE.map((column) => {
                    const cell = column.steps[index]
                    const key = `${column.hue}-${cell.step}`
                    return (
                      <td key={column.hue} className="border-t px-1.5 py-1">
                        <div className="flex items-center gap-2">
                          <span
                            data-swatch={key}
                            className={cn('size-5 shrink-0 rounded border', cell.className)}
                            aria-hidden
                          />
                          {paletteHex[key] && (
                            <CopyValue
                              value={paletteHex[key]}
                              className="text-muted-foreground text-12"
                            />
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Semantic mapping">
        <p className="text-muted-foreground text-16">
          지금 테마의 시맨틱 토큰을 hex로 바꿔 위 팔레트와 비교하고, 가장 가까운 원시 색을 찾은
          결과입니다. 손으로 적은 대응표가 아니라 볼 때마다 다시 계산하는 값이라 토큰을 고치면
          이 표도 따라 바뀝니다. 차이가 0이면 그 원시 값을 그대로 쓴 것이고, 차이가 크면 팔레트
          밖에서 온 색이라는 뜻입니다. 알파가 섞인 토큰은 알파를 뺀 색으로 비교합니다.
        </p>
        <p className="text-muted-foreground text-16">
          차이는 RGB 좌표 사이의 거리입니다. 사람이 느끼는 색 차이와 정확히 비례하지 않으므로
          두 값의 크기를 견주는 잣대로 쓰지 않고, 가장 가까운 원시 값을 찾는 실마리로만 씁니다.
          같은 이유로 차이가 0이 아닌 대응은 그 색이 팔레트의 어느 근처에서 왔는지 알려줄 뿐,
          그 원시 값으로 바꿔도 된다는 뜻은 아닙니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">TOKEN</th>
                <th scope="col" className="px-3 py-2 font-bold">HEX</th>
                <th scope="col" className="px-3 py-2 font-bold">Nearest raw</th>
                <th scope="col" className="px-3 py-2 font-bold">Raw HEX</th>
                <th scope="col" className="px-3 py-2 font-bold">Diff</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hex = tokenHex[row.name] ?? ''
                const match = hex ? nearest(hex, paletteHex) : null
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
                    <td className="text-muted-foreground border-t px-1.5 py-1">
                      {hex && <CopyValue value={hex} className="text-12" />}
                    </td>
                    <td className="text-muted-foreground border-t px-3 py-2 text-12">
                      {match?.key}
                    </td>
                    <td className="text-muted-foreground border-t px-1.5 py-1">
                      {match && <CopyValue value={match.hex} className="text-12" />}
                    </td>
                    <td className="text-muted-foreground border-t px-3 py-2 text-12">
                      {match ? Math.round(match.gap) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-16">
          이 표는 대응을 정하는 문서가 아니라 지금 상태를 비추는 거울입니다. 어떤 토큰의 차이가
          갑자기 커졌다면 팔레트 밖의 색이 들어온 것이므로, 그 색을 남길지 팔레트 단계로 되돌릴지
          정합니다.
        </p>
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '새 색이 필요하면 팔레트 단계에서 고르고 시맨틱 토큰으로 등록한다',
            '같은 뜻의 색은 한 색상의 단계 안에서 고른다',
            '명암 위계는 단계 숫자로 맞춘다',
          ]}
          dont={[
            '컴포넌트에 bg-blue-500 같은 원시 클래스를 쓰지 않는다',
            '팔레트에 없는 색을 즉석에서 만들지 않는다',
            '새 뜻 없이 색상 갈래를 늘리지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
