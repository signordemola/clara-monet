import { cn } from "@/lib/utils"

const toneClass: Record<string, string> = {
  paper: "bg-paper text-ink border-hairline",
  ink: "bg-ink text-paper border-ink",
  clay: "bg-clay-soft text-ink border-clay/30",
  sage: "bg-sage/10 text-ink border-sage/30",
}

type StatCardProps = {
  label: string
  value: number | string
  hint?: string
  tone?: keyof typeof toneClass
}

export const StatCard = ({
  label,
  value,
  hint,
  tone = "paper",
}: StatCardProps) => {
  return (
    <div
      className={cn("flex flex-col gap-2 border p-5 md:p-6", toneClass[tone])}
    >
      <p className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
        {label}
      </p>
      <p className="font-display text-3xl font-light tracking-tight md:text-4xl">
        {value}
      </p>
      {hint && <p className="text-xs text-ink/60">{hint}</p>}
    </div>
  )
}
