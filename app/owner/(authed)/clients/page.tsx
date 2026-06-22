import type { Metadata } from "next"
import Link from "next/link"
import { listClients } from "@/lib/queries/owner-views"
import { formatShortDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Clients · Clara Monét",
  description: "All clients and their session history.",
}

export default async function ClientsPage() {
  const clients = await listClients()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Clients
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          {clients.length} {clients.length === 1 ? "client" : "clients"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Everyone who has booked with Clara Monét Photography.
        </p>
      </header>

      {clients.length === 0 ? (
        <div className="border border-hairline bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No clients yet. Bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/owner/clients/${client.id}`}
              className="group block border border-hairline bg-card p-5 transition-colors hover:border-ink/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-lg font-light tracking-tight">
                      {client.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {client.email}
                    </span>
                  </div>
                  {client.phone && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {client.phone}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {client.jobCount}{" "}
                  {client.jobCount === 1 ? "session" : "sessions"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {client.lastSessionType && (
                  <span>Last: {client.lastSessionType}</span>
                )}
                {client.lastSessionDate && (
                  <span>{formatShortDate(client.lastSessionDate)}</span>
                )}
                {!client.gdprConsent && (
                  <span className="text-amber-600">
                    No GDPR consent on file
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
