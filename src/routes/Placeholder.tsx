import { SearchX } from 'lucide-react'

/**
 * 찾지 못한 자리. 쓰이는 곳은 둘뿐이다 — 없는 주소(404)와, 문서는 있는데
 * registry·patterns에서 그 메타를 찾지 못한 경우다.
 *
 * v0.11.0에서 Get started와 Patterns가 채워지며 '준비 중인 문서'는 하나도
 * 남지 않았다. 그래서 여기에 준비 중이라고 적으면 두 쓰임 어느 쪽에도
 * 맞지 않는다. 무엇을 찾지 못했는지는 title이 말하고, 여기서는 빠져나갈
 * 길만 준다. 목록의 자리는 말하지 않는다 — 좁은 화면에서 LNB는 서랍으로
 * 접혀 왼쪽에 보이지 않는다.
 */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
        <SearchX size={22} aria-hidden />
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        주소를 다시 확인하거나, 문서 목록에서 다른 문서를 골라 주세요.
      </p>
    </div>
  )
}
