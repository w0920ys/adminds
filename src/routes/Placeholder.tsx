import { Construction } from 'lucide-react'

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
        <Construction size={22} />
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        이 영역은 아직 준비 중입니다. v0.2.0에서는 Components의 Button만 완성됩니다.
      </p>
    </div>
  )
}
