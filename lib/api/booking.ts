export type BookingDetails = {
  clientName: string
  sessionType: {
    name: string
    duration: number
    imageCount: string
  }
  sessionDate: Date | null
  sessionLocation: string | null
  pricing: {
    total: number
    bookingFee: number
    balance: number
    totalFormatted: string
    bookingFeeFormatted: string
    balanceFormatted: string
  }
}

export const getBookingDetails = async (
  bookingToken: string
): Promise<BookingDetails> => {
  const res = await fetch("/api/booking/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Booking not found")
  return json.data
}

export type ContractSignInput = {
  typedName: string
  gdprConsent: boolean
  modelRelease: boolean
  termsAgreed: boolean
}

export const signContract = async ({
  bookingToken,
  ...data
}: ContractSignInput & { bookingToken: string }): Promise<{
  signed: boolean
}> => {
  const res = await fetch("/api/booking/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingToken, ...data }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to sign contract")
  return json
}

export const createBookingCheckout = async (
  bookingToken: string
): Promise<{ clientSecret: string }> => {
  const res = await fetch("/api/booking/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Payment unavailable")
  return json
}

export type ConfirmedBooking = {
  clientName: string
  sessionTypeName: string
  sessionDate: Date | null
  sessionLocation: string | null
  sessionToken: string
  portalUrl: string
}

export const getConfirmedBooking = async (
  bookingToken: string
): Promise<ConfirmedBooking> => {
  const res = await fetch("/api/booking/confirmed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Booking not confirmed")
  return json.data
}
