import { prisma } from "@/lib/db"

export type DashboardStats = {
  newInquiries: number
  awaitingContracts: number
  awaitingInvoices: number
  thisWeekSessions: number
  totalClients: number
  recentActivity: Array<{
    id: string
    type: "inquiry" | "job"
    title: string
    at: Date
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

  const [
    newInquiries,
    awaitingContracts,
    awaitingInvoices,
    totalClients,
    thisWeekSessions,
    recentInquiries,
    recentJobs,
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
        updatedAt: true,
      },
    }),
  ])

  const recentActivity: DashboardStats["recentActivity"] = [
    ...recentInquiries.map((i) => ({
      id: i.id,
      type: "inquiry" as const,
      title: `New inquiry from ${i.name}`,
      at: i.createdAt,
    })),
    ...recentJobs.map((j) => ({
      id: j.id,
      type: "job" as const,
      title: `Job updated for ${j.client.name}`,
      at: j.updatedAt,
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
