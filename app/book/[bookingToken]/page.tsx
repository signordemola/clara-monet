import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { SessionSummary } from "@/components/booking/session-summary"
import { ContractViewer } from "@/components/booking/contract-viewer"
import { ContractSignForm } from "@/components/booking/contract-sign-form"
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
      ? `Review your booking · ${inquiry.name} · Clara Monét`
      : "Booking · Clara Monét",
  }
}

export default async function BookingPage({
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
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
        <p className="text-sm text-muted-foreground">
          This booking has already been confirmed.
        </p>
        <a
          href={`/portal/${inquiry.job.sessionToken}`}
          className="text-sm font-medium text-ink underline underline-offset-4"
        >
          Go to your portal →
        </a>
      </main>
    )
  }

  if (inquiry.status !== "APPROVED") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
        <p className="text-sm text-muted-foreground">
          This booking link is not active.
        </p>
      </main>
    )
  }

  const job = inquiry.job
  const pricing = {
    total: job.totalPrice,
    bookingFee: job.bookingFee,
    balance: job.balanceAmount,
    totalFormatted: formatCurrency(job.totalPrice),
    bookingFeeFormatted: formatCurrency(job.bookingFee),
    balanceFormatted: formatCurrency(job.balanceAmount),
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4">
        <BookingProgress step={1} />
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Review and sign
        </h1>
        <p className="text-sm text-muted-foreground">
          Please read the contract below and sign to secure your date.
        </p>
      </header>

      <SessionSummary
        clientName={inquiry.name}
        sessionType={{
          name: job.sessionType.name,
          duration: job.sessionType.duration,
          imageCount: job.sessionType.imageCount,
        }}
        sessionDate={job.sessionDate}
        sessionLocation={job.sessionLocation}
        pricing={pricing}
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-light tracking-tight">
          Contract
        </h2>
        <ContractViewer
          clientName={inquiry.name}
          sessionTypeName={job.sessionType.name}
          sessionDate={job.sessionDate}
          sessionLocation={job.sessionLocation}
          imageCount={job.sessionType.imageCount}
          turnaround={job.sessionType.turnaround}
          totalPrice={job.totalPrice}
          bookingFee={job.bookingFee}
          balanceAmount={job.balanceAmount}
        />
      </section>

      <section className="border border-hairline bg-card p-6">
        <ContractSignForm bookingToken={bookingToken} />
      </section>
    </main>
  )
}
