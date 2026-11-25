import { HomeIcon } from "@radix-ui/react-icons"
import { useHouseholdsQuery } from "src/__generated__/types"
import EmptyState from "../ui/EmptyState"
import { SkeletonList } from "../ui/Skeleton"
import HouseholdItem from "./HouseholdItem"

const HouseholdsPage = () => {
  const { data, loading } = useHouseholdsQuery()

  if (loading && !data) return <SkeletonList count={2} />

  const households = data?.households ?? []

  if (!households.length) {
    return (
      <EmptyState
        icon={<HomeIcon />}
        title="You're not in a household yet"
        description="Once someone adds you to their household, it'll show up here."
      />
    )
  }

  return (
    <div className="grid items-start gap-3 lg:grid-cols-2">
      {households.map(({ name, id, users }) => (
        <HouseholdItem key={id} {...{ name, id, users }} />
      ))}
    </div>
  )
}

export default HouseholdsPage
