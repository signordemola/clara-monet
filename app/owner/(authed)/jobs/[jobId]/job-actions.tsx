"use client"

import { getStageDescription, getOwnerNextAction } from "@/lib/stages"
import { StageBadge } from "@/components/owner/stage-badge"
import { GalleryDeliveryForm } from "@/components/owner/gallery-delivery-form"
import { OwnerNotes } from "@/components/owner/owner-notes"
import { ClientHistory } from "@/components/owner/client-history"
import { useAdvanceJobStage } from "@/hooks/use-jobs"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type {
  JobDetail,
  QuestionnaireDetail,
  ClientHistoryItem,
} from "@/lib/queries/jobs"

const StageAction = ({
  job,
}: {
  job: Pick<
    JobDetail,
    "id" | "stage" | "balanceStatus" | "galleryUrl" | "balanceDueAt"
  >
}) => {
  const advance = useAdvanceJobStage()

  switch (job.stage) {
    case "BOOKED":
    case "QUESTIONNAIRE_SENT":
      return (
        <p className="text-sm text-muted-foreground">
          {getOwnerNextAction(job.stage)}
        </p>
      )
    case "QUESTIONNAIRE_DONE":
      return (
        <Button
          onClick={() => advance.mutate(job.id)}
          disabled={advance.isPending}
        >
          {advance.isPending ? "Marking…" : "Mark session complete"}
        </Button>
      )
    case "SESSION_COMPLETE":
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {getOwnerNextAction(job.stage)}
          </p>
          <GalleryDeliveryForm jobId={job.id} />
        </div>
      )
    case "GALLERY_SENT":
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {getOwnerNextAction(job.stage)}
          </p>
          {job.balanceDueAt && (
            <p className="text-xs text-muted-foreground">
              Balance due by {formatDate(job.balanceDueAt)}
            </p>
          )}
        </div>
      )
    case "PAID":
      return (
        <Button
          onClick={() => advance.mutate(job.id)}
          disabled={advance.isPending}
        >
          {advance.isPending ? "Marking…" : "Mark complete"}
        </Button>
      )
    case "COMPLETE":
      return (
        <p className="text-sm text-muted-foreground">
          {getOwnerNextAction(job.stage)}
        </p>
      )
  }
}

const QuestionnaireResponses = ({
  questionnaire,
}: {
  questionnaire: QuestionnaireDetail
}) => {
  const fields = [
    { label: "Session goal", value: questionnaire.sessionGoal },
    { label: "Participants", value: questionnaire.participants },
    { label: "Location preference", value: questionnaire.locationPref },
    { label: "Mood", value: questionnaire.mood },
    { label: "Outfit plans", value: questionnaire.outfitPlans },
    { label: "Mood board", value: questionnaire.moodBoardUrl },
    { label: "Notes on what to avoid", value: questionnaire.avoidsNotes },
    { label: "Image usage", value: questionnaire.imageUsage },
    { label: "Additional notes", value: questionnaire.additionalNotes },
    {
      label: "Model release",
      value: questionnaire.modelRelease ? "Granted" : "Not granted",
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
        Questionnaire
      </h3>
      <dl className="grid gap-3">
        {fields.map(
          (f) =>
            f.value && (
              <div key={f.label}>
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-sm">{f.value}</dd>
              </div>
            )
        )}
      </dl>
    </div>
  )
}

export const JobActions = ({
  job,
  history,
}: {
  job: JobDetail
  history: ClientHistoryItem[]
}) => {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 border border-hairline bg-card p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-light tracking-tight">
            Stage
          </h3>
          <StageBadge stage={job.stage} />
        </div>
        <p className="text-sm text-muted-foreground">
          {getStageDescription(job.stage)}
        </p>
        <StageAction job={job} />
      </section>

      {job.questionnaire && (
        <section className="border border-hairline bg-card p-5 md:p-6">
          <QuestionnaireResponses questionnaire={job.questionnaire} />
        </section>
      )}

      <section className="border border-hairline bg-card p-5 md:p-6">
        <OwnerNotes jobId={job.id} notes={job.ownerNotes} />
      </section>

      {history.length > 0 && (
        <section className="border border-hairline bg-card p-5 md:p-6">
          <ClientHistory jobs={history} />
        </section>
      )}
    </div>
  )
}
