import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { type FieldError } from "react-hook-form"
import { cn } from "src/utils/cn"

export type ErrorProps = {
  errorField?: FieldError | undefined
  errorClass?: string
  errorMessage?: string
  errorSpaceClass?: string
}

const Error = ({
  errorField,
  errorClass,
  errorMessage = "Required",
  errorSpaceClass,
}: ErrorProps) => {
  if (!errorField) {
    return errorSpaceClass ? <div className={errorSpaceClass} /> : null
  }

  return (
    <p role="alert" className={cn("mt-1.5 flex items-center gap-1.5 text-sm text-danger", errorClass)}>
      <ExclamationTriangleIcon className="h-3.5 w-3.5 shrink-0" />
      {errorField.message || errorMessage}
    </p>
  )
}
export default Error
