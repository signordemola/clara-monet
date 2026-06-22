import { JobStage } from "../../generated/prisma/enums"
import { STAGE_ORDER, getStageLabel } from "@/lib/stages"
import { JobCard } from "./job-card"

export type PipelineJob = {
  id: string
  stage: JobStage
  clientName: string
  sessionTypeName: string
  sessionDate: Date | null
  sessionLocation: string | null
  totalPrice: number
  balanceStatus: string
}

export const PipelineBoard = ({
  jobs,
  counts,
}: {
  jobs: PipelineJob[]
  counts: Record<JobStage, number>
}) => {
  const jobsByStage = (stage: JobStage) => jobs.filter((j) => j.stage === stage)

  return (
    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {STAGE_ORDER.map((stage) => (
        <section key={stage} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
              {getStageLabel(stage)}
            </h3>
            <span className="text-xs text-muted-foreground">
              {counts[stage] ?? 0}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {jobsByStage(stage).map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
            {jobsByStage(stage).length === 0 && (
              <p className="text-xs text-muted-foreground">No jobs</p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
