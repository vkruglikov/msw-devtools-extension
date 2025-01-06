import type { JsonConfig } from '@msw-devtools/json-config'
import type { ResponseResolver } from 'msw'

export enum MessageType {
  Content = 'mswde_content',
  HandleInitialized = 'mswde_handleInitialized',
  HandledRequest = 'mswde_handledRequest',
  UnhandledMessageError = 'mswde_unhandledMessageError',
  SetJsonConfig = 'mswde_setJsonConfig',
  RemoveJsonConfig = 'mswde_removeJsonConfig',
  SetActiveJsonConfig = 'mswde_setActiveConfig',
  UnhandledRequest = 'mswde_unhandledRequest',
  Status = 'mswde_status',
  Injected = 'mswde-injected'
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
