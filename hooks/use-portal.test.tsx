import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"

const mockRefresh = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh, push: vi.fn() }),
}))

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock("@/lib/api/portal", () => ({
  submitQuestionnaire: vi.fn(),
  createInvoiceCheckout: vi.fn(),
}))

import { useSubmitQuestionnaire, useCreateInvoiceCheckout } from "./use-portal"
import { submitQuestionnaire, createInvoiceCheckout } from "@/lib/api/portal"

const mockSubmit = vi.mocked(submitQuestionnaire)
const mockCheckout = vi.mocked(createInvoiceCheckout)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useSubmitQuestionnaire", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockSubmit.mockReset()
  })

  it("calls submitQuestionnaire and refreshes router on success", async () => {
    mockSubmit.mockResolvedValue({ submitted: true })

    const { result } = renderHook(() => useSubmitQuestionnaire(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        sessionToken: "tok_1",
        sessionGoal: "Headshots",
        participants: "Just me",
        locationPref: "Office",
        mood: "Professional",
        outfitPlans: "Suit",
        imageUsage: "LinkedIn",
        modelRelease: true,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSubmit.mock.calls[0]?.[0]).toMatchObject({
      sessionToken: "tok_1",
      sessionGoal: "Headshots",
    })
    expect(mockRefresh).toHaveBeenCalled()
  })
})

describe("useCreateInvoiceCheckout", () => {
  beforeEach(() => {
    mockCheckout.mockReset()
  })

  it("calls createInvoiceCheckout and returns clientSecret", async () => {
    mockCheckout.mockResolvedValue({ clientSecret: "secret_1" })

    const { result } = renderHook(() => useCreateInvoiceCheckout(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate("tok_1")
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCheckout.mock.calls[0]?.[0]).toBe("tok_1")
    expect(result.current.data).toEqual({ clientSecret: "secret_1" })
  })
})
