import { describe, it, expect, vi, afterEach } from "vitest"
import { login, logout } from "./auth"

describe("login", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns success when fetch returns 200", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await login({ password: "correct" })

    expect(result).toEqual({ success: true })
    expect(mockFetch).toHaveBeenCalledWith("/api/owner/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "correct" }),
    })
  })

  it("throws error message from response when fetch returns 401", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: "Invalid password" } }),
    })
    vi.stubGlobal("fetch", mockFetch)

    await expect(login({ password: "wrong" })).rejects.toThrow(
      "Invalid password"
    )
  })

  it("throws an error when response has no error body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal("fetch", mockFetch)

    await expect(login({ password: "x" })).rejects.toThrow()
  })
})

describe("logout", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns success when fetch returns 200", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await logout()

    expect(result).toEqual({ success: true })
    expect(mockFetch).toHaveBeenCalledWith("/api/owner/auth", {
      method: "DELETE",
    })
  })
})
