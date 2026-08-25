import { useEffect, useState } from 'react'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { Swatch } from '@/components/docs/Swatch'
import { TokenTable } from '@/components/docs/TokenTable'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'

const COLOR_NAMES = parseTokenNames(tokensCss, '--color-')

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

export function ColorPage() {
  const rows = useMeasuredTokens(COLOR_NAMES)
  const surfaces = rows.filter((r) => /background|surface|card|popover|muted|accent/.test(r.name))
  const roles = rows.filter((r) => /primary|secondary|destructive|success|warning|info/.test(r.name))
  const lines = rows.filter((r) => /border|input|ring/.test(r.name))

  return (
    <DocPage
      title="Color"
      description="색은 blue-500 같은 원시 이름이 아니라 primary·destructive 같은 역할 이름으로 씁니다. 역할로 쓰면 라이트·다크 전환과 브랜드 교체가 토큰 한 곳에서 끝납니다."
    >
      <DocSection title="표면">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {surfaces.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="역할">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {roles.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="선과 포커스">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {lines.map((row) => <Swatch key={row.cssVar} row={row} />)}
        </div>
      </DocSection>

      <DocSection title="전체 토큰">
        <p className="text-muted-foreground text-xs">
          아래 값은 지금 적용된 테마에서 실측한 것입니다. 테마를 바꾸면 값도 바뀝니다.
        </p>
        <TokenTable rows={rows} />
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '역할 토큰(primary, destructive)을 쓴다',
            '위험한 동작에는 destructive를 일관되게 쓴다',
            '상태를 색만으로 구분하지 않고 텍스트나 아이콘을 함께 둔다',
          ]}
          dont={[
            '컴포넌트에 hex 값을 직접 적지 않는다',
            '같은 의미에 화면마다 다른 색을 쓰지 않는다',
            'success와 destructive를 장식 목적으로 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
