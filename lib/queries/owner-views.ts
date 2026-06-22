import { prisma } from "@/lib/db"

export type WeekSession = {
  id: string
  clientName: string
  sessionTypeName: string
  sessionDate: Date
  sessionLocation: string | null
  stage: string
}

export type PipelineCounts = {
  BOOKED: number
  QUESTIONNAIRE_SENT: number
  QUESTIONNAIRE_DONE: number
  SESSION_COMPLETE: number
  GALLERY_SENT: number
  PAID: number
  COMPLETE: number
}

export type ActionItem = {
  id: string
  label: string
  urgency: "high" | "medium" | "low"
  link: string
}

export type DashboardStats = {
  newInquiries: number
  awaitingContracts: number
  awaitingInvoices: number
  thisWeekSessions: number
  totalClients: number
  revenueEarned: number // pence — PAID + COMPLETE
  revenueOutstanding: number // pence — GALLERY_SENT pending balance
  weekSchedule: WeekSession[]
  pipeline: PipelineCounts
  actionItems: ActionItem[]
  recentActivity: Array<{
    id: string
    type: "inquiry" | "job"
    title: string
    at: Date
    link: string
  }>
}

export type InquiryListItem = {
  id: string
  name: string
  email: string
  phone: string | null
  sessionTypePref: string | null
  preferredDate: string | null
  message: string
  status: "NEW" | "REVIEWED" | "APPROVED" | "BOOKED" | "DECLINED"
  createdAt: Date
}

export type InquiryDetail = {
  inquiry: InquiryListItem
  job: {
    id: string
    stage: string
    sessionDate: Date | null
    sessionLocation: string | null
    sessionToken: string
    bookingFee: number
    balanceAmount: number
    totalPrice: number
  } | null
  client: { id: string; name: string; email: string } | null
}

export type SessionTypeOption = {
  id: string
  slug: string
  name: string
  duration: number
  price: number
}

const startOfWeek = (): Date => {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = (day + 6) % 7
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() - diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const weekStart = startOfWeek()
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7)
  const now = new Date()

  const [
    newInquiries,
    awaitingContracts,
    awaitingInvoices,
    totalClients,
    thisWeekSessions,
    recentInquiries,
    recentJobs,
    weekJobs,
    allJobs,
  ] = await Promise.all([
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.job.count({ where: { stage: "BOOKED" } }),
    prisma.job.count({ where: { stage: "GALLERY_SENT" } }),
    prisma.client.count(),
    prisma.job.count({
      where: {
        sessionDate: { gte: weekStart, lt: weekEnd },
        stage: { not: "COMPLETE" },
      },
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.job.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        client: { select: { name: true } },
        stage: true,
        updatedAt: true,
      },
    }),
    // This week's full schedule
    prisma.job.findMany({
      where: {
        sessionDate: { gte: weekStart, lt: weekEnd },
        stage: { not: "COMPLETE" },
      },
      orderBy: { sessionDate: "asc" },
      select: {
        id: true,
        sessionDate: true,
        sessionLocation: true,
        stage: true,
        client: { select: { name: true } },
        sessionType: { select: { name: true } },
      },
    }),
    // All active jobs for pipeline + revenue + action items
    prisma.job.findMany({
      select: {
        id: true,
        stage: true,
        totalPrice: true,
        balanceAmount: true,
        balanceStatus: true,
        sessionDate: true,
        sessionLocation: true,
        questionnaireSentAt: true,
        balanceDueAt: true,
        client: { select: { name: true } },
        sessionType: { select: { name: true } },
        questionnaire: { select: { id: true } },
      },
    }),
  ])

  // ── Revenue ──
  const earnedStages = ["PAID", "COMPLETE"]
  const revenueEarned = allJobs
    .filter((j) => earnedStages.includes(j.stage))
    .reduce((sum, j) => sum + j.totalPrice, 0)
  const revenueOutstanding = allJobs
    .filter((j) => j.stage === "GALLERY_SENT" && j.balanceStatus === "PENDING")
    .reduce((sum, j) => sum + j.balanceAmount, 0)

  // ── Week schedule ──
  const weekSchedule: WeekSession[] = weekJobs
    .filter((j) => j.sessionDate !== null)
    .map((j) => ({
      id: j.id,
      clientName: j.client.name,
      sessionTypeName: j.sessionType.name,
      sessionDate: j.sessionDate!,
      sessionLocation: j.sessionLocation,
      stage: j.stage,
    }))

  // ── Pipeline ──
  const pipeline: PipelineCounts = {
    BOOKED: 0,
    QUESTIONNAIRE_SENT: 0,
    QUESTIONNAIRE_DONE: 0,
    SESSION_COMPLETE: 0,
    GALLERY_SENT: 0,
    PAID: 0,
    COMPLETE: 0,
  }
  for (const j of allJobs) {
    if (j.stage in pipeline) {
      pipeline[j.stage as keyof PipelineCounts]++
    }
  }

  // ── Action items ──
  const actionItems: ActionItem[] = []

  for (const j of allJobs) {
    // Questionnaire sent but not returned, session within 3 days
    if (
      j.stage === "QUESTIONNAIRE_SENT" &&
      !j.questionnaire &&
      j.sessionDate &&
      j.sessionDate.getTime() - now.getTime() < 3 * 86400000
    ) {
      const daysUntil = Math.max(
        0,
        Math.round((j.sessionDate.getTime() - now.getTime()) / 86400000)
      )
      actionItems.push({
        id: j.id,
        label: `${j.client.name}'s questionnaire not returned — session in ${daysUntil}d`,
        urgency: daysUntil <= 1 ? "high" : "medium",
        link: `/owner/jobs/${j.id}`,
      })
    }

    // Balance overdue
    if (
      j.stage === "GALLERY_SENT" &&
      j.balanceStatus === "PENDING" &&
      j.balanceDueAt &&
      j.balanceDueAt.getTime() < now.getTime()
    ) {
      const daysOverdue = Math.round(
        (now.getTime() - j.balanceDueAt.getTime()) / 86400000
      )
      actionItems.push({
        id: `bal-${j.id}`,
        label: `${j.client.name}'s balance overdue by ${daysOverdue}d`,
        urgency: daysOverdue > 7 ? "high" : "medium",
        link: `/owner/jobs/${j.id}`,
      })
    }

    // Session tomorrow or today, not yet SESSION_COMPLETE
    if (
      j.sessionDate &&
      ["BOOKED", "QUESTIONNAIRE_SENT", "QUESTIONNAIRE_DONE"].includes(
        j.stage
      ) &&
      j.sessionDate.getTime() - now.getTime() < 2 * 86400000 &&
      j.sessionDate.getTime() > now.getTime()
    ) {
      const isToday =
        j.sessionDate.toISOString().slice(0, 10) ===
        now.toISOString().slice(0, 10)
      actionItems.push({
        id: `sess-${j.id}`,
        label: `${j.client.name} — ${j.sessionType.name} ${isToday ? "today" : "tomorrow"}`,
        urgency: isToday ? "high" : "low",
        link: `/owner/jobs/${j.id}`,
      })
    }
  }

  // ── Recent activity (with links) ──
  const recentActivity: DashboardStats["recentActivity"] = [
    ...recentInquiries.map((i) => ({
      id: i.id,
      type: "inquiry" as const,
      title: `New inquiry from ${i.name}`,
      at: i.createdAt,
      link: `/owner/inquiries/${i.id}`,
    })),
    ...recentJobs.map((j) => ({
      id: j.id,
      type: "job" as const,
      title: `Job updated for ${j.client.name}`,
      at: j.updatedAt,
      link: `/owner/jobs/${j.id}`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6)

  return {
    newInquiries,
    awaitingContracts,
    awaitingInvoices,
    thisWeekSessions,
    totalClients,
    revenueEarned,
    revenueOutstanding,
    weekSchedule,
    pipeline,
    actionItems,
    recentActivity,
  }
}

export const listInquiries = async (): Promise<InquiryListItem[]> => {
  const rows = await prisma.inquiry.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    sessionTypePref: r.sessionTypePref,
    preferredDate: r.preferredDate,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt,
  }))
}

export const getInquiryDetail = async (
  inquiryId: string
): Promise<InquiryDetail | null> => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      job: {
        select: {
          id: true,
          stage: true,
          sessionDate: true,
          sessionLocation: true,
          sessionToken: true,
          bookingFee: true,
          balanceAmount: true,
          totalPrice: true,
        },
      },
    },
  })
  if (!inquiry) return null

  const client = await prisma.client.findUnique({
    where: { email: inquiry.email },
    select: { id: true, name: true, email: true },
  })

  return {
    inquiry: {
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      sessionTypePref: inquiry.sessionTypePref,
      preferredDate: inquiry.preferredDate,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    },
    job: inquiry.job
      ? {
          id: inquiry.job.id,
          stage: inquiry.job.stage,
          sessionDate: inquiry.job.sessionDate,
          sessionLocation: inquiry.job.sessionLocation,
          sessionToken: inquiry.job.sessionToken,
          bookingFee: inquiry.job.bookingFee,
          balanceAmount: inquiry.job.balanceAmount,
          totalPrice: inquiry.job.totalPrice,
        }
      : null,
    client,
  }
}

export const listSessionTypeOptions = async (): Promise<
  SessionTypeOption[]
> => {
  const rows = await prisma.sessionType.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, slug: true, name: true, duration: true, price: true },
  })
  return rows
}

// ─── Clients ────────────────────────────────────────────────────

export type ClientListItem = {
  id: string
  name: string
  email: string
  phone: string | null
  gdprConsent: boolean
  jobCount: number
  lastSessionDate: Date | null
  lastSessionType: string | null
}

export const listClients = async (): Promise<ClientListItem[]> => {
  const rows = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      jobs: {
        orderBy: { sessionDate: "desc" },
        take: 1,
        include: { sessionType: { select: { name: true } } },
      },
      _count: { select: { jobs: true } },
    },
  })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    gdprConsent: r.gdprConsent,
    jobCount: r._count.jobs,
    lastSessionDate: r.jobs[0]?.sessionDate ?? null,
    lastSessionType: r.jobs[0]?.sessionType.name ?? null,
  }))
}

export type ClientDetail = {
  id: string
  name: string
  email: string
  phone: string | null
  gdprConsent: boolean
  gdprConsentAt: Date | null
  marketingConsent: boolean
  createdAt: Date
  jobs: Array<{
    id: string
    stage: string
    sessionTypeName: string
    sessionDate: Date | null
    totalPrice: number
    balanceStatus: string
  }>
}

export const getClientDetail = async (
  clientId: string
): Promise<ClientDetail | null> => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      jobs: {
        orderBy: { sessionDate: "desc" },
        include: { sessionType: { select: { name: true } } },
      },
    },
  })
  if (!client) return null

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    gdprConsent: client.gdprConsent,
    gdprConsentAt: client.gdprConsentAt,
    marketingConsent: client.marketingConsent,
    createdAt: client.createdAt,
    jobs: client.jobs.map((j) => ({
      id: j.id,
      stage: j.stage,
      sessionTypeName: j.sessionType.name,
      sessionDate: j.sessionDate,
      totalPrice: j.totalPrice,
      balanceStatus: j.balanceStatus,
    })),
  }
}
