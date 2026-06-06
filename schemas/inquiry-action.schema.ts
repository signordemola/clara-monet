import { z } from "zod"

export const ApproveInquirySchema = z.object({
  inquiryId: z.string().min(1),
  sessionTypeId: z.string().min(1),
  sessionDate: z.string().optional(),
  sessionLocation: z.string().optional(),
  ownerMessage: z.string().optional(),
})

export const DeclineInquirySchema = z.object({
  inquiryId: z.string().min(1),
  declineReason: z.string().optional(),
})

export type ApproveInquiryInput = z.infer<typeof ApproveInquirySchema>
export type DeclineInquiryInput = z.infer<typeof DeclineInquirySchema>
