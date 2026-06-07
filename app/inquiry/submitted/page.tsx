import Link from "next/link"
import { Wordmark } from "@/components/brand/wordmark"

export default function Submitted() {
  return (
    <main className="relative min-h-screen bg-paper px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-350">
        <Link href="/">
          <Wordmark size="md" />
        </Link>
      </div>

      <div className="mx-auto mt-20 grid max-w-3xl place-items-center text-center">
        <div className="animate-bloom relative mb-12">
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
            <circle
              cx="42"
              cy="42"
              r="40"
              stroke="var(--clay)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <g className="animate-scribe">
              <path
                d="M26 44 L38 56 L60 30"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-clay uppercase">
          <span className="h-px w-8 bg-clay/60" />
          Received
          <span className="h-px w-8 bg-clay/60" />
        </div>

        <h1 className="animate-lift mt-6 font-display text-5xl leading-none font-light tracking-tight lg:text-6xl">
          Your inquiry is
          <br />
          <span className="text-clay italic">on my desk.</span>
        </h1>

        <p
          className="animate-lift mt-8 max-w-lg text-base leading-relaxed text-ink/75"
          style={{ animationDelay: "0.15s" }}
        >
          I read every message myself. Expect a personal reply within the hour
          during studio days — within the morning on a weekend. Your inquiry
          reference is below.
        </p>

        <div
          className="animate-lift mt-12 grid w-full grid-cols-3 gap-px border border-hairline bg-hairline"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            ["Reference", `INQ-${new Date().getFullYear()}-0481`],
            [
              "Received",
              new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              }),
            ],
            ["Reply by", "Within 1 hr"],
          ].map(([l, v]) => (
            <div key={l} className="bg-paper px-6 py-6 text-left">
              <div className="text-[10px] tracking-[0.24em] text-ink/45 uppercase">
                {l}
              </div>
              <div className="mt-2 font-display text-xl text-ink">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="border border-ink/30 px-6 py-3 text-[11px] tracking-[0.24em] text-ink uppercase transition hover:border-ink"
          >
            Back to the studio
          </Link>
          <a
            href="https://www.instagram.com"
            className="border-b border-ink/30 pb-1 text-[11px] tracking-[0.24em] text-ink/60 uppercase transition hover:border-ink hover:text-ink"
          >
            See recent work
          </a>
        </div>
      </div>
    </main>
  )
}
