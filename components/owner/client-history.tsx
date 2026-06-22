import Link from "next/link"
import { JobStage } from "../../generated/prisma/enums"
import { StageBadge } from "./stage-badge"
import { formatCurrency, formatShortDate } from "@/lib/utils"

export const ClientHistory = ({
  jobs,
}: {
  jobs: Array<{
    id: string
    stage: JobStage
    sessionTypeName: string
    sessionDate: Date | null
    totalPrice: number
  }>
}) => {
  if (jobs.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
        Client history
      </h3>
      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/owner/jobs/${job.id}`}
            className="flex items-center justify-between gap-3 border border-hairline bg-card p-3 transition hover:border-ink/20"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm">{job.sessionTypeName}</span>
              <span className="text-xs text-muted-foreground">
                {job.sessionDate ? formatShortDate(job.sessionDate) : "No date"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink">
                {formatCurrency(job.totalPrice)}
              </span>
              <StageBadge stage={job.stage} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
