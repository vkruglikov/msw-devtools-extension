import Tab = chrome.tabs.Tab

type IndexInfo = {
  tabId: number
  host?: string
  windowId?: number
}

export const activeMswResolvers = {
  activeHandlers: new Map(),
  add(index: IndexInfo) {
    if (!this.has(index)) {
      this.activeHandlers.set(index.tabId, index.host)
    }
  },
  remove(index: IndexInfo) {
    if (!this.activeHandlers.has(index.tabId)) return

    this.activeHandlers.delete(index.tabId)
  },
  has(index: IndexInfo) {
    return this.activeHandlers.has(index.tabId)
  }
}

export const getIndexFromTab = (tab: Tab): IndexInfo => {
  return {
    tabId: tab.id!,
    host: new URL(tab.url!).host
  }
}
