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
  /** 지시선이 꺾이는 x. 부위 가장자리에서 시작해 겹치면 바깥으로 밀린다 */
  bendX: number
}

/** 라벨 하나가 차지하는 세로 공간 */
const LABEL_SLOT = 56
/** 무대 가장자리에서 라벨까지의 여백 */
const GUTTER = 12
/** 이 폭 미만에서는 라벨을 놓을 자리가 없어 번호 배지로 대신한다 */
const MIN_WIDTH_FOR_LINES = 640
/** 같은 쪽 지시선이 같은 x에서 꺾일 때 벌리는 간격 */
const LANE_GAP = 14
/** 라벨에서 꺾임점까지 최소한 남겨두는 가로 길이 */
const LANE_MIN = 12

export function Anatomy({ meta, preview }: { meta: ComponentMeta; preview: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [narrow, setNarrow] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const stageBox = stage.getBoundingClientRect()

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
      .filter((item): item is Omit<Placed, 'side' | 'labelY' | 'bendX'> => item !== null)

    const isNarrow = stageBox.width < MIN_WIDTH_FOR_LINES
    setNarrow(isNarrow)
    setSize({ width: stageBox.width, height: stageBox.height })

    if (isNarrow) {
      /** 좁은 화면에서는 지시선 대신 부위 위에 번호 배지를 올린다 */
      setPlaced(found.map((item) => ({ ...item, side: 'left' as const, labelY: 0, bendX: 0 })))
      return
    }

    /**
     * 중심 x로 좌우를 나누면 컨테이너처럼 전체를 감싸는 부위와 가운데 정렬된 라벨이
     * 경계값에서 같은 쪽으로 몰린다. 중심 x로 정렬한 뒤 절반씩 나눠 균형을 맞춘다.
     * part 이름이 아니라 인덱스를 키로 쓴다 — 이름이 겹쳐도 항목이 서로를 덮지 않는다.
     */
    const byX = [...found].sort(
      (a, b) => a.box.x + a.box.width / 2 - (b.box.x + b.box.width / 2),
    )
    const half = Math.ceil(byX.length / 2)
    const sideOf = new Map<number, 'left' | 'right'>(
      byX.map((item, i) => [item.index, i < half ? 'left' : 'right'] as const),
    )
    const sided = found.map((item) => ({
      ...item,
      side: sideOf.get(item.index) ?? 'right',
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
      const anchorX = side === 'left' ? GUTTER + 140 : stageBox.width - GUTTER - 140

      /*
       * 부위 가장자리에서 바로 꺾는다. 그래야 부위에 닿는 가로 구간이 없어지고
       * 긴 가로 구간은 라벨 높이에 놓인다 — 라벨끼리는 LABEL_SLOT만큼 떨어져 있다.
       * 한 줄짜리 컴포넌트는 모든 부위의 세로 중심이 같아서, 가장자리가 아니라
       * 라벨을 기준으로 꺾으면 네 선이 한 가로선 위에 포개진다.
       */
      const taken: number[] = []
      group.forEach((item, i) => {
        const edgeX = side === 'left' ? item.box.x : item.box.x + item.box.width
        let bendX = edgeX
        /* 같은 x를 이미 쓰는 선이 있으면 부위에서 멀어지는 쪽으로 밀어낸다 */
        while (taken.some((x) => Math.abs(x - bendX) < LANE_GAP)) {
          bendX += side === 'left' ? -LANE_GAP : LANE_GAP
        }
        bendX =
          side === 'left'
            ? Math.max(bendX, anchorX + LANE_MIN)
            : Math.min(bendX, anchorX - LANE_MIN)
        taken.push(bendX)
        next.push({ ...item, labelY: start + i * LABEL_SLOT, bendX })
      })
    }

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

  /** 선택된 부위가 있으면 그것만 그린다. 흐리게 두면 무엇을 가리키는지 흐려진다 */
  const shown = active === null ? placed : placed.filter((item) => item.index === active)

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={stageRef}
        className="bg-surface-raised relative min-h-56 overflow-hidden rounded-lg border"
      >
        <div className="grid min-h-56 place-items-center px-6 py-12 sm:px-44">{preview}</div>

        {shown.length > 0 && !narrow && (
          <>
            <svg
              className="pointer-events-none absolute inset-0 text-annotation"
              width={size.width}
              height={size.height}
              aria-hidden
            >
              {shown.map((item) => {
                const cy = item.box.y + item.box.height / 2
                const edgeX = item.side === 'left' ? item.box.x : item.box.x + item.box.width
                const anchorX = item.side === 'left' ? GUTTER + 140 : size.width - GUTTER - 140
                const isActive = active === item.index
                return (
                  <g key={item.index}>
                    <polyline
                      points={`${anchorX},${item.labelY} ${item.bendX},${item.labelY} ${item.bendX},${cy} ${edgeX},${cy}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 1.25 : 0.75}
                    />
                    <circle cx={edgeX} cy={cy} r="2" fill="currentColor" />
                    {isActive && (
                      <rect
                        x={item.box.x - 4}
                        y={item.box.y - 4}
                        width={item.box.width + 8}
                        height={item.box.height + 8}
                        rx="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            <div aria-hidden className="contents">
              {shown.map((item) => (
                <div
                  key={item.index}
                  className={cn(
                    'text-annotation pointer-events-none absolute w-32 -translate-y-1/2',
                    item.side === 'left' ? 'text-right' : 'text-left',
                  )}
                  style={{ top: item.labelY, [item.side]: GUTTER }}
                >
                  <strong className="block text-xs font-medium">{item.part.label}</strong>
                  {item.part.optional && <span className="text-2xs">(Optional)</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {shown.length > 0 && narrow && (
          <div aria-hidden className="contents">
            {placeBadges(shown, size.height).map(({ item, x, y }) => (
              <span
                key={item.index}
                className={cn(
                  'absolute grid size-5 place-items-center rounded-full text-2xs font-bold',
                  active === item.index
                    ? 'bg-annotation text-background'
                    : 'bg-annotation-muted text-background',
                )}
                style={{ left: x, top: y }}
              >
                {item.index + 1}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 번호 목록. 지시선이 없어도 문서가 성립하는 기본 층이다. */}
      <ol className="flex flex-col gap-2">
        {meta.anatomy.map((part, index) => {
          const isActive = active === index
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => setActive(isActive ? null : index)}
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
                      ? 'bg-annotation text-background'
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

/** 배지 지름과 최소 간격 */
const BADGE = 20

/**
 * 배지를 부위의 좌상단 바깥에 놓는다.
 * 부위가 겹쳐 있으면(컨테이너와 그 안의 라벨처럼) 배지도 겹치므로 밀어낸다.
 * 위로 밀 자리가 없으면 아래로 민다 — 무대 밖으로 나가면 잘려서 사라지기 때문이다.
 */
function placeBadges(
  items: Placed[],
  stageHeight: number,
): { item: Placed; x: number; y: number }[] {
  const placedBadges: { x: number; y: number }[] = []
  const collides = (x: number, y: number) =>
    placedBadges.some((b) => Math.abs(b.x - x) < BADGE && Math.abs(b.y - y) < BADGE)

  return items.map((item) => {
    const x = item.box.x - BADGE / 2
    const start = item.box.y - BADGE / 2
    let y = start

    while (y >= 0 && collides(x, y)) y -= BADGE
    if (y < 0) {
      /* 위쪽이 가득 찼으면 아래로 내려간다 */
      y = start
      while (y + BADGE <= stageHeight && collides(x, y)) y += BADGE
      y = Math.min(y, Math.max(0, stageHeight - BADGE))
    }

    placedBadges.push({ x, y })
    return { item, x, y }
  })
}
