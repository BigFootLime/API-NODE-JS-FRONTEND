import { z } from "zod"

export const registerSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(2),
  surname: z.string().min(2),
  age: z.coerce.number().int().positive().min(16,"Il faut avoir minimum 16 ans").max(100),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().optional(),
  phone: z.string().optional(),
})

export type RegisterSchema = z.infer<typeof registerSchema>
