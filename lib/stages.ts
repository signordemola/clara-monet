import { Job } from "../generated/prisma/client"
import { JobStage } from "../generated/prisma/enums"

export const STAGE_ORDER: JobStage[] = [
  "BOOKED",
  "QUESTIONNAIRE_SENT",
  "QUESTIONNAIRE_DONE",
  "SESSION_COMPLETE",
  "GALLERY_SENT",
  "PAID",
  "COMPLETE",
]

const STAGE_LABEL: Record<JobStage, string> = {
  BOOKED: "Booked",
  QUESTIONNAIRE_SENT: "Questionnaire sent",
  QUESTIONNAIRE_DONE: "Questionnaire complete",
  SESSION_COMPLETE: "Session complete",
  GALLERY_SENT: "Gallery delivered",
  PAID: "Balance paid",
  COMPLETE: "Complete",
}

const CLIENT_STAGE_LABEL: Record<JobStage, string> = {
  BOOKED: "Booking confirmed",
  QUESTIONNAIRE_SENT: "Pre-session questionnaire",
  QUESTIONNAIRE_DONE: "Preparing your session",
  SESSION_COMPLETE: "Editing in progress",
  GALLERY_SENT: "Your gallery is ready",
  PAID: "All settled",
  COMPLETE: "Session complete",
}

const STAGE_DESCRIPTION: Record<JobStage, string> = {
  BOOKED:
    "Your booking fee has been paid and your contract is signed. Your date is secured.",
  QUESTIONNAIRE_SENT:
    "We've sent you a pre-session questionnaire to help prepare for your session.",
  QUESTIONNAIRE_DONE:
    "Your questionnaire is in. Clara is reviewing your responses before your session.",
  SESSION_COMPLETE:
    "Your session is done. Editing is now underway — Clara will be in touch with your gallery soon.",
  GALLERY_SENT:
    "Your gallery is ready. Your balance invoice has been sent alongside it.",
  PAID: "Your balance has been paid. Thank you.",
  COMPLETE: "This session is complete. We'd love to see you again.",
}

const STAGE_OWNER_ACTION: Record<JobStage, string> = {
  BOOKED: "Wait for the questionnaire prompt to be sent.",
  QUESTIONNAIRE_SENT: "Wait for the client to complete the questionnaire.",
  QUESTIONNAIRE_DONE: "Mark the session as complete after the shoot.",
  SESSION_COMPLETE: "Deliver the gallery when editing is finished.",
  GALLERY_SENT: "Wait for the balance to be paid.",
  PAID: "Mark this job as complete.",
  COMPLETE: "No further action — job is archived.",
}

export function getStageLabel(stage: JobStage): string {
  return STAGE_LABEL[stage]
}

export function getClientStageLabel(stage: JobStage): string {
  return CLIENT_STAGE_LABEL[stage]
}

export function getStageDescription(stage: JobStage): string {
  return STAGE_DESCRIPTION[stage]
}

export function getOwnerNextAction(stage: JobStage): string {
  return STAGE_OWNER_ACTION[stage]
}

export function getNextStage(current: JobStage): JobStage | null {
  const index = STAGE_ORDER.indexOf(current)
  if (index === -1 || index === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[index + 1]
}

export function canAdvanceStage(
  job: Pick<Job, "stage" | "balanceStatus"> & {
    questionnaire?: { id: string } | null
  }
): boolean {
  switch (job.stage) {
    case "COMPLETE":
      return false
    case "SESSION_COMPLETE":
      return false
    case "GALLERY_SENT":
      return job.balanceStatus === "PAID"
    case "QUESTIONNAIRE_SENT":
      return !!job.questionnaire
    default:
      return true
  }
}
