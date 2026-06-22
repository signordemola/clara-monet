import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { BookingProgress } from "@/components/booking/booking-progress"
import { formatDate, formatTime } from "@/lib/utils"

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
      ? `You're booked · ${inquiry.name} · Clara Monét`
      : "Confirmed · Clara Monét",
  }
}

export default async function BookingConfirmedPage({
  params,
}: {
  params: Promise<{ bookingToken: string }>
}) {
  const { bookingToken } = await params
  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken },
    include: { job: { include: { sessionType: true, client: true } } },
  })

  if (!inquiry || !inquiry.job) notFound()

  if (inquiry.status !== "BOOKED") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Your booking is being processed. Please check your email shortly.
        </p>
      </main>
    )
  }

  const portalUrl = `/portal/${inquiry.job.sessionToken}`

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4">
        <BookingProgress step={3} />
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          You&apos;re booked, {inquiry.name}.
        </h1>
      </header>

      <section className="border border-hairline bg-card p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Session</p>
          <p className="font-display text-xl font-light tracking-tight">
            {inquiry.job.sessionType.name}
          </p>
          <p className="text-sm">
            {inquiry.job.sessionDate
              ? `${formatDate(inquiry.job.sessionDate)} at ${formatTime(inquiry.job.sessionDate)}`
              : "Date to be confirmed"}
          </p>
          <p className="text-sm text-muted-foreground">
            {inquiry.job.sessionLocation ?? "Location to be confirmed"}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Check your email — your signed contract has been sent as a PDF.
        </p>
        <p className="text-sm text-muted-foreground">
          You&apos;ll receive a questionnaire in the next 48 hours.
        </p>
        <a
          href={portalUrl}
          className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition hover:bg-ink/90"
        >
          Track your session in your portal →
        </a>
      </section>
    </main>
  )
}
