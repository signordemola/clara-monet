import { NextResponse } from "next/server"
import { createHash, timingSafeEqual } from "node:crypto"
import { LoginSchema } from "@/schemas/auth.schema"
import { getSession } from "@/lib/session"
import { apiError } from "@/lib/api-error"

export async function POST(req: Request) {
  const body = await req.json()
  const result = LoginSchema.safeParse(body)

  if (!result.success) {
    return apiError(
      400,
      result.error.issues[0].message,
      result.error.issues[0].path[0] as string
    )
  }

  const hash = createHash("sha256").update(result.data.password).digest("hex")
  const expected = Buffer.from(hash, "hex")
  const actual = Buffer.from(process.env.OWNER_PASSWORD_HASH!, "hex")

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return apiError(401, "Invalid password")
  }

  const session = await getSession()
  session.isOwner = true
  await session.save()

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ success: true })
}
