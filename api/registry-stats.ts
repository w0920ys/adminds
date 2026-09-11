import type { VercelRequest, VercelResponse } from '@vercel/node'
import { redis } from './_lib/pageview-shared.js'

/*
 * middleware.ts가 /r/*.json 요청마다 registry:<컴포넌트> 카운터를
 * 올려둔다. 이 라우트는 그 값을 모아 많이 복사된 순서로 보여주기만
 * 한다 — 개인정보나 비밀값이 아니라 그냥 집계 숫자라 인증 없이 둔다.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const keys = await redis.keys('registry:*')
  const values = keys.length ? await redis.mget<(number | null)[]>(...keys) : []

  const counts = keys
    .map((key, i) => ({ component: key.replace('registry:', ''), count: values[i] ?? 0 }))
    .sort((a, b) => b.count - a.count)

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ counts })
}
