import { WindowWithMswDevtools } from '@msw-devtools/core'

declare global {
  interface Window extends WindowWithMswDevtools {}
}

export {}
