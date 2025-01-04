import {
  JsonConfig,
  LocalStorageConfigKey,
  MessageType,
  BackgroundReceiveMessage,
  BackgroundResponseMessage
} from '@msw-devtools/core'

const sendMessage = <
  M extends BackgroundReceiveMessage,
  R = Extract<BackgroundResponseMessage, { type: M['type'] }>
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

export const setActiveConfig = async (
  host: string,
  key: LocalStorageConfigKey
) => {
  return new Promise<void>((resolve, reject) => {
    sendMessage<
      Extract<
        BackgroundReceiveMessage,
        { type: MessageType.SetActiveJsonConfig }
      >
    >(
      { type: MessageType.SetActiveJsonConfig, key, host },
      (response) => {
        try {
          if (chrome.runtime?.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
          if (response?.status !== 'success') {
            throw new Error('Failed to retrieve the status from background.')
          }
          resolve()
        } catch (e) {
          reject()
        }
      },
      {
        type: MessageType.SetActiveJsonConfig,
        status: 'success'
      }
    )
  })
}

export const removeConfig = async (
  host: string,
  key: LocalStorageConfigKey
) => {
  return new Promise<void>((resolve, reject) => {
    sendMessage<
      Extract<BackgroundReceiveMessage, { type: MessageType.RemoveJsonConfig }>
    >(
      { type: MessageType.RemoveJsonConfig, key, host },
      (response) => {
        try {
          if (chrome.runtime?.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
          if (response?.status !== 'success') {
            throw new Error('Failed to retrieve the status from background.')
          }
          resolve()
        } catch (e) {
          reject()
        }
      },
      {
        type: MessageType.RemoveJsonConfig,
        status: 'success'
      }
    )
  })
}
export const getStatus = async (host: string) => {
  return new Promise<
    Extract<
      BackgroundResponseMessage,
      { type: MessageType.Status; payload: any }
    >['payload']
  >((resolve, reject) => {
    sendMessage<
      Extract<BackgroundReceiveMessage, { type: MessageType.Status }>
    >(
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
            host,
            hasHandle: false,
            hasConfig: false,
            configNames: {}
          })
        }
      },
      {
        type: MessageType.Status,
        status: 'success',
        payload: {
          hasHandle: true,
          hasConfig: true,
          activeConfig: 'host=localhost&name=production&jsonConfig=1',
          configNames: {
            production: {
              key: 'host=localhost&name=production&jsonConfig=1'
            },
            development: {
              key: 'host=localhost&name=development&jsonConfig=1'
            },
            staging: {
              key: 'host=localhost&name=staging&jsonConfig=1'
            }
          },
          host: window.location.host
        }
      }
    )
  })
}

export const saveTo = async (host: string, config: JsonConfig) => {
  return new Promise<void>((resolve, reject) => {
    sendMessage(
      { type: MessageType.SetJsonConfig, config, host },
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
