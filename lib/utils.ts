import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatInTimeZone } from "date-fns-tz"
import { PROVIDER_TZ } from "./time"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100)
}

export function formatDate(date: Date): string {
  return formatInTimeZone(date, PROVIDER_TZ, "EEEE d MMMM yyyy")
}

export function formatShortDate(date: Date): string {
  return formatInTimeZone(date, PROVIDER_TZ, "d MMM yyyy")
}

export function formatTime(date: Date): string {
  return formatInTimeZone(date, PROVIDER_TZ, "HH:mm")
}
