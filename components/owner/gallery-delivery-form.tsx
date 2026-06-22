"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDeliverGallery } from "@/hooks/use-jobs"
import { zodResolver } from "@/lib/forms/zod-resolver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

const GalleryDeliverySchema = z.object({
  galleryUrl: z.string().min(1),
  imageCount: z.coerce.number().int().positive(),
})

type GalleryDeliveryValues = z.infer<typeof GalleryDeliverySchema>

export const GalleryDeliveryForm = ({ jobId }: { jobId: string }) => {
  const deliver = useDeliverGallery()
  const form = useForm<GalleryDeliveryValues>({
    resolver: zodResolver(GalleryDeliverySchema),
    defaultValues: { galleryUrl: "", imageCount: 0 },
  })

  const onSubmit = form.handleSubmit((values) => {
    deliver.mutate({ jobId, ...values })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="galleryUrl">Gallery URL</FieldLabel>
        <Input
          id="galleryUrl"
          type="url"
          placeholder="https://claramonet.pic-time.com/..."
          {...form.register("galleryUrl")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="imageCount">Number of images</FieldLabel>
        <Input id="imageCount" type="number" {...form.register("imageCount")} />
      </Field>

      <Button type="submit" disabled={deliver.isPending}>
        {deliver.isPending ? "Delivering…" : "Deliver gallery"}
      </Button>
    </form>
  )
}
