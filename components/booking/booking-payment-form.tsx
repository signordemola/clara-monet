"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"

export const BookingPaymentForm = ({
  bookingToken,
}: {
  bookingToken: string
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookingToken}/confirmed`,
      },
    })

    if (error) {
      setMessage(error.message ?? "Payment failed")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {message && <p className="text-sm text-destructive">{message}</p>}
      <Button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing…" : "Pay booking fee"}
      </Button>
    </form>
  )
}
