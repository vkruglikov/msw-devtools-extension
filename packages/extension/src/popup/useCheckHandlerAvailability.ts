import { getStatus } from './utils'
import { useEffect, useRef } from 'react'

export const useCheckHandlerAvailability = (
  status: Awaited<ReturnType<typeof getStatus>> | undefined,
  fetch: () => Promise<void>
) => {
  const refStatus = useRef<typeof status>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    refStatus.current = status
  }, [status])

  useEffect(() => {
    const startIntervalStatusCheck = async () => {
      if (refStatus.current?.hasHandle) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
        return
      }

      await fetch()

      timeoutRef.current = setTimeout(startIntervalStatusCheck, 1000)
    }

    if (!timeoutRef.current) {
      startIntervalStatusCheck()
    }
  }, [fetch])
}
