import {
  BackgroundResponseMessage,
  ChromeExtensionLocalStorage,
  JsonConfig,
  LocalStorageConfigKey,
  MessageType,
  ChromeExtensionLocalStorageActiveKey,
  ChromeExtensionLocalStorageConfig
} from '@msw-devtools/core'

const getJsonConfigStorageKeys = async (host: string) => {
  const keys = (
    (await chrome.storage.local.getKeys()) as (keyof ChromeExtensionLocalStorage)[]
  ).filter((key) => {
    const params = Object.fromEntries(new URLSearchParams(key))

    return params.jsonConfig && params.host === host
  }) as LocalStorageConfigKey[]

  return keys
}

export const getJsonConfigNames = async (
  host: string
): Promise<
  Extract<
    BackgroundResponseMessage,
    {
      type: MessageType.Status
      payload: any
    }
  >['payload']['configNames']
> => {
  const keys = await getJsonConfigStorageKeys(host)

  const names = Object.entries(
    await chrome.storage.local.get<ChromeExtensionLocalStorageConfig>(keys)
  ).reduce(
    (memo, [key, config]) => {
      if (!config) return memo

      memo[config.name] = {
        key: key as LocalStorageConfigKey
      }
      return memo
    },
    {} as Extract<
      BackgroundResponseMessage,
      {
        type: MessageType.Status
        payload: any
      }
    >['payload']['configNames']
  )

  return names
}

export const getActiveJsonConfig = async (host: string) => {
  const queryKey = `host=${host}&activeJsonConfigKey=1` as const

  return (
    await chrome.storage.local.get<ChromeExtensionLocalStorageActiveKey>(
      queryKey
    )
  )[queryKey]
}

export const setActiveJsonConfig = async ({
  host,
  key
}: {
  host: string
  key?: LocalStorageConfigKey
}) => {
  const queryKey = `host=${host}&activeJsonConfigKey=1` as const

  if (key) {
    await chrome.storage.local.set<ChromeExtensionLocalStorageActiveKey>({
      [queryKey]: key
    })
  } else {
    await chrome.storage.local.remove<ChromeExtensionLocalStorage>(queryKey)
  }
}

export const getJsonConfig = async (host: string) => {
  const activeKey = await getActiveJsonConfig(host)

  const result =
    await chrome.storage.local.get<ChromeExtensionLocalStorage>(activeKey)

  return activeKey && result[activeKey]
    ? {
        key: activeKey,
        config: result[activeKey]
      }
    : null
}

export const removeJsonConfig = async (
  key: LocalStorageConfigKey,
  host: string
) => {
  await chrome.storage.local.remove(key)

  const activeKey = await getActiveJsonConfig(host)

  if (activeKey === key) {
    const allKeys = await getJsonConfigStorageKeys(host)

    if (allKeys[0]) {
      await setActiveJsonConfig({
        host,
        key: allKeys[0]
      })
    } else {
      await setActiveJsonConfig({ host })
    }
  }
}

export const setJsonConfig = async (host: string, jsonConfig: JsonConfig) => {
  const queryKey = `host=${host}&name=${jsonConfig.name}&jsonConfig=1` as const

  await chrome.storage.local.set<ChromeExtensionLocalStorageConfig>({
    [queryKey]: jsonConfig
  })
  const activeKey = await getActiveJsonConfig(host)

  if (!activeKey) {
    await setActiveJsonConfig({
      host,
      key: queryKey
    })
  }
}
