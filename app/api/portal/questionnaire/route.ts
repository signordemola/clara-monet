import { NextResponse } from "next/server"
import { z } from "zod"
import { QuestionnaireSchema } from "@/schemas/questionnaire.schema"
import { prisma } from "@/lib/db"
import { apiError } from "@/lib/api-error"

const SubmitSchema = QuestionnaireSchema.extend({
  sessionToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = SubmitSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const job = await prisma.job.findUnique({
    where: { sessionToken: result.data.sessionToken },
  })

  if (!job) {
    return apiError(404, "Session not found")
  }

  if (job.stage !== "QUESTIONNAIRE_SENT") {
    return apiError(409, "Questionnaire already submitted or not available yet")
  }

  const existing = await prisma.questionnaire.findUnique({
    where: { jobId: job.id },
  })

  if (existing) {
    return apiError(409, "Questionnaire already submitted")
  }

  await prisma.questionnaire.create({
    data: {
      jobId: job.id,
      sessionGoal: result.data.sessionGoal,
      participants: result.data.participants,
      locationPref: result.data.locationPref,
      mood: result.data.mood,
      outfitPlans: result.data.outfitPlans,
      moodBoardUrl: result.data.moodBoardUrl || null,
      avoidsNotes: result.data.avoidsNotes,
      imageUsage: result.data.imageUsage,
      additionalNotes: result.data.additionalNotes,
      modelRelease: result.data.modelRelease,
    },
  })

  await prisma.job.update({
    where: { id: job.id },
    data: { stage: "QUESTIONNAIRE_DONE" },
  })

  return NextResponse.json({ submitted: true })
}
