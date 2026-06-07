import Image from "next/image"
import claraImg from "@/public/clara.jpg"

const stats = [
  ["180+", "Sessions delivered"],
  ["4.9", "Avg client rating"],
  ["E8", "Hackney studio"],
] as const

export function About() {
  return (
    <section
      id="about"
      className="relative bg-paper px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden">
            <Image
              src={claraImg}
              alt="Clara in her Hackney studio"
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between text-[10px] tracking-[0.22em] text-paper uppercase">
              <span>Clara, in studio</span>
              <span className="opacity-70">Sheet 22 · 6×6</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-clay uppercase">
            <span className="h-px w-8 bg-clay/60" />
            The studio
          </div>
          <h2 className="mt-5 font-display text-5xl leading-none font-light tracking-tight lg:text-6xl">
            I&apos;m <span className="italic">Clara</span>,
            <br />
            and I shoot
            <br />
            quietly.
          </h2>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/75">
            <p>
              Five years ago I left an art-direction job in Soho to take
              portraits full-time from a small studio off Mare Street. Today my
              work lives mostly on people&apos;s websites, LinkedIn feeds and
              mantelpieces.
            </p>
            <p>
              Sessions are slow on purpose. I send a thoughtful questionnaire
              before we shoot, I send your gallery and invoice in the same email
              — never one held against the other — and I&apos;m answering my own
              emails on the other end.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-3">
            {stats.map(([n, l]) => (
              <div key={l} className="bg-paper px-6 py-6">
                <div className="font-display text-3xl font-light text-ink">
                  {n}
                </div>
                <div className="mt-2 text-[10px] tracking-[0.22em] text-ink/75 uppercase">
                  {l}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
