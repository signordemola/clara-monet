import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  advanceJobStage,
  updateOwnerNotes,
  deliverGallery,
} from "@/lib/api/jobs"
import { toast } from "sonner"

export const useAdvanceJobStage = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (jobId: string) => advanceJobStage(jobId),
    onSuccess: () => {
      router.refresh()
      toast.success("Stage advanced")
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUpdateOwnerNotes = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: updateOwnerNotes,
    onSuccess: () => router.refresh(),
    onError: (err) => toast.error(err.message),
  })
}

export const useDeliverGallery = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: deliverGallery,
    onSuccess: () => {
      router.refresh()
      toast.success("Gallery delivered")
    },
    onError: (err) => toast.error(err.message),
  })
}
