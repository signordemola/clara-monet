"use client"

import { useEffect, useState } from "react"
import { Wordmark } from "@/components/brand/wordmark"

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-40 w-full px-6 transition-all duration-700 ${
        scrolled
          ? "border-b border-hairline bg-paper/85 py-3 backdrop-blur lg:px-10"
          : "bg-transparent py-5 lg:px-12"
      }`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between transition-all duration-700 ${
          scrolled ? "max-w-[1500px]" : "max-w-[100vw]"
        }`}
      >
        <a href="#top" className="block">
          <Wordmark size={scrolled ? "sm" : "md"} />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#work"
            className={`text-[11px] tracking-[0.22em] uppercase transition-all duration-700 ${
              scrolled
                ? "text-ink/80 hover:text-ink"
                : "text-ink/80 hover:text-ink md:text-paper-warm/80 md:hover:text-paper"
            }`}
          >
            Work
          </a>
          <a
            href="#sessions"
            className={`text-[11px] tracking-[0.22em] uppercase transition-all duration-700 ${
              scrolled
                ? "text-ink/80 hover:text-ink"
                : "text-ink/80 hover:text-ink md:text-paper-warm/80 md:hover:text-paper"
            }`}
          >
            Sessions
          </a>
          <a
            href="#about"
            className={`text-[11px] tracking-[0.22em] uppercase transition-all duration-700 ${
              scrolled
                ? "text-ink/80 hover:text-ink"
                : "text-ink/80 hover:text-ink md:text-paper-warm/80 md:hover:text-paper"
            }`}
          >
            About
          </a>
          <a
            href="#inquire"
            className={`border px-5 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-all duration-700 ${
              scrolled
                ? "border-ink bg-ink text-paper hover:border-clay hover:bg-clay"
                : "border-ink bg-ink text-paper md:border-paper md:bg-paper md:text-ink md:hover:bg-transparent md:hover:text-paper"
            }`}
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
