import Link from "next/link"
import type { Metadata } from "next"
import { getDashboardStats } from "@/lib/queries/owner-views"
import { StatCard } from "@/components/owner/stat-card"

export const metadata: Metadata = {
  title: "Dashboard · Clara Monét",
  description: "Studio overview and recent activity.",
}

const formatRelative = (date: Date) => {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Studio overview
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Good day, Clara.
        </h2>
        <p className="text-sm text-muted-foreground">
          Newest first. Approve, decline, or open an inquiry for the full
          thread.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New inquiries"
          value={stats.newInquiries}
          hint="Awaiting your reply"
          tone="clay"
        />
        <StatCard
          label="Awaiting contract"
          value={stats.awaitingContracts}
          hint="Booked, not yet signed"
          tone="paper"
        />
        <StatCard
          label="Awaiting invoice"
          value={stats.awaitingInvoices}
          hint="Gallery delivered"
          tone="sage"
        />
        <StatCard
          label="This week"
          value={stats.thisWeekSessions}
          hint="Upcoming sessions"
          tone="paper"
        />
      </section>

      <section className="border border-hairline bg-card p-5 md:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-light tracking-tight">
            Recent activity
          </h3>
          <Link
            href="/owner/inquiries"
            className="text-[10px] font-medium tracking-[0.24em] text-ink/70 uppercase transition hover:text-ink"
          >
            All inquiries →
          </Link>
        </div>
        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing new — your studio is quiet.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {stats.recentActivity.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="flex items-baseline justify-between gap-3 py-3"
              >
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatRelative(item.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
