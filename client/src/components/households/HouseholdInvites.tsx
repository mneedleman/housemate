import { CombinedGraphQLErrors } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { CancelInvitationDocument, InviteToHouseholdDocument } from "src/__generated__/types"
import { shortDate, toDate } from "src/utils/dateUtils"
import FormInput from "../forms/FormInput"
import Button from "../ui/Button"

export type PendingInvitation = { id: string, email: string, expiresAt: string }

type Props = {
  householdId: string
  pending: PendingInvitation[]
}

const errorMessage = (error: unknown, fallback: string) =>
  CombinedGraphQLErrors.is(error) ? error.message : fallback

/** Owner-only: invite by email, and see/resend/cancel invitations that haven't been accepted. */
const HouseholdInvites = ({ householdId, pending }: Props) => {
  const [invite] = useMutation(InviteToHouseholdDocument, { refetchQueries: ["households"] })
  const formMethods = useForm<{ email: string }>({ defaultValues: { email: "" } })
  const { handleSubmit, reset, formState: { isSubmitting } } = formMethods

  const send = (email: string) =>
    invite({ variables: { householdId, email } })
      .then(() => toast.success(`Invitation sent to ${email.trim().toLowerCase()}`))

  const onSubmit: SubmitHandler<{ email: string }> = ({ email }) =>
    send(email)
      .then(() => reset())
      .catch((e) => toast.error(errorMessage(e, "Couldn't send that invitation")))

  return (
    <div className="space-y-3 border-t border-line p-4">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2" noValidate>
          <div className="min-w-0 flex-1">
            <FormInput
              label="Invite someone"
              fieldName="email"
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="their@email.com"
              icon={<EnvelopeClosedIcon />}
              errorMessage="Enter an email address"
              pattern={{ value: /^\S+@\S+\.\S+$/, message: "That doesn't look like an email address" }}
              required
            />
          </div>
          {/* Lines the button up with the input (below the label) */}
          <Button type="submit" loading={isSubmitting} className="mt-[1.625rem] shrink-0">Send</Button>
        </form>
      </FormProvider>

      {pending.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Pending invitations</p>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {pending.map((invitation) => (
              <PendingRow key={invitation.id} householdId={householdId} invitation={invitation} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const PendingRow = ({ householdId, invitation }: { householdId: string, invitation: PendingInvitation }) => {
  const [cancel, { loading: canceling }] = useMutation(CancelInvitationDocument, {
    variables: { id: invitation.id },
    refetchQueries: ["households"],
  })
  // Re-inviting sends a fresh link and makes the old one stop working
  const [resend, { loading: resending }] = useMutation(InviteToHouseholdDocument, {
    variables: { householdId, email: invitation.email },
    refetchQueries: ["households"],
  })
  const expires = toDate(invitation.expiresAt)

  return (
    <li className="flex items-center gap-2 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{invitation.email}</p>
        {expires && <p className="text-xs text-muted">Expires {shortDate(expires)}</p>}
      </div>
      <Button
        variant="ghost"
        size="sm"
        loading={resending}
        onClick={() =>
          resend()
            .then(() => toast.success(`Sent a new invitation to ${invitation.email}`))
            .catch((e) => toast.error(errorMessage(e, "Couldn't resend that invitation")))
        }
      >
        Resend
      </Button>
      <Button
        variant="danger-ghost"
        size="sm"
        loading={canceling}
        onClick={() =>
          cancel()
            .then(() => toast.success(`Canceled the invitation to ${invitation.email}`))
            .catch((e) => toast.error(errorMessage(e, "Couldn't cancel that invitation")))
        }
      >
        Cancel
      </Button>
    </li>
  )
}

export default HouseholdInvites
