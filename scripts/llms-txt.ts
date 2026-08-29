import { categoryLabel, componentsByCategory, components } from '../src/data/registry.ts'

const SITE = 'https://adminds.vercel.app'

/*
 * registry.ts가 유일한 데이터 출처다. public/llms.txt는 이 함수의 순수
 * 출력이고, 손으로 고치지 않는다 — 손으로 고치는 순간 이 프로젝트가 여러
 * 번 겪은 "적어둔 개수가 실제 배열과 조용히 갈라지는" 결함이 반복된다.
 * 낡았으면 npm run generate:llms-txt로 다시 굽는다.
 *
 * 이 파일은 node 전용 API(fs·process 등)를 쓰지 않는다 — llms-txt-parity
 * 테스트가 src/ 아래(tsconfig.app.json 아래, node 타입이 없다)에서 이
 * 함수를 그대로 import하기 때문이다. 파일에 실제로 쓰는 일은
 * generate-llms-txt.ts(tsconfig.node.json 아래, node 타입이 있다)가 맡는다.
 */
export function buildLlmsTxt(): string {
  const lines: string[] = []

  lines.push('# adminds')
  lines.push('')
  lines.push(
    `> Tailwind v4 + shadcn/ui 기반 어드민 디자인 시스템. 검증된 컴포넌트 ${components.length}개와 디자인 토큰을 shadcn CLI로 설치한다.`,
  )
  lines.push('')
  lines.push(
    'React 19 + TypeScript 프로젝트에서 반복적으로 쓰는 어드민 컴포넌트(버튼, 폼, 데이터 테이블, ' +
      '내비게이션 등)를 미리 만들고 검증해 둔 shadcn 레지스트리 겸 문서 사이트다. 컴포넌트 하나만 받거나, ' +
      '토큰만 받거나, 전부를 한 번에 받을 수 있다.',
  )
  lines.push('')

  lines.push('## Install')
  lines.push('')
  lines.push(`- 컴포넌트 하나: \`npx shadcn@latest add ${SITE}/r/<name>.json\` — \`<name>\`은 아래 Components 목록의 괄호 안 값`)
  lines.push(`- 토큰만: \`npx shadcn@latest add ${SITE}/r/tokens.json\``)
  lines.push(`- 토큰 + 컴포넌트 ${components.length}개 전부: \`npx shadcn@latest add ${SITE}/r/adminds.json\``)
  lines.push(
    '- 받는 프로젝트 요건: Tailwind v4 / globals.css의 import 순서(tailwindcss → tw-animate-css → ' +
      'tokens.css) / tsconfig.json에 직접 넣는 `"paths": { "@/*": ["./src/*"] }`(baseUrl 금지 — TypeScript 6에서 하드 에러)',
  )
  lines.push('')

  lines.push(`## Components (${components.length})`)
  lines.push('')
  for (const { category, items } of componentsByCategory()) {
    lines.push(`### ${categoryLabel[category]}`)
    lines.push('')
    for (const item of items) {
      lines.push(`- [${item.name}](${SITE}/components/${item.id}) (\`${item.id}\`) — ${item.purpose}`)
    }
    lines.push('')
  }

  lines.push('## Rules')
  lines.push('')
  lines.push('- 색·간격·radius·shadow는 tokens.css 토큰을 통해서만 쓴다.')
  lines.push('- 원시값과 임의 대괄호 표기(`[3px]`, `[#abc]`)는 쓰지 않는다.')
  lines.push('')

  lines.push('## Docs')
  lines.push('')
  lines.push(`- Full docs: ${SITE}`)
  lines.push(`- Install guide: ${SITE}/get-started/install`)
  lines.push('')

  return lines.join('\n')
}
