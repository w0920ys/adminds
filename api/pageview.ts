import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

/*
 * Vercel KV(Upstash Redis) 연결에 딸려 온 값 그대로 쓴다 — 대시보드
 * Quickstart가 보여준 이름(KV_REST_API_URL·KV_REST_API_TOKEN)과
 * 정확히 같다. Redis.fromEnv()는 버전에 따라 UPSTASH_* 이름을 찾을 수도
 * 있어, 헷갈리지 않게 직접 두 값을 넘긴다.
 */
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

/*
 * '오늘'은 한국 시간(KST, UTC+9) 기준이다 — 방문자 대부분이 한국에
 * 있고, 자정 기준이 UTC와 9시간 어긋나면 '오늘 조회수'가 실제 하루와
 * 안 맞는다. 날짜별로 키를 나눠 저장하므로(pageview:YYYY-MM-DD), 값
 * 자체는 손대지 않고 만료(TTL)만 40일 뒤로 걸어 오래된 키가 무한히
 * 쌓이지 않게 한다 — 우피의 30일 보관과 비슷한 생각이다.
 */
function todayKeyKST(): string {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET_MS)
  return `pageview:${kstNow.toISOString().slice(0, 10)}`
}

/*
 * Vercel은 실제 요청자 IP를 x-forwarded-for 첫 번째 값으로 내려준다
 * (여러 프록시를 거치면 쉼표로 이어붙는데, 맨 앞이 클라이언트다).
 * 로컬 개발 서버에는 이 헤더가 없어 빈 문자열로 떨어진다 — 그러면
 * PAGEVIEW_EXCLUDED_IPS와 매치될 일이 없어 그냥 평범한 방문으로
 * 집계된다(로컬은 별도 카운트 걱정이 없는 자리라 괜찮다).
 */
function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return first?.split(',')[0]?.trim() ?? ''
}

/*
 * 제외할 IP는 소스가 아니라 환경변수(PAGEVIEW_EXCLUDED_IPS, 쉼표 구분)
 * 로 둔다 — 이 저장소는 공개 GitHub 저장소라, 집·회사 IP를 코드에 그대로
 * 적으면 그 값이 커밋 기록에 영구히 남는다. Vercel 대시보드에만 저장해
 * 두면 IP가 바뀌어도 재배포 없이 값만 고치면 된다.
 */
function getExcludedIps(): string[] {
  return (process.env.PAGEVIEW_EXCLUDED_IPS ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const key = todayKeyKST()
  const ip = getClientIp(req)
  const excluded = getExcludedIps().includes(ip)

  /*
   * POST는 '방문 한 번을 기록한다'는 뜻이고, GET은 '지금 값만 읽는다'는
   * 뜻이다 — 그래서 실제로 세는 자리는 POST + 제외 목록에 없을 때뿐이다.
   * 제외된 IP도 POST를 보낼 수 있지만(자기 화면에서도 오늘 숫자는
   * 보여야 하니까), 그 요청은 세지 않고 지금 값만 그대로 돌려준다.
   */
  let count: number
  if (req.method === 'POST' && !excluded) {
    count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, 60 * 60 * 24 * 40)
    }
  } else {
    count = Number((await redis.get<number>(key)) ?? 0)
  }

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ count, excluded })
}
