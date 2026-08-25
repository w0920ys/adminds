import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AnatomyPart, ComponentMeta } from '@/data/registry'
import { cn } from '@/lib/utils'

type Placed = {
  part: AnatomyPart
  index: number
  side: 'left' | 'right'
  /** 무대 기준 좌표계의 부위 사각형 */
  box: { x: number; y: number; width: number; height: number }
  /** 라벨의 세로 중심 */
  labelY: number
}

/** 라벨 하나가 차지하는 세로 공간 */
const LABEL_SLOT = 56
/** 무대 가장자리에서 라벨까지의 여백 */
const GUTTER = 12
/** 이 폭 미만에서는 라벨을 놓을 자리가 없어 지시선을 그리지 않는다 */
const MIN_WIDTH_FOR_LINES = 640

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [active, setActive] = useState<string | null>(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const stageBox = stage.getBoundingClientRect()

    if (stageBox.width < MIN_WIDTH_FOR_LINES) {
      setPlaced([])
      return
    }

    const found = meta.anatomy
      .map((part, index) => {
        const el = stage.querySelector(`[data-anatomy="${part.part}"]`)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return {
          part,
          index,
          box: {
            x: rect.x - stageBox.x,
            y: rect.y - stageBox.y,
            width: rect.width,
            height: rect.height,
          },
        }
      })
      .filter((item): item is Omit<Placed, 'side' | 'labelY'> => item !== null)

    const mid = stageBox.width / 2
    const sided = found.map((item) => ({
      ...item,
      side: (item.box.x + item.box.width / 2 < mid ? 'left' : 'right') as 'left' | 'right',
    }))

    const next: Placed[] = []
    for (const side of ['left', 'right'] as const) {
      const group = sided
        .filter((item) => item.side === side)
        .sort((a, b) => a.box.y + a.box.height / 2 - (b.box.y + b.box.height / 2))
      const start = Math.max(
        LABEL_SLOT / 2,
        stageBox.height / 2 - (group.length * LABEL_SLOT) / 2 + LABEL_SLOT / 2,
      )
      group.forEach((item, i) => next.push({ ...item, labelY: start + i * LABEL_SLOT }))
    }

    setSize({ width: stageBox.width, height: stageBox.height })
    setPlaced(next.sort((a, b) => a.index - b.index))
  }, [meta])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(stage)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={stageRef}
        className="bg-surface-raised relative min-h-56 overflow-hidden rounded-lg border"
      >
        <div className="grid min-h-56 place-items-center px-6 py-12 sm:px-44">{preview}</div>

        {placed.length > 0 && (
          <>
            <svg
              className="pointer-events-none absolute inset-0"
              width={size.width}
              height={size.height}
              aria-hidden
            >
              {placed.map((item) => {
                const cy = item.box.y + item.box.height / 2
                const edgeX = item.side === 'left' ? item.box.x : item.box.x + item.box.width
                const anchorX =
                  item.side === 'left' ? GUTTER + 140 : size.width - GUTTER - 140
                const bendX = (anchorX + edgeX) / 2
                const isActive = active === item.part.part
                const isDimmed = active !== null && !isActive
                return (
                  <g
                    key={item.part.part}
                    className={cn(
                      isActive ? 'text-primary' : 'text-muted-foreground',
                      isDimmed && 'opacity-20',
                    )}
                  >
                    <polyline
                      points={`${anchorX},${item.labelY} ${bendX},${item.labelY} ${bendX},${cy} ${edgeX},${cy}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 1.5 : 1}
                    />
                    <circle cx={edgeX} cy={cy} r="2.5" fill="currentColor" />
                    {isActive && (
                      <rect
                        x={item.box.x - 4}
                        y={item.box.y - 4}
                        width={item.box.width + 8}
                        height={item.box.height + 8}
                        rx="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            <div aria-hidden className="contents">
              {placed.map((item) => {
                const isActive = active === item.part.part
                const isDimmed = active !== null && !isActive
                return (
                  <div
                    key={item.part.part}
                    className={cn(
                      'pointer-events-none absolute w-32 -translate-y-1/2',
                      item.side === 'left' ? 'text-right' : 'text-left',
                      isDimmed && 'opacity-20',
                    )}
                    style={{
                      top: item.labelY,
                      [item.side]: GUTTER,
                    }}
                  >
                    <strong
                      className={cn('block text-xs', isActive ? 'text-primary' : undefined)}
                    >
                      {item.part.label}
                    </strong>
                    {item.part.optional && (
                      <span className="text-muted-foreground text-2xs">(Optional)</span>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* 번호 목록. 지시선이 없어도 문서가 성립하는 기본 층이다. */}
      <ol className="flex flex-col gap-2">
        {meta.anatomy.map((part, index) => {
          const isActive = active === part.part
          return (
            <li key={part.part}>
              <button
                type="button"
                onClick={() => setActive(isActive ? null : part.part)}
                aria-pressed={isActive}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-md p-2 text-left',
                  isActive ? 'bg-accent' : 'hover:bg-accent/50',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-2xs font-bold',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>
                <span>
                  <strong className="text-sm">
                    {part.label}
                    {part.optional && (
                      <span className="text-muted-foreground font-normal"> (Optional)</span>
                    )}
                  </strong>
                  <span className="text-muted-foreground block text-xs">{part.note}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
