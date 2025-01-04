import type { JsonConfig } from './config'
import type { ResponseResolver } from 'msw'

export enum MessageType {
  Content = 'msw-devtools-extension-content',
  HandleInitialized = 'msw-devtools-extension_handleInitialized',
  HandledRequest = 'msw-devtools-extension_handled',
  UnhandledMessageError = 'msw-devtools-extension_unhandledMessageError',
  SetJsonConfig = 'msw-devtools-extension_setJsonConfig',
  RemoveJsonConfig = 'msw-devtools-extension_removeJsonConfig',
  SetActiveJsonConfig = 'msw-devtools-extension_setActive',
  UnhandledRequest = 'msw-devtools-extension_unhandled',
  Status = 'msw-devtools-extension_status',
  Injected = 'msw-devtools-extension-injected'
}

export type MswDevtoolsExtensionProxy = {
  resolve: (...args: Parameters<ResponseResolver>) => Promise<any>
  handleInitialized: () => void
}

export interface WindowWithMswDevtools {
  __MSW_DEVTOOLS_EXTENSION?: MswDevtoolsExtensionProxy
  __MSW_DEVTOOLS_EXTENSION_QUEUE?: (() => void)[]
}

export type LocalStorageConfigKey = `host=${string}&name=${string}&jsonConfig=1`

export type LocalStorageActiveConfigKey = `host=${string}&activeJsonConfigKey=1`

export type ChromeExtensionLocalStorageConfig = {
  [key in LocalStorageConfigKey]?: JsonConfig
}

export type ChromeExtensionLocalStorageActiveKey = {
  [key in LocalStorageActiveConfigKey]?: LocalStorageConfigKey
}

export type ChromeExtensionLocalStorage = ChromeExtensionLocalStorageConfig &
  ChromeExtensionLocalStorageActiveKey

export type BackgroundReceiveMessage =
  | {
      type: MessageType.Content
      request: {
        url: string
        method: string
      }
    }
  | {
      type: MessageType.SetJsonConfig
      host: string
      config: JsonConfig
    }
  | {
      type: MessageType.Status
    }
  | {
      type: MessageType.HandleInitialized
      host: string
    }
  | {
      type: MessageType.RemoveJsonConfig
      key: LocalStorageConfigKey
      host: string
    }
  | {
      type: MessageType.SetActiveJsonConfig
      key: LocalStorageConfigKey
      host: string
    }

export type BackgroundResponseMessage =
  | {
      type: MessageType.HandledRequest
      response: JsonConfig['handlers'][string]
    }
  | {
      type: MessageType.UnhandledRequest
    }
  | {
      type: MessageType.UnhandledMessageError
    }
  | {
      type: MessageType.SetJsonConfig
      status: 'success'
    }
  | {
      type: MessageType.HandleInitialized
      status: 'success'
    }
  | ({
      type: MessageType.Status
    } & (
      | { status: 'error' }
      | {
          status: 'success'
          payload: {
            host: string
            hasHandle: boolean
            hasConfig: boolean
            activeConfig?: LocalStorageConfigKey
            configNames: Record<
              string,
              {
                key: LocalStorageConfigKey
              }
            >
          }
        }
    ))
  | {
      type: MessageType.RemoveJsonConfig
      status: 'success'
    }
  | {
      type: MessageType.SetActiveJsonConfig
      status: 'success'
    }

export type { JsonConfig }
