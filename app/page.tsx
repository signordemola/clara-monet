import { TopNav } from "@/components/landing/top-nav"
import { Hero } from "@/components/landing/hero-section"
import { Marquee } from "@/components/landing/marquee"
import { WorkGrid } from "@/components/landing/work-grid"
import { Sessions } from "@/components/landing/sessions"
import { About } from "@/components/landing/about"
import { InquirySection } from "@/components/landing/inquiry-section"
import { SiteFooter } from "@/components/landing/site-footer"

export default function Page() {
  return (
    <main className="bg-paper text-ink">
      <TopNav />
      <Hero />
      <Marquee />
      <WorkGrid />
      <Sessions />
      <About />
      <InquirySection />
      <SiteFooter />
    </main>
  )
}
