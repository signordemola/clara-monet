"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCreateBookingCheckout } from "@/hooks/use-booking"
import { BookingPaymentForm } from "@/components/booking/booking-payment-form"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

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

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: checkout.data.clientSecret }}
    >
      <BookingPaymentForm bookingToken={bookingToken} />
    </Elements>
  )
}
