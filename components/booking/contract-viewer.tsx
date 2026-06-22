import { generateContractText } from "@/lib/contract"

export const ContractViewer = ({
  clientName,
  sessionTypeName,
  sessionDate,
  sessionLocation,
  imageCount,
  turnaround,
  totalPrice,
  bookingFee,
  balanceAmount,
}: {
  clientName: string
  sessionTypeName: string
  sessionDate: Date | null
  sessionLocation: string | null
  imageCount: string
  turnaround: string
  totalPrice: number
  bookingFee: number
  balanceAmount: number
}) => {
  const contractText = generateContractText({
    clientName,
    photographerName: "Clara Monét",
    sessionTypeName,
    sessionDate: sessionDate?.toISOString() ?? "TBC",
    sessionTime: sessionDate
      ? new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        }).format(sessionDate)
      : "TBC",
    sessionLocation: sessionLocation ?? "TBC",
    imageCount,
    turnaround,
    totalPrice,
    bookingFee,
    balanceAmount,
    balanceDueDescription: "Balance due on gallery delivery.",
  })

  return (
    <div className="max-h-[60vh] overflow-y-auto border border-hairline bg-card p-6">
      <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink/90">
        {contractText}
      </pre>
    </div>
  )
}
