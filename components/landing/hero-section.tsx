"use client"

import { useRef } from "react"
import Image from "next/image"
import { useLenis } from "lenis/react"
import heroImg from "@/public/hero.jpg"

export function Hero() {
  const imgRef = useRef<HTMLDivElement>(null)

  useLenis(() => {
    if (!imgRef.current) return
    const y = window.scrollY
    imgRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.05)`
  })

  return (
    <section id="top" className="relative">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        <div className="relative z-10 flex flex-col justify-between px-6 pt-32 pb-12 lg:col-span-5 lg:px-12 lg:pt-40">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-ink/55 uppercase">
            <span className="h-px w-8 bg-ink/30" />
            Est. Hackney · 2021
          </div>

          <div className="mt-auto max-w-xl">
            <h1 className="animate-lift font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] font-light tracking-[-0.02em]">
              Portraits
              <br />
              made in
              <br />
              <span className="text-clay italic">East London.</span>
            </h1>
            <p
              className="animate-lift mt-8 max-w-md text-base leading-relaxed text-ink/75"
              style={{ animationDelay: "0.15s" }}
            >
              A studio for founders, families and quiet professionals. Natural
              light, considered direction, a small number of sessions a month.
            </p>

            <div
              className="animate-lift mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href="#inquire"
                className="group inline-flex items-center gap-3 border border-ink bg-ink px-7 py-4 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
              >
                Begin an inquiry
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#work"
                className="border-b border-ink/30 pb-1 text-[11px] tracking-[0.24em] text-ink/70 uppercase transition hover:border-ink hover:text-ink"
              >
                View the work
              </a>
            </div>
          </div>

          <div className="mt-16 flex items-end justify-between text-[10px] tracking-[0.24em] text-ink/45 uppercase">
            <span>Scroll</span>
            <span className="hidden lg:inline">Studio №.07 · E8</span>
          </div>
        </div>

        <div className="relative h-[50vh] overflow-hidden lg:col-span-7 lg:h-auto">
          <div
            ref={imgRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: "center" }}
          >
            <Image
              src={heroImg}
              alt="Editorial portrait in warm natural light"
              className="h-full w-full object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-paper/30 via-transparent to-transparent" />
          </div>

          <div className="absolute right-6 bottom-6 z-10 text-right text-[10px] tracking-[0.24em] text-paper/85 uppercase mix-blend-difference">
            Frame 014
            <br />
            <span className="opacity-60">Personal brand · 2025</span>
          </div>
        </div>
      </div>
    </section>
  )
}
