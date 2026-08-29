import type { ReactNode } from 'react'
import { docProse } from '@/components/docs/DocPage'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'
import { forcedStateClass } from '@/components/docs/state-preview'
import type { ComponentMeta, ComponentProperty } from '@/data/registry'
import { getProperty } from '@/data/registry'
import { cn } from '@/lib/utils'

export type RenderOptions = Record<string, string>

/**
 * 지금 그리는 칸이 어느 축의 무대에 속하는지 알려 준다.
 *
 * 이름을 요구하는 컴포넌트(가로로 구르는 표의 region처럼)는 축 값만으로는
 * 이름이 갈리지 않는다 — 축마다 그리는 기본 조합 칸이 baseOptions 하나에서
 * 나오므로 축이 셋이면 같은 이름이 셋이다. 무대 이름을 함께 넘겨야 갈린다.
 * Playground처럼 축 하나를 그리는 자리가 아니면 넘기지 않는다.
 */
export type RenderContext = {
  /** 이 무대가 바꾸고 있는 축의 prop 이름 */
  property: string
  /** 그 축의 제목. Properties 절의 h3에 서는 이름과 같다 */
  title: string
}

/** 축 이름 → 값을 받아 컴포넌트를 그린다. 두 번째 인자는 그리는 자리의 정체다 */
export type PropertyRender = (options: RenderOptions, context?: RenderContext) => ReactNode

/** 축의 첫 옵션들로 기본 조합을 만든다. 격자의 각 칸은 여기서 한 축만 바꾼다. */
function baseOptions(meta: ComponentMeta): RenderOptions {
  return Object.fromEntries(meta.properties.map((p) => [p.name, p.options[0].value]))
}

export function PropertyBlock({
  meta,
  property,
  render,
}: {
  meta: ComponentMeta
  property: ComponentProperty
  render: PropertyRender
}) {
  const base = baseOptions(meta)
  const cross = property.crossWith ? getProperty(meta, property.crossWith) : undefined

  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="group flex items-center">
          <h3 className="text-18 font-semibold">{property.title}</h3>
          <HeadingAnchor />
        </div>
        <p className={cn('text-muted-foreground mt-2 text-16', docProse)}>{property.description}</p>
      </div>

      {property.display === 'matrix' && cross ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-12">
                <th scope="col" className="bg-surface sticky left-0 px-3 py-2 font-bold">
                  {property.title}
                </th>
                {cross.options.map((option) => (
                  <th key={option.value} scope="col" className="px-3 py-2 font-bold">
                    {option.value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {property.options.map((option) => (
                <tr key={option.value}>
                  <th
                    scope="row"
                    className="bg-surface sticky left-0 border-t px-3 py-3 text-14 font-medium"
                  >
                    {option.value}
                    {option.note && (
                      <span className="text-muted-foreground block text-12 font-normal">
                        {option.note}
                      </span>
                    )}
                  </th>
                  {cross.options.map((crossOption) => (
                    <td key={crossOption.value} className="border-t px-3 py-3">
                      {render(
                        {
                          ...base,
                          [property.name]: option.value,
                          [cross.name]: crossOption.value,
                        },
                        { property: property.name, title: property.title },
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={cn(
            'gap-x-4 gap-y-5 rounded-lg border p-4 md:p-5',
            property.display === 'row'
              ? 'flex flex-wrap items-end gap-x-6'
              : /*
                 * 칸 수를 옵션 개수에 맞춘다 — 옵션이 2개인데 lg:grid-cols-3을
                 * 고정으로 주면 3번째 칸이 항상 비어 그만큼 나머지 두 칸이
                 * 좁아진다(옵션 2개짜리가 전체 91개 축 중 42개로 가장 많다 —
                 * 차트에서 특히 눈에 띄었지만 축이 2개인 다른 컴포넌트도 전부
                 * 같은 폭으로 손해를 보고 있었다). 옵션이 3개 이상일 때만
                 * lg:grid-cols-3까지 늘린다.
                 */
                cn('grid sm:grid-cols-2', property.options.length >= 3 && 'lg:grid-cols-3'),
          )}
        >
          {property.options.map((option) => (
            /*
             * min-w-0이 필요하다. 칸은 기본이 min-width:auto라 안에 든
             * 내용(가로로 굴러가는 ScrollArea처럼 자기 폭보다 넓은
             * 내용)이 칸을 자기 폭만큼 벌린다 — ExampleList.tsx가 같은
             * 이유로 이미 쓰고 있는 것과 같은 처방이다.
             */
            <div key={option.value} className="flex min-w-0 flex-col gap-3">
              <p className="text-muted-foreground text-12 font-bold">{option.value}</p>
              <div
                className={cn(
                  'flex min-h-10 items-center',
                  property.name === 'state' ? forcedStateClass(option.value) : undefined,
                )}
              >
                {render(
                  { ...base, [property.name]: option.value },
                  { property: property.name, title: property.title },
                )}
              </div>
              {option.note && (
                <p className="text-muted-foreground max-w-48 text-12">{option.note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
