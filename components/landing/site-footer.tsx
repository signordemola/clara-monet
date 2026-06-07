import Link from "next/link"
import { Wordmark } from "@/components/brand/wordmark"

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Wordmark size="md" />
            <p className="mt-5 max-w-xs text-sm text-ink/65">
              Independent portrait studio, Hackney E8. Working with clients
              across London &amp; the South-East.
            </p>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] tracking-[0.24em] text-ink/65 uppercase">
              Studio
            </div>
            <p className="text-ink/80">
              7 Mentmore Terrace
              <br />
              London E8 3DQ
              <br />
              By appointment
            </p>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] tracking-[0.24em] text-ink/65 uppercase">
              Reach me
            </div>
            <p className="text-ink/80">
              studio@claramonet.co.uk
              <br />
              <Link
                href="/portal/demo-sarah"
                className="inline-block text-ink transition hover:text-clay"
              >
                Client portal
              </Link>
              <br />
              <Link
                href="/owner/login"
                className="inline-block text-ink/60 transition hover:text-clay"
              >
                Studio login
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-[10px] tracking-[0.22em] text-ink/65 uppercase">
          <span>© {new Date().getFullYear()} Clara Monét Photography</span>
          <span>ICO ZA834912 · England &amp; Wales</span>
        </div>
      </div>
    </footer>
  )
}
