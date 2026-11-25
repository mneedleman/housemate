import { EnvelopeClosedIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { type To } from "react-router"
import type { MutationSignupArgs } from "src/__generated__/types"
import FormInput from "../forms/FormInput"
import Button from "../ui/Button"
import { useAuth } from "./AuthProvider"

type Props = {
  to: To
  toggleSignup: () => void
}
const SignupForm = ({ to, toggleSignup }: Props) => {
  const formMethods = useForm<MutationSignupArgs>()
  const { handleSubmit, formState: { isSubmitting } } = formMethods
  const { signup } = useAuth();

  const onSubmit: SubmitHandler<MutationSignupArgs> = (data) => signup(data, to)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
          label="Email"
          fieldName="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          icon={<EnvelopeClosedIcon />}
          errorMessage="Email is required"
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
          required
        />
        <Button type="submit" size="lg" block loading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <button type="button" onClick={toggleSignup} className="font-medium text-accent hover:underline">
          Log in
        </button>
      </p>
    </FormProvider>
  )
}

export default SignupForm
