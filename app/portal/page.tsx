import type { Metadata } from "next"
import { PortalLookupClient } from "./portal-lookup-client"

export const metadata: Metadata = {
  title: "Client Portal · Clara Monét",
  description: "Access your session portal by entering your email address.",
}

export default function PortalPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
            Client portal
          </p>
          <h1 className="mt-3 font-display text-3xl font-light tracking-tight md:text-4xl">
            Access your session
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter the email address you used when booking to view your session
            details, questionnaire, and invoices.
          </p>
        </header>

        <PortalLookupClient />
      </div>
    </main>
  )
}
