import { nanoid } from "nanoid"
import { prisma } from "./db"

export function generateBookingToken(): string {
  return nanoid(21)
}

export function generateSessionToken(): string {
  return nanoid(21)
}

export async function getJobBySessionToken(token: string) {
  return prisma.job.findUnique({
    where: { sessionToken: token },
    include: {
      client: true,
      sessionType: true,
      questionnaire: true,
    },
  })
}
