import { NextResponse } from "next/server"
import { GalleryDeliverySchema } from "@/schemas/gallery.schema"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { apiError } from "@/lib/api-error"
import { resend } from "@/lib/resend"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  await requireOwner()
  const { jobId } = await params

  const body = await req.json()
  const result = GalleryDeliverySchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { client: true },
  })

  if (!job) return apiError(404, "Job not found")
  if (job.stage !== "SESSION_COMPLETE") {
    return apiError(
      409,
      "Gallery can only be delivered after session is complete"
    )
  }

  const now = new Date()
  const balanceDueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  await prisma.job.update({
    where: { id: job.id },
    data: {
      galleryUrl: result.data.galleryUrl,
      imageCount: result.data.imageCount,
      galleryDeliveredAt: now,
      balanceInvoiceSentAt: now,
      balanceDueAt,
      stage: "GALLERY_SENT",
    },
  })

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: job.client.email,
      subject: "Your gallery is ready — Clara Monét Photography",
      text: `Your gallery is ready: ${result.data.galleryUrl}\n\nBalance of £${(job.balanceAmount / 100).toFixed(2)} due by ${balanceDueAt.toLocaleDateString("en-GB")}`,
    })
  } catch {
    // non-blocking
  }

  return NextResponse.json({ delivered: true })
}
