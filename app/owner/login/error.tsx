"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function OwnerLoginError({
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
    <main className="flex min-h-dvh items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-3xl font-light tracking-tight">
          We couldn&apos;t load the sign-in page.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please try again, or come back in a moment.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="border border-ink bg-ink px-6 py-3 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-hairline px-6 py-3 text-[11px] tracking-[0.24em] uppercase transition hover:border-ink"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  )
}
