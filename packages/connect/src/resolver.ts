import { passthrough, ResponseResolver, HttpResponse } from 'msw'

export const responseResolver: ResponseResolver = ({ requestId, request }) => {
  return new Promise((resolve, reject) => {
    if (window.__MSW_DEVTOOLS_EXTENSION?.resolve) {
      window.__MSW_DEVTOOLS_EXTENSION
        .resolve({ requestId, request })
        .then((response) => {
          resolve(new HttpResponse(response.body, response.init))
        })
        .catch((e) => {
          console.log(e)
          resolve(passthrough())
        })
    } else {
      resolve(passthrough())
    }
  })
}

export const createResponseResolver = () => responseResolver
