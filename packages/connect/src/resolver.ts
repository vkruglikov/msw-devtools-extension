import { HttpResponse, passthrough, ResponseResolver } from 'msw'

import { MESSAGE_TYPE } from './constants'

export const responseResolver: ResponseResolver = ({ requestId, request }) => {
  return new Promise((resolve, reject) => {
    window.postMessage(
      {
        type: MESSAGE_TYPE.injected,
        requestId,
        request: {
          id: requestId,
          method: request.method,
          url: request.url
        }
      },
      window.location.origin
    )
    const handleMessage = (
      e: MessageEvent<{
        type: (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE]
        requestId: string
        response: {
          body: BodyInit
          init?: ResponseInit
        }
      }>
    ) => {
      if (
        e.data.requestId !== requestId ||
        e.data.type === MESSAGE_TYPE.injected
      ) {
        return
      }

      window.removeEventListener('message', handleMessage)

      if (e.data.type === MESSAGE_TYPE.unhandledRequest) {
        resolve(passthrough())
      } else if (e.data.type === MESSAGE_TYPE.handledRequest) {
        resolve(new HttpResponse(e.data.response.body, e.data.response.init))
      }
    }
    window.addEventListener('message', handleMessage)
  })
}

export const createResponseResolver = () => responseResolver
