;(() => {
  const ws = new WebSocket(process.env.WDS_EXTENSION_CLIENT_URL!)
  let lastHash = ''

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'hash') {
        if (lastHash && data.data !== lastHash) {
          /**
           * For popup and devtools pages and localhost only
           */
          if (
            typeof window !== 'undefined' &&
            typeof window.location?.reload === 'function' &&
            (window.location.protocol.startsWith('chrome') ||
              window.location.hostname === 'localhost')
          ) {
            console.log('Webpack update detected, reloading extension pages...')

            window.location.reload()
          }

          /**
           * For background script
           */
          if (
            typeof chrome !== 'undefined' &&
            typeof chrome.runtime?.reload === 'function'
          ) {
            console.log('Webpack update detected, reloading extension...')

            chrome.runtime.reload()
          }
        }
        lastHash = data.data
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err)
    }
  })
})()
