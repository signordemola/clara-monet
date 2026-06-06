import { z } from "zod"

export const GalleryDeliverySchema = z.object({
  jobId: z.string().min(1),
  galleryUrl: z.url(),
  imageCount: z.number().int().positive(),
})

export type GalleryDeliveryInput = z.infer<typeof GalleryDeliverySchema>
