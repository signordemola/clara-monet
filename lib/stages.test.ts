import { describe, it, expect } from "vitest"
import {
  STAGE_ORDER,
  getStageLabel,
  getStageDescription,
  getOwnerNextAction,
  getNextStage,
  canAdvanceStage,
} from "./stages"
import { Job } from "@/generated/prisma/client"

describe("stage helpers", () => {
  it("returns label for every stage", () => {
    for (const stage of STAGE_ORDER) {
      expect(getStageLabel(stage)).toBeTruthy()
    }
  })

  it("returns description for every stage", () => {
    for (const stage of STAGE_ORDER) {
      expect(getStageDescription(stage)).toBeTruthy()
    }
  })

  it("returns owner action for every stage", () => {
    for (const stage of STAGE_ORDER) {
      expect(getOwnerNextAction(stage)).toBeTruthy()
    }
  })

  it("advances through stage order", () => {
    expect(getNextStage("BOOKED")).toBe("QUESTIONNAIRE_SENT")
    expect(getNextStage("PAID")).toBe("COMPLETE")
    expect(getNextStage("COMPLETE")).toBeNull()
  })

  it("allows advancing from BOOKED", () => {
    const job = { stage: "BOOKED", balanceStatus: "PENDING" } as Job
    expect(canAdvanceStage(job)).toBe(true)
  })

  it("blocks advancing from QUESTIONNAIRE_SENT without questionnaire", () => {
    const job = {
      stage: "QUESTIONNAIRE_SENT",
      balanceStatus: "PENDING",
      questionnaire: null,
    } as unknown as Job
    expect(canAdvanceStage(job)).toBe(false)
  })

  it("allows advancing from QUESTIONNAIRE_SENT with questionnaire", () => {
    const job = {
      stage: "QUESTIONNAIRE_SENT",
      balanceStatus: "PENDING",
      questionnaire: { id: "q_1" },
    } as unknown as Job
    expect(canAdvanceStage(job)).toBe(true)
  })

  it("blocks advancing from GALLERY_SENT unless paid", () => {
    const unpaid = {
      stage: "GALLERY_SENT",
      balanceStatus: "PENDING",
    } as Job
    const paid = {
      stage: "GALLERY_SENT",
      balanceStatus: "PAID",
    } as Job
    expect(canAdvanceStage(unpaid)).toBe(false)
    expect(canAdvanceStage(paid)).toBe(true)
  })

  it("blocks advancing from COMPLETE", () => {
    const job = { stage: "COMPLETE", balanceStatus: "PAID" } as Job
    expect(canAdvanceStage(job)).toBe(false)
  })
})
