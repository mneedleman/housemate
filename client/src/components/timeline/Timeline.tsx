import { useQuery } from "@apollo/client/react"
import { LoopIcon, PlusIcon } from '@radix-ui/react-icons'
import { TimelineItemsDocument } from 'src/__generated__/types'
import { useCreate } from '../layout/CreateContext'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import { SkeletonList } from '../ui/Skeleton'
import Item from './Item'
import { byDueDate, statusOf, type TimelineStatus } from './timelineUtils'

const SECTIONS: { status: TimelineStatus; label: string }[] = [
  { status: "overdue", label: "Overdue" },
  { status: "soon", label: "Due soon" },
  { status: "later", label: "Upcoming" },
  { status: "unscheduled", label: "Not scheduled" },
]

const Timeline = () => {
  const { data, loading } = useQuery(TimelineItemsDocument)
  const { openCreate } = useCreate()

  if (loading && !data) {
    return <SkeletonList />
  }

  const items = [...(data?.timelineItems ?? [])].sort(byDueDate)

  if (!items.length) {
    return (
      <EmptyState
        icon={<LoopIcon />}
        title="No tasks yet"
        description="Add the chores that keep coming back — bins, laundry, watering plants — and see what's due at a glance."
        action={<Button icon={<PlusIcon />} onClick={openCreate}>New task</Button>}
      />
    )
  }

  return (
    <div className="space-y-8">
      {SECTIONS.map(({ status, label }) => {
        const group = items.filter((item) => statusOf(item) === status)
        if (!group.length) return null

        return (
          <section key={status} aria-labelledby={`section-${status}`}>
            <h2 id={`section-${status}`} className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
              {label}
              <span className="rounded-full bg-raised px-2 py-0.5 text-xs">{group.length}</span>
            </h2>
            <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.map(item => <Item {...item} key={item.id} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default Timeline
