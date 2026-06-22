import { NextResponse } from "next/server"
import { render } from "@react-email/components"
import { BookingLinkEmail } from "@/emails/booking-link"
import { InquiryDeclinedEmail } from "@/emails/inquiry-declined"
import { prisma } from "@/lib/db"
import { requireOwner } from "@/lib/session"
import { resend } from "@/lib/resend"
import { apiError } from "@/lib/api-error"
import {
  ApproveInquirySchema,
  DeclineInquirySchema,
} from "@/schemas/inquiry-action.schema"
import { generateBookingToken, generateSessionToken } from "@/lib/tokens"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ inquiryId: string }> }
) {
  const [resolvedParams] = await Promise.all([params, requireOwner()])
  const { inquiryId } = resolvedParams

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
  })

  if (!inquiry) return apiError(404, "Inquiry not found")
  return NextResponse.json({ data: inquiry })
}

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

    const client = await prisma.client.upsert({
      where: { email: inquiry.email },
      update: { name: inquiry.name, phone: inquiry.phone ?? undefined },
      create: {
        email: inquiry.email,
        name: inquiry.name,
        phone: inquiry.phone ?? null,
        gdprConsent: false,
      },
    })

    const bookingToken = generateBookingToken()
    const sessionToken = generateSessionToken()
    const totalPrice = sessionType.price
    const bookingFee = sessionType.bookingFee
    const balanceAmount = totalPrice - bookingFee

    await prisma.job.create({
      data: {
        clientId: client.id,
        sessionTypeId: sessionType.id,
        inquiryId: inquiry.id,
        totalPrice,
        bookingFee,
        balanceAmount,
        sessionToken,
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

    try {
      const html = await render(
        BookingLinkEmail({
          clientName: inquiry.name,
          sessionType: sessionType.name,
          bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookingToken}`,
          ownerMessage: result.data.ownerMessage,
        })
      )

      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: inquiry.email,
        subject: `Your booking is ready — Clara Monét Photography`,
        html,
      })
    } catch {}

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

    const inquiry = await prisma.inquiry.update({
      where: { id: result.data.inquiryId },
      data: { status: "DECLINED" },
    })

    try {
      const html = await render(
        InquiryDeclinedEmail({ clientName: inquiry.name })
      )

      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: inquiry.email,
        subject: "Clara Monét Photography",
        html,
      })
    } catch {}

    return NextResponse.json({ success: true })
  }

  return apiError(400, "Invalid action. Must be 'approve' or 'decline'")
}
