import { ClockIcon, ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons"
import type { LeftoverFragment } from "src/__generated__/types"
import { cn } from "src/utils/cn"
import { daysFromToday, relativeDay, shortDate, toDate, type Urgency, urgencyOf } from "src/utils/dateUtils"
import Badge, { urgencyTone } from "../ui/Badge"
import Card from "../ui/Card"

type Props = {
  leftovers: LeftoverFragment[]
}

const accent: Record<Urgency, string> = {
  overdue: "bg-danger-soft text-danger",
  soon: "bg-warn-soft text-warn",
  later: "bg-accent-soft text-accent-soft-ink",
}

const trashLabel = (date: Date) => {
  const days = daysFromToday(date)
  if (days < 0) return `Past toss date · ${relativeDay(date)}`
  if (days === 0) return "Toss today"
  return `Toss ${relativeDay(date)}`
}

export const LeftoverCard = ({ name, trashBy, useBy, allergens }: LeftoverFragment) => {
  const trash = toDate(trashBy)
  const best = toDate(useBy)
  const urgency = trash ? urgencyOf(trash, 1) : "later"

  return (
    <Card className="flex items-center gap-4 p-4">
      {trash && (
        <div className={cn("flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl leading-none", accent[urgency])}>
          <span className="text-[10px] font-semibold uppercase tracking-wide">
            {trash.toLocaleDateString(undefined, { month: "short" })}
          </span>
          <span className="mt-1 text-xl font-semibold">{trash.getDate()}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-medium">{name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {trash && (
            <Badge tone={urgencyTone[urgency]} icon={<TrashIcon className="h-3 w-3" />}>{trashLabel(trash)}</Badge>
          )}
          {best && <Badge icon={<ClockIcon className="h-3 w-3" />}>Best by {shortDate(best)}</Badge>}
          {allergens && (
            <Badge tone="warn" icon={<ExclamationTriangleIcon className="h-3 w-3" />}>{allergens}</Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

const LeftoversList = ({ leftovers }: Props) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {leftovers.map((leftover) => <LeftoverCard key={leftover.id} {...leftover} />)}
  </div>
)

export default LeftoversList
