import { z } from "zod"

export const AdvanceStageSchema = z.object({
  jobId: z.string().min(1),
})

export const JobNotesSchema = z.object({
  jobId: z.string().min(1),
  ownerNotes: z.string(),
})

export type AdvanceStageInput = z.infer<typeof AdvanceStageSchema>
export type JobNotesInput = z.infer<typeof JobNotesSchema>
