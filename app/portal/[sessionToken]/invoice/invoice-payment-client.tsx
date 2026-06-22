"use client"

import { useCreateInvoiceCheckout } from "@/hooks/use-portal"
import { InvoicePaymentForm } from "@/components/portal/invoice-payment-form"
import { Button } from "@/components/ui/button"

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

  return <InvoicePaymentForm sessionToken={sessionToken} />
}
