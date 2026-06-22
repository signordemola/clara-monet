import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { submitQuestionnaire, createInvoiceCheckout } from "@/lib/api/portal"
import { toast } from "sonner"

export const useSubmitQuestionnaire = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: submitQuestionnaire,
    onSuccess: () => {
      router.refresh()
      toast.success("Questionnaire submitted")
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useCreateInvoiceCheckout = () => {
  return useMutation({
    mutationFn: createInvoiceCheckout,
    onError: (err) => toast.error(err.message),
  })
}
