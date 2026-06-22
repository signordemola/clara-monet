"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

type OwnerTopbarProps = {
  title: string
}

export const OwnerTopbar = ({ title }: OwnerTopbarProps) => {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-hairline bg-paper px-4 md:h-16 md:px-8">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1">
        <h1 className="font-display text-lg font-light tracking-tight md:text-xl">
          {title}
        </h1>
      </div>
    </header>
  )
}
