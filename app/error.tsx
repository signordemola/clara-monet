"use client"

import { useEffect } from "react"

export default function GlobalError({
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
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="text-[10px] font-medium tracking-[0.24em] text-destructive uppercase">
          Something went wrong
        </p>
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
          Unexpected error
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Something broke on our end. This is usually temporary — please try
          again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="border border-ink bg-ink px-6 py-3 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
