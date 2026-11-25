import { cn } from "src/utils/cn"
import Card from "./Card"

export const Skeleton = ({ className }: { className?: string }) => (
  <span className={cn("block animate-pulse rounded-md bg-raised", className)} />
)

export const SkeletonList = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }, (_, i) => (
      <Card key={i} className="p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-3 w-1/3" />
      </Card>
    ))}
  </div>
)
