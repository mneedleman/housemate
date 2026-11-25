import type { ReactNode } from "react"
import Card from "./Card"

type Props = {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

const EmptyState = ({ icon, title, description, action }: Props) => (
  <Card className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-soft-ink [&>svg]:h-6 [&>svg]:w-6">
      {icon}
    </span>
    <h2 className="text-base font-semibold">{title}</h2>
    {description && <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </Card>
)

export default EmptyState
