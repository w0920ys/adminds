import { describe, expect, it } from 'vitest'
import { currentRelease, releases, requestProgress } from '@/data/releases'

describe('releases', () => {
  it('최신 버전이 배열의 맨 앞이다', () => {
    expect(currentRelease).toBe(releases[0])
  })

  it('버전이 중복되지 않는다', () => {
    const versions = releases.map((r) => r.version)
    expect(new Set(versions).size).toBe(versions.length)
  })

  /*
   * GNB의 버전 번호는 currentRelease.version에서 나온다. 기록을 남기지
   * 않고 배포하면 화면이 지난 버전이라고 말한다.
   */
  it('최신 기록의 버전이 package.json의 버전과 같다', async () => {
    const pkg = (await import('../../package.json')).default
    expect(currentRelease.version).toBe(`v${pkg.version}`)
  })

  it('요청 반영 진행률을 센다', () => {
    const release = {
      ...currentRelease,
      requests: [
        { label: 'a', done: true },
        { label: 'b', done: false },
        { label: 'c', done: true },
      ],
    }
    expect(requestProgress(release)).toEqual({ done: 2, total: 3 })
  })

  it('요청이 없으면 0 / 0이다', () => {
    expect(requestProgress({ ...currentRelease, requests: [] })).toEqual({ done: 0, total: 0 })
  })
})
