"use client"

import { useLogout } from "@/hooks/use-owner-auth"
import { LogOut } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export const LogoutButton = () => {
  const { mutate, isPending } = useLogout()
  return (
    <SidebarMenuButton
      onClick={() => mutate()}
      disabled={isPending}
      tooltip="Sign out"
    >
      <LogOut />
      <span>{isPending ? "Signing out…" : "Sign out"}</span>
    </SidebarMenuButton>
  )
}
