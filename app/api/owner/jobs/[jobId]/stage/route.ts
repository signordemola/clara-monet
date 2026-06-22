import { NextResponse } from "next/server"
import { render } from "@react-email/components"
import { EditingUnderwayEmail } from "@/emails/editing-underway"
import { ReviewRequestEmail } from "@/emails/review-request"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { resend } from "@/lib/resend"
import { apiError } from "@/lib/api-error"
import { getNextStage, canAdvanceStage } from "@/lib/stages"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const [resolvedParams] = await Promise.all([params, requireOwner()])
  const { jobId } = resolvedParams

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      client: true,
      sessionType: true,
      questionnaire: { select: { id: true } },
    },
  })

  if (!job) return apiError(404, "Job not found")
  if (!canAdvanceStage(job))
    return apiError(409, "Cannot advance from current stage")

  const nextStage = getNextStage(job.stage)
  if (!nextStage) return apiError(409, "No next stage available")

  await prisma.job.update({
    where: { id: job.id },
    data: { stage: nextStage },
  })

  const portalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${job.sessionToken}`

  if (nextStage === "SESSION_COMPLETE") {
    try {
      const html = await render(
        EditingUnderwayEmail({
          clientName: job.client.name,
          sessionType: job.sessionType.name,
          turnaround: job.sessionType.turnaround,
          portalUrl,
        })
      )

      await prisma.job.update({
        where: { id: job.id },
        data: { editingEmailSentAt: new Date() },
      })

      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: job.client.email,
        subject: "Editing is underway — Clara Monét Photography",
        html,
      })
    } catch {}
  }

  if (nextStage === "COMPLETE") {
    try {
      const reviewUrl =
        process.env.REVIEW_URL ?? `${process.env.NEXT_PUBLIC_BASE_URL}`
      const html = await render(
        ReviewRequestEmail({
          clientName: job.client.name,
          sessionType: job.sessionType.name,
          reviewUrl,
        })
      )

      await prisma.job.update({
        where: { id: job.id },
        data: { reviewRequestSentAt: new Date() },
      })

      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: job.client.email,
        subject: "A quick favour — Clara Monét Photography",
        html,
      })
    } catch {}
  }

  return NextResponse.json({ success: true, stage: nextStage })
}
