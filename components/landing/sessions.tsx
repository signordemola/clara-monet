import { SESSION_TYPES, type SessionType, formatPence } from "@/lib/mock-data"

const order: SessionType[] = ["personal-brand", "family", "headshots"]

export function Sessions() {
  return (
    <section
      id="sessions"
      className="relative bg-ink px-6 py-28 text-paper lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-clay-soft uppercase">
              <span className="h-px w-8 bg-clay/70" />
              Sessions
            </div>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight lg:text-6xl">
              Three ways
              <br />
              to <span className="text-clay-soft italic">work together.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-paper/75 lg:col-span-5 lg:col-start-8">
            Every session begins with an inquiry, not a checkout. I read every
            message myself, usually reply within the hour, and send a tailored
            booking link once we&apos;ve agreed a date.
          </p>
        </div>

        <div className="grid gap-px bg-paper/15 lg:grid-cols-3">
          {order.map((key, i) => {
            const s = SESSION_TYPES[key]
            return (
              <article
                key={key}
                className="group relative flex flex-col gap-8 bg-ink p-8 transition hover:bg-ink/70 lg:p-12"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl text-clay italic">
                    0{i + 1}
                  </span>
                  <div className="text-right text-[10px] tracking-[0.24em] text-paper/55 uppercase">
                    {s.duration}
                    <br />
                    {s.images}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-light tracking-tight">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">
                    {s.blurb}
                  </p>
                </div>

                <div className="mt-auto space-y-3 border-t border-paper/15 pt-6">
                  <SessionRow label="From" value={formatPence(s.price)} bold />
                  <SessionRow label="Booking fee" value={formatPence(s.fee)} />
                  <SessionRow label="Turnaround" value={s.turnaround} />
                </div>

                <a
                  href="#inquire"
                  className="inline-flex items-center gap-3 text-[11px] tracking-[0.24em] text-paper uppercase transition group-hover:text-clay-soft"
                >
                  Inquire about this
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-[11px] tracking-[0.22em] text-paper/45 uppercase">
          All prices in GBP. 25% non-refundable booking fee secures the date.
          Balance due alongside gallery delivery.
        </p>
      </div>
    </section>
  )
}

function SessionRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-[10px] tracking-[0.24em] text-paper/55 uppercase">
        {label}
      </span>
      <span
        className={
          bold ? "font-display text-2xl font-light text-paper" : "text-paper/90"
        }
      >
        {value}
      </span>
    </div>
  )
}
