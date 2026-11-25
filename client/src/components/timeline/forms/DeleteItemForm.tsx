import { toast } from "react-toastify"
import { useDeleteTimelineItemMutation } from "src/__generated__/types"
import FormActions from "src/components/forms/FormActions"

type Props = {
  id: string
  title?: string
}

const DeleteItemForm = ({ id, title }: Props) => {
  const [deleteItem, { loading }] = useDeleteTimelineItemMutation({
    variables: { id },
    refetchQueries: ["timelineItems"]
  })

  const onDelete = () =>
    deleteItem()
      .then(() => toast.success("Task deleted"))
      .catch(() => toast.error("Couldn't delete that task"))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] text-muted">
        {title ? <><span className="font-medium text-ink">“{title}”</span> will be removed for everyone in your household.</> : "This will be removed for everyone in your household."}
        {" "}This can't be undone.
      </p>
      <FormActions submitLabel="Delete" variant="danger" submitting={loading} onSubmit={onDelete} />
    </div>
  )
}

export default DeleteItemForm
