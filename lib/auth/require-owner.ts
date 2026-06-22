import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export const requireOwnerPage = async () => {
  const session = await getSession()
  if (!session.isOwner) {
    redirect("/owner/login")
  }
  return session
}
