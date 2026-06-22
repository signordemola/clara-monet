import { JobStage } from "../../generated/prisma/enums"
import { getStageLabel } from "@/lib/stages"
import { Badge } from "@/components/ui/badge"

const stageTone: Record<
  JobStage,
  "default" | "secondary" | "outline" | "destructive"
> = {
  BOOKED: "default",
  QUESTIONNAIRE_SENT: "secondary",
  QUESTIONNAIRE_DONE: "secondary",
  SESSION_COMPLETE: "outline",
  GALLERY_SENT: "default",
  PAID: "default",
  COMPLETE: "outline",
}

export const StageBadge = ({ stage }: { stage: JobStage }) => {
  return <Badge variant={stageTone[stage]}>{getStageLabel(stage)}</Badge>
}
