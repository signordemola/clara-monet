import { describe, it, expect } from "vitest"
import { getCancellationOutcome, getRefundAmount } from "./policy"
import { Job } from "@/generated/prisma/client"

const makeJob = (sessionDate: Date, bookingFee: number): Job =>
  ({
    sessionDate,
    bookingFee,
  }) as Job

describe("cancellation policy", () => {
  it("full refund 14+ days before session", () => {
    const sessionDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    const outcome = getCancellationOutcome(makeJob(sessionDate, 10000))
    expect(outcome.type).toBe("full-refund")
    expect(outcome.amount).toBe(10000)
    expect(getRefundAmount(makeJob(sessionDate, 10000))).toBe(10000)
  })

  it("partial refund 7–14 days before session", () => {
    const sessionDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    const outcome = getCancellationOutcome(makeJob(sessionDate, 10000))
    expect(outcome.type).toBe("partial-refund")
    expect(outcome.amount).toBe(5000)
  })

  it("forfeits under 7 days before session", () => {
    const sessionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const outcome = getCancellationOutcome(makeJob(sessionDate, 10000))
    expect(outcome.type).toBe("forfeit")
    expect(outcome.amount).toBe(0)
  })

  it("forfeits when session date is missing", () => {
    const outcome = getCancellationOutcome(
      makeJob(null as unknown as Date, 10000)
    )
    expect(outcome.type).toBe("forfeit")
  })
})
