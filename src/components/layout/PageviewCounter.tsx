import { useEffect, useState } from 'react'

type PageviewResponse = { count: number; excluded: boolean }

/*
 * /api/pageview로 한 번 POST해서 '방문 한 번'을 기록하고, 그 응답의
 * count를 그대로 보여준다 — 화면에서 따로 세지 않는다(새로고침마다
 * 다시 세는 게 정직한 조회수다).
 *
 * 실패하면 조용히 아무것도 안 그린다. 이 컴포넌트가 실패하는 흔한
 * 경우가 있다 — vite dev 서버(npm run dev)는 /api를 아예 안 띄운다
 * (vercel dev나 실제 배포에서만 존재한다). 그런 자리에서 에러 문구를
 * 보이면 개발할 때마다 footer가 깨져 보인다 — 대신 실패를 count가
 * null인 상태로만 남겨 아무것도 렌더링하지 않는다.
 */
export function PageviewCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/pageview', { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`pageview 응답 실패: ${res.status}`)
        return res.json() as Promise<PageviewResponse>
      })
      .then((data) => {
        if (!cancelled) setCount(data.count)
      })
      .catch(() => {
        /* 조용히 넘긴다 — 위 주석 참고 */
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (count === null) return null

  return (
    <>
      {' · '}
      <span aria-live="polite">오늘 조회 {count.toLocaleString('ko-KR')}</span>
    </>
  )
}
