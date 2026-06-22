import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatShortDate } from "@/lib/utils"
import type { InquiryListItem } from "@/lib/queries/owner-views"

const statusVariant = (s: InquiryListItem["status"]) => {
  switch (s) {
    case "NEW":
      return "default" as const
    case "APPROVED":
    case "BOOKED":
      return "secondary" as const
    case "DECLINED":
      return "outline" as const
    default:
      return "outline" as const
  }
}

type InquiryCardProps = {
  inquiry: InquiryListItem
}

export const InquiryCard = ({ inquiry }: InquiryCardProps) => {
  return (
    <Link
      href={`/owner/inquiries/${inquiry.id}`}
      className="group block border border-hairline bg-card p-5 transition-colors hover:border-ink/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-lg font-light tracking-tight">
              {inquiry.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {inquiry.email}
            </span>
          </div>
          {inquiry.phone && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {inquiry.phone}
            </p>
          )}
        </div>
        <Badge variant={statusVariant(inquiry.status)}>
          {inquiry.status.toLowerCase()}
        </Badge>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/80">
        {inquiry.message}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {inquiry.sessionTypePref && (
          <span>Wants: {inquiry.sessionTypePref}</span>
        )}
        {inquiry.preferredDate && <span>When: {inquiry.preferredDate}</span>}
        <span>Sent {formatShortDate(inquiry.createdAt)}</span>
      </div>
    </Link>
  )
}
