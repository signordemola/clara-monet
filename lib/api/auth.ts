type ApiSuccess = { success: true }
type ApiErrorBody = { error?: { message?: string; field?: string } }

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody
    if (body.error?.message) return body.error.message
  } catch {}
  return `${res.status} ${res.statusText}`
}

export const login = async (input: {
  password: string
}): Promise<ApiSuccess> => {
  const res = await fetch("/api/owner/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<ApiSuccess>
}

export const logout = async (): Promise<ApiSuccess> => {
  const res = await fetch("/api/owner/auth", { method: "DELETE" })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<ApiSuccess>
}
