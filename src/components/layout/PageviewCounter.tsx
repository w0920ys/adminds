import { useEffect, useState } from 'react'

type PageviewResponse = { count: number; excluded: boolean; updatedAt: string | null }

/*
 * 우피의 'N분 전'처럼, 마지막 조회 시각을 현재 시각과 비교해 한글로
 * 읽는다. 정확한 초 단위가 아니라 대략적인 감이면 충분한 자리라 분·시간·
 * 일 세 단계로만 나눈다.
 */
function formatRelativeKo(updatedAt: string, now: number): string {
  const diffSec = Math.max(0, Math.floor((now - new Date(updatedAt).getTime()) / 1000))
  if (diffSec < 60) return '방금 전'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${Math.floor(diffHour / 24)}일 전`
}

export function PageviewCounter() {
  const [data, setData] = useState<PageviewResponse | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false

    fetch('/api/pageview', { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`pageview 응답 실패: ${res.status}`)
        return res.json() as Promise<PageviewResponse>
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch(() => {
        /* 조용히 넘긴다 — vite dev(npm run dev)는 /api를 아예 안 띄운다 */
      })

    return () => {
      cancelled = true
    }
  }, [])

  // 'N분 전'이 시간이 지나며 저절로 갱신되도록 1분마다 다시 그린다
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (data === null) return null

  return (
    <span
      className="bg-foreground text-background ml-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 align-middle text-12 font-bold"
      aria-live="polite"
    >
      <span>오늘 {data.count.toLocaleString('ko-KR')}</span>
      {data.updatedAt && (
        <span className="text-background/70 font-normal">· {formatRelativeKo(data.updatedAt, now)}</span>
      )}
    </span>
  )
}
