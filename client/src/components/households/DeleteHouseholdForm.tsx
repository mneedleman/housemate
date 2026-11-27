import { CombinedGraphQLErrors } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { DeleteHouseholdDocument } from "src/__generated__/types"
import FormActions from "../forms/FormActions"
import FormInput from "../forms/FormInput"
import { useModal } from "../modal/Modal"

type Props = {
  id: string
  name: string
  memberCount: number
}

type FormValues = { confirmation: string }

/** Deleting wipes every member's tasks and leftovers, so it asks for the name to be typed. */
const DeleteHouseholdForm = ({ id, name, memberCount }: Props) => {
  const [deleteHousehold] = useMutation(DeleteHouseholdDocument, {
    variables: { id },
    // Members may be moved to another household, which changes everything household-scoped
    refetchQueries: ["households", "currentUser", "timelineItems", "leftovers"],
  })
  const { close } = useModal()
  const formMethods = useForm<FormValues>({ defaultValues: { confirmation: "" } })
  const { handleSubmit, formState: { isSubmitting } } = formMethods

  const onSubmit: SubmitHandler<FormValues> = () =>
    deleteHousehold()
      .then(() => {
        toast.success(`Deleted ${name}`)
        close()
      })
      .catch((error) =>
        toast.error(CombinedGraphQLErrors.is(error) ? error.message : "Couldn't delete that household")
      )

  const others = memberCount - 1

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="space-y-2 text-[15px] text-muted">
          <p>
            <span className="font-medium text-ink">{name}</span> and all of its tasks and leftovers will be
            deleted{others > 0 ? <> for you and {others === 1 ? "1 other member" : `${others} other members`}</> : null}.
            {" "}This can't be undone.
          </p>
          <p>Accounts aren't deleted. Anyone using it as their current household moves to another of theirs.</p>
        </div>
        <FormInput
          label={`Type “${name}” to confirm`}
          fieldName="confirmation"
          autoComplete="off"
          errorMessage="Type the household's name to confirm"
          validate={(value) => String(value ?? "").trim() === name.trim() || "That doesn't match the household's name"}
          required
        />
        <FormActions submitLabel="Delete household" variant="danger" submitting={isSubmitting} />
      </form>
    </FormProvider>
  )
}

export default DeleteHouseholdForm
