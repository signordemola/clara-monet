import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { apiError } from "@/lib/api-error"

const UpdateServiceSchema = z.object({
  price: z.number().int().positive(),
  bookingFee: z.number().int().positive(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireOwner()
  const [{ id }, body] = await Promise.all([params, req.json()])

  const result = UpdateServiceSchema.safeParse(body)
  if (!result.success) {
    return apiError(400, result.error.issues[0].message)
  }

  const existing = await prisma.sessionType.findUnique({ where: { id } })
  if (!existing) return apiError(404, "Session type not found")

  await prisma.sessionType.update({
    where: { id },
    data: {
      price: result.data.price,
      bookingFee: result.data.bookingFee,
    },
  })

  return NextResponse.json({ updated: true })
}
