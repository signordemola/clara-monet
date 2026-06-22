"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCreateInvoiceCheckout } from "@/hooks/use-portal"
import { InvoicePaymentForm } from "@/components/portal/invoice-payment-form"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export const InvoicePaymentClient = ({
  sessionToken,
}: {
  sessionToken: string
}) => {
  const checkout = useCreateInvoiceCheckout()

  if (!checkout.data?.clientSecret) {
    return (
      <Button
        onClick={() => checkout.mutate(sessionToken)}
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
      <InvoicePaymentForm sessionToken={sessionToken} />
    </Elements>
  )
}
