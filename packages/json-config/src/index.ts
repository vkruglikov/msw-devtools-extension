import { z } from 'zod'

export const jsonConfigSchema = z.record(
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

export const validate = (data: any) => jsonConfigSchema.parse(data)

export type JsonConfig = z.infer<typeof jsonConfigSchema>
