import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { apiError } from "@/lib/api-error"
import { formatCurrency } from "@/lib/utils"

const ValidateSchema = z.object({
  bookingToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = ValidateSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken: result.data.bookingToken },
    include: { job: { include: { sessionType: true } } },
  })

  if (!inquiry) {
    return apiError(404, "Booking link not found")
  }

  if (inquiry.status === "BOOKED") {
    return apiError(410, "This booking link has already been used")
  }

  if (inquiry.status !== "APPROVED") {
    return apiError(403, "This booking link is not active")
  }

  const job = inquiry.job
  if (!job) {
    return apiError(404, "No session details found")
  }

  return NextResponse.json({
    data: {
      clientName: inquiry.name,
      sessionType: {
        name: job.sessionType.name,
        duration: job.sessionType.duration,
        imageCount: job.sessionType.imageCount,
      },
      sessionDate: job.sessionDate,
      sessionLocation: job.sessionLocation,
      pricing: {
        total: job.totalPrice,
        bookingFee: job.bookingFee,
        balance: job.balanceAmount,
        totalFormatted: formatCurrency(job.totalPrice),
        bookingFeeFormatted: formatCurrency(job.bookingFee),
        balanceFormatted: formatCurrency(job.balanceAmount),
      },
    },
  })
}
