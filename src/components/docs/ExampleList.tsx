import type { ReactNode } from 'react'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import type { Example } from '@/data/registry'

export function ExampleList({
  examples,
  renderExample,
}: {
  examples: Example[]
  renderExample?: (exampleId: string) => ReactNode
}) {
  /*
   * 칸에 min-w-0이 필요하다. 격자 칸은 기본이 min-width:auto라 안에 든
   * 표(whitespace-nowrap)가 칸을 자기 폭만큼 벌린다 — 지금도 이 한 줄을 빼고
   * /components/table을 375px에서 열면 main의 scrollWidth가 375가 아니라
   * 428이 된다. 0으로 내리면 칸이 컨테이너에 맞고, 넘치는 표는 Table이
   * 스스로 가진 overflow-x-auto 영역 안에서 굴러간다.
   */
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {examples.map((example) => {
        const node = renderExample?.(example.id)
        return (
          <li key={example.id} className="flex min-w-0 flex-col gap-3">
            <div>
              <strong className="text-16">{example.title}</strong>
              {/* 예시의 설명은 한 문장짜리 읽는 글이라 캡션(text-12)이 아니라 본문 크기로 둔다 */}
              <p className="text-muted-foreground mt-2 text-16">{example.note}</p>
            </div>
            {node && <ExampleFrame>{node}</ExampleFrame>}
          </li>
        )
      })}
    </ul>
  )
}
