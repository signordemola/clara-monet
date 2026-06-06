import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { apiError } from "@/lib/api-error"
import {
  ApproveInquirySchema,
  DeclineInquirySchema,
} from "@/schemas/inquiry-action.schema"
import { generateBookingToken } from "@/lib/tokens"

export async function POST(req: Request) {
  await requireOwner()

  const body = await req.json()
  const action = body.action as string

  if (action === "approve") {
    const result = ApproveInquirySchema.safeParse(body)
    if (!result.success) {
      return apiError(
        400,
        result.error.issues[0].message,
        result.error.issues[0].path[0] as string
      )
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: result.data.inquiryId },
    })

    if (!inquiry) return apiError(404, "Inquiry not found")
    if (inquiry.status !== "NEW")
      return apiError(409, "Inquiry already processed")

    const sessionType = await prisma.sessionType.findUnique({
      where: { id: result.data.sessionTypeId },
    })
    if (!sessionType) return apiError(404, "Session type not found")

    const bookingToken = generateBookingToken()
    const totalPrice = sessionType.price
    const bookingFee = sessionType.bookingFee
    const balanceAmount = totalPrice - bookingFee

    await prisma.job.create({
      data: {
        clientId: "",
        sessionTypeId: sessionType.id,
        inquiryId: inquiry.id,
        totalPrice,
        bookingFee,
        balanceAmount,
        sessionToken: "",
        sessionDate: result.data.sessionDate
          ? new Date(result.data.sessionDate)
          : null,
        sessionLocation: result.data.sessionLocation ?? null,
        bookingFeeStatus: "PENDING",
      },
    })

    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: {
        status: "APPROVED",
        bookingToken,
      },
    })

    return NextResponse.json({ success: true, bookingToken })
  }

  if (action === "decline") {
    const result = DeclineInquirySchema.safeParse(body)
    if (!result.success) {
      return apiError(
        400,
        result.error.issues[0].message,
        result.error.issues[0].path[0] as string
      )
    }

    await prisma.inquiry.update({
      where: { id: result.data.inquiryId },
      data: { status: "DECLINED" },
    })

    return NextResponse.json({ success: true })
  }

  return apiError(400, "Invalid action. Must be 'approve' or 'decline'")
}
