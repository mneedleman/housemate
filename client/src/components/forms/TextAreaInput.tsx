import { FieldValues, useFormContext } from "react-hook-form"
import { cn } from "src/utils/cn"
import { FormInputProps } from "./FormInput"
import Error, { type ErrorProps } from "./Error"
import { descriptionClass as baseDescriptionClass, fieldClass } from "./fieldStyles"
import Label from "./Label"

const TextAreaInput = <T extends FieldValues,>({
  fieldName,
  label,
  labelClass,
  description,
  descriptionClass,
  inputClass,
  containerClass,
  required,
  placeholder,
  errorField,
  errorMessage = "Required",
  errorClass,
}: FormInputProps<T>) => {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errorField ?? (errors[fieldName] as ErrorProps["errorField"])

  return (
    <div className={containerClass}>
      {label && <Label {...{ label, labelClass }} htmlFor={fieldName} />}
      {description && (
        <span className={cn(baseDescriptionClass, descriptionClass)}>{description}</span>
      )}
      <textarea
        id={fieldName}
        rows={3}
        {...register(fieldName, { required: required && errorMessage })}
        aria-invalid={error ? "true" : "false"}
        placeholder={placeholder}
        className={cn(fieldClass, "h-auto min-h-24 resize-y py-3 leading-relaxed", inputClass)}
      />
      <Error {...{ errorField: error, errorClass, errorMessage }} />
    </div>
  )
}

export default TextAreaInput
