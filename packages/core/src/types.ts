import type { JsonConfig } from '@msw-devtools/json-config'
import type { ResponseResolver } from 'msw'

export enum MessageType {
  Content = 'msw-devtools-extension-content',
  HandledRequest = 'msw-devtools-extension_handled',
  SetJsonConfig = 'msw-devtools-extension_setJsonConfig',
  UnhandledRequest = 'msw-devtools-extension_unhandled',
  Status = 'msw-devtools-extension_status',
  Injected = 'msw-devtools-extension-injected'
}

export type MswDevtoolsExtensionTransporter = {
  resolve: (...args: Parameters<ResponseResolver>) => Promise<any>
}

export interface WindowWithMswDevtools {
  __MSW_DEVTOOLS_EXTENSION?: MswDevtoolsExtensionTransporter
}

export type ChromeExtensionLocalStorage = {
  jsonConfig: JsonConfig
}

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
      payload: JsonConfig
    }
  | {
      type: MessageType.Status
    }

export type BackgroundResponseMessage =
  | {
      type: MessageType.HandledRequest
      response: JsonConfig[string]
    }
  | {
      type: MessageType.UnhandledRequest
    }
  | {
      type: MessageType.SetJsonConfig
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
            configIsValid: boolean
          }
        }
    ))

export type { JsonConfig }
