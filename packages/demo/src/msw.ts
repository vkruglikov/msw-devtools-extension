import { HttpResponse, http } from 'msw'
import { setupWorker } from 'msw/browser'

import { createResponseResolver } from '@msw-devtools/connect'

const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ ping: 'pong' })
  }),
  http.all('*', createResponseResolver())
]

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${process.env.PUBLIC_PATH || '/'}mockServiceWorker.js`
  }
})
