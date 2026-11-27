import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form"
import { To } from "react-router";
import { LoginMutationVariables } from "src/__generated__/types";
import FormInput from "../forms/FormInput";
import Button from "../ui/Button";
import { useAuth } from "./AuthProvider";

// Prefilled seed credentials are a dev-only convenience
const defaultValues = import.meta.env.DEV
  ? { email: "test@example.com", password: "password" }
  : undefined

type Props = {
  to: To,
  toggleSignup: () => void
}
const LoginForm = ({ to, toggleSignup }: Props) => {
  const formMethods = useForm<LoginMutationVariables>({ defaultValues })
  const { handleSubmit, formState: { isSubmitting } } = formMethods
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginMutationVariables> = (data) => login(data, to)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormInput
          fieldName="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          icon={<EnvelopeClosedIcon />}
          errorMessage="Enter your email"
          required
        />
        <FormInput
          fieldName="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<LockClosedIcon />}
          errorMessage="Enter your password"
          required
        />
        <Button type="submit" size="lg" block loading={isSubmitting} className="mt-2">
          Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <button type="button" onClick={toggleSignup} className="font-medium text-accent hover:underline">
          Create an account
        </button>
      </p>
    </FormProvider>
  )
}

export default LoginForm
