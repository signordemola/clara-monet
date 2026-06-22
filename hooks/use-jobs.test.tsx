import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"

const mockRefresh = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh, push: vi.fn() }),
}))

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock("@/lib/api/jobs", () => ({
  advanceJobStage: vi.fn(),
  updateOwnerNotes: vi.fn(),
  deliverGallery: vi.fn(),
}))

import {
  useAdvanceJobStage,
  useUpdateOwnerNotes,
  useDeliverGallery,
} from "./use-jobs"
import {
  advanceJobStage,
  updateOwnerNotes,
  deliverGallery,
} from "@/lib/api/jobs"

const mockAdvance = vi.mocked(advanceJobStage)
const mockUpdateNotes = vi.mocked(updateOwnerNotes)
const mockDeliver = vi.mocked(deliverGallery)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

describe("useAdvanceJobStage", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockAdvance.mockReset()
  })

  it("calls advanceJobStage and refreshes router on success", async () => {
    mockAdvance.mockResolvedValue({ success: true, stage: "SESSION_COMPLETE" })

    const { result } = renderHook(() => useAdvanceJobStage(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate("job_1")
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockAdvance.mock.calls[0]?.[0]).toBe("job_1")
    expect(mockRefresh).toHaveBeenCalled()
  })
})

describe("useUpdateOwnerNotes", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockUpdateNotes.mockReset()
  })

  it("calls updateOwnerNotes and refreshes router on success", async () => {
    mockUpdateNotes.mockResolvedValue({ id: "job_1", ownerNotes: "notes" })

    const { result } = renderHook(() => useUpdateOwnerNotes(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({ jobId: "job_1", notes: "notes" })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockUpdateNotes.mock.calls[0]?.[0]).toEqual({
      jobId: "job_1",
      notes: "notes",
    })
    expect(mockRefresh).toHaveBeenCalled()
  })
})

describe("useDeliverGallery", () => {
  beforeEach(() => {
    mockRefresh.mockReset()
    mockDeliver.mockReset()
  })

  it("calls deliverGallery and refreshes router on success", async () => {
    mockDeliver.mockResolvedValue({ delivered: true })

    const { result } = renderHook(() => useDeliverGallery(), {
      wrapper: makeWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        jobId: "job_1",
        galleryUrl: "https://gallery.test",
        imageCount: 42,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockDeliver.mock.calls[0]?.[0]).toEqual({
      jobId: "job_1",
      galleryUrl: "https://gallery.test",
      imageCount: 42,
    })
    expect(mockRefresh).toHaveBeenCalled()
  })
})
