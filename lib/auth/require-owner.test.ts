import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const err = new Error(`NEXT_REDIRECT:${url}`)
    ;(err as Error & { digest?: string }).digest =
      `NEXT_REDIRECT;replace;${url};307;`
    throw err
  }),
}))

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}))

import { requireOwnerPage } from "./require-owner"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

const mockGetSession = vi.mocked(getSession)
const mockRedirect = vi.mocked(redirect)

describe("requireOwnerPage", () => {
  beforeEach(() => {
    mockGetSession.mockReset()
    mockRedirect.mockClear()
  })

  it("redirects to /owner/login when session is not owner", async () => {
    mockGetSession.mockResolvedValue({ isOwner: false } as never)

    await expect(requireOwnerPage()).rejects.toThrow(
      "NEXT_REDIRECT:/owner/login"
    )
    expect(mockRedirect).toHaveBeenCalledWith("/owner/login")
  })

  it("returns the session when isOwner is true", async () => {
    const session = { isOwner: true }
    mockGetSession.mockResolvedValue(session as never)

    const result = await requireOwnerPage()
    expect(result).toBe(session)
  })
})
