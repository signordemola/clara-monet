const ITEMS = [
  "Personal brand",
  "Family",
  "Headshots",
  "On location · London",
  "Studio · Hackney E8",
  "Pic-Time delivery",
  "ICO registered",
]

const TRIPLED = ITEMS.flatMap((text) =>
  Array.from({ length: 3 }, (_, copy) => ({ id: `${text}-${copy}`, text }))
)

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-hairline bg-paper-warm py-4">
      <div className="animate-marquee flex gap-12 text-[10px] tracking-[0.32em] whitespace-nowrap text-ink/55 uppercase">
        {TRIPLED.map(({ id, text }) => (
          <span key={id} className="flex items-center gap-12">
            {text}
            <span className="h-1 w-1 rounded-full bg-clay" />
          </span>
        ))}
      </div>
    </div>
  )
}
