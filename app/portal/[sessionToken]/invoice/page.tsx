import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { InvoicePaymentClient } from "./invoice-payment-client"
import { formatCurrency, formatDate } from "@/lib/utils"

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
  if (!job) return { title: "Invoice · Clara Monét" }
  return {
    title: `Invoice · ${job.client.name} · Clara Monét`,
  }
}

export default async function PortalInvoicePage({
  params,
}: {
  params: Promise<{ sessionToken: string }>
}) {
  const { sessionToken } = await params
  const job = await prisma.job.findUnique({
    where: { sessionToken },
    include: { client: true, sessionType: true },
  })
  if (!job) notFound()

  if (job.stage !== "GALLERY_SENT" || job.balanceStatus !== "PENDING") {
    redirect(`/portal/${sessionToken}`)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16">
      <header className="flex w-full flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Clara Monét Photography
        </p>
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Balance invoice
        </h1>
        <p className="text-sm text-muted-foreground">
          {job.sessionType.name} for {job.client.name}
        </p>
      </header>

      <section className="w-full border border-hairline bg-card p-6">
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Amount due</p>
          <p className="font-display text-3xl font-light tracking-tight">
            {formatCurrency(job.balanceAmount)}
          </p>
          {job.balanceDueAt && (
            <p className="text-xs text-muted-foreground">
              Due by {formatDate(job.balanceDueAt)}
            </p>
          )}
        </div>

        <InvoicePaymentClient sessionToken={sessionToken} />
      </section>

      {job.galleryUrl && (
        <section className="w-full border border-hairline bg-card p-6">
          <p className="mb-2 text-sm">
            Your gallery is ready. You can view it now — it is not held against
            payment.
          </p>
          <a
            href={job.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink underline underline-offset-4"
          >
            View your gallery →
          </a>
        </section>
      )}
    </main>
  )
}
