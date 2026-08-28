import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { findDoc } from '@/components/layout/nav-config'
import { principles, type Principle } from '@/routes/get-started/principles'

const productPrinciples = principles.filter((p) => p.scope === 'product')
const workbenchPrinciple = principles.find((p) => p.scope === 'workbench')

function PrincipleCard({ principle }: { principle: Principle }) {
  const doc = findDoc(principle.source)
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-4">
      <strong className="text-18 font-semibold">{principle.title}</strong>
      <p className="text-muted-foreground text-16">{principle.body}</p>
      {doc && (
        <Link to={doc.to} className="text-primary text-12 underline-offset-4 hover:underline">
          {doc.label}에서 자세히
        </Link>
      )}
    </li>
  )
}

export function PrinciplesPage() {
  return (
    <DocPage
      title="Principles"
      description="판단이 갈릴 때 기대는 원칙입니다. 여기서 새로 만든 것은 없습니다 — 전부 다른 문서에서 이미 지키고 있는 것에 이름을 붙였을 뿐입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          컴포넌트마다, 화면마다 규칙이 있지만 그 규칙들이 왜 그렇게 정해졌는지는 한 문장으로
          겹칩니다. 그 겹치는 문장 {principles.length}개를 여기 모았습니다. 아래 각 항목은 새
          규칙이 아니라 다른 문서가 이미 말하고 있는 것을 가리키는 이름표입니다.
        </p>
        <p className="text-muted-foreground text-16">
          그래서 이 문서는 혼자 서지 않습니다. 각 원칙 아래의 링크가 그 원칙을 실제로 다루는
          문서로 이어지고, 그 문서에서 값과 예시를 확인할 수 있습니다.
        </p>
      </DocSection>

      <DocSection title="Principles">
        <ul className="flex flex-col gap-3">
          {productPrinciples.map((principle) => (
            <PrincipleCard key={principle.id} principle={principle} />
          ))}
        </ul>
      </DocSection>

      <DocSection title="About this workbench">
        <p className="text-muted-foreground text-16">
          앞의 {productPrinciples.length}개는 이 시스템으로 만드는{' '}
          <strong className="text-foreground font-medium">제품 화면</strong>에 거는 규칙입니다.
          마지막 하나는 성격이 다릅니다 —{' '}
          <strong className="text-foreground font-medium">이 작업대 자체</strong>에 거는
          규칙입니다. 이 사이트는 문서가 곧 제품이므로, 문서가 코드에 대해 사실이 아닌 것을
          말하면 그것이 곧 결함입니다.
        </p>
        {workbenchPrinciple && (
          <ul className="flex flex-col gap-3">
            <PrincipleCard principle={workbenchPrinciple} />
          </ul>
        )}
      </DocSection>
    </DocPage>
  )
}
