import { ChevronDownIcon } from "@radix-ui/react-icons";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import { cn } from "src/utils/cn";
import { FormInputProps } from "./FormInput";
import Error, { type ErrorProps } from "./Error"
import { descriptionClass as baseDescriptionClass, fieldClass } from "./fieldStyles";
import Label from "./Label";

export type FormSelectOption<T extends FieldValues,> = {
  label?: string
  value: PathValue<T, Path<T>>
}

export type FormSelectProps<T extends FieldValues,> = FormInputProps<T> & {
  options: FormSelectOption<T>[]
  multiple?: boolean
}

const FormSelect = <T extends FieldValues,>({
  fieldName,
  label,
  labelClass,
  inputClass,
  description,
  descriptionClass,
  containerClass,
  required,
  placeholder,
  errorField,
  errorMessage = "Required",
  errorClass,
  options,
  multiple
}: FormSelectProps<T>) => {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errorField ?? (errors[fieldName] as ErrorProps["errorField"])

  return (
    <div className={containerClass}>
      {label && <Label {...{ label, labelClass }} htmlFor={fieldName} />}
      {description && (
        <span className={cn(baseDescriptionClass, descriptionClass)}>{description}</span>
      )}
      <div className="relative">
        <select
          id={fieldName}
          {...register(fieldName, { required: required && errorMessage })}
          aria-invalid={error ? "true" : "false"}
          // `required` makes the empty placeholder match :invalid so it can be styled muted;
          // forms use noValidate, so the browser never shows its own popup
          required={required}
          className={cn(fieldClass, !multiple && "appearance-none pr-10", "invalid:text-muted/80", inputClass)}
          multiple={multiple}
        >
          <option value="" hidden>{placeholder ?? "Select…"}</option>
          {options.map(({ value, label: optionLabel }) => (
            <option key={value} value={value}>
              {optionLabel || value}
            </option>
          ))}
        </select>
        {!multiple && (
          <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
      </div>
      <Error {...{ errorField: error, errorClass, errorMessage }} />
    </div>
  )
}

export default FormSelect
