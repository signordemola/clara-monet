import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { apiError } from "@/lib/api-error"

const InvoiceCheckoutSchema = z.object({
  sessionToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = InvoiceCheckoutSchema.safeParse(body)

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

  if (job.stage !== "GALLERY_SENT" || job.balanceStatus !== "PENDING") {
    return apiError(409, "Balance is not due or already paid")
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: job.balanceAmount,
    currency: "gbp",
    metadata: {
      jobId: job.id,
      sessionToken: result.data.sessionToken,
      type: "balance",
    },
  })

  await prisma.job.update({
    where: { id: job.id },
    data: { stripeBalanceIntentId: paymentIntent.id },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
