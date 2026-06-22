import { requireOwnerPage } from "@/lib/auth/require-owner"
import { OwnerShell } from "@/components/owner/owner-shell"

export default async function AuthedOwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireOwnerPage()
  return <OwnerShell>{children}</OwnerShell>
}
