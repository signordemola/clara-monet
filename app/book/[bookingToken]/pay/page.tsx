import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { BookingPaymentClient } from "./booking-payment-client"
import { BookingProgress } from "@/components/booking/booking-progress"
import { formatCurrency } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookingToken: string }>
}): Promise<Metadata> {
  const { bookingToken } = await params
  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken },
  })
  return {
    title: inquiry
      ? `Payment · ${inquiry.name} · Clara Monét`
      : "Payment · Clara Monét",
  }
}

export default async function BookingPayPage({
  params,
}: {
  params: Promise<{ bookingToken: string }>
}) {
  const { bookingToken } = await params
  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken },
    include: { job: { include: { sessionType: true } } },
  })

  if (!inquiry || !inquiry.job) notFound()

  if (inquiry.status === "BOOKED") {
    redirect(`/book/${bookingToken}/confirmed`)
  }

  if (!inquiry.job.contractSignedAt) {
    redirect(`/book/${bookingToken}`)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-8 px-6 py-12">
      <header className="flex w-full flex-col gap-4">
        <BookingProgress step={2} />
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Pay booking fee
        </h1>
        <p className="text-sm text-muted-foreground">
          Pay {formatCurrency(inquiry.job.bookingFee)} to secure your{" "}
          {inquiry.job.sessionType.name.toLowerCase()} session.
        </p>
      </header>

      <section className="w-full border border-hairline bg-card p-6">
        <BookingPaymentClient bookingToken={bookingToken} />
      </section>
    </main>
  )
}
