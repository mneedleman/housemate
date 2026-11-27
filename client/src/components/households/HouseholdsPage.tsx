import { useQuery } from "@apollo/client/react"
import { HomeIcon, PlusIcon } from "@radix-ui/react-icons"
import { HouseholdsDocument } from "src/__generated__/types"
import { useCreate } from "../layout/CreateContext"
import Button from "../ui/Button"
import EmptyState from "../ui/EmptyState"
import { SkeletonList } from "../ui/Skeleton"
import HouseholdItem from "./HouseholdItem"

const HouseholdsPage = () => {
  const { data, loading } = useQuery(HouseholdsDocument)
  const { openCreate } = useCreate()

  if (loading && !data) return <SkeletonList count={2} />

  const households = data?.households ?? []

  if (!households.length) {
    return (
      <EmptyState
        icon={<HomeIcon />}
        title="You're not in a household yet"
        description="Create one for your home, or ask someone to add you to theirs."
        action={<Button icon={<PlusIcon />} onClick={openCreate}>New household</Button>}
      />
    )
  }

  return (
    <div className="grid items-start gap-3 lg:grid-cols-2">
      {households.map(({ name, id, users, isOwner, owner, pendingInvitations }) => (
        <HouseholdItem key={id} {...{ name, id, users, isOwner, pendingInvitations }} ownerEmail={owner?.email} />
      ))}
    </div>
  )
}

export default HouseholdsPage
