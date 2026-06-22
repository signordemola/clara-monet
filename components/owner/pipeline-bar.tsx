import type { PipelineCounts } from "@/lib/queries/owner-views"

const STAGES: { key: keyof PipelineCounts; label: string; color: string }[] = [
  { key: "BOOKED", label: "Booked", color: "bg-clay/70" },
  { key: "QUESTIONNAIRE_SENT", label: "Q sent", color: "bg-clay/50" },
  { key: "QUESTIONNAIRE_DONE", label: "Q done", color: "bg-clay/40" },
  { key: "SESSION_COMPLETE", label: "Shot", color: "bg-sage/60" },
  { key: "GALLERY_SENT", label: "Gallery", color: "bg-sage/40" },
  { key: "PAID", label: "Paid", color: "bg-ink/30" },
  { key: "COMPLETE", label: "Complete", color: "bg-ink/15" },
]

export const PipelineBar = ({ pipeline }: { pipeline: PipelineCounts }) => {
  const total = Object.values(pipeline).reduce((a, b) => a + b, 0)
  if (total === 0) return null

  return (
    <section className="border border-hairline bg-card p-5 md:p-6">
      <h3 className="mb-4 font-display text-lg font-light tracking-tight">
        Pipeline
      </h3>

      {/* Bar */}
      <div className="flex h-3 overflow-hidden rounded-sm">
        {STAGES.map(({ key, color }) => {
          const count = pipeline[key]
          if (count === 0) return null
          return (
            <div
              key={key}
              className={`${color} transition-all`}
              style={{ width: `${(count / total) * 100}%` }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {STAGES.map(({ key, label, color }) => {
          const count = pipeline[key]
          if (count === 0) return null
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-sm ${color}`} />
              <span className="text-[10px] tracking-[0.15em] text-ink/65 uppercase">
                {label}
              </span>
              <span className="font-display text-sm font-light">{count}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
