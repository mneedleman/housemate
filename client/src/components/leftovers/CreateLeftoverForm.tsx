import { useMutation } from "@apollo/client/react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { CreateLeftoverDocument, type CreateLeftoverMutationVariables } from "src/__generated__/types"
import { fromDateInput } from "src/utils/dateUtils"
import FormActions from "../forms/FormActions"
import FormInput from "../forms/FormInput"
import { useModal } from "../modal/Modal"

const CreateLeftoverForm = () => {
  const [createLeftover] = useMutation(CreateLeftoverDocument)
  const formMethods = useForm<CreateLeftoverMutationVariables>()
  const { handleSubmit, formState: { isSubmitting } } = formMethods
  const { close } = useModal()

  const onSubmit: SubmitHandler<CreateLeftoverMutationVariables> = (data) =>
    createLeftover({
      variables: {
        ...data,
        allergens: data.allergens || undefined,
        // Required field (the form enforces it), so conversion always has a value to work with
        trashBy: fromDateInput(data.trashBy) ?? data.trashBy,
        useBy: fromDateInput(data.useBy),
      },
      refetchQueries: ["leftovers"],
    }).then(() => {
      toast.success("Leftover added")
      close()
    }).catch(() => toast.error("Couldn't add that leftover"))

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormInput
          label="What is it?"
          placeholder="Tuesday's lasagne"
          fieldName="name"
          errorMessage="Give it a name"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Toss by"
            fieldName="trashBy"
            type="date"
            errorMessage="When should it go?"
            required
          />
          <FormInput
            label="Best by (optional)"
            fieldName="useBy"
            type="date"
          />
        </div>
        <FormInput
          label="Allergens"
          description="Optional — e.g. nuts, dairy, gluten"
          placeholder="None"
          fieldName="allergens"
        />
        <FormActions submitLabel="Add leftover" submitting={isSubmitting} />
      </form>
    </FormProvider>
  )
}

export default CreateLeftoverForm
