import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { apiError } from "@/lib/api-error"

const ConfirmedSchema = z.object({
  bookingToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = ConfirmedSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken: result.data.bookingToken },
    include: {
      job: { include: { sessionType: true, client: true } },
    },
  })

  if (!inquiry || !inquiry.job) {
    return apiError(404, "Booking not found")
  }

  if (inquiry.status !== "BOOKED") {
    return apiError(409, "Booking is not yet confirmed")
  }

  return NextResponse.json({
    data: {
      clientName: inquiry.name,
      sessionTypeName: inquiry.job.sessionType.name,
      sessionDate: inquiry.job.sessionDate,
      sessionLocation: inquiry.job.sessionLocation,
      sessionToken: inquiry.job.sessionToken,
      portalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${inquiry.job.sessionToken}`,
    },
  })
}
