import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getClientDetail } from "@/lib/queries/owner-views"
import { StageBadge } from "@/components/owner/stage-badge"
import { formatCurrency, formatShortDate } from "@/lib/utils"
import { JobStage } from "@/generated/prisma/enums"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>
}): Promise<Metadata> {
  const { clientId } = await params
  const client = await getClientDetail(clientId)
  if (!client) return { title: "Client · Clara Monét" }
  return {
    title: `${client.name} · Client · Clara Monét`,
    description: `Client record for ${client.name}.`,
  }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const client = await getClientDetail(clientId)
  if (!client) notFound()

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/owner/clients"
        className="text-xs text-muted-foreground transition hover:text-ink"
      >
        ← All clients
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Client
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          {client.name}
        </h2>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="border border-hairline bg-card p-4">
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="text-sm">{client.email}</p>
        </div>
        {client.phone && (
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm">{client.phone}</p>
          </div>
        )}
        <div className="border border-hairline bg-card p-4">
          <p className="text-xs text-muted-foreground">GDPR consent</p>
          <p className="text-sm">
            {client.gdprConsent
              ? `Yes — ${client.gdprConsentAt ? formatShortDate(client.gdprConsentAt) : "date not recorded"}`
              : "Not on file"}
          </p>
        </div>
        <div className="border border-hairline bg-card p-4">
          <p className="text-xs text-muted-foreground">Marketing consent</p>
          <p className="text-sm">
            {client.marketingConsent ? "Opted in" : "Opted out"}
          </p>
        </div>
        <div className="border border-hairline bg-card p-4">
          <p className="text-xs text-muted-foreground">Client since</p>
          <p className="text-sm">{formatShortDate(client.createdAt)}</p>
        </div>
        <div className="border border-hairline bg-card p-4">
          <p className="text-xs text-muted-foreground">Sessions</p>
          <p className="text-sm">
            {client.jobs.length}{" "}
            {client.jobs.length === 1 ? "session" : "sessions"}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Session history
        </h3>

        {client.jobs.length === 0 ? (
          <div className="border border-hairline bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {client.jobs.map((job) => (
              <Link
                key={job.id}
                href={`/owner/jobs/${job.id}`}
                className="group flex items-center justify-between gap-4 border border-hairline bg-card p-4 transition hover:border-ink/20"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-display text-base font-light tracking-tight">
                    {job.sessionTypeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {job.sessionDate
                      ? formatShortDate(job.sessionDate)
                      : "No date set"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatCurrency(job.totalPrice)}
                  </span>
                  <StageBadge stage={job.stage as JobStage} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
