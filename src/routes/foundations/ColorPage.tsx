import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { Swatch } from '@/components/docs/Swatch'
import { TokenTable } from '@/components/docs/TokenTable'
import { BRANCHES, classify } from '@/routes/foundations/ColorRolePage'
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

  return (
    <DocPage
      title="Color"
      description="색은 blue-500 같은 원시 이름이 아니라 primary·destructive 같은 역할 이름으로 씁니다. 역할로 쓰면 라이트·다크 전환과 브랜드 교체가 토큰 한 곳에서 끝납니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          역할 이름으로 색을 쓰는 규칙을 정합니다. 개별 색상값의 원본은{' '}
          <Link to="/foundations/palette" className="underline underline-offset-2">
            Palette
          </Link>
          에서, 역할 사이의 위계는{' '}
          <Link to="/foundations/color-role" className="underline underline-offset-2">
            Color Role
          </Link>
          에서 다룹니다. 새 색이 필요하다고 느낄 때 먼저 이 문서에서 맞는 역할이 있는지 봅니다.
          견본은 Color Role과 같은 분류(<code>classify</code>)로 묶어서, 두 문서가 같은 토큰을
          다르게 부르지 않습니다.
        </p>
      </DocSection>

      {BRANCHES.map((branch) =>
        branch.id === 'doc' ? (
          <DocSection key={branch.id} title={branch.title}>
            <p className="text-muted-foreground text-sm">
              annotation 계열은 이 문서 사이트에서 주석을 그릴 때만 쓰는 문서 전용 갈래라 제품
              UI 역할이 아닙니다. 여기서는 견본으로 다루지 않고,{' '}
              <Link to="/foundations/color-role" className="underline underline-offset-2">
                Color Role
              </Link>
              에서 따로 다룹니다.
            </p>
          </DocSection>
        ) : (
          <DocSection key={branch.id} title={branch.title}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {rows
                .filter((row) => classify(row.name) === branch.id)
                .map((row) => (
                  <Swatch key={row.cssVar} row={row} />
                ))}
            </div>
          </DocSection>
        ),
      )}

      <DocSection title="All tokens">
        <p className="text-muted-foreground text-sm">
          아래 값은 지금 적용된 테마에서 실측한 것입니다. 테마를 바꾸면 값도 바뀝니다.
        </p>
        <TokenTable rows={rows} />
      </DocSection>

      <DocSection title="Guidelines">
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
