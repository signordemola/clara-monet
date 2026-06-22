import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { QuestionnaireForm } from "@/components/portal/questionnaire-form"

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
  if (!job) return { title: "Questionnaire · Clara Monét" }
  return {
    title: `Questionnaire · ${job.client.name} · Clara Monét`,
  }
}

export default async function PortalQuestionnairePage({
  params,
}: {
  params: Promise<{ sessionToken: string }>
}) {
  const { sessionToken } = await params
  const job = await prisma.job.findUnique({
    where: { sessionToken },
    include: { questionnaire: true, client: true, sessionType: true },
  })
  if (!job) notFound()

  if (job.questionnaire) {
    redirect(`/portal/${sessionToken}`)
  }

  if (job.stage !== "QUESTIONNAIRE_SENT") {
    redirect(`/portal/${sessionToken}`)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Clara Monét Photography
        </p>
        <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Pre-session questionnaire
        </h1>
        <p className="text-sm text-muted-foreground">
          Help Clara prepare for your {job.sessionType.name} session,{" "}
          {job.client.name}.
        </p>
      </header>

      <section className="border border-hairline bg-card p-6">
        <QuestionnaireForm sessionToken={sessionToken} />
      </section>
    </main>
  )
}
