import { describe, expect, it } from 'vitest'
import pkg from '../../../package.json'
import { installCommands } from '@/routes/get-started/install-commands'

describe('installCommands', () => {
  /*
   * 화면에 'npm run dev'라고 적어 두고 package.json에서 그 스크립트가
   * 사라지면 문서가 없는 명령을 시킨다. 테스트에서만 package.json을
   * 읽는다 — 앱 번들에 넣지 않는다.
   */
  it('모든 명령이 package.json의 scripts에 실재한다', () => {
    const scripts = Object.keys(pkg.scripts)
    for (const command of installCommands) {
      expect(scripts, command.script).toContain(command.script)
    }
  })

  it('명령이 중복되지 않는다', () => {
    const names = installCommands.map((c) => c.script)
    expect(new Set(names).size).toBe(names.length)
  })

  it('모든 명령에 설명이 있다', () => {
    for (const command of installCommands) {
      expect(command.note, command.script).toBeTruthy()
    }
  })
})
