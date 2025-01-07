import {
  ContentReceiveMessage,
  InjectedReceiveMessage,
  MessageType
} from '@msw-devtools/core'

const postMessage = (message: ContentReceiveMessage) => {
  window.postMessage(message, window.location.origin)
}

window.__MSW_DEVTOOLS_EXTENSION = {
  handleInitialized: () => {
    postMessage({
      type: MessageType.HandleInitialized
    })
  },
  resolve: ({ request, requestId }) => {
    return new Promise((resolve, reject) => {
      const handleMessage = (e: MessageEvent<InjectedReceiveMessage>) => {
        if (
          !e.data ||
          ![MessageType.UnhandledRequest, MessageType.HandledRequest].includes(
            e.data?.type
          ) ||
          e.data.requestId !== requestId
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

      postMessage({
        type: MessageType.Injected,
        requestId,
        request: {
          method: request.method,
          url: request.url
        }
      })
    })
  }
}

while (window.__MSW_DEVTOOLS_EXTENSION_QUEUE?.length) {
  window.__MSW_DEVTOOLS_EXTENSION_QUEUE.shift()?.()
}
