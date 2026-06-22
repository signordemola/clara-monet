import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getJobDetail, getClientHistory } from "@/lib/queries/jobs"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"
import { JobActions } from "./job-actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>
}): Promise<Metadata> {
  const { jobId } = await params
  const job = await getJobDetail(jobId)
  if (!job) return { title: "Job · Clara Monét" }
  return {
    title: `${job.client.name} · Job · Clara Monét`,
    description: `${job.sessionType.name} session for ${job.client.name}.`,
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const job = await getJobDetail(jobId)
  if (!job) notFound()

  const history = await getClientHistory(job.client.id, job.id)

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-8">
        <Link
          href="/owner/jobs"
          className="text-xs text-muted-foreground transition hover:text-ink"
        >
          ← All jobs
        </Link>

        <header className="flex flex-col gap-2">
          <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
            {job.sessionType.name}
          </p>
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
            {job.client.name}
          </h2>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{job.client.email}</p>
          </div>
          {job.client.phone && (
            <div className="border border-hairline bg-card p-4">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{job.client.phone}</p>
            </div>
          )}
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm">
              {job.sessionDate
                ? `${formatDate(job.sessionDate)} at ${formatTime(job.sessionDate)}`
                : "Not set"}
            </p>
          </div>
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm">{job.sessionLocation ?? "Not set"}</p>
          </div>
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm">{formatCurrency(job.totalPrice)}</p>
          </div>
          <div className="border border-hairline bg-card p-4">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm">
              {formatCurrency(job.balanceAmount)} · {job.balanceStatus}
            </p>
          </div>
        </section>
      </div>

      <div className="w-full lg:max-w-md">
        <JobActions job={job} history={history} />
      </div>
    </div>
  )
}
