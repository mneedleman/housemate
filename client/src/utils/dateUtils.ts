const pad = (n: number) => `${n}`.padStart(2, "0")

/** Today as YYYY-MM-DD, for <input type="date" min>. */
export const useMinDate = () => {
  const date = new Date()

  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-")
}

const DAY_MS = 24 * 60 * 60 * 1000

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const toDate = (value: string | Date | null | undefined) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Whole calendar days from today to `date` (negative = in the past). */
export const daysFromToday = (date: Date) =>
  Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_MS)

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

/** "today", "tomorrow", "in 3 days", "2 weeks ago" … */
export const relativeDay = (date: Date) => {
  const days = daysFromToday(date)
  if (Math.abs(days) < 7) return relative.format(days, "day")
  if (Math.abs(days) < 30) return relative.format(Math.round(days / 7), "week")
  return relative.format(Math.round(days / 30), "month")
}

export const shortDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" })

export type Urgency = "overdue" | "soon" | "later"

export const urgencyOf = (date: Date, soonWithinDays = 2): Urgency => {
  const days = daysFromToday(date)
  if (days < 0) return "overdue"
  if (days <= soonWithinDays) return "soon"
  return "later"
}

/** ISO timestamp → "YYYY-MM-DD" (local) for a date input's value. */
export const toDateInput = (value: string | Date | null | undefined) => {
  const date = toDate(value)
  if (!date) return undefined
  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-")
}

/** "YYYY-MM-DD" from a date input → ISO timestamp at local midnight (what ISO8601DateTime expects). */
export const fromDateInput = (value: string | null | undefined) => {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export default {}
