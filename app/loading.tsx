import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="flex w-full max-w-lg flex-col items-center gap-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-3 w-80" />
      </div>
    </main>
  )
}
