import type { HTMLAttributes } from "react"
import { cn } from "src/utils/cn"

const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-2xl border border-line bg-surface shadow-card", className)}
    {...rest}
  />
)

export default Card
