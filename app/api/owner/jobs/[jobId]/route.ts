import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { apiError } from "@/lib/api-error"
import { JobNotesSchema } from "@/schemas/job.schema"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  await requireOwner()
  const { jobId } = await params

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      client: true,
      sessionType: true,
      questionnaire: true,
      inquiry: true,
    },
  })

  if (!job) return apiError(404, "Job not found")

  return NextResponse.json({ data: job })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  await requireOwner()
  const { jobId } = await params

  const body = await req.json()
  const result = JobNotesSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { ownerNotes: result.data.ownerNotes },
  })

  return NextResponse.json({ success: true })
}
