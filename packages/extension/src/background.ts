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
  chrome.storage.local.clear()
})
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url || !/^https?:/.test(tab.url)) return

  if (changeInfo.status === 'loading') {
    activeMswResolvers.remove({
      tabId
    })
  } else if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    })
  }
})
chrome.runtime.onMessage.addListener(handleMessage)
