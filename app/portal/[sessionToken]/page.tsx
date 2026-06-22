import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { StageTracker } from "@/components/portal/stage-tracker"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionToken: string }>
}): Promise<Metadata> {
  const { sessionToken } = await params
  const job = await prisma.job.findUnique({
    where: { sessionToken },
    include: { client: true },
  })
  if (!job) return { title: "Portal · Clara Monét" }
  return {
    title: `${job.client.name} · Portal · Clara Monét`,
  }
}

export default async function PortalStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionToken: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const [{ sessionToken }, query] = await Promise.all([params, searchParams])
  const job = await prisma.job.findUnique({
    where: { sessionToken },
    include: { client: true, sessionType: true },
  })
  if (!job) notFound()

  const paymentSuccess = query.redirect_status === "succeeded"

  const showQuestionnaireLink = job.stage === "QUESTIONNAIRE_SENT"
  const showInvoiceLink =
    job.stage === "GALLERY_SENT" && job.balanceStatus === "PENDING"
  const showGalleryLink =
    job.stage === "GALLERY_SENT" ||
    job.stage === "PAID" ||
    job.stage === "COMPLETE"

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Clara Monét Photography
        </p>
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Hi, {job.client.name}.
        </h1>
        <p className="text-sm text-muted-foreground">
          {job.sessionType.name} ·{" "}
          {job.sessionDate
            ? `${formatDate(job.sessionDate)} at ${formatTime(job.sessionDate)}`
            : "Date to be confirmed"}
        </p>
      </header>

      {paymentSuccess && (
        <section className="border border-sage/40 bg-sage/10 p-5">
          <p className="text-sm font-medium text-ink">
            Payment received — thank you.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your balance has been settled. Clara will be in touch shortly.
          </p>
        </section>
      )}

      <section className="border border-hairline bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-light tracking-tight">
          Session progress
        </h2>
        <StageTracker currentStage={job.stage} />
      </section>

      <section className="flex flex-col gap-3">
        {showQuestionnaireLink && (
          <Link
            href={`/portal/${sessionToken}/questionnaire`}
            className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            Complete your questionnaire →
          </Link>
        )}

        {showInvoiceLink && (
          <Link
            href={`/portal/${sessionToken}/invoice`}
            className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            Pay balance ({formatCurrency(job.balanceAmount)}) →
          </Link>
        )}

        {showGalleryLink && job.galleryUrl && (
          <a
            href={job.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-hairline bg-card px-6 py-3 text-center text-sm font-medium transition hover:border-ink/20"
          >
            View your gallery →
          </a>
        )}
      </section>
    </main>
  )
}
