import * as fs from 'node:fs'
import { buildLlmsTxt } from './llms-txt.ts'

// CLI 전용 — src/ 아래 어디서도 이 파일을 import하지 않는다. 순수 로직은
// llms-txt.ts에 있고, 이 파일은 그 결과를 public/llms.txt에 쓰는 일만 한다.
const url = new URL('../public/llms.txt', import.meta.url)
fs.writeFileSync(url, buildLlmsTxt())
console.log(`wrote ${url.pathname}`)
