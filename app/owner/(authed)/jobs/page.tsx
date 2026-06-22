import type { Metadata } from "next"
import { listJobs, getJobStageCounts } from "@/lib/queries/jobs"
import { PipelineBoard } from "@/components/owner/pipeline-board"

export const metadata: Metadata = {
  title: "Jobs · Clara Monét",
  description: "Session pipeline and job board.",
}

export default async function JobsPage() {
  const [jobs, counts] = await Promise.all([listJobs(), getJobStageCounts()])
  const countMap = Object.fromEntries(
    counts.map((c) => [c.stage, c.count])
  ) as Record<string, number>

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Pipeline
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Jobs
        </h2>
        <p className="text-sm text-muted-foreground">
          Every session from booking to completion.
        </p>
      </header>

      <PipelineBoard jobs={jobs} counts={countMap} />
    </div>
  )
}
