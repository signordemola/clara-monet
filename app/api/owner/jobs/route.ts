import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"

export async function GET(req: Request) {
  await requireOwner()

  const { searchParams } = new URL(req.url)
  const stage = searchParams.get("stage")

  const jobs = await prisma.job.findMany({
    where: stage ? { stage: stage as never } : {},
    include: { client: true, sessionType: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ data: jobs })
}
