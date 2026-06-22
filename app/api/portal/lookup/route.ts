import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    )
  }

  const client = await prisma.client.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
        select: {
          sessionToken: true,
          stage: true,
          sessionDate: true,
          sessionType: { select: { name: true } },
        },
      },
    },
  })

  if (!client || client.jobs.length === 0) {
    return NextResponse.json({ sessions: [] })
  }

  return NextResponse.json({
    name: client.name,
    sessions: client.jobs.map((j) => ({
      token: j.sessionToken,
      sessionType: j.sessionType.name,
      sessionDate: j.sessionDate,
      stage: j.stage,
    })),
  })
}
