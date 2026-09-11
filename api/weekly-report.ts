import type { VercelRequest, VercelResponse } from '@vercel/node'
import { redis, kstDateString, postToSlack } from './_lib/pageview-shared.js'

const WEEKDAY_LABELS_MON_FIRST = ['월', '화', '수', '목', '금', '토', '일']

/*
 * '지난주'는 한국 시간 기준 월요일~일요일이다. 이 함수를 부르는 시각이
 * 월요일 오전이라 가정하고, 그보다 하루 전(일요일)이 속한 주 — 즉 바로
 * 전주의 월요일부터 7일을 구한다. 오늘이 무슨 요일이든 항상 '가장 최근에
 * 끝난 월~일 한 주'를 가리키도록 dow(요일)로 역산한다.
 */
function lastWeekDatesKST(now = new Date()): { date: string; label: string }[] {
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const dow = kstNow.getUTCDay() // 0=일, 1=월, ..., 6=토
  const daysSinceThisMonday = (dow + 6) % 7 // 월=0, 화=1, ..., 일=6

  const thisMonday = new Date(kstNow)
  thisMonday.setUTCHours(0, 0, 0, 0)
  thisMonday.setUTCDate(thisMonday.getUTCDate() - daysSinceThisMonday)

  const lastMonday = new Date(thisMonday)
  lastMonday.setUTCDate(lastMonday.getUTCDate() - 7)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lastMonday)
    d.setUTCDate(d.getUTCDate() + i)
    return { date: kstDateString(d), label: WEEKDAY_LABELS_MON_FIRST[i] }
  })
}

function formatReport(days: { date: string; label: string; count: number }[]): string {
  const lines = days.map((d) => `${d.label} ${d.date.slice(5)}: ${d.count.toLocaleString('ko-KR')}`)
  const total = days.reduce((sum, d) => sum + d.count, 0)
  const range = `${days[0]!.date.slice(5)} ~ ${days[6]!.date.slice(5)}`

  return [`📊 지난주 adminds 조회수 (${range})`, '', ...lines, '─────────', `합계: ${total.toLocaleString('ko-KR')}`].join(
    '\n',
  )
}

/*
 * Vercel Cron이 호출하는 자리다 — 환경변수 이름을 정확히 CRON_SECRET으로
 * 등록해두면 Vercel이 이 값을 Authorization: Bearer 헤더로 자동으로
 * 붙여서 호출한다. 그 값이 없거나 다르면 진짜 크론이 아니라 임의의
 * 요청이라는 뜻이라 거절한다 — 이 라우트가 없으면 아무나 URL만 알아도
 * 반복 호출해 Slack에 스팸을 보낼 수 있다.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const dates = lastWeekDatesKST()
  const counts = await Promise.all(dates.map((d) => redis.get<number>(`pageview:${d.date}`)))
  const days = dates.map((d, i) => ({ ...d, count: counts[i] ?? 0 }))

  await postToSlack(formatReport(days))

  res.status(200).json({ ok: true, days })
}
