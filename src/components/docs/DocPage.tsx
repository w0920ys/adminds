import type { ReactNode } from 'react'
import { HeadingAnchor } from '@/components/docs/HeadingAnchor'

/**
 * 읽는 글 한 문단에 붙이는 규칙. 절의 직계 <p>는 DocSection이 알아서 걸어 주고,
 * 상자 안에 들어가 그 규칙이 닿지 않는 문단만 이것을 직접 쓴다.
 *
 * - max-w-2xl(672px): 재 보니 이 문서들의 본문 한 줄이 856px까지 늘어나 있었다.
 *   ui.shadcn.com은 640px다. 무대·표·놀이터는 이 제한을 받지 않는다.
 * - sm 미만에서만 15px/26.25px: 좁은 화면에서 14px 한글은 작다. sm 이상에서는
 *   이 규칙이 사라져 문단이 자기 크기 클래스대로 돌아간다 — 넓은 화면에서는
 *   코드에 적힌 크기가 그대로 사실로 남는다.
 */
export const docProse = 'max-w-2xl max-sm:text-[0.9375rem] max-sm:leading-[1.75]'

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
          * 문서 설명은 text-18(18px)이다. docProse의 좁은 화면 규칙(15px)을
          * 그대로 받으면 오히려 작아지므로 크기 규칙은 받지 않고, 한 줄
          * 길이(max-w-2xl)만 본문과 같게 맞춘다.
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
   * 그래서 읽는 글에만 위 docProse와 같은 규칙을 건다. 자식 선택자라
   * 문단 자신의 크기 클래스보다 명시도가 높아 좁은 화면 규칙이 이긴다.
   * docProse 문자열을 그대로 쓸 수는 없다 — Tailwind는 소스에 적힌 클래스
   * 이름을 글자 그대로 훑어서 만들기 때문에, 변형 접두사를 코드로 붙이면
   * 그 클래스가 아예 생성되지 않는다.
   */
  return (
    <section className="flex flex-col gap-6 [&>p]:max-w-2xl [&>p]:max-sm:text-[0.9375rem] [&>p]:max-sm:leading-[1.75]">
      <div className="group flex items-center">
        <h2 className="text-22 font-semibold tracking-tight">{title}</h2>
        <HeadingAnchor />
      </div>
      {children}
    </section>
  )
}
