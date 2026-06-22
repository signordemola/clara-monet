const steps = ["Contract", "Payment", "Confirmed"]

export const BookingProgress = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const active = index + 1 === step
        const completed = index + 1 < step
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`text-[10px] font-medium tracking-[0.2em] uppercase ${
                active || completed ? "text-ink" : "text-clay"
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 && <span className="text-clay">—</span>}
          </div>
        )
      })}
    </div>
  )
}
