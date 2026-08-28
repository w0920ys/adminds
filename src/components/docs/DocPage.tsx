import type { ReactNode } from 'react'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'

/**
 * 읽는 글 한 문단에 붙이는 규칙. 절의 직계 <p>는 DocSection이 알아서 걸어 주고,
 * 상자 안에 들어가 그 규칙이 닿지 않는 문단만 이것을 직접 쓴다.
 *
 * - max-w-2xl(672px): 재 보니 이 문서들의 본문 한 줄이 856px까지 늘어나 있었다.
 *   ui.shadcn.com은 640px다. 무대·표·놀이터는 이 제한을 받지 않는다.
 * - 본문은 이제 16px이라 좁은 화면에서 따로 키울 필요가 없다. 넓은 화면과
 *   같은 크기 클래스가 그대로 사실로 남는다.
 */
export const docProse = 'max-w-2xl'

export function DocPage({
  title,
  description,
  meta,
  children,
}: {
  title: string
  description?: string
  /** 제목 아래에 붙는 짧은 표시. 상태 배지처럼 이 문서 자체를 설명하는 것을 둔다 */
  meta?: ReactNode
  children: ReactNode
}) {
  /*
   * 절 사이 간격은 gap-30(120px)이었다. 절 안이 6~8px로 빽빽한데 절 사이만
   * 120px이라 덩어리와 덩어리 사이에 협곡만 남았다. 64/80px로 좁히고 대신
   * 절 안의 간격을 올려 거시와 미시의 비율을 맞춘다.
   */
  return (
    <article className="flex flex-col gap-16 md:gap-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-32 font-bold tracking-tight">{title}</h1>
        {/*
          * 문서 설명은 text-18(18px)로 본문(16px)보다 커야 하므로 docProse의
          * 크기 클래스는 받지 않고, 한 줄 길이(max-w-2xl)만 본문과 같게 맞춘다.
          */}
        {description && <p className="text-muted-foreground max-w-2xl text-18">{description}</p>}
        {meta}
      </header>
      {children}
    </article>
  )
}

/**
 * 섹션 제목은 본문보다 커야 한다.
 * 이전에는 text-11 대문자 라벨이라 본문보다 작아 위계가 뒤집혀 있었다.
 * 대문자 변환은 한글에 적용되지 않으므로 없앤다.
 */
export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  /*
   * 직계 <p>는 이 절의 본문이다 — 무대·표·격자는 전부 <div>나 <ul>로 온다.
   * 그래서 읽는 글에만 위 docProse와 같은 한 줄 길이 규칙을 건다.
   */
  return (
    <section className="flex flex-col gap-6 [&>p]:max-w-2xl">
      <div className="group flex items-center">
        <h2 className="text-22 font-semibold tracking-tight">{title}</h2>
        <HeadingAnchor />
      </div>
      {children}
    </section>
  )
}
