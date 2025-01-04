import { setupWorker } from 'msw/browser'
import { createResponseResolver } from '@msw-devtools/connect'
import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ ping: 'pong' })
  }),
  http.all('*', createResponseResolver())
]

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url:
      process.env.NODE_ENV === 'production'
        ? '/msw-devtools-extension/mockServiceWorker.js'
        : '/mockServiceWorker.js'
  }
})
;(document.getElementById('form') as HTMLFormElement).addEventListener(
  'submit',
  async (e) => {
    e.preventDefault()

    const res = await fetch(
      (document.getElementById('url') as HTMLInputElement).value
    )

    try {
      if (res.ok) {
        document.getElementById('request-response')!.innerText = JSON.stringify(
          await res.json()
        )
      } else {
        document.getElementById('request-response')!.innerText =
          await res.text()
      }
    } catch (e) {
      document.getElementById('request-response')!.innerText = 'Error'
    }
  }
)
