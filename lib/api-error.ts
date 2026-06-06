import { NextResponse } from "next/server"

export function apiError(status: number, message: string, field?: string) {
  return NextResponse.json({ error: { message, field, status } }, { status })
}
