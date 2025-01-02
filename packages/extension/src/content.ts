import { MessageType } from '@msw-devtools/core'
import {
  BackgroundReceiveMessage,
  BackgroundResponseMessage
} from '@msw-devtools/core/src'

const script = document.createElement('script')
script.src = chrome.runtime.getURL('injected.js')
script.onload = () => {
  script.remove()
}
;(document.head || document.documentElement).appendChild(script)

window.addEventListener('message', (event) => {
  if (
    event.source === window &&
    event.data.type === MessageType.Injected &&
    event.data.requestId
  ) {
    chrome.runtime.sendMessage<
      BackgroundReceiveMessage,
      BackgroundResponseMessage
    >({ type: MessageType.Content, request: event.data.request }, (message) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
        window.postMessage(
          {
            type: MessageType.UnhandledRequest
          },
          window.location.origin
        )
        return
      }

      window.postMessage(
        {
          ...message,
          requestId: event.data.requestId
        },
        window.location.origin
      )
    })
  }
})
