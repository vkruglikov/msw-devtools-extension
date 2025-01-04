import {
  BackgroundReceiveMessage,
  BackgroundResponseMessage,
  MessageType
} from '@msw-devtools/core'

import { tabsQuery } from './tabs'
import {
  getJsonConfig,
  setJsonConfig,
  getJsonConfigNames,
  removeJsonConfig,
  setActiveJsonConfig
} from './storage'
import { activeMswResolvers, getIndexFromTab } from './activeMswResolvers'

type HandlersMap = {
  [K in BackgroundReceiveMessage['type']]: (
    message: Extract<BackgroundReceiveMessage, { type: K }>,
    sender: chrome.runtime.MessageSender
  ) => Promise<
    Extract<
      BackgroundResponseMessage,
      {
        type: K | MessageType.HandledRequest | MessageType.UnhandledRequest
      }
    >
  >
}

const messages: HandlersMap = {
  [MessageType.SetActiveJsonConfig]: async ({ key, host }) => {
    await setActiveJsonConfig({ key, host })
    return { type: MessageType.SetActiveJsonConfig, status: 'success' }
  },
  [MessageType.RemoveJsonConfig]: async ({ key, host }) => {
    await removeJsonConfig(key, host)
    return { type: MessageType.RemoveJsonConfig, status: 'success' }
  },
  [MessageType.HandleInitialized]: async ({ type, host }, sender) => {
    activeMswResolvers.add({
      tabId: sender.tab!.id!,
      host
    })

    return { type, status: 'success' }
  },
  [MessageType.Content]: async (message, sender) => {
    try {
      const host = new URL(sender.origin!).host

      const { config } = (await getJsonConfig(host)) || {}

      const url = new URL(message.request.url)
      const path = url.pathname + url.search

      const response = config
        ? config.handlers[path] || config.handlers[url.origin + path]
        : null

      if (!response || message.request.method !== response.method) {
        throw new Error('No response found')
      }

      return {
        type: MessageType.HandledRequest,
        response: {
          ...response,
          body:
            typeof response.body !== 'string'
              ? JSON.stringify(response.body)
              : response.body
        }
      }
    } catch (e) {
      return {
        type: MessageType.UnhandledRequest
      }
    }
  },
  [MessageType.SetJsonConfig]: async ({ type, config, host }) => {
    await setJsonConfig(host, config)

    return { type, status: 'success' }
  },
  [MessageType.Status]: async (message) => {
    try {
      const tabs = await tabsQuery({ active: true, currentWindow: true })
      const activeTab = tabs[0]

      if (!activeTab || !activeTab.url) {
        throw new Error('Failed to retrieve the active tab')
      }
      const host = new URL(activeTab.url).host

      let hasConfig = false
      let currentConfig: Awaited<ReturnType<typeof getJsonConfig>> = null
      let configNames: Awaited<ReturnType<typeof getJsonConfigNames>> = {}

      try {
        currentConfig = await getJsonConfig(host)

        configNames = await getJsonConfigNames(host)
        hasConfig = !!currentConfig
      } catch (e) {
        console.error(e)
      }

      return {
        type: message.type,
        status: 'success',
        payload: {
          host,
          hasHandle: activeMswResolvers.has(getIndexFromTab(activeTab)),
          hasConfig,
          configNames,
          activeConfig: currentConfig?.key
        }
      }
    } catch (e) {
      return {
        type: message.type,
        status: 'error'
      }
    }
  }
}

export const handleMessage = (
  message: BackgroundReceiveMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: BackgroundResponseMessage) => void
) => {
  if (messages[message.type]) {
    messages[message.type](message as any, sender)
      .then(sendResponse)
      .catch((e) => {
        console.error(e)
        sendResponse({ type: MessageType.UnhandledMessageError })
      })
    return true
  }
}
