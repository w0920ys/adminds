import { Redis } from '@upstash/redis'

/*
 * Vercel KV(Upstash Redis) 연결에 딸려 온 값 그대로 쓴다 — 대시보드
 * Quickstart가 보여준 이름(KV_REST_API_URL·KV_REST_API_TOKEN)과
 * 정확히 같다. Redis.fromEnv()는 버전에 따라 UPSTASH_* 이름을 찾을 수도
 * 있어, 헷갈리지 않게 직접 두 값을 넘긴다.
 *
 * 이 파일은 api/pageview.ts와 api/weekly-report.ts가 함께 쓰는 조각을
 * 모아둔 곳이다. _lib로 시작하는 이름은 Vercel이 라우트로 취급하지
 * 않는다 — 그래서 순수한 헬퍼 모듈로 안전하게 둘 수 있다.
 */
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

/* 값 키와 나란히 두는 만료 기간이다 — 우피처럼 40일 지나면 자연히 사라진다 */
export const TTL_SECONDS = 60 * 60 * 24 * 40

/*
 * '오늘'은 한국 시간(KST, UTC+9) 기준이다 — 방문자 대부분이 한국에
 * 있고, 자정 기준이 UTC와 9시간 어긋나면 '오늘 조회수'가 실제 하루와
 * 안 맞는다. 날짜별로 키를 나눠 저장하므로(pageview:YYYY-MM-DD).
 */
export const KST_OFFSET_MS = 9 * 60 * 60 * 1000

export function kstDateString(date: Date): string {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10)
}

export function todayKeyKST(): string {
  return `pageview:${kstDateString(new Date())}`
}

/*
 * 지정한 Slack Incoming Webhook으로 텍스트 메시지를 보낸다. 실패해도
 * 호출한 쪽의 응답 자체는 막지 않도록, 에러를 삼키는 건 호출부 책임으로
 * 남겨둔다(이 함수는 그냥 fetch 결과를 그대로 던진다).
 */
export async function postToSlack(text: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}
