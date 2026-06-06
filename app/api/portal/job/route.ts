import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { apiError } from "@/lib/api-error"
import { STAGE_LABEL, STAGE_DESCRIPTION } from "@/lib/stages"
import { formatCurrency } from "@/lib/utils"

const JobStatusSchema = z.object({
  sessionToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = JobStatusSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const job = await prisma.job.findUnique({
    where: { sessionToken: result.data.sessionToken },
    include: {
      client: true,
      sessionType: true,
      questionnaire: true,
    },
  })

  if (!job) {
    return apiError(404, "Session not found")
  }

  return NextResponse.json({
    data: {
      stage: job.stage,
      stageLabel: STAGE_LABEL[job.stage],
      stageDescription: STAGE_DESCRIPTION[job.stage],
      clientName: job.client.name,
      sessionType: job.sessionType.name,
      sessionDate: job.sessionDate,
      sessionLocation: job.sessionLocation,
      galleryUrl: job.galleryUrl,
      invoice:
        job.stage === "GALLERY_SENT" && job.balanceStatus === "PENDING"
          ? {
              balanceAmount: job.balanceAmount,
              balanceFormatted: formatCurrency(job.balanceAmount),
              dueDate: job.balanceDueAt,
            }
          : null,
      questionnaireSubmitted: !!job.questionnaire,
    },
  })
}
