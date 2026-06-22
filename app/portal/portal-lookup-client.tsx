"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Session = {
  token: string
  sessionType: string
  sessionDate: string | null
  stage: string
}

type LookupResult = {
  name?: string
  sessions: Session[]
}

const STAGE_LABELS: Record<string, string> = {
  BOOKED: "Booking confirmed",
  QUESTIONNAIRE_SENT: "Pre-session questionnaire",
  QUESTIONNAIRE_DONE: "Preparing your session",
  SESSION_COMPLETE: "Editing in progress",
  GALLERY_SENT: "Your gallery is ready",
  PAID: "All settled",
  COMPLETE: "Session complete",
}

export const PortalLookupClient = () => {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/portal/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      setResult(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Looking up…" : "Find my sessions"}
        </Button>
      </form>

      {error && <p className="text-center text-sm text-destructive">{error}</p>}

      {result && result.sessions.length === 0 && (
        <div className="border border-hairline bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No sessions found for that email. If you&apos;ve recently booked,
            please check the email address you used.
          </p>
        </div>
      )}

      {result && result.sessions.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-muted-foreground">
            Welcome back, <span className="text-ink">{result.name}</span>.
          </p>
          {result.sessions.map((s) => (
            <Link
              key={s.token}
              href={`/portal/${s.token}`}
              className="group flex items-center justify-between border border-hairline bg-card p-4 transition hover:border-clay/40"
            >
              <div>
                <p className="text-sm font-medium text-ink group-hover:text-clay">
                  {s.sessionType}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.sessionDate
                    ? new Date(s.sessionDate).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Date to be confirmed"}
                </p>
              </div>
              <span className="shrink-0 border border-hairline px-2 py-0.5 text-[9px] tracking-[0.15em] text-ink/65 uppercase">
                {STAGE_LABELS[s.stage] ?? s.stage}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
