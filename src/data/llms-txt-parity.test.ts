import { describe, expect, it } from 'vitest'
import llmsTxt from '../../public/llms.txt?raw'
import { buildLlmsTxt } from '../../scripts/llms-txt.ts'

/**
 * public/llms.txt는 registry.ts에서 생성한 결과물이다. 손으로 고치면
 * registry.ts와 조용히 갈라진다 — registry-parity.test.ts가 registry.json에
 * 대해 지키는 것과 같은 종류의 결함이다. 낡았으면 npm run generate:llms-txt로
 * 다시 굽는다.
 */
describe('public/llms.txt', () => {
  it('registry.ts에서 생성한 내용과 바이트까지 같다', () => {
    expect(llmsTxt).toBe(buildLlmsTxt())
  })
})
