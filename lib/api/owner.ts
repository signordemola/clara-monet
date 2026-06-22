import type {
  ApproveInquiryInput,
  DeclineInquiryInput,
} from "@/schemas/inquiry-action.schema"

type ApproveResult = { success: true; bookingToken: string }
type DeclineResult = { success: true }
type ApiErrorBody = { error?: { message?: string; field?: string } }

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody
    if (body.error?.message) return body.error.message
  } catch {}
  return `${res.status} ${res.statusText}`
}

export const approveInquiry = async (
  input: ApproveInquiryInput
): Promise<ApproveResult> => {
  const res = await fetch(`/api/owner/inquiries/${input.inquiryId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "approve", ...input }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<ApproveResult>
}

export const declineInquiry = async (
  input: DeclineInquiryInput
): Promise<DeclineResult> => {
  const res = await fetch(`/api/owner/inquiries/${input.inquiryId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "decline", ...input }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<DeclineResult>
}
