import { cn } from "@/lib/utils"

const PHOTOGRAPHY = "PHOTOGRAPHY".split("").map((char, i) => ({
  id: `photo-${i}`,
  char,
}))

interface WordmarkProps {
  className?: string
  tone?: "ink" | "paper"
  size?: "sm" | "md" | "lg"
}

export function Wordmark({
  className,
  tone = "ink",
  size = "md",
}: WordmarkProps) {
  const colour = tone === "ink" ? "text-ink" : "text-paper"

  const sizing = {
    sm: { name: "text-sm", sub: "text-[6.5px]" },
    md: { name: "text-lg", sub: "text-[8px]" },
    lg: { name: "text-2xl", sub: "text-[10px]" },
  }[size]

  const dims = {
    sm: 28,
    md: 36,
    lg: 48,
  }[size]

  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "translate-y-[2.5px]",
          tone === "ink" ? "text-ink" : "text-paper"
        )}
      >
        {/* Viewfinder corner crop marks */}
        <path
          d="M 5 11 V 5 H 11 M 25 5 H 31 V 11 M 5 25 V 31 H 11 M 25 31 H 31 V 25"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        />
        {/* Monogram Initials */}
        <text
          x="8"
          y="18"
          className="font-display text-[15px] font-semibold italic"
          style={{
            fontFamily: "var(--font-serif)",
            fill: "var(--sage, #7a8d7a)",
          }}
        >
          c
        </text>
        <text
          x="19"
          y="26"
          className="font-display text-[15px] font-light italic"
          style={{
            fontFamily: "var(--font-serif)",
            fill: "var(--clay, #a15c44)",
          }}
        >
          m
        </text>
        {/* Small focus dot / terracotta indicator */}
        <circle cx="31" cy="5" r="1.5" fill="var(--clay, #a15c44)" />
      </svg>

      <div className={cn("flex w-fit flex-col leading-none", colour)}>
        <div
          className={cn(
            "font-display leading-none font-light tracking-tight whitespace-nowrap",
            sizing.name
          )}
          style={{ wordSpacing: "-0.05em" }}
        >
          Clara Monét
        </div>
        <div
          className={cn(
            "mt-1 flex w-full justify-between leading-none font-medium uppercase opacity-60",
            sizing.sub
          )}
          aria-label="Photography"
        >
          {PHOTOGRAPHY.map(({ id, char }) => (
            <span key={id} aria-hidden="true">
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
