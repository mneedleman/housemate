import { useMutation } from "@apollo/client/react"
import { CheckIcon, ChevronDownIcon, ClockIcon, LoopIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { toast } from 'react-toastify'
import { EditTimelineItemDocument, type TimelineItemFragment } from 'src/__generated__/types'
import { cn } from 'src/utils/cn'
import { relativeDay, shortDate, toDate } from 'src/utils/dateUtils'
import useToggle from '../../hooks/useToggle'
import DropMenu, { type Option } from '../dropdown/DropMenu'
import Modal from '../modal/Modal'
import Badge, { type Tone } from '../ui/Badge'
import Card from '../ui/Card'
import DeleteItemForm from './forms/DeleteItemForm'
import EditItemForm from './forms/EditItemForm'
import { dueLabel, frequencyLabel, statusOf, type TimelineStatus } from './timelineUtils'

export type ItemProps = TimelineItemFragment

const statusTone: Record<TimelineStatus, Tone> = {
  overdue: "danger",
  soon: "warn",
  later: "accent",
  unscheduled: "neutral",
}

const statusBar: Record<TimelineStatus, string> = {
  overdue: "bg-danger",
  soon: "bg-warn",
  later: "bg-accent",
  unscheduled: "bg-line",
}

const Item = (item: ItemProps) => {
  const { id, title, body, lastCompletedAt } = item
  const [showDetails, toggleShowDetails] = useToggle()
  const [trashOpen, toggleTrash, setTrashOpen] = useToggle()
  const [editOpen, toggleEdit, setEditOpen] = useToggle()

  const status = statusOf(item)
  const frequency = frequencyLabel(item)
  const lastDone = toDate(lastCompletedAt)
  const hasDetails = !!body || !!lastDone

  const [complete] = useMutation(EditTimelineItemDocument)
  const markDone = () =>
    complete({ variables: { id, title, lastCompletedAt: new Date().toISOString() } })
      .then(() => toast.success(`Marked “${title}” done`))
      .catch(() => toast.error("Couldn't update that task"))

  const options: Option[] = [
    { label: "Mark done", icon: <CheckIcon />, onSelect: markDone },
    { label: "Edit", icon: <Pencil1Icon />, onSelect: toggleEdit },
    { label: "Delete", icon: <TrashIcon />, onSelect: toggleTrash, tone: "danger" }
  ]

  return (
    <Card className="relative overflow-visible">
      <span className={cn("absolute inset-y-3 left-0 w-1 rounded-r-full", statusBar[status])} aria-hidden />
      <div className="flex items-start gap-2 py-3.5 pr-2 pl-5">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={toggleShowDetails}
          aria-expanded={showDetails}
          disabled={!hasDetails}
        >
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-medium">{title}</span>
            {hasDetails && (
              <ChevronDownIcon
                className={cn("h-4 w-4 shrink-0 text-muted transition-transform", showDetails && "rotate-180")}
              />
            )}
          </span>
          <span className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={statusTone[status]} icon={<ClockIcon className="h-3 w-3" />}>{dueLabel(item)}</Badge>
            {frequency && <Badge icon={<LoopIcon className="h-3 w-3" />}>{frequency}</Badge>}
          </span>
        </button>
        <DropMenu options={options} label={`Options for ${title}`} />
      </div>

      {showDetails && (
        <div className="animate-fade-in space-y-2 border-t border-line px-5 py-3 text-sm">
          {body && <p className="whitespace-pre-line text-ink/90">{body}</p>}
          {lastDone && (
            <p className="text-muted">
              Last done {shortDate(lastDone)} <span className="text-muted/70">· {relativeDay(lastDone)}</span>
            </p>
          )}
        </div>
      )}

      <Modal open={trashOpen} onClose={() => setTrashOpen(false)} title="Delete task?">
        <DeleteItemForm id={id} title={title} />
      </Modal>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit task">
        <EditItemForm id={id} />
      </Modal>
    </Card>
  )
}

export default Item
