import { useMutation, useQuery } from "@apollo/client/react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { EditTimelineItemDocument, TimelineItemDocument, FrequencyEnum, type EditTimelineItemMutationVariables, type TimelineItemFragment } from "src/__generated__/types"
import FormActions from "src/components/forms/FormActions"
import { useModal } from "src/components/modal/Modal"
import { Skeleton } from "src/components/ui/Skeleton"
import { fromDateInput, toDateInput } from "src/utils/dateUtils"
import ItemFields from "./ItemFields"

type Props = {
  id: string
}

// The API formats the unit for display ("day" when the value is 1); the enum input wants the plural
const toUnitEnum = (unit?: string | null) =>
  unit ? ((unit.endsWith("s") ? unit : `${unit}s`) as FrequencyEnum) : undefined

const EditItemFormContent = ({ item }: { item: TimelineItemFragment }) => {
  const [editItem] = useMutation(EditTimelineItemDocument)
  const { close } = useModal()

  const formMethods = useForm<EditTimelineItemMutationVariables>({
    defaultValues: {
      id: item.id,
      title: item.title,
      body: item.body,
      frequencyValue: item.frequencyValue,
      frequencyUnit: toUnitEnum(item.frequencyUnit),
      lastCompletedAt: toDateInput(item.lastCompletedAt),
    }
  })
  const { handleSubmit, formState: { isSubmitting } } = formMethods

  const onSubmit: SubmitHandler<EditTimelineItemMutationVariables> = (data) =>
    editItem({
      variables: { ...data, id: item.id, lastCompletedAt: fromDateInput(data.lastCompletedAt) },
    }).then(() => {
      toast.success("Task updated")
      close()
    }).catch(() => toast.error("Couldn't save your changes"))

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <ItemFields />
        <FormActions submitLabel="Save changes" submitting={isSubmitting} />
      </form>
    </FormProvider>
  )
}

const EditItemForm = ({ id }: Props) => {
  const { data } = useQuery(TimelineItemDocument, { variables: { id } })

  if (!data?.timelineItem) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return <EditItemFormContent item={data.timelineItem} />
}

export default EditItemForm
