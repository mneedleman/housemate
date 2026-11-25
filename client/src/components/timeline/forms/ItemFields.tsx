import { FieldValues } from "react-hook-form";
import FormInput from "src/components/forms/FormInput";
import FormSelect, { FormSelectOption } from "src/components/forms/FormSelect";
import TextAreaInput from "src/components/forms/TextAreaInput";
import { useMinDate } from "src/utils/dateUtils";

export const UNIT_OPTIONS: FormSelectOption<FieldValues>[] = [
  { value: "days", label: "Day(s)" },
  { value: "weeks", label: "Week(s)" },
  { value: "months", label: "Month(s)" }
]

/** Fields shared by the create and edit task forms. */
const ItemFields = () => {
  const today = useMinDate()

  return (
    <>
      <FormInput
        label="Title"
        placeholder="Take out the recycling"
        fieldName="title"
        errorMessage="Give it a title"
        required
      />
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Repeats every</legend>
        <div className="grid grid-cols-[6.5rem_1fr] gap-3">
          <FormInput
            placeholder="1"
            fieldName="frequencyValue"
            type="number"
            inputMode="numeric"
            min={1}
            errorMessage="Required"
            required
          />
          <FormSelect
            placeholder="Choose unit"
            fieldName="frequencyUnit"
            options={UNIT_OPTIONS}
            errorMessage="Pick a unit"
            required
          />
        </div>
      </fieldset>
      <FormInput
        label="Last done"
        description="Optional. Sets when it's next due."
        fieldName="lastCompletedAt"
        type="date"
        allowPast
        max={today}
      />
      <TextAreaInput
        label="Notes"
        placeholder="Anything worth remembering"
        fieldName="body"
      />
    </>
  )
}

export default ItemFields
