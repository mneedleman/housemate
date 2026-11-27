import { useMutation } from "@apollo/client/react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateTimelineItemDocument, CreateTimelineItemMutationVariables } from "src/__generated__/types";
import FormActions from "src/components/forms/FormActions";
import { useModal } from "src/components/modal/Modal";
import { fromDateInput } from "src/utils/dateUtils";
import ItemFields from "./ItemFields";

export { UNIT_OPTIONS } from "./ItemFields";

const CreateItemForm = () => {
  const [createItem] = useMutation(CreateTimelineItemDocument)
  const formMethods = useForm<CreateTimelineItemMutationVariables>()
  const { handleSubmit, formState: { isSubmitting } } = formMethods
  const { close } = useModal()

  const onSubmit: SubmitHandler<CreateTimelineItemMutationVariables> = (data) =>
    createItem({
      variables: { ...data, lastCompletedAt: fromDateInput(data.lastCompletedAt) },
      refetchQueries: ["timelineItems"],
    }).then(() => {
      toast.success("Task added")
      close()
    }).catch(() => toast.error("Couldn't add that task"))

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <ItemFields />
        <FormActions submitLabel="Add task" submitting={isSubmitting} />
      </form>
    </FormProvider>
  )
}

export default CreateItemForm;
