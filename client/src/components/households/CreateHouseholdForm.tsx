import { CombinedGraphQLErrors } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { CreateHouseholdDocument } from "src/__generated__/types"
import { useAuth } from "../auth/AuthProvider"
import FormActions from "../forms/FormActions"
import FormInput from "../forms/FormInput"
import { useModal } from "../modal/Modal"

type FormValues = {
  name: string
  makeCurrent: boolean
}

const CreateHouseholdForm = () => {
  const [createHousehold] = useMutation(CreateHouseholdDocument)
  const { currentUser } = useAuth()
  const { close } = useModal()
  // Someone without a current household can't add tasks or leftovers yet, so default to switching
  const formMethods = useForm<FormValues>({
    defaultValues: { name: "", makeCurrent: !currentUser?.householdId },
  })
  const { handleSubmit, register, formState: { isSubmitting } } = formMethods

  const onSubmit: SubmitHandler<FormValues> = ({ name, makeCurrent }) =>
    createHousehold({
      variables: { name, makeCurrent },
      // Switching changes whose tasks and leftovers you see, and moves the "Current" badge
      refetchQueries: makeCurrent
        ? ["households", "currentUser", "timelineItems", "leftovers"]
        : ["households"],
    }).then(() => {
      toast.success(makeCurrent ? `Switched to ${name.trim()}` : `${name.trim()} created`)
      close()
    }).catch((error) =>
      toast.error(CombinedGraphQLErrors.is(error) ? error.message : "Couldn't create that household")
    )

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormInput
          label="Name"
          placeholder="The Beach House"
          fieldName="name"
          maxLength={100}
          errorMessage="Give it a name"
          validate={(value) => String(value ?? "").trim().length > 0 || "Give it a name"}
          required
        />
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-raised/60 p-3.5 transition-colors hover:border-muted/40">
          <input
            type="checkbox"
            {...register("makeCurrent")}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
          />
          <span>
            <span className="block text-sm font-medium text-ink">Switch to this household</span>
            <span className="block text-xs text-muted">
              Your timeline and leftovers will show this household's items.
            </span>
          </span>
        </label>
        <FormActions submitLabel="Create household" submitting={isSubmitting} />
      </form>
    </FormProvider>
  )
}

export default CreateHouseholdForm
