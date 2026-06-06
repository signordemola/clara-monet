import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"

export async function GET() {
  await requireOwner()

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ data: inquiries })
}
