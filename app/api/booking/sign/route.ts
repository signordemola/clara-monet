import { NextResponse } from "next/server"
import { z } from "zod"
import { ContractSignSchema } from "@/schemas/contract.schema"
import { prisma } from "@/lib/db"
import { apiError } from "@/lib/api-error"
import { generateContractText } from "@/lib/contract"
import { generateSignedContractPDF } from "@/lib/pdf"

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/London",
})

const TokenSchema = z.object({
  bookingToken: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const tokenResult = TokenSchema.safeParse(body)

  if (!tokenResult.success) {
    return apiError(
      400,
      tokenResult.error.issues[0].message,
      tokenResult.error.issues[0].path[0] as string
    )
  }

  const signResult = ContractSignSchema.safeParse(body)
  if (!signResult.success) {
    return apiError(
      400,
      signResult.error.issues[0].message,
      signResult.error.issues[0].path[0] as string
    )
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { bookingToken: tokenResult.data.bookingToken },
    include: { job: { include: { sessionType: true } } },
  })

  if (!inquiry || !inquiry.job) {
    return apiError(404, "Booking not found")
  }

  if (inquiry.job.contractSignedAt) {
    return apiError(409, "Contract already signed")
  }

  const job = inquiry.job
  const client = await prisma.client.findFirst({
    where: { email: inquiry.email },
  })

  const contractText = generateContractText({
    clientName: inquiry.name,
    photographerName: "Clara Monét",
    sessionTypeName: job.sessionType.name,
    sessionDate: job.sessionDate?.toISOString() ?? "TBC",
    sessionTime: job.sessionDate
      ? timeFormatter.format(job.sessionDate)
      : "TBC",
    sessionLocation: job.sessionLocation ?? "TBC",
    imageCount: job.sessionType.imageCount,
    turnaround: job.sessionType.turnaround,
    totalPrice: job.totalPrice,
    bookingFee: job.bookingFee,
    balanceAmount: job.balanceAmount,
    balanceDueDescription: "Balance due on gallery delivery.",
  })

  await generateSignedContractPDF({
    clientName: signResult.data.typedName,
    contractText,
  })

  await prisma.job.update({
    where: { id: job.id },
    data: {
      contractSignedAt: new Date(),
      contractText,
      signedName: signResult.data.typedName,
      modelReleaseGranted: signResult.data.modelRelease,
    },
  })

  if (client) {
    await prisma.client.update({
      where: { id: client.id },
      data: {
        gdprConsent: true,
        gdprConsentAt: new Date(),
        marketingConsent: signResult.data.modelRelease,
      },
    })
  }

  return NextResponse.json({ signed: true })
}
