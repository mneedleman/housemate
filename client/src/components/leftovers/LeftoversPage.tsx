import { useQuery } from "@apollo/client/react"
import { CookieIcon, PlusIcon } from "@radix-ui/react-icons"
import { LeftoversDocument } from "src/__generated__/types"
import { toDate } from "src/utils/dateUtils"
import { useCreate } from "../layout/CreateContext"
import Button from "../ui/Button"
import EmptyState from "../ui/EmptyState"
import { SkeletonList } from "../ui/Skeleton"
import LeftoversList from "./LeftoversList"

const LeftoversPage = () => {
  const { data, loading } = useQuery(LeftoversDocument)
  const { openCreate } = useCreate()

  if (loading && !data) return <SkeletonList />

  const leftovers = [...(data?.leftovers ?? [])].sort(
    (a, b) => (toDate(a.trashBy)?.getTime() ?? Infinity) - (toDate(b.trashBy)?.getTime() ?? Infinity)
  )

  if (!leftovers.length) {
    return (
      <EmptyState
        icon={<CookieIcon />}
        title="The fridge is clear"
        description="Log leftovers as they go in and you'll see what to eat first — and what to toss."
        action={<Button icon={<PlusIcon />} onClick={openCreate}>Add leftover</Button>}
      />
    )
  }

  return <LeftoversList leftovers={leftovers} />
}

export default LeftoversPage
