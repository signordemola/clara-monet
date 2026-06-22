"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { login, logout } from "@/lib/api/auth"

export const useLogin = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: login,
    onSuccess: () => router.push("/owner/dashboard"),
  })
}

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => router.push("/owner/login"),
  })
}
