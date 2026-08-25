import type { ReactNode } from 'react'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'

export function DocPage({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-base">{description}</p>}
      </header>
      {children}
    </article>
  )
}

/**
 * 섹션 제목은 본문보다 커야 한다.
 * 이전에는 text-2xs 대문자 라벨이라 본문보다 작아 위계가 뒤집혀 있었다.
 * 대문자 변환은 한글에 적용되지 않으므로 없앤다.
 */
export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="group flex items-center">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <HeadingAnchor />
      </div>
      {children}
    </section>
  )
}
