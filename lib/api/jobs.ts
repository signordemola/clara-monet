import { JobStage } from "../../generated/prisma/enums"

export const listJobs = async (): Promise<
  Array<{
    id: string
    stage: JobStage
    clientName: string
    sessionTypeName: string
    sessionDate: Date | null
    sessionLocation: string | null
    totalPrice: number
    balanceStatus: string
  }>
> => {
  const res = await fetch("/api/owner/jobs")
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to load jobs")
  return json.data
}

export const getJob = async (jobId: string) => {
  const res = await fetch(`/api/owner/jobs/${jobId}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to load job")
  return json.data
}

export const advanceJobStage = async (
  jobId: string
): Promise<{ success: boolean; stage: JobStage }> => {
  const res = await fetch(`/api/owner/jobs/${jobId}/stage`, {
    method: "POST",
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to advance stage")
  return json
}

export const updateOwnerNotes = async ({
  jobId,
  notes,
}: {
  jobId: string
  notes: string
}) => {
  const res = await fetch(`/api/owner/jobs/${jobId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, ownerNotes: notes }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to save notes")
  return json.data
}

export const deliverGallery = async ({
  jobId,
  galleryUrl,
  imageCount,
}: {
  jobId: string
  galleryUrl: string
  imageCount: number
}) => {
  const res = await fetch(`/api/owner/jobs/${jobId}/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, galleryUrl, imageCount }),
  })
  const json = await res.json()
  if (!res.ok)
    throw new Error(json.error?.message ?? "Failed to deliver gallery")
  return json
}
