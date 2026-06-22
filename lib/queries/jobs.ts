import { prisma } from "@/lib/db"
import { JobStage } from "../../generated/prisma/enums"

export type JobListItem = {
  id: string
  stage: JobStage
  clientName: string
  sessionTypeName: string
  sessionDate: Date | null
  sessionLocation: string | null
  totalPrice: number
  balanceStatus: string
}

export const listJobs = async (): Promise<JobListItem[]> => {
  const rows = await prisma.job.findMany({
    orderBy: [{ stage: "asc" }, { sessionDate: "asc" }],
    include: {
      client: { select: { name: true } },
      sessionType: { select: { name: true } },
    },
  })
  return rows.map((r) => ({
    id: r.id,
    stage: r.stage,
    clientName: r.client.name,
    sessionTypeName: r.sessionType.name,
    sessionDate: r.sessionDate,
    sessionLocation: r.sessionLocation,
    totalPrice: r.totalPrice,
    balanceStatus: r.balanceStatus,
  }))
}

export type JobStageCount = {
  stage: JobStage
  count: number
}

export const getJobStageCounts = async (): Promise<JobStageCount[]> => {
  const rows = await prisma.job.groupBy({
    by: ["stage"],
    _count: { stage: true },
  })
  return rows.map((r) => ({ stage: r.stage, count: r._count.stage }))
}

export type QuestionnaireDetail = {
  id: string
  sessionGoal: string | null
  participants: string | null
  locationPref: string | null
  mood: string | null
  outfitPlans: string | null
  moodBoardUrl: string | null
  avoidsNotes: string | null
  imageUsage: string | null
  additionalNotes: string | null
  modelRelease: boolean
  submittedAt: Date
}

export type JobDetail = {
  id: string
  stage: JobStage
  sessionDate: Date | null
  sessionLocation: string | null
  totalPrice: number
  bookingFee: number
  balanceAmount: number
  bookingFeeStatus: string
  balanceStatus: string
  balanceDueAt: Date | null
  galleryUrl: string | null
  imageCount: number | null
  ownerNotes: string | null
  sessionToken: string
  client: {
    id: string
    name: string
    email: string
    phone: string | null
    gdprConsent: boolean
    marketingConsent: boolean
  }
  sessionType: {
    id: string
    name: string
    duration: number
    price: number
    imageCount: string
    turnaround: string
  }
  questionnaire: QuestionnaireDetail | null
}

export const getJobDetail = async (
  jobId: string
): Promise<JobDetail | null> => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          gdprConsent: true,
          marketingConsent: true,
        },
      },
      sessionType: {
        select: {
          id: true,
          name: true,
          duration: true,
          price: true,
          imageCount: true,
          turnaround: true,
        },
      },
      questionnaire: true,
    },
  })
  if (!job) return null

  return {
    id: job.id,
    stage: job.stage,
    sessionDate: job.sessionDate,
    sessionLocation: job.sessionLocation,
    totalPrice: job.totalPrice,
    bookingFee: job.bookingFee,
    balanceAmount: job.balanceAmount,
    bookingFeeStatus: job.bookingFeeStatus,
    balanceStatus: job.balanceStatus,
    balanceDueAt: job.balanceDueAt,
    galleryUrl: job.galleryUrl,
    imageCount: job.imageCount,
    ownerNotes: job.ownerNotes,
    sessionToken: job.sessionToken,
    client: job.client,
    sessionType: job.sessionType,
    questionnaire: job.questionnaire
      ? {
          id: job.questionnaire.id,
          sessionGoal: job.questionnaire.sessionGoal,
          participants: job.questionnaire.participants,
          locationPref: job.questionnaire.locationPref,
          mood: job.questionnaire.mood,
          outfitPlans: job.questionnaire.outfitPlans,
          moodBoardUrl: job.questionnaire.moodBoardUrl,
          avoidsNotes: job.questionnaire.avoidsNotes,
          imageUsage: job.questionnaire.imageUsage,
          additionalNotes: job.questionnaire.additionalNotes,
          modelRelease: job.questionnaire.modelRelease,
          submittedAt: job.questionnaire.submittedAt,
        }
      : null,
  }
}

export type ClientHistoryItem = {
  id: string
  stage: JobStage
  sessionTypeName: string
  sessionDate: Date | null
  totalPrice: number
}

export const getClientHistory = async (
  clientId: string,
  excludeJobId: string
): Promise<ClientHistoryItem[]> => {
  const rows = await prisma.job.findMany({
    where: { clientId, id: { not: excludeJobId } },
    orderBy: { sessionDate: "desc" },
    include: { sessionType: { select: { name: true } } },
  })
  return rows.map((r) => ({
    id: r.id,
    stage: r.stage,
    sessionTypeName: r.sessionType.name,
    sessionDate: r.sessionDate,
    totalPrice: r.totalPrice,
  }))
}
