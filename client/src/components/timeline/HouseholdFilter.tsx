import { cn } from "src/utils/cn"
import { useAuth } from "../auth/AuthProvider"
import { fieldClass } from "../forms/fieldStyles"
import { ALL_HOUSEHOLDS, type HouseholdSelection } from "./useHouseholdSelection"

type Props = Pick<HouseholdSelection, "value" | "households" | "setValue">

const HouseholdFilter = ({ value, households, setValue }: Props) => {
  const { currentUser } = useAuth()

  // Nothing to choose between with a single household
  if (households.length < 2) return null

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="font-medium">Household</span>
      {/* fieldClass is full-width; the wrapper sets the dropdown's actual width */}
      <span className="w-56 max-w-full">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(fieldClass, "h-9 pr-8 text-sm")}
      >
        {households.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}{h.id === currentUser?.householdId ? " (current)" : ""}
          </option>
        ))}
        <option value={ALL_HOUSEHOLDS}>All households</option>
      </select>
      </span>
    </label>
  )
}

export default HouseholdFilter
