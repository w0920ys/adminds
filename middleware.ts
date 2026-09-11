import { next } from '@vercel/edge'

/*
 * /r/*.json은 shadcn CLI가 컴포넌트를 다른 프로젝트로 복사해갈 때
 * 한 번 요청하는 정적 파일이다(`npx shadcn add https://adminds.vercel.app/r/button.json`).
 * npm 패키지처럼 계속 연결돼 있는 게 아니라 그 순간 한 번 받아가는 게
 * 전부라, "몇 개 프로젝트가 쓰는지"는 알 수 없어도 "몇 번 복사해갔는지"는
 * 이 요청 하나하나를 세면 알 수 있다. Edge Middleware는 정적 파일이
 * 실제로 응답되기 전에 끼어들 수 있는 유일한 자리라 여기서 카운트만
 * 얹고 원래 응답은 그대로 흘려보낸다(next()).
 */
export const config = {
  matcher: '/r/:path*.json',
}

export default async function middleware(request: Request) {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/r\/([a-z0-9-]+)\.json$/)

  if (match) {
    const component = match[1]
    const base = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN

    if (base && token) {
      /*
       * Upstash REST API를 직접 fetch로 부른다 — Edge 런타임은 Node
       * 전용 SDK가 아니라 fetch만 있으면 되는 이 방식이 가장 가볍다.
       * 실패해도(네트워크 문제 등) 원래 파일 응답은 절대 막지 않는다.
       */
      await fetch(`${base}/incr/registry:${component}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
  }

  return next()
}
