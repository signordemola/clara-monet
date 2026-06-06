import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  isOwner: boolean
}

export const sessionOptions = {
  cookieName: "clara-monet-session",
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function requireOwner() {
  const session = await getSession()
  if (!session.isOwner) {
    throw new Error("Unauthorized")
  }
  return session
}
