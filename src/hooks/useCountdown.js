import { useState, useEffect, useCallback } from 'react'

export default function useCountdown(initialSeconds) {
  const [remaining, setRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (remaining <= 0) return

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remaining > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const isExpired = remaining <= 0
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const reset = useCallback(() => {
    setRemaining(initialSeconds)
  }, [initialSeconds])

  return { minutes, seconds, isExpired, formatted, reset }
}
