import { z } from 'zod'

export { ZodError as ValidationError } from 'zod'

const MAJOR_CONFIG_VERSION = 1

export type JsonConfig = z.infer<typeof jsonConfigSchema>

/**
 * Every time, don't forget to run `npm run docs`
 */
export const jsonConfigHandler = z
  .object({
    method: z
      .enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
      .describe('HTTP method to intercept.'),
    body: z
      .union([z.object({}).catchall(z.any()), z.string()])
      .describe("Response's body. Can be a string or a JSON object."),
    init: z
      .object({
        headers: z
          .object({
            'Content-Type': z.string()
          })
          .catchall(z.union([z.string(), z.null()]))
          .describe('Response headers.'),
        status: z
          .number()
          .int()
          .min(100)
          .max(599)
          .optional()
          .describe('Response status code.')
      })
      .describe('Response init object.')
  })
  .describe('Response configuration.')

export const jsonConfigSchema = z
  .object({
    version: z
      .literal(MAJOR_CONFIG_VERSION)
      .describe(
        'Major version of the config. If it changes, the config should ' +
          'not be compatible with the previous version.'
      ),
    name: z
      .string()
      .min(3)
      .max(50)
      .describe(
        "Name of the config. This name displayed in the extension's list " +
          'of configs. Should be unique per host.'
      ),
    handlers: z
      .record(
        z
          .string()
          .describe(
            'Url path or full URL to intercept. ' +
              'Example: "/api", "http://localhost:3000/api"'
          ),
        jsonConfigHandler
      )
      .describe('List of handlers to intercept.')
  })
  .describe('JSON configuration schema.')

export const validateJsonConfig = (data: any): JsonConfig =>
  jsonConfigSchema.parse(data)
