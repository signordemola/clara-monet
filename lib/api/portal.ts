export type PortalJobStatus = {
  stage: string
  stageLabel: string
  stageDescription: string
  clientName: string
  sessionType: string
  sessionDate: Date | null
  sessionLocation: string | null
  galleryUrl: string | null
  invoice: {
    balanceAmount: number
    balanceFormatted: string
    dueDate: Date | null
  } | null
  questionnaireSubmitted: boolean
}

export const getPortalJobStatus = async (
  sessionToken: string
): Promise<PortalJobStatus> => {
  const res = await fetch("/api/portal/job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Session not found")
  return json.data
}

export type QuestionnaireInput = {
  sessionGoal: string
  participants: string
  locationPref: string
  mood: string
  outfitPlans: string
  moodBoardUrl?: string
  avoidsNotes?: string
  imageUsage: string
  additionalNotes?: string
  modelRelease: boolean
}

export const submitQuestionnaire = async ({
  sessionToken,
  ...data
}: QuestionnaireInput & { sessionToken: string }) => {
  const res = await fetch("/api/portal/questionnaire", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken, ...data }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to submit")
  return json
}

export const createInvoiceCheckout = async (
  sessionToken: string
): Promise<{ clientSecret: string }> => {
  const res = await fetch("/api/portal/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Invoice unavailable")
  return json
}
