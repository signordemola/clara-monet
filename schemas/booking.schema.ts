import { z } from "zod"

export const BookingCheckoutSchema = z.object({
  bookingToken: z.string().min(1),
})

export type BookingCheckoutInput = z.infer<typeof BookingCheckoutSchema>
