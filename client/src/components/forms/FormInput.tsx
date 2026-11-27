import type { HTMLInputTypeAttribute, InputHTMLAttributes, JSX } from "react"
import { type FieldValue, type FieldValues, type Path, useFormContext, type Validate, type ValidationRule } from "react-hook-form"
import { cn } from "src/utils/cn"
import { useMinDate } from "src/utils/dateUtils"
import Error, { type ErrorProps } from "./Error"
import { descriptionClass as baseDescriptionClass, fieldClass } from "./fieldStyles"
import Label, { type LabelProps } from "./Label"

export type InputBaseAttr = InputHTMLAttributes<HTMLInputTypeAttribute>

type MaxLengthValue = InputBaseAttr["maxLength"]
type MaxValue = InputBaseAttr["max"]
type MinValue = InputBaseAttr["min"]
const useMin = (min: MinValue, type: HTMLInputTypeAttribute | undefined, allowPast?: boolean) => {
  const today = useMinDate()

  if (!type || allowPast) return undefined
  if (min) return min

  switch (type) {
    case "date": {
      return today
    }
  }
}

export type FormInputProps<T extends FieldValues> =
  LabelProps & ErrorProps & {
    description?: string
    descriptionClass?: string
    containerClass?: string
    fieldName: Path<T>
    inputClass?: string
    inputContainerClass?: string
    required?: boolean
    placeholder?: string
    type?: HTMLInputTypeAttribute
    min?: MinValue
    max?: MaxValue
    maxLength?: MaxLengthValue
    step?: InputBaseAttr["step"]
    validate?: Validate<FieldValue<T>, FieldValues>
    pattern?: ValidationRule<RegExp>
    icon?: JSX.Element
    autoComplete?: string
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"]
    /** Date inputs default to min=today; set this for dates in the past (e.g. "last done") */
    allowPast?: boolean
  }

const FormInput = <T extends FieldValues,>({
  containerClass,
  fieldName,
  label,
  labelClass,
  description,
  descriptionClass,
  inputClass,
  required,
  placeholder,
  errorField,
  errorMessage = "Required",
  errorClass,
  validate,
  pattern,
  type,
  min,
  max,
  maxLength,
  step,
  errorSpaceClass,
  icon,
  inputContainerClass,
  autoComplete,
  inputMode,
  allowPast,
}: FormInputProps<T>) => {
  const minValue = useMin(min, type, allowPast)

  const { register, formState: { errors } } = useFormContext<T>()
  // Fall back to the form's own error state so callers don't have to thread it through
  const error = errorField ?? (errors[fieldName] as ErrorProps["errorField"])

  const input = (
    <input
      id={fieldName}
      type={type}
      {...register(fieldName, {
        required: required && errorMessage,
        // GraphQL Int arguments reject numeric strings, and empty → undefined rather than NaN
        setValueAs: type === "number" ? (v) => (v === "" || v == null ? undefined : Number(v)) : undefined,
        validate,
        pattern,
      })}
      aria-invalid={error ? "true" : "false"}
      className={cn(fieldClass, icon && "pl-10", inputClass)}
      min={minValue}
      {...{ placeholder, max, maxLength, step, autoComplete, inputMode }}
    />
  )

  return (
    <div className={containerClass}>
      {label && <Label {...{ label, labelClass }} htmlFor={fieldName} />}
      {description && (
        <span className={cn(baseDescriptionClass, descriptionClass)}>{description}</span>
      )}
      {icon ? (
        <div className={cn("relative", inputContainerClass)}>
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
          {input}
        </div>
      ) : input}
      <Error {...{ errorField: error, errorClass, errorMessage, errorSpaceClass }} />
    </div>
  )
}

export default FormInput;
