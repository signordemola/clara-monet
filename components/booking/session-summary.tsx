import { formatDate, formatTime } from "@/lib/utils"

export const SessionSummary = ({
  clientName,
  sessionType,
  sessionDate,
  sessionLocation,
  pricing,
}: {
  clientName: string
  sessionType: { name: string; duration: number; imageCount: string }
  sessionDate: Date | null
  sessionLocation: string | null
  pricing: {
    total: number
    bookingFee: number
    balance: number
    totalFormatted: string
    bookingFeeFormatted: string
    balanceFormatted: string
  }
}) => {
  return (
    <div className="flex flex-col gap-6 border border-hairline bg-card p-6">
      <div>
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Session
        </p>
        <h2 className="font-display text-2xl font-light tracking-tight">
          {sessionType.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {sessionType.duration} minutes · {sessionType.imageCount}
        </p>
      </div>

      <div className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Client</span>
          <span>{clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span>
            {sessionDate
              ? `${formatDate(sessionDate)} at ${formatTime(sessionDate)}`
              : "To be confirmed"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location</span>
          <span>{sessionLocation ?? "To be confirmed"}</span>
        </div>
      </div>

      <div className="border-t border-hairline pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Session total</span>
          <span>{pricing.totalFormatted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Booking fee today</span>
          <span className="font-medium">{pricing.bookingFeeFormatted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance on delivery</span>
          <span>{pricing.balanceFormatted}</span>
        </div>
      </div>
    </div>
  )
}
