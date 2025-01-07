import { activeMswResolvers } from './background/activeMswResolvers'
import { handleMessage } from './background/messages'

chrome.tabs.onRemoved.addListener((tabId) => {
  activeMswResolvers.remove({
    tabId
  })
})
chrome.runtime.onInstalled.addListener(() => {
  /**
   * Because the extension has pre-release version, which may have breaking changes,
   */
  chrome.storage.local.clear().catch((e) => {
    console.info('[mswde] Clear storage after install', e)
  })
})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || !/^https?:/.test(tab.url)) return

  if (changeInfo.status === 'loading') {
    activeMswResolvers.remove({
      tabId
    })
  } else if (changeInfo.status === 'complete') {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      })
    } catch (e) {
      console[e?.toString().includes('showing error page') ? 'info' : 'error'](
        '[mswde] Inject content script',
        e
      )
    }
  }
})
chrome.runtime.onMessage.addListener(handleMessage)
