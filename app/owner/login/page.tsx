import type { Metadata } from "next"
import { Wordmark } from "@/components/brand/wordmark"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Sign in · Clara Monét",
  description: "Owner sign in to the Clara Monét studio.",
}

export default function OwnerLoginPage() {
  return (
    <main className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <section className="flex items-center justify-center bg-ink px-6 py-12 text-paper md:px-12">
        <div className="w-full max-w-sm">
          <Wordmark tone="paper" size="md" />
          <h1 className="mt-10 font-display text-4xl font-light tracking-tight md:text-5xl">
            Studio.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            Sign in to view inquiries, approve bookings, and follow the
            session-to-gallery pipeline.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-paper px-6 py-12 md:px-12">
        <LoginForm />
      </section>
    </main>
  )
}
