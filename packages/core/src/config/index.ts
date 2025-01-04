import { z } from 'zod'

export const MAJOR_CONFIG_VERSION = 1

export const jsonConfigSchema = z.object({
  version: z.literal(MAJOR_CONFIG_VERSION),
  name: z.string().min(3).max(50),
  handlers: z.record(
    z.string(),
    z.object({
      method: z.enum([
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'HEAD',
        'OPTIONS'
      ]),
      body: z.union([z.object({}).catchall(z.any()), z.string()]),
      init: z.object({
        headers: z
          .object({
            'Content-Type': z.string()
          })
          .catchall(z.string()),
        status: z.number().int().min(100).max(599).optional()
      })
    })
  )
})

export type JsonConfig = z.infer<typeof jsonConfigSchema>

export const validateJsonConfig = (data: any): JsonConfig =>
  jsonConfigSchema.parse(data)

export { ZodError as ValidationError } from 'zod'
