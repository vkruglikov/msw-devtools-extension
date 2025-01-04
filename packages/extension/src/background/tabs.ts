import Tab = chrome.tabs.Tab
import QueryInfo = chrome.tabs.QueryInfo

export const tabsQuery = (info: QueryInfo) =>
  new Promise<Tab[]>((resolve, reject) => {
    try {
      chrome.tabs.query(info, (tabs) => {
        resolve(tabs)
      })
    } catch (e) {
      reject(e)
    }
  })
