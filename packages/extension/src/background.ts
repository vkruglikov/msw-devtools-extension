import { MESSAGE_TYPE } from '@msw-devtools/connect'

const getJsonConfig = () =>
  new Promise<
    | Record<
        string,
        {
          body: BodyInit
          init?: ResponseInit
        }
      >
    | undefined
  >((resolve, reject) => {
    chrome.storage.local.get('jsonConfig', (result) => {
      if (chrome.runtime.lastError) {
        reject(
          'Failed to retrieve JSON config:' + chrome.runtime.lastError.message
        )
      } else {
        console.log('Retrieved JSON config:', result.jsonConfig)
        resolve(result.jsonConfig)
      }
    })
  })

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === MESSAGE_TYPE.content) {
    const url = new URL(message.request.url)
    const path = url.pathname + url.search
    const jsonPathMapper = await getJsonConfig()

    const response = jsonPathMapper
      ? jsonPathMapper[path] || jsonPathMapper[url.origin + path]
      : null

    if (!response) {
      sendResponse({
        type: MESSAGE_TYPE.unhandledRequest
      })
      return true
    }

    sendResponse({
      type: MESSAGE_TYPE.handledRequest,
      response
    })
  } else if (message.type === MESSAGE_TYPE.setJsonConfig) {
    chrome.storage.local.set({ jsonConfig: message.payload }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          'Failed to save JSON config:',
          chrome.runtime.lastError.message
        )
      } else {
        console.log('JSON config saved successfully!')
      }
    })
  }

  return true
})
