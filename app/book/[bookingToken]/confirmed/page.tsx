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
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="flex max-w-md flex-col items-center gap-6">
          <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
            Payment received
          </p>
          <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
            You&apos;re nearly there.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your payment has been processed. We&apos;re confirming your booking
            — this takes just a moment. Check your inbox for a confirmation
            email with your signed contract.
          </p>
          <p className="text-xs text-muted-foreground">
            You can safely close this page.
          </p>
        </div>
      </main>
    )
  }

  const portalUrl = `/portal/${inquiry.job.sessionToken}`

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <header className="flex w-full flex-col items-center gap-4">
        <BookingProgress step={3} />
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Booking confirmed
        </p>
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
          You&apos;re booked,{" "}
          <span className="italic">{inquiry.name.split(" ")[0]}.</span>
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your session is confirmed and your signed contract has been sent to{" "}
          <span className="text-ink">{inquiry.email}</span>.
        </p>
      </header>

      <section className="w-full border border-hairline bg-card p-6 text-left">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Session details
          </p>
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

      <section className="flex w-full flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          You&apos;ll receive a questionnaire within 48 hours to help Clara
          prepare for your session.
        </p>
        <a
          href={portalUrl}
          className="inline-flex items-center gap-2 border border-ink bg-ink px-8 py-4 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
        >
          View your client portal →
        </a>
      </section>
    </main>
  )
}
