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

  /*
   * 배지처럼 튀는 배경 대신, 위 "All rights reserved."와 같은 색·굵기를
   * 그대로 물려받는 일반 텍스트로 둔다 — 우피 참고 이미지의 어두운 배경은
   * 그 화면이 다크 모드였을 뿐, 위계를 뒤집으라는 뜻은 아니었다. 같은 줄에
   * 붙이면 문장이 길어져 읽기 번거로워, 저작권 문구 아래 한 줄로 둔다.
   */
  return (
    <p className="text-muted-foreground text-12" aria-live="polite">
      오늘 {data.count.toLocaleString('ko-KR')}
      {data.updatedAt && ` · ${formatRelativeKo(data.updatedAt, now)}`}
    </p>
  )
}
