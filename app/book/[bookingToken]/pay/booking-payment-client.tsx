"use client"

import { useCreateBookingCheckout } from "@/hooks/use-booking"
import { BookingPaymentForm } from "@/components/booking/booking-payment-form"
import { Button } from "@/components/ui/button"

export const BookingPaymentClient = ({
  bookingToken,
}: {
  bookingToken: string
}) => {
  const checkout = useCreateBookingCheckout()

  if (!checkout.data?.clientSecret) {
    return (
      <Button
        onClick={() => checkout.mutate(bookingToken)}
        disabled={checkout.isPending}
        className="w-full"
      >
        {checkout.isPending ? "Loading…" : "Proceed to payment"}
      </Button>
    )
  }

  return <BookingPaymentForm bookingToken={bookingToken} />
}
