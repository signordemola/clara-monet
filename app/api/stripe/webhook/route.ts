import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { resend } from "@/lib/resend"
import { generateSessionToken } from "@/lib/tokens"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (
    event.type !== "payment_intent.succeeded" &&
    event.type !== "payment_intent.payment_failed"
  ) {
    return NextResponse.json({ received: true })
  }

  const paymentIntent = event.data.object
  const metadata = paymentIntent.metadata
  const paymentType = metadata.type

  if (event.type === "payment_intent.succeeded") {
    if (paymentType === "booking-fee") {
      const existingJob = await prisma.job.findFirst({
        where: { stripeBookingIntentId: paymentIntent.id },
      })
      if (existingJob) {
        return NextResponse.json({ received: true })
      }

      const inquiry = await prisma.inquiry.findUnique({
        where: { id: metadata.inquiryId },
        include: { job: true },
      })

      if (!inquiry || !inquiry.job) {
        return NextResponse.json({ received: true })
      }

      const client = await prisma.client.upsert({
        where: { email: inquiry.email },
        update: { name: inquiry.name },
        create: {
          email: inquiry.email,
          name: inquiry.name,
          gdprConsent: true,
          gdprConsentAt: new Date(),
        },
      })

      const sessionToken = generateSessionToken()

      await prisma.job.update({
        where: { id: inquiry.job.id },
        data: {
          stripeBookingIntentId: paymentIntent.id,
          bookingFeeStatus: "HELD",
          sessionToken,
          clientId: client.id,
        },
      })

      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { status: "BOOKED" },
      })

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: inquiry.email,
          subject: "You're booked — Clara Monét Photography",
          text: `Thanks ${inquiry.name}. Your booking is confirmed. View your session portal here: ${process.env.NEXT_PUBLIC_BASE_URL}/portal/${sessionToken}`,
        })
      } catch {
        // non-blocking
      }
    }

    if (paymentType === "balance") {
      const existingJob = await prisma.job.findFirst({
        where: { stripeBalanceIntentId: paymentIntent.id },
      })
      if (existingJob) {
        return NextResponse.json({ received: true })
      }

      const job = await prisma.job.findFirst({
        where: { id: metadata.jobId },
      })

      if (job && job.balanceStatus === "PENDING") {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            stripeBalanceIntentId: paymentIntent.id,
            balanceStatus: "PAID",
            balancePaidAt: new Date(),
            stage: "PAID",
          },
        })
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    // log and continue — no action needed
  }

  return NextResponse.json({ received: true })
}
