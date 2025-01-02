import { MessageType } from '@msw-devtools/core'
import {
  BackgroundReceiveMessage,
  BackgroundResponseMessage
} from '@msw-devtools/core/src'

const sendMessage = <
  M extends BackgroundReceiveMessage,
  R extends BackgroundResponseMessage
>(
  message: M,
  responseCallback: (response: R) => void,
  __devFallback?: R
) => {
  if (chrome.runtime?.sendMessage) {
    return chrome.runtime.sendMessage(message, responseCallback)
  }

  if (__devFallback && process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      responseCallback(__devFallback)
    }, 500)
  }
}

export const getStatus = async () => {
  return new Promise<{
    hasHandle: boolean
    hasConfig: boolean
    configIsValid: boolean
    host?: string
  }>((resolve, reject) => {
    sendMessage(
      { type: MessageType.Status },
      (response) => {
        try {
          if (chrome.runtime?.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
          if (response?.status !== 'success') {
            throw new Error('Failed to retrieve the status from background.')
          }
          resolve(response.payload)
        } catch (e) {
          resolve({
            hasHandle: false,
            hasConfig: false,
            configIsValid: false
          })
        }
      },
      {
        type: MessageType.Status,
        status: 'success',
        payload: {
          hasHandle: true,
          hasConfig: true,
          configIsValid: true,
          host: 'localhost:3000'
        }
      }
    )
  })
}
export const saveTo = async (...asd: any[]) => {
  const jsonData = asd[0]
  return new Promise<void>((resolve, reject) => {
    sendMessage(
      { type: MessageType.SetJsonConfig, payload: jsonData },
      (response) => {
        try {
          if (chrome.runtime?.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
          if (response?.status !== 'success') {
            throw new Error('Failed to process the JSON in background.')
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      {
        type: MessageType.SetJsonConfig,
        status: 'success'
      }
    )
  })
}
