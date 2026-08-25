import { useCallback, useState } from 'react'
import { currentRelease } from '@/data/releases'

const STORAGE_KEY = 'adminds:lastSeenVersion'

/** 마지막으로 확인한 버전이 최신과 다르면 미확인이다. */
export function hasUnseenRelease(lastSeen: string | null, latest: string): boolean {
  return lastSeen !== latest
}

export function useUnseenRelease() {
  const [lastSeen, setLastSeen] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )

  const markSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, currentRelease.version)
    setLastSeen(currentRelease.version)
  }, [])

  return {
    unseen: hasUnseenRelease(lastSeen, currentRelease.version),
    markSeen,
  }
}
