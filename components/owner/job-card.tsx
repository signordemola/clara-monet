import Link from "next/link"
import { JobStage } from "../../generated/prisma/enums"
import { StageBadge } from "./stage-badge"
import { formatCurrency, formatShortDate } from "@/lib/utils"

export const JobCard = ({
  id,
  stage,
  clientName,
  sessionTypeName,
  sessionDate,
  sessionLocation,
  totalPrice,
}: {
  id: string
  stage: JobStage
  clientName: string
  sessionTypeName: string
  sessionDate: Date | null
  sessionLocation: string | null
  totalPrice: number
}) => {
  return (
    <Link
      href={`/owner/jobs/${id}`}
      className="group flex flex-col gap-3 border border-hairline bg-card p-4 transition hover:border-ink/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-display text-base font-light tracking-tight">
            {clientName}
          </span>
          <span className="text-xs text-muted-foreground">
            {sessionTypeName}
          </span>
        </div>
        <StageBadge stage={stage} />
      </div>

      <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {sessionDate ? formatShortDate(sessionDate) : "No date set"}
          {sessionLocation ? ` · ${sessionLocation}` : null}
        </span>
        <span className="font-medium text-ink">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </Link>
  )
}
