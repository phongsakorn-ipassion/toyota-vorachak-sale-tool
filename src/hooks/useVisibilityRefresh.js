import { useEffect } from 'react'

export function useVisibilityRefresh(refreshFn) {
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') refreshFn()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [refreshFn])
}
