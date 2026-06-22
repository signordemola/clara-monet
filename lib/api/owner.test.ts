import { describe, it, expect, vi, afterEach } from "vitest"
import { approveInquiry, declineInquiry } from "./owner"

describe("approveInquiry", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("POSTs to the inquiry endpoint with action=approve and payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, bookingToken: "abc123" }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await approveInquiry({
      inquiryId: "inq_1",
      sessionTypeId: "st_1",
      sessionDate: "2026-08-15T10:00:00Z",
      sessionLocation: "Hackney",
      ownerMessage: "Looking forward",
    })

    expect(result).toEqual({ success: true, bookingToken: "abc123" })
    expect(mockFetch).toHaveBeenCalledWith("/api/owner/inquiries/inq_1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        inquiryId: "inq_1",
        sessionTypeId: "st_1",
        sessionDate: "2026-08-15T10:00:00Z",
        sessionLocation: "Hackney",
        ownerMessage: "Looking forward",
      }),
    })
  })

  it("throws when fetch returns non-OK", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () =>
        Promise.resolve({ error: { message: "Inquiry already processed" } }),
    })
    vi.stubGlobal("fetch", mockFetch)

    await expect(
      approveInquiry({ inquiryId: "inq_1", sessionTypeId: "st_1" })
    ).rejects.toThrow("Inquiry already processed")
  })
})

describe("declineInquiry", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("POSTs to the inquiry endpoint with action=decline and payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await declineInquiry({
      inquiryId: "inq_2",
      declineReason: "Fully booked",
    })

    expect(result).toEqual({ success: true })
    expect(mockFetch).toHaveBeenCalledWith("/api/owner/inquiries/inq_2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "decline",
        inquiryId: "inq_2",
        declineReason: "Fully booked",
      }),
    })
  })

  it("throws when fetch returns non-OK", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: { message: "Inquiry not found" } }),
    })
    vi.stubGlobal("fetch", mockFetch)

    await expect(declineInquiry({ inquiryId: "missing" })).rejects.toThrow(
      "Inquiry not found"
    )
  })
})
