import { cn } from "@/lib/utils"

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
  const tile =
    tone === "ink"
      ? "bg-ink text-paper"
      : "bg-paper/10 text-paper border border-paper/30"

  const sizing = {
    sm: { tile: "h-7 w-7 text-[11px]", name: "text-sm", sub: "text-[9px]" },
    md: { tile: "h-9 w-9 text-[13px]", name: "text-lg", sub: "text-[10px]" },
    lg: { tile: "h-12 w-12 text-base", name: "text-2xl", sub: "text-[11px]" },
  }[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-[6px] font-display font-medium italic",
          tile,
          sizing.tile
        )}
      >
        cm
        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-clay" />
      </div>
      <div className={cn("leading-none", colour)}>
        <div className={cn("font-display tracking-tight", sizing.name)}>
          Clara Monét
        </div>
        <div
          className={cn(
            "mt-1 tracking-[0.22em] uppercase opacity-60",
            sizing.sub
          )}
        >
          Photography · E London
        </div>
      </div>
    </div>
  )
}
