import {
  MessageType,
  BackgroundReceiveMessage,
  ChromeExtensionLocalStorage,
  BackgroundResponseMessage
} from '@msw-devtools/core'

const getJsonConfig = () =>
  new Promise<ChromeExtensionLocalStorage['jsonConfig']>((resolve, reject) => {
    try {
      chrome.storage.local.get<ChromeExtensionLocalStorage>(
        'jsonConfig',
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message)
          } else {
            resolve(result.jsonConfig)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })

chrome.runtime.onMessage.addListener(
  (
    message: BackgroundReceiveMessage,
    sender,
    sendResponse: (response: BackgroundResponseMessage) => void
  ) => {
    if (message.type === MessageType.Content) {
      const url = new URL(message.request.url)
      const path = url.pathname + url.search

      getJsonConfig()
        .then((jsonPathMapper) => {
          const response = jsonPathMapper
            ? jsonPathMapper[path] || jsonPathMapper[url.origin + path]
            : null

          if (
            !response ||
            message.request.method !== (response.method || 'GET')
          ) {
            return Promise.reject('No response found')
          }

          sendResponse({
            type: MessageType.HandledRequest,
            response: {
              ...response,
              body:
                typeof response.body !== 'string'
                  ? JSON.stringify(response.body)
                  : response.body
            }
          })
        })
        .catch(() => {
          sendResponse({
            type: MessageType.UnhandledRequest
          })
        })
    } else if (message.type === MessageType.SetJsonConfig) {
      chrome.storage.local.set<ChromeExtensionLocalStorage>(
        { jsonConfig: message.payload },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              'Failed to save JSON config:',
              chrome.runtime.lastError.message
            )
          }

          sendResponse({ type: message.type, status: 'success' })
        }
      )
    } else if (message.type === MessageType.Status) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        try {
          const tabUrl = tabs[0]?.url
          if (!tabUrl) {
            throw new Error('Failed to retrieve the active tab URL.')
          }

          const host = new URL(tabUrl).host

          sendResponse({
            type: message.type,
            status: 'success',
            payload: {
              host,
              hasHandle: true,
              hasConfig: true,
              configIsValid: true
            }
          })
        } catch (e) {
          console.error(e)
          sendResponse({
            type: message.type,
            status: 'error'
          })
        }
      })
    }

    return true
  }
)
