import Link from "next/link"
import type { Metadata } from "next"
import { getDashboardStats } from "@/lib/queries/owner-views"
import { StatCard } from "@/components/owner/stat-card"
import { WeekSchedule } from "@/components/owner/week-schedule"
import { PipelineBar } from "@/components/owner/pipeline-bar"
import { ActionItems } from "@/components/owner/action-items"
import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard · Clara Monét",
  description: "Studio overview and recent activity.",
}

const formatRelative = (date: Date) => {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Studio overview
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Good day, Clara.
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your studio this week.
        </p>
      </header>

      {/* KPI Cards */}
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
          label="Revenue"
          value={formatCurrency(stats.revenueEarned)}
          hint="Earned to date"
          tone="paper"
        />
      </section>

      {/* This Week + Revenue */}
      <WeekSchedule
        sessions={stats.weekSchedule}
        revenueEarned={stats.revenueEarned}
        revenueOutstanding={stats.revenueOutstanding}
      />

      {/* Pipeline + Actions row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PipelineBar pipeline={stats.pipeline} />
        <ActionItems items={stats.actionItems} />
      </div>

      {/* Recent Activity */}
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
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.link}
                  className="group flex items-baseline justify-between gap-3 py-3 transition hover:bg-paper-warm/50"
                >
                  <span className="text-sm group-hover:text-clay">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(item.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
