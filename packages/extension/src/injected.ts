import { MessageType } from '@msw-devtools/core'

window.__MSW_DEVTOOLS_EXTENSION = {
  handleInitialized: () => {
    window.postMessage(
      {
        type: MessageType.HandleInitialized
      },
      window.location.origin
    )
  },
  resolve: ({ request, requestId }) => {
    return new Promise((resolve, reject) => {
      const handleMessage = (
        e: MessageEvent<{
          type: MessageType
          requestId: string
          response: {
            body: BodyInit
            init?: ResponseInit
          }
        }>
      ) => {
        if (
          e.data.requestId !== requestId ||
          e.data.type === MessageType.Injected
        ) {
          return
        }

        window.removeEventListener('message', handleMessage)
        if (e.data.type === MessageType.UnhandledRequest) {
          reject()
        } else if (e.data.type === MessageType.HandledRequest) {
          resolve(e.data.response)
        }
      }
      window.addEventListener('message', handleMessage)

      window.postMessage(
        {
          type: MessageType.Injected,
          requestId,
          request: {
            id: requestId,
            method: request.method,
            url: request.url
          }
        },
        window.location.origin
      )
    })
  }
}

while (window.__MSW_DEVTOOLS_EXTENSION_QUEUE?.length) {
  window.__MSW_DEVTOOLS_EXTENSION_QUEUE.shift()?.()
}
