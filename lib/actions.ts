"use server"

import { render } from "@react-email/components"
import { InquiryAcknowledgementEmail } from "@/emails/inquiry-acknowledgement"
import { InquirySchema } from "@/schemas/inquiry.schema"
import { prisma } from "@/lib/db"
import { resend } from "@/lib/resend"

export async function submitInquiry(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    sessionTypePref: formData.get("sessionTypePref") as string | null,
    preferredDate: formData.get("preferredDate") as string | null,
    message: formData.get("message") as string,
  }

  const result = InquirySchema.safeParse(raw)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { name, email, phone, sessionTypePref, preferredDate, message } =
    result.data

  await prisma.inquiry.create({
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

  return { success: true }
}
