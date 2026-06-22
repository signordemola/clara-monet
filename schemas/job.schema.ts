import { z } from "zod"

export const JobNotesSchema = z.object({
  jobId: z.string().min(1),
  ownerNotes: z.string(),
})

export type JobNotesInput = z.infer<typeof JobNotesSchema>
