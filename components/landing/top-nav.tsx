"use client"

import { useEffect, useState } from "react"
import { Wordmark } from "@/components/brand/wordmark"

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItem =
    "text-[11px] uppercase tracking-[0.22em] text-ink/70 hover:text-ink transition"

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-hairline bg-paper/85 py-3 backdrop-blur"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 lg:px-0">
        <a href="#top" className="block">
          <Wordmark size={scrolled ? "sm" : "md"} />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#work" className={navItem}>
            Work
          </a>
          <a href="#sessions" className={navItem}>
            Sessions
          </a>
          <a href="#about" className={navItem}>
            About
          </a>
          <a
            href="#inquire"
            className="border border-ink bg-ink px-5 py-2.5 text-[10px] tracking-[0.22em] text-paper uppercase transition hover:border-clay hover:bg-clay"
          >
            Begin an inquiry
          </a>
        </nav>
        <a
          href="#inquire"
          className="border border-ink bg-ink px-4 py-2 text-[10px] tracking-[0.22em] text-paper uppercase md:hidden"
        >
          Inquire
        </a>
      </div>
    </header>
  )
}
