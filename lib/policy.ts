import { differenceInDays } from "date-fns"
import { providerDateOnly, PROVIDER_TZ } from "./time"
import { formatInTimeZone } from "date-fns-tz"

type CancellationOutcome =
  | { type: "full-refund"; amount: number }
  | { type: "partial-refund"; amount: number }
  | { type: "forfeit"; amount: 0 }

function daysUntil(date: Date): number {
  const nowLocal = formatInTimeZone(new Date(), PROVIDER_TZ, "yyyy-MM-dd")
  const today = providerDateOnly(nowLocal)
  return differenceInDays(date, today)
}

export function getCancellationOutcome(
  sessionDate: Date,
  bookingFee: number
): CancellationOutcome {
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
