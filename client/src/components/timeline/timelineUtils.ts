import type { TimelineItemFragment } from "src/__generated__/types"
import { daysFromToday, relativeDay, toDate, type Urgency, urgencyOf } from "src/utils/dateUtils"

export type TimelineStatus = Urgency | "unscheduled"

export const frequencyLabel = ({ frequencyValue, frequencyUnit }: Pick<TimelineItemFragment, "frequencyValue" | "frequencyUnit">) => {
  if (!frequencyValue || !frequencyUnit) return null
  return frequencyValue === 1 ? `Every ${frequencyUnit}` : `Every ${frequencyValue} ${frequencyUnit}`
}

export const statusOf = (item: Pick<TimelineItemFragment, "dueAt">): TimelineStatus => {
  const due = toDate(item.dueAt)
  return due ? urgencyOf(due) : "unscheduled"
}

export const dueLabel = (item: Pick<TimelineItemFragment, "dueAt" | "lastCompletedAt">) => {
  const due = toDate(item.dueAt)
  if (!due) return item.lastCompletedAt ? "No repeat set" : "Not started"
  const days = daysFromToday(due)
  if (days < 0) return `Overdue · ${relativeDay(due)}`
  if (days === 0) return "Due today"
  return `Due ${relativeDay(due)}`
}

/** Soonest first; unscheduled items last. */
export const byDueDate = (a: Pick<TimelineItemFragment, "dueAt">, b: Pick<TimelineItemFragment, "dueAt">) => {
  const da = toDate(a.dueAt)?.getTime() ?? Infinity
  const db = toDate(b.dueAt)?.getTime() ?? Infinity
  return da - db
}
