import { ArrowRightIcon, CookieIcon, HomeIcon, LoopIcon } from "@radix-ui/react-icons"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { useHouseholdsQuery, useLeftoversQuery, useTimelineItemsQuery } from "src/__generated__/types"
import { cn } from "src/utils/cn"
import { daysFromToday, toDate } from "src/utils/dateUtils"
import { firstName } from "src/utils/stringUtils"
import { useAuth } from "../auth/AuthProvider"
import { LeftoverCard } from "../leftovers/LeftoversList"
import Item from "../timeline/Item"
import { byDueDate, statusOf } from "../timeline/timelineUtils"
import Card from "../ui/Card"
import { Skeleton } from "../ui/Skeleton"

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

type StatProps = {
  to: string
  icon: ReactNode
  label: string
  value?: number | string
  hint?: string
  alert?: boolean
}

const Stat = ({ to, icon, label, value, hint, alert }: StatProps) => (
  <Link to={to} className="group block min-w-0">
    <Card className="h-full p-3.5 transition-colors group-hover:bg-raised/60 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-ink sm:h-9 sm:w-9 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
        <ArrowRightIcon className="hidden h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 sm:block" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl">
        {value ?? <Skeleton className="h-8 w-10" />}
      </p>
      <p className="truncate text-xs font-medium text-muted sm:text-sm">{label}</p>
      {hint && (
        <p className={cn("mt-1 truncate text-[11px] sm:text-xs", alert ? "text-danger" : "text-muted")}>{hint}</p>
      )}
    </Card>
  </Link>
)

const Section = ({ title, to, children }: { title: string; to: string; children: ReactNode }) => (
  <section>
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <Link to={to} className="text-sm font-medium text-accent hover:underline">See all</Link>
    </div>
    <div className="space-y-3">{children}</div>
  </section>
)

const Quiet = ({ children }: { children: ReactNode }) => (
  <Card className="px-4 py-6 text-center text-sm text-muted">{children}</Card>
)

const DashboardPage = () => {
  const { currentUser } = useAuth()
  const { data: timeline } = useTimelineItemsQuery()
  const { data: leftoversData } = useLeftoversQuery()
  const { data: householdsData } = useHouseholdsQuery()

  const items = timeline?.timelineItems ? [...timeline.timelineItems].sort(byDueDate) : undefined
  const needsAttention = items?.filter((i) => ["overdue", "soon"].includes(statusOf(i)))
  const overdue = items?.filter((i) => statusOf(i) === "overdue").length ?? 0

  const leftovers = leftoversData?.leftovers
    ? [...leftoversData.leftovers].sort(
      (a, b) => (toDate(a.trashBy)?.getTime() ?? Infinity) - (toDate(b.trashBy)?.getTime() ?? Infinity)
    )
    : undefined
  const expiringSoon = leftovers?.filter((l) => {
    const d = toDate(l.trashBy)
    return d && daysFromToday(d) <= 1
  })

  const household = householdsData?.households?.find((h) => h.id === currentUser?.householdId)
  const name = firstName(currentUser?.name)

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <p className="text-sm text-muted">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting()}{name ? `, ${name}` : ""}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Stat
          to="/timeline"
          icon={<LoopIcon />}
          label="Tasks"
          value={items?.length}
          hint={overdue ? `${overdue} overdue` : needsAttention?.length ? `${needsAttention.length} due soon` : "All caught up"}
          alert={overdue > 0}
        />
        <Stat
          to="/leftovers"
          icon={<CookieIcon />}
          label="Leftovers"
          value={leftovers?.length}
          hint={expiringSoon?.length ? `${expiringSoon.length} to toss` : "Nothing expiring"}
          alert={!!expiringSoon?.length}
        />
        <Stat
          to="/households"
          icon={<HomeIcon />}
          label={household ? "Members" : "Households"}
          value={household ? household.users?.length ?? 0 : householdsData?.households?.length}
          hint={household?.name}
        />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-6">
        <Section title="Needs attention" to="/timeline">
          {!needsAttention && <Skeleton className="h-20 w-full rounded-2xl" />}
          {needsAttention?.length === 0 && <Quiet>Nothing due in the next couple of days.</Quiet>}
          {needsAttention?.slice(0, 4).map((item) => <Item key={item.id} {...item} />)}
        </Section>

        <Section title="Eat or toss soon" to="/leftovers">
          {!leftovers && <Skeleton className="h-20 w-full rounded-2xl" />}
          {leftovers?.length === 0 && <Quiet>No leftovers logged.</Quiet>}
          {leftovers?.slice(0, 4).map((leftover) => <LeftoverCard key={leftover.id} {...leftover} />)}
        </Section>
      </div>
    </div>
  )
}

export default DashboardPage
