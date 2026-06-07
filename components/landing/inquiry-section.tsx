"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SESSION_TYPES, type SessionType, formatPence } from "@/lib/mock-data"
import { submitInquiry } from "@/lib/actions"
import { Field, FieldLabel } from "@/components/ui/field"

export function InquirySection() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [sessionType, setSessionType] = useState<SessionType>("personal-brand")

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("sessionTypePref", sessionType)

    startTransition(async () => {
      const result = await submitInquiry(formData)

      if (!result.success) {
        toast.error(result.error ?? "Something went wrong")
        return
      }

      router.push("/inquiry/submitted")
    })
  }

  return (
    <section
      id="inquire"
      className="relative overflow-hidden bg-paper-warm px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-clay uppercase">
            <span className="h-px w-8 bg-clay/60" />
            Begin an inquiry
          </div>
          <h2 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight lg:text-6xl">
            Tell me <span className="italic">a little</span>
            <br />
            about your session.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-ink/75">
            I read every inquiry myself and reply within the hour during studio
            days. You&apos;ll receive a booking link only after we&apos;ve
            agreed a date — nothing is committed until then.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-ink/75">
            {[
              "Personal reply, never an autoresponder thread",
              "Tailored booking link with full contract",
              "25% booking fee · balance due with gallery",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 h-1 w-3 shrink-0 bg-clay" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative border border-hairline bg-paper p-8 lg:col-span-7 lg:p-12"
        >
          <div className="absolute -top-3 left-8 bg-paper-warm px-3 text-[10px] tracking-[0.3em] text-clay uppercase">
            Inquiry · No. {new Date().getFullYear()}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field orientation="vertical">
              <FieldLabel className="text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
                Your name
              </FieldLabel>
              <input
                name="name"
                required
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/60 hover:border-ink/50 focus:border-ink focus:outline-none"
              />
            </Field>
            <Field orientation="vertical">
              <FieldLabel className="text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
                Email
              </FieldLabel>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/60 hover:border-ink/50 focus:border-ink focus:outline-none"
              />
            </Field>
          </div>

          <div className="mt-6">
            <label className="mb-3 block text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
              Session type
            </label>
            <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-3">
              {(Object.keys(SESSION_TYPES) as SessionType[]).map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setSessionType(k)}
                  className={`px-3 py-4 text-left transition ${
                    sessionType === k
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-paper-warm"
                  }`}
                >
                  <div className="font-display text-base">
                    {SESSION_TYPES[k].name}
                  </div>
                  <div
                    className={`mt-1 text-[10px] tracking-[0.2em] uppercase ${
                      sessionType === k ? "text-clay-soft" : "text-ink/80"
                    }`}
                  >
                    From {formatPence(SESSION_TYPES[k].price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field orientation="vertical">
              <FieldLabel className="text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
                Preferred window
              </FieldLabel>
              <input
                name="preferredDate"
                placeholder="e.g. late June, weekday mornings"
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/60 hover:border-ink/50 focus:border-ink focus:outline-none"
              />
            </Field>
            <Field orientation="vertical">
              <FieldLabel className="text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
                How did you find me?
              </FieldLabel>
              <input
                name="referral"
                placeholder="Instagram, referral, search…"
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/60 hover:border-ink/50 focus:border-ink focus:outline-none"
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field orientation="vertical">
              <FieldLabel className="text-[10px] font-medium tracking-[0.24em] text-ink/85 uppercase">
                Tell me about the session
              </FieldLabel>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Who's it for, what's the moment, anything you've been thinking about…"
                className="w-full resize-none border border-ink/20 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/60 hover:border-ink/50 focus:border-ink focus:outline-none"
              />
            </Field>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs text-ink/80">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 accent-ink"
            />
            <span>
              I consent to Clara Monét Photography storing the details above for
              the purpose of replying to this inquiry — under UK GDPR you can
              request deletion at any time.
            </span>
          </label>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
            <p className="text-[10px] font-medium tracking-[0.24em] text-ink/80 uppercase">
              Average reply · within the hour
            </p>
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex items-center gap-3 border border-ink bg-ink px-8 py-4 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send inquiry"}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
