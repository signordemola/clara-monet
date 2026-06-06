import { z } from "zod"

export const QuestionnaireSchema = z.object({
  sessionGoal: z.string().optional(),
  participants: z.string().optional(),
  locationPref: z.string().optional(),
  mood: z.string().optional(),
  outfitPlans: z.string().optional(),
  moodBoardUrl: z.url().optional().or(z.literal("")),
  avoidsNotes: z.string().optional(),
  imageUsage: z.string().optional(),
  additionalNotes: z.string().optional(),
  modelRelease: z.boolean(),
})

export type QuestionnaireInput = z.infer<typeof QuestionnaireSchema>
