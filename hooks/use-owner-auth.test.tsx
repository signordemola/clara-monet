import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

vi.mock("@/lib/api/auth", () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

import { useLogin, useLogout } from "./use-owner-auth"
import { login as loginApi, logout as logoutApi } from "@/lib/api/auth"

const mockLoginApi = vi.mocked(loginApi)
const mockLogoutApi = vi.mocked(logoutApi)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useLogin", () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockRefresh.mockReset()
    mockLoginApi.mockReset()
  })

  it("calls login and navigates to /owner/dashboard on success", async () => {
    mockLoginApi.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ password: "correct" })
    })

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalled()
    })
    expect(mockLoginApi.mock.calls[0]?.[0]).toEqual({ password: "correct" })
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/owner/dashboard")
    })
  })

  it("exposes the error when login fails", async () => {
    mockLoginApi.mockRejectedValue(new Error("Invalid password"))

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ password: "wrong" })
    })

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Invalid password")
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe("useLogout", () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockRefresh.mockReset()
    mockLogoutApi.mockReset()
  })

  it("calls logout and navigates to /owner/login on success", async () => {
    mockLogoutApi.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useLogout(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate()
    })

    await waitFor(() => {
      expect(mockLogoutApi).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/owner/login")
    })
  })
})
