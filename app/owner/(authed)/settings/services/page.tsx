import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { ServicePriceForm } from "@/components/owner/service-price-form"

export const metadata: Metadata = {
  title: "Services · Clara Monét",
  description: "Edit session type pricing and booking fees.",
}

export default async function ServicesPage() {
  const services = await prisma.sessionType.findMany({
    orderBy: { displayOrder: "asc" },
  })

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Settings
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
          Services
        </h2>
        <p className="text-sm text-muted-foreground">
          Edit pricing for each session type. Changes apply to new bookings
          only.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-5 border border-hairline bg-card p-5 md:p-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-lg font-light tracking-tight">
                {service.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {service.duration} min · {service.imageCount} ·{" "}
                {service.turnaround} turnaround
              </p>
            </div>

            <ServicePriceForm
              id={service.id}
              price={service.price}
              bookingFee={service.bookingFee}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
