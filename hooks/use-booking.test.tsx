import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: mockPush }),
}))

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock("@/lib/api/booking", () => ({
  signContract: vi.fn(),
  createBookingCheckout: vi.fn(),
}))

import { useSignContract, useCreateBookingCheckout } from "./use-booking"
import { signContract, createBookingCheckout } from "@/lib/api/booking"

const mockSign = vi.mocked(signContract)
const mockCheckout = vi.mocked(createBookingCheckout)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useSignContract", () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockSign.mockReset()
  })

  it("calls signContract and navigates to payment on success", async () => {
    mockSign.mockResolvedValue({ signed: true })

    const { result } = renderHook(() => useSignContract(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        bookingToken: "book_1",
        typedName: "Jane Doe",
        gdprConsent: true,
        modelRelease: false,
        termsAgreed: true,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockSign.mock.calls[0]?.[0]).toMatchObject({
      bookingToken: "book_1",
      typedName: "Jane Doe",
    })
    expect(mockPush).toHaveBeenCalledWith("/book/book_1/pay")
  })
})

describe("useCreateBookingCheckout", () => {
  beforeEach(() => {
    mockCheckout.mockReset()
  })

  it("calls createBookingCheckout and returns clientSecret", async () => {
    mockCheckout.mockResolvedValue({ clientSecret: "secret_1" })

    const { result } = renderHook(() => useCreateBookingCheckout(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate("book_1")
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCheckout.mock.calls[0]?.[0]).toBe("book_1")
    expect(result.current.data).toEqual({ clientSecret: "secret_1" })
  })
})
