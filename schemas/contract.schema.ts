import { z } from "zod"

export const ContractSignSchema = z.object({
  typedName: z.string().min(2),
  gdprConsent: z.literal(true),
  modelRelease: z.boolean(),
  termsAgreed: z.literal(true),
})

export type ContractSignInput = z.infer<typeof ContractSignSchema>
