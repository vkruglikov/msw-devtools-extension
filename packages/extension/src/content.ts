import {
  BackgroundReceiveMessage,
  BackgroundResponseMessage,
  ContentReceiveMessage,
  InjectedReceiveMessage,
  MessageType
} from '@msw-devtools/core'

const postMessage = (message: InjectedReceiveMessage) => {
  window.postMessage(message, window.location.origin)
}

const script = document.createElement('script')
script.src = chrome.runtime.getURL('injected.js')
script.onload = () => {
  script.remove()
}
;(document.head || document.documentElement).appendChild(script)

window.addEventListener(
  'message',
  async (event: MessageEvent<ContentReceiveMessage>) => {
    if (event.source !== window) return

    if (event.data.type === MessageType.HandleInitialized) {
      try {
        await chrome.runtime.sendMessage<BackgroundReceiveMessage>({
          type: MessageType.HandleInitialized,
          host: window.location.host
        })
      } catch (e) {
        console.error('Handler initialization error', e)
      }
    } else if (event.data.type === MessageType.Injected) {
      try {
        const response = await chrome.runtime.sendMessage<
          Extract<BackgroundReceiveMessage, { type: MessageType.Content }>,
          Extract<
            BackgroundResponseMessage,
            { type: MessageType.HandledRequest | MessageType.UnhandledRequest }
          >
        >({ type: MessageType.Content, request: event.data.request })

        postMessage({
          ...response,
          requestId: event.data.requestId
        })
      } catch (e) {
        postMessage({
          type: MessageType.UnhandledRequest,
          requestId: event.data.requestId
        })
      }
    }
  }
)
