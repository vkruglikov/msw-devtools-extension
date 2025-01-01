import { MESSAGE_TYPE } from '@msw-devtools/connect'

window.addEventListener('message', (event) => {
  if (
    event.source === window &&
    event.data.type === MESSAGE_TYPE.injected &&
    event.data.requestId
  ) {
    chrome.runtime.sendMessage(
      { type: MESSAGE_TYPE.content, request: event.data.request },
      (message) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError)
          return
        }

        window.postMessage(
          {
            ...message,
            requestId: event.data.requestId
          },
          window.location.origin
        )
      }
    )
  }
})
