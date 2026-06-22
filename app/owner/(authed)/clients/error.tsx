"use client"

import { useEffect } from "react"

export default function OwnerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-start gap-4 border border-destructive/30 bg-destructive/5 p-6">
      <p className="text-[10px] font-medium tracking-[0.24em] text-destructive uppercase">
        Failed to load
      </p>
      <h2 className="font-display text-2xl font-light tracking-tight">
        Something went wrong.
      </h2>
      <p className="text-sm text-muted-foreground">
        This is usually a database blip. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="border border-ink bg-ink px-6 py-3 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
      >
        Try again
      </button>
    </div>
  )
}
