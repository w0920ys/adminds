import { ComponentPage } from '@/components/docs/ComponentPage'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

export function ButtonPage() {
  const meta = getComponent('button')
  if (!meta) return <Placeholder title="Button 메타를 찾을 수 없습니다" />

  return <ComponentPage meta={meta} />
}
