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
