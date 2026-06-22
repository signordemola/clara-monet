"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { approveInquiry, declineInquiry } from "@/lib/api/owner"

export const useApproveInquiry = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: approveInquiry,
    onSuccess: () => router.refresh(),
  })
}

export const useDeclineInquiry = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: declineInquiry,
    onSuccess: () => router.refresh(),
  })
}
