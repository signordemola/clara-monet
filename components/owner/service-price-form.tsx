"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  id: string
  price: number
  bookingFee: number
}

export const ServicePriceForm = ({ id, price, bookingFee }: Props) => {
  const [priceVal, setPriceVal] = useState((price / 100).toFixed(2))
  const [feeVal, setFeeVal] = useState((bookingFee / 100).toFixed(2))
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("saving")

    const pricePence = Math.round(parseFloat(priceVal) * 100)
    const feePence = Math.round(parseFloat(feeVal) * 100)

    if (
      isNaN(pricePence) ||
      pricePence <= 0 ||
      isNaN(feePence) ||
      feePence <= 0
    ) {
      setStatus("error")
      return
    }

    try {
      const res = await fetch(`/api/owner/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: pricePence, bookingFee: feePence }),
      })
      setStatus(res.ok ? "saved" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={`price-${id}`}
          className="text-xs text-muted-foreground"
        >
          Full price (£)
        </Label>
        <Input
          id={`price-${id}`}
          type="number"
          step="0.01"
          min="0.01"
          value={priceVal}
          onChange={(e) => {
            setPriceVal(e.target.value)
            setStatus("idle")
          }}
          className="w-28"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`fee-${id}`} className="text-xs text-muted-foreground">
          Booking fee (£)
        </Label>
        <Input
          id={`fee-${id}`}
          type="number"
          step="0.01"
          min="0.01"
          value={feeVal}
          onChange={(e) => {
            setFeeVal(e.target.value)
            setStatus("idle")
          }}
          className="w-28"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={status === "saving"}
        variant="outline"
        size="sm"
      >
        {status === "saving" ? "Saving…" : "Save"}
      </Button>

      {status === "saved" && (
        <span className="text-xs text-green-600">Saved</span>
      )}
      {status === "error" && (
        <span className="text-xs text-destructive">Something went wrong</span>
      )}
    </form>
  )
}
