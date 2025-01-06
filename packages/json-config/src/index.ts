export * from './schemas'
import { jsonConfigSchema, JsonConfig } from './schemas'

export const validateJsonConfig = (data: any): JsonConfig =>
  jsonConfigSchema.parse(data)

export { ZodError as ValidationError } from 'zod'
