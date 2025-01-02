;(() => {
  const socket = new WebSocket(`ws://localhost:${process.env.WDS_PORT}/ws`)

  let lastHash = ''

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'hash') {
        if (lastHash && data.data !== lastHash) {
          console.log('Webpack update detected, reloading extension...')
          chrome.runtime.reload()
        }
        lastHash = data.data
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err)
    }
  })
})()
