import { differenceInDays } from "date-fns"
import { providerDateOnly, PROVIDER_TZ } from "./time"
import { formatInTimeZone } from "date-fns-tz"
import { Job } from "../generated/prisma/client"

type CancellationOutcome =
  | { type: "full-refund"; amount: number }
  | { type: "partial-refund"; amount: number }
  | { type: "forfeit"; amount: 0 }

function daysUntil(date: Date): number {
  const nowLocal = formatInTimeZone(new Date(), PROVIDER_TZ, "yyyy-MM-dd")
  const today = providerDateOnly(nowLocal)
  return differenceInDays(date, today)
}

function fromSessionDate(
  sessionDate: Date | null,
  bookingFee: number
): CancellationOutcome {
  if (!sessionDate) return { type: "forfeit", amount: 0 }
  const days = daysUntil(sessionDate)

  if (days >= 14) {
    return { type: "full-refund", amount: bookingFee }
  }
  if (days >= 7) {
    const halfFee = Math.round(bookingFee / 2)
    return { type: "partial-refund", amount: halfFee }
  }
  return { type: "forfeit", amount: 0 }
}

export function getCancellationOutcome(job: Job): CancellationOutcome {
  return fromSessionDate(job.sessionDate, job.bookingFee)
}

export function getRefundAmount(job: Job): number {
  return getCancellationOutcome(job).amount
}
