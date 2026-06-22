import type { Metadata } from "next"
import { listInquiries } from "@/lib/queries/owner-views"
import { InquiryCard } from "@/components/owner/inquiry-card"

export const metadata: Metadata = {
  title: "Inquiries · Clara Monét",
  description: "New and reviewed inquiries from prospective clients.",
}

export default async function InquiriesPage() {
  const inquiries = await listInquiries()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Inquiries
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
        </h2>
        <p className="text-sm text-muted-foreground">
          New inquiries first, then most recent.
        </p>
      </header>

      {inquiries.length === 0 ? (
        <div className="border border-hairline bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No inquiries yet. The studio is quiet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  )
}
