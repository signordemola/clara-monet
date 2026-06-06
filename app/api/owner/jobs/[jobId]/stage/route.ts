import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { apiError } from "@/lib/api-error"
import { getNextStage, canAdvanceStage } from "@/lib/stages"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  await requireOwner()
  const { jobId } = await params

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { client: true },
  })

  if (!job) return apiError(404, "Job not found")
  if (!canAdvanceStage(job.stage))
    return apiError(409, "Cannot advance from current stage")

  const nextStage = getNextStage(job.stage)
  if (!nextStage) return apiError(409, "No next stage available")

  await prisma.job.update({
    where: { id: job.id },
    data: { stage: nextStage },
  })

  return NextResponse.json({ success: true, stage: nextStage })
}
