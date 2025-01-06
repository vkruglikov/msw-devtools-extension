import { http, HttpResponse } from 'msw'
import { createResponseResolver } from '@msw-devtools/connect'
import { setupWorker } from 'msw/browser'

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
