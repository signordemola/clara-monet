"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { OwnerSidebar } from "./owner-sidebar"
import { OwnerTopbar } from "./owner-topbar"

const titleFor = (pathname: string | null): string => {
  if (!pathname) return "Studio"
  if (pathname.startsWith("/owner/dashboard")) return "Dashboard"
  if (pathname.startsWith("/owner/inquiries")) return "Inquiries"
  if (pathname.startsWith("/owner/jobs")) return "Jobs"
  return "Studio"
}

type OwnerShellProps = {
  children: React.ReactNode
}

export const OwnerShell = ({ children }: OwnerShellProps) => {
  const pathname = usePathname()
  return (
    <SidebarProvider defaultOpen>
      <OwnerSidebar />
      <SidebarInset>
        <OwnerTopbar title={titleFor(pathname)} />
        <div className="flex-1 p-6 md:p-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
