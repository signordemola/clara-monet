import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  getInquiryDetail,
  listSessionTypeOptions,
} from "@/lib/queries/owner-views"
import { InquiryActions } from "@/components/owner/inquiry-actions"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatShortDate } from "@/lib/utils"

type Params = Promise<{ inquiryId: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { inquiryId } = await params
  const detail = await getInquiryDetail(inquiryId)
  if (!detail) return { title: "Inquiry · Clara Monét" }
  return {
    title: `${detail.inquiry.name} · Inquiry · Clara Monét`,
    description: `Inquiry from ${detail.inquiry.name}.`,
  }
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Params
}) {
  const { inquiryId } = await params
  const [detail, sessionTypes] = await Promise.all([
    getInquiryDetail(inquiryId),
    listSessionTypeOptions(),
  ])

  if (!detail) notFound()

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
            {detail.inquiry.name}
          </h2>
          <Badge variant="secondary">
            {detail.inquiry.status.toLowerCase()}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>{detail.inquiry.email}</span>
          {detail.inquiry.phone && <span>{detail.inquiry.phone}</span>}
          <span>Sent {formatShortDate(detail.inquiry.createdAt)}</span>
        </div>
      </header>

      <section className="border border-hairline bg-card p-5 md:p-6">
        <h3 className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
          Message
        </h3>
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
          {detail.inquiry.message}
        </p>

        {(detail.inquiry.sessionTypePref || detail.inquiry.preferredDate) && (
          <dl className="mt-5 grid gap-4 border-t border-hairline pt-5 sm:grid-cols-2">
            {detail.inquiry.sessionTypePref && (
              <div>
                <dt className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
                  Interested in
                </dt>
                <dd className="mt-1 text-sm capitalize">
                  {detail.inquiry.sessionTypePref.replace("-", " ")}
                </dd>
              </div>
            )}
            {detail.inquiry.preferredDate && (
              <div>
                <dt className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
                  Preferred window
                </dt>
                <dd className="mt-1 text-sm">{detail.inquiry.preferredDate}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {detail.job && (
        <section className="border border-hairline bg-card p-5 md:p-6">
          <h3 className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
            Booked job
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
                Stage
              </p>
              <p className="mt-1 text-sm capitalize">
                {detail.job.stage.toLowerCase().replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
                Date
              </p>
              <p className="mt-1 text-sm">
                {detail.job.sessionDate
                  ? formatDate(detail.job.sessionDate)
                  : "Not yet scheduled"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
                Location
              </p>
              <p className="mt-1 text-sm">
                {detail.job.sessionLocation ?? "TBD"}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <InquiryActions
          inquiryId={detail.inquiry.id}
          status={detail.inquiry.status}
          sessionTypeOptions={sessionTypes}
          defaultSessionTypeId={
            detail.inquiry.sessionTypePref
              ? sessionTypes.find(
                  (s) => s.id === detail.inquiry.sessionTypePref
                )?.id
              : undefined
          }
        />
      </section>
    </div>
  )
}
