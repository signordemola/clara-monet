import Link from "next/link"
import type { WeekSession } from "@/lib/queries/owner-views"
import { formatCurrency } from "@/lib/utils"
import { formatInTimeZone } from "date-fns-tz"
import { PROVIDER_TZ } from "@/lib/time"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const stageLabel: Record<string, string> = {
  BOOKED: "Booked",
  QUESTIONNAIRE_SENT: "Q sent",
  QUESTIONNAIRE_DONE: "Q done",
  SESSION_COMPLETE: "Shot",
  GALLERY_SENT: "Gallery sent",
  PAID: "Paid",
  COMPLETE: "Complete",
}

export const WeekSchedule = ({
  sessions,
  revenueEarned,
  revenueOutstanding,
}: {
  sessions: WeekSession[]
  revenueEarned: number
  revenueOutstanding: number
}) => {
  return (
    <section className="border border-hairline bg-card p-5 md:p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-light tracking-tight">
          This week
        </h3>
        <div className="flex items-baseline gap-4 text-right">
          <div>
            <p className="text-[9px] tracking-[0.2em] text-ink/50 uppercase">
              Earned
            </p>
            <p className="font-display text-base font-light">
              {formatCurrency(revenueEarned)}
            </p>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] text-ink/50 uppercase">
              Outstanding
            </p>
            <p className="font-display text-base font-light text-clay">
              {formatCurrency(revenueOutstanding)}
            </p>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sessions this week — studio time.
        </p>
      ) : (
        <div className="divide-y divide-hairline">
          {sessions.map((s) => {
            const dayIndex = (new Date(s.sessionDate).getUTCDay() + 6) % 7
            const time = formatInTimeZone(s.sessionDate, PROVIDER_TZ, "HH:mm")
            return (
              <Link
                key={s.id}
                href={`/owner/jobs/${s.id}`}
                className="group flex items-center gap-4 py-3 transition hover:bg-paper-warm/50"
              >
                <span className="w-8 shrink-0 text-[10px] font-medium tracking-[0.2em] text-ink/50 uppercase">
                  {DAY_LABELS[dayIndex]}
                </span>
                <span className="w-12 shrink-0 text-sm text-ink/80 tabular-nums">
                  {time}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-ink group-hover:text-clay">
                  {s.clientName}
                </span>
                <span className="hidden text-xs text-ink/65 sm:inline">
                  {s.sessionTypeName}
                </span>
                <span className="shrink-0 border border-hairline px-2 py-0.5 text-[9px] tracking-[0.15em] text-ink/65 uppercase">
                  {stageLabel[s.stage] ?? s.stage}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
