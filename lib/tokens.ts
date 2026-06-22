import { nanoid } from "nanoid"

export function generateBookingToken(): string {
  return nanoid(21)
}

export function generateSessionToken(): string {
  return nanoid(21)
}
