import Link from "next/link"
import type { ActionItem } from "@/lib/queries/owner-views"

const urgencyDot: Record<ActionItem["urgency"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-sage",
}

export const ActionItems = ({ items }: { items: ActionItem[] }) => {
  if (items.length === 0) return null

  return (
    <section className="border border-hairline bg-card p-5 md:p-6">
      <h3 className="mb-4 font-display text-lg font-light tracking-tight">
        Needs attention
      </h3>
      <ul className="divide-y divide-hairline">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.link}
              className="group flex items-center gap-3 py-3 transition hover:bg-paper-warm/50"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${urgencyDot[item.urgency]}`}
              />
              <span className="flex-1 text-sm text-ink group-hover:text-clay">
                {item.label}
              </span>
              <span className="text-xs text-ink/50 transition group-hover:text-ink">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
