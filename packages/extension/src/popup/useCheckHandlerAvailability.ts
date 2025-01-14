import { useEffect, useRef } from 'react'

import { getStatus } from './utils'

export const useCheckHandlerAvailability = (
  status: Awaited<ReturnType<typeof getStatus>> | undefined,
  fetch: () => Promise<void>
) => {
  const refStatus = useRef<typeof status>(undefined)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

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
