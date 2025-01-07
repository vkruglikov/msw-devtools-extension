import { HttpResponse, ResponseResolver, passthrough } from 'msw'

const responseResolver: ResponseResolver = ({ requestId, request }) => {
  return new Promise((resolve, reject) => {
    if (window.__MSW_DEVTOOLS_EXTENSION?.resolve) {
      window.__MSW_DEVTOOLS_EXTENSION
        .resolve({ requestId, request })
        .then((response) => {
          resolve(new HttpResponse(response.body, response.init))
        })
        .catch(() => {
          resolve(passthrough())
        })
    } else {
      resolve(passthrough())
    }
  })
}

export const createResponseResolver = (): ResponseResolver => {
  if (!window.__MSW_DEVTOOLS_EXTENSION) {
    if (!window.__MSW_DEVTOOLS_EXTENSION_QUEUE) {
      window.__MSW_DEVTOOLS_EXTENSION_QUEUE = []
    }
    window.__MSW_DEVTOOLS_EXTENSION = {
      handleInitialized() {
        window.__MSW_DEVTOOLS_EXTENSION_QUEUE?.push(() => {
          window.__MSW_DEVTOOLS_EXTENSION?.handleInitialized()
        })
      },
      resolve() {
        return Promise.reject('Handle not initialized')
      }
    }
  }

  window.__MSW_DEVTOOLS_EXTENSION.handleInitialized()

  return responseResolver
}
