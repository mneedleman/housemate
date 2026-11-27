import { useQuery } from "@apollo/client/react"
import { useSearchParams } from "react-router"
import { HouseholdsDocument } from "src/__generated__/types"
import { useAuth } from "../auth/AuthProvider"

export const ALL_HOUSEHOLDS = "all"

type Household = { id: string, name: string }

export type HouseholdSelection = {
  /** Variables for the timelineItems query; undefined while "all" waits for the household list */
  variables?: { householdIds?: string[] }
  /** "all", a household id, or the current household's id (the default) */
  value: string
  households: Household[]
  /** The selected household, when exactly one is selected */
  selected?: Household
  isCurrent: boolean
  setValue: (value: string) => void
}

/**
 * Which households the timeline shows. Kept in the URL (?household=<id>|all) so it survives
 * reloads and can be linked to; no parameter means the user's current household.
 */
export const useHouseholdSelection = (): HouseholdSelection => {
  const [params, setParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { data } = useQuery(HouseholdsDocument)

  const households = data?.households ?? []
  const currentId = currentUser?.householdId ?? undefined
  const requested = params.get("household")
  // Ignore ids for households the user isn't in (stale links, left a household)
  const value =
    requested === ALL_HOUSEHOLDS || households.some((h) => h.id === requested)
      ? requested!
      : currentId ?? ""

  const setValue = (next: string) =>
    setParams((prev) => {
      const updated = new URLSearchParams(prev)
      if (next === currentId) updated.delete("household")
      else updated.set("household", next)
      return updated
    }, { replace: true })

  const isAll = value === ALL_HOUSEHOLDS
  const isCurrent = !isAll && value === currentId

  return {
    value,
    households,
    selected: isAll ? undefined : households.find((h) => h.id === value),
    isCurrent,
    setValue,
    variables: isAll
      ? (data ? { householdIds: households.map((h) => h.id) } : undefined)
      : isCurrent || !value ? {} : { householdIds: [value] },
  }
}
