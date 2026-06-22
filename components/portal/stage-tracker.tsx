import { JobStage } from "@/generated/prisma/enums"
import { STAGE_ORDER, getStageLabel } from "@/lib/stages"
import { CheckIcon } from "lucide-react"

export const StageTracker = ({ currentStage }: { currentStage: JobStage }) => {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)

  return (
    <div className="flex flex-col gap-2">
      {STAGE_ORDER.map((stage, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex

        return (
          <div key={stage} className="flex items-center gap-3">
            <div
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium ${
                completed
                  ? "border-ink bg-ink text-paper"
                  : active
                    ? "border-ink bg-paper text-ink"
                    : "border-hairline bg-paper text-clay"
              }`}
            >
              {completed ? <CheckIcon className="size-3" /> : index + 1}
            </div>
            <span
              className={`text-sm ${
                active ? "font-medium text-ink" : "text-muted-foreground"
              }`}
            >
              {getStageLabel(stage)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
