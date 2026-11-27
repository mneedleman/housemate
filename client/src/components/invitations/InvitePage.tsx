import { CombinedGraphQLErrors } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import { CrossCircledIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import {
  AcceptInvitationDocument,
  InvitationDocument,
  LoginDocument,
  SignupDocument,
  type InvitationQuery,
} from "src/__generated__/types"
import AuthLayout from "../auth/AuthLayout"
import { useAuth } from "../auth/AuthProvider"
import FormInput from "../forms/FormInput"
import Button from "../ui/Button"

type Invitation = NonNullable<InvitationQuery["invitation"]>

// Everything household-scoped changes once you've joined
const AFTER_JOIN = ["currentUser", "households", "timelineItems", "leftovers"]

const errorMessage = (error: unknown, fallback: string) =>
  CombinedGraphQLErrors.is(error) ? error.message : fallback

const closedMessages: Record<string, string> = {
  accepted: "This invitation has already been used.",
  canceled: "This invitation was canceled.",
  expired: "This invitation has expired. Ask whoever invited you to send a new one.",
}

/** Where an emailed invitation link lands: sign up, log in, or accept, then join the household. */
const InvitePage = () => {
  const { token = "" } = useParams()
  const { data, loading } = useQuery(InvitationDocument, { variables: { token } })
  const invitation = data?.invitation

  if (loading && !data) {
    return <AuthLayout title="Loading invitation…" />
  }

  if (!invitation || invitation.status !== "pending") {
    return (
      <AuthLayout
        title="This invitation can't be used"
        subtitle={invitation ? closedMessages[invitation.status] : "The link isn't valid. Check you copied all of it."}
      >
        <Closed />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={`Join ${invitation.householdName}`}
      subtitle={<>{invitation.inviterName} invited <span className="font-medium text-ink">{invitation.email}</span> to share chores and leftovers.</>}
    >
      <Pending invitation={invitation} token={token} />
    </AuthLayout>
  )
}

const Closed = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  return (
    <div className="flex flex-col items-start gap-4">
      <CrossCircledIcon className="h-8 w-8 text-muted" aria-hidden />
      <Button variant="secondary" onClick={() => navigate(token ? "/dashboard" : "/login")}>
        {token ? "Go to your dashboard" : "Go to log in"}
      </Button>
    </div>
  )
}

type PendingProps = { invitation: Invitation, token: string }

const Pending = ({ invitation, token }: PendingProps) => {
  const { token: sessionToken, currentUser } = useAuth()

  if (sessionToken) {
    // Wait for the current user so we know whether the emails match
    if (!currentUser) return null
    return currentUser.email === invitation.email
      ? <AcceptAsCurrentUser invitation={invitation} token={token} />
      : <WrongAccount invitation={invitation} token={token} signedInAs={currentUser.email} />
  }

  return invitation.accountExists
    ? <LogInAndAccept invitation={invitation} token={token} />
    : <SignUpAndAccept invitation={invitation} token={token} />
}

const useJoined = (householdName: string) => {
  const navigate = useNavigate()
  return () => {
    toast.success(`Welcome to ${householdName}!`)
    navigate("/dashboard")
  }
}

const AcceptAsCurrentUser = ({ invitation, token }: PendingProps) => {
  const [accept, { loading }] = useMutation(AcceptInvitationDocument, { variables: { token }, refetchQueries: AFTER_JOIN })
  const joined = useJoined(invitation.householdName)

  return (
    <Button
      block
      size="lg"
      loading={loading}
      onClick={() => accept().then(joined).catch((e) => toast.error(errorMessage(e, "Couldn't accept the invitation")))}
    >
      Join {invitation.householdName}
    </Button>
  )
}

const WrongAccount = ({ invitation, token, signedInAs }: PendingProps & { signedInAs: string }) => {
  const { logout } = useAuth()
  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-warn-soft p-4 text-sm text-warn">
        You're logged in as <span className="font-medium">{signedInAs}</span>, but this invitation is for{" "}
        <span className="font-medium">{invitation.email}</span>.
      </p>
      <Button block variant="secondary" onClick={() => logout(`/invite/${token}`)}>
        Log out and continue as {invitation.email}
      </Button>
    </div>
  )
}

type SignupValues = { name: string, password: string }

const SignUpAndAccept = ({ invitation, token }: PendingProps) => {
  const [signup] = useMutation(SignupDocument)
  const { startSession } = useAuth()
  const joined = useJoined(invitation.householdName)
  const formMethods = useForm<SignupValues>()
  const { handleSubmit, formState: { isSubmitting } } = formMethods

  // The server joins the household as part of signup
  const onSubmit: SubmitHandler<SignupValues> = ({ name, password }) =>
    signup({ variables: { name, password, email: invitation.email, invitationToken: token } })
      .then((res) => {
        const value = res.data?.signup?.token
        if (!value) throw new Error("No token")
        startSession(value)
        joined()
      })
      .catch((e) => toast.error(errorMessage(e, "Couldn't create your account")))

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <p className="text-sm text-muted">Create an account to join. You'll sign in with this email address.</p>
        <FormInput
          label="Name"
          fieldName="name"
          autoComplete="name"
          placeholder="Alex Rivera"
          icon={<PersonIcon />}
          errorMessage="Tell us what to call you"
          required
        />
        <FormInput
          label="Password"
          fieldName="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          icon={<LockClosedIcon />}
          errorMessage="Password is required"
          validate={(value) => String(value ?? "").length >= 8 || "Use at least 8 characters"}
          required
        />
        <Button type="submit" size="lg" block loading={isSubmitting} className="mt-2">
          Create account and join
        </Button>
      </form>
    </FormProvider>
  )
}

type LoginValues = { password: string }

const LogInAndAccept = ({ invitation, token }: PendingProps) => {
  const [login] = useMutation(LoginDocument)
  const [accept] = useMutation(AcceptInvitationDocument, { refetchQueries: AFTER_JOIN })
  const { startSession } = useAuth()
  const joined = useJoined(invitation.householdName)
  const formMethods = useForm<LoginValues>()
  const { handleSubmit, formState: { isSubmitting } } = formMethods

  const onSubmit: SubmitHandler<LoginValues> = ({ password }) =>
    login({ variables: { email: invitation.email, password } })
      .then(async (res) => {
        const value = res.data?.login?.token
        if (!value) {
          toast.error("That password didn't match")
          return
        }
        // Stores the token before accepting, so the accept request is authenticated
        startSession(value)
        await accept({ variables: { token } })
        joined()
      })
      .catch((e) => toast.error(errorMessage(e, "Couldn't accept the invitation")))

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <p className="text-sm text-muted">You already have an account. Log in to join.</p>
        <FormInput
          label="Password"
          fieldName="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<LockClosedIcon />}
          errorMessage="Enter your password"
          required
        />
        <Button type="submit" size="lg" block loading={isSubmitting} className="mt-2">
          Log in and join
        </Button>
      </form>
    </FormProvider>
  )
}

export default InvitePage
