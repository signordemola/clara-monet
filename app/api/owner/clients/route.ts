import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"

export async function GET(req: Request) {
  await requireOwner()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  const clients = await prisma.client.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {},
    include: { jobs: true },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ data: clients })
}
