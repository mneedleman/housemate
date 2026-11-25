import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { toast } from "react-toastify"
import { useSetHouseholdMutation, type User } from "src/__generated__/types"
import { cn } from "src/utils/cn"
import useToggle from "../../hooks/useToggle"
import { useAuth } from "../auth/AuthProvider"
import Avatar, { AvatarStack } from "../ui/Avatar"
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import Card from "../ui/Card"

type Member = Pick<User, "name" | "email">

type Props = {
  name: string
  users: Member[] | null | undefined
  id: string
}

const HouseholdItem = ({ id, name, users }: Props) => {
  const [showMembers, toggleShowMembers] = useToggle()
  const { currentUser } = useAuth()
  const isCurrent = id === currentUser?.householdId
  const [setHousehold, { loading }] = useSetHouseholdMutation({
    variables: { id },
    // currentUser carries householdId (moves the "Current" badge); the timeline is household-scoped
    refetchQueries: ["currentUser", "timelineItems"],
  })

  const members = users ?? []

  const switchHere = () =>
    setHousehold()
      .then(() => toast.success(`Switched to ${name}`))
      .catch(() => toast.error("Couldn't switch households"))

  return (
    <Card className={cn("overflow-hidden", isCurrent && "border-accent/40 ring-1 ring-accent/20")}>
      <button
        type="button"
        onClick={toggleShowMembers}
        aria-expanded={showMembers}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-medium">{name}</h3>
            {isCurrent && <Badge tone="accent" icon={<CheckIcon className="h-3 w-3" />}>Current</Badge>}
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        {/* On the narrowest phones the name needs the room; members are listed when expanded */}
        <span className="hidden min-[400px]:flex">
          <AvatarStack people={members} />
        </span>
        <ChevronDownIcon className={cn("h-4 w-4 shrink-0 text-muted transition-transform", showMembers && "rotate-180")} />
      </button>

      {showMembers && (
        <div className="animate-fade-in border-t border-line">
          <ul className="divide-y divide-line">
            {members.map(({ name: memberName, email }) => (
              <li key={email} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={memberName} email={email} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{memberName || email}</p>
                  {memberName && <p className="truncate text-xs text-muted">{email}</p>}
                </div>
              </li>
            ))}
          </ul>
          {!isCurrent && (
            <div className="border-t border-line p-4">
              <Button variant="secondary" size="sm" block loading={loading} onClick={switchHere}>
                Make this my current household
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default HouseholdItem
