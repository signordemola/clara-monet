import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { signContract, createBookingCheckout } from "@/lib/api/booking"
import { toast } from "sonner"

export const useSignContract = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: signContract,
    onSuccess: (_, variables) => {
      router.push(`/book/${variables.bookingToken}/pay`)
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useCreateBookingCheckout = () => {
  return useMutation({
    mutationFn: createBookingCheckout,
    onError: (err) => toast.error(err.message),
  })
}
