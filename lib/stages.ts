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

export const STAGE_LABEL: Record<JobStage, string> = {
  BOOKED: "Booked",
  QUESTIONNAIRE_SENT: "Questionnaire sent",
  QUESTIONNAIRE_DONE: "Questionnaire complete",
  SESSION_COMPLETE: "Session complete",
  GALLERY_SENT: "Gallery delivered",
  PAID: "Balance paid",
  COMPLETE: "Complete",
}

export const STAGE_DESCRIPTION: Record<JobStage, string> = {
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

export function getNextStage(current: JobStage): JobStage | null {
  const index = STAGE_ORDER.indexOf(current)
  if (index === -1 || index === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[index + 1]
}

export function canAdvanceStage(stage: JobStage): boolean {
  return stage !== "COMPLETE"
}
