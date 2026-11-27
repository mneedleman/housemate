import { useModal } from "../modal/Modal"
import Button from "../ui/Button"

type Props = {
  submitLabel: string
  submitting?: boolean
  variant?: "primary" | "danger"
  onSubmit?: () => void
}

/** Cancel + submit row: full-width halves on phones, right-aligned from `sm`. */
const FormActions = ({ submitLabel, submitting, variant = "primary", onSubmit }: Props) => {
  const { close } = useModal()

  return (
    <div className="mt-2 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
      <Button variant="secondary" onClick={close}>Cancel</Button>
      <Button
        type={onSubmit ? "button" : "submit"}
        variant={variant}
        loading={submitting}
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
    </div>
  )
}

export default FormActions
