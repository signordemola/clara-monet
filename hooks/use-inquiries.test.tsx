import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"

const mockRefresh = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh, push: vi.fn() }),
}))

vi.mock("@/lib/api/owner", () => ({
  approveInquiry: vi.fn(),
  declineInquiry: vi.fn(),
}))

import { useApproveInquiry, useDeclineInquiry } from "./use-inquiries"
import { approveInquiry, declineInquiry } from "@/lib/api/owner"

const mockApprove = vi.mocked(approveInquiry)
const mockDecline = vi.mocked(declineInquiry)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useApproveInquiry", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockApprove.mockReset()
  })

  it("calls approveInquiry and refreshes router on success", async () => {
    mockApprove.mockResolvedValue({ success: true, bookingToken: "tok_1" })

    const { result } = renderHook(() => useApproveInquiry(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        inquiryId: "inq_1",
        sessionTypeId: "st_1",
      })
    })

    await waitFor(() => {
      expect(mockApprove).toHaveBeenCalled()
    })
    expect(mockApprove.mock.calls[0]?.[0]).toEqual({
      inquiryId: "inq_1",
      sessionTypeId: "st_1",
    })
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it("exposes the error when approve fails", async () => {
    mockApprove.mockRejectedValue(new Error("Already processed"))

    const { result } = renderHook(() => useApproveInquiry(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({ inquiryId: "inq_1", sessionTypeId: "st_1" })
    })

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Already processed")
    })
    expect(mockRefresh).not.toHaveBeenCalled()
  })
})

describe("useDeclineInquiry", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockDecline.mockReset()
  })

  it("calls declineInquiry and refreshes router on success", async () => {
    mockDecline.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useDeclineInquiry(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({ inquiryId: "inq_2" })
    })

    await waitFor(() => {
      expect(mockDecline).toHaveBeenCalled()
    })
    expect(mockDecline.mock.calls[0]?.[0]).toEqual({ inquiryId: "inq_2" })
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it("exposes the error when decline fails", async () => {
    mockDecline.mockRejectedValue(new Error("Not found"))

    const { result } = renderHook(() => useDeclineInquiry(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({ inquiryId: "missing" })
    })

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Not found")
    })
    expect(mockRefresh).not.toHaveBeenCalled()
  })
})
