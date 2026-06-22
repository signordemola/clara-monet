import { fromZonedTime } from "date-fns-tz"

export const PROVIDER_TZ = "Europe/London"

function providerDate(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  const [hours, minutes] = timeStr.split(":").map(Number)

  const dateParts = [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-")

  const timeParts = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    "00",
  ].join(":")

  const dateTimeStr = `${dateParts}T${timeParts}`
  return fromZonedTime(dateTimeStr, PROVIDER_TZ)
}

export function providerDateOnly(dateStr: string): Date {
  return providerDate(dateStr, "00:00")
}
