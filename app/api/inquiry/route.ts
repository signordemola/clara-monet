import { NextResponse } from "next/server"
import { render } from "@react-email/components"
import { InquiryAcknowledgementEmail } from "@/emails/inquiry-acknowledgement"
import { InquirySchema } from "@/schemas/inquiry.schema"
import { prisma } from "@/lib/db"
import { resend } from "@/lib/resend"
import { apiError } from "@/lib/api-error"

export async function POST(req: Request) {
  const body = await req.json()
  const result = InquirySchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const { name, email, phone, sessionTypePref, preferredDate, message } =
    result.data

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone: phone ?? null,
      sessionTypePref: sessionTypePref ?? null,
      preferredDate: preferredDate ?? null,
      message,
      status: "NEW",
    },
  })

  try {
    const html = await render(
      InquiryAcknowledgementEmail({
        clientName: name,
        sessionTypePref: sessionTypePref ?? undefined,
        message,
      })
    )

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Thank you for your inquiry — Clara Monét Photography",
      html,
    })
  } catch {
    // email failure never blocks inquiry creation
  }

  return NextResponse.json({ success: true, inquiryId: inquiry.id })
}
