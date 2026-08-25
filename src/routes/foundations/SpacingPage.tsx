import { useEffect, useState } from 'react'
import tokensCss from '@/styles/tokens.css?raw'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { TokenTable } from '@/components/docs/TokenTable'
import { parseTokenNames, readTokens, type TokenRow } from '@/lib/tokens'

const SPACING_NAMES = parseTokenNames(tokensCss, '--spacing-')
const RADIUS_NAMES = parseTokenNames(tokensCss, '--radius-')

const STEPS = [1, 2, 3, 4, 6, 8, 10, 12, 16]

export function SpacingPage() {
  const [density, setDensity] = useState<TokenRow[]>([])
  const [radius, setRadius] = useState<TokenRow[]>([])

  useEffect(() => {
    setDensity(readTokens(SPACING_NAMES, '--spacing-'))
    setRadius(readTokens(RADIUS_NAMES, '--radius-'))
  }, [])

  return (
    <DocPage
      title="Spacing"
      description="간격은 4px 배수로만 씁니다. 어드민은 정보 밀도가 높아 임의 값이 하나 섞이면 정렬이 눈에 띄게 어긋납니다."
    >
      <DocSection title="기본 스케일">
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          {STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <code className="text-muted-foreground w-12 shrink-0 text-xs">{step}</code>
              <div className="bg-primary h-3 rounded-sm" style={{ width: `calc(var(--spacing) * ${step})` }} />
              <span className="text-muted-foreground text-2xs">{step * 4}px</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="밀도 축">
        <p className="text-muted-foreground text-xs">
          컨트롤과 테이블 행의 높이를 토큰으로 묶어 화면마다 흔들리지 않게 합니다.
        </p>
        <TokenTable rows={density} />
      </DocSection>

      <DocSection title="모서리">
        <TokenTable rows={radius} />
      </DocSection>

      <DocSection title="사용 규칙">
        <DoDont
          do={[
            '간격은 4px 배수로만 쓴다',
            '컨트롤 높이는 density 토큰을 쓴다',
            '관련된 요소는 가깝게, 다른 그룹은 멀게 배치한다',
          ]}
          dont={[
            '스케일에 없는 임의 px 값을 쓰지 않는다',
            '여백으로 위계를 만들 수 있는 곳에 구분선을 넣지 않는다',
            '같은 층위의 카드에 서로 다른 안쪽 여백을 쓰지 않는다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
