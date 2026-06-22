import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-3 w-96" />
      </div>
      <Skeleton className="h-40" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

export default Loading
