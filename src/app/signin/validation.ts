import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must not exceed 32 characters'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
