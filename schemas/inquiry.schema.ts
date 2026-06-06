import { z } from "zod"

export const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  sessionTypePref: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(1),
})

export type InquiryInput = z.infer<typeof InquirySchema>
