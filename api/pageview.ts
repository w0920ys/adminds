import type { VercelRequest, VercelResponse } from '@vercel/node'
import { redis, TTL_SECONDS, todayKeyKST, postToSlack } from './_lib/pageview-shared.js'

/* 오늘 조회수가 이 값에 처음 도달하는 순간 Slack으로 한 번 알린다 */
const SLACK_ALERT_THRESHOLD = 10

/*
 * count가 임계값을 처음 넘는 순간에만 한 번 보낸다 — 그 날 이후의 모든
 * 요청마다 다시 보내면 알림이 아니라 소음이 된다. redis.set(..., {nx:true})
 * 는 키가 없을 때만 성공하므로(이미 있으면 null을 돌려준다), 이 값을
 * "오늘 이미 알렸는지"를 나타내는 잠금으로 그대로 쓸 수 있다. 동시에 여러
 * 요청이 count===threshold를 봐도 잠금을 먼저 잡은 요청 하나만 보낸다.
 */
async function notifySlackIfThresholdReached(dateKey: string, count: number): Promise<void> {
  if (count < SLACK_ALERT_THRESHOLD) return

  const notifiedKey = `${dateKey}:notified`
  const acquired = await redis.set(notifiedKey, '1', { ex: TTL_SECONDS, nx: true })
  if (!acquired) return

  const date = dateKey.replace('pageview:', '')
  try {
    await postToSlack(`adminds 오늘(${date}) 조회수가 ${SLACK_ALERT_THRESHOLD}회를 넘었습니다 (현재 ${count}회).`)
  } catch {
    /* Slack이 잠깐 안 되더라도 조회수 응답 자체는 막지 않는다 */
  }
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
  const updatedAtKey = `${key}:updatedAt`
  const ip = getClientIp(req)
  const excluded = getExcludedIps().includes(ip)

  /*
   * POST는 '방문 한 번을 기록한다'는 뜻이고, GET은 '지금 값만 읽는다'는
   * 뜻이다 — 그래서 실제로 세는 자리는 POST + 제외 목록에 없을 때뿐이다.
   * 제외된 IP도 POST를 보낼 수 있지만(자기 화면에서도 오늘 숫자는
   * 보여야 하니까), 그 요청은 세지 않고 지금 값만 그대로 돌려준다.
   *
   * updatedAt은 우피 위젯의 'N분 전'을 재현하기 위한 값이다 — 마지막으로
   * 카운트가 실제로 올라간 시각을 ISO 문자열로 남긴다. 값 키와 같은
   * 만료 기간을 매번 다시 걸어(EX), 계속 방문이 있는 한 함께 살아있게 한다.
   */
  let count: number
  let updatedAt: string | null
  if (req.method === 'POST' && !excluded) {
    count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, TTL_SECONDS)
    }
    updatedAt = new Date().toISOString()
    await redis.set(updatedAtKey, updatedAt, { ex: TTL_SECONDS })
    await notifySlackIfThresholdReached(key, count)
  } else {
    const [storedCount, storedUpdatedAt] = await Promise.all([
      redis.get<number>(key),
      redis.get<string>(updatedAtKey),
    ])
    count = storedCount ?? 0
    updatedAt = storedUpdatedAt ?? null
  }

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ count, excluded, updatedAt })
}
