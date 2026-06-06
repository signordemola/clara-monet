import Image from "next/image"
import work1 from "@/public/work-1.jpg"
import work2 from "@/public/work-2.jpg"
import work3 from "@/public/work-3.jpg"
import claraImg from "@/public/clara.jpg"

const pieces = [
  {
    src: work1,
    title: "Hana, founder",
    meta: "Personal brand · Hackney",
    w: 1024,
    h: 1280,
    span: "lg:col-span-5 lg:row-span-2",
    h2: "h-[640px] lg:h-full",
  },
  {
    src: work3,
    title: "Tomás, advocate",
    meta: "Headshot set · Studio",
    w: 1024,
    h: 1280,
    span: "lg:col-span-3",
    h2: "h-[420px]",
  },
  {
    src: work2,
    title: "The Okafor family",
    meta: "On location · Victoria Park",
    w: 1280,
    h: 1024,
    span: "lg:col-span-4",
    h2: "h-[420px]",
  },
  {
    src: claraImg,
    title: "Imogen, writer",
    meta: "Personal brand · Day rate",
    w: 1280,
    h: 1280,
    span: "lg:col-span-4",
    h2: "h-[460px]",
  },
  {
    src: work3,
    title: "Daniel, board portrait",
    meta: "Headshot · Director",
    w: 1024,
    h: 1280,
    span: "lg:col-span-3",
    h2: "h-[460px]",
  },
]

export function WorkGrid() {
  return (
    <section
      id="work"
      className="relative bg-paper px-6 py-24 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-clay uppercase">
              <span className="h-px w-8 bg-clay/60" />
              Selected work
            </div>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight lg:text-6xl">
              Quiet pictures of <span className="italic">people doing</span>{" "}
              <br className="hidden lg:block" />
              the work they care about.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/70">
            A small sample. Full portfolios are shared on inquiry — I send the
            relevant gallery for the kind of session you&apos;re booking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 lg:grid-rows-2 lg:gap-5">
          {pieces.map((p, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden ${p.span} ${p.h2}`}
            >
              <Image
                src={p.src}
                alt={p.title}
                width={p.w}
                height={p.h}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent p-5 text-paper">
                <div>
                  <div className="font-display text-lg italic">{p.title}</div>
                  <div className="mt-0.5 text-[10px] tracking-[0.22em] uppercase opacity-75">
                    {p.meta}
                  </div>
                </div>
                <span className="translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  →
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
