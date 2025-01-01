import { setupWorker } from 'msw/browser'
import { createResponseResolver } from '@msw-devtools/connect'
import { http } from 'msw'

const handlers = [http.all('*', createResponseResolver())]

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass'
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
