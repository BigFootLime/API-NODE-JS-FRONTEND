// lib/schema/vaultItem.schema.ts
import { z } from "zod"

export const vaultItemSchema = z.object({
  site: z.string().url({ message: "Site must be a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export type VaultItemInput = z.infer<typeof vaultItemSchema>
