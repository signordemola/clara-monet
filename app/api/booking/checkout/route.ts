import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { apiError } from "@/lib/api-error"

const CheckoutSchema = z.object({
  bookingToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = CheckoutSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken: result.data.bookingToken },
    include: { job: true },
  })

  if (!inquiry || !inquiry.job) {
    return apiError(404, "Booking not found")
  }

  if (inquiry.status === "BOOKED") {
    return apiError(409, "Booking fee already paid")
  }

  if (!inquiry.job.contractSignedAt) {
    return apiError(403, "Contract must be signed before payment")
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: inquiry.job.bookingFee,
    currency: "gbp",
    metadata: {
      inquiryId: inquiry.id,
      jobId: inquiry.job.id,
      email: inquiry.email,
      bookingToken: result.data.bookingToken,
      type: "booking-fee",
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
